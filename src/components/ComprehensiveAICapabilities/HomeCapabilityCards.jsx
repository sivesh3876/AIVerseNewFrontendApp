import { useNavigate } from "react-router-dom";
import { useRegistrationReminder } from "../../context/RegistrationReminderContext";
import SolutionEngagementBar from "../SolutionEngagement/SolutionEngagementBar";
import { incrementSolutionView } from "../../utils/solutionEngagementStorage";
import {
  HOME_SOLUTION_ICONS,
  OnboardingAcceleratorIcon,
} from "./HomeSolutionCardIcons";

export const ONBOARDING_ACCELERATOR = {
  id: "onboarding-accelerator",
  title: "Customer Onboarding Accelerator",
  description:
    "Accelerate customer onboarding with an AI-powered guided experience — intelligent workflows, document capture, and real-time progress tracking in one interactive demo.",
  domainLabel: "Customer Onboarding",
  techHighlight: "AI-Guided Onboarding",
  url: "https://customer-onboarding-front-hqhpgmfvg5aeacfs.canadacentral-01.azurewebsites.net/",
};

export const OnboardingAcceleratorCard = ({ onOpenWms, compact = false }) => {
  const { openRegisterModal } = useRegistrationReminder();

  const handleOpenPortal = (event) => {
    event.stopPropagation();
    openRegisterModal("AI Verse Portal Registration");
  };

  const handleOpenWms = (event) => {
    event?.stopPropagation();
    onOpenWms();
  };

  return (
    <article className="ai_capabilities__card" style={{ animationDelay: "0s" }}>
      <div
        className="ai_capabilities__card-body"
        role="button"
        tabIndex={0}
        onClick={() => onOpenWms()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenWms();
          }
        }}
      >
        <div className="ai_capabilities__card-head">
          <div className="ai_capabilities__icon">
            <OnboardingAcceleratorIcon />
          </div>

          {!compact ? (
            <div className="ai_capabilities__head-meta">
              <span className="ai_capabilities__order">#01</span>
              <span className="ai_capabilities__domain">
                {ONBOARDING_ACCELERATOR.domainLabel}
              </span>
            </div>
          ) : null}
        </div>

        <h3>{ONBOARDING_ACCELERATOR.title}</h3>

        {!compact ? (
          <>
            <p>{ONBOARDING_ACCELERATOR.description}</p>

            <div className="ai_capabilities__meta">
              <span className="ai_capabilities__chip">
                {ONBOARDING_ACCELERATOR.techHighlight}
              </span>
            </div>
          </>
        ) : null}

        <SolutionEngagementBar solutionId={ONBOARDING_ACCELERATOR.id} />
      </div>

      <div className="ai_capabilities__actions">
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--primary"
          onClick={handleOpenWms}
        >
          Onboarding Accelerator
        </button>
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--demo"
          onClick={handleOpenPortal}
        >
          Explore AI Verse
        </button>
      </div>
    </article>
  );
};

export const SolutionCardSkeleton = ({ index, compact = false }) => (
  <article
    className="ai_capabilities__card ai_capabilities__card--skeleton"
    style={{ animationDelay: `${index * 0.08}s` }}
    aria-hidden="true"
  >
    <div className="ai_capabilities__skeleton-icon" />
    <div className="ai_capabilities__skeleton-line ai_capabilities__skeleton-line--title" />
    {!compact ? (
      <>
        <div className="ai_capabilities__skeleton-line" />
        <div className="ai_capabilities__skeleton-line ai_capabilities__skeleton-line--short" />
      </>
    ) : null}
    <div className="ai_capabilities__skeleton-actions" />
  </article>
);

export const SolutionCard = ({
  solution,
  index,
  onRequestDemo,
  cardRef,
  isHighlighted,
  compact = false,
}) => {
  const navigate = useNavigate();
  const Icon =
    HOME_SOLUTION_ICONS[solution.themeIndex % HOME_SOLUTION_ICONS.length];
  const hasRecordedDemo = Boolean(solution.recordedDemoLink);

  const handleNavigate = () => {
    if (solution.id) {
      incrementSolutionView(solution.id);
    }
    navigate(solution.detailUrl);
  };

  return (
    <article
      ref={cardRef}
      className={`ai_capabilities__card${
        isHighlighted ? " is-foundation-highlight" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="ai_capabilities__card-body"
        role="button"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleNavigate();
          }
        }}
      >
        <div className="ai_capabilities__card-head">
          <div className="ai_capabilities__icon">
            <Icon />
          </div>

          {!compact ? (
            <div className="ai_capabilities__head-meta">
              {solution.orderNumber != null && (
                <span className="ai_capabilities__order">
                  #{String(solution.orderNumber).padStart(2, "0")}
                </span>
              )}
              <span className="ai_capabilities__domain">
                {solution.domainLabel}
              </span>
            </div>
          ) : null}
        </div>

        <h3>{solution.title}</h3>

        {!compact ? (
          <>
            <p>{solution.description}</p>

            <div className="ai_capabilities__meta">
              {solution.techHighlight && (
                <span className="ai_capabilities__chip">
                  {solution.techHighlight}
                </span>
              )}
              {solution.client && (
                <span className="ai_capabilities__client">
                  Client: {solution.client}
                </span>
              )}
            </div>
          </>
        ) : null}

        <SolutionEngagementBar solutionId={solution.id} />
      </div>

      <div className="ai_capabilities__actions">
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--primary"
          onClick={handleNavigate}
        >
          View Solution
        </button>

        {hasRecordedDemo ? (
          <a
            href={solution.recordedDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
          >
            Live Demo
          </a>
        ) : (
          <button
            type="button"
            className="ai_capabilities__btn ai_capabilities__btn--demo"
            onClick={() => onRequestDemo(solution.capabilityForDemo)}
          >
            Live Demo
          </button>
        )}
      </div>
    </article>
  );
};
