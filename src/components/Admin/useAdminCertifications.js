import { useCallback, useEffect, useState } from "react";
import {
  CERTIFICATIONS_CHANGED_EVENT,
  loadAdminCertifications,
} from "../../utils/adminCertificationStorage";

export const useAdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCertifications = useCallback(() => {
    try {
      setLoading(true);
      setError("");
      setCertifications(loadAdminCertifications());
    } catch (loadError) {
      setError(loadError.message || "Failed to load certifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  useEffect(() => {
    const handleRefresh = () => loadCertifications();

    window.addEventListener(CERTIFICATIONS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener(CERTIFICATIONS_CHANGED_EVENT, handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, [loadCertifications]);

  const handleCertificationUpdated = useCallback((updatedRecord) => {
    setCertifications((prev) =>
      prev.map((item) =>
        item.id === updatedRecord.id ? updatedRecord : item,
      ),
    );
  }, []);

  return {
    certifications,
    loading,
    error,
    loadCertifications,
    handleCertificationUpdated,
  };
};
