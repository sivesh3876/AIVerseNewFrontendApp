import {
  ASSIGNEE_OPTIONS,
  COUNTRY_OPTIONS,
  INDUSTRY_OPTIONS,
  PIPELINE_STAGES,
} from "./placeholders";

const ContactRequestFilterPanel = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="admin_contact_filter__backdrop"
        aria-label="Close filters"
        onClick={onClose}
      />
      <aside className="admin_contact_filter" role="dialog" aria-label="Filter leads">
        <header className="admin_contact_filter__head">
          <div>
            <p className="admin_demo_modal__eyebrow">Filters</p>
            <h3>Filter Leads</h3>
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

        <div className="admin_contact_filter__body">
          <label className="admin_demo_toolbar__field">
            <span>Stage</span>
            <select defaultValue="all">
              <option value="all">All stages</option>
              {PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Assigned To</span>
            <select defaultValue="all">
              <option value="all">Anyone</option>
              {ASSIGNEE_OPTIONS.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Industry</span>
            <select defaultValue="all">
              <option value="all">All industries</option>
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Country</span>
            <select defaultValue="all">
              <option value="all">All countries</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Submission Date</span>
            <input type="date" />
          </label>
        </div>

        <footer className="admin_contact_filter__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onClose}
          >
            Reset
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
};

export default ContactRequestFilterPanel;
