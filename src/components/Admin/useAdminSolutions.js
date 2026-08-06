import { useCallback, useEffect, useState } from "react";
import { deleteUseCase, fetchAllUseCases } from "../../services/usecasesService";
import {
  filterCatalogSolutions,
  isPlaceholderSolution,
} from "../../utils/adminSolutionTableUtils";

export const useAdminSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSolutions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Match production catalog: active solutions only (same as get-usecases default).
      const data = await fetchAllUseCases({
        includeInactive: false,
        applyLocalOverrides: false,
      });
      const rows = Array.isArray(data) ? data : [];
      const placeholders = rows.filter(isPlaceholderSolution);

      if (placeholders.length > 0) {
        await Promise.allSettled(
          placeholders.map((solution) => deleteUseCase(solution.ID)),
        );
      }

      setSolutions(filterCatalogSolutions(rows));
    } catch (loadError) {
      setError(loadError.message || "Failed to load solutions.");
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  return {
    solutions,
    setSolutions,
    loading,
    error,
    loadSolutions,
  };
};
