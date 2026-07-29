import { useCallback, useEffect, useState } from "react";
import { fetchAdminDemoRequests } from "../../services/demoRequestService";
import { DEMO_REQUESTS_CHANGED_EVENT } from "../../utils/demoRequestStorage";

export const useAdminDemoRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAdminDemoRequests();
      setRequests(data);
    } catch (loadError) {
      setError(loadError.message || "Failed to load demo requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    const handleRefresh = () => {
      loadRequests();
    };

    window.addEventListener(DEMO_REQUESTS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("storage", handleRefresh);
    window.addEventListener("focus", handleRefresh);

    return () => {
      window.removeEventListener(DEMO_REQUESTS_CHANGED_EVENT, handleRefresh);
      window.removeEventListener("storage", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [loadRequests]);

  const handleRequestUpdated = useCallback((updatedRequest) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === updatedRequest.id ? updatedRequest : item,
      ),
    );
  }, []);

  return {
    requests,
    loading,
    error,
    loadRequests,
    handleRequestUpdated,
  };
};
