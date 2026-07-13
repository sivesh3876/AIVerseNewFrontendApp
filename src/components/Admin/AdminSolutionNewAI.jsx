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
import AddNewAISolution from "../AddNewAISolution";
import AdminBlogActionDropdown from "./AdminBlogActionDropdown";
import AdminBlogPagination from "./AdminBlogPagination";
import AdminDemoPageShell from "./AdminDemoPageShell";
import AdminSolutionDeleteModal from "./AdminSolutionDeleteModal";
import AdminSolutionNewAITableToolbar from "./AdminSolutionNewAITableToolbar";
import AdminSolutionStatusDropdown from "./AdminSolutionStatusDropdown";
import AdminSolutionViewModal from "./AdminSolutionViewModal";
import { useAdminSolutions } from "./useAdminSolutions";
import "./AdminLayout.scss";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 6;

const formatCell = (value) => value || "—";

const AdminSolutionNewAI = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { solutions, loading, error, loadSolutions } = useAdminSolutions();

  const editId = searchParams.get("id");
  const isFormView =
    searchParams.get("mode") === "add" || Boolean(editId);

  const [viewSolutionId, setViewSolutionId] = useState(null);
  const [deleteSolutionId, setDeleteSolutionId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

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

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "all" ||
    domainFilter !== "all";

  const viewSolution = useMemo(
    () =>
      solutions.find((item) => String(item.ID) === String(viewSolutionId)) ||
      null,
    [solutions, viewSolutionId],
  );

  const deleteSolution = useMemo(
    () =>
      solutions.find(
        (item) => String(item.ID) === String(deleteSolutionId),
      ) || null,
    [solutions, deleteSolutionId],
  );

  const handleBackToList = () => {
    setSearchParams({});
    loadSolutions();
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
    try {
      setUpdatingStatusId(solution.ID);
      await updateUseCaseStatus(solution, isActive);
      await loadSolutions();
    } catch (statusError) {
      window.alert(statusError.message || "Failed to update solution status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
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
          onRefresh={loadSolutions}
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

                return (
                  <tr key={solution.ID}>
                    <td>
                      <AdminBlogActionDropdown
                        onSelect={(action) => handleAction(solution, action)}
                      />
                    </td>
                    <td>{getSolutionCreatedDateLabel(solution)}</td>
                    <td>{formatCell(solution.Title)}</td>
                    <td>{formatCell(solution.BusinessDomain)}</td>
                    <td>{formatCell(solution.OwnershipDetails)}</td>
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
          onPageChange={setCurrentPage}
        />
      )}

      <AdminSolutionViewModal
        solution={viewSolution}
        onClose={handleCloseView}
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
