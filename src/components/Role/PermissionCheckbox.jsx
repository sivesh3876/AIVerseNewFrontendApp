// Single permission checkbox. Kept tiny and presentational so it can be reused
// by both the modal permission section and any future Permission Management UI.
const PermissionCheckbox = ({ id, label, checked, disabled = false, onChange }) => (
  <label
    className={`admin_permission_checkbox${disabled ? " is-disabled" : ""}`}
  >
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange?.(id, event.target.checked)}
    />
    <span>{label}</span>
  </label>
);

export default PermissionCheckbox;
