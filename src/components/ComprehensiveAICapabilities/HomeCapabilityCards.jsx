import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentIcon } from "../CustomerCommunicationManagement/CapabilityIcons";
import SolutionEngagement from "../SolutionEngagement/SolutionEngagement";
import SolutionEngagementBar from "../SolutionEngagement/SolutionEngagementBar";
import { fetchUseCaseById } from "../../services/usecasesService";
import { incrementSolutionView } from "../../utils/solutionEngagementStorage";
import {
  HOME_SOLUTION_ICONS,
  OnboardingAcceleratorIcon,
} from "./HomeSolutionCardIcons";
import {
  extractSolutionIdFromCapabilityId,
  resolveLiveDemoLink,
} from "../../utils/solutionMapper";
import { getSalesPitchOpenUrl } from "../../utils/solutionDocuments";

const EyeSmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M1.5 12C3.5 7.5 7.5 5 12 5s8.5 2.5 10.5 7c-2 4.5-6 7-10.5 7S3.5 16.5 1.5 12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const PlaySmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ONBOARDING_ACCELERATOR = {
  id: "onboarding-accelerator",
  title: "Customer Onboarding Accelerator",
  description:
    "Accelerate customer onboarding with an AI-powered guided experience — intelligent workflows, document capture, and real-time progress tracking in one interactive demo.",
  domainLabel: "Customer Onboarding",
  techHighlight: "AI-Guided Onboarding",
  url: "https://customer-onboarding-front-hqhpgmfvg5aeacfs.canadacentral-01.azurewebsites.net/",
};

const WMS_ONBOARDING_SOLUTION_ID = 48;
const WMS_ONBOARDING_SOLUTION_PATH =
  "/explore-solutions?service=enterprise-application&solution=api-48";

const resolveWmsRecordedDemoLink = (solution = {}) =>
  String(solution.DemoRecordedVideoLink || "").trim();

const LiveDemoButton = ({ href, compact = false }) => {
  const label = compact ? (
    "Live Demo"
  ) : (
    <>
      <PlaySmallIcon />
      <span className="ai_capabilities__btn-text">
        Live Demo
        <ArrowIcon />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="ai_capabilities__btn ai_capabilities__btn--live"
        onClick={(event) => event.stopPropagation()}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="ai_capabilities__btn ai_capabilities__btn--live"
      disabled
      title="Add a Live Demo Link in Admin to enable this button"
    >
      {label}
    </button>
  );
};

