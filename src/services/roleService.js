// Role Management service.
//
// Owns all "API" access for the Role Management module. It serves dummy JSON
// data through promise-based methods that mimic real network calls. When a
// backend / RBAC engine is available, only the internals here change - callers
// stay untouched.
//
// The PERMISSION_CATALOG is the single source of truth for the permission
// matrix and is intentionally structured so a future Permission Management
// module can consume it directly.

const NETWORK_DELAY = 350;

export const ROLE_STATUSES = ["Active", "Inactive", "Draft"];

// Permissions grouped by module. Each permission has a stable id (module.action)
// so roles reference ids rather than labels.
export const PERMISSION_CATALOG = [
  {
    key: "dashboard",
    module: "Dashboard",
    permissions: [{ id: "dashboard.view", label: "View Dashboard" }],
  },
  {
    key: "users",
    module: "User Management",
    permissions: [
      { id: "users.view", label: "View Users" },
      { id: "users.create", label: "Create Users" },
      { id: "users.edit", label: "Edit Users" },
      { id: "users.delete", label: "Delete Users" },
    ],
  },
  {
    key: "roles",
    module: "Role Management",
    permissions: [
      { id: "roles.view", label: "View Roles" },
      { id: "roles.create", label: "Create Roles" },
      { id: "roles.edit", label: "Edit Roles" },
      { id: "roles.delete", label: "Delete Roles" },
    ],
  },
  {
    key: "solutions",
    module: "Solution Management",
    permissions: [
      { id: "solutions.view", label: "View Solutions" },
      { id: "solutions.create", label: "Create Solutions" },
      { id: "solutions.edit", label: "Edit Solutions" },
      { id: "solutions.delete", label: "Delete Solutions" },
    ],
  },
  {
    key: "blogs",
    module: "Blogs",
    permissions: [
      { id: "blogs.view", label: "View Blogs" },
      { id: "blogs.create", label: "Create Blogs" },
      { id: "blogs.edit", label: "Edit Blogs" },
      { id: "blogs.delete", label: "Delete Blogs" },
    ],
  },
  {
    key: "learn",
    module: "Learn & Explore",
    permissions: [
      { id: "learn.view", label: "View" },
      { id: "learn.create", label: "Create" },
      { id: "learn.edit", label: "Edit" },
      { id: "learn.delete", label: "Delete" },
    ],
  },
  {
    key: "demo",
    module: "Request Demo",
    permissions: [
      { id: "demo.view", label: "View Requests" },
      { id: "demo.export", label: "Export Requests" },
    ],
  },
  {
    key: "settings",
    module: "Settings",
    permissions: [
      { id: "settings.view", label: "View Settings" },
      { id: "settings.edit", label: "Edit Settings" },
    ],
  },
];

export const getAllPermissionIds = () =>
  PERMISSION_CATALOG.flatMap((group) =>
    group.permissions.map((permission) => permission.id),
  );

export const getTotalPermissionCount = () => getAllPermissionIds().length;

const PERMISSION_LABEL_MAP = PERMISSION_CATALOG.reduce((map, group) => {
  group.permissions.forEach((permission) => {
    map[permission.id] = `${group.module}: ${permission.label}`;
  });
  return map;
}, {});

export const getPermissionLabel = (id) => PERMISSION_LABEL_MAP[id] || id;

// Permission templates used by the "Permission Template" dropdown in the modal.
const VIEW_ONLY = getAllPermissionIds().filter((id) => id.endsWith(".view"));
const CONTENT_MANAGER = [
  "dashboard.view",
  "solutions.view",
  "solutions.create",
  "solutions.edit",
  "blogs.view",
  "blogs.create",
  "blogs.edit",
  "learn.view",
  "learn.create",
  "learn.edit",
];

export const PERMISSION_TEMPLATES = [
  { id: "none", label: "No template (start blank)", permissions: [] },
  { id: "full", label: "Full access", permissions: getAllPermissionIds() },
  { id: "view", label: "View only", permissions: VIEW_ONLY },
  { id: "content", label: "Content manager", permissions: CONTENT_MANAGER },
];

export const getTemplatePermissions = (templateId) =>
  PERMISSION_TEMPLATES.find((template) => template.id === templateId)
    ?.permissions || [];

