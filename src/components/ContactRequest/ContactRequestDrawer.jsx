import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PipelineStage from "./PipelineStage";
import FollowUpList from "./FollowUpList";
import FollowUpModal from "./FollowUpModal";
import InternalNotes from "./InternalNotes";

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
  notes = [],
  onSaveFollowUp,
  savingFollowUp = false,
  onSaveNote,
  savingNote = false,
}) => {
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [scheduleUnlocked, setScheduleUnlocked] = useState(false);
  const scheduleIntentRef = useRef(false);

  useEffect(() => {
    setFollowUpModalOpen(false);
    setScheduleUnlocked(false);
    scheduleIntentRef.current = false;

    const timer = window.setTimeout(
      () => setScheduleUnlocked(true),
      SCHEDULE_CLICK_GUARD_MS,
    );

    return () => window.clearTimeout(timer);
  }, [open, request?.requestKey, request?.stage]);

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

  if (!open || !request) return null;

  const handleFollowUpSave = async (payload) => {
    try {
      await onSaveFollowUp?.(payload);
      setFollowUpModalOpen(false);
    } catch {
      // Parent shows error toast; keep modal open.
    }
  };

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
              <InfoField label="Type">{request.type || "Message"}</InfoField>
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
            <label className="admin_blog_form__field admin_blog_form__field--full">
              <span>Team member</span>
              <select defaultValue={request.assignedTo}>
                <option value="Unassigned">Unassigned</option>
                <option value="Priya Nair">Priya Nair</option>
                <option value="Rohan Mehta">Rohan Mehta</option>
                <option value="Isha Verma">Isha Verma</option>
                <option value="Aarav Sharma">Aarav Sharma</option>
              </select>
            </label>
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
            <FollowUpList followUps={followUps} />
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
            defaultAssignee={request.assignedTo}
            saving={savingFollowUp}
            onSave={handleFollowUpSave}
          />,
          document.body,
        )}
    </>
  );
};

export default ContactRequestDrawer;
