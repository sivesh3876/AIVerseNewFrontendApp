import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDemoRequestDate,
  formatRequestDateOnly,
} from "../../services/demoRequestService";
import {
  loadLastDemoSubmission,
  restoreLastDemoSubmission,
  updateDemoRequestRecord,
} from "../../utils/demoRequestStorage";
import {
  exportDemoRequestsToCsv,
  filterDemoRequests,
  getUniqueValues,
} from "../../utils/adminDemoTableUtils";
import AdminDemoPageShell from "./AdminDemoPageShell";
import AdminTablePagination from "./AdminBlogPagination";
import AdminDemoTableToolbar from "./AdminDemoTableToolbar";
import AdminDemoStatusModal from "./AdminDemoStatusModal";
import AdminDemoUpdateModal from "./AdminDemoUpdateModal";
import AdminStatusDropdown from "./AdminStatusDropdown";
import AdminUpdateStatusDropdown from "./AdminUpdateStatusDropdown";
import { useAdminDemoRequests } from "./useAdminDemoRequests";
import "./AdminLayout.scss";

const PAGE_SIZE = 10;

const formatCell = (value) => value || "—";

const getFeedbackSummary = (request) => {
  const entries = Array.isArray(request.feedbackEntries)
    ? request.feedbackEntries
    : [];
  const count = entries.length;
  const latest = entries[0];

  if (!count && !request.feedbackMessage) return "No feedback";

  const rating =
    request.feedbackRating || latest?.rating
      ? `${request.feedbackRating || latest?.rating}★`
      : "";
  const preview =
    request.feedbackMessage || latest?.message
      ? (request.feedbackMessage || latest?.message).slice(0, 28) +
        ((request.feedbackMessage || latest?.message).length > 28 ? "…" : "")
      : latest?.sentiment === "like"
        ? "👍 Like"
        : latest?.sentiment === "dislike"
          ? "👎 Dislike"
          : "View feedback";

  return [rating, preview].filter(Boolean).join(" · ") || `${count} item(s)`;
};

