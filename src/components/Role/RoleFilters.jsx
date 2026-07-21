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

const RoleFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  createdDateFilter,
  onCreatedDateFilterChange,
  userCountFilter,
  onUserCountFilterChange,
  permissionLevelFilter,
  onPermissionLevelFilterChange,
  statusOptions = [],
  userCountOptions = [],
  permissionLevelOptions = [],
  hasActiveFilters,
  onClearFilters,
  onExport,
  exportDisabled = false,
  onAddRole,
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
    statusFilter !== "all",
    Boolean(createdDateFilter),
    userCountFilter !== "all",
    permissionLevelFilter !== "all",
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
            placeholder="Search by role name, description, permission..."
            aria-label="Search roles"
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
                  <strong>Filter roles</strong>
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
                  <span>Created Date</span>
                  <input
                    type="date"
                    value={createdDateFilter}
                    onChange={(event) =>
                      onCreatedDateFilterChange(event.target.value)
                    }
                  />
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Number of Users</span>
                  <select
                    value={userCountFilter}
                    onChange={(event) =>
                      onUserCountFilterChange(event.target.value)
                    }
                  >
                    <option value="all">Any number</option>
                    {userCountOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Permission Level</span>
                  <select
                    value={permissionLevelFilter}
                    onChange={(event) =>
                      onPermissionLevelFilterChange(event.target.value)
                    }
                  >
                    <option value="all">All levels</option>
                    {permissionLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
            onClick={onAddRole}
          >
            Add Role
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
        roles
      </p>
    </div>
  );
};

export default RoleFilters;
