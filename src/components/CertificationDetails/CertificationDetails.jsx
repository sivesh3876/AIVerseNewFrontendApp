import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getCertificationCategoryOptions } from "../../utils/adminCertificationStorage";
import {
  getAllPublicCertifiedHolders,
  getPublicCertificationDetailsPage,
  PUBLIC_CERTIFICATION_EVENTS,
  refreshPublicCertificationData,
} from "../../utils/publicCertificationContent";
import {
  BeakerIcon,
  CloudIcon,
  GridIcon,
  LayersIcon,
  ShieldIcon,
  SparklesIcon,
} from "../LearnExplore/TrackNavIcons";
import "./CertificationDetails.scss";

const ALL_CATEGORY = "all";

const CATEGORY_ICONS = {
  "CLOUD AI": CloudIcon,
  "DATA SCIENCE": BeakerIcon,
  "MACHINE LEARNING": LayersIcon,
  "GENERATIVE AI": SparklesIcon,
  "AI GOVERNANCE": ShieldIcon,
};

const getCategoryIcon = (category) => {
  if (category === ALL_CATEGORY) return GridIcon;
  const key = String(category || "").toUpperCase();
  return CATEGORY_ICONS[key] || LayersIcon;
};

const formatTotal = (value) => Number(value || 0).toLocaleString("en-IN");

const MetaItem = ({ label, value }) => (
  <div className="certification_details__meta-item">
    <dt>{label}</dt>
    <dd>{value || "—"}</dd>
  </div>
);

const CategoryNavItem = ({ label, categoryKey, isActive, onClick }) => {
  const Icon = getCategoryIcon(categoryKey);

  return (
    <li>
      <button
        type="button"
        className={`certification_details__nav-item${isActive ? " is-active" : ""}`}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="certification_details__nav-icon" aria-hidden="true">
          <Icon />
        </span>
        <span className="certification_details__nav-label">{label}</span>
        {isActive && (
          <span className="certification_details__nav-arrow" aria-hidden="true">
            &rsaquo;
          </span>
        )}
      </button>
    </li>
  );
};

