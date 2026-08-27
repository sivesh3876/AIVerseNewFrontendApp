import { useEffect } from "react";
import {
  getHomeScrollBehavior,
  getHomeSectionScrollOffset,
} from "./homeSections";

export const scrollToPageSection = (
  element,
  offset = getHomeSectionScrollOffset(),
) => {
  if (!element) return;

  const top =
    element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: getHomeScrollBehavior(),
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
