import {
  FEATURED_CARD_POSITION_MAX,
  HERO_CARD_POSITION_MAX,
  getSolutionDisplayOrder,
  getSolutionOrderNumber,
  selectTopHeroSolutions,
  selectTopOrderedSolutions,
} from "../utils/solutionMapper";
import { applyInactiveSolutionOverrides } from "../utils/solutionStatusStorage";
import { buildApiPath, getApiBaseUrl } from "./apiConfig";

export const getUsecasesApiBaseUrl = () => getApiBaseUrl();

export const fetchAllUseCases = async ({ includeInactive = false } = {}) => {
  const response = await fetch(
    buildApiPath(
      "get-usecases",
      includeInactive ? { include_inactive: "true" } : {},
    ),
  );
  const result = await response.json();

  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to fetch solutions");
  }

  return applyInactiveSolutionOverrides(result.data);
};

export const fetchTopOrderedSolutions = async (
  limit = FEATURED_CARD_POSITION_MAX,
) => {
  const data = await fetchAllUseCases();
  return selectTopOrderedSolutions(data, limit);
};

export const fetchTopHeroSolutions = async (limit = HERO_CARD_POSITION_MAX) => {
  const data = await fetchAllUseCases();
  return selectTopHeroSolutions(data, limit);
};

export const fetchUseCaseById = async (solutionId) => {
  const response = await fetch(
    buildApiPath("get-usecases", { id: solutionId }),
  );
  const result = await response.json();

  if (
    !response.ok ||
    result.status !== "success" ||
    !result.data
  ) {
    throw new Error(result.message || "Solution not found");
  }

  return result.data;
};

const toFormText = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value == null ? "" : String(value);
};

const toOtherDocumentsRetain = (value) => {
  if (Array.isArray(value)) {
    return value.map((url) => String(url).trim()).filter(Boolean).join(",");
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean)
      .join(",");
  }
  return "";
};

const appendOtherDocumentsRetain = (formData, solution) => {
  formData.append(
    "OtherDocumentsRetain",
    toOtherDocumentsRetain(solution?.OtherDocuments),
  );
};

export const updateUseCaseStatus = async (solution, isActive) => {
  const formData = new FormData();
  const publishValue = isActive ? "Yes" : "No";
  const toText = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean).join(", ");
    return value == null ? "" : String(value);
  };

  formData.append("ID", solution.ID);
  formData.append("Title", solution.Title || "");
  formData.append("BusinessDomain", solution.BusinessDomain || "");
  formData.append("OwnershipDetails", solution.OwnershipDetails || "");
  formData.append("AiEvangelists", toText(solution.AiEvangelists));
  formData.append("SolutionContext", solution.SolutionContext || "");
  formData.append("TechHighlights", solution.TechHighlights || "");
  formData.append("RepositoryUrl", solution.RepositoryUrl || "");
  formData.append("DemoLink", solution.DemoLink || "");
  formData.append(
    "AiFoundation",
    toText(solution.AiFoundation || solution.Client),
  );
  formData.append(
    "Client",
    toText(solution.Client || solution.AiFoundation),
  );
  formData.append("Publish", publishValue);
  formData.append("PublicationStatus", isActive ? "Published" : "Draft");
  formData.append("IsSolutionActive", isActive ? "true" : "false");
  appendOtherDocumentsRetain(formData, solution);

  const response = await fetch(buildApiPath("update-usecase"), {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to update solution status.");
  }

  return (
    result.data || {
      ...solution,
      IsSolutionActive: isActive,
      Publish: publishValue,
      PublicationStatus: isActive ? "Published" : "Draft",
    }
  );
};

