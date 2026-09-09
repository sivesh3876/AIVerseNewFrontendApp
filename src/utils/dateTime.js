/**
 * Parse API/SQL datetimes. Naive ISO strings (no Z / offset) are treated as UTC
 * so browsers in IST (etc.) do not show wall-clock UTC as local time.
 */
export const parseApiDateTime = (value) => {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw)) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // ISO or SQL datetime without timezone → UTC
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw)) {
    const parsed = new Date(`${raw}Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(raw)) {
    const parsed = new Date(`${raw.replace(" ", "T")}Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // Date-only or free-form labels (e.g. preferred callback) — leave as-is
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatApiDateTime = (value) => {
  const parsed = parseApiDateTime(value);
  if (!parsed) return value ? String(value) : "—";
  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatApiDate = (value) => {
  const parsed = parseApiDateTime(value);
  if (!parsed) return value ? String(value) : "—";
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
