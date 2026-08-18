import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CERTIFIED_PROFESSIONAL_STATUSES } from "../../utils/adminCertifiedProfessionalStorage";

const AdminCertifiedProfessionalStatusDropdown = ({
  value = "Draft",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const current = CERTIFIED_PROFESSIONAL_STATUSES.includes(value)
    ? value
    : "Draft";

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 120;
    const menuHeight = menuRef.current?.offsetHeight || 88;
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
          {CERTIFIED_PROFESSIONAL_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={status === current}
              className={`admin_demo_status_dropdown__option admin_demo_status_dropdown__option--${status.toLowerCase()}`}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSelect(status);
              }}
            >
              {status}
            </button>
          ))}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="admin_demo_status_dropdown">
        <button
          ref={triggerRef}
          type="button"
          className={`admin_demo_table__status admin_demo_table__status--${current.toLowerCase()} admin_demo_status_dropdown__trigger`}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((prev) => !prev);
          }}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {current}
          <span aria-hidden="true">▾</span>
        </button>
      </div>
      {menu}
    </>
  );
};

export default AdminCertifiedProfessionalStatusDropdown;
