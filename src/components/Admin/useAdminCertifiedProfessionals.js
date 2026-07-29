import { useCallback, useEffect, useState } from "react";
import {
  CERTIFIED_PROFESSIONALS_CHANGED_EVENT,
  loadCertifiedProfessionals,
} from "../../utils/adminCertifiedProfessionalStorage";

export const useAdminCertifiedProfessionals = (certificationId) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfessionals = useCallback(() => {
    if (!certificationId) {
      setProfessionals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setProfessionals(loadCertifiedProfessionals(certificationId));
    } catch (loadError) {
      setError(loadError.message || "Failed to load certified professionals.");
    } finally {
      setLoading(false);
    }
  }, [certificationId]);

  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  useEffect(() => {
    const handleRefresh = () => loadProfessionals();

    window.addEventListener(CERTIFIED_PROFESSIONALS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener(
        CERTIFIED_PROFESSIONALS_CHANGED_EVENT,
        handleRefresh,
      );
      window.removeEventListener("storage", handleRefresh);
    };
  }, [loadProfessionals]);

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
