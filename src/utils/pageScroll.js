import { useEffect } from "react";
import { HOME_SECTION_SCROLL_OFFSET } from "./homeSections";

export const scrollToPageSection = (
  element,
  offset = HOME_SECTION_SCROLL_OFFSET,
) => {
  if (!element) return;

  const top =
    element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
};

export const useScrollToSection = (ref, deps = []) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      scrollToPageSection(ref.current);
    }, 100);

    return () => window.clearTimeout(timer);
  }, deps);
};
