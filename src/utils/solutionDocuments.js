export const DOCUMENT_TYPE_META = {
  "solution-details": {
    label: "Solution Details",
    description: "Overview document with business context, scope, and deliverables.",
    accent: "#4D90E3",
    bg: "rgba(77, 144, 227, 0.1)",
  },
  lld: {
    label: "Low Level Design",
    description: "Technical LLD covering components, integrations, and data flows.",
    accent: "#7C3AED",
    bg: "rgba(124, 58, 237, 0.1)",
  },
  "architecture-diagram": {
    label: "Architecture Diagram",
    description: "Solution architecture and system interaction diagram.",
    accent: "#18E0CC",
    bg: "rgba(24, 224, 204, 0.12)",
  },
  "sales-desk": {
    label: "Sales Pitch",
    description: "Sales Pitch PDF with customer-facing solution information.",
    accent: "#2563EB",
    bg: "rgba(37, 99, 235, 0.12)",
  },
  "technical-spec": {
    label: "Technical Specification",
    description: "Implementation notes, APIs, and operational requirements.",
    accent: "#EF8E29",
    bg: "rgba(239, 142, 41, 0.12)",
  },
  other: {
    label: "Supporting Document",
    description: "Additional reference material for this solution.",
    accent: "#64748B",
    bg: "rgba(100, 116, 139, 0.12)",
  },
};

const inferTypeFromText = (value = "") => {
  const text = value.toLowerCase();

  if (text.includes("lld") || text.includes("low-level") || text.includes("low level")) {
    return "lld";
  }

  if (
    text.includes("diagram") ||
    text.includes("architecture") ||
    text.includes("arch-") ||
    text.includes(".png") ||
    text.includes(".svg") ||
    text.includes(".jpg")
  ) {
    return "architecture-diagram";
  }

  if (text.includes("spec") || text.includes("technical")) {
    return "technical-spec";
  }

  if (
    text.includes("sales pitch") ||
    text.includes("salespitch") ||
    text.includes("sales desk") ||
    text.includes("salesdesk")
  ) {
    return "sales-desk";
  }

  if (text.includes("solution") || text.includes("overview") || text.includes("details")) {
    return "solution-details";
  }

  return "other";
};

const getFileNameFromUrl = (url = "") => {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const segment = pathname.split("/").filter(Boolean).pop() || "Document";
    return decodeURIComponent(segment);
  } catch {
    const segment = url.split("/").filter(Boolean).pop() || "Document";
    return decodeURIComponent(segment.split("?")[0]);
  }
};

