import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDemoPageShell from "../../components/Admin/AdminDemoPageShell";
import AdminBlogPagination from "../../components/Admin/AdminBlogPagination";
import RoleFilters from "../../components/Role/RoleFilters";
import RoleTable from "../../components/Role/RoleTable";
import RoleModal from "../../components/Role/RoleModal";
import RoleDeleteModal from "../../components/Role/RoleDeleteModal";
import {
  ROLE_STATUSES,
  createRole,
  deleteRole,
  duplicateRole,
  fetchRoles,
  setRoleStatus,
  updateRole,
} from "../../services/roleService";
import {
  PERMISSION_LEVEL_OPTIONS,
  USER_COUNT_OPTIONS,
  exportRolesToCsv,
  filterRoles,
} from "../../utils/roleTableUtils";
import "../../components/Admin/AdminLayout.scss";

const PAGE_SIZE = 10;

const RoleManagement = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [userCountFilter, setUserCountFilter] = useState("all");
  const [permissionLevelFilter, setPermissionLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalMode, setModalMode] = useState(null); // "add" | "edit"
  const [activeRole, setActiveRole] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchRoles();
      setRoles(data);
    } catch (loadError) {
      setError(loadError.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const filteredRoles = useMemo(
    () =>
      filterRoles(roles, {
        search: searchQuery,
        status: statusFilter,
        createdDate: createdDateFilter,
        userCount: userCountFilter,
        permissionLevel: permissionLevelFilter,
      }),
    [
      roles,
      searchQuery,
      statusFilter,
      createdDateFilter,
      userCountFilter,
      permissionLevelFilter,
    ],
  );

  const sortedRoles = useMemo(
    () =>
      [...filteredRoles].sort(
        (left, right) => Number(right.id || 0) - Number(left.id || 0),
      ),
    [filteredRoles],
  );

  const totalPages = Math.max(1, Math.ceil(sortedRoles.length / PAGE_SIZE));

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedRoles.slice(start, start + PAGE_SIZE);
  }, [sortedRoles, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    createdDateFilter,
    userCountFilter,
    permissionLevelFilter,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "all" ||
    Boolean(createdDateFilter) ||
    userCountFilter !== "all" ||
    permissionLevelFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCreatedDateFilter("");
    setUserCountFilter("all");
    setPermissionLevelFilter("all");
  };

  const handleExport = () => {
    const exported = exportRolesToCsv(
      sortedRoles,
      `role-records-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    if (!exported) {
      window.alert("No records available to export.");
    }
  };

  const handleOpenAdd = () => {
    setActiveRole(null);
    setModalMode("add");
  };

  const handleCloseModal = () => {
    if (saving) return;
    setModalMode(null);
    setActiveRole(null);
  };

  const handleSaveRole = async (payload) => {
    try {
      setSaving(true);
      if (modalMode === "edit" && activeRole) {
        await updateRole(activeRole.id, payload);
      } else {
        await createRole(payload);
      }
      setModalMode(null);
      setActiveRole(null);
      await loadRoles();
    } catch (saveError) {
      window.alert(saveError.message || "Failed to save role.");
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (role, action) => {
    switch (action) {
      case "view":
        navigate(`/admin/role-management/${role.id}`);
        break;
      case "edit":
      case "manage-permissions":
        setActiveRole(role);
        setModalMode("edit");
        break;
      case "duplicate":
        await duplicateRole(role.id);
        await loadRoles();
        break;
      case "toggle-status": {
        const nextStatus = role.status === "Active" ? "Inactive" : "Active";
        await setRoleStatus(role.id, nextStatus);
        await loadRoles();
        break;
      }
      case "delete":
        setDeleteTarget(role);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = async (role) => {
    try {
      setDeleting(true);
      await deleteRole(role.id);
      setDeleteTarget(null);
      await loadRoles();
    } catch (deleteError) {
      window.alert(deleteError.message || "Failed to delete role.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminDemoPageShell
      title="Role Management"
      description="Create and manage user roles and their permissions."
      error={error}
    >
      {!error && (
        <RoleFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          createdDateFilter={createdDateFilter}
          onCreatedDateFilterChange={setCreatedDateFilter}
          userCountFilter={userCountFilter}
          onUserCountFilterChange={setUserCountFilter}
          permissionLevelFilter={permissionLevelFilter}
          onPermissionLevelFilterChange={setPermissionLevelFilter}
          statusOptions={ROLE_STATUSES}
          userCountOptions={USER_COUNT_OPTIONS}
          permissionLevelOptions={PERMISSION_LEVEL_OPTIONS}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          exportDisabled={sortedRoles.length === 0}
          onAddRole={handleOpenAdd}
          onRefresh={loadRoles}
          loading={loading}
          filteredCount={sortedRoles.length}
          totalCount={roles.length}
        />
      )}

      <RoleTable
        roles={paginatedRoles}
        loading={loading}
        totalCount={roles.length}
        onAction={handleAction}
      />

      {!loading && sortedRoles.length > 0 && (
        <AdminBlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedRoles.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="roles"
        />
      )}

      {modalMode && (
        <RoleModal
          mode={modalMode}
          role={activeRole}
          saving={saving}
          onClose={handleCloseModal}
          onSave={handleSaveRole}
        />
      )}

      <RoleDeleteModal
        role={deleteTarget}
        deleting={deleting}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminDemoPageShell>
  );
};

export default RoleManagement;
