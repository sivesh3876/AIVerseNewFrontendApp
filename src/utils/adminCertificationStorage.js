import {
  createCertification as createCertificationApi,
  deleteCertification as deleteCertificationApi,
  fetchCertifications,
  updateCertification as updateCertificationApi,
} from "../services/certificationsApiService";

export const CERTIFICATION_STATUSES = ["Active", "Inactive"];
export const CERTIFICATION_FORM_STATUSES = ["Active", "Inactive"];
export const CERTIFICATION_PUBLISH_OPTIONS = ["Yes", "No"];
export const CERTIFICATION_PUBLICATION_STATUSES = ["Draft", "Published"];
export const CERTIFICATION_CATEGORIES = [
  "CLOUD AI",
  "DATA SCIENCE",
  "MACHINE LEARNING",
  "GENERATIVE AI",
  "AI GOVERNANCE",
];
export const CERTIFICATION_LEVELS = [
  "Beginner",
  "Intermediate",
  "Professional",
  "Expert",
];
export const CERTIFICATIONS_CHANGED_EVENT = "aiVerseCertificationsChanged";

const STORAGE_KEY = "aiVerseAdminCertifications";

/** In-memory cache of certifications from production API. */
let apiCertificationsCache = [];

const DEFAULT_STORAGE = {
  overrides: {},
  customCertifications: [],
  deletedIds: [],
  customCategories: [],
};

const SEED_CERTIFICATIONS = [
  {
    id: "cert-ai-900",
    name: "AI-901: Azure AI Fundamentals",
    code: "AI-901",
    provider: "Microsoft",
    category: "CLOUD AI",
    level: "Beginner",
    description:
      "Prepare for the AI-901 exam and build a strong foundation in artificial intelligence and Microsoft Azure AI services.",
    thumbnailImage: "",
    bannerImage: "",
    externalUrl: "https://learn.microsoft.com/certifications/azure-ai-fundamentals/",
    duration: "6 weeks",
    skillsCovered: "Azure AI services, machine learning basics, computer vision, NLP",
    prerequisites: "Basic cloud and programming familiarity",
    validity: "1 year",
    totalCertified: 245,
    status: "Active",
    publish: "Yes",
    publicationStatus: "Published",
    createdDate: "15 January 2026",
    createdAt: "2026-01-15T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "cert-aws-ml",
    name: "AWS Certified Machine Learning – Specialty",
    code: "MLS-C01",
    provider: "Amazon Web Services",
    category: "MACHINE LEARNING",
    level: "Professional",
    description:
      "Validate expertise in building, training, tuning, and deploying machine learning models on AWS.",
    thumbnailImage: "",
    bannerImage: "",
    externalUrl: "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
    duration: "8 weeks",
    skillsCovered: "SageMaker, data engineering, model deployment, MLOps",
    prerequisites: "2+ years AWS ML experience recommended",
    validity: "3 years",
    totalCertified: 189,
    status: "Active",
    publish: "Yes",
    publicationStatus: "Published",
    createdDate: "22 January 2026",
    createdAt: "2026-01-22T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "cert-gcp-ml",
    name: "Google Professional Machine Learning Engineer",
    code: "PMLE",
    provider: "Google Cloud",
    category: "CLOUD AI",
    level: "Professional",
    description:
      "Design, build, and productionize ML models to solve business challenges using Google Cloud.",
    thumbnailImage: "",
    bannerImage: "",
    externalUrl: "https://cloud.google.com/certification/machine-learning-engineer",
    duration: "10 weeks",
    skillsCovered: "Vertex AI, TensorFlow, feature engineering, model monitoring",
    prerequisites: "3+ years industry experience including ML",
    validity: "2 years",
    totalCertified: 156,
    status: "Active",
    publish: "Yes",
    publicationStatus: "Published",
    createdDate: "3 February 2026",
    createdAt: "2026-02-03T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "cert-databricks-genai",
    name: "Databricks Generative AI Engineer Associate",
    code: "GENAI-ASSOC",
    provider: "Databricks",
    category: "GENERATIVE AI",
    level: "Intermediate",
    description:
      "Demonstrate skills in building and deploying generative AI applications on the Databricks platform.",
    thumbnailImage: "",
    bannerImage: "",
    externalUrl: "https://www.databricks.com/learn/certification",
    duration: "5 weeks",
    skillsCovered: "LLMs, RAG, vector search, model serving",
    prerequisites: "Databricks associate-level knowledge",
    validity: "2 years",
    totalCertified: 98,
    status: "Active",
    publish: "Yes",
    publicationStatus: "Published",
    createdDate: "18 February 2026",
    createdAt: "2026-02-18T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "cert-ibm-data-science",
    name: "IBM Data Science Professional Certificate",
    code: "IBM-DS-PRO",
    provider: "IBM",
    category: "DATA SCIENCE",
    level: "Intermediate",
    description:
      "Develop job-ready data science skills including Python, SQL, visualization, and machine learning.",
    thumbnailImage: "",
    bannerImage: "",
    externalUrl: "https://www.coursera.org/professional-certificates/ibm-data-science",
    duration: "12 weeks",
    skillsCovered: "Python, SQL, data visualization, ML, capstone project",
    prerequisites: "No prior experience required",
    validity: "No expiry",
    totalCertified: 312,
    status: "Active",
    publish: "Yes",
    publicationStatus: "Published",
    createdDate: "5 March 2026",
    createdAt: "2026-03-05T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "cert-iso-ai-governance",
    name: "ISO/IEC 42001 AI Management System",
    code: "ISO-42001",
    provider: "ISO",
    category: "AI GOVERNANCE",
    level: "Expert",
    description:
      "Establish and maintain an AI management system aligned with international governance standards.",
    thumbnailImage: "",
    bannerImage: "",
    externalUrl: "",
    duration: "4 weeks",
    skillsCovered: "AI governance, risk management, compliance frameworks",
    prerequisites: "Governance or compliance background",
    validity: "3 years",
    totalCertified: 42,
    status: "Inactive",
    publish: "No",
    publicationStatus: "Draft",
    createdDate: "12 March 2026",
    createdAt: "2026-03-12T00:00:00.000Z",
    isCustom: false,
  },
];

