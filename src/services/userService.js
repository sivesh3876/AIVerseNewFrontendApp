// User Management service.
//
// This module owns all "API" access for the User Management module. It currently
// serves dummy JSON data through promise-based methods that mimic real network
// calls. When a backend is available, only the internals of these functions need
// to change - the calling components stay untouched.
//
// It is intentionally self-contained and scalable: roles, departments and
// permissions are exported so that a future Role Management / Permission
// Management module can reuse the same source of truth.

const NETWORK_DELAY = 350;

export const USER_ROLES = [
  "Super Admin",
  "Admin",
  "Manager",
  "Editor",
  "Viewer",
];

export const USER_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
];

export const USER_STATUSES = ["Active", "Inactive", "Pending"];

// Permission presets keyed by role. Kept here so Permission Management can grow
// from the same definition later.
export const ROLE_PERMISSIONS = {
  "Super Admin": [
    "Manage users",
    "Manage roles",
    "Manage permissions",
    "Manage solutions",
    "Manage blogs",
    "View analytics",
    "Export data",
  ],
  Admin: [
    "Manage users",
    "Manage solutions",
    "Manage blogs",
    "View analytics",
    "Export data",
  ],
  Manager: ["Manage solutions", "View analytics", "Export data"],
  Editor: ["Manage solutions", "Manage blogs"],
  Viewer: ["View analytics"],
};

let USERS = [
  {
    id: 1,
    fullName: "Aarav Sharma",
    email: "aarav.sharma@espire.com",
    phone: "+91 98100 11223",
    employeeId: "ESP-1001",
    department: "Engineering",
    designation: "Principal Engineer",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2026-07-16T09:24:00Z",
    createdDate: "2024-01-12T10:00:00Z",
    avatarColor: "#3A8D9D",
  },
  {
    id: 2,
    fullName: "Isha Verma",
    email: "isha.verma@espire.com",
    phone: "+91 98200 44556",
    employeeId: "ESP-1002",
    department: "Product",
    designation: "Product Manager",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-07-15T14:02:00Z",
    createdDate: "2024-03-05T10:00:00Z",
    avatarColor: "#7c3aed",
  },
  {
    id: 3,
    fullName: "Rohan Mehta",
    email: "rohan.mehta@espire.com",
    phone: "+91 99300 77889",
    employeeId: "ESP-1003",
    department: "Design",
    designation: "Lead Designer",
    role: "Editor",
    status: "Pending",
    lastLogin: null,
    createdDate: "2025-11-20T10:00:00Z",
    avatarColor: "#db2777",
  },
  {
    id: 4,
    fullName: "Priya Nair",
    email: "priya.nair@espire.com",
    phone: "+91 90000 12345",
    employeeId: "ESP-1004",
    department: "Marketing",
    designation: "Marketing Lead",
    role: "Manager",
    status: "Active",
    lastLogin: "2026-07-14T08:45:00Z",
    createdDate: "2024-06-18T10:00:00Z",
    avatarColor: "#ea580c",
  },
  {
    id: 5,
    fullName: "Karthik Iyer",
    email: "karthik.iyer@espire.com",
    phone: "+91 91234 56789",
    employeeId: "ESP-1005",
    department: "Sales",
    designation: "Account Executive",
    role: "Viewer",
    status: "Inactive",
    lastLogin: "2026-05-30T17:10:00Z",
    createdDate: "2023-09-02T10:00:00Z",
    avatarColor: "#0891b2",
  },
  {
    id: 6,
    fullName: "Neha Kapoor",
    email: "neha.kapoor@espire.com",
    phone: "+91 93456 78901",
    employeeId: "ESP-1006",
    department: "Human Resources",
    designation: "HR Business Partner",
    role: "Manager",
    status: "Active",
    lastLogin: "2026-07-16T11:30:00Z",
    createdDate: "2024-02-27T10:00:00Z",
    avatarColor: "#16a34a",
  },
  {
    id: 7,
    fullName: "Vikram Singh",
    email: "vikram.singh@espire.com",
    phone: "+91 95678 90123",
    employeeId: "ESP-1007",
    department: "Finance",
    designation: "Finance Controller",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-07-13T16:20:00Z",
    createdDate: "2023-12-11T10:00:00Z",
    avatarColor: "#2563eb",
  },
  {
    id: 8,
    fullName: "Ananya Das",
    email: "ananya.das@espire.com",
    phone: "+91 96789 01234",
    employeeId: "ESP-1008",
    department: "Operations",
    designation: "Operations Analyst",
    role: "Viewer",
    status: "Pending",
    lastLogin: null,
    createdDate: "2025-10-08T10:00:00Z",
    avatarColor: "#9333ea",
  },
  {
    id: 9,
    fullName: "Sameer Khan",
    email: "sameer.khan@espire.com",
    phone: "+91 97890 12345",
    employeeId: "ESP-1009",
    department: "Engineering",
    designation: "Senior Engineer",
    role: "Editor",
    status: "Active",
    lastLogin: "2026-07-12T10:05:00Z",
    createdDate: "2024-08-19T10:00:00Z",
    avatarColor: "#0d9488",
  },
  {
    id: 10,
    fullName: "Meera Joshi",
    email: "meera.joshi@espire.com",
    phone: "+91 98901 23456",
    employeeId: "ESP-1010",
    department: "Product",
    designation: "Associate PM",
    role: "Viewer",
    status: "Inactive",
    lastLogin: "2026-04-22T09:15:00Z",
    createdDate: "2023-07-30T10:00:00Z",
    avatarColor: "#c026d3",
  },
  {
    id: 11,
    fullName: "Arjun Reddy",
    email: "arjun.reddy@espire.com",
    phone: "+91 90011 22334",
    employeeId: "ESP-1011",
    department: "Engineering",
    designation: "DevOps Engineer",
    role: "Editor",
    status: "Active",
    lastLogin: "2026-07-11T13:40:00Z",
    createdDate: "2024-05-14T10:00:00Z",
    avatarColor: "#4f46e5",
  },
  {
    id: 12,
    fullName: "Sanya Gupta",
    email: "sanya.gupta@espire.com",
    phone: "+91 90122 33445",
    employeeId: "ESP-1012",
    department: "Design",
    designation: "UX Researcher",
    role: "Viewer",
    status: "Active",
    lastLogin: "2026-07-10T15:55:00Z",
    createdDate: "2025-01-09T10:00:00Z",
    avatarColor: "#e11d48",
  },
];

