const SearchIcon = () => (
  <svg className="admin_demo_toolbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg className="admin_demo_toolbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ExportIcon = () => (
  <svg className="admin_demo_toolbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 4V14M12 14L8.5 10.5M12 14L15.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const KanbanIcon = () => (
  <svg className="admin_demo_toolbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="5" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="10" y="3" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="17" y="3" width="5" height="15" rx="1" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const TableIcon = () => (
  <svg className="admin_demo_toolbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ContactRequestToolbar = ({
  viewMode,
  onViewChange,
  onFilterOpen,
  filterActive,
  onRefresh,
}) => (
  <div className="admin_demo_toolbar">
    <div className="admin_demo_toolbar__main">
      <label className="admin_demo_toolbar__search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search by name, company, email or phone..."
          aria-label="Search contact requests"
          readOnly
        />
      </label>

      <div className="admin_demo_toolbar__actions">
        <button
          type="button"
          className={`admin_demo_toolbar__btn${filterActive ? " is-active" : ""}`}
          onClick={onFilterOpen}
        >
          <FilterIcon />
          Filter
        </button>

        <button type="button" className="admin_demo_toolbar__btn">
          <ExportIcon />
          Export
        </button>

        <button type="button" className="admin_demo_toolbar__btn" onClick={onRefresh}>
          Refresh
        </button>

        <div className="admin_contact_view_toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`admin_contact_view_toggle__btn${viewMode === "kanban" ? " is-active" : ""}`}
            onClick={() => onViewChange("kanban")}
            aria-pressed={viewMode === "kanban"}
          >
            <KanbanIcon />
            Kanban
          </button>
          <button
            type="button"
            className={`admin_contact_view_toggle__btn${viewMode === "table" ? " is-active" : ""}`}
            onClick={() => onViewChange("table")}
            aria-pressed={viewMode === "table"}
          >
            <TableIcon />
            Table
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ContactRequestToolbar;
