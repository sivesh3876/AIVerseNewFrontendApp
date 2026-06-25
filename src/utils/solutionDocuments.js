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

const normalizeDocument = ({ id, type, label, url, fileName }) => {
  if (!url) return null;

  const resolvedType = DOCUMENT_TYPE_META[type] ? type : inferTypeFromText(`${label} ${fileName || url}`);
  const meta = DOCUMENT_TYPE_META[resolvedType] || DOCUMENT_TYPE_META.other;

  return {
    id: id || `${resolvedType}-${fileName || label}`,
    type: resolvedType,
    label: label || meta.label,
    fileName: fileName || getFileNameFromUrl(url),
    url,
    description: meta.description,
    accent: meta.accent,
    bg: meta.bg,
    badge: meta.label,
  };
};

export const buildSolutionDocuments = ({
  solutionDetailsDoc,
  lowLevelDesignDoc,
  architectureDiagram,
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

  otherDocuments.forEach((url, index) => {
    const fileName = getFileNameFromUrl(url);
    resolved.push(
      normalizeDocument({
        id: `other-doc-${index}`,
        type: inferTypeFromText(fileName),
        label: fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
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
    otherDocuments: Array.isArray(solution.OtherDocuments)
      ? solution.OtherDocuments
      : [],
  });

export const buildDocumentsFromCapability = (capability = {}) => {
  if (Array.isArray(capability.documents) && capability.documents.length > 0) {
    if (capability.documents.every((document) => document?.url && document?.label)) {
      return capability.documents;
    }
  }

  return buildSolutionDocuments({
    solutionDetailsDoc: capability.solutionDetailsDoc,
    lowLevelDesignDoc: capability.lowLevelDesignDoc,
    architectureDiagram: capability.architectureDiagram,
    otherDocuments: capability.otherDocuments || [],
    documents: capability.documents || [],
  });
};
