export const SOLUTION_STATUS_STORAGE_KEY = "aiverse_inactive_solution_ids";
export const SOLUTION_STATUS_UPDATED_EVENT = "aiverse:solution-status-updated";

const readInactiveIds = () => {
  try {
    const raw = localStorage.getItem(SOLUTION_STATUS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const writeInactiveIds = (ids) => {
  try {
    localStorage.setItem(
      SOLUTION_STATUS_STORAGE_KEY,
      JSON.stringify([...new Set(ids.map(String))]),
    );
  } catch {
    // Ignore quota / private-mode errors.
  }
  window.dispatchEvent(new CustomEvent(SOLUTION_STATUS_UPDATED_EVENT));
};

export const getInactiveSolutionIdSet = () => new Set(readInactiveIds());

export const isSolutionIdMarkedInactiveLocally = (solutionId) =>
  getInactiveSolutionIdSet().has(String(solutionId ?? ""));

export const setSolutionInactiveLocally = (solutionId, isInactive) => {
  if (solutionId == null || solutionId === "") return;

  const id = String(solutionId);
  const next = new Set(readInactiveIds());
  if (isInactive) next.add(id);
  else next.delete(id);
  writeInactiveIds([...next]);
};

/** Merge local inactive flags onto API solutions (backend may not persist status). */
export const applyInactiveSolutionOverrides = (solutions = []) => {
  const inactiveIds = getInactiveSolutionIdSet();
  if (inactiveIds.size === 0) return solutions;

  return solutions.map((solution) => {
    const id = String(solution?.ID ?? solution?.id ?? "");
    if (!id || !inactiveIds.has(id)) return solution;

    return {
      ...solution,
      IsSolutionActive: false,
      Publish: "No",
      PublicationStatus: "Draft",
    };
  });
};
