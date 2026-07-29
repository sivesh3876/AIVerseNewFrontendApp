import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAdminCertificationById,
} from "../../utils/adminCertificationStorage";
import AdminCertifiedProfessionalsSection from "./AdminCertifiedProfessionalsSection";
import { useAdminCertifications } from "./useAdminCertifications";
import "./AdminLayout.scss";

const AdminCertifiedProfessionalsPage = () => {
  const { certificationId } = useParams();
  const navigate = useNavigate();
  const { certifications, loading, loadCertifications } = useAdminCertifications();

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const certification = useMemo(() => {
    if (!certificationId) return null;
    return (
      certifications.find((item) => item.id === certificationId) ||
      getAdminCertificationById(certificationId)
    );
  }, [certifications, certificationId]);

  if (loading && !certification) {
    return (
      <section className="admin_certified_professionals_page">
        <p className="admin_certification_detail__loading">
          Loading certified professionals…
        </p>
      </section>
    );
  }

  if (!certification) {
    return (
      <section className="admin_certified_professionals_page">
        <div className="admin_certification_detail__not-found">
          <h1>Certification not found</h1>
          <p>The certification you are looking for does not exist or was removed.</p>
          <Link
            to="/admin/learn-explore"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
          >
            Back to Learn & Explore
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="admin_certified_professionals_page">
      <header className="admin_certified_professionals_page__header">
        <button
          type="button"
          className="admin_certification_detail__back"
          onClick={() => navigate("/admin/learn-explore")}
        >
          ← Back to Learn & Explore
        </button>
      </header>

      <div className="admin_certified_professionals_page__context">
        <div>
          <p className="admin_certified_professionals_page__eyebrow">
            Managing certified professionals for
          </p>
          <h1>{certification.name || "Untitled Certification"}</h1>
          <p>
            {[certification.provider, certification.category, certification.level]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
        </div>
        <div className="admin_certified_professionals_page__actions">
          <Link
            to={`/admin/learn-explore/${certification.id}`}
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
          >
            View Certification
          </Link>
          <Link
            to="/learn-explore/certifications"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Public Page
          </Link>
        </div>
      </div>

      <AdminCertifiedProfessionalsSection
        certificationId={certification.id}
        certification={certification}
      />
    </section>
  );
};

export default AdminCertifiedProfessionalsPage;
