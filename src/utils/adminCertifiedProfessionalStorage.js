import {
  createCertifiedProfessional as createProfessionalApi,
  deleteCertifiedProfessional as deleteProfessionalApi,
  fetchCertifiedProfessionals,
  updateCertifiedProfessional as updateProfessionalApi,
} from "../services/certificationsApiService";

export const CERTIFIED_PROFESSIONAL_STATUSES = ["Published", "Draft"];
export const CERTIFIED_PROFESSIONALS_CHANGED_EVENT =
  "aiVerseCertifiedProfessionalsChanged";

const STORAGE_KEY = "aiVerseAdminCertifiedProfessionals";

/** In-memory cache of professionals from production API. */
let apiProfessionalsCache = [];

const DEFAULT_STORAGE = {
  records: {},
};

const SEED_PROFESSIONALS = {
  "cert-ai-900": [
    {
      id: "prof-seed-ai900-1",
      certificationId: "cert-ai-900",
      employeeName: "Ananya Sharma",
      employeeId: "EMP-1001",
      designation: "AI Solutions Engineer",
      department: "Digital Transformation",
      officeLocation: "Noida, India",
      email: "ananya.sharma@espire.com",
      profilePhoto: "",
      certificationName: "AI-901: Azure AI Fundamentals",
      provider: "Microsoft",
      completionDate: "12 June 2026",
      completionAt: "2026-06-12T00:00:00.000Z",
      expiryDate: "12 June 2027",
      credentialId: "MS-AI901-ANANYA",
      examScore: "870",
      score: "870",
      percentage: "87%",
      certificatePdf: "",
      certificateFileName: "",
      certificateVerificationUrl: "",
      certificateUrl: "",
      linkedInUrl: "",
      status: "Published",
    },
    {
      id: "prof-seed-ai900-2",
      certificationId: "cert-ai-900",
      employeeName: "Rahul Mehta",
      employeeId: "EMP-1002",
      designation: "Cloud AI Consultant",
      department: "Microsoft Practice",
      officeLocation: "Gurugram, India",
      email: "rahul.mehta@espire.com",
      profilePhoto: "",
      certificationName: "AI-901: Azure AI Fundamentals",
      provider: "Microsoft",
      completionDate: "28 May 2026",
      completionAt: "2026-05-28T00:00:00.000Z",
      expiryDate: "28 May 2027",
      credentialId: "MS-AI901-RAHUL",
      examScore: "910",
      score: "910",
      percentage: "91%",
      certificatePdf: "",
      certificateFileName: "",
      certificateVerificationUrl: "",
      certificateUrl: "",
      linkedInUrl: "",
      status: "Published",
    },
  ],
};

const LEGACY_STATUS_MAP = {
  Certified: "Published",
  Pending: "Draft",
  Expired: "Draft",
  Inactive: "Draft",
};

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORAGE };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_STORAGE };

    return {
      records:
        parsed.records && typeof parsed.records === "object"
          ? parsed.records
          : {},
    };
  } catch {
    return { ...DEFAULT_STORAGE };
  }
};

const writeStorage = (storage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  window.dispatchEvent(new Event(CERTIFIED_PROFESSIONALS_CHANGED_EVENT));
};

