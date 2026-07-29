import { useEffect, useRef, useState } from "react";
import { CERTIFIED_PROFESSIONAL_STATUSES } from "../../utils/adminCertifiedProfessionalStorage";

const AdminCertifiedProfessionalStatusDropdown = ({
  value = "Draft",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = value || "Draft";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, true);

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  const handleSelect = (status) => {
    onChange?.(status);
    setOpen(false);
  };

  return (
    <div className="admin_demo_status_dropdown" ref={rootRef}>
      <button
        type="button"
        className={`admin_demo_table__status admin_demo_table__status--${current.toLowerCase()} admin_demo_status_dropdown__trigger`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current}
        <span aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="admin_demo_status_dropdown__menu" role="listbox">
          {CERTIFIED_PROFESSIONAL_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className={`admin_demo_status_dropdown__option admin_demo_status_dropdown__option--${status.toLowerCase()}`}
              onClick={() => handleSelect(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCertifiedProfessionalStatusDropdown;
