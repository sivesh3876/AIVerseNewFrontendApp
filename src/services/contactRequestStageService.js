// Mock async API for contact request stage updates.
// Replace with real backend call when available.

const MOCK_DELAY_MS = 650;

/** Set to true in dev to simulate API failures. */
const SIMULATE_FAILURE = false;

export const updateContactRequestStageApi = (requestKey, newStage) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_FAILURE) {
        reject(new Error("Unable to update pipeline stage. Please try again."));
        return;
      }
      resolve({ requestKey, stage: newStage, updatedAt: new Date().toISOString() });
    }, MOCK_DELAY_MS);
  });
