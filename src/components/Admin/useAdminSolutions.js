import { useCallback, useEffect, useState } from "react";
import { fetchAllUseCases } from "../../services/usecasesService";

export const useAdminSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSolutions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllUseCases();
      setSolutions(Array.isArray(data) ? data : []);
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
