/** Ordered landing routes for Admin Portal after login / access denial. */
const LANDING_CANDIDATES = [
  { permission: "dashboard.view", path: "/admin" },
  { permission: "blogs.view", path: "/admin/blogs" },
  { permission: "success_stories.view", path: "/admin/success-stories" },
  { permission: "learn.view", path: "/admin/learn-explore" },
  { permission: "solutions.view", path: "/admin/solution-new-ai" },
  { permission: "leads.view", path: "/admin/contact-requests" },
  { permission: "demo.view", path: "/admin/request-demos/solution-info" },
  { permission: "roles.view", path: "/admin/role-management" },
  { permission: "users.view", path: "/admin/user-management" },
];

export const getAdminLandingPath = (permissions = []) => {
  const granted = new Set(
    (Array.isArray(permissions) ? permissions : []).map(String),
  );
  const match = LANDING_CANDIDATES.find((item) => granted.has(item.permission));
  return match?.path || "/admin/login";
};
