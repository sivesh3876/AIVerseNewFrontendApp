import { useEffect, useRef, useState } from "react";

const AdminStatusDropdown = ({
  value = "Active",
  onChange,
  statuses = ["Active", "Inactive"],
  defaultStatus = "Active",
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = statuses.includes(value) ? value : defaultStatus;
  const otherStatus = statuses.find((status) => status !== current) || statuses[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <button
            type="button"
            className={`admin_demo_status_dropdown__option admin_demo_status_dropdown__option--${current.toLowerCase()}`}
            onClick={() => handleSelect(current)}
          >
            {current}
          </button>
          <button
            type="button"
            className={`admin_demo_status_dropdown__option admin_demo_status_dropdown__option--${otherStatus.toLowerCase()}`}
            onClick={() => handleSelect(otherStatus)}
          >
            {otherStatus}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminStatusDropdown;
