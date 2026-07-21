import { useEffect, useRef, useState } from "react";

const SearchIcon = () => (
  <svg
    className="admin_demo_toolbar__icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 20L16.5 16.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    className="admin_demo_toolbar__icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 6H20M7 12H17M10 18H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ExportIcon = () => (
  <svg
    className="admin_demo_toolbar__icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 4V14M12 14L8.5 10.5M12 14L15.5 10.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M5 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserFilters = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange,
  createdDateFilter,
  onCreatedDateFilterChange,
  roleOptions = [],
  departmentOptions = [],
  statusOptions = [],
  hasActiveFilters,
  onClearFilters,
  onExport,
  exportDisabled = false,
  onAddUser,
  onRefresh,
  loading = false,
  filteredCount = 0,
  totalCount = 0,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filterOpen) return undefined;

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const activeFilterCount = [
    roleFilter !== "all",
    departmentFilter !== "all",
    statusFilter !== "all",
    Boolean(createdDateFilter),
  ].filter(Boolean).length;

  return (
    <div className="admin_demo_toolbar">
      <div className="admin_demo_toolbar__main">
        <label className="admin_demo_toolbar__search">
          <SearchIcon />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, email, department..."
            aria-label="Search users"
          />
        </label>

        <div className="admin_demo_toolbar__actions">
          <div className="admin_demo_toolbar__filter-wrap" ref={filterRef}>
            <button
              type="button"
              className={`admin_demo_toolbar__btn${filterOpen || activeFilterCount ? " is-active" : ""}`}
              onClick={() => setFilterOpen((prev) => !prev)}
              aria-expanded={filterOpen}
              aria-haspopup="true"
            >
              <FilterIcon />
              Filter
              {activeFilterCount > 0 && (
                <span className="admin_demo_toolbar__badge">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filterOpen && (
              <div className="admin_demo_toolbar__filter-panel" role="dialog">
                <div className="admin_demo_toolbar__filter-header">
                  <strong>Filter users</strong>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="admin_demo_toolbar__clear"
                      onClick={onClearFilters}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <label className="admin_demo_toolbar__field">
                  <span>Role</span>
                  <select
                    value={roleFilter}
                    onChange={(event) => onRoleFilterChange(event.target.value)}
                  >
                    <option value="all">All roles</option>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Department</span>
                  <select
                    value={departmentFilter}
                    onChange={(event) =>
                      onDepartmentFilterChange(event.target.value)
                    }
                  >
                    <option value="all">All departments</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      onStatusFilterChange(event.target.value)
                    }
                  >
                    <option value="all">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Date Created</span>
                  <input
                    type="date"
                    value={createdDateFilter}
                    onChange={(event) =>
                      onCreatedDateFilterChange(event.target.value)
                    }
                  />
                </label>
              </div>
            )}
          </div>

          <button
            type="button"
            className="admin_demo_toolbar__btn"
            onClick={onExport}
            disabled={exportDisabled}
          >
            <ExportIcon />
            Export
          </button>

          <button
            type="button"
            className="admin_demo_toolbar__btn admin_demo_toolbar__btn--primary"
            onClick={onAddUser}
          >
            Add User
          </button>

          <button
            type="button"
            className="admin_demo_toolbar__btn"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <p className="admin_demo_toolbar__count">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong>{" "}
        users
      </p>
    </div>
  );
};

export default UserFilters;
