import {
  getPermissionLabel,
  getTotalPermissionCount,
} from "../services/roleService";

const normalize = (value = "") => String(value).trim().toLowerCase();

export const formatRoleDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatRoleDateTime = (value) => {
  if (!value) return "—";
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

// Buckets used by the "Number of Users" filter.
export const USER_COUNT_OPTIONS = [
  { value: "none", label: "No users (0)" },
  { value: "few", label: "1 – 5 users" },
  { value: "many", label: "6+ users" },
];

const matchesUserBucket = (count = 0, bucket) => {
  if (bucket === "none") return count === 0;
  if (bucket === "few") return count >= 1 && count <= 5;
  if (bucket === "many") return count >= 6;
  return true;
};

// Permission level derived from how many permissions a role holds relative to
// the full matrix. Scalable: thresholds live in one place.
export const PERMISSION_LEVEL_OPTIONS = [
  { value: "full", label: "Full access" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const getPermissionLevel = (role) => {
  const total = getTotalPermissionCount() || 1;
  const count = role?.permissions?.length || 0;
  const ratio = count / total;

  if (count >= total) return "full";
  if (ratio >= 0.6) return "high";
  if (ratio >= 0.3) return "medium";
  return "low";
};

export const getPermissionLevelLabel = (role) =>
  PERMISSION_LEVEL_OPTIONS.find((option) => option.value === getPermissionLevel(role))
    ?.label || "Low";

const isSameDay = (isoValue, dateOnly) => {
  if (!isoValue || !dateOnly) return false;
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === dateOnly;
};

const getSearchableText = (role) =>
  [
    role.name,
    role.description,
    ...(role.permissions || []).map((id) => getPermissionLabel(id)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const filterRoles = (
  roles,
  {
    search = "",
    status = "all",
    createdDate = "",
    userCount = "all",
    permissionLevel = "all",
  } = {},
) => {
  const query = normalize(search);

  return roles.filter((role) => {
    const matchesSearch = !query || getSearchableText(role).includes(query);
    const matchesStatus = status === "all" || role.status === status;
    const matchesCreated =
      !createdDate || isSameDay(role.createdDate, createdDate);
    const matchesUsers =
      userCount === "all" || matchesUserBucket(role.assignedUsers, userCount);
    const matchesLevel =
      permissionLevel === "all" || getPermissionLevel(role) === permissionLevel;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCreated &&
      matchesUsers &&
      matchesLevel
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
  { key: "name", label: "Role Name" },
  { key: "description", label: "Description" },
  { key: "assignedUsers", label: "Assigned Users" },
  {
    key: "permissions",
    label: "Permissions",
    format: (value) => `${(value || []).length} permissions`,
  },
  { key: "status", label: "Status" },
  {
    key: "createdDate",
    label: "Created Date",
    format: (value) => formatRoleDate(value),
  },
  {
    key: "lastUpdated",
    label: "Last Updated",
    format: (value) => formatRoleDate(value),
  },
];

export const exportRolesToCsv = (roles, filename) => {
  if (!roles.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(
    ",",
  );
  const rows = roles.map((role) =>
    EXPORT_COLUMNS.map((column) => {
      const raw = column.format
        ? column.format(role[column.key], role)
        : role[column.key];
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
