import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteUseCase, updateUseCaseStatus } from "../../services/usecasesService";
import {
  exportAdminSolutionsToCsv,
  filterAdminSolutions,
  getSolutionCreatedDateLabel,
  getSolutionStatusLabel,
  getUniqueSolutionValues,
} from "../../utils/adminSolutionTableUtils";
import { getSolutionEngagement } from "../../utils/solutionEngagementStorage";
import {
  removePersistedSubmittedCapabilitiesByTitle,
  removePersistedSubmittedCapability,
} from "../../utils/solutionMapper";
import { setSolutionInactiveLocally } from "../../utils/solutionStatusStorage";
import AddNewAISolution from "../AddNewAISolution";
import AdminBlogActionDropdown from "./AdminBlogActionDropdown";
import AdminBlogPagination from "./AdminBlogPagination";
import AdminDemoPageShell from "./AdminDemoPageShell";
import AdminSolutionDeleteModal from "./AdminSolutionDeleteModal";
import AdminSolutionDemoRequestsModal from "./AdminSolutionDemoRequestsModal";
import AdminSolutionEnhancementModal from "./AdminSolutionEnhancementModal";
import AdminSolutionNewAITableToolbar from "./AdminSolutionNewAITableToolbar";
import AdminSolutionStatusDropdown from "./AdminSolutionStatusDropdown";
import AdminSolutionViewModal from "./AdminSolutionViewModal";
import { useAdminDemoRequests } from "./useAdminDemoRequests";
import { useAdminSolutions } from "./useAdminSolutions";
import "./AdminLayout.scss";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 8;

const formatCell = (value) => value || "—";

const matchesSolutionRequest = (request, solution) => {
  if (!request || !solution) return false;

  if (
    request.solutionId != null &&
    String(request.solutionId) === String(solution.ID)
  ) {
    return true;
  }

  const requestTitle = String(request.solutionTitle || "")
    .trim()
    .toLowerCase();
  const solutionTitle = String(solution.Title || "")
    .trim()
    .toLowerCase();

  return Boolean(requestTitle && solutionTitle && requestTitle === solutionTitle);
};

