import { selectTopOrderedSolutions } from "../utils/solutionMapper";
import { buildApiPath, getApiBaseUrl } from "./apiConfig";

export const getUsecasesApiBaseUrl = () => getApiBaseUrl();

export const fetchAllUseCases = async () => {
  const response = await fetch(buildApiPath("get-usecases"));
  const result = await response.json();

  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to fetch solutions");
  }

  return result.data;
};

export const fetchTopOrderedSolutions = async (limit = 8) => {
  const data = await fetchAllUseCases();
  return selectTopOrderedSolutions(data, limit);
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

export const updateUseCaseStatus = async (solution, isActive) => {
  const formData = new FormData();
  const publishValue = isActive ? "Yes" : "No";

  formData.append("ID", solution.ID);
  formData.append("Title", solution.Title || "");
  formData.append("BusinessDomain", solution.BusinessDomain || "");
  formData.append("OwnershipDetails", solution.OwnershipDetails || "");
  formData.append("AiEvangelists", solution.AiEvangelists || "");
  formData.append("SolutionContext", solution.SolutionContext || "");
  formData.append("TechHighlights", solution.TechHighlights || "");
  formData.append("RepositoryUrl", solution.RepositoryUrl || "");
  formData.append("DemoLink", solution.DemoLink || "");
  formData.append("AiFoundation", solution.AiFoundation || solution.Client || "");
  formData.append("Client", solution.Client || solution.AiFoundation || "");
  formData.append("Publish", publishValue);
  formData.append("PublicationStatus", isActive ? "Published" : "Draft");
  formData.append("IsSolutionActive", isActive ? "true" : "false");

  const response = await fetch(buildApiPath("update-usecase"), {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to update solution status.");
  }

  return result.data || { ...solution, IsSolutionActive: isActive, Publish: publishValue };
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
