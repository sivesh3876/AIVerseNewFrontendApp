import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllUseCases } from "../../services/usecasesService";
import { getServiceIdForDomain } from "../../utils/solutionMapper";
import "./AdminDashboard.scss";

const quickActions = [
  {
    title: "Request Demo",
    description: "View all demo request emails and contact details.",
    path: "/admin/request-demos/solution-info",
    accent: "#18E0CC",
  },
];

const AdminDashboard = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSolutions = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllUseCases();
        if (!isMounted) return;
        setSolutions(data);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message || "Failed to load solutions.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSolutions();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const active = solutions.filter((item) => item.IsSolutionActive !== false);
    const domains = new Set(
      active.map((item) => item.BusinessDomain).filter(Boolean),
    );

    return {
      total: solutions.length,
      active: active.length,
      domains: domains.size,
    };
  }, [solutions]);

  const recentSolutions = useMemo(
    () =>
      [...solutions]
        .sort((left, right) => Number(right.ID || 0) - Number(left.ID || 0))
        .slice(0, 8),
    [solutions],
  );

  return (
    <>
      <header className="admin_dashboard__header">
        <div>
          <p className="admin_dashboard__eyebrow">Welcome back</p>
          <h1>Admin Dashboard</h1>
        </div>
      </header>

      <section className="admin_dashboard__stats">
        <article>
          <span>Total Solutions</span>
          <strong>{loading ? "—" : stats.total}</strong>
        </article>
        <article>
          <span>Active Solutions</span>
          <strong>{loading ? "—" : stats.active}</strong>
        </article>
        <article>
          <span>Business Domains</span>
          <strong>{loading ? "—" : stats.domains}</strong>
        </article>
      </section>

      <section className="admin_dashboard__actions">
        <h2>Quick Actions</h2>
        <div className="admin_dashboard__action-grid">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="admin_dashboard__action-card"
              style={{ "--action-accent": action.accent }}
            >
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin_dashboard__table-section">
        <div className="admin_dashboard__table-header">
          <h2>Recent Solutions</h2>
          <Link to="/explore-solutions">View all</Link>
        </div>

        {error && <p className="admin_dashboard__error">{error}</p>}

        <div className="admin_dashboard__table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading solutions…</td>
                </tr>
              ) : recentSolutions.length === 0 ? (
                <tr>
                  <td colSpan={5}>No solutions found.</td>
                </tr>
              ) : (
                recentSolutions.map((solution) => {
                  const serviceId =
                    getServiceIdForDomain(solution.BusinessDomain) ||
                    "agentic-automation";

                  return (
                    <tr key={solution.ID}>
                      <td>{solution.ID}</td>
                      <td>{solution.Title || "Untitled"}</td>
                      <td>{solution.BusinessDomain || "—"}</td>
                      <td>
                        <span
                          className={`admin_dashboard__status${
                            solution.IsSolutionActive === false
                              ? " admin_dashboard__status--inactive"
                              : ""
                          }`}
                        >
                          {solution.IsSolutionActive === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>
                      <td className="admin_dashboard__row-actions">
                        <Link
                          to={`/explore-solutions?service=${serviceId}&solution=api-${solution.ID}`}
                        >
                          View
                        </Link>
                        <Link to={`/get-started?id=${solution.ID}`}>Edit</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
