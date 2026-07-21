// Mock async API for contact request follow-ups.
// Replace internals with real fetch/axios when backend is ready.

const MOCK_DELAY_MS = 550;

export const createFollowUpApi = (requestKey, payload) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `fu-${Date.now()}`,
        requestKey,
        status: "Scheduled",
        createdAt: new Date().toISOString(),
        ...payload,
      });
    }, MOCK_DELAY_MS);
  });

export const fetchFollowUpsApi = (requestKey, followUps = []) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(followUps), 200);
  });
