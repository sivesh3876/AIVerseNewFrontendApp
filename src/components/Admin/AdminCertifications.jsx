import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  exportAdminCertificationsToCsv,
  filterAdminCertifications,
  getUniqueCertificationValues,
} from "../../utils/adminCertificationTableUtils";
import {
  createAdminCertificationRecord,
  deleteAdminCertificationRecord,
  getAdminCertificationById,
  updateAdminCertificationRecord,
} from "../../utils/adminCertificationStorage";
import { getCertifiedProfessionalCount } from "../../utils/adminCertifiedProfessionalStorage";
import AdminBlogActionDropdown from "./AdminBlogActionDropdown";
import AdminCertificationDeleteModal from "./AdminCertificationDeleteModal";
import AdminCertificationFormModal from "./AdminCertificationFormModal";
import AdminCertificationTotalCertifiedModal from "./AdminCertificationTotalCertifiedModal";
import AdminTablePagination from "./AdminBlogPagination";
import AdminCertificationTableToolbar from "./AdminCertificationTableToolbar";
import AdminDemoPageShell from "./AdminDemoPageShell";
import AdminCertificationStatusDropdown from "./AdminCertificationStatusDropdown";
import { useAdminCertifications } from "./useAdminCertifications";
import "./AdminLayout.scss";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 8;

const formatCell = (value) => value || "—";

const formatTotalCertified = (certification) => {
  const fromRecords = getCertifiedProfessionalCount(certification.id);
  const total =
    fromRecords > 0 ? fromRecords : Number(certification.totalCertified);
  return Number.isFinite(total) ? total.toLocaleString("en-IN") : "0";
};

