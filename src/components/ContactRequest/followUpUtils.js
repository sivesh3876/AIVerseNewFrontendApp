// Follow-up utilities and pipeline stage suggestions.

export const FOLLOW_UP_TYPES = [
  "Call",
  "Email",
  "Demo",
  "Meeting",
  "Reminder",
  "Custom",
];

const TEAM_MEMBERS_STORAGE_KEY = "aiverse.followUpTeamMembers";

/** Built-in list kept empty — no demo names. Users add members in the modal. */
export const TEAM_MEMBERS = [];

export const loadTeamMembers = () => {
  try {
    const raw = window.localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return [
      ...new Set(
        parsed
          .map((name) => String(name || "").trim())
          .filter(Boolean),
      ),
    ];
  } catch {
    return [];
  }
};

export const saveTeamMember = (name) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    return loadTeamMembers();
  }

  const next = [...new Set([...loadTeamMembers(), trimmed])];
  try {
    window.localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures; still return in-memory list for this session.
  }
  return next;
};

/** Suggested follow-up based on pipeline stage. User can override before save. */
export const STAGE_FOLLOW_UP_SUGGESTIONS = {
  Contacted: { type: "Email", label: "Follow-up Email" },
  Qualified: { type: "Demo", label: "Product Demo" },
  "Meeting Scheduled": { type: "Reminder", label: "Meeting Reminder" },
  "Proposal Sent": { type: "Meeting", label: "Proposal Review" },
  Won: { type: "Meeting", label: "Onboarding Meeting" },
  Lost: { type: "Call", label: "Feedback Call" },
  Closed: null,
};

export const getSuggestedFollowUp = (stage) =>
  STAGE_FOLLOW_UP_SUGGESTIONS[stage] || { type: "Call", label: "Follow-up Call" };

export const formatFollowUpDateTime = (date, time) => {
  if (!date) return "—";
  const value = time ? `${date}T${time}` : date;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return `${date}${time ? ` ${time}` : ""}`;
  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: time ? "2-digit" : undefined,
    minute: time ? "2-digit" : undefined,
  });
};

export const formatNoteDateTime = (value) => {
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
