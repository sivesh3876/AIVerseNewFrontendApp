const normalize = (value = "") => String(value).trim().toLowerCase();

export const formatUserDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatUserDateTime = (value) => {
  if (!value) return "Never";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getUserInitials = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const isSameDay = (isoValue, dateOnly) => {
  if (!isoValue || !dateOnly) return false;
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === dateOnly;
};

export const filterUsers = (
  users,
  { search = "", role = "all", department = "all", status = "all", createdDate = "" } = {},
) => {
  const query = normalize(search);

  return users.filter((user) => {
    const matchesSearch =
      !query ||
      [user.fullName, user.email, user.department]
        .map(normalize)
        .some((field) => field.includes(query));

    const matchesRole = role === "all" || user.role === role;
    const matchesDepartment =
      department === "all" || user.department === department;
    const matchesStatus = status === "all" || user.status === status;
    const matchesCreated =
      !createdDate || isSameDay(user.createdDate, createdDate);

    return (
      matchesSearch &&
      matchesRole &&
      matchesDepartment &&
      matchesStatus &&
      matchesCreated
    );
  });
};

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const EXPORT_COLUMNS = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "employeeId", label: "Employee ID" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "role", label: "Assigned Role" },
  { key: "status", label: "Status" },
  {
    key: "lastLogin",
    label: "Last Login",
    format: (value) => formatUserDateTime(value),
  },
  {
    key: "createdDate",
    label: "Created Date",
    format: (value) => formatUserDate(value),
  },
];

export const exportUsersToCsv = (users, filename) => {
  if (!users.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(
    ",",
  );
  const rows = users.map((user) =>
    EXPORT_COLUMNS.map((column) => {
      const raw = column.format
        ? column.format(user[column.key], user)
        : user[column.key];
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
