import { useEffect, useRef, useState } from "react";

const SOLUTION_STATUSES = ["Active", "Inactive"];

const StatusIcon = ({ status }) => (
  <span
    className={`admin_solution_status_dropdown__icon admin_solution_status_dropdown__icon--${status.toLowerCase()}`}
    aria-hidden="true"
  />
);

const AdminSolutionStatusDropdown = ({ value = "Active", onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = SOLUTION_STATUSES.includes(value) ? value : "Active";

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
    <div className="admin_demo_status_dropdown admin_solution_status_dropdown" ref={rootRef}>
      <button
        type="button"
        className={`admin_demo_table__status admin_demo_table__status--${current.toLowerCase()} admin_demo_status_dropdown__trigger admin_solution_status_dropdown__trigger`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <StatusIcon status={current} />
        {current}
        <span aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="admin_demo_status_dropdown__menu" role="listbox">
          {SOLUTION_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className={`admin_demo_status_dropdown__option admin_demo_status_dropdown__option--${status.toLowerCase()} admin_solution_status_dropdown__option`}
              onClick={() => handleSelect(status)}
            >
              <StatusIcon status={status} />
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSolutionStatusDropdown;
