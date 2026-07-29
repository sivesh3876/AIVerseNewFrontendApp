import { useEffect, useMemo, useRef, useState } from "react";
import { getBlogStatusTransitions } from "../../utils/adminBlogStorage";

const AdminBlogStatusDropdown = ({ value = "Published", onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = value || "Published";
  const options = useMemo(() => getBlogStatusTransitions(current), [current]);

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
          {options.map((status) => (
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

export default AdminBlogStatusDropdown;
