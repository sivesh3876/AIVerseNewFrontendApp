import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  getAdminCertificationById,
  normalizeCertificationUrl,
} from "../../utils/adminCertificationStorage";
import { stripHtml } from "../../utils/htmlContent";
import { useAdminCertifications } from "./useAdminCertifications";
import AdminCertifiedProfessionalsSection from "./AdminCertifiedProfessionalsSection";
import "./AdminLayout.scss";

const formatTotalCertified = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const AdminCertificationDetail = () => {
  const { certificationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { certifications, loading, loadCertifications } = useAdminCertifications();

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  useEffect(() => {
    if (location.hash !== "#certified-professionals") return undefined;

    const timer = window.setTimeout(() => {
      const section = document.getElementById("certified-professionals");
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [location.hash, certificationId, loading]);

  const certification = useMemo(() => {
    if (!certificationId) return null;
    return (
      certifications.find((item) => item.id === certificationId) ||
      getAdminCertificationById(certificationId)
    );
  }, [certifications, certificationId]);

  const externalUrl = normalizeCertificationUrl(certification?.externalUrl);
  const hasDescription = Boolean(stripHtml(certification?.description));
  const totalCertified = formatTotalCertified(certification?.totalCertified);

  if (loading && !certification) {
    return (
      <section className="admin_certification_detail">
        <p className="admin_certification_detail__loading">
          Loading certification details…
        </p>
      </section>
    );
  }

  if (!certification) {
    return (
      <section className="admin_certification_detail">
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
    <section className="admin_certification_detail">
      <header className="admin_certification_detail__header">
        <button
          type="button"
          className="admin_certification_detail__back"
          onClick={() => navigate("/admin/learn-explore")}
        >
          ← Back to Learn & Explore
        </button>
      </header>

      <div className="admin_certification_detail__banner-wrap">
        {certification.bannerImage ? (
          <img
            src={certification.bannerImage}
            alt={`${certification.name} banner`}
            className="admin_certification_detail__banner"
          />
        ) : (
          <div
            className="admin_certification_detail__banner admin_certification_detail__banner--placeholder"
            aria-hidden="true"
          />
        )}
        <div className="admin_certification_detail__banner-overlay" />
      </div>

      <div className="admin_certification_detail__content">
        <div className="admin_certification_detail__intro">
          <div className="admin_certification_detail__thumbnail-wrap">
            {certification.thumbnailImage ? (
              <img
                src={certification.thumbnailImage}
                alt={`${certification.name} thumbnail`}
                className="admin_certification_detail__thumbnail"
              />
            ) : (
              <div className="admin_certification_detail__thumbnail admin_certification_detail__thumbnail--placeholder">
                <span>{certification.code || "CERT"}</span>
              </div>
            )}
          </div>

          <div className="admin_certification_detail__intro-copy">
            {certification.category && (
              <span className="admin_certification_detail__badge">
                {certification.category}
              </span>
            )}
            <h1>{certification.name}</h1>
            {certification.code && (
              <p className="admin_certification_detail__code">
                Certification Code: <strong>{certification.code}</strong>
              </p>
            )}
            <p className="admin_certification_detail__provider">
              Provider: <strong>{certification.provider || "—"}</strong>
            </p>
          </div>
        </div>

        <div className="admin_certification_detail__stats">
          <article>
            <span>Status</span>
            <strong
              className={`admin_certification_detail__status admin_certification_detail__status--${String(certification.status || "active").toLowerCase()}`}
            >
              {certification.status || "Active"}
            </strong>
          </article>
          <article>
            <span>Level</span>
            <strong>{certification.level || "—"}</strong>
          </article>
          <article>
            <span>Total Certified Employees</span>
            <strong>{totalCertified}</strong>
          </article>
        </div>

        <div className="admin_certification_detail__grid">
          <section className="admin_certification_detail__panel">
            <h2>Description</h2>
            {hasDescription ? (
              <div
                className="admin_certification_detail__description"
                dangerouslySetInnerHTML={{ __html: certification.description }}
              />
            ) : (
              <p className="admin_demo_detail__empty">—</p>
            )}
          </section>

          <section className="admin_certification_detail__panel">
            <h2>Skills Covered</h2>
            <p>
              {certification.skillsCovered || (
                <span className="admin_demo_detail__empty">—</span>
              )}
            </p>
          </section>

          <section className="admin_certification_detail__panel">
            <h2>Attachment</h2>
            {certification.attachmentFile ? (
              <p>
                <a
                  href={certification.attachmentFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin_blog_view__link"
                  download={certification.attachmentName || undefined}
                >
                  {certification.attachmentName || "View uploaded file"}
                </a>
              </p>
            ) : (
              <p className="admin_demo_detail__empty">—</p>
            )}
          </section>

          <section className="admin_certification_detail__panel">
            <h2>Certification Details</h2>
            <dl className="admin_certification_detail__meta">
              <div>
                <dt>Category</dt>
                <dd>{certification.category || "—"}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{certification.duration || "—"}</dd>
              </div>
              <div>
                <dt>Validity</dt>
                <dd>{certification.validity || "—"}</dd>
              </div>
              <div>
                <dt>Created Date</dt>
                <dd>{certification.createdDate || "—"}</dd>
              </div>
              <div className="admin_certification_detail__meta-item--full">
                <dt>External Certification Link</dt>
                <dd>
                  {externalUrl ? (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin_blog_view__link"
                    >
                      {externalUrl}
                    </a>
                  ) : (
                    <span className="admin_demo_detail__empty">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>

      <AdminCertifiedProfessionalsSection
        certificationId={certification.id}
        certification={certification}
      />
      </div>
    </section>
  );
};

export default AdminCertificationDetail;