let ROLES = [
  {
    id: 1,
    name: "Super Admin",
    description: "Complete access to the platform",
    status: "Active",
    assignedUsers: 4,
    permissions: getAllPermissionIds(),
    createdDate: "2026-07-10T10:00:00Z",
    lastUpdated: "2026-07-15T12:00:00Z",
  },
  {
    id: 2,
    name: "Admin",
    description: "Manage most modules except destructive role changes",
    status: "Active",
    assignedUsers: 2,
    permissions: [
      "dashboard.view",
      "users.view",
      "users.create",
      "users.edit",
      "roles.view",
      "solutions.view",
      "solutions.create",
      "solutions.edit",
      "solutions.delete",
      "blogs.view",
      "blogs.create",
      "blogs.edit",
      "blogs.delete",
      "learn.view",
      "learn.create",
      "learn.edit",
      "demo.view",
      "demo.export",
      "settings.view",
    ],
    createdDate: "2026-06-01T10:00:00Z",
    lastUpdated: "2026-07-14T09:30:00Z",
  },
  {
    id: 3,
    name: "Manager",
    description: "Oversees solutions and demo requests with reporting access",
    status: "Active",
    assignedUsers: 3,
    permissions: [
      "dashboard.view",
      "solutions.view",
      "solutions.create",
      "solutions.edit",
      "demo.view",
      "demo.export",
      "learn.view",
    ],
    createdDate: "2026-05-18T10:00:00Z",
    lastUpdated: "2026-07-11T15:45:00Z",
  },
  {
    id: 4,
    name: "Editor",
    description: "Creates and edits solutions, blogs and learning content",
    status: "Active",
    assignedUsers: 3,
    permissions: [
      "dashboard.view",
      "solutions.view",
      "solutions.edit",
      "blogs.view",
      "blogs.create",
      "blogs.edit",
      "learn.view",
      "learn.create",
      "learn.edit",
    ],
    createdDate: "2026-04-22T10:00:00Z",
    lastUpdated: "2026-07-08T11:20:00Z",
  },
  {
    id: 5,
    name: "Reviewer",
    description: "Reviews content across modules without edit rights",
    status: "Inactive",
    assignedUsers: 0,
    permissions: [
      "dashboard.view",
      "solutions.view",
      "blogs.view",
      "learn.view",
      "demo.view",
    ],
    createdDate: "2026-03-30T10:00:00Z",
    lastUpdated: "2026-06-19T14:05:00Z",
  },
  {
    id: 6,
    name: "Viewer",
    description: "Read-only access to dashboards and lists",
    status: "Active",
    assignedUsers: 2,
    permissions: VIEW_ONLY,
    createdDate: "2026-02-14T10:00:00Z",
    lastUpdated: "2026-05-27T10:10:00Z",
  },
  {
    id: 7,
    name: "Guest",
    description: "Limited temporary access, pending approval",
    status: "Draft",
    assignedUsers: 0,
    permissions: ["dashboard.view"],
    createdDate: "2026-07-05T10:00:00Z",
    lastUpdated: "2026-07-05T10:00:00Z",
  },
];

const ACTIVITY_HISTORY = {
  default: [
    { id: "h1", action: "Permissions updated", by: "Aarav Sharma", at: "2026-07-15T12:00:00Z" },
    { id: "h2", action: "Role activated", by: "Isha Verma", at: "2026-07-10T09:20:00Z" },
    { id: "h3", action: "Role created", by: "Aarav Sharma", at: "2026-07-05T10:00:00Z" },
  ],
};

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));

const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const nextId = () =>
  ROLES.reduce((max, role) => Math.max(max, Number(role.id) || 0), 0) + 1;

export const fetchRoles = () => delay(clone(ROLES));

export const fetchRoleById = (id) =>
  delay(clone(ROLES.find((role) => String(role.id) === String(id)) || null));

export const createRole = (payload) => {
  const now = new Date().toISOString();
  const role = {
    id: nextId(),
    assignedUsers: 0,
    permissions: [],
    createdDate: now,
    lastUpdated: now,
    ...payload,
  };
  ROLES = [role, ...ROLES];
  return delay(clone(role));
};

export const updateRole = (id, updates) => {
  ROLES = ROLES.map((role) =>
    String(role.id) === String(id)
      ? { ...role, ...updates, lastUpdated: new Date().toISOString() }
      : role,
  );
  return delay(
    clone(ROLES.find((role) => String(role.id) === String(id)) || null),
  );
};

export const deleteRole = (id) => {
  ROLES = ROLES.filter((role) => String(role.id) !== String(id));
  return delay(true);
};

export const setRoleStatus = (id, status) => updateRole(id, { status });

export const duplicateRole = (id) => {
  const source = ROLES.find((role) => String(role.id) === String(id));
  if (!source) return delay(null);

  const now = new Date().toISOString();
  const copy = {
    ...clone(source),
    id: nextId(),
    name: `${source.name} (Copy)`,
    status: "Draft",
    assignedUsers: 0,
    createdDate: now,
    lastUpdated: now,
  };
  ROLES = [copy, ...ROLES];
  return delay(clone(copy));
};

export const fetchRoleActivityHistory = (id) =>
  delay(clone(ACTIVITY_HISTORY[id] || ACTIVITY_HISTORY.default));
