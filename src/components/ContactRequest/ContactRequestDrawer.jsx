import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatLeadTypeLabel } from "../../utils/contactRequestStorage";
import PipelineStage from "./PipelineStage";
import FollowUpList from "./FollowUpList";
import FollowUpModal from "./FollowUpModal";
import InternalNotes from "./InternalNotes";
import {
  loadTeamMembers,
  saveTeamMember,
  EMAIL_RE,
  ensureMemberInList,
  fetchSolutionOwnerMembers,
  mergeTeamMembers,
  parseAssignees,
  formatAssigneesLabel,
} from "./followUpUtils";

const SCHEDULE_CLICK_GUARD_MS = 450;

const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatDateTime = (value) => {
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

const InfoField = ({ label, children }) => (
  <div className="admin_contact_drawer__field">
    <span>{label}</span>
    <p>{children ?? "—"}</p>
  </div>
);

const ContactRequestDrawer = ({
  request,
  open,
  onClose,
  onStageChange,
  onStageSuccess,
  onStageError,
  followUps = [],
  loadingFollowUps = false,
  notes = [],
  onSaveFollowUp,
  savingFollowUp = false,
  onSaveNote,
  savingNote = false,
  onAssigneesChange,
}) => {
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [scheduleUnlocked, setScheduleUnlocked] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [assignError, setAssignError] = useState("");
  const scheduleIntentRef = useRef(false);

  useEffect(() => {
    setFollowUpModalOpen(false);
    setScheduleUnlocked(false);
    scheduleIntentRef.current = false;
    setIsAddingMember(false);
    setNewMemberName("");
    setNewMemberEmail("");
    setAssignError("");

    let isMounted = true;

    const loadAssignableMembers = async () => {
      setLoadingMembers(true);
      try {
        const [owners, stored] = await Promise.all([
          fetchSolutionOwnerMembers(),
          Promise.resolve(loadTeamMembers()),
        ]);
        if (!isMounted) return;

        const directory = mergeTeamMembers(owners, stored);
        const current = parseAssignees(request?.assignedTo, directory);
        const withSelected = current.reduce(
          (list, person) => ensureMemberInList(list, person.name, person.email),
          directory,
        );

        setMembers(withSelected);
        setSelectedAssignees(current);
      } finally {
        if (isMounted) {
          setLoadingMembers(false);
        }
      }
    };

    loadAssignableMembers();

    const timer = window.setTimeout(
      () => setScheduleUnlocked(true),
      SCHEDULE_CLICK_GUARD_MS,
    );

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [open, request?.requestKey, request?.stage, request?.assignedTo]);

  const persistAssignees = useCallback(
    (nextAssignees) => {
      setSelectedAssignees(nextAssignees);
      onAssigneesChange?.(request, formatAssigneesLabel(nextAssignees));
    },
    [onAssigneesChange, request],
  );

  const handleStageChange = useCallback(
    (newStage) => {
      setFollowUpModalOpen(false);
      scheduleIntentRef.current = false;
      return onStageChange?.(newStage);
    },
    [onStageChange],
  );

  const handleSchedulePointerDown = (event) => {
    scheduleIntentRef.current = true;
    event.stopPropagation();
  };

  const handleScheduleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!scheduleUnlocked || !scheduleIntentRef.current) {
      scheduleIntentRef.current = false;
      return;
    }

    scheduleIntentRef.current = false;
    setFollowUpModalOpen(true);
  };

  const isAssigneeSelected = (name) =>
    selectedAssignees.some(
      (person) =>
        person.name.trim().toLowerCase() === String(name || "").trim().toLowerCase(),
    );

  const handleToggleAssignee = (member) => {
    const selected = isAssigneeSelected(member.name);
    const next = selected
      ? selectedAssignees.filter(
          (person) =>
            person.name.trim().toLowerCase() !== member.name.trim().toLowerCase(),
        )
      : [...selectedAssignees, member];
    persistAssignees(next);
  };

  const handleRemoveAssignee = (name) => {
    persistAssignees(
      selectedAssignees.filter(
        (person) =>
          person.name.trim().toLowerCase() !== String(name || "").trim().toLowerCase(),
      ),
    );
  };

  const handleAddMember = () => {
    const trimmedName = newMemberName.trim();
    const trimmedEmail = newMemberEmail.trim();
    if (!trimmedName) {
      setAssignError("Please enter a team member name.");
      return;
    }
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setAssignError("Please enter a valid team member email.");
      return;
    }

    const nextMembers = saveTeamMember(trimmedName, trimmedEmail);
    const merged = mergeTeamMembers(members, nextMembers);
    const person = { name: trimmedName, email: trimmedEmail };
    setMembers(merged);
    persistAssignees(
      isAssigneeSelected(trimmedName)
        ? selectedAssignees
        : [...selectedAssignees, person],
    );
    setIsAddingMember(false);
    setNewMemberName("");
    setNewMemberEmail("");
    setAssignError("");
  };

  if (!open || !request) return null;

  const handleFollowUpSave = async (payload) => {
    try {
      await onSaveFollowUp?.(payload);
      setFollowUpModalOpen(false);
    } catch {
      // Parent shows error toast; keep modal open.
    }
  };

  const defaultFollowUpAssignee =
    selectedAssignees[0]?.name || "Unassigned";

  return (
    <>
      <button
        type="button"
        className="admin_contact_drawer__backdrop"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside className="admin_contact_drawer" role="dialog" aria-label="Contact request details">
        <header className="admin_contact_drawer__head">
          <div className="admin_contact_drawer__hero">
            <span
              className="admin_user_avatar admin_user_avatar--lg"
              style={{ background: request.avatarColor || "#3A8D9D" }}
              aria-hidden="true"
            >
              {getInitials(request.name)}
            </span>
            <div>
              <h2>{request.name}</h2>
              <p>{request.company}</p>
            </div>
          </div>
          <button
            type="button"
            className="admin_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="admin_contact_drawer__body">
          <section className="admin_contact_drawer__section">
            <h3>Basic Information</h3>
            <div className="admin_contact_drawer__grid">
              <InfoField label="Name">{request.name}</InfoField>
              <InfoField label="Company">{request.company}</InfoField>
              <InfoField label="Email">
                <a href={`mailto:${request.email}`}>{request.email}</a>
              </InfoField>
              <InfoField label="Phone">{request.phone}</InfoField>
              <InfoField label="Country">{request.country}</InfoField>
              <InfoField label="Industry">{request.industry}</InfoField>
              <InfoField label="Type">{formatLeadTypeLabel(request.type)}</InfoField>
              <InfoField label="Reason for Contact">
                {request.reason || "—"}
              </InfoField>
              {request.jobTitle ? (
                <InfoField label="Job Title">{request.jobTitle}</InfoField>
              ) : null}
              {request.companySize ? (
                <InfoField label="Company Size">{request.companySize}</InfoField>
              ) : null}
              {request.source ? (
                <InfoField label="Source">{request.source}</InfoField>
              ) : null}
            </div>
            {request.solutionTitle ? (
              <InfoField label="Solution">{request.solutionTitle}</InfoField>
            ) : null}
            {request.preferredCallbackTime ? (
              <InfoField label="Preferred Call Back Time">
                {formatDateTime(request.preferredCallbackTime)}
              </InfoField>
            ) : null}
            <InfoField label="Message">{request.message}</InfoField>
            <InfoField label="Registration / Submission Date">
              {formatDateTime(request.submittedAt)}
            </InfoField>
          </section>

          <section className="admin_contact_drawer__section">
            <h3>Assign To</h3>
            <div className="admin_blog_form__field admin_blog_form__field--full">
              <span>Team members (multiple)</span>

              <div className="admin_contact_assignees">
                {selectedAssignees.length === 0 ? (
                  <p className="admin_contact_assignees__empty">Unassigned</p>
                ) : (
                  <div className="admin_contact_assignees__chips">
                    {selectedAssignees.map((person) => (
                      <button
                        key={person.name}
                        type="button"
                        className="admin_contact_assignees__chip"
                        onClick={() => handleRemoveAssignee(person.name)}
                        title="Remove assignee"
                      >
                        <span>
                          {person.email
                            ? `${person.name} (${person.email})`
                            : person.name}
                        </span>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="admin_contact_assignees__list"
                  role="group"
                  aria-label="Assignable team members"
                >
                  {loadingMembers ? (
                    <p className="admin_contact_assignees__empty">
                      Loading team members…
                    </p>
                  ) : members.length === 0 ? (
                    <p className="admin_contact_assignees__empty">
                      No team members found. Add one below.
                    </p>
                  ) : (
                    members.map((member) => {
                      const checked = isAssigneeSelected(member.name);
                      return (
                        <label
                          key={member.name}
                          className={`admin_contact_assignees__option${
                            checked ? " is-selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleAssignee(member)}
                          />
                          <span className="admin_contact_assignees__meta">
                            <span className="admin_contact_assignees__name">
                              {member.name}
                            </span>
                            {member.email ? (
                              <span className="admin_contact_assignees__email">
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
                      setAssignError("");
                    }}
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
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="admin_request_demos__btn admin_request_demos__btn--secondary"
                      onClick={() => {
                        setIsAddingMember(false);
                        setNewMemberName("");
                        setNewMemberEmail("");
                        setAssignError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {assignError ? (
                <p className="admin_request_demos__error">{assignError}</p>
              ) : null}
            </div>
          </section>

          <section className="admin_contact_drawer__section">
            <h3>Pipeline Stage</h3>
            <PipelineStage
              key={request.requestKey || request.id}
              stage={request.stage}
              onStageChange={handleStageChange}
              onSuccess={onStageSuccess}
              onError={onStageError}
            />
          </section>

          <section className="admin_contact_drawer__section">
            <div className="admin_contact_drawer__section-head">
              <h3>Follow Ups</h3>
              <button
                type="button"
                className="admin_demo_toolbar__btn admin_demo_toolbar__btn--primary"
                disabled={!scheduleUnlocked}
                onPointerDown={handleSchedulePointerDown}
                onClick={handleScheduleClick}
              >
                Schedule Follow-up
              </button>
            </div>
            <FollowUpList followUps={followUps} loading={loadingFollowUps} />
          </section>

          <InternalNotes
            notes={notes}
            saving={savingNote}
            onSaveNote={onSaveNote}
          />

          <section className="admin_contact_drawer__section">
            <h3>Activity Timeline</h3>
            <ul className="admin_user_timeline">
              {(request.activities || []).map((entry) => (
                <li key={entry.id} className="admin_user_timeline__item">
                  <span className="admin_user_timeline__dot" aria-hidden="true" />
                  <div>
                    <strong>{entry.label}</strong>
                    <span>{formatDateTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>

      {followUpModalOpen &&
        createPortal(
          <FollowUpModal
            open
            onClose={() => setFollowUpModalOpen(false)}
            pipelineStage={request.stage}
            defaultAssignee={defaultFollowUpAssignee}
            saving={savingFollowUp}
            onSave={handleFollowUpSave}
          />,
          document.body,
        )}
    </>
  );
};

export default ContactRequestDrawer;