const normalizeStatus = (status) =>
  CERTIFICATION_STATUSES.includes(status) ? status : "Active";

const normalizePublish = (value) =>
  CERTIFICATION_PUBLISH_OPTIONS.includes(value) ? value : "No";

const normalizePublicationStatus = (value, publish) => {
  if (CERTIFICATION_PUBLICATION_STATUSES.includes(value)) {
    return value;
  }
  return publish === "Yes" ? "Published" : "Draft";
};

export const normalizeCertificationUrl = (url = "") => {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const formatCreatedDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const parseCreatedAt = (dateLabel = "") => {
  const parsed = new Date(dateLabel);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORAGE };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_STORAGE };

    return {
      ...DEFAULT_STORAGE,
      overrides: parsed.overrides || {},
      customCertifications: Array.isArray(parsed.customCertifications)
        ? parsed.customCertifications
        : [],
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      customCategories: Array.isArray(parsed.customCategories)
        ? parsed.customCategories
        : [],
    };
  } catch {
    return { ...DEFAULT_STORAGE };
  }
};

const writeStorage = (storage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  window.dispatchEvent(new Event(CERTIFICATIONS_CHANGED_EVENT));
};

const normalizeCategory = (value = "") =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

export const saveCustomCertificationCategory = (category = "") => {
  const normalized = normalizeCategory(category);
  if (!normalized) return "";

  const storage = readStorage();
  const exists =
    CERTIFICATION_CATEGORIES.includes(normalized) ||
    storage.customCategories.includes(normalized);

  if (!exists) {
    storage.customCategories = [...storage.customCategories, normalized];
    writeStorage(storage);
  }

  return normalized;
};

export const getCertificationCategoryOptions = () => {
  const storage = readStorage();
  const certifications = loadAdminCertifications();
  const fromRecords = certifications.map((item) => item.category).filter(Boolean);

  return [
    ...new Set([
      ...CERTIFICATION_CATEGORIES,
      ...storage.customCategories,
      ...fromRecords,
    ]),
  ].sort((a, b) => a.localeCompare(b));
};