const ProfessionalCard = ({ holder }) => {
  const hasCertificate = Boolean(holder.certificateUrl);
  const summaryLine = [
    holder.designation,
    [
      holder.certificationName,
      holder.provider,
      holder.category,
      holder.level,
    ]
      .filter(Boolean)
      .join(" · "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="certification_details__card">
      <span
        className="certification_details__badge"
        style={{ background: holder.badgeColor }}
      >
        {holder.level || holder.badge || "Certified"}
      </span>

      <h2>{holder.name || "Unnamed professional"}</h2>

      <p>{summaryLine || "Certified professional"}</p>

      <ul className="certification_details__card-facts">
        <li>
          <span>Certification Name</span>
          <strong>{holder.certificationName || "—"}</strong>
        </li>
        <li>
          <span>Provider</span>
          <strong>{holder.provider || "—"}</strong>
        </li>
        <li>
          <span>Category</span>
          <strong>{holder.category || "—"}</strong>
        </li>
        <li>
          <span>Level</span>
          <strong>{holder.level || "—"}</strong>
        </li>
        <li>
          <span>Employee Name</span>
          <strong>{holder.name || "—"}</strong>
        </li>
        <li>
          <span>Designation</span>
          <strong>{holder.designation || "—"}</strong>
        </li>
      </ul>

      {holder.completionDate && (
        <time dateTime={holder.completionDate}>{holder.completionDate}</time>
      )}

      {hasCertificate ? (
        <a
          href={holder.certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="certification_details__card-link"
        >
          View Certificate &gt;
        </a>
      ) : (
        <span className="certification_details__card-link">View Details &gt;</span>
      )}
    </article>
  );
};

const CertificationDetails = ({ certificationId = null }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || ALL_CATEGORY;

  const [holders, setHolders] = useState(() =>
    certificationId
      ? getPublicCertificationDetailsPage(certificationId)?.holders || []
      : getAllPublicCertifiedHolders(),
  );
  const [categories, setCategories] = useState(() =>
    getCertificationCategoryOptions(),
  );
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [notFound, setNotFound] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const refresh = () => {
      setCategories(getCertificationCategoryOptions());

      if (!certificationId) {
        setNotFound(false);
        setHolders(getAllPublicCertifiedHolders());
        return;
      }

      const pageData = getPublicCertificationDetailsPage(certificationId);
      if (!pageData) {
        setNotFound(true);
        setHolders([]);
        return;
      }

      setNotFound(false);
      setHolders(pageData.holders);
    };

    const loadFromApi = async () => {
      try {
        await refreshPublicCertificationData();
      } catch (error) {
        console.warn("Certification API unavailable for public page.", error);
      }
      refresh();
    };

    loadFromApi();

    PUBLIC_CERTIFICATION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, refresh);
    });
    window.addEventListener("storage", refresh);

    return () => {
      PUBLIC_CERTIFICATION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, refresh);
      });
      window.removeEventListener("storage", refresh);
    };
  }, [certificationId]);

  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [certificationId, activeCategory]);

  const filteredHolders = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return holders;
    return holders.filter(
      (holder) =>
        String(holder.category || "").toUpperCase() ===
        String(activeCategory).toUpperCase(),
    );
  }, [holders, activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    const basePath = certificationId
      ? `/learn-explore/certifications/${certificationId}`
      : "/learn-explore/certifications";

    if (category === ALL_CATEGORY) {
      navigate(basePath, { replace: true });
      return;
    }

    navigate(`${basePath}?category=${encodeURIComponent(category)}`, {
      replace: true,
    });
  };

  if (notFound) {
    return (
      <div className="certification_details">
        <section className="certification_details__hero" ref={heroRef}>
          <div className="certification_details__container">
            <h1>Learn &amp; Explore</h1>
            <p className="certification_details__lead">
              This certification is not available or has not been published yet.
              Publish it from Admin → Certifications to make it visible here.
            </p>
            <Link to="/#learn-explore" className="certification_details__back">
              ← Back to Learn &amp; Explore
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const totalCertified = formatTotal(filteredHolders.length);
  const sectionTitle =
    activeCategory === ALL_CATEGORY
      ? "Certified Professionals"
      : activeCategory;

  return (
    <div className="certification_details">
      <section className="certification_details__hero" ref={heroRef}>
        <div className="certification_details__banner-overlay" />

        <div className="certification_details__container certification_details__hero-content">
          <Link to="/#learn-explore" className="certification_details__back">
            ← Back to Home
          </Link>

          <div className="certification_details__intro">
            <div className="certification_details__intro-copy">
              <h1>Learn &amp; Explore</h1>
              <p className="certification_details__lead">
                Explore published certifications by category and meet the
                professionals who have earned them.
              </p>
            </div>
          </div>

          <dl className="certification_details__meta certification_details__meta--single">
            <MetaItem
              label="Total Certified Professionals"
              value={totalCertified}
            />
          </dl>
        </div>
      </section>

      <section className="certification_details__body">
        <div className="certification_details__layout">
          <aside className="certification_details__sidebar">
            <nav
              className="certification_details__nav"
              aria-label="Certification categories"
            >
              <h2>ALL CATEGORIES</h2>
              <ul>
                <CategoryNavItem
                  label="All Categories"
                  categoryKey={ALL_CATEGORY}
                  isActive={activeCategory === ALL_CATEGORY}
                  onClick={() => handleCategoryChange(ALL_CATEGORY)}
                />
                {categories.map((category) => {
                  const isActive =
                    String(activeCategory).toUpperCase() ===
                    String(category).toUpperCase();

                  return (
                    <CategoryNavItem
                      key={category}
                      label={category}
                      categoryKey={category}
                      isActive={isActive}
                      onClick={() => handleCategoryChange(category)}
                    />
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div className="certification_details__main">
            <header className="certification_details__section-header">
              <h2>{sectionTitle}</h2>
              <p>
                {filteredHolders.length} professional
                {filteredHolders.length === 1 ? "" : "s"}
              </p>
            </header>

            {filteredHolders.length === 0 ? (
              <div className="certification_details__empty">
                <div
                  className="certification_details__empty-icon"
                  aria-hidden="true"
                >
                  <span>?</span>
                </div>
                <p>
                  {activeCategory === ALL_CATEGORY
                    ? "No certified professionals available."
                    : `No certified professionals available in ${activeCategory}.`}
                </p>
              </div>
            ) : (
              <div className="certification_details__grid">
                {filteredHolders.map((holder) => (
                  <ProfessionalCard
                    key={`${holder.certificationId}-${holder.id}`}
                    holder={holder}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificationDetails;
