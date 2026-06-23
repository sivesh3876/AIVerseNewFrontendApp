export const HOME_SECTIONS = {
  capabilities: "capabilities",
  industries: "industries",
  successStories: "success-stories",
  partners: "partners",
  enterpriseTransformation: "enterprise-transformation",
};

export const HOME_NAV_LINKS = [
  { label: "Capabilities", sectionId: HOME_SECTIONS.capabilities },
  { label: "Industries", sectionId: HOME_SECTIONS.industries },
  { label: "Success Stories", sectionId: HOME_SECTIONS.successStories },
  { label: "Partners", sectionId: HOME_SECTIONS.partners },
  { label: "Learn & Explore", sectionId: HOME_SECTIONS.enterpriseTransformation },
];

export const HOME_SECTION_SCROLL_OFFSET = 64;

export const scrollToHomeSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const target = section.querySelector("header, h2") ?? section;
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    HOME_SECTION_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
};
