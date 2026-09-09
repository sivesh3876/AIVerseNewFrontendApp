export const HOME_SECTIONS = {
  capabilities: "capabilities",
  industries: "industries",
  successStories: "success-stories",
  partners: "partners",
  enterpriseTransformation: "enterprise-transformation",
  learnExplore: "learn-explore",
};

export const HOME_NAV_LINKS = [
  { label: "Capabilities", sectionId: HOME_SECTIONS.capabilities },
  { label: "Service Line", sectionId: HOME_SECTIONS.enterpriseTransformation },
  { label: "Industries", sectionId: HOME_SECTIONS.industries },
  { label: "Success Stories", sectionId: HOME_SECTIONS.successStories },
  { label: "Partners", sectionId: HOME_SECTIONS.partners },
  { label: "Learn & Explore", sectionId: HOME_SECTIONS.learnExplore },
];

const DEFAULT_HEADER_HEIGHT = 64;
const EXTRA_GAP = 16;

export const HOME_SECTION_SCROLL_OFFSET = DEFAULT_HEADER_HEIGHT + EXTRA_GAP;

export const getHomeSectionScrollOffset = () => {
  if (typeof window === "undefined") {
    return HOME_SECTION_SCROLL_OFFSET;
  }

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--app-header-height")
    .trim();
  const parsed = Number.parseInt(raw, 10);
  const headerHeight = Number.isFinite(parsed) ? parsed : DEFAULT_HEADER_HEIGHT;

  return headerHeight + EXTRA_GAP;
};

export const getHomeScrollBehavior = () => {
  if (typeof window === "undefined") {
    return "smooth";
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
};

export const updateHomeHash = (sectionId) => {
  if (!sectionId || typeof window === "undefined") return;

  const nextHash = `#${sectionId}`;
  if (window.location.hash === nextHash) return;

  const url = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(window.history.state, "", url);
};

export const scrollToHomeSection = (sectionId) => {
  if (!sectionId || typeof document === "undefined") return false;

  const section = document.getElementById(sectionId);
  if (!section) return false;

  const top =
    section.getBoundingClientRect().top +
    window.scrollY -
    getHomeSectionScrollOffset();

  // Use instant jump (auto) for top-menu nav so intermediate sections
  // do not flash past before landing on the target.
  window.scrollTo({
    top: Math.max(0, top),
    behavior: "auto",
  });

  return true;
};

export const scrollToHomeSectionWhenReady = (
  sectionId,
  { timeout = 2000, onScrolled } = {},
) => {
  if (!sectionId || typeof window === "undefined") {
    return () => {};
  }

  let cancelled = false;
  let frameId = 0;
  let didScroll = false;
  const start = performance.now();

  const attempt = () => {
    if (cancelled || didScroll) return;

    if (scrollToHomeSection(sectionId)) {
      didScroll = true;
      onScrolled?.(sectionId);
      return;
    }

    if (performance.now() - start >= timeout) return;
    frameId = window.requestAnimationFrame(attempt);
  };

  frameId = window.requestAnimationFrame(attempt);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(frameId);
  };
};
