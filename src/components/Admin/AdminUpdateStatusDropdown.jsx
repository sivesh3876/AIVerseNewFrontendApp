import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ACTION_OPTIONS = [
  { id: "status", label: "Update Status" },
  { id: "schedule", label: "Schedule & Delivery" },
  { id: "feedback", label: "Feedback" },
  { id: "timeline", label: "Timeline" },
];

const DotsIcon = () => (
  <svg
    width="4"
    height="18"
    viewBox="0 0 4 18"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="2" cy="2" r="1.75" fill="currentColor" />
    <circle cx="2" cy="9" r="1.75" fill="currentColor" />
    <circle cx="2" cy="16" r="1.75" fill="currentColor" />
  </svg>
);

const AdminUpdateStatusDropdown = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 220;
    const menuHeight = menuRef.current?.offsetHeight || 176;
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

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

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
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          {ACTION_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitem"
              className="admin_demo_action_dropdown__option"
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
          onClick={handleToggle}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Open actions menu"
        >
          <DotsIcon />
        </button>
      </div>
      {menu}
    </>
  );
};

export default AdminUpdateStatusDropdown;
