import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDemoPageShell from "../../components/Admin/AdminDemoPageShell";
import AdminBlogPagination from "../../components/Admin/AdminBlogPagination";
import UserFilters from "../../components/User/UserFilters";
import UserTable from "../../components/User/UserTable";
import UserModal from "../../components/User/UserModal";
import UserDeleteModal from "../../components/User/UserDeleteModal";
import UserAssignRoleModal from "../../components/User/UserAssignRoleModal";
import {
  USER_DEPARTMENTS,
  USER_ROLES,
  USER_STATUSES,
  assignUserRole,
  createUser,
  deleteUser,
  fetchUsers,
  resetUserPassword,
  setUserStatus,
  updateUser,
} from "../../services/userService";
import { exportUsersToCsv, filterUsers } from "../../utils/userTableUtils";
import "../../components/Admin/AdminLayout.scss";

const PAGE_SIZE = 10;

const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalMode, setModalMode] = useState(null); // "add" | "edit"
  const [activeUser, setActiveUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [roleTarget, setRoleTarget] = useState(null);
  const [assigningRole, setAssigningRole] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      setUsers(data);
    } catch (loadError) {
      setError(loadError.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(
    () =>
      filterUsers(users, {
        search: searchQuery,
        role: roleFilter,
        department: departmentFilter,
        status: statusFilter,
        createdDate: createdDateFilter,
      }),
    [users, searchQuery, roleFilter, departmentFilter, statusFilter, createdDateFilter],
  );

  const sortedUsers = useMemo(
    () =>
      [...filteredUsers].sort(
        (left, right) => Number(right.id || 0) - Number(left.id || 0),
      ),
    [filteredUsers],
  );

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [sortedUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, departmentFilter, statusFilter, createdDateFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    roleFilter !== "all" ||
    departmentFilter !== "all" ||
    statusFilter !== "all" ||
    Boolean(createdDateFilter);

  const handleClearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setCreatedDateFilter("");
  };

  const handleExport = () => {
    const exported = exportUsersToCsv(
      sortedUsers,
      `user-records-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    if (!exported) {
      window.alert("No records available to export.");
    }
  };

  const handleOpenAdd = () => {
    setActiveUser(null);
    setModalMode("add");
  };

  const handleCloseModal = () => {
    if (saving) return;
    setModalMode(null);
    setActiveUser(null);
  };

  const handleSaveUser = async (payload) => {
    try {
      setSaving(true);
      if (modalMode === "edit" && activeUser) {
        await updateUser(activeUser.id, payload);
      } else {
        await createUser(payload);
      }
      setModalMode(null);
      setActiveUser(null);
      await loadUsers();
    } catch (saveError) {
      window.alert(saveError.message || "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (user, action) => {
    switch (action) {
      case "view":
        navigate(`/admin/user-management/${user.id}`);
        break;
      case "edit":
        setActiveUser(user);
        setModalMode("edit");
        break;
      case "reset-password":
        await resetUserPassword(user.id);
        window.alert(`A password reset link has been sent to ${user.email}.`);
        break;
      case "assign-role":
        setRoleTarget(user);
        break;
      case "toggle-status": {
        const nextStatus = user.status === "Active" ? "Inactive" : "Active";
        await setUserStatus(user.id, nextStatus);
        await loadUsers();
        break;
      }
      case "delete":
        setDeleteTarget(user);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = async (user) => {
    try {
      setDeleting(true);
      await deleteUser(user.id);
      setDeleteTarget(null);
      await loadUsers();
    } catch (deleteError) {
      window.alert(deleteError.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmRole = async (role) => {
    if (!roleTarget) return;
    try {
      setAssigningRole(true);
      await assignUserRole(roleTarget.id, role);
      setRoleTarget(null);
      await loadUsers();
    } catch (roleError) {
      window.alert(roleError.message || "Failed to assign role.");
    } finally {
      setAssigningRole(false);
    }
  };

  return (
    <AdminDemoPageShell
      title="User Management"
      description="Manage all users of the platform."
      error={error}
    >
      {!error && (
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          createdDateFilter={createdDateFilter}
          onCreatedDateFilterChange={setCreatedDateFilter}
          roleOptions={USER_ROLES}
          departmentOptions={USER_DEPARTMENTS}
          statusOptions={USER_STATUSES}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          exportDisabled={sortedUsers.length === 0}
          onAddUser={handleOpenAdd}
          onRefresh={loadUsers}
          loading={loading}
          filteredCount={sortedUsers.length}
          totalCount={users.length}
        />
      )}

      <UserTable
        users={paginatedUsers}
        loading={loading}
        totalCount={users.length}
        onAction={handleAction}
      />

      {!loading && sortedUsers.length > 0 && (
        <AdminBlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedUsers.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="users"
        />
      )}

      {modalMode && (
        <UserModal
          mode={modalMode}
          user={activeUser}
          saving={saving}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}

      <UserDeleteModal
        user={deleteTarget}
        deleting={deleting}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <UserAssignRoleModal
        user={roleTarget}
        saving={assigningRole}
        onClose={() => !assigningRole && setRoleTarget(null)}
        onConfirm={handleConfirmRole}
      />
    </AdminDemoPageShell>
  );
};

export default UserManagement;
