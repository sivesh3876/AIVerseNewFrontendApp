import { PERMISSION_CATALOG, getAllPermissionIds } from "../../services/roleService";
import PermissionGroup from "./PermissionGroup";

// Full permission matrix used inside the Add/Edit Role modal. Handles the global
// "Select all", per-module select all, and a scrollable container. Read-only
// mode is supported for the details view.
const PermissionSection = ({ selected = [], readOnly = false, onChange }) => {
  const allIds = getAllPermissionIds();
  const allSelected = allIds.every((id) => selected.includes(id));

  const togglePermission = (id, checked) => {
    if (readOnly) return;
    const next = checked
      ? [...new Set([...selected, id])]
      : selected.filter((item) => item !== id);
    onChange?.(next);
  };

  const toggleGroup = (ids, checked) => {
    if (readOnly) return;
    const next = checked
      ? [...new Set([...selected, ...ids])]
      : selected.filter((item) => !ids.includes(item));
    onChange?.(next);
  };

  const toggleAll = (checked) => {
    if (readOnly) return;
    onChange?.(checked ? allIds : []);
  };

  return (
    <div className="admin_permission_section">
      <div className="admin_permission_section__head">
        <div>
          <strong>Permissions</strong>
          <span className="admin_permission_section__summary">
            {selected.length} of {allIds.length} selected
          </span>
        </div>
        {!readOnly && (
          <label className="admin_permission_section__select-all">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(event) => toggleAll(event.target.checked)}
            />
            <span>Select All</span>
          </label>
        )}
      </div>

      <div className="admin_permission_section__scroll">
        {PERMISSION_CATALOG.map((group) => (
          <PermissionGroup
            key={group.key}
            group={group}
            selected={selected}
            disabled={readOnly}
            onToggle={togglePermission}
            onToggleGroup={toggleGroup}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionSection;
