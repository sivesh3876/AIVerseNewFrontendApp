import { useEffect, useMemo, useState } from "react";
import {
  createCertifiedProfessionalRecord,
  deleteCertifiedProfessionalRecord,
  getCertifiedProfessionalById,
  getCertifiedProfessionalCount,
  updateCertifiedProfessionalRecord,
} from "../../utils/adminCertifiedProfessionalStorage";
import {
  exportCertifiedProfessionalsToCsv,
  filterCertifiedProfessionals,
  getUniqueProfessionalValues,
} from "../../utils/adminCertifiedProfessionalTableUtils";
import { updateAdminCertificationRecord } from "../../utils/adminCertificationStorage";
import AdminBlogActionDropdown from "./AdminBlogActionDropdown";
import AdminTablePagination from "./AdminBlogPagination";
import AdminCertifiedProfessionalDeleteModal from "./AdminCertifiedProfessionalDeleteModal";
import AdminCertifiedProfessionalFormModal from "./AdminCertifiedProfessionalFormModal";
import AdminCertifiedProfessionalStatusDropdown from "./AdminCertifiedProfessionalStatusDropdown";
import AdminCertifiedProfessionalTableToolbar from "./AdminCertifiedProfessionalTableToolbar";
import AdminCertifiedProfessionalViewModal from "./AdminCertifiedProfessionalViewModal";
import { useAdminCertifiedProfessionals } from "./useAdminCertifiedProfessionals";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 11;

const formatCell = (value) => value || "—";

const syncCertificationTotal = async (certificationId) => {
  await syncCertificationTotalCount(
    certificationId,
    getCertifiedProfessionalCount(certificationId),
  );
};

const syncCertificationTotalCount = async (certificationId, total) => {
  await updateAdminCertificationRecord(certificationId, {
    totalCertified: total,
  });
};

