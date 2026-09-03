import { useEffect, useMemo, useState } from "react";
import {
  FOLLOW_UP_TYPES,
  EMAIL_RE,
  ensureMemberInList,
  fetchSolutionOwnerMembers,
  getMemberEmail,
  getSuggestedFollowUp,
  loadTeamMembers,
  mergeTeamMembers,
  saveTeamMember,
} from "./followUpUtils";

const ADD_MEMBER_VALUE = "__add_member__";

const EMPTY_FORM = {
  type: "Call",
  customLabel: "",
  date: "",
  time: "",
  assignedTo: "",
  notes: "",
  reminder: false,
};

const resolveDefaultAssignee = (defaultAssignee, members) => {
  if (defaultAssignee && defaultAssignee !== "Unassigned") {
    return defaultAssignee;
  }
  return members[0]?.name || "";
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

      const withDefault = ensureMemberInList(
        mergeTeamMembers(owners, storedMembers),
        defaultAssignee,
      );

      setMembers(withDefault);
      setIsAddingMember(withDefault.length === 0);
      setNewMemberName("");
      setNewMemberEmail("");

      const assignedTo = resolveDefaultAssignee(defaultAssignee, withDefault);

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

  const handleAssigneeSelect = (value) => {
    if (value === ADD_MEMBER_VALUE) {
      setIsAddingMember(true);
      setNewMemberName("");
      setNewMemberEmail("");
      return;
    }

    setIsAddingMember(false);
    setNewMemberName("");
    setNewMemberEmail("");
    handleChange("assignedTo", value);
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
    const withDefault = ensureMemberInList(nextMembers, defaultAssignee);

    setMembers(withDefault);
    setForm((prev) => ({ ...prev, assignedTo: trimmedName }));
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
      setError("Please add or select a team member.");
      return;
    }
    if (!form.assignedTo) {
      setError("Please assign a team member.");
      return;
    }
    if (form.type === "Custom" && !form.customLabel.trim()) {
      setError("Please enter a custom follow-up type.");
      return;
    }

    const assignedToEmail = getMemberEmail(members, form.assignedTo);
    if (form.reminder) {
      if (!assignedToEmail || !EMAIL_RE.test(assignedToEmail)) {
        setError(
          "Reminder emails need an assignee with a valid email. Add or update the team member.",
        );
        return;
      }
    }

    onSave?.({
      type: form.type,
      customLabel: form.customLabel.trim(),
      date: form.date,
      time: form.time,
      assignedTo: form.assignedTo,
      assignedToEmail,
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

            <div className="admin_blog_form__field admin_blog_form__field--full">
              <span>Assigned Team Member *</span>
              <select
                value={isAddingMember ? ADD_MEMBER_VALUE : form.assignedTo}
                onChange={(event) => handleAssigneeSelect(event.target.value)}
              >
                {members.length === 0 && !isAddingMember && (
                  <option value="" disabled>
                    Select team member
                  </option>
                )}
                {members.map((member) => (
                  <option key={member.name} value={member.name}>
                    {member.email
                      ? `${member.name} (${member.email})`
                      : member.name}
                  </option>
                ))}
                <option value={ADD_MEMBER_VALUE}>+ Add team member</option>
              </select>

              {isAddingMember && (
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
                the lead and assigned team member. Another reminder will be sent
                at the scheduled date and time.
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
