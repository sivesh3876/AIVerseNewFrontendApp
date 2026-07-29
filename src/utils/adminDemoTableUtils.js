import {
  formatDemoRequestDate,
  formatRequestDateOnly,
} from "../services/demoRequestService";

const normalize = (value = "") => String(value).trim().toLowerCase();

const getSearchableText = (request) =>
  [
    request.solutionTitle,
    request.coeName,
    request.fullName,
    request.email,
    request.company,
    request.phone,
    request.message,
    request.demoGivenBy,
    request.recordStatus,
    request.feedbackMessage,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getUniqueValues = (requests, key) =>
  [...new Set(requests.map((item) => item[key]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );

export const filterDemoRequests = (
  requests,
  { search = "", status = "all", solution = "all", coe = "all" } = {},
) =>
  requests.filter((request) => {
    const query = normalize(search);
    const matchesSearch = !query || getSearchableText(request).includes(query);
    const matchesStatus =
      status === "all" || (request.recordStatus || "Active") === status;
    const matchesSolution =
      solution === "all" || request.solutionTitle === solution;
    const matchesCoe = coe === "all" || request.coeName === coe;

    return matchesSearch && matchesStatus && matchesSolution && matchesCoe;
  });

const getFeedbackExportValue = (request) => {
  const rating = request.feedbackRating ? `${request.feedbackRating}★` : "";
  const message = request.feedbackMessage || "";
  const sentiment =
    request.feedbackSentiment === "like"
      ? "Like"
      : request.feedbackSentiment === "dislike"
        ? "Dislike"
        : "";

  return [rating, sentiment, message].filter(Boolean).join(" · ");
};

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const EXPORT_COLUMNS = [
  { key: "submittedAt", label: "Request Date & Time", format: formatDemoRequestDate },
  { key: "solutionTitle", label: "Solution Name" },
  { key: "coeName", label: "COE (Owner)" },
  { key: "fullName", label: "Requester" },
  { key: "email", label: "Email" },
  { key: "company", label: "Company" },
  { key: "phone", label: "Phone" },
  { key: "message", label: "Message" },
  { key: "demoGivenBy", label: "Demo Given By" },
  {
    key: "demoGivenAt",
    label: "Demo Given On",
    format: (value) => (value ? formatRequestDateOnly(value) : ""),
  },
  {
    key: "feedback",
    label: "Feedback",
    format: (_, request) => getFeedbackExportValue(request),
  },
  {
    key: "recordStatus",
    label: "Status",
    format: (value) => value || "Active",
  },
];

export const exportDemoRequestsToCsv = (requests, filename) => {
  if (!requests.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(",");
  const rows = requests.map((request) =>
    EXPORT_COLUMNS.map((column) => {
      const raw =
        column.key === "feedback"
          ? column.format(null, request)
          : column.format
            ? column.format(request[column.key], request)
            : request[column.key];
      return escapeCsv(raw || "");
    }).join(","),
  );

  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = filename || `request-demo-records-${dateStamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
