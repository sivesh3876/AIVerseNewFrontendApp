// Reusable section card used across the User Details page. Keeps every section
// (Basic Information, Assigned Role, Permissions, Login History, Activity Log)
// visually consistent and mirrors the panel's existing card styling.
const UserCard = ({ title, subtitle, actions, children }) => (
  <section className="admin_user_card">
    {(title || actions) && (
      <header className="admin_user_card__head">
        <div>
          {title && <h3 className="admin_user_card__title">{title}</h3>}
          {subtitle && <p className="admin_user_card__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="admin_user_card__actions">{actions}</div>}
      </header>
    )}
    <div className="admin_user_card__body">{children}</div>
  </section>
);

export const UserInfoField = ({ label, children }) => (
  <div className="admin_user_card__field">
    <span className="admin_user_card__field-label">{label}</span>
    <span className="admin_user_card__field-value">{children ?? "—"}</span>
  </div>
);

export default UserCard;
