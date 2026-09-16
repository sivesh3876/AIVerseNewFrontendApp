import { useMemo, useState } from "react";
import "./TeamMemberMultiSelect.scss";

const AVATAR_COLORS = [
  "#3A8D9D",
  "#6366f1",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#64748b",
];

export const getMemberInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const avatarColorFor = (name = "") => {
  let hash = 0;
  const text = String(name);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash + text.charCodeAt(i) * (i + 1)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash];
};

const namesMatch = (a, b) =>
  String(a || "")
    .trim()
    .toLowerCase() ===
  String(b || "")
    .trim()
    .toLowerCase();

const PeopleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M3.5 19c.6-2.5 2.7-4 5-4s4.4 1.5 5 4M12.5 19c.5-2.1 2-3.5 4-3.5s3.6 1.4 4 3.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="m16 16 4 4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Polished multi-select for team members (search + chips + checkbox list).
 */
const TeamMemberMultiSelect = ({
  members = [],
  selected = [],
  onChange,
  loading = false,
  title = "Assign To",
  subtitle = "Select team members (multiple)",
  showHeader = true,
  isAddingMember = false,
  onStartAddMember,
  onCancelAddMember,
  newMemberName = "",
  newMemberEmail = "",
  onNewMemberNameChange,
  onNewMemberEmailChange,
  onAddMember,
  addMemberError = "",
  saving = false,
}) => {
  const [query, setQuery] = useState("");

  const selectedCount = selected.length;
  const memberCount = members.length;

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((member) => {
      const name = String(member.name || "").toLowerCase();
      const email = String(member.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [members, query]);

  const isSelected = (name) => selected.some((person) => namesMatch(person.name, name));

  const handleToggle = (member) => {
    if (!onChange) return;
    if (isSelected(member.name)) {
      onChange(
        selected.filter((person) => !namesMatch(person.name, member.name)),
      );
      return;
    }
    onChange([...selected, member]);
  };

  const handleRemove = (name) => {
    if (!onChange) return;
    onChange(selected.filter((person) => !namesMatch(person.name, name)));
  };

  return (
    <div className="team_member_multi_select">
      {showHeader ? (
        <div className="team_member_multi_select__header">
          <div className="team_member_multi_select__title-wrap">
            <span className="team_member_multi_select__icon" aria-hidden="true">
              <PeopleIcon />
            </span>
            <div>
              <h4 className="team_member_multi_select__title">{title}</h4>
              <p className="team_member_multi_select__subtitle">{subtitle}</p>
            </div>
          </div>
          <span className="team_member_multi_select__count-pill">
            Team Members • {selectedCount} selected
          </span>
        </div>
      ) : (
        <div className="team_member_multi_select__header team_member_multi_select__header--compact">
          <span className="team_member_multi_select__count-pill">
            Team Members • {selectedCount} selected
          </span>
        </div>
      )}

      <label className="team_member_multi_select__search">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search team members..."
          aria-label="Search team members"
        />
      </label>

      {selectedCount > 0 ? (
        <div className="team_member_multi_select__chips" aria-label="Selected team members">
          {selected.map((person) => (
            <div key={person.name} className="team_member_multi_select__chip">
              <span
                className="team_member_multi_select__avatar"
                style={{ background: avatarColorFor(person.name) }}
                aria-hidden="true"
              >
                <span className="team_member_multi_select__avatar-text">
                  {getMemberInitials(person.name)}
                </span>
              </span>
              <span className="team_member_multi_select__chip-meta">
                <strong>{person.name}</strong>
                {person.email ? <span>{person.email}</span> : null}
              </span>
              <button
                type="button"
                className="team_member_multi_select__chip-remove"
                onClick={() => handleRemove(person.name)}
                aria-label={`Remove ${person.name}`}
                disabled={saving}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="team_member_multi_select__empty">No team members selected</p>
      )}

      <div className="team_member_multi_select__list-head">
        <span>All Team Members</span>
        <span>
          {selectedCount} of {memberCount} selected
        </span>
      </div>

      <div
        className="team_member_multi_select__list"
        role="group"
        aria-label="Assignable team members"
      >
        {loading ? (
          <p className="team_member_multi_select__empty">Loading team members…</p>
        ) : filteredMembers.length === 0 ? (
          <p className="team_member_multi_select__empty">
            {memberCount === 0
              ? "No team members found. Add one below."
              : "No members match your search."}
          </p>
        ) : (
          filteredMembers.map((member) => {
            const checked = isSelected(member.name);
            return (
              <label
                key={member.name}
                className={`team_member_multi_select__option${
                  checked ? " is-selected" : ""
                }`}
              >
                <span
                  className="team_member_multi_select__avatar"
                  style={{ background: avatarColorFor(member.name) }}
                  aria-hidden="true"
                >
                  <span className="team_member_multi_select__avatar-text">
                    {getMemberInitials(member.name)}
                  </span>
                </span>
                <span className="team_member_multi_select__option-meta">
                  <span className="team_member_multi_select__name">
                    {member.name}
                  </span>
                  {member.email ? (
                    <span className="team_member_multi_select__email">
                      {member.email}
                    </span>
                  ) : null}
                </span>
                <span className="team_member_multi_select__badge">Team Member</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggle(member)}
                  disabled={saving}
                />
              </label>
            );
          })
        )}
      </div>

      {!isAddingMember ? (
        <button
          type="button"
          className="team_member_multi_select__add-btn"
          onClick={onStartAddMember}
          disabled={saving || !onStartAddMember}
        >
          + Add team member
        </button>
      ) : (
        <div className="team_member_multi_select__add-form">
          <input
            type="text"
            value={newMemberName}
            onChange={(event) => onNewMemberNameChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddMember?.();
              }
            }}
            placeholder="Enter member name"
            autoFocus
          />
          <input
            type="email"
            value={newMemberEmail}
            onChange={(event) => onNewMemberEmailChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddMember?.();
              }
            }}
            placeholder="Enter member email"
          />
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            onClick={onAddMember}
            disabled={saving}
          >
            Add
          </button>
          <button
            type="button"
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            onClick={onCancelAddMember}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      )}

      {addMemberError ? (
        <p className="admin_request_demos__error">{addMemberError}</p>
      ) : null}

      <p className="team_member_multi_select__footer-status">
        <PeopleIcon />
        <span>
          {selectedCount} member{selectedCount === 1 ? "" : "s"} selected
        </span>
      </p>
    </div>
  );
};

export default TeamMemberMultiSelect;
