import { useEffect, useMemo, useState } from "react";
import {
  ASSIGNEE_OPTIONS,
  COUNTRY_OPTIONS,
  INDUSTRY_OPTIONS,
  PIPELINE_STAGES,
} from "./placeholders";
import {
  fetchSolutionOwnerMembers,
  loadTeamMembers,
  saveTeamMember,
} from "./followUpUtils";

export const EMPTY_LEAD_FILTERS = {
  stage: "all",
  assignedTo: "all",
  industry: "all",
  country: "all",
  submissionDate: "",
};

const ContactRequestFilterPanel = ({
  open,
  values = EMPTY_LEAD_FILTERS,
  onChange,
  onApply,
  onReset,
  onClose,
}) => {
  const [ownerNames, setOwnerNames] = useState([]);

  useEffect(() => {
    if (!open) return undefined;

    let isMounted = true;
    fetchSolutionOwnerMembers().then((owners) => {
      if (!isMounted) return;
      owners.forEach((owner) => {
        if (owner.email) {
          saveTeamMember(owner.name, owner.email);
        }
      });
      setOwnerNames(owners.map((owner) => owner.name));
    });

    return () => {
      isMounted = false;
    };
  }, [open]);

  const assigneeOptions = useMemo(() => {
    const stored = loadTeamMembers().map((member) => member.name);
    return [
      ...new Set([...ASSIGNEE_OPTIONS, ...ownerNames, ...stored]),
    ].sort((a, b) => a.localeCompare(b));
  }, [open, ownerNames]);

  if (!open) return null;

  const updateField = (field, value) => {
    onChange?.({ ...values, [field]: value });
  };

  const handleApply = () => {
    onApply?.();
    onClose?.();
  };

  const handleReset = () => {
    onReset?.();
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        className="admin_contact_filter__backdrop"
        aria-label="Close filters"
        onClick={onClose}
      />
      <aside className="admin_contact_filter" role="dialog" aria-label="Filter leads">
        <header className="admin_contact_filter__head">
          <div>
            <p className="admin_demo_modal__eyebrow">Filters</p>
            <h3>Filter Leads</h3>
          </div>
          <button
            type="button"
            className="admin_demo_modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="admin_contact_filter__body">
          <label className="admin_demo_toolbar__field">
            <span>Stage</span>
            <select
              value={values.stage}
              onChange={(event) => updateField("stage", event.target.value)}
            >
              <option value="all">All stages</option>
              {PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Assigned To</span>
            <select
              value={values.assignedTo}
              onChange={(event) => updateField("assignedTo", event.target.value)}
            >
              <option value="all">Anyone</option>
              {assigneeOptions.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Industry</span>
            <select
              value={values.industry}
              onChange={(event) => updateField("industry", event.target.value)}
            >
              <option value="all">All industries</option>
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Country</span>
            <select
              value={values.country}
              onChange={(event) => updateField("country", event.target.value)}
            >
              <option value="all">All countries</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label className="admin_demo_toolbar__field">
            <span>Submission Date</span>
            <input
              type="date"
              value={values.submissionDate || ""}
              onChange={(event) =>
                updateField("submissionDate", event.target.value)
              }
            />
          </label>
        </div>

        <footer className="admin_contact_filter__footer">
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
};

export default ContactRequestFilterPanel;
