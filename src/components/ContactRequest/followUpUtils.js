// Follow-up utilities and pipeline stage suggestions.

export const FOLLOW_UP_TYPES = [
  "Call",
  "Email",
  "Demo",
  "Meeting",
  "Reminder",
  "Custom",
];

export const TEAM_MEMBERS = [
  "Priya Nair",
  "Rohan Mehta",
  "Isha Verma",
  "Aarav Sharma",
];

/** Suggested follow-up based on pipeline stage. User can override before save. */
export const STAGE_FOLLOW_UP_SUGGESTIONS = {
  New: { type: "Call", label: "Introductory Call" },
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
