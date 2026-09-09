import { useCallback, useEffect, useState } from "react";
import {
  CERTIFIED_PROFESSIONALS_CHANGED_EVENT,
  loadCertifiedProfessionals,
  refreshCertifiedProfessionalsFromApi,
} from "../../utils/adminCertifiedProfessionalStorage";

export const useAdminCertifiedProfessionals = (certificationId) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfessionals = useCallback(async () => {
    if (!certificationId) {
      setProfessionals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      try {
        await refreshCertifiedProfessionalsFromApi();
      } catch (apiError) {
        console.warn(
          "Certified professionals API unavailable; showing local/seed data.",
          apiError,
        );
      }
      setProfessionals(loadCertifiedProfessionals(certificationId));
    } catch (loadError) {
      setError(loadError.message || "Failed to load certified professionals.");
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  }, [certificationId]);

  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  useEffect(() => {
    const handleRefresh = () => {
      if (!certificationId) return;
      setProfessionals(loadCertifiedProfessionals(certificationId));
    };

    window.addEventListener(CERTIFIED_PROFESSIONALS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener(
        CERTIFIED_PROFESSIONALS_CHANGED_EVENT,
        handleRefresh,
      );
      window.removeEventListener("storage", handleRefresh);
    };
  }, [certificationId]);

  const handleProfessionalUpdated = useCallback((updatedRecord) => {
    setProfessionals((prev) =>
      prev.map((item) =>
        item.id === updatedRecord.id ? updatedRecord : item,
      ),
    );
  }, []);

  return {
    professionals,
    loading,
    error,
    loadProfessionals,
    handleProfessionalUpdated,
  };
};
