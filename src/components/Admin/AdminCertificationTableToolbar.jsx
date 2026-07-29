import { useEffect, useRef, useState } from "react";
import {
  CERTIFICATION_LEVELS,
  CERTIFICATION_STATUSES,
} from "../../utils/adminCertificationStorage";

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
    <path
      d="M5 18H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AdminCertificationTableToolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  levelFilter,
  onLevelFilterChange,
  providerFilter,
  onProviderFilterChange,
  categoryOptions = [],
  levelOptions = [],
  providerOptions = [],
  hasActiveFilters,
  onClearFilters,
  onExport,
  exportDisabled = false,
  onAddCertification,
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
    categoryFilter !== "all",
    levelFilter !== "all",
    providerFilter !== "all",
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
            placeholder="Search by name, provider, category, level..."
            aria-label="Search certifications"
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
                <span className="admin_demo_toolbar__badge">{activeFilterCount}</span>
              )}
            </button>

            {filterOpen && (
              <div className="admin_demo_toolbar__filter-panel" role="dialog">
                <div className="admin_demo_toolbar__filter-header">
                  <strong>Filter records</strong>
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
                    onChange={(event) => onStatusFilterChange(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {CERTIFICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Category</span>
                  <select
                    value={categoryFilter}
                    onChange={(event) => onCategoryFilterChange(event.target.value)}
                  >
                    <option value="all">All categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Level</span>
                  <select
                    value={levelFilter}
                    onChange={(event) => onLevelFilterChange(event.target.value)}
                  >
                    <option value="all">All levels</option>
                    {(levelOptions.length ? levelOptions : CERTIFICATION_LEVELS).map(
                      (level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="admin_demo_toolbar__field">
                  <span>Provider</span>
                  <select
                    value={providerFilter}
                    onChange={(event) => onProviderFilterChange(event.target.value)}
                  >
                    <option value="all">All providers</option>
                    {providerOptions.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
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
            onClick={onAddCertification}
          >
            Add Certification
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
        records
      </p>
    </div>
  );
};

export default AdminCertificationTableToolbar;
