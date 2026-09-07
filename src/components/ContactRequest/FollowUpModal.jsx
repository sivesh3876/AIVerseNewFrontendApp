import { useEffect, useMemo, useState } from "react";
import {
  FOLLOW_UP_TYPES,
  EMAIL_RE,
  ensureAssigneesInList,
  ensureMemberInList,
  fetchSolutionOwnerMembers,
  formatAssigneesLabel,
  getMemberEmails,
  getSuggestedFollowUp,
  joinAssigneeEmails,
  joinAssigneeNames,
  loadTeamMembers,
  mergeTeamMembers,
  resolveDefaultAssigneeNames,
  saveTeamMember,
} from "./followUpUtils";

const EMPTY_FORM = {
  type: "Call",
  customLabel: "",
  date: "",
  time: "",
  assignedTo: [],
  notes: "",
  reminder: false,
};

const FollowUpModal = ({
  open,
  onClose,
  pipelineStage,
  defaultAssignee = "Unassigned",
  saving = false,
  onSave,
}) => {
  const suggestion = useMemo(
    () => getSuggestedFollowUp(pipelineStage),
    [pipelineStage],
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    const prepareMembers = async () => {
      const [owners, storedMembers] = await Promise.all([
        fetchSolutionOwnerMembers(),
        Promise.resolve(loadTeamMembers()),
      ]);
      if (!isMounted) return;

      const withDefault = ensureAssigneesInList(
        mergeTeamMembers(owners, storedMembers),
        defaultAssignee,
      );

      setMembers(withDefault);
      setIsAddingMember(withDefault.length === 0);
      setNewMemberName("");
      setNewMemberEmail("");

      const assignedTo = resolveDefaultAssigneeNames(
        defaultAssignee,
        withDefault,
      );

      if (suggestion) {
        setForm({
          ...EMPTY_FORM,
          type: suggestion.type,
          customLabel: suggestion.label,
          assignedTo,
        });
      } else {
        setForm({
          ...EMPTY_FORM,
          assignedTo,
        });
      }
      setError("");
    };

    prepareMembers();

    return () => {
      isMounted = false;
    };
  }, [open, suggestion, defaultAssignee]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isAssigneeSelected = (name) =>
    form.assignedTo.some(
      (entry) =>
        String(entry || "").trim().toLowerCase() ===
        String(name || "").trim().toLowerCase(),
    );

  const handleToggleAssignee = (member) => {
    const name = member.name;
    setIsAddingMember(false);
    setError("");
    setForm((prev) => {
      const already = prev.assignedTo.some(
        (entry) =>
          String(entry || "").trim().toLowerCase() ===
          String(name || "").trim().toLowerCase(),
      );
      const selected = already
        ? prev.assignedTo.filter(
            (entry) =>
              String(entry || "").trim().toLowerCase() !==
              String(name || "").trim().toLowerCase(),
          )
        : [...prev.assignedTo, name];
      return { ...prev, assignedTo: selected };
    });
  };

  const handleAddMember = () => {
    const trimmedName = newMemberName.trim();
    const trimmedEmail = newMemberEmail.trim();

    if (!trimmedName) {
      setError("Please enter a team member name.");
      return;
    }
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid team member email.");
      return;
    }

    const nextMembers = saveTeamMember(trimmedName, trimmedEmail);
    const withDefault = ensureAssigneesInList(
      ensureMemberInList(nextMembers, defaultAssignee),
      defaultAssignee,
    );

    setMembers(withDefault);
    setForm((prev) => {
      const already = prev.assignedTo.some(
        (entry) =>
          String(entry || "").trim().toLowerCase() ===
          trimmedName.toLowerCase(),
      );
      return {
        ...prev,
        assignedTo: already ? prev.assignedTo : [...prev.assignedTo, trimmedName],
      };
    });
    setIsAddingMember(false);
    setNewMemberName("");
    setNewMemberEmail("");
    setError("");
  };

  const handleSubmit = () => {
    if (!form.date) {
      setError("Date is required.");
      return;
    }
    if (!form.time) {
      setError("Time is required.");
      return;
    }
    if (isAddingMember) {
      setError("Please finish adding the team member, or cancel.");
      return;
    }
    if (!form.assignedTo.length) {
      setError("Please assign at least one team member.");
      return;
    }
    if (form.type === "Custom" && !form.customLabel.trim()) {
      setError("Please enter a custom follow-up type.");
      return;
    }

    const emails = getMemberEmails(members, form.assignedTo);
    if (form.reminder) {
      if (emails.length !== form.assignedTo.length) {
        setError(
          "Reminder emails need every selected assignee to have a valid email.",
        );
        return;
      }
      if (emails.some((email) => !EMAIL_RE.test(email))) {
        setError(
          "Reminder emails need every selected assignee to have a valid email.",
        );
        return;
      }
    }

    onSave?.({
      type: form.type,
      customLabel: form.customLabel.trim(),
      date: form.date,
      time: form.time,
      assignedTo: joinAssigneeNames(form.assignedTo),
      assignedToEmail: joinAssigneeEmails(emails),
      notes: form.notes.trim(),
      reminder: form.reminder,
    });
  };

  return (
    <div
      className="admin_demo_modal__overlay admin_contact_followup_overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="follow-up-modal-title"
      onClick={onClose}
    >
      <div
        className="admin_demo_modal admin_demo_modal--detail admin_contact_followup_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin_demo_modal__header">
          <div>
            <p className="admin_demo_modal__eyebrow">Schedule Follow-up</p>
            <h3 id="follow-up-modal-title">New follow-up</h3>
            {suggestion && (
              <p>
                Suggested for <strong>{pipelineStage}</strong>: {suggestion.label}
              </p>
            )}
          </div>
          <button
            type="button"
            className="admin_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
            disabled={saving}
          >
            &times;
          </button>
        </header>

        <div className="admin_demo_modal__body">
          {error && <p className="admin_request_demos__error">{error}</p>}

          <div className="admin_blog_form__grid">
            <label className="admin_blog_form__field">
              <span>Follow-up Type *</span>
              <select
                value={form.type}
                onChange={(event) => handleChange("type", event.target.value)}
              >
                {FOLLOW_UP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin_blog_form__field">
              <span>
                {form.type === "Custom" ? "Custom Type *" : "Type Label"}
              </span>
              <input
                type="text"
                value={form.customLabel}
                onChange={(event) =>
                  handleChange("customLabel", event.target.value)
                }
                placeholder="e.g. Introductory Call"
              />
            </label>

            <label className="admin_blog_form__field">
              <span>Date *</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => handleChange("date", event.target.value)}
              />
            </label>

            <label className="admin_blog_form__field">
              <span>Time *</span>
              <input
                type="time"
                value={form.time}
                onChange={(event) => handleChange("time", event.target.value)}
              />
            </label>

            <div className="admin_contact_followup_modal__assign-field">
              <span className="admin_contact_followup_modal__assign-label">
                Assigned Team Members * (multiple)
              </span>
              <p className="admin_contact_followup_modal__assignees-summary">
                {form.assignedTo.length === 0
                  ? "None selected"
                  : formatAssigneesLabel(form.assignedTo)}
              </p>

              <div
                className="admin_contact_followup_modal__assignees"
                role="group"
                aria-label="Assignable team members"
              >
                {members.length === 0 ? (
                  <p className="admin_contact_followup_modal__assignees-empty">
                    No team members found. Add one below.
                  </p>
                ) : (
                  members.map((member) => {
                    const checked = isAssigneeSelected(member.name);
                    return (
                      <label
                        key={member.name}
                        className={`admin_contact_followup_modal__assignee${
                          checked ? " is-selected" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleAssignee(member)}
                          disabled={saving}
                        />
                        <span className="admin_contact_followup_modal__assignee-meta">
                          <span className="admin_contact_followup_modal__assignee-name">
                            {member.name}
                          </span>
                          {member.email ? (
                            <span className="admin_contact_followup_modal__assignee-email">
                              {member.email}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              {!isAddingMember ? (
                <button
                  type="button"
                  className="admin_contact_assignees__add-btn"
                  onClick={() => {
                    setIsAddingMember(true);
                    setNewMemberName("");
                    setNewMemberEmail("");
                    setError("");
                  }}
                  disabled={saving}
                >
                  + Add team member
                </button>
              ) : (
                <div className="admin_contact_followup_modal__add-member">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(event) => setNewMemberName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddMember();
                      }
                    }}
                    placeholder="Enter member name"
                    autoFocus
                  />
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(event) => setNewMemberEmail(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddMember();
                      }
                    }}
                    placeholder="Enter member email"
                  />
                  <button
                    type="button"
                    className="admin_request_demos__btn admin_request_demos__btn--primary"
                    onClick={handleAddMember}
                    disabled={saving}
                  >
                    Add
                  </button>
                  {members.length > 0 && (
                    <button
                      type="button"
                      className="admin_request_demos__btn admin_request_demos__btn--secondary"
                      onClick={() => {
                        setIsAddingMember(false);
                        setNewMemberName("");
                        setNewMemberEmail("");
                        setError("");
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>

            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>Notes</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => handleChange("notes", event.target.value)}
                placeholder="Add context for this follow-up..."
              />
            </label>

            <label className="admin_blog_form__field admin_blog_form__field--full admin_contact_followup_modal__toggle">
              <input
                type="checkbox"
                checked={form.reminder}
                onChange={(event) =>
                  handleChange("reminder", event.target.checked)
                }
              />
              <span>Send reminder notification</span>
            </label>

            {form.reminder && (
              <p className="admin_contact_followup_modal__hint">
                A confirmation email with the date and time will be sent now to
                the lead and all selected team members. Another reminder will be
                sent at the scheduled date and time.
              </p>
            )}
          </div>
        </div>

        <footer className="admin_demo_modal__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : "Schedule Follow-up"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FollowUpModal;
