import { useEffect, useMemo, useState } from "react";
import {
  FOLLOW_UP_TYPES,
  TEAM_MEMBERS,
  getSuggestedFollowUp,
} from "./followUpUtils";

const EMPTY_FORM = {
  type: "Call",
  customLabel: "",
  date: "",
  time: "",
  assignedTo: TEAM_MEMBERS[0],
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

  useEffect(() => {
    if (!open) return;

    if (suggestion) {
      setForm({
        ...EMPTY_FORM,
        type: suggestion.type,
        customLabel: suggestion.label,
        assignedTo:
          defaultAssignee !== "Unassigned" ? defaultAssignee : TEAM_MEMBERS[0],
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        assignedTo:
          defaultAssignee !== "Unassigned" ? defaultAssignee : TEAM_MEMBERS[0],
      });
    }
    setError("");
  }, [open, suggestion, defaultAssignee]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    if (!form.assignedTo) {
      setError("Please assign a team member.");
      return;
    }
    if (form.type === "Custom" && !form.customLabel.trim()) {
      setError("Please enter a custom follow-up type.");
      return;
    }

    onSave?.({
      type: form.type,
      customLabel: form.customLabel.trim(),
      date: form.date,
      time: form.time,
      assignedTo: form.assignedTo,
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
              <p>Suggested for <strong>{pipelineStage}</strong>: {suggestion.label}</p>
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

            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>Assigned Team Member *</span>
              <select
                value={form.assignedTo}
                onChange={(event) =>
                  handleChange("assignedTo", event.target.value)
                }
              >
                {TEAM_MEMBERS.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>

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
