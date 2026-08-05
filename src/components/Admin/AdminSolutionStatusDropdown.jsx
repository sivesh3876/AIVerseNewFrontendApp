import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SOLUTION_STATUSES = ["Active", "Inactive"];

const StatusIcon = ({ status }) => (
  <span
    className={`admin_solution_status_dropdown__icon admin_solution_status_dropdown__icon--${String(
      status,
    ).toLowerCase()}`}
    aria-hidden="true"
  />
);

const AdminSolutionStatusDropdown = ({
  value = "Active",
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const current = SOLUTION_STATUSES.includes(value) ? value : "Active";

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 140;
    const menuHeight = menuRef.current?.offsetHeight || 96;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + gap;

    setMenuPosition({
      top: openUpward ? rect.top - menuHeight - gap : rect.bottom + gap,
      left: Math.min(
        Math.max(8, rect.right - menuWidth),
        window.innerWidth - menuWidth - 8,
      ),
    });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    // Re-measure after portal paints so height/width are accurate.
    const frame = window.requestAnimationFrame(updateMenuPosition);
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDownOutside = (event) => {
      const target = event.target;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDownOutside, true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateMenuPosition);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutside,
        true,
      );
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [open]);

  const handleSelect = (status) => {
    if (disabled) return;
    setOpen(false);
    if (status === current) return;
    onChange?.(status);
  };

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          className="admin_demo_status_dropdown__menu admin_demo_status_dropdown__menu--portal"
          role="listbox"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {SOLUTION_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={status === current}
              className={`admin_demo_status_dropdown__option admin_demo_status_dropdown__option--${status.toLowerCase()} admin_solution_status_dropdown__option`}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSelect(status);
              }}
            >
              <StatusIcon status={status} />
              {status}
            </button>
          ))}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="admin_demo_status_dropdown admin_solution_status_dropdown">
        <button
          ref={triggerRef}
          type="button"
          className={`admin_demo_table__status admin_demo_table__status--${current.toLowerCase()} admin_demo_status_dropdown__trigger admin_solution_status_dropdown__trigger`}
          onClick={(event) => {
            event.stopPropagation();
            if (disabled) return;
            setOpen((prev) => !prev);
          }}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <StatusIcon status={current} />
          {current}
          <span aria-hidden="true">▾</span>
        </button>
      </div>
      {menu}
    </>
  );
};

export default AdminSolutionStatusDropdown;
