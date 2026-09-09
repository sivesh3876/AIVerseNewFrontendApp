import { buildApiPath } from "../../services/apiConfig";

// Follow-up utilities and pipeline stage suggestions.

export const FOLLOW_UP_TYPES = [
  "Call",
  "Email",
  "Demo",
  "Meeting",
  "Reminder",
  "Custom",
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEAM_MEMBERS_STORAGE_KEY = "aiverse.followUpTeamMembers";

/** Built-in list kept empty — no demo names. Users add members in the modal. */
export const TEAM_MEMBERS = [];

const normalizeMember = (entry) => {
  if (typeof entry === "string") {
    const name = entry.trim();
    return name ? { name, email: "" } : null;
  }

  if (entry && typeof entry === "object") {
    const name = String(entry.name || entry.Name || "").trim();
    if (!name) return null;
    return {
      name,
      email: String(entry.email || entry.Email || "").trim(),
    };
  }

  return null;
};

const dedupeMembers = (members = []) => {
  const byName = new Map();
  members.forEach((member) => {
    const normalized = normalizeMember(member);
    if (!normalized) return;
    const existing = byName.get(normalized.name.toLowerCase());
    if (!existing || (!existing.email && normalized.email)) {
      byName.set(normalized.name.toLowerCase(), normalized);
    }
  });
  return [...byName.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
};

export const loadTeamMembers = () => {
  try {
    const raw = window.localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return dedupeMembers(parsed);
  } catch {
    return [];
  }
};

export const saveTeamMember = (name, email = "") => {
  const trimmedName = String(name || "").trim();
  if (!trimmedName) {
    return loadTeamMembers();
  }

  const next = dedupeMembers([
    ...loadTeamMembers(),
    { name: trimmedName, email: String(email || "").trim() },
  ]);

  try {
    window.localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures; still return in-memory list for this session.
  }
  return next;
};

export const getMemberEmail = (members = [], name = "") => {
  const key = String(name || "").trim().toLowerCase();
  if (!key) return "";
  const match = members.find(
    (member) => String(member.name || "").trim().toLowerCase() === key,
  );
  return match?.email || "";
};

export const ensureMemberInList = (members = [], name = "", email = "") => {
  const trimmedName = String(name || "").trim();
  if (
    !trimmedName ||
    trimmedName === "Unassigned" ||
    members.some(
      (member) =>
        String(member.name || "").trim().toLowerCase() ===
        trimmedName.toLowerCase(),
    )
  ) {
    return members;
  }
  return dedupeMembers([{ name: trimmedName, email }, ...members]);
};

export const mergeTeamMembers = (...lists) => dedupeMembers(lists.flat());

/** Parse lead.assignedTo (string or array) into { name, email }[]. */
export const parseAssignees = (value, memberDirectory = []) => {
  if (Array.isArray(value)) {
    return dedupeMembers(
      value.map((entry) => {
        const normalized = normalizeMember(entry);
        if (!normalized) return null;
        if (normalized.email) return normalized;
        return {
          ...normalized,
          email: getMemberEmail(memberDirectory, normalized.name),
        };
      }),
    );
  }

  const text = String(value || "").trim();
  if (!text || text === "Unassigned") {
    return [];
  }

  return dedupeMembers(
    text.split(",").map((part) => {
      const name = part.trim();
      if (!name) return null;
      return {
        name,
        email: getMemberEmail(memberDirectory, name),
      };
    }),
  );
};

export const formatAssigneesLabel = (assignees = []) => {
  const names = parseAssignees(assignees)
    .map((member) => member.name)
    .filter(Boolean);
  return names.length > 0 ? names.join(", ") : "Unassigned";
};

export const leadMatchesAssigneeFilter = (assignedTo, filterValue) => {
  if (!filterValue || filterValue === "all") return true;
  const filter = String(filterValue).trim().toLowerCase();
  if (!filter) return true;

  const assignees = parseAssignees(assignedTo);
  if (filter === "unassigned") {
    return assignees.length === 0;
  }

  return assignees.some(
    (member) => member.name.trim().toLowerCase() === filter,
  );
};

/** COE / solution owners used by Solution New AI — same list for Assign To. */
export const fetchSolutionOwnerMembers = async () => {
  try {
    const response = await fetch(buildApiPath("get-solution-owners"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.status !== "success") {
      return [];
    }
    const list = Array.isArray(result.data) ? result.data : [];
    return dedupeMembers(list);
  } catch {
    return [];
  }
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

export const getSuggestedFollowUp = (stage) => {
  if (Object.prototype.hasOwnProperty.call(STAGE_FOLLOW_UP_SUGGESTIONS, stage)) {
    return STAGE_FOLLOW_UP_SUGGESTIONS[stage];
  }
  return { type: "Call", label: "Follow-up Call" };
};

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