const OFFICE_VIEWER_EXT =
  /\.(docx?|pptx?|xlsx?)(\?|#|$)/i;

/** Browser-viewable URL for View actions (Office files via Office Online). */
export const getDocumentViewUrl = (url = "") => {
  const value = String(url || "").trim();
  if (!value) return "";

  let path = value;
  try {
    path = new URL(value, window.location.origin).pathname;
  } catch {
    path = value.split("?")[0].split("#")[0];
  }

  if (OFFICE_VIEWER_EXT.test(path) || OFFICE_VIEWER_EXT.test(value)) {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(value)}`;
  }

  return value;
};

/**
 * Strip backend unique blob prefixes so UI shows the original upload name.
 * Storage keeps: other-doc-1-{ts}-{uuid}-{original}.pdf
 * Display shows: {original}.pdf
 */
const UNIQUE_BLOB_NAME_RE =
  /^(?:other-doc-\d+|demo-video|solution-details|lld|architecture-diagram|sales-desk)-\d+-[a-f0-9]{8}-(.+)$/i;

const MANGLED_OTHER_DOC_LABEL_RE =
  /^other\s*doc\s*\d+\s+\d+\s+[a-f0-9]{8}\b/i;

export const stripUniqueBlobFileName = (fileName = "") => {
  const segment = String(fileName).trim();
  if (!segment) return segment;
  const match = segment.match(UNIQUE_BLOB_NAME_RE);
  return match?.[1] || segment;
};

export const getDisplayFileNameFromUrl = (url = "") =>
  stripUniqueBlobFileName(getFileNameFromUrl(url));

export const toHumanDocumentLabel = (fileName = "") =>
  String(fileName)
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

const shouldRebuildDocumentLabel = (label = "", fileName = "") => {
  const labelText = String(label).trim();
  const rawFileName = String(fileName).trim();
  return (
    UNIQUE_BLOB_NAME_RE.test(rawFileName) ||
    MANGLED_OTHER_DOC_LABEL_RE.test(labelText) ||
    UNIQUE_BLOB_NAME_RE.test(labelText.replace(/\s+/g, "-"))
  );
};

const sanitizeCapabilityDocument = (document) => {
  if (!document?.url) return document;

  const displayFileName =
    getDisplayFileNameFromUrl(document.url) ||
    stripUniqueBlobFileName(document.fileName || "");

  const next = {
    ...document,
    fileName: displayFileName || document.fileName,
  };

  if (
    shouldRebuildDocumentLabel(document.label, document.fileName) ||
    shouldRebuildDocumentLabel(document.label, displayFileName)
  ) {
    next.label = toHumanDocumentLabel(displayFileName) || document.label;
  }

  return next;
};

const normalizeDocument = ({ id, type, label, url, fileName }) => {
  if (!url) return null;

  const resolvedFileName =
    stripUniqueBlobFileName(fileName) || getDisplayFileNameFromUrl(url);
  const resolvedType = DOCUMENT_TYPE_META[type]
    ? type
    : inferTypeFromText(`${label} ${resolvedFileName || url}`);
  const meta = DOCUMENT_TYPE_META[resolvedType] || DOCUMENT_TYPE_META.other;

  return {
    id: id || `${resolvedType}-${resolvedFileName || label}`,
    type: resolvedType,
    label: label || meta.label,
    fileName: resolvedFileName,
    url,
    description: meta.description,
    accent: meta.accent,
    bg: meta.bg,
    badge: meta.label,
  };
};

export const excludeSalesDeskDocuments = (documents = []) =>
  documents.filter((doc) => doc.type !== "sales-desk");

export const getSalesDeskDocumentUrl = (source = {}) => {
  if (source.salesDeskDoc) return source.salesDeskDoc;
  if (source.SalesDeskDoc) return source.SalesDeskDoc;

  const documents = Array.isArray(source.documents)
    ? source.documents
    : buildDocumentsFromCapability(source);

  return documents.find((document) => document.type === "sales-desk")?.url || null;
};

export const buildSolutionDocuments = ({
  solutionDetailsDoc,
  lowLevelDesignDoc,
  architectureDiagram,
  salesDeskDoc,
  otherDocuments = [],
  documents = [],
} = {}) => {
  const resolved = [];

  if (solutionDetailsDoc) {
    resolved.push(
      normalizeDocument({
        id: "solution-details-doc",
        type: "solution-details",
        label: "Solution Details Document",
        url: solutionDetailsDoc,
      }),
    );
  }

  if (lowLevelDesignDoc) {
    resolved.push(
      normalizeDocument({
        id: "lld-doc",
        type: "lld",
        label: "Low Level Design",
        url: lowLevelDesignDoc,
      }),
    );
  }

  if (architectureDiagram) {
    resolved.push(
      normalizeDocument({
        id: "architecture-diagram",
        type: "architecture-diagram",
        label: "Architecture Diagram",
        url: architectureDiagram,
      }),
    );
  }

  if (salesDeskDoc) {
    resolved.push(
      normalizeDocument({
        id: "sales-desk-doc",
        type: "sales-desk",
        label: "Sales Pitch",
        url: salesDeskDoc,
      }),
    );
  }

  otherDocuments.forEach((url, index) => {
    const fileName = getDisplayFileNameFromUrl(url);
    resolved.push(
      normalizeDocument({
        id: `other-doc-${index}`,
        type: inferTypeFromText(fileName),
        label: toHumanDocumentLabel(fileName),
        url,
        fileName,
      }),
    );
  });

  documents.forEach((document, index) => {
    resolved.push(
      normalizeDocument({
        id: document.id || `custom-doc-${index}`,
        type: document.type,
        label: document.label,
        url: document.url,
        fileName: document.fileName,
      }),
    );
  });

  return resolved.filter(Boolean);
};

export const buildDocumentsFromApiSolution = (solution = {}) =>
  buildSolutionDocuments({
    solutionDetailsDoc: solution.SolutionDetailsDoc,
    lowLevelDesignDoc: solution.LowLevelDesignDoc,
    architectureDiagram: solution.ArchitectureDiagram,
    salesDeskDoc: solution.SalesDeskDoc,
    otherDocuments: Array.isArray(solution.OtherDocuments)
      ? solution.OtherDocuments.filter(Boolean)
      : typeof solution.OtherDocuments === "string" &&
          solution.OtherDocuments.trim()
        ? solution.OtherDocuments.split(",")
            .map((url) => url.trim())
            .filter(Boolean)
        : [],
  });

export const buildDocumentsFromCapability = (capability = {}) => {
  if (Array.isArray(capability.documents) && capability.documents.length > 0) {
    if (capability.documents.every((document) => document?.url && document?.label)) {
      return capability.documents.map(sanitizeCapabilityDocument);
    }
  }

  return buildSolutionDocuments({
    solutionDetailsDoc: capability.solutionDetailsDoc,
    lowLevelDesignDoc: capability.lowLevelDesignDoc,
    architectureDiagram: capability.architectureDiagram,
    salesDeskDoc: capability.salesDeskDoc,
    otherDocuments: capability.otherDocuments || [],
    documents: capability.documents || [],
  });
};