const appendSolutionBaseFields = (formData, solution) => {
  const publishValue =
    solution.Publish ||
    solution.publish ||
    (solution.IsSolutionActive === false ? "No" : "Yes");
  const isPublished = String(publishValue).trim().toLowerCase() === "yes";

  formData.append("ID", solution.ID);
  formData.append("Title", solution.Title || "");
  formData.append("BusinessDomain", solution.BusinessDomain || "");
  formData.append("OwnershipDetails", solution.OwnershipDetails || "");
  formData.append("AiEvangelists", toFormText(solution.AiEvangelists));
  formData.append("SolutionContext", solution.SolutionContext || "");
  formData.append("TechHighlights", solution.TechHighlights || "");
  formData.append("RepositoryUrl", solution.RepositoryUrl || "");
  formData.append("DemoLink", solution.DemoLink || "");
  formData.append(
    "AiFoundation",
    toFormText(solution.AiFoundation || solution.Client),
  );
  formData.append(
    "Client",
    toFormText(solution.Client || solution.AiFoundation),
  );
  formData.append("Publish", isPublished ? "Yes" : "No");
  formData.append(
    "PublicationStatus",
    solution.PublicationStatus ||
      (isPublished ? "Published" : "Draft"),
  );
  formData.append(
    "IsSolutionActive",
    isPublished || solution.IsSolutionActive === true ? "true" : "false",
  );
  appendOtherDocumentsRetain(formData, solution);
};

const toPersistedOrder = (value) => {
  if (value == null || value === "") return "0";
  return String(value);
};

/**
 * Updates OrderNumber while preserving DisplayOrder (hero slot).
 */