const AdminSolutionNewAI = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { solutions, loading, error, loadSolutions } = useAdminSolutions();
  const { requests: demoRequests, loadRequests: loadDemoRequests } =
    useAdminDemoRequests();

  const editId = searchParams.get("id");
  const isFormView =
    searchParams.get("mode") === "add" || Boolean(editId);

  const [viewSolutionId, setViewSolutionId] = useState(null);
  const [enhancementSolutionId, setEnhancementSolutionId] = useState(null);
  const [demoSolutionId, setDemoSolutionId] = useState(null);
  const [deleteSolutionId, setDeleteSolutionId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [domainFilter, setDomainFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [engagementTick, setEngagementTick] = useState(0);

  const domainOptions = useMemo(
    () => getUniqueSolutionValues(solutions, "BusinessDomain"),
    [solutions],
  );

  const filteredSolutions = useMemo(
    () =>
      filterAdminSolutions(solutions, {
        search: searchQuery,
        status: statusFilter,
        domain: domainFilter,
      }),
    [solutions, searchQuery, statusFilter, domainFilter],
  );

  const sortedSolutions = useMemo(
    () =>
      [...filteredSolutions].sort(
        (left, right) => Number(right.ID || 0) - Number(left.ID || 0),
      ),
    [filteredSolutions],
  );

  const totalPages = Math.max(1, Math.ceil(sortedSolutions.length / PAGE_SIZE));

  const paginatedSolutions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedSolutions.slice(start, start + PAGE_SIZE);
  }, [sortedSolutions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, domainFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const refreshEngagement = () => setEngagementTick((prev) => prev + 1);
    window.addEventListener(
      "aiverse:solution-engagement-updated",
      refreshEngagement,
    );
    return () =>
      window.removeEventListener(
        "aiverse:solution-engagement-updated",
        refreshEngagement,
      );
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "Active" ||
    domainFilter !== "all";

  const viewSolution = useMemo(
    () =>
      solutions.find((item) => String(item.ID) === String(viewSolutionId)) ||
      null,
    [solutions, viewSolutionId],
  );

  const enhancementSolution = useMemo(
    () =>
      solutions.find(
        (item) => String(item.ID) === String(enhancementSolutionId),
      ) || null,
    [solutions, enhancementSolutionId],
  );

  const demoSolution = useMemo(
    () =>
      solutions.find((item) => String(item.ID) === String(demoSolutionId)) ||
      null,
    [solutions, demoSolutionId],
  );

  const selectedDemoRequests = useMemo(() => {
    if (!demoSolution) return [];
    return demoRequests.filter((request) =>
      matchesSolutionRequest(request, demoSolution),
    );
  }, [demoRequests, demoSolution]);

  const deleteSolution = useMemo(
    () =>
      solutions.find(
        (item) => String(item.ID) === String(deleteSolutionId),
      ) || null,
    [solutions, deleteSolutionId],
  );

  const handleRefresh = async () => {
    setEngagementTick((prev) => prev + 1);
    await Promise.all([loadSolutions(), loadDemoRequests()]);
  };

  const handleBackToList = () => {
    setSearchParams({});
    handleRefresh();
  };

  const handleOpenAdd = () => {
    setSearchParams({ mode: "add" });
  };

  const handleAction = (solution, action) => {
    if (action === "view") {
      setViewSolutionId(solution.ID);
      return;
    }

    if (action === "edit") {
      setSearchParams({ id: String(solution.ID) });
      return;
    }

    if (action === "delete") {
      setDeleteSolutionId(solution.ID);
    }
  };

  const handleCloseView = () => {
    setViewSolutionId(null);
  };

  const handleOpenEnhancement = (solution) => {
    setEnhancementSolutionId(solution.ID);
  };

  const handleCloseEnhancement = () => {
    setEnhancementSolutionId(null);
  };

  const handleOpenDemos = (solution) => {
    setDemoSolutionId(solution.ID);
  };

  const handleCloseDemos = () => {
    setDemoSolutionId(null);
  };

  const handleCloseDelete = () => {
    if (deleting) return;
    setDeleteSolutionId(null);
  };

  const handleConfirmDelete = async (solution) => {
    try {
      setDeleting(true);
      await deleteUseCase(solution.ID);
      setDeleteSolutionId(null);
      await loadSolutions();
    } catch (deleteError) {
      window.alert(deleteError.message || "Failed to delete solution.");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (solution, status) => {
    if (updatingStatusId) return;

    const isActive = status === "Active";
    const solutionId = solution.ID;
    try {
      setUpdatingStatusId(solutionId);
      // Hide from Explore immediately, even before API round-trip / deploy.
      setSolutionInactiveLocally(solutionId, !isActive);

      if (!isActive) {
        removePersistedSubmittedCapability(String(solutionId));
        removePersistedSubmittedCapability(`api-${solutionId}`);
        removePersistedSubmittedCapabilitiesByTitle(solution.Title);
      }

      await updateUseCaseStatus(solution, isActive);
      await loadSolutions();
    } catch (statusError) {
      window.alert(
        statusError.message ||
          "Server update failed. Local Inactive flag was still saved so Explore hides the card.",
      );
      await loadSolutions();
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("Active");
    setDomainFilter("all");
  };

  const handleExport = () => {
    const exported = exportAdminSolutionsToCsv(
      sortedSolutions,
      `solution-records-${new Date().toISOString().slice(0, 10)}.csv`,
    );

    if (!exported) {
      window.alert("No records available to export.");
    }
  };

  if (isFormView) {
    return (
      <section className="admin_solution_new_ai">
        <header className="admin_request_demos__header">
          <button
            type="button"
            className="admin_solution_new_ai__back"
            onClick={handleBackToList}
          >
            ← Back to list
          </button>
          <h1>Solution New AI</h1>
          <p className="admin_request_demos__subtitle">
            {editId
              ? "Update an existing AI solution in the catalog."
              : "Fill in the details below to register a new AI solution in the catalog."}
          </p>
        </header>

        <AddNewAISolution />
      </section>
    );
  }

  return (
    <AdminDemoPageShell
      title="Solution New AI"
      description="All AI solutions in one list with status and actions."
      error={error}
    >
      {!error && (
        <AdminSolutionNewAITableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          domainFilter={domainFilter}
          onDomainFilterChange={setDomainFilter}
          domainOptions={domainOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          exportDisabled={sortedSolutions.length === 0}
          onAddSolution={handleOpenAdd}
          onRefresh={handleRefresh}
          loading={loading}
          filteredCount={sortedSolutions.length}
          totalCount={solutions.length}
        />
      )}

      <div className="admin_demo_table__wrap">
        <table className="admin_demo_table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Date</th>
              <th>Solution Title</th>
              <th>Business Domain</th>
              <th>COE / Ownership</th>
              <th className="admin_demo_table__enhancement-col">Card Engagement</th>
              <th className="admin_demo_table__demos-col">Demos</th>
              <th className="admin_demo_table__status-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>Loading solutions…</td>
              </tr>
            ) : solutions.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>No solution records found.</td>
              </tr>
            ) : filteredSolutions.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  No records match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedSolutions.map((solution) => {
                const statusLabel = getSolutionStatusLabel(solution);
                const engagement = getSolutionEngagement(solution.ID);
                const requestCount = demoRequests.filter((request) =>
                  matchesSolutionRequest(request, solution),
                ).length;

                return (
                  <tr key={`${solution.ID}-${engagementTick}`}>
                    <td>
                      <AdminBlogActionDropdown
                        onSelect={(action) => handleAction(solution, action)}
                      />
                    </td>
                    <td>{getSolutionCreatedDateLabel(solution)}</td>
                    <td>{formatCell(solution.Title)}</td>
                    <td>{formatCell(solution.BusinessDomain)}</td>
                    <td>{formatCell(solution.OwnershipDetails)}</td>
                    <td className="admin_demo_table__enhancement-col">
                      <button
                        type="button"
                        className="admin_solution_enhancement__metrics"
                        onClick={() => handleOpenEnhancement(solution)}
                        title="View likes, dislikes, views and comments"
                      >
                        <span className="admin_solution_enhancement__metric">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M1.5 12C3.5 7.5 7.5 5 12 5s8.5 2.5 10.5 7c-2 4.5-6 7-10.5 7S3.5 16.5 1.5 12Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                          </svg>
                          <span>Views {engagement.views}</span>
                        </span>
                        <span className="admin_solution_enhancement__metric">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M12 20s-7-4.4-9.2-8.4C1.2 8.2 3.2 5 6.4 5c1.8 0 3.4.9 4.4 2.3C12 5.9 13.6 5 15.4 5 18.6 5 20.6 8.2 21.2 11.6 19 15.6 12 20 12 20Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                          </svg>
                          <span>Likes {engagement.likes}</span>
                        </span>
                        <span className="admin_solution_enhancement__metric">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M10 15v5a2 2 0 0 0 2 2l5-6V4H7.5A2.5 2.5 0 0 0 5 6.4l-1.2 5.2A2 2 0 0 0 5.7 14H10Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17 4h2.5A1.5 1.5 0 0 1 21 5.5v7A1.5 1.5 0 0 1 19.5 14H17"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                          </svg>
                          <span>Dislikes {engagement.dislikes}</span>
                        </span>
                        <span className="admin_solution_enhancement__metric">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M4 5h16v11H8l-4 4V5Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Comments {engagement.comments.length}</span>
                        </span>
                      </button>
                    </td>
                    <td className="admin_demo_table__demos-col">
                      <button
                        type="button"
                        className="admin_solution_enhancement__metrics admin_solution_demos__link"
                        onClick={() => handleOpenDemos(solution)}
                        title="View requested demo details"
                      >
                        <span className="admin_solution_enhancement__metric">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M4 7h16v12H4V7Zm2-3h12v3H6V4Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Demos {requestCount}</span>
                        </span>
                      </button>
                    </td>
                    <td className="admin_demo_table__status-cell">
                      <AdminSolutionStatusDropdown
                        value={statusLabel}
                        onChange={(nextStatus) =>
                          handleStatusChange(solution, nextStatus)
                        }
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && sortedSolutions.length > 0 && (
        <AdminBlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedSolutions.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="records"
        />
      )}

      <AdminSolutionViewModal
        solution={viewSolution}
        onClose={handleCloseView}
      />

      <AdminSolutionEnhancementModal
        solution={enhancementSolution}
        onClose={handleCloseEnhancement}
      />

      <AdminSolutionDemoRequestsModal
        solution={demoSolution}
        demoRequests={selectedDemoRequests}
        onClose={handleCloseDemos}
      />

      <AdminSolutionDeleteModal
        solution={deleteSolution}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </AdminDemoPageShell>
  );
};

export default AdminSolutionNewAI;
