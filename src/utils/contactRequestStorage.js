// Shared localStorage utility for contact form submissions.
// The public Contact form writes here; the admin Contact Requests page reads.

const STORAGE_KEY = "aiverse_contact_requests";

const getAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAll = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent("aiverse:contact-requests-updated"));
};

const AVATAR_COLORS = [
  "#3A8D9D", "#7c3aed", "#db2777", "#ea580c", "#16a34a",
  "#2563eb", "#0d9488", "#9333ea", "#e11d48", "#0891b2",
];

const nextId = (requests) =>
  requests.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;

export const addContactRequest = ({ name, email, company, phone, reason, message }) => {
  const requests = getAll();
  const id = nextId(requests);

  const entry = {
    id,
    name: name || "Unknown",
    company: company || "—",
    email: email || "—",
    phone: phone || "—",
    country: "—",
    industry: "—",
    message: message || "—",
    reason: reason || "General Inquiry",
    stage: "New",
    priority: "Medium",
    status: "Open",
    assignedTo: "Unassigned",
    submittedAt: new Date().toISOString(),
    avatarColor: AVATAR_COLORS[id % AVATAR_COLORS.length],
    activities: [
      { id: "a1", label: "Request Received", at: new Date().toISOString() },
    ],
  };

  requests.unshift(entry);
  saveAll(requests);
  return entry;
};

export const getContactRequests = () => getAll();

export const updateStoredContactRequestStage = (id, stage) => {
  const requests = getAll();
  const index = requests.findIndex((r) => String(r.id) === String(id));
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated = {
    ...requests[index],
    stage,
    activities: [
      ...(requests[index].activities || []),
      {
        id: `a-${Date.now()}`,
        label: `Stage changed to ${stage}`,
        at: now,
      },
    ],
  };

  requests[index] = updated;
  saveAll(requests);
  return updated;
};

export const clearContactRequests = () => {
  localStorage.removeItem(STORAGE_KEY);
};
