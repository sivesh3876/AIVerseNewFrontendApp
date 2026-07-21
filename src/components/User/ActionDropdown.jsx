import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DotsIcon = () => (
  <svg width="4" height="18" viewBox="0 0 4 18" fill="none" aria-hidden="true">
    <circle cx="2" cy="2" r="1.75" fill="currentColor" />
    <circle cx="2" cy="9" r="1.75" fill="currentColor" />
    <circle cx="2" cy="16" r="1.75" fill="currentColor" />
  </svg>
);

// Reuses the existing admin action dropdown styling/behaviour (portal + smart
// positioning) so it stays visually consistent with the rest of the panel.
const ActionDropdown = ({ status, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const isActive = status === "Active";

  const options = [
    { id: "view", label: "View" },
    { id: "edit", label: "Edit" },
    { id: "reset-password", label: "Reset Password" },
    { id: "assign-role", label: "Assign Role" },
    {
      id: "toggle-status",
      label: isActive ? "Deactivate" : "Activate",
    },
    { id: "delete", label: "Delete", danger: true },
  ];

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 190;
    const menuHeight = menuRef.current?.offsetHeight || 240;
    const gap = 4;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + gap;

    setMenuPosition({
      top: openUpward ? rect.top - menuHeight - gap : rect.bottom + gap,
      left: Math.min(
        Math.max(12, rect.left),
        window.innerWidth - menuWidth - 12,
      ),
    });
  };

  useLayoutEffect(() => {
    if (open) {
      updateMenuPosition();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleScroll = () => setOpen(false);
    const handleResize = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const handleSelect = (optionId) => {
    onSelect?.(optionId);
    setOpen(false);
  };

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          className="admin_demo_action_dropdown__menu admin_demo_action_dropdown__menu--portal"
          role="menu"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitem"
              className={`admin_demo_action_dropdown__option${option.danger ? " admin_demo_action_dropdown__option--danger" : ""}`}
              onClick={() => handleSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="admin_demo_action_dropdown">
        <button
          ref={triggerRef}
          type="button"
          className="admin_demo_table__dots-btn admin_demo_action_dropdown__trigger"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Open user actions menu"
        >
          <DotsIcon />
        </button>
      </div>
      {menu}
    </>
  );
};

export default ActionDropdown;
