const AdminDemoFieldBox = ({ label, value, children, isEmpty = false }) => (
  <div className={`admin_demo_field${isEmpty ? " is-empty" : ""}`}>
    <span className="admin_demo_field__label">{label}</span>
    {children ?? (
      <div className="admin_demo_field__box">
        {isEmpty ? "" : value || "—"}
      </div>
    )}
  </div>
);

export default AdminDemoFieldBox;
