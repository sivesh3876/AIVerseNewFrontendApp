import { useEffect, useMemo, useState } from "react";
import TeamMemberMultiSelect from "./TeamMemberMultiSelect";
import {
  FOLLOW_UP_TYPES,
  EMAIL_RE,
  ensureMemberInList,
  fetchSolutionOwnerMembers,
  getMemberEmail,
  getSuggestedFollowUp,
  loadTeamMembers,
  mergeTeamMembers,
  parseAssignees,
  saveTeamMember,
} from "./followUpUtils";

const EMPTY_FORM = {
  type: "Call",
  customLabel: "",
  date: "",
  time: "",
  notes: "",
  reminder: false,
};

const resolveDefaultAssignees = (defaultAssignees, members) => {
  const fromProp = Array.isArray(defaultAssignees)
    ? defaultAssignees
    : parseAssignees(defaultAssignees, members);

  if (fromProp.length > 0) {
    return fromProp.map((person) => ({
      name: person.name,
      email:
        person.email || getMemberEmail(members, person.name) || "",
    }));
  }

  if (members[0]) {
    return [{ name: members[0].name, email: members[0].email || "" }];
  }

  return [];
};

const FollowUpModal = ({
  open,
  onClose,
  pipelineStage,
  defaultAssignees = [],
  /** @deprecated use defaultAssignees */
  defaultAssignee = "Unassigned",
  saving = false,
  onSave,
}) => {
  const suggestion = useMemo(
    () => getSuggestedFollowUp(pipelineStage),
    [pipelineStage],
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
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

      const legacyDefault =
        Array.isArray(defaultAssignees) && defaultAssignees.length > 0
          ? defaultAssignees
          : defaultAssignee;

      let directory = mergeTeamMembers(owners, storedMembers);
      const seedAssignees = resolveDefaultAssignees(legacyDefault, directory);
      directory = seedAssignees.reduce(
        (list, person) => ensureMemberInList(list, person.name, person.email),
        directory,
      );

      setMembers(directory);
      setIsAddingMember(directory.length === 0);
      setNewMemberName("");
      setNewMemberEmail("");
      setSelectedAssignees(seedAssignees);

      if (suggestion) {
        setForm({
          ...EMPTY_FORM,
          type: suggestion.type,
          customLabel: suggestion.label,
        });
      } else {
        setForm({ ...EMPTY_FORM });
      }
      setError("");
    };

    prepareMembers();

    return () => {
      isMounted = false;
    };
  }, [open, suggestion, defaultAssignees, defaultAssignee]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    const withDefault = ensureMemberInList(nextMembers, trimmedName, trimmedEmail);
    const person = { name: trimmedName, email: trimmedEmail };

    setMembers(mergeTeamMembers(members, withDefault));
    setSelectedAssignees((prev) => {
      const exists = prev.some(
        (item) =>
          item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      );
      return exists ? prev : [...prev, person];
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
      setError("Please add or select a team member.");
      return;
    }
    if (selectedAssignees.length === 0) {
      setError("Please assign at least one team member.");
      return;
    }
    if (form.type === "Custom" && !form.customLabel.trim()) {
      setError("Please enter a custom follow-up type.");
      return;
    }

    const resolvedAssignees = selectedAssignees.map((person) => ({
      name: person.name,
      email:
        person.email || getMemberEmail(members, person.name) || "",
    }));

    if (form.reminder) {
      const missingEmail = resolvedAssignees.some(
        (person) => !person.email || !EMAIL_RE.test(person.email),
      );
      if (missingEmail) {
        setError(
          "Reminder emails need every assignee to have a valid email. Add or update team members.",
        );
        return;
      }
    }

    onSave?.({
      type: form.type,
      customLabel: form.customLabel.trim(),
      date: form.date,
      time: form.time,
      assignedTo: resolvedAssignees.map((person) => person.name).join(", "),
      assignedToEmail: resolvedAssignees
        .map((person) => person.email)
        .filter(Boolean)
        .join(", "),
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
              <span>Assigned Team Members *</span>
              <TeamMemberMultiSelect
                members={members}
                selected={selectedAssignees}
                onChange={setSelectedAssignees}
                title="Assign To"
                subtitle="Select team members (multiple)"
                showHeader={false}
                isAddingMember={isAddingMember}
                onStartAddMember={() => {
                  setIsAddingMember(true);
                  setError("");
                }}
                onCancelAddMember={() => {
                  setIsAddingMember(false);
                  setNewMemberName("");
                  setNewMemberEmail("");
                  setError("");
                }}
                newMemberName={newMemberName}
                newMemberEmail={newMemberEmail}
                onNewMemberNameChange={setNewMemberName}
                onNewMemberEmailChange={setNewMemberEmail}
                onAddMember={handleAddMember}
                saving={saving}
              />
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
                the lead and assigned team members. Another reminder will be sent
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
