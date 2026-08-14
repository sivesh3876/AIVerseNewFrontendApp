import { useCallback, useEffect, useState } from "react";
import {
  CERTIFICATIONS_CHANGED_EVENT,
  loadAdminCertifications,
  refreshCertificationsFromApi,
} from "../../utils/adminCertificationStorage";

export const useAdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCertifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      try {
        await refreshCertificationsFromApi({ includeUnpublished: true });
      } catch (apiError) {
        console.warn(
          "Certification API unavailable; showing local/seed certifications.",
          apiError,
        );
      }
      setCertifications(loadAdminCertifications());
    } catch (loadError) {
      setError(loadError.message || "Failed to load certifications.");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  useEffect(() => {
    const handleRefresh = () => setCertifications(loadAdminCertifications());

    window.addEventListener(CERTIFICATIONS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener(CERTIFICATIONS_CHANGED_EVENT, handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, []);

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
