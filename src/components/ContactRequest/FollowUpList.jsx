import { formatFollowUpDateTime } from "./followUpUtils";

const getTypeLabel = (followUp) =>
  followUp.customLabel || followUp.type || "Follow-up";

const FollowUpList = ({ followUps = [], loading = false }) => {
  if (loading) {
    return <p className="admin_contact_followup_list__loading">Loading follow-ups…</p>;
  }

  if (followUps.length === 0) {
    return (
      <div className="admin_contact_drawer__empty">
        <p>No follow-ups scheduled yet.</p>
        <span>Click the button above to schedule one.</span>
      </div>
    );
  }

  return (
    <div className="admin_contact_followup_list">
      {followUps.map((followUp) => (
        <article key={followUp.id} className="admin_contact_followup_card">
          <div className="admin_contact_followup_card__head">
            <strong>{getTypeLabel(followUp)}</strong>
            <span
              className={`admin_contact_followup_card__status admin_contact_followup_card__status--${(followUp.status || "scheduled").toLowerCase()}`}
            >
              {followUp.status || "Scheduled"}
            </span>
          </div>
          <p className="admin_contact_followup_card__datetime">
            {formatFollowUpDateTime(followUp.date, followUp.time)}
          </p>
          <p className="admin_contact_followup_card__meta">
            <span>{followUp.type}</span>
            <span>Assigned to {followUp.assignedTo}</span>
            {followUp.reminder && <span>Reminder on</span>}
          </p>
          {followUp.notes && (
            <p className="admin_contact_followup_card__notes">{followUp.notes}</p>
          )}
        </article>
      ))}
    </div>
  );
};

export default FollowUpList;