const persistUseCaseOrderNumber = async (solution, orderNumber) => {
  if (!solution?.ID) {
    throw new Error("Solution ID is required to update card position.");
  }

  const parsed =
    orderNumber == null || orderNumber === ""
      ? null
      : Number(orderNumber);

  if (
    parsed != null &&
    (!Number.isFinite(parsed) ||
      parsed < 1 ||
      parsed > FEATURED_CARD_POSITION_MAX)
  ) {
    throw new Error(
      `Card position must be between 1 and ${FEATURED_CARD_POSITION_MAX}.`,
    );
  }

  const heroOrder = getSolutionDisplayOrder(solution);
  const formData = new FormData();
  appendSolutionBaseFields(formData, solution);
  formData.append("OrderNumber", toPersistedOrder(parsed));
  formData.append("DisplayOrder", toPersistedOrder(heroOrder));

  const response = await fetch(buildApiPath("update-usecase"), {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to update card position.");
  }

  return (
    result.data || {
      ...solution,
      OrderNumber: parsed,
      DisplayOrder: heroOrder,
    }
  );
};

/**
 * Updates DisplayOrder (hero top-4) while preserving OrderNumber (featured).
 */
const persistUseCaseDisplayOrder = async (solution, displayOrder) => {
  if (!solution?.ID) {
    throw new Error("Solution ID is required to update top 4 card position.");
  }

  const parsed =
    displayOrder == null || displayOrder === ""
      ? null
      : Number(displayOrder);

  if (
    parsed != null &&
    (!Number.isFinite(parsed) ||
      parsed < 1 ||
      parsed > HERO_CARD_POSITION_MAX)
  ) {
    throw new Error(
      `Top 4 card position must be between 1 and ${HERO_CARD_POSITION_MAX}.`,
    );
  }

  const featuredOrder = getSolutionOrderNumber(solution);
  const formData = new FormData();
  appendSolutionBaseFields(formData, solution);
  formData.append("OrderNumber", toPersistedOrder(featuredOrder));
  formData.append("DisplayOrder", toPersistedOrder(parsed));

  const response = await fetch(buildApiPath("update-usecase"), {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to update top 4 card position.");
  }

  return (
    result.data || {
      ...solution,
      OrderNumber: featuredOrder,
      DisplayOrder: parsed,
    }
  );
};

/**
 * Clears any other solution currently holding this Featured slot (1–9).
 */
export const claimFeaturedCardPosition = async ({
  orderNumber,
  excludeSolutionId = null,
} = {}) => {
  const parsed = Number(orderNumber);
  if (
    !Number.isFinite(parsed) ||
    parsed < 1 ||
    parsed > FEATURED_CARD_POSITION_MAX
  ) {
    return [];
  }

  const solutions = await fetchAllUseCases({ includeInactive: true });
  const occupants = solutions.filter((solution) => {
    const order = getSolutionOrderNumber(solution);
    if (order !== parsed) {
      return false;
    }
    if (
      excludeSolutionId != null &&
      String(solution.ID) === String(excludeSolutionId)
    ) {
      return false;
    }
    return true;
  });

  const cleared = [];
  for (const occupant of occupants) {
    await persistUseCaseOrderNumber(occupant, null);
    cleared.push(occupant);
  }

  return cleared;
};

/**
 * Clears any other solution currently holding this hero Top 4 slot (1–4).
 */
export const claimHeroCardPosition = async ({
  displayOrder,
  excludeSolutionId = null,
} = {}) => {
  const parsed = Number(displayOrder);
  if (
    !Number.isFinite(parsed) ||
    parsed < 1 ||
    parsed > HERO_CARD_POSITION_MAX
  ) {
    return [];
  }

  const solutions = await fetchAllUseCases({ includeInactive: true });
  const occupants = solutions.filter((solution) => {
    const order = getSolutionDisplayOrder(solution);
    if (order !== parsed) {
      return false;
    }
    if (
      excludeSolutionId != null &&
      String(solution.ID) === String(excludeSolutionId)
    ) {
      return false;
    }
    return true;
  });

  const cleared = [];
  for (const occupant of occupants) {
    await persistUseCaseDisplayOrder(occupant, null);
    cleared.push(occupant);
  }

  return cleared;
};

/**
 * Map of featured slot → { id, title } for admin dropdown labels.
 */
export const getFeaturedPositionOccupancy = async () => {
  const solutions = await fetchAllUseCases({ includeInactive: true });
  const occupancy = {};

  solutions.forEach((solution) => {
    const order = getSolutionOrderNumber(solution);
    if (
      !Number.isFinite(order) ||
      order < 1 ||
      order > FEATURED_CARD_POSITION_MAX
    ) {
      return;
    }
    occupancy[order] = {
      id: solution.ID,
      title: solution.Title || "Untitled Solution",
    };
  });

  return occupancy;
};

/**
 * Sets Featured Solutions card position (1–9). Pass null/"" to clear (stored as 0).
 * Claiming a slot clears any previous occupant first.
 */
export const updateUseCaseOrderNumber = async (solution, orderNumber) => {
  if (!solution?.ID) {
    throw new Error("Solution ID is required to update card position.");
  }

  const parsed =
    orderNumber == null || orderNumber === ""
      ? null
      : Number(orderNumber);

  if (
    parsed != null &&
    (!Number.isFinite(parsed) ||
      parsed < 1 ||
      parsed > FEATURED_CARD_POSITION_MAX)
  ) {
    throw new Error(
      `Card position must be between 1 and ${FEATURED_CARD_POSITION_MAX}.`,
    );
  }

  if (parsed != null) {
    await claimFeaturedCardPosition({
      orderNumber: parsed,
      excludeSolutionId: solution.ID,
    });
  }

  return persistUseCaseOrderNumber(solution, orderNumber);
};

export const deleteUseCase = async (solutionId) => {
  const url = buildApiPath("delete-usecase", { id: solutionId });

  const parseResponse = async (response) => {
    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }
    return { response, result };
  };

  const attemptDelete = async (method) => {
    const { response, result } = await parseResponse(
      await fetch(url, { method }),
    );
    return { response, result };
  };

  let { response, result } = await attemptDelete("POST");

  if (response.status === 405) {
    ({ response, result } = await attemptDelete("DELETE"));
  }

  if (response.ok && result.status === "success") {
    return { success: true, message: result.message || "Solution deleted successfully." };
  }

  if (response.status === 404) {
    return {
      success: true,
      message: result.message || "Solution was already removed from the server.",
    };
  }

  throw new Error(result.message || "Failed to delete solution from server.");
};