const AdminRequestDemoSolutionInfo = () => {
  const { requests, loading, error, loadRequests, handleRequestUpdated } =
    useAdminDemoRequests();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [statusRequestId, setStatusRequestId] = useState(null);
  const [modalMode, setModalMode] = useState("schedule");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [solutionFilter, setSolutionFilter] = useState("all");
  const [coeFilter, setCoeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const lastSubmission = useMemo(() => loadLastDemoSubmission(), [requests]);

  const solutionOptions = useMemo(
    () => getUniqueValues(requests, "solutionTitle"),
    [requests],
  );

  const coeOptions = useMemo(
    () => getUniqueValues(requests, "coeName"),
    [requests],
  );

  const filteredRequests = useMemo(
    () =>
      filterDemoRequests(requests, {
        search: searchQuery,
        status: statusFilter,
        solution: solutionFilter,
        coe: coeFilter,
      }),
    [requests, searchQuery, statusFilter, solutionFilter, coeFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [filteredRequests, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, solutionFilter, coeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    searchQuery.trim() ||
    statusFilter !== "all" ||
    solutionFilter !== "all" ||
    coeFilter !== "all";

  const statusRequest = useMemo(
    () => requests.find((item) => item.id === statusRequestId) || null,
    [requests, statusRequestId],
  );

  const selectedRequest = useMemo(
    () => requests.find((item) => item.id === selectedRequestId) || null,
    [requests, selectedRequestId],
  );

  const handleRestoreLast = () => {
    const restored = restoreLastDemoSubmission();
    if (restored) {
      loadRequests();
    }
  };

  const openUpdateModal = (request, mode = "schedule") => {
    if (mode === "status") {
      setStatusRequestId(request.id);
      return;
    }

    setModalMode(mode);
    setSelectedRequestId(request.id);
  };

  const handleStatusSave = (updates) => {
    if (!statusRequestId) return;

    const updated = updateDemoRequestRecord(statusRequestId, updates);
    if (updated) {
      handleRequestUpdated(updated);
      loadRequests();
    }

    setStatusRequestId(null);
  };

  const handleStatusChange = (request, recordStatus) => {
    const updated = updateDemoRequestRecord(request.id, { recordStatus });
    if (updated) {
      handleRequestUpdated(updated);
    }
  };

  const handleSave = (updates) => {
    if (!selectedRequestId) return;

    const updated = updateDemoRequestRecord(selectedRequestId, updates);
    if (updated) {
      handleRequestUpdated(updated);
      loadRequests();
    }

    setSelectedRequestId(null);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSolutionFilter("all");
    setCoeFilter("all");
  };

  const handleExport = () => {
    const exported = exportDemoRequestsToCsv(
      filteredRequests,
      `request-demo-records-${new Date().toISOString().slice(0, 10)}.csv`,
    );

    if (!exported) {
      window.alert("No records available to export.");
    }
  };

  const columnCount = 13;

  return (
    <AdminDemoPageShell
      title="Request Demo"
      description="All demo request details in one list with status and actions."
      error={error}
    >
      {!loading && !error && requests.length === 0 && (
        <div className="admin_request_demos__empty">
          <p>
            No demo requests saved in this browser yet. Go to Explore Solutions,
            open any solution card, click <strong>Request Demo</strong>, fill the
            form, and click <strong>Send Mail</strong>.
          </p>
          <p className="admin_request_demos__empty-note">
            Use the same URL port ({window.location.origin}) for both submit and
            admin pages. Older server emails need a backend list API.
          </p>
          <div className="admin_request_demos__empty-actions">
            <Link
              to="/explore-solutions"
              className="admin_request_demos__empty-link"
            >
              Go to Explore Solutions
            </Link>
            {lastSubmission && (
              <button
                type="button"
                className="admin_request_demos__empty-restore"
                onClick={handleRestoreLast}
              >
                Restore Last Submission
              </button>
            )}
          </div>
        </div>
      )}

      {!error && (
        <AdminDemoTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          solutionFilter={solutionFilter}
          onSolutionFilterChange={setSolutionFilter}
          coeFilter={coeFilter}
          onCoeFilterChange={setCoeFilter}
          solutionOptions={solutionOptions}
          coeOptions={coeOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          exportDisabled={filteredRequests.length === 0}
          onRefresh={loadRequests}
          loading={loading}
          filteredCount={filteredRequests.length}
          totalCount={requests.length}
        />
      )}

      <div className="admin_demo_table__wrap">
        <table className="admin_demo_table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Request Date &amp; Time</th>
              <th>Solution Name</th>
              <th>COE (Owner)</th>
              <th>Requester</th>
              <th>Email</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Demo Given By</th>
              <th>Demo Given On</th>
              <th>Feedback</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columnCount}>Loading demo requests…</td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={columnCount}>No demo request records found.</td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={columnCount}>
                  No records match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <AdminUpdateStatusDropdown
                      onSelect={(mode) => openUpdateModal(request, mode)}
                    />
                  </td>
                  <td>
                    {request.submittedAt
                      ? formatDemoRequestDate(request.submittedAt)
                      : "—"}
                  </td>
                  <td>{formatCell(request.solutionTitle)}</td>
                  <td>{formatCell(request.coeName)}</td>
                  <td>{formatCell(request.fullName)}</td>
                  <td>{formatCell(request.email)}</td>
                  <td>{formatCell(request.company)}</td>
                  <td>{formatCell(request.phone)}</td>
                  <td className="admin_demo_table__message-cell">
                    {formatCell(request.message)}
                  </td>
                  <td>{formatCell(request.demoGivenBy)}</td>
                  <td>
                    {request.demoGivenAt
                      ? formatRequestDateOnly(request.demoGivenAt)
                      : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin_demo_table__feedback-btn"
                      onClick={() => openUpdateModal(request, "feedback")}
                    >
                      {getFeedbackSummary(request)}
                    </button>
                  </td>
                  <td>
                    <AdminStatusDropdown
                      value={request.recordStatus || "Active"}
                      onChange={(recordStatus) =>
                        handleStatusChange(request, recordStatus)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredRequests.length > 0 && (
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRequests.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="records"
        />
      )}

      {statusRequest && (
        <AdminDemoStatusModal
          request={statusRequest}
          onClose={() => setStatusRequestId(null)}
          onSave={handleStatusSave}
        />
      )}

      {selectedRequest && (
        <AdminDemoUpdateModal
          request={selectedRequest}
          mode={modalMode}
          onClose={() => setSelectedRequestId(null)}
          onSave={handleSave}
        />
      )}
    </AdminDemoPageShell>
  );
};

export default AdminRequestDemoSolutionInfo;
