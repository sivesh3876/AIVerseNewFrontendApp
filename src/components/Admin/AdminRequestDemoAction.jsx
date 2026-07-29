import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DEMO_REQUEST_STATUSES,
  incrementDemoRequestViewCount,
  updateDemoRequestRecord,
} from "../../utils/demoRequestStorage";
import { formatDemoRequestDate } from "../../services/demoRequestService";
import AdminDemoFieldBox from "./AdminDemoFieldBox";
import AdminDemoPageShell from "./AdminDemoPageShell";
import { useAdminDemoRequests } from "./useAdminDemoRequests";
import "./AdminLayout.scss";

const BlankActionCard = () => (
  <article className="admin_request_demos__card admin_request_demos__card--section">
    <header className="admin_request_demos__card-header">
      <div>
        <h3>No demo request yet</h3>
        <p>Status and view tracking will appear here after a demo request.</p>
      </div>
    </header>
    <div className="admin_demo_fields">
      <AdminDemoFieldBox label="Status" isEmpty />
      <AdminDemoFieldBox label="View Count" isEmpty />
      <AdminDemoFieldBox label="Last Updated" isEmpty />
      <div className="admin_demo_field admin_demo_field--actions is-empty">
        <span className="admin_demo_field__label">Update Status</span>
        <div className="admin_demo_field__box admin_demo_field__box--actions" />
      </div>
    </div>
  </article>
);

const ActionCard = ({ request, onUpdated }) => {
  const [status, setStatus] = useState(request.status || DEMO_REQUEST_STATUSES[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const viewCount = Number(request.viewCount) || 0;

  useEffect(() => {
    setStatus(request.status || DEMO_REQUEST_STATUSES[0]);
  }, [request]);

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage("");

    const updated = updateDemoRequestRecord(request.id, { status });

    setIsSaving(false);

    if (!updated) {
      setSaveMessage("Could not save changes.");
      return;
    }

    onUpdated?.(updated);
    setSaveMessage("Status updated.");
  };

  const handleView = () => {
    const updated = incrementDemoRequestViewCount(request.id);
    if (updated) {
      onUpdated?.(updated);
    }
  };

  return (
    <article className="admin_request_demos__card admin_request_demos__card--section">
      <header className="admin_request_demos__card-header">
        <div>
          <h3>{request.solutionTitle || "Untitled Solution"}</h3>
          <p>
            Requested by <strong>{request.fullName || "—"}</strong>
          </p>
        </div>
        <span
          className={`admin_request_demos__status admin_request_demos__status--${status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {status}
        </span>
      </header>

      <div className="admin_demo_fields">
        <AdminDemoFieldBox label="Status" value={status} isEmpty={!status} />

        <AdminDemoFieldBox
          label="View Count"
          value={`${viewCount} view${viewCount === 1 ? "" : "s"}`}
          isEmpty={viewCount === 0}
        />

        <AdminDemoFieldBox
          label="Last Updated"
          value={
            request.updatedAt ? formatDemoRequestDate(request.updatedAt) : ""
          }
          isEmpty={!request.updatedAt}
        />

        <div className="admin_demo_field admin_demo_field--actions">
          <span className="admin_demo_field__label">Update Status</span>
          <div className="admin_demo_field__box admin_demo_field__box--actions">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {DEMO_REQUEST_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {status === "Pending" && (
                <option value="Pending">Pending</option>
              )}
              {status === "Submitting" && (
                <option value="Submitting">Submitting</option>
              )}
              {status === "Failed" && <option value="Failed">Failed</option>}
            </select>

            <div className="admin_request_demos__action-buttons">
              <button
                type="button"
                className="admin_request_demos__btn admin_request_demos__btn--secondary"
                onClick={handleView}
              >
                Record View
              </button>
              <button
                type="button"
                className="admin_request_demos__btn admin_request_demos__btn--primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Updating…" : "Update Status"}
              </button>
            </div>

            {saveMessage && (
              <p className="admin_request_demos__save-message">{saveMessage}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const AdminRequestDemoAction = () => {
  const { requests, loading, error, loadRequests, handleRequestUpdated } =
    useAdminDemoRequests();

  return (
    <AdminDemoPageShell
      title="Action"
      description="Track request status, update progress, and view counts."
      loading={loading}
      error={error}
      onRefresh={loadRequests}
    >
      {!loading && !error && requests.length === 0 && (
        <div className="admin_request_demos__empty">
          <p>No actions yet. Demo request status will show here once recorded.</p>
          <Link
            to="/explore-solutions"
            className="admin_request_demos__empty-link"
          >
            Go to Explore Solutions
          </Link>
        </div>
      )}

      <div className="admin_request_demos__cards">
        {loading ? (
          <BlankActionCard />
        ) : requests.length === 0 ? (
          <BlankActionCard />
        ) : (
          requests.map((request) => (
            <ActionCard
              key={request.id}
              request={request}
              onUpdated={handleRequestUpdated}
            />
          ))
        )}
      </div>
    </AdminDemoPageShell>
  );
};

export default AdminRequestDemoAction;
