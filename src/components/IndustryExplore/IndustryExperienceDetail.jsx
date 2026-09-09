import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchUseCaseById,
  getUsecasesApiBaseUrl,
} from "../../services/usecasesService";
import { mapApiSolutionToDetail } from "../../data/solutionsData";
import { isPublicSolutionVisible } from "../../utils/solutionMapper";
import {
  getIndustryExperienceItem,
  getIndustryExperiencePillar,
} from "./industryExperiencesData";
import "./IndustryExperienceDetail.scss";

const API_BASE_URL = getUsecasesApiBaseUrl();

const fetchDirectoryList = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    const result = await response.json();

    if (response.ok && result.status === "success") {
      return result.data || [];
    }
  } catch (error) {
    console.error(`Failed to load ${endpoint}:`, error);
  }

  return [];
};

const IndustryExperienceDetail = ({ industry, solutionId }) => {
  const item = getIndustryExperienceItem(industry.id, solutionId);
  const pillar = getIndustryExperiencePillar(item?.pillarId);
  const apiSolutionId = item?.apiSolutionId;

  const [apiDetail, setApiDetail] = useState(null);
  const [loadingApiDetail, setLoadingApiDetail] = useState(false);

  useEffect(() => {
    if (!apiSolutionId) {
      setApiDetail(null);
      return undefined;
    }

    let isMounted = true;

    const loadApiDetail = async () => {
      setLoadingApiDetail(true);

      try {
        const [solution, solutionOwners, evangelistDirectory, businessDomains] =
          await Promise.all([
            fetchUseCaseById(apiSolutionId),
            fetchDirectoryList("get-solution-owners"),
            fetchDirectoryList("get-ai-evangelists"),
            fetchDirectoryList("get-business-domains"),
          ]);

        if (!isMounted) return;

        const resolved = Array.isArray(solution) ? solution[0] : solution;

        setApiDetail(
          resolved && isPublicSolutionVisible(resolved)
            ? mapApiSolutionToDetail(resolved, {
                solutionOwners,
                evangelistDirectory,
                businessDomains,
              })
            : null,
        );
      } catch (error) {
        console.error("Failed to load industry solution detail:", error);
        if (isMounted) {
          setApiDetail(null);
        }
      } finally {
        if (isMounted) {
          setLoadingApiDetail(false);
        }
      }
    };

    loadApiDetail();

    return () => {
      isMounted = false;
    };
  }, [apiSolutionId]);

  if (!item) {
    return null;
  }

  const title = apiDetail?.title || item.title;
  const summary = apiDetail?.shortDescription || item.description;
  const overview = apiDetail?.detailedDescription || item.detail.overview;
  const techStack = apiDetail?.techStack || [];
  const contacts = [
    ...(apiDetail?.coe || []).map((person) => ({ ...person, group: "COE" })),
    ...(apiDetail?.aiEvangelists || []).map((person) => ({
      ...person,
      group: "AI Evangelist",
    })),
  ].filter((person) => person?.name && person.name !== "Not assigned");

  return (
    <article className="industry_experience_detail">
      <Link
        to={`/industry-solutions?industry=${industry.id}`}
        className="industry_experience_detail__back"
      >
        &larr; Back to {industry.title}
      </Link>

      <header
        className="industry_experience_detail__hero"
        style={{ borderColor: pillar.accentColor }}
      >
        <span
          className="industry_experience_detail__pillar"
          style={{ background: pillar.headerColor }}
        >
          {pillar.label}
        </span>
        <p className="industry_experience_detail__industry">{industry.title}</p>
        <h1>{title}</h1>
        <p className="industry_experience_detail__summary">{summary}</p>
      </header>

      {apiSolutionId && loadingApiDetail && (
        <p className="industry_experience_detail__status">
          Loading solution details...
        </p>
      )}

      <div className="industry_experience_detail__body">
        <section>
          <h2>Overview</h2>
          <p>{overview}</p>
        </section>

        <section>
          <h2>Key Benefits</h2>
          <ul>
            {item.detail.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Expected Outcomes</h2>
          <ul>
            {item.detail.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </div>

      {(techStack.length > 0 || contacts.length > 0) && (
        <div className="industry_experience_detail__meta">
          {techStack.length > 0 && (
            <section>
              <h2>Technology Stack</h2>
              <ul className="industry_experience_detail__tags">
                {techStack.map((tech) => (
                  <li key={tech.name}>{tech.name}</li>
                ))}
              </ul>
            </section>
          )}

          {contacts.length > 0 && (
            <section>
              <h2>Solution Contacts</h2>
              <ul className="industry_experience_detail__people">
                {contacts.map((person) => (
                  <li key={`${person.group}-${person.name}`}>
                    <span className="industry_experience_detail__person-name">
                      {person.name}
                    </span>
                    <span className="industry_experience_detail__person-role">
                      {person.title || person.group}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <div className="industry_experience_detail__actions">
        {apiDetail?.recordedDemoLink && (
          <a
            href={apiDetail.recordedDemoLink}
            target="_blank"
            rel="noreferrer"
            className="industry_experience_detail__btn industry_experience_detail__btn--primary"
          >
            Recorded Demo
          </a>
        )}
        <Link
          to={`/explore-solutions?domain=${encodeURIComponent(industry.domainCode)}`}
          className={`industry_experience_detail__btn${apiDetail?.recordedDemoLink ? "" : " industry_experience_detail__btn--primary"}`}
        >
          Explore {industry.title} Solutions
        </Link>
        <Link to="/contact" className="industry_experience_detail__btn">
          Talk to an Expert
        </Link>
      </div>
    </article>
  );
};

export default IndustryExperienceDetail;
