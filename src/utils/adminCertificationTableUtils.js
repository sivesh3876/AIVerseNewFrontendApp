import { stripHtml } from "./htmlContent";

const normalize = (value = "") => String(value).trim().toLowerCase();

const getSearchableText = (certification) =>
  [
    certification.name,
    certification.code,
    certification.provider,
    certification.category,
    certification.level,
    certification.status,
    certification.publish,
    certification.publicationStatus,
    certification.duration,
    certification.skillsCovered,
    certification.prerequisites,
    certification.validity,
    stripHtml(certification.description),
    certification.createdDate,
    certification.totalCertified,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getUniqueCertificationValues = (certifications, key) =>
  [...new Set(certifications.map((item) => item[key]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );

export const filterAdminCertifications = (
  certifications,
  {
    search = "",
    status = "all",
    category = "all",
    level = "all",
    provider = "all",
  } = {},
) =>
  certifications.filter((certification) => {
    const query = normalize(search);
    const matchesSearch =
      !query || getSearchableText(certification).includes(query);
    const matchesStatus =
      status === "all" || (certification.status || "Active") === status;
    const matchesCategory =
      category === "all" || certification.category === category;
    const matchesLevel =
      level === "all" || certification.level === level;
    const matchesProvider =
      provider === "all" || certification.provider === provider;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesLevel &&
      matchesProvider
    );
  });

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const EXPORT_COLUMNS = [
  { key: "name", label: "Certification Name" },
  { key: "code", label: "Certification Code" },
  { key: "provider", label: "Provider" },
  { key: "category", label: "Category" },
  { key: "level", label: "Level" },
  {
    key: "totalCertified",
    label: "Total Certified",
    format: (value) => Number(value || 0),
  },
  {
    key: "status",
    label: "Status",
    format: (value) => value || "Active",
  },
  {
    key: "publish",
    label: "Publish",
    format: (value, certification) =>
      value || (certification.publicationStatus === "Published" ? "Yes" : "No"),
  },
  { key: "duration", label: "Duration" },
  { key: "validity", label: "Validity" },
  { key: "externalUrl", label: "External Certification URL" },
  { key: "skillsCovered", label: "Skills Covered" },
  { key: "prerequisites", label: "Prerequisites" },
  {
    key: "description",
    label: "Description",
    format: (value) => stripHtml(value),
  },
  { key: "createdDate", label: "Created Date" },
];

export const exportAdminCertificationsToCsv = (certifications, filename) => {
  if (!certifications.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(
    ",",
  );
  const rows = certifications.map((certification) =>
    EXPORT_COLUMNS.map((column) => {
      const raw = column.format
        ? column.format(certification[column.key], certification)
        : certification[column.key];
      return escapeCsv(raw ?? "");
    }).join(","),
  );

  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = filename || `certification-records-${dateStamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
