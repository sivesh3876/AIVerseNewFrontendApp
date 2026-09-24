import { buildApiPath } from "./apiConfig";
import { getAdminAuthHeaders } from "./adminApiHeaders";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const fetchCertifications = async ({ includeUnpublished = false } = {}) => {
  const response = await fetch(
    buildApiPath(
      "get-certifications",
      includeUnpublished ? { include_unpublished: "true" } : {},
    ),
    { headers: getAdminAuthHeaders() },
  );
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to fetch certifications");
  }
  return result.data;
};

export const createCertification = async (payload = {}) => {
  const response = await fetch(buildApiPath("save-certification"), {
    method: "POST",
    headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success" || !result.data) {
    throw new Error(result.message || "Failed to create certification");
  }
  return result.data;
};

export const updateCertification = async (payload = {}) => {
  const response = await fetch(buildApiPath("update-certification"), {
    method: "POST",
    headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success" || !result.data) {
    throw new Error(result.message || "Failed to update certification");
  }
  return result.data;
};

export const deleteCertification = async (certificationId) => {
  const response = await fetch(
    buildApiPath("delete-certification", { id: certificationId }),
    { method: "DELETE", headers: getAdminAuthHeaders() },
  );
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to delete certification");
  }
  return result.data;
};

export const fetchCertifiedProfessionals = async ({ certificationId } = {}) => {
  const response = await fetch(
    buildApiPath(
      "get-certified-professionals",
      certificationId ? { certification_id: certificationId } : {},
    ),
  );
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to fetch certified professionals");
  }
  return result.data;
};

export const createCertifiedProfessional = async (payload = {}) => {
  const response = await fetch(buildApiPath("save-certified-professional"), {
    method: "POST",
    headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success" || !result.data) {
    throw new Error(result.message || "Failed to create certified professional");
  }
  return result.data;
};

export const updateCertifiedProfessional = async (payload = {}) => {
  const response = await fetch(buildApiPath("update-certified-professional"), {
    method: "POST",
    headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success" || !result.data) {
    throw new Error(result.message || "Failed to update certified professional");
  }
  return result.data;
};

export const deleteCertifiedProfessional = async (professionalId) => {
  const response = await fetch(
    buildApiPath("delete-certified-professional", { id: professionalId }),
    { method: "DELETE", headers: getAdminAuthHeaders() },
  );
  const result = await parseJson(response);
  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to delete certified professional");
  }
  return result.data;
};
