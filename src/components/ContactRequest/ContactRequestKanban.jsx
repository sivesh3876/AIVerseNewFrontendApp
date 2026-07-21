import ContactRequestCard from "./ContactRequestCard";
import { PIPELINE_STAGES } from "./placeholders";

const ContactRequestKanban = ({ requests, onCardClick }) => (
  <div className="admin_contact_kanban__scroll">
    <div className="admin_contact_kanban">
      {PIPELINE_STAGES.map((stage) => {
        const stageRequests = requests.filter((r) => r.stage === stage);

        return (
          <div key={stage} className="admin_contact_kanban__column">
            <header className="admin_contact_kanban__column-head">
              <h3>{stage}</h3>
              <span className="admin_contact_kanban__count">{stageRequests.length}</span>
            </header>

            <div className="admin_contact_kanban__cards">
              {stageRequests.length === 0 ? (
                <div className="admin_contact_kanban__empty">
                  <p>No requests in this stage</p>
                </div>
              ) : (
                stageRequests.map((request) => (
                  <ContactRequestCard
                    key={request.id}
                    request={request}
                    onClick={onCardClick}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ContactRequestKanban;
