import { isSolutionMarkedInactive } from "./solutionMapper";

const normalize = (value = "") => String(value).trim().toLowerCase();

export const getSolutionStatusLabel = (solution) =>
  isSolutionMarkedInactive(solution) ? "Inactive" : "Active";

const getSolutionCreatedDateValue = (solution = {}) =>
  solution.CreatedDate ??
  solution.CreatedAt ??
  solution.CreatedOn ??
  solution.DateCreated ??
  solution.created_at ??
  solution.createdAt ??
  solution.createdDate ??
  "";

export const getSolutionCreatedDateLabel = (solution = {}) => {
  const value = getSolutionCreatedDateValue(solution);
  if (!value) return "—";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return String(value);
};

const getSearchableText = (solution) =>
  [
    solution.ID,
    getSolutionCreatedDateLabel(solution),
    solution.Title,
    solution.BusinessDomain,
    solution.OwnershipDetails,
    solution.AiEvangelists,
    solution.SolutionContext,
    solution.TechHighlights,
    getSolutionStatusLabel(solution),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getUniqueSolutionValues = (solutions, key) =>
  [...new Set(solutions.map((item) => item[key]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );

export const filterAdminSolutions = (
  solutions,
  { search = "", status = "all", domain = "all" } = {},
) =>
  solutions.filter((solution) => {
    const query = normalize(search);
    const matchesSearch =
      !query || getSearchableText(solution).includes(query);
    const statusLabel = getSolutionStatusLabel(solution);
    const matchesStatus = status === "all" || statusLabel === status;
    const matchesDomain =
      domain === "all" || solution.BusinessDomain === domain;

    return matchesSearch && matchesStatus && matchesDomain;
  });

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const EXPORT_COLUMNS = [
  {
    key: "createdDate",
    label: "Add Date",
    format: (_value, solution) => getSolutionCreatedDateLabel(solution),
  },
  { key: "Title", label: "Solution Title" },
  { key: "BusinessDomain", label: "Business Domain" },
  { key: "OwnershipDetails", label: "COE / Ownership" },
  { key: "AiEvangelists", label: "AI Evangelists" },
  {
    key: "status",
    label: "Status",
    format: (_value, solution) => getSolutionStatusLabel(solution),
  },
  { key: "DemoLink", label: "Demo Link" },
  { key: "RepositoryUrl", label: "Repository URL" },
];

export const exportAdminSolutionsToCsv = (solutions, filename) => {
  if (!solutions.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(
    ",",
  );
  const rows = solutions.map((solution) =>
    EXPORT_COLUMNS.map((column) => {
      const raw = column.format
        ? column.format(solution[column.key], solution)
        : solution[column.key];
      return escapeCsv(raw ?? "");
    }).join(","),
  );

  const blob = new Blob([[header, ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