const formatDateLabel = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const parseDateAt = (dateLabel = "") => {
  const parsed = new Date(dateLabel);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

export const normalizeProfessionalStatus = (status) => {
  const mapped = LEGACY_STATUS_MAP[status] || status;
  return CERTIFIED_PROFESSIONAL_STATUSES.includes(mapped) ? mapped : "Draft";
};

const normalizeProfessionalPayload = (payload = {}) => {
  const examScore = String(payload.examScore ?? payload.score ?? "").trim();
  const certificateVerificationUrl = String(
    payload.certificateVerificationUrl || payload.certificateUrl || "",
  ).trim();

  return {
    employeeName: String(payload.employeeName || "").trim(),
    employeeId: String(payload.employeeId || "").trim(),
    designation: String(payload.designation || "").trim(),
    department: String(payload.department || "").trim(),
    officeLocation: String(payload.officeLocation || "").trim(),
    email: String(payload.email || "").trim(),
    profilePhoto: String(payload.profilePhoto || ""),
    certificationName: String(payload.certificationName || "").trim(),
    provider: String(payload.provider || "").trim(),
    completionDate:
      payload.completionDate || formatDateLabel(new Date().toISOString()),
    completionAt:
      parseDateAt(payload.completionDate) || new Date().toISOString(),
    expiryDate: payload.expiryDate ? String(payload.expiryDate).trim() : "",
    credentialId: String(payload.credentialId || "").trim(),
    examScore,
    score: examScore,
    percentage: String(payload.percentage ?? "").trim(),
  certificatePdf: String(payload.certificatePdf || ""),
  certificateFileName: String(payload.certificateFileName || "").trim(),
  certificateVerificationUrl,
    certificateUrl: certificateVerificationUrl,
    linkedInUrl: String(payload.linkedInUrl || "").trim(),
    status: normalizeProfessionalStatus(payload.status),
  };
};

const normalizeStoredProfessional = (record = {}) => {
  const normalized = normalizeProfessionalPayload(record);
  return {
    ...record,
    ...normalized,
    id: record.id,
    certificationId: record.certificationId,
    certificateFileName: record.certificateFileName || normalized.certificateFileName || "",
  };
};

const normalizeApiProfessional = (pro = {}) =>
  normalizeStoredProfessional({
    ...pro,
    id: pro.id || (pro.apiId != null ? `prof-${pro.apiId}` : `prof-${Date.now()}`),
    apiId: pro.apiId ?? null,
    seedKey: pro.seedKey || null,
    certificationId: pro.certificationId || "",
  });

const toApiProfessionalPayload = (certificationId, normalized, extra = {}) => ({
  certificationId,
  employeeName: normalized.employeeName,
  employeeId: normalized.employeeId,
  designation: normalized.designation,
  department: normalized.department,
  officeLocation: normalized.officeLocation,
  email: normalized.email,
  profilePhoto: normalized.profilePhoto,
  certificationName: normalized.certificationName,
  provider: normalized.provider,
  completionDate: normalized.completionDate,
  completionAt: normalized.completionAt,
  expiryDate: normalized.expiryDate,
  credentialId: normalized.credentialId,
  examScore: normalized.examScore,
  percentage: normalized.percentage,
  certificatePdf: normalized.certificatePdf,
  certificateFileName: normalized.certificateFileName,
  certificateVerificationUrl: normalized.certificateVerificationUrl,
  certificateUrl: normalized.certificateUrl,
  linkedInUrl: normalized.linkedInUrl,
  status: normalized.status,
  ...extra,
});

export const refreshCertifiedProfessionalsFromApi = async () => {
  const data = await fetchCertifiedProfessionals();
  apiProfessionalsCache = data.map(normalizeApiProfessional);
  window.dispatchEvent(new Event(CERTIFIED_PROFESSIONALS_CHANGED_EVENT));
  return apiProfessionalsCache;
};

export const loadCertifiedProfessionals = (certificationId) => {
  if (!certificationId) return [];

  const storage = readStorage();
  const hasStoredKey = Object.prototype.hasOwnProperty.call(
    storage.records,
    certificationId,
  );
  const localRecords = hasStoredKey
    ? Array.isArray(storage.records[certificationId])
      ? storage.records[certificationId]
      : []
    : [];

  const apiForCert = apiProfessionalsCache.filter(
    (item) => String(item.certificationId) === String(certificationId),
  );
  const apiIds = new Set(apiForCert.map((item) => String(item.id)));
  const apiSeedKeys = new Set(
    apiForCert
      .map((item) => item.seedKey)
      .filter(Boolean)
      .map(String),
  );

  if (apiForCert.length > 0) {
    const localExtras = localRecords
      .filter(
        (item) =>
          item?.id &&
          !apiIds.has(String(item.id)) &&
          !apiSeedKeys.has(String(item.id)),
      )
      .map(normalizeStoredProfessional);

    return [...apiForCert, ...localExtras].sort((a, b) => {
      const aTime = a.completionAt ? new Date(a.completionAt).getTime() : 0;
      const bTime = b.completionAt ? new Date(b.completionAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  const records = hasStoredKey
    ? localRecords
    : SEED_PROFESSIONALS[certificationId] || [];

  return [...records]
    .map(normalizeStoredProfessional)
    .sort((a, b) => {
      const aTime = a.completionAt ? new Date(a.completionAt).getTime() : 0;
      const bTime = b.completionAt ? new Date(b.completionAt).getTime() : 0;
      return bTime - aTime;
    });
};

export const getCertifiedProfessionalById = (certificationId, professionalId) =>
  loadCertifiedProfessionals(certificationId).find(
    (item) => item.id === professionalId,
  ) || null;

export const createCertifiedProfessionalRecord = async (
  certificationId,
  payload = {},
) => {
  if (!certificationId) return null;

  const normalized = normalizeProfessionalPayload(payload);

  try {
    const created = await createProfessionalApi(
      toApiProfessionalPayload(certificationId, normalized),
    );
    await refreshCertifiedProfessionalsFromApi();
    return normalizeApiProfessional(created);
  } catch (apiError) {
    const storage = readStorage();
    const record = {
      id: `prof-${Date.now()}`,
      certificationId,
      ...normalized,
    };
    const existing = Array.isArray(storage.records[certificationId])
      ? storage.records[certificationId]
      : [];
    storage.records[certificationId] = [...existing, record];
    writeStorage(storage);
    console.warn("Professional API create failed; saved locally.", apiError);
    return record;
  }
};

export const updateCertifiedProfessionalRecord = async (
  certificationId,
  professionalId,
  payload = {},
) => {
  if (!certificationId || !professionalId) return null;

  const current = getCertifiedProfessionalById(certificationId, professionalId);
  if (!current) return null;

  const normalized = normalizeProfessionalPayload({
    ...current,
    ...payload,
    completionAt: undefined,
  });

  const apiMatch =
    apiProfessionalsCache.find(
      (item) =>
        String(item.id) === String(professionalId) ||
        String(item.seedKey) === String(professionalId) ||
        String(item.apiId) === String(professionalId).replace(/^prof-/, ""),
    ) || null;

  try {
    if (apiMatch?.apiId != null) {
      await updateProfessionalApi(
        toApiProfessionalPayload(certificationId, normalized, {
          apiId: apiMatch.apiId,
          id: apiMatch.apiId,
          seedKey: apiMatch.seedKey || null,
        }),
      );
    } else {
      await createProfessionalApi(
        toApiProfessionalPayload(certificationId, normalized, {
          seedKey: String(professionalId).startsWith("prof-seed-")
            ? professionalId
            : null,
        }),
      );
    }

    await refreshCertifiedProfessionalsFromApi();
    return getCertifiedProfessionalById(certificationId, professionalId);
  } catch (apiError) {
    const storage = readStorage();
    const existing = loadCertifiedProfessionals(certificationId);
    storage.records[certificationId] = existing.map((item) =>
      item.id === professionalId
        ? {
            ...item,
            ...normalized,
            id: professionalId,
            certificationId,
          }
        : item,
    );
    writeStorage(storage);
    console.warn("Professional API update failed; saved locally.", apiError);
    return getCertifiedProfessionalById(certificationId, professionalId);
  }
};

export const deleteCertifiedProfessionalRecord = async (
  certificationId,
  professionalId,
) => {
  if (!certificationId || !professionalId) return false;

  const existing = getCertifiedProfessionalById(certificationId, professionalId);
  const apiId =
    existing?.apiId ??
    apiProfessionalsCache.find((item) => String(item.id) === String(professionalId))
      ?.apiId;

  try {
    if (apiId != null) {
      await deleteProfessionalApi(apiId);
      await refreshCertifiedProfessionalsFromApi();
      return true;
    }
  } catch (apiError) {
    console.warn("Professional API delete failed; applying local delete.", apiError);
  }

  const storage = readStorage();
  const current = loadCertifiedProfessionals(certificationId);
  storage.records[certificationId] = current.filter(
    (item) => item.id !== professionalId,
  );
  writeStorage(storage);
  return true;
};

export const getCertifiedProfessionalCount = (certificationId) =>
  loadCertifiedProfessionals(certificationId).length;

export const getPublishedCertifiedProfessionalCount = (certificationId) =>
  loadCertifiedProfessionals(certificationId).filter(
    (item) => item.status === "Published",
  ).length;
