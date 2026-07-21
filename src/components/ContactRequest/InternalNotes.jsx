import { useState } from "react";
import NotesList from "./NotesList";

const InternalNotes = ({ notes = [], saving = false, onSaveNote }) => {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Note cannot be empty.");
      return;
    }
    setError("");
    onSaveNote?.(trimmed, () => setDraft(""));
  };

  return (
    <section className="admin_contact_notes">
      <h3>Internal Notes</h3>

      <label className="admin_blog_form__field admin_blog_form__field--full">
        <span>Add a note</span>
        <textarea
          rows={4}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError("");
          }}
          placeholder="Write an internal note for your team..."
          disabled={saving}
        />
      </label>

      {error && <p className="admin_request_demos__error">{error}</p>}

      <button
        type="button"
        className="admin_request_demos__btn admin_request_demos__btn--primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Note"}
      </button>

      <div className="admin_contact_notes__list-wrap">
        <NotesList notes={notes} loading={false} />
      </div>
    </section>
  );
};

export default InternalNotes;
