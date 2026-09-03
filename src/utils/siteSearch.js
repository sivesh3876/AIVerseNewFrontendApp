import { enterpriseServicesData } from "../components/CustomerCommunicationManagement/enterpriseServicesData";

const normalize = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STATIC_ENTRIES = [
  {
    title: "Add New AI Solution",
    description: "Submit a new AI solution to the platform",
    keywords: ["get started", "add solution", "new solution", "submit", "form"],
    path: "/get-started",
    type: "page",
  },
  {
    title: "All Solutions",
    description: "Browse all submitted AI solutions",
    keywords: ["solutions", "marketplace", "use cases", "browse"],
    path: "/explore-solutions",
    type: "page",
  },
  {
    title: "Meet Our AI Experts",
    description: "Connect with AI evangelists and experts",
    keywords: ["experts", "evangelist", "team", "people"],
    path: "/#meet-our-ai-experts",
    type: "page",
  },
  {
    title: "Success Stories",
    description: "Real-world enterprise AI transformation stories",
    keywords: ["success stories", "case study", "customer story", "client story"],
    path: "/success-stories",
    type: "page",
  },
  {
    title: "Total Experience Framework",
    description: "Espire unified CX, EX, and BX experience model",
    keywords: [
      "total experience",
      "experience framework",
      "cx ex bx tx",
      "customer experience framework",
    ],
    path: "/#total-experience-framework",
    type: "page",
  },
  {
    title: "Customer Experience - Espire AI Support",
    description: "AI support across the customer lifecycle",
    keywords: [
      "customer experience",
      "cx",
      "customer lifecycle",
      "espire ai support",
      "journey map",
    ],
    path: "/customer-experience",
    type: "page",
  },
  {
    title: "Employee Experience - Espire AI Support",
    description: "AI support across the employee lifecycle",
    keywords: [
      "employee experience",
      "ex",
      "employee lifecycle",
      "workforce ai",
      "co-pilot",
    ],
    path: "/employee-experience",
    type: "page",
  },
  {
    title: "Business Experience - Espire AI Support",
    description: "AI support across the business lifecycle",
    keywords: [
      "business experience",
      "bx",
      "erp ai",
      "business intelligence",
      "automation",
    ],
    path: "/business-experience",
    type: "page",
  },
  {
    title: "Total Experience - Espire AI Unified",
    description: "Unified CX, EX, and BX experience framework",
    keywords: [
      "total experience",
      "tx",
      "unified experience",
      "cx ex bx",
    ],
    path: "/total-experience",
    type: "page",
  },
];

const INDUSTRY_ENTRIES = [
  {
    title: "Education",
    keywords: ["education", "student", "learning", "school", "university"],
    path: "/industry-solutions?industry=education",
    type: "industry",
  },
  {
    title: "Insurance",
    keywords: ["insurance", "claims", "underwriting", "policy", "mga"],
    path: "/industry-solutions?industry=insurance",
    type: "industry",
  },
  {
    title: "Logistics",
    keywords: ["logistics", "supply chain", "warehouse", "fulfillment", "shipping"],
    path: "/industry-solutions?industry=logistics",
    type: "industry",
  },
];

const CAPABILITY_KEYWORDS = [
  {
    title: "Conversational AI",
    keywords: ["conversational ai", "chatbot", "nlp", "language"],
    path: "/explore-solutions?service=enterprise-application",
    type: "capability",
  },
  {
    title: "Agentic AI",
    keywords: ["agentic", "autonomous agent", "agent automation"],
    path: "/explore-solutions?service=agentic-automation",
    type: "capability",
  },
  {
    title: "Document Intelligence",
    keywords: ["document", "document ai", "extraction", "summarization"],
    path: "/explore-solutions?service=agentic-automation",
    type: "capability",
  },
  {
    title: "Automation",
    keywords: ["automation", "automate", "workflow"],
    path: "/explore-solutions?service=agentic-automation",
    type: "capability",
  },
];

const buildSiteSearchIndex = () => {
  const items = [...STATIC_ENTRIES, ...INDUSTRY_ENTRIES, ...CAPABILITY_KEYWORDS];

  enterpriseServicesData.forEach((service) => {
    items.push({
      title: service.label,
      description: service.subtitle,
      subtitle: "Enterprise Service",
      keywords: [service.label, service.id.replace(/-/g, " "), ...service.features],
      path: `/explore-solutions?service=${service.id}`,
      type: "service",
    });
  });

  return items;
};

const SITE_SEARCH_INDEX = buildSiteSearchIndex();

const scoreItem = (item, query) => {
  const tokens = query.split(" ").filter((token) => token.length > 1);
  const title = normalize(item.title);
  const description = normalize(item.description || "");
  const subtitle = normalize(item.subtitle || "");
  const keywordText = normalize((item.keywords || []).join(" "));
  const combined = `${title} ${description} ${subtitle} ${keywordText}`;

  let score = 0;

  if (title === query) score += 120;
  if (title.startsWith(query)) score += 80;
  if (title.includes(query)) score += 60;
  if (combined.includes(query)) score += 35;

  tokens.forEach((token) => {
    if (title.includes(token)) score += 25;
    if (keywordText.includes(token)) score += 15;
    if (combined.includes(token)) score += 8;
  });

  return score;
};

export const searchSite = (query, limit = 8) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return SITE_SEARCH_INDEX.map((item) => ({
    ...item,
    score: scoreItem(item, normalizedQuery),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getBestSearchMatch = (query) => searchSite(query, 1)[0] || null;

export const buildSearchNavigationTarget = (query) => {
  const match = getBestSearchMatch(query);
  if (match) {
    return match.path;
  }

  const trimmed = query.trim();
  return trimmed
    ? "/explore-solutions"
    : "/explore-solutions?service=customer-communication-management";
};

export const navigateToSiteSearch = (navigate, query) => {
  const trimmed = query.trim();
  if (!trimmed) return;

  navigateToSearchPath(navigate, buildSearchNavigationTarget(trimmed));
};

export const navigateToSearchPath = (navigate, path) => {
  if (!path) return;

  if (path.startsWith("/#")) {
    const hash = path.split("#")[1];
    navigate(path.split("#")[0] || "/");
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
    return;
  }

  navigate(path);
};