const normalizeCertificationPayload = (payload = {}) => {
  const status = normalizeStatus(payload.status);
  const publish = normalizePublish(payload.publish);
  const publicationStatus = normalizePublicationStatus(
    payload.publicationStatus,
    publish,
  );
  const category = payload.customCategory
    ? saveCustomCertificationCategory(payload.customCategory)
    : normalizeCategory(payload.category) || CERTIFICATION_CATEGORIES[0];

  const createdDate =
    payload.createdDate || formatCreatedDate(new Date().toISOString());
  const totalCertified = Math.max(0, Number(payload.totalCertified) || 0);

  return {
    name: String(payload.name || "").trim(),
    code: String(payload.code || "").trim(),
    provider: String(payload.provider || "").trim(),
    category,
    level: CERTIFICATION_LEVELS.includes(payload.level)
      ? payload.level
      : CERTIFICATION_LEVELS[0],
    description: String(payload.description || "").trim(),
    thumbnailImage: String(payload.thumbnailImage || ""),
    bannerImage: String(payload.bannerImage || ""),
    attachmentFile: String(payload.attachmentFile || ""),
    attachmentName: String(payload.attachmentName || "").trim(),
    attachmentMimeType: String(payload.attachmentMimeType || "").trim(),
    externalUrl: normalizeCertificationUrl(payload.externalUrl),
    duration: String(payload.duration || "").trim(),
    skillsCovered: String(payload.skillsCovered || "").trim(),
    prerequisites: String(payload.prerequisites || "").trim(),
    validity: String(payload.validity || "").trim(),
    totalCertified,
    status,
    publish,
    publicationStatus,
    createdDate,
    createdAt: parseCreatedAt(createdDate) || new Date().toISOString(),
  };
};

const mergeCertificationRecord = (baseRecord, overrides = {}) => ({
  ...baseRecord,
  ...overrides,
  id: baseRecord.id,
  status: normalizeStatus(overrides.status ?? baseRecord.status),
  publish: normalizePublish(overrides.publish ?? baseRecord.publish),
  publicationStatus: normalizePublicationStatus(
    overrides.publicationStatus ?? baseRecord.publicationStatus,
    overrides.publish ?? baseRecord.publish,
  ),
  externalUrl: normalizeCertificationUrl(
    overrides.externalUrl ?? baseRecord.externalUrl,
  ),
});

const normalizeApiCertification = (cert = {}) => ({
  ...cert,
  id: cert.id || (cert.apiId != null ? `cert-${cert.apiId}` : `cert-${Date.now()}`),
  apiId: cert.apiId ?? null,
  seedKey: cert.seedKey || null,
  status: normalizeStatus(cert.status),
  publish: normalizePublish(cert.publish),
  publicationStatus: normalizePublicationStatus(
    cert.publicationStatus,
    cert.publish,
  ),
  externalUrl: normalizeCertificationUrl(cert.externalUrl),
  isCustom: Boolean(cert.isCustom ?? !cert.seedKey),
});

const toApiCertificationPayload = (normalized, extra = {}) => ({
  name: normalized.name,
  code: normalized.code,
  provider: normalized.provider,
  category: normalized.category,
  level: normalized.level,
  description: normalized.description,
  thumbnailImage: normalized.thumbnailImage,
  bannerImage: normalized.bannerImage,
  attachmentFile: normalized.attachmentFile,
  attachmentName: normalized.attachmentName,
  attachmentMimeType: normalized.attachmentMimeType,
  externalUrl: normalized.externalUrl,
  duration: normalized.duration,
  skillsCovered: normalized.skillsCovered,
  prerequisites: normalized.prerequisites,
  validity: normalized.validity,
  totalCertified: normalized.totalCertified,
  status: normalized.status,
  publish: normalized.publish,
  publicationStatus: normalized.publicationStatus,
  createdDate: normalized.createdDate,
  ...extra,
});

export const refreshCertificationsFromApi = async ({
  includeUnpublished = true,
} = {}) => {
  // Always load the full set (including Inactive). Public pages filter with
  // isPublicCertification so Inactive cards stay hidden without wiping status.
  void includeUnpublished;
  const data = await fetchCertifications({ includeUnpublished: true });
  apiCertificationsCache = data.map(normalizeApiCertification);
  window.dispatchEvent(new Event(CERTIFICATIONS_CHANGED_EVENT));
  return loadAdminCertifications();
};