const AdminCertifiedProfessionalsSection = ({
  certificationId,
  certification = null,
}) => {
  const {
    professionals,
    loading,
    error,
    loadProfessionals,
    handleProfessionalUpdated,
  } = useAdminCertifiedProfessionals(certificationId);

  const [formMode, setFormMode] = useState(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(null);
  const [viewProfessionalId, setViewProfessionalId] = useState(null);
  const [deleteProfessionalId, setDeleteProfessionalId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const departmentOptions = useMemo(
    () => getUniqueProfessionalValues(professionals, "department"),
    [professionals],
  );

  const filteredProfessionals = useMemo(
    () =>
      filterCertifiedProfessionals(professionals, {
        search: searchQuery,
        status: statusFilter,
        department: departmentFilter,
      }),
    [professionals, searchQuery, statusFilter, departmentFilter],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfessionals.length / PAGE_SIZE),
  );

  const paginatedProfessionals = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProfessionals.slice(start, start + PAGE_SIZE);
  }, [filteredProfessionals, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, departmentFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    searchQuery.trim() ||
    statusFilter !== "all" ||
    departmentFilter !== "all";

  const selectedProfessional = useMemo(() => {
    if (!selectedProfessionalId) return null;
    return (
      professionals.find((item) => item.id === selectedProfessionalId) ||
      getCertifiedProfessionalById(certificationId, selectedProfessionalId)
    );
  }, [professionals, selectedProfessionalId, certificationId]);

  const viewProfessional = useMemo(
    () =>
      professionals.find((item) => item.id === viewProfessionalId) ||
      getCertifiedProfessionalById(certificationId, viewProfessionalId),
    [professionals, viewProfessionalId, certificationId],
  );

  const deleteProfessional = useMemo(
    () =>
      professionals.find((item) => item.id === deleteProfessionalId) ||
      getCertifiedProfessionalById(certificationId, deleteProfessionalId),
    [professionals, deleteProfessionalId, certificationId],
  );

  const handleAction = (professional, action) => {
    if (action === "view") {
      setViewProfessionalId(professional.id);
      return;
    }

    if (action === "edit") {
      setSelectedProfessionalId(professional.id);
      setFormMode("edit");
      return;
    }

    if (action === "delete") {
      setDeleteProfessionalId(professional.id);
    }
  };

  const handleCloseView = () => setViewProfessionalId(null);

  const handleCloseDelete = () => setDeleteProfessionalId(null);

  const handleCloseForm = () => {
    setFormMode(null);
    setSelectedProfessionalId(null);
  };

  const handleOpenAdd = () => {
    setSelectedProfessionalId(null);
    setFormMode("add");
  };

  const handleSaveProfessional = async (payload) => {
    if (formMode === "edit" && selectedProfessionalId) {
      const updated = await updateCertifiedProfessionalRecord(
        certificationId,
        selectedProfessionalId,
        payload,
      );
      if (updated) {
        handleProfessionalUpdated(updated);
        await loadProfessionals();
      }
    } else {
      const created = await createCertifiedProfessionalRecord(
        certificationId,
        payload,
      );
      if (created) {
        await loadProfessionals();
      }
    }

    await syncCertificationTotal(certificationId);
    handleCloseForm();
  };

  const handleConfirmDelete = async (professional) => {
    await deleteCertifiedProfessionalRecord(certificationId, professional.id);
    setDeleteProfessionalId(null);
    await loadProfessionals();
    await syncCertificationTotal(certificationId);
  };

  const handleStatusChange = async (professional, status) => {
    const updated = await updateCertifiedProfessionalRecord(
      certificationId,
      professional.id,
      { status },
    );
    if (updated) {
      handleProfessionalUpdated(updated);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  const handleExport = () => {
    const exported = exportCertifiedProfessionalsToCsv(
      filteredProfessionals,
      `certified-professionals-${certificationId}-${new Date().toISOString().slice(0, 10)}.csv`,
    );

    if (!exported) {
      window.alert("No records available to export.");
    }
  };

  return (
    <section
      id="certified-professionals"
      className="admin_certification_detail__professionals"
    >
      <header>
        <h2>Certified Professionals</h2>
        <p>Employees who have completed this certification will appear here.</p>
      </header>

      {error && <p className="admin_request_demos__error">{error}</p>}

      {!error && (
        <AdminCertifiedProfessionalTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          departmentOptions={departmentOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          exportDisabled={filteredProfessionals.length === 0}
          onAddProfessional={handleOpenAdd}
          onRefresh={loadProfessionals}
          loading={loading}
          filteredCount={filteredProfessionals.length}
          totalCount={professionals.length}
        />
      )}

      <div className="admin_demo_table__wrap">
        <table className="admin_demo_table admin_certification_detail__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Profile Photo</th>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Email</th>
              <th>Completion Date</th>
              <th>Credential ID</th>
              <th>Exam Score</th>
              <th className="admin_demo_table__status-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>Loading certified professionals…</td>
              </tr>
            ) : professionals.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>No certified professionals yet.</td>
              </tr>
            ) : filteredProfessionals.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  No records match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedProfessionals.map((professional) => (
                <tr key={professional.id}>
                  <td>
                    <AdminBlogActionDropdown
                      onSelect={(action) => handleAction(professional, action)}
                    />
                  </td>
                  <td>
                    {professional.profilePhoto ? (
                      <img
                        src={professional.profilePhoto}
                        alt={professional.employeeName || "Employee profile"}
                        className="admin_certified_professional__avatar"
                      />
                    ) : (
                      <div className="admin_certified_professional__avatar admin_certified_professional__avatar--placeholder">
                        {(professional.employeeName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>{formatCell(professional.employeeName)}</td>
                  <td>{formatCell(professional.employeeId)}</td>
                  <td>{formatCell(professional.designation)}</td>
                  <td>{formatCell(professional.department)}</td>
                  <td>{formatCell(professional.email)}</td>
                  <td>{formatCell(professional.completionDate)}</td>
                  <td>{formatCell(professional.credentialId)}</td>
                  <td>{formatCell(professional.examScore || professional.score)}</td>
                  <td className="admin_demo_table__status-cell">
                    <AdminCertifiedProfessionalStatusDropdown
                      value={professional.status || "Draft"}
                      onChange={(status) =>
                        handleStatusChange(professional, status)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredProfessionals.length > 0 && (
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProfessionals.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="records"
        />
      )}

      {formMode && (
        <AdminCertifiedProfessionalFormModal
          professional={formMode === "edit" ? selectedProfessional : null}
          certification={certification}
          mode={formMode}
          onClose={handleCloseForm}
          onSave={handleSaveProfessional}
        />
      )}

      {viewProfessional && (
        <AdminCertifiedProfessionalViewModal
          professional={viewProfessional}
          onClose={handleCloseView}
        />
      )}

      {deleteProfessional && (
        <AdminCertifiedProfessionalDeleteModal
          professional={deleteProfessional}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </section>
  );
};

export default AdminCertifiedProfessionalsSection;
