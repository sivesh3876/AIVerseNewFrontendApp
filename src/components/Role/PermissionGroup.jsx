import { useState } from "react";
import PermissionCheckbox from "./PermissionCheckbox";

const ChevronIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// A single collapsible module group of permissions, with its own "select all"
// for the module. Collapsed/expanded state is local to the group.
const PermissionGroup = ({ group, selected, disabled = false, onToggle, onToggleGroup }) => {
  const [open, setOpen] = useState(true);

  const ids = group.permissions.map((permission) => permission.id);
  const selectedCount = ids.filter((id) => selected.includes(id)).length;
  const allSelected = selectedCount === ids.length && ids.length > 0;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="admin_permission_group">
      <div className="admin_permission_group__head">
        <button
          type="button"
          className="admin_permission_group__toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <ChevronIcon open={open} />
          <span className="admin_permission_group__title">{group.module}</span>
          <span className="admin_permission_group__count">
            {selectedCount}/{ids.length}
          </span>
        </button>

        <label className="admin_permission_group__all">
          <input
            type="checkbox"
            checked={allSelected}
            disabled={disabled}
            ref={(node) => {
              if (node) node.indeterminate = someSelected;
            }}
            onChange={(event) => onToggleGroup?.(ids, event.target.checked)}
          />
          <span>Select all</span>
        </label>
      </div>

      {open && (
        <div className="admin_permission_group__items">
          {group.permissions.map((permission) => (
            <PermissionCheckbox
              key={permission.id}
              id={permission.id}
              label={permission.label}
              checked={selected.includes(permission.id)}
              disabled={disabled}
              onChange={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionGroup;
