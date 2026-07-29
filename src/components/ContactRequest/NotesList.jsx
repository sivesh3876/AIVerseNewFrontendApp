import { formatNoteDateTime } from "./followUpUtils";

const NotesList = ({ notes = [], loading = false }) => {
  if (loading) {
    return <p className="admin_contact_notes__loading">Loading notes…</p>;
  }

  if (notes.length === 0) {
    return (
      <div className="admin_contact_drawer__empty admin_contact_notes__empty">
        <p>No internal notes yet.</p>
        <span>Add the first note for this lead below.</span>
      </div>
    );
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <ul className="admin_contact_notes_list">
      {sorted.map((note) => (
        <li key={note.id} className="admin_contact_notes_list__item">
          <span className="admin_user_timeline__dot" aria-hidden="true" />
          <div>
            <div className="admin_contact_notes_list__meta">
              <strong>{note.author || "Admin"}</strong>
              <span>{formatNoteDateTime(note.createdAt)}</span>
            </div>
            <p>{note.content}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotesList;
