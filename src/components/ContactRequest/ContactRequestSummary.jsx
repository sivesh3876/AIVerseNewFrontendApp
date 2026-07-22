const ContactRequestSummary = ({ stats }) => (
  <section className="admin_contact_summary">
    <article className="admin_contact_summary__card">
      <span>Total Leads</span>
      <strong>{stats.total}</strong>
    </article>
    <article className="admin_contact_summary__card admin_contact_summary__card--new">
      <span>Contacted</span>
      <strong>{stats.contacted}</strong>
    </article>
    <article className="admin_contact_summary__card admin_contact_summary__card--qualified">
      <span>Qualified</span>
      <strong>{stats.qualified}</strong>
    </article>
    <article className="admin_contact_summary__card admin_contact_summary__card--won">
      <span>Won</span>
      <strong>{stats.won}</strong>
    </article>
    <article className="admin_contact_summary__card admin_contact_summary__card--lost">
      <span>Lost</span>
      <strong>{stats.lost}</strong>
    </article>
    <article className="admin_contact_summary__card admin_contact_summary__card--closed">
      <span>Closed</span>
      <strong>{stats.closed}</strong>
    </article>
  </section>
);

export default ContactRequestSummary;
