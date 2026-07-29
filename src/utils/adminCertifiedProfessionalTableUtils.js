const normalize = (value = "") => String(value).trim().toLowerCase();

const getSearchableText = (professional) =>
  [
    professional.employeeName,
    professional.employeeId,
    professional.designation,
    professional.department,
    professional.officeLocation,
    professional.email,
    professional.certificationName,
    professional.provider,
    professional.completionDate,
    professional.expiryDate,
    professional.credentialId,
    professional.examScore,
    professional.score,
    professional.percentage,
    professional.linkedInUrl,
    professional.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getUniqueProfessionalValues = (professionals, key) =>
  [...new Set(professionals.map((item) => item[key]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );

export const filterCertifiedProfessionals = (
  professionals,
  { search = "", status = "all", department = "all" } = {},
) =>
  professionals.filter((professional) => {
    const query = normalize(search);
    const matchesSearch =
      !query || getSearchableText(professional).includes(query);
    const matchesStatus =
      status === "all" || (professional.status || "Draft") === status;
    const matchesDepartment =
      department === "all" || professional.department === department;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const EXPORT_COLUMNS = [
  { key: "employeeName", label: "Employee Name" },
  { key: "employeeId", label: "Employee ID" },
  { key: "designation", label: "Designation" },
  { key: "department", label: "Department" },
  { key: "officeLocation", label: "Office Location" },
  { key: "email", label: "Email" },
  { key: "certificationName", label: "Certification" },
  { key: "provider", label: "Provider" },
  { key: "completionDate", label: "Completion Date" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "credentialId", label: "Credential ID" },
  {
    key: "examScore",
    label: "Exam Score",
    format: (value, row) => value || row.score || "",
  },
  { key: "percentage", label: "Percentage" },
  { key: "certificateVerificationUrl", label: "Certificate Verification URL" },
  { key: "linkedInUrl", label: "LinkedIn URL" },
  {
    key: "status",
    label: "Status",
    format: (value) => value || "Draft",
  },
];

export const exportCertifiedProfessionalsToCsv = (
  professionals,
  filename,
) => {
  if (!professionals.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(
    ",",
  );
  const rows = professionals.map((professional) =>
    EXPORT_COLUMNS.map((column) => {
      const raw = column.format
        ? column.format(professional[column.key], professional)
        : professional[column.key];
      return escapeCsv(raw ?? "");
    }).join(","),
  );

  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = filename || `certified-professionals-${dateStamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
