const AdminDemoPageShell = ({
  title,
  description,
  error,
  children,
}) => {
  return (
    <section className="admin_request_demos">
      <header className="admin_request_demos__header">
        <h1>{title}</h1>
        {description && (
          <p className="admin_request_demos__subtitle">{description}</p>
        )}
      </header>

      <div className="admin_request_demos__toolbar">
        <h2>Records</h2>
      </div>

      {error && <p className="admin_request_demos__error">{error}</p>}
      {children}
    </section>
  );
};

export default AdminDemoPageShell;