const AdminCertifications = () => {
  const navigate = useNavigate();
  const {
    certifications,
    loading,
    error,
    loadCertifications,
    handleCertificationUpdated,
  } = useAdminCertifications();

  const [formMode, setFormMode] = useState(null);
  const [selectedCertificationId, setSelectedCertificationId] = useState(null);
  const [deleteCertificationId, setDeleteCertificationId] = useState(null);
  const [totalCertifiedCertificationId, setTotalCertifiedCertificationId] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const savingRef = useRef(false);

  const categoryOptions = useMemo(
    () => getUniqueCertificationValues(certifications, "category"),
    [certifications],
  );

  const levelOptions = useMemo(
    () => getUniqueCertificationValues(certifications, "level"),
    [certifications],
  );

  const providerOptions = useMemo(
    () => getUniqueCertificationValues(certifications, "provider"),
    [certifications],
  );

  const filteredCertifications = useMemo(
    () =>
      filterAdminCertifications(certifications, {
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        level: levelFilter,
        provider: providerFilter,
      }),
    [
      certifications,
      searchQuery,
      statusFilter,
      categoryFilter,
      levelFilter,
      providerFilter,
    ],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCertifications.length / PAGE_SIZE),
  );

  const paginatedCertifications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCertifications.slice(start, start + PAGE_SIZE);
  }, [filteredCertifications, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, levelFilter, providerFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    searchQuery.trim() ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    levelFilter !== "all" ||
    providerFilter !== "all";

  const selectedCertification = useMemo(() => {
    if (!selectedCertificationId) return null;
    return (
      certifications.find((item) => item.id === selectedCertificationId) ||
      getAdminCertificationById(selectedCertificationId)
    );
  }, [certifications, selectedCertificationId]);

  const deleteCertification = useMemo(
    () =>
      certifications.find((item) => item.id === deleteCertificationId) || null,
    [certifications, deleteCertificationId],
  );

  const totalCertifiedCertification = useMemo(
    () =>
      certifications.find((item) => item.id === totalCertifiedCertificationId) ||
      getAdminCertificationById(totalCertifiedCertificationId) ||
      null,
    [certifications, totalCertifiedCertificationId],
  );

  const handleAction = (certification, action) => {
    if (action === "view") {
      navigate(`/admin/learn-explore/${certification.id}`);
      return;
    }

    if (action === "edit") {
      setSelectedCertificationId(certification.id);
      setFormMode("edit");
      return;
    }

    if (action === "delete") {
      setDeleteCertificationId(certification.id);
    }
  };

  const handleCloseDelete = () => {
    setDeleteCertificationId(null);
  };

  const handleConfirmDelete = async (certification) => {
    await deleteAdminCertificationRecord(certification.id);
    setDeleteCertificationId(null);
    await loadCertifications();
  };

  const handleOpenAdd = () => {
    setSelectedCertificationId(null);
    setFormMode("add");
  };

  const handleCloseForm = () => {
    setFormMode(null);
    setSelectedCertificationId(null);
  };

  const handleSaveCertification = async (payload) => {
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      if (formMode === "edit" && selectedCertificationId) {
        const updated = await updateAdminCertificationRecord(
          selectedCertificationId,
          payload,
        );
        if (updated) {
          handleCertificationUpdated(updated);
          await loadCertifications();
        }
      } else {
        const created = await createAdminCertificationRecord(payload);
        if (created) {
          await loadCertifications();
        }
      }

      handleCloseForm();
    } finally {
      savingRef.current = false;
    }
  };

  const handleStatusChange = async (certification, status) => {
    const updated = await updateAdminCertificationRecord(certification.id, {
      status,
    });
    if (updated) {
      handleCertificationUpdated(updated);
    }
    // Re-read merged list so public Listeners get the Inactive status immediately.
    await loadCertifications();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setLevelFilter("all");
    setProviderFilter("all");
  };

  const handleExport = () => {
    const exported = exportAdminCertificationsToCsv(
      filteredCertifications,
      `certification-records-${new Date().toISOString().slice(0, 10)}.csv`,
    );

    if (!exported) {
      window.alert("No records available to export.");
    }
  };

  const handleTotalCertifiedClick = (certification) => {
    setTotalCertifiedCertificationId(certification.id);
  };

  const handleCloseTotalCertified = () => {
    setTotalCertifiedCertificationId(null);
  };

  const handleViewTotalCertified = (certification) => {
    setTotalCertifiedCertificationId(null);
    navigate(
      `/admin/learn-explore/${certification.id}/certified-professionals`,
    );
  };

  return (
    <AdminDemoPageShell
      title="Learn & Explore"
      description="All certifications in one list with status and actions."
      error={error}
    >
      {!error && (
        <AdminCertificationTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          providerFilter={providerFilter}
          onProviderFilterChange={setProviderFilter}
          categoryOptions={categoryOptions}
          levelOptions={levelOptions}
          providerOptions={providerOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          exportDisabled={filteredCertifications.length === 0}
          onAddCertification={handleOpenAdd}
          onRefresh={loadCertifications}
          loading={loading}
          filteredCount={filteredCertifications.length}
          totalCount={certifications.length}
        />
      )}

      <div className="admin_demo_table__wrap">
        <table className="admin_demo_table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Date</th>
              <th>Certification Name</th>
              <th>Provider</th>
              <th>Category</th>
              <th>Level</th>
              <th>Total Certified</th>
              <th className="admin_demo_table__status-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>Loading certifications…</td>
              </tr>
            ) : certifications.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>No certification records found.</td>
              </tr>
            ) : filteredCertifications.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  No records match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedCertifications.map((certification) => (
                <tr key={certification.id}>
                  <td>
                    <AdminBlogActionDropdown
                      onSelect={(action) => handleAction(certification, action)}
                    />
                  </td>
                  <td>{formatCell(certification.createdDate)}</td>
                  <td>{formatCell(certification.name)}</td>
                  <td>{formatCell(certification.provider)}</td>
                  <td>{formatCell(certification.category)}</td>
                  <td>{formatCell(certification.level)}</td>
                  <td>
                    <button
                      type="button"
                      className="admin_certification_table__total-link"
                      onClick={() => handleTotalCertifiedClick(certification)}
                      title="View certified employees"
                    >
                      {formatTotalCertified(certification)}
                    </button>
                  </td>
                  <td className="admin_demo_table__status-cell">
                    <AdminCertificationStatusDropdown
                      value={certification.status || "Active"}
                      onChange={(status) =>
                        handleStatusChange(certification, status)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredCertifications.length > 0 && (
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCertifications.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="records"
        />
      )}

      <p className="admin_request_demos__empty-note">
        Public details page:{" "}
        <Link to="/learn-explore/certifications">
          /learn-explore/certifications
        </Link>
        .
      </p>

      {formMode && (
        <AdminCertificationFormModal
          certification={formMode === "edit" ? selectedCertification : null}
          mode={formMode}
          onClose={handleCloseForm}
          onSave={handleSaveCertification}
        />
      )}

      {deleteCertification && (
        <AdminCertificationDeleteModal
          certification={deleteCertification}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {totalCertifiedCertification && (
        <AdminCertificationTotalCertifiedModal
          certification={totalCertifiedCertification}
          onClose={handleCloseTotalCertified}
          onView={handleViewTotalCertified}
        />
      )}
    </AdminDemoPageShell>
  );
};

export default AdminCertifications;
