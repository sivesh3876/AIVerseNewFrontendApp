// Mock async API for contact request internal notes.
// Replace internals with real fetch/axios when backend is ready.

const MOCK_DELAY_MS = 450;

export const createNoteApi = (requestKey, payload) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `note-${Date.now()}`,
        requestKey,
        createdAt: new Date().toISOString(),
        ...payload,
      });
    }, MOCK_DELAY_MS);
  });

export const fetchNotesApi = (requestKey, notes = []) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(notes), 200);
  });