// Dummy per-user login history + activity log. In a real backend these would be
// fetched from dedicated endpoints; they are keyed by user id here.
const LOGIN_HISTORY = {
  default: [
    { id: "l1", device: "Chrome · Windows", ip: "203.0.113.24", at: "2026-07-16T09:24:00Z", result: "Success" },
    { id: "l2", device: "Safari · macOS", ip: "203.0.113.51", at: "2026-07-14T18:02:00Z", result: "Success" },
    { id: "l3", device: "Chrome · Android", ip: "198.51.100.9", at: "2026-07-10T07:41:00Z", result: "Failed" },
  ],
};

const ACTIVITY_LOG = {
  default: [
    { id: "a1", action: "Updated profile details", at: "2026-07-16T10:05:00Z" },
    { id: "a2", action: "Published a new AI solution", at: "2026-07-15T12:20:00Z" },
    { id: "a3", action: "Exported user records", at: "2026-07-12T09:10:00Z" },
    { id: "a4", action: "Signed in", at: "2026-07-10T07:41:00Z" },
  ],
};

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));

const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const nextId = () =>
  USERS.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1;

export const getPermissionsForRole = (role) =>
  ROLE_PERMISSIONS[role] || [];

export const fetchUsers = () => delay(clone(USERS));

export const fetchUserById = (id) =>
  delay(clone(USERS.find((user) => String(user.id) === String(id)) || null));

export const createUser = (payload) => {
  const user = {
    id: nextId(),
    avatarColor: "#3A8D9D",
    lastLogin: null,
    createdDate: new Date().toISOString(),
    ...payload,
  };
  USERS = [user, ...USERS];
  return delay(clone(user));
};

export const updateUser = (id, updates) => {
  USERS = USERS.map((user) =>
    String(user.id) === String(id) ? { ...user, ...updates } : user,
  );
  return delay(
    clone(USERS.find((user) => String(user.id) === String(id)) || null),
  );
};

export const deleteUser = (id) => {
  USERS = USERS.filter((user) => String(user.id) !== String(id));
  return delay(true);
};

export const setUserStatus = (id, status) => updateUser(id, { status });

export const assignUserRole = (id, role) => updateUser(id, { role });

export const resetUserPassword = (id) =>
  // Placeholder for a real "send reset link" endpoint.
  delay({ id, success: true });

export const fetchUserLoginHistory = (id) =>
  delay(clone(LOGIN_HISTORY[id] || LOGIN_HISTORY.default));

export const fetchUserActivityLog = (id) =>
  delay(clone(ACTIVITY_LOG[id] || ACTIVITY_LOG.default));