export const OnboardingAcceleratorCard = ({
  compact = false,
  index = 1,
  showLiveDemo = true,
  showEngagement = false,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const descriptionRef = useRef(null);
  const [activePanel, setActivePanel] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const [recordedDemoLink, setRecordedDemoLink] = useState("");
  const [liveDemoLink, setLiveDemoLink] = useState("");
  const [salesDeskDoc, setSalesDeskDoc] = useState("");
  const [salesPitchLoading, setSalesPitchLoading] = useState(false);
  const [descriptionText, setDescriptionText] = useState(
    ONBOARDING_ACCELERATOR.description,
  );
  const orderLabel = `#${String(index).padStart(2, "0")}`;
  const hasRecordedDemo = Boolean(recordedDemoLink);
  const hasAbsoluteSalesPitch = /^https?:\/\//i.test(salesDeskDoc);

  const handleOnboardingSalesPitchClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (salesPitchLoading) return;

    const popup = window.open("about:blank", "_blank", "noopener=false");
    setSalesPitchLoading(true);
    try {
      const solution = await fetchUseCaseById(WMS_ONBOARDING_SOLUTION_ID);
      const url = getSalesPitchOpenUrl(solution);
      if (url) {
        if (popup && !popup.closed) {
          popup.location.href = url;
          try {
            popup.opener = null;
          } catch {
            // Ignore cross-origin opener clears.
          }
        } else {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      } else if (popup && !popup.closed) {
        popup.close();
      }
    } catch {
      if (popup && !popup.closed) {
        popup.close();
      }
    } finally {
      setSalesPitchLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadWmsMedia = async () => {
      try {
        const solution = await fetchUseCaseById(WMS_ONBOARDING_SOLUTION_ID);
        if (!isMounted || !solution) return;
        setRecordedDemoLink(resolveWmsRecordedDemoLink(solution));
        setLiveDemoLink(resolveLiveDemoLink(solution));
        setSalesDeskDoc(getSalesPitchOpenUrl(solution));
        const aboutText = String(solution.SolutionContext || "").trim();
        if (aboutText) {
          setDescriptionText(aboutText);
        }
      } catch {
        if (isMounted) {
          setRecordedDemoLink("");
          setLiveDemoLink("");
          setSalesDeskDoc("");
        }
      }
    };

    loadWmsMedia();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewSolution = (event) => {
    event?.stopPropagation();
    navigate(WMS_ONBOARDING_SOLUTION_PATH);
  };

  const measureDescriptionClamp = useCallback(() => {
    const element = descriptionRef.current;
    if (!element) return;
    setIsDescriptionClamped((previous) => {
      const clamped = element.scrollHeight > element.clientHeight + 1;
      return previous === clamped ? previous : clamped;
    });
  }, []);

  const assignDescriptionRef = useCallback(
    (node) => {
      descriptionRef.current = node;
      if (node) requestAnimationFrame(measureDescriptionClamp);
    },
    [measureDescriptionClamp],
  );

  useLayoutEffect(() => {
    if (compact || activePanel === "description") return undefined;
    measureDescriptionClamp();
    const element = descriptionRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(measureDescriptionClamp);
    observer.observe(element);
    window.addEventListener("resize", measureDescriptionClamp);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureDescriptionClamp);
    };
  }, [activePanel, compact, measureDescriptionClamp, descriptionText]);

  const showReadMore = descriptionText.length > 110 || isDescriptionClamped;

  const salesPitchLabel = compact ? (
    "Sales Pitch"
  ) : (
    <>
      <DocumentIcon />
      <span className="ai_capabilities__btn-text">
        Sales Pitch
        <ArrowIcon />
      </span>
    </>
  );

  const onboardingCtaButtons = (
    <>
      <button
        type="button"
        className="ai_capabilities__btn ai_capabilities__btn--primary"
        onClick={handleViewSolution}
      >
        {compact ? (
          "View Solution"
        ) : (
          <>
            <EyeSmallIcon />
            <span className="ai_capabilities__btn-text">
              View Solution
              <ArrowIcon />
            </span>
          </>
        )}
      </button>

      {hasRecordedDemo ? (
        <a
          href={recordedDemoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ai_capabilities__btn ai_capabilities__btn--demo"
          onClick={(event) => event.stopPropagation()}
        >
          {compact ? (
            "Watch Demo"
          ) : (
            <>
              <PlaySmallIcon />
              <span className="ai_capabilities__btn-text">
                Watch Demo
                <ArrowIcon />
              </span>
            </>
          )}
        </a>
      ) : null}

      {hasAbsoluteSalesPitch ? (
        <a
          href={salesDeskDoc}
          target="_blank"
          rel="noopener noreferrer"
          className="ai_capabilities__btn ai_capabilities__btn--demo"
          onClick={(event) => event.stopPropagation()}
        >
          {salesPitchLabel}
        </a>
      ) : (
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--demo"
          disabled={salesPitchLoading}
          title={
            salesPitchLoading
              ? "Loading sales pitch..."
              : "Open sales pitch document"
          }
          onClick={handleOnboardingSalesPitchClick}
        >
          {salesPitchLoading ? "Loading…" : salesPitchLabel}
        </button>
      )}
    </>
  );

  const onboardingActions = showLiveDemo ? (
    <div className="ai_capabilities__actions-stack">
      <div className="ai_capabilities__actions">{onboardingCtaButtons}</div>
      <LiveDemoButton href={liveDemoLink} compact={compact} />
    </div>
  ) : (
    <div className="ai_capabilities__actions">{onboardingCtaButtons}</div>
  );

  if (compact) {
    return (
      <article
        className="ai_capabilities__card"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="ai_capabilities__card-body">
          <div className="ai_capabilities__card-head">
            <div className="ai_capabilities__icon">
              <OnboardingAcceleratorIcon />
            </div>
          </div>

          <h3>{ONBOARDING_ACCELERATOR.title}</h3>
        </div>

        {onboardingActions}
      </article>
    );
  }

  return (
    <article
      ref={cardRef}
      className={`ai_capabilities__card${
        activePanel || commentsOpen ? " is-panel-open" : ""
      }${commentsOpen ? " is-comments-open" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="ai_capabilities__card-body">
        <div className="ai_capabilities__card-head">
          <div className="ai_capabilities__icon">
            <OnboardingAcceleratorIcon />
          </div>
          <div className="ai_capabilities__head-meta">
            <span className="ai_capabilities__order">{orderLabel}</span>
            <span className="ai_capabilities__domain">
              {ONBOARDING_ACCELERATOR.domainLabel}
            </span>
          </div>
        </div>

        <div className="ai_capabilities__title-row">
          <h3>{ONBOARDING_ACCELERATOR.title}</h3>
          {activePanel === "description" ? (
            <button
              type="button"
              className="ai_capabilities__card-overlay-close"
              onClick={(event) => {
                event.stopPropagation();
                setActivePanel(null);
              }}
              aria-label="Close panel"
            >
              &times;
            </button>
          ) : (
            <span className="ai_capabilities__bookmark" aria-hidden="true">
              <BookmarkIcon />
            </span>
          )}
        </div>

        <div
          className={`ai_capabilities__panel-host${
            activePanel ? " is-panel-active" : ""
          }${activePanel === "description" ? " is-description-open" : ""}`}
        >
          <div className="ai_capabilities__panel-main">
            {activePanel === "description" ? (
              <div className="ai_capabilities__description-expanded">
                <h4 className="ai_capabilities__about-heading">
                  About this solution
                </h4>
                <p>{descriptionText}</p>
                <button
                  type="button"
                  className="ai_capabilities__read-less"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActivePanel(null);
                  }}
                >
                  Read less
                </button>
              </div>
            ) : (
              <div className="ai_capabilities__panel-content">
                <div
                  className={`ai_capabilities__desc-wrap${
                    showReadMore ? " is-clamped" : ""
                  }`}
                >
                  <p ref={assignDescriptionRef}>{descriptionText}</p>
                  {showReadMore && (
                    <button
                      type="button"
                      className="ai_capabilities__read-more"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsDescriptionClamped(true);
                        setActivePanel("description");
                      }}
                    >
                      Read more
                    </button>
                  )}
                </div>

                <div className="ai_capabilities__meta">
                  <span className="ai_capabilities__chip">
                    {ONBOARDING_ACCELERATOR.techHighlight}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showEngagement || onboardingActions) ? (
        <div className="ai_capabilities__card-footer">
          {showEngagement ? (
            <div className="ai_capabilities__engagement-wrap">
              <SolutionEngagement
                solutionId="api-48"
                title={ONBOARDING_ACCELERATOR.title}
                detailUrl={WMS_ONBOARDING_SOLUTION_PATH}
                variant="home"
                commentUi="card-overlay"
                overlayRootRef={cardRef}
                commentOpen={commentsOpen}
                onCommentOpenChange={setCommentsOpen}
                onActionClick={(event) => event.stopPropagation()}
              />
            </div>
          ) : null}
          {onboardingActions}
        </div>
      ) : null}
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

const CompactSolutionCard = ({
  solution,
  index,
  cardRef,
  isHighlighted,
}) => {
  const navigate = useNavigate();
  const Icon =
    HOME_SOLUTION_ICONS[
      Math.abs(Number(solution?.themeIndex) || 0) % HOME_SOLUTION_ICONS.length
    ] ?? HOME_SOLUTION_ICONS[0];
  const liveDemoLink = solution.demoLink;

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
        </div>

        <h3>{solution.title}</h3>

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
        <LiveDemoButton href={liveDemoLink} compact />
      </div>
    </article>
  );
};

const FullSolutionCard = ({
  solution,
  index,
  onRequestDemo,
  cardRef,
  isHighlighted,
  showLiveDemo = true,
  showEngagement = false,
}) => {
  const navigate = useNavigate();
  const internalCardRef = useRef(null);
  const descriptionRef = useRef(null);
  const [activePanel, setActivePanel] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const [salesPitchLoading, setSalesPitchLoading] = useState(false);
  const descriptionText = String(solution?.description ?? "").trim();
  const Icon =
    HOME_SOLUTION_ICONS[
      Math.abs(Number(solution?.themeIndex) || 0) % HOME_SOLUTION_ICONS.length
    ] ?? HOME_SOLUTION_ICONS[0];
  const hasRecordedDemo = Boolean(solution.recordedDemoLink);
  const liveDemoLink = solution.demoLink;
  const salesPitchUrl = getSalesPitchOpenUrl({
    salesDeskDoc: solution.salesDeskDoc,
    documents: solution.documents,
  });
  const solutionApiId = extractSolutionIdFromCapabilityId(solution.id);

  const handleSalesPitchClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (salesPitchLoading) return;

    const canFetch = Boolean(solutionApiId);
    const listFallback =
      salesPitchUrl && /^https?:\/\//i.test(salesPitchUrl) ? salesPitchUrl : "";

    if (!canFetch && !listFallback) return;

    // noopener=false keeps a Window reference so we can navigate after await
    // (Chrome defaults _blank to noopener and returns null otherwise).
    const popup = window.open("about:blank", "_blank", "noopener=false");
    setSalesPitchLoading(true);

    try {
      let url = "";
      if (canFetch) {
        try {
          const fullSolution = await fetchUseCaseById(solutionApiId);
          url = getSalesPitchOpenUrl(fullSolution);
        } catch {
          // Fall back to list URL below.
        }
      }
      if (!url) {
        url = listFallback;
      }

      if (url) {
        if (popup && !popup.closed) {
          popup.location.href = url;
          try {
            popup.opener = null;
          } catch {
            // Ignore cross-origin opener clears.
          }
        } else {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      } else if (popup && !popup.closed) {
        popup.close();
      }
    } finally {
      setSalesPitchLoading(false);
    }
  };

  const assignCardRef = useCallback(
    (node) => {
      internalCardRef.current = node;
      if (typeof cardRef === "function") {
        cardRef(node);
      } else if (cardRef) {
        cardRef.current = node;
      }
    },
    [cardRef],
  );

  const measureDescriptionClamp = useCallback(() => {
    const element = descriptionRef.current;
    if (!element) {
      return;
    }

    setIsDescriptionClamped((previous) => {
      const clamped = element.scrollHeight > element.clientHeight + 1;
      return previous === clamped ? previous : clamped;
    });
  }, []);

  const assignDescriptionRef = useCallback(
    (node) => {
      descriptionRef.current = node;
      if (node) {
        requestAnimationFrame(measureDescriptionClamp);
      }
    },
    [measureDescriptionClamp],
  );

  useLayoutEffect(() => {
    if (activePanel === "description") {
      return undefined;
    }

    measureDescriptionClamp();

    const element = descriptionRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(measureDescriptionClamp);
    observer.observe(element);
    window.addEventListener("resize", measureDescriptionClamp);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureDescriptionClamp);
    };
  }, [activePanel, measureDescriptionClamp, descriptionText]);

  const handleNavigate = () => {
    navigate(solution.detailUrl);
  };

  const handleReadMore = (event) => {
    event.stopPropagation();
    setIsDescriptionClamped(true);
    setActivePanel("description");
  };

  const handleReadLess = (event) => {
    event.stopPropagation();
    setActivePanel(null);
  };

  const handleClosePanel = (event) => {
    event?.stopPropagation();
    setActivePanel(null);
  };

  const showReadMore = descriptionText.length > 110 || isDescriptionClamped;

  const solutionCtaButtons = (
    <>
      <button
        type="button"
        className="ai_capabilities__btn ai_capabilities__btn--primary"
        onClick={handleNavigate}
      >
        <EyeSmallIcon />
        <span className="ai_capabilities__btn-text">
          View Solution
          <ArrowIcon />
        </span>
      </button>

      {hasRecordedDemo ? (
        <a
          href={solution.recordedDemoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ai_capabilities__btn ai_capabilities__btn--demo"
        >
          <PlaySmallIcon />
          <span className="ai_capabilities__btn-text">
            Watch Demo
            <ArrowIcon />
          </span>
        </a>
      ) : (
        <button
          type="button"
          className="ai_capabilities__btn ai_capabilities__btn--demo"
          onClick={() => onRequestDemo(solution.capabilityForDemo)}
        >
          <PlaySmallIcon />
          <span className="ai_capabilities__btn-text">
            Watch Demo
            <ArrowIcon />
          </span>
        </button>
      )}

      <button
        type="button"
        className="ai_capabilities__btn ai_capabilities__btn--demo"
        disabled={
          salesPitchLoading || (!solutionApiId && !/^https?:\/\//i.test(salesPitchUrl))
        }
        title={
          salesPitchLoading
            ? "Loading sales pitch..."
            : "Open sales pitch document"
        }
        onClick={handleSalesPitchClick}
      >
        <DocumentIcon />
        <span className="ai_capabilities__btn-text">
          {salesPitchLoading ? "Loading…" : "Sales Pitch"}
          {!salesPitchLoading ? <ArrowIcon /> : null}
        </span>
      </button>
    </>
  );

  const solutionActions = showLiveDemo ? (
    <div className="ai_capabilities__actions-stack">
      <div className="ai_capabilities__actions">{solutionCtaButtons}</div>
      <LiveDemoButton href={liveDemoLink} />
    </div>
  ) : (
    <div className="ai_capabilities__actions">{solutionCtaButtons}</div>
  );

  return (
    <article
      ref={assignCardRef}
      className={`ai_capabilities__card${
        isHighlighted ? " is-foundation-highlight" : ""
      }${activePanel || commentsOpen ? " is-panel-open" : ""}${
        commentsOpen ? " is-comments-open" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="ai_capabilities__card-body">
        <div className="ai_capabilities__card-head">
          <div className="ai_capabilities__icon">
            <Icon />
          </div>

          <div className="ai_capabilities__head-meta">
            <span className="ai_capabilities__order">
              #{String(index).padStart(2, "0")}
            </span>
            <span className="ai_capabilities__domain">
              {solution.domainLabel}
            </span>
          </div>
        </div>

        <div className="ai_capabilities__title-row">
          <h3>{solution.title}</h3>
          {activePanel === "description" ? (
            <button
              type="button"
              className="ai_capabilities__card-overlay-close"
              onClick={handleClosePanel}
              aria-label="Close panel"
            >
              &times;
            </button>
          ) : (
            <span className="ai_capabilities__bookmark" aria-hidden="true">
              <BookmarkIcon />
            </span>
          )}
        </div>

        <div
          className={`ai_capabilities__panel-host${
            activePanel ? " is-panel-active" : ""
          }${activePanel === "description" ? " is-description-open" : ""}`}
        >
          <div className="ai_capabilities__panel-main">
            {activePanel === "description" ? (
              <div className="ai_capabilities__description-expanded">
                <p>{descriptionText}</p>
                <button
                  type="button"
                  className="ai_capabilities__read-less"
                  onClick={handleReadLess}
                >
                  Read less
                </button>
              </div>
            ) : (
              <div className="ai_capabilities__panel-content">
                <div
                  className={`ai_capabilities__desc-wrap${
                    showReadMore ? " is-clamped" : ""
                  }`}
                >
                  <p ref={assignDescriptionRef}>{descriptionText}</p>
                  {showReadMore && (
                    <button
                      type="button"
                      className="ai_capabilities__read-more"
                      onClick={handleReadMore}
                    >
                      Read more
                    </button>
                  )}
                </div>

                <div className="ai_capabilities__meta">
                  {solution.techHighlight && (
                    <span className="ai_capabilities__chip">
                      {solution.techHighlight}
                    </span>
                  )}
                  {solution.client && (
                    <span className="ai_capabilities__client">
                      AI Foundation: {solution.client}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showEngagement || solutionActions) ? (
        <div className="ai_capabilities__card-footer">
          {showEngagement ? (
            <div className="ai_capabilities__engagement-wrap">
              <SolutionEngagement
                solutionId={solution.id}
                title={solution.title}
                detailUrl={solution.detailUrl}
                variant="home"
                commentUi="card-overlay"
                overlayRootRef={internalCardRef}
                commentOpen={commentsOpen}
                onCommentOpenChange={setCommentsOpen}
                onActionClick={(event) => event.stopPropagation()}
              />
            </div>
          ) : null}
          {solutionActions}
        </div>
      ) : null}
    </article>
  );
};

export const SolutionCard = ({
  solution,
  index,
  onRequestDemo,
  cardRef,
  isHighlighted,
  compact = false,
  showLiveDemo = true,
  showEngagement = false,
}) => {
  if (compact) {
    return (
      <CompactSolutionCard
        solution={solution}
        index={index}
        onRequestDemo={onRequestDemo}
        cardRef={cardRef}
        isHighlighted={isHighlighted}
      />
    );
  }

  return (
    <FullSolutionCard
      solution={solution}
      index={index}
      onRequestDemo={onRequestDemo}
      cardRef={cardRef}
      isHighlighted={isHighlighted}
      showLiveDemo={showLiveDemo}
      showEngagement={showEngagement}
    />
  );
};