export const loadAdminCertifications = () => {
  const storage = readStorage();
  const deleted = new Set(storage.deletedIds);
  const apiById = new Map(
    apiCertificationsCache.map((item) => [String(item.id), item]),
  );
  const apiBySeed = new Map(
    apiCertificationsCache
      .filter((item) => item.seedKey)
      .map((item) => [String(item.seedKey), item]),
  );

  const seedRecords = SEED_CERTIFICATIONS.filter(
    (record) => !deleted.has(record.id),
  ).map((record) => {
    const fromApi =
      apiBySeed.get(String(record.id)) || apiById.get(String(record.id));
    if (fromApi) return fromApi;
    return mergeCertificationRecord(record, storage.overrides[record.id]);
  });

  const seedIds = new Set(seedRecords.map((item) => String(item.id)));

  const apiCustoms = apiCertificationsCache.filter(
    (item) =>
      !seedIds.has(String(item.id)) &&
      !deleted.has(item.id) &&
      !item.seedKey,
  );

  const localCustoms = storage.customCertifications
    .filter(
      (record) =>
        record?.id &&
        !deleted.has(record.id) &&
        !apiById.has(String(record.id)) &&
        !seedIds.has(String(record.id)),
    )
    .map((record) =>
      mergeCertificationRecord(record, storage.overrides[record.id]),
    );

  return [...seedRecords, ...apiCustoms, ...localCustoms].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
};

export const getAdminCertificationById = (id) =>
  loadAdminCertifications().find((item) => item.id === id) || null;

export const createAdminCertificationRecord = async (payload = {}) => {
  const normalized = normalizeCertificationPayload(payload);

  try {
    const created = await createCertificationApi(
      toApiCertificationPayload(normalized),
    );
    await refreshCertificationsFromApi({ includeUnpublished: true });
    return normalizeApiCertification(created);
  } catch (apiError) {
    const storage = readStorage();
    const id = `cert-${Date.now()}`;
    const record = { id, ...normalized, isCustom: true };
    storage.customCertifications = [...storage.customCertifications, record];
    writeStorage(storage);
    console.warn("Certification API create failed; saved locally.", apiError);
    return record;
  }
};

export const updateAdminCertificationRecord = async (id, payload = {}) => {
  const existing = getAdminCertificationById(id);
  if (!existing) return null;

  const normalized = normalizeCertificationPayload({
    ...existing,
    ...payload,
    createdDate: payload.createdDate ?? existing.createdDate,
    createdAt: existing.createdAt,
    totalCertified:
      payload.totalCertified !== undefined
        ? payload.totalCertified
        : existing.totalCertified,
    id,
  });

  const apiMatch =
    apiCertificationsCache.find(
      (item) =>
        String(item.id) === String(id) ||
        String(item.seedKey) === String(id) ||
        String(item.apiId) === String(id).replace(/^cert-/, ""),
    ) || null;

  try {
    if (apiMatch?.apiId != null) {
      await updateCertificationApi(
        toApiCertificationPayload(normalized, {
          apiId: apiMatch.apiId,
          id: apiMatch.apiId,
          seedKey: apiMatch.seedKey || existing.seedKey || null,
        }),
      );
    } else if (existing.isCustom === false) {
      await createCertificationApi(
        toApiCertificationPayload(normalized, { seedKey: id }),
      );
    } else {
      await createCertificationApi(toApiCertificationPayload(normalized));
    }

    await refreshCertificationsFromApi({ includeUnpublished: true });
    return getAdminCertificationById(id);
  } catch (apiError) {
    const storage = readStorage();
    const seed = SEED_CERTIFICATIONS.find((item) => item.id === id);
    if (seed) {
      storage.overrides[id] = {
        ...(storage.overrides[id] || {}),
        ...normalized,
      };
    } else {
      storage.customCertifications = storage.customCertifications.map((item) =>
        item.id === id ? { ...item, ...normalized, id } : item,
      );
    }
    writeStorage(storage);
    console.warn("Certification API update failed; saved locally.", apiError);
    return getAdminCertificationById(id);
  }
};

export const deleteAdminCertificationRecord = async (id) => {
  const existing = getAdminCertificationById(id);
  const apiId =
    existing?.apiId ??
    apiCertificationsCache.find((item) => String(item.id) === String(id))?.apiId;

  try {
    if (apiId != null) {
      await deleteCertificationApi(apiId);
      await refreshCertificationsFromApi({ includeUnpublished: true });
      return true;
    }
  } catch (apiError) {
    console.warn("Certification API delete failed; applying local delete.", apiError);
  }

  const storage = readStorage();
  const seed = SEED_CERTIFICATIONS.find((item) => item.id === id);

  if (seed) {
    if (!storage.deletedIds.includes(id)) {
      storage.deletedIds = [...storage.deletedIds, id];
    }
    delete storage.overrides[id];
  } else {
    storage.customCertifications = storage.customCertifications.filter(
      (item) => item.id !== id,
    );
    delete storage.overrides[id];
  }

  writeStorage(storage);
  return true;
};

