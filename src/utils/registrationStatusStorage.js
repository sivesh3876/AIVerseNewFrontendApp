/**
 * Registration reminder status — ONLY the Registration form may set this.
 *
 * Do NOT mark registration complete from Contact Us, Schedule Callback,
 * Request Demo, Newsletter, or any other form submission.
 */

const STORAGE_KEY = "aiverse_registration_completed";
export const REGISTRATION_COMPLETED_EVENT = "aiverse:registration-completed";

/** Only accepted completion source for mandatory registration. */
export const REGISTRATION_FORM_SOURCE = "registration_form";

const readStatus = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Legacy boolean flag from earlier builds
    if (raw === "true") {
      return {
        registered: true,
        via: REGISTRATION_FORM_SOURCE,
      };
    }

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
};

/**
 * True only when the visitor successfully submitted the Registration form.
 * Other lead/form types never influence this value.
 */
export const hasCompletedRegistration = () => {
  const status = readStatus();
  if (!status?.registered) return false;
  // Reject anything not explicitly tied to the registration form
  return status.via === REGISTRATION_FORM_SOURCE;
};

/**
 * Persist registration completion. Call ONLY after the Registration form
 * submits successfully (RegisterModal). Never call from other forms.
 */
export const markRegistrationCompleted = () => {
  const payload = {
    registered: true,
    via: REGISTRATION_FORM_SOURCE,
    completedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore private-mode / quota errors; still notify in-session listeners.
  }

  window.dispatchEvent(
    new CustomEvent(REGISTRATION_COMPLETED_EVENT, { detail: payload }),
  );
};
