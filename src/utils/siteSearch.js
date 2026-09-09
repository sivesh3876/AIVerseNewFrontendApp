import { enterpriseServicesData } from "../components/CustomerCommunicationManagement/enterpriseServicesData";
import { clientsData, getClientSection } from "../components/ClientExplore/clientsData";
import { successStories } from "../components/SuccessStories/successStoriesData";
import {
  homePageClients,
  homePagePartners,
} from "../data/homeLogoBarData";
import { HOME_NAV_LINKS } from "./homeSections";
import { fetchAllUseCases } from "../services/usecasesService";
import {
  buildExploreSolutionPath,
  resolveSolutionAiFoundation,
  resolveSolutionClient,
} from "./solutionMapper";

const normalize = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const wordsOf = (text) => normalize(text).split(" ").filter(Boolean);

const TYPE_LABELS = {
  page: "Page",
  section: "Home Section",
  industry: "Industry",
  capability: "Capability",
  service: "Service",
  solution: "Solution",
  partner: "Partner",
  client: "Client",
  story: "Success Story",
};

const withTypeSubtitle = (entry) => ({
  ...entry,
  subtitle: entry.subtitle || TYPE_LABELS[entry.type] || entry.type,
});

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
    title: "Learn & Explore",
    description: "Certifications, learning paths, and AI skills",
    keywords: ["learn", "explore", "certification", "training", "courses"],
    path: "/learn-explore",
    type: "page",
  },
  {
    title: "About Us",
    description: "About AI Verse and Espire",
    keywords: ["about", "about us", "espire", "company"],
    path: "/about-us",
    type: "page",
  },
  {
    title: "Contact",
    description: "Get in touch with the AI Verse team",
    keywords: ["contact", "support", "reach out", "email"],
    path: "/contact",
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
    keywords: ["total experience", "tx", "unified experience", "cx ex bx"],
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

const extractTechKeywords = (solution = {}) => {
  const source =
    solution.TechHighlights ??
    solution.TechnologyHighlights ??
    solution.TechStack ??
    solution.Technologies ??
    solution.techHighlights ??
    "";

  if (Array.isArray(source)) {
    return source
      .map((item) => {
        if (typeof item === "string") return item.trim();
        return String(item?.name || item?.Name || item?.title || "").trim();
      })
      .filter(Boolean);
  }

  const value = String(source || "").trim();
  if (!value) return [];

  if (value.startsWith("[") || value.startsWith("{")) {
    try {
      return extractTechKeywords({ TechHighlights: JSON.parse(value) });
    } catch {
      // Fall through.
    }
  }

  return value
    .split(/[,;|\n]+/)
    .map((item) => item.replace(/^(?:[-•*]\s+|\d+[.)]\s+)/, "").trim())
    .filter(Boolean);
};

const extractContextKeywords = (text = "", limit = 24) => {
  const seen = new Set();
  const words = [];

  normalize(text)
    .split(" ")
    .filter(Boolean)
    .forEach((word) => {
      if (word.length < 3 || seen.has(word)) return;
      seen.add(word);
      words.push(word);
    });

  return words.slice(0, limit);
};

export const mapSolutionToSearchEntry = (solution) => {
  if (solution == null || solution.ID == null || solution.ID === "") return null;

  const client = resolveSolutionClient(solution);
  const techKeywords = extractTechKeywords(solution);
  const aiFoundation = resolveSolutionAiFoundation(solution);
  const context = String(solution.SolutionContext || "");
  const title = solution.Title || "Untitled Solution";
  const ownership = String(solution.OwnershipDetails || "");
  const evangelists = String(solution.AiEvangelists || "");

  return withTypeSubtitle({
    title,
    description: context.slice(0, 140),
    keywords: [
      title,
      solution.BusinessDomain,
      solution.Industry,
      client,
      ownership,
      evangelists,
      ...techKeywords,
      ...aiFoundation,
      ...extractContextKeywords(context),
    ].filter(Boolean),
    path: buildExploreSolutionPath({
      businessDomain: solution.BusinessDomain,
      solutionId: solution.ID,
    }),
    type: "solution",
  });
};

let solutionSearchEntriesCache = null;
let solutionSearchEntriesPromise = null;

export const loadSolutionSearchEntries = async () => {
  if (solutionSearchEntriesCache) {
    return solutionSearchEntriesCache;
  }

  if (!solutionSearchEntriesPromise) {
    solutionSearchEntriesPromise = fetchAllUseCases()
      .then((solutions) => {
        solutionSearchEntriesCache = (solutions || [])
          .map(mapSolutionToSearchEntry)
          .filter(Boolean);
        return solutionSearchEntriesCache;
      })
      .catch((error) => {
        solutionSearchEntriesPromise = null;
        throw error;
      });
  }

  return solutionSearchEntriesPromise;
};

const buildSiteSearchIndex = () => {
  const items = [...STATIC_ENTRIES, ...INDUSTRY_ENTRIES, ...CAPABILITY_KEYWORDS];

  HOME_NAV_LINKS.forEach((link) => {
    items.push({
      title: link.label,
      description: `Jump to the ${link.label} section on the home page`,
      keywords: [link.label, link.sectionId.replace(/-/g, " ")],
      path: `/#${link.sectionId}`,
      type: "section",
    });
  });

  enterpriseServicesData.forEach((service) => {
    items.push({
      title: service.label,
      description: service.subtitle,
      keywords: [
        service.label,
        service.id.replace(/-/g, " "),
        ...(service.features || []),
      ],
      path: `/explore-solutions?service=${service.id}`,
      type: "service",
    });

    (service.capabilities || []).forEach((capability) => {
      if (!capability?.title) return;
      items.push({
        title: capability.title,
        description: capability.description,
        keywords: [
          capability.title,
          service.label,
          ...((capability.techStack || []).map((tech) => tech.name).filter(Boolean)),
        ],
        path: `/explore-solutions?service=${service.id}`,
        type: "capability",
      });
    });
  });

  const clientIds = new Set(clientsData.map((client) => client.id));

  homePagePartners.forEach((partner) => {
    const hasClientPage = clientIds.has(partner.id);
    items.push({
      title: partner.name,
      keywords: [partner.name, partner.id?.replace(/-/g, " "), "partner"],
      path: hasClientPage ? `/clients?client=${partner.id}` : "/#partners",
      type: "partner",
    });
  });

  homePageClients.forEach((client) => {
    items.push({
      title: client.name,
      keywords: [client.name, client.id?.replace(/-/g, " "), "client"],
      path: `/clients?client=${client.id}`,
      type: "client",
    });
  });

  clientsData.forEach((client) => {
    const section = getClientSection(client.id);
    items.push({
      title: client.name,
      description: client.tagline || client.subtitle,
      keywords: [
        client.name,
        client.id?.replace(/-/g, " "),
        client.tagline,
        client.subtitle,
        section,
      ].filter(Boolean),
      path: `/clients?client=${client.id}`,
      type: section === "partners" ? "partner" : "client",
    });
  });

  successStories.forEach((story) => {
    items.push({
      title: story.title,
      description: story.description,
      keywords: [
        story.title,
        story.client,
        story.industry,
        story.industryTag,
        story.subtitle,
      ].filter(Boolean),
      path: `/success-stories?story=${story.id}`,
      type: "story",
    });
  });

  const seen = new Set();
  return items
    .filter((item) => {
      const key = `${item.type}|${normalize(item.title)}|${item.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(withTypeSubtitle);
};

const SITE_SEARCH_INDEX = buildSiteSearchIndex();

const scoreItem = (item, query) => {
  const tokens = query.split(" ").filter((token) => token.length > 0);
  const title = normalize(item.title);
  const description = normalize(item.description || "");
  const subtitle = normalize(item.subtitle || "");
  const keywords = (item.keywords || []).map((keyword) => normalize(keyword)).filter(Boolean);
  const keywordText = keywords.join(" ");
  const combined = `${title} ${description} ${subtitle} ${keywordText}`;
  const titleWords = wordsOf(item.title);
  const keywordWords = keywords.flatMap((keyword) => wordsOf(keyword));

  let score = 0;

  if (title === query) score += 120;
  if (title.startsWith(query)) score += 80;
  if (title.includes(query)) score += 60;
  if (combined.includes(query)) score += 35;

  tokens.forEach((token) => {
    if (token.length < 1) return;

    if (title.includes(token)) score += 25;
    if (keywordText.includes(token)) score += 15;
    if (combined.includes(token)) score += 8;

    titleWords.forEach((word) => {
      if (word.startsWith(token)) score += 22;
      else if (word.includes(token) && token.length > 1) score += 10;
    });

    keywordWords.forEach((word) => {
      if (word.startsWith(token)) score += 16;
      else if (word.includes(token) && token.length > 1) score += 6;
    });

    keywords.forEach((keyword) => {
      if (keyword.startsWith(token)) score += 18;
    });
  });

  const meaningfulTokens = tokens.filter((token) => token.length > 1);
  const matchedTitleTokens = meaningfulTokens.filter((token) =>
    titleWords.some((word) => word.startsWith(token) || word.includes(token)),
  );
  const titleCoverage = meaningfulTokens.length
    ? matchedTitleTokens.length / meaningfulTokens.length
    : 0;

  if (titleCoverage >= 0.75) score += 100;
  if (item.type === "solution" && titleCoverage >= 0.5) score += 40;
  if (item.type === "solution" && title === query) score += 50;

  return score;
};

export const searchSite = (query, limit = 10, extraEntries = []) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const catalog = [
    ...SITE_SEARCH_INDEX,
    ...extraEntries.filter(Boolean).map(withTypeSubtitle),
  ];

  return catalog
    .map((item) => ({
      ...item,
      score: scoreItem(item, normalizedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
};

export const getBestSearchMatch = (query, extraEntries = []) =>
  searchSite(query, 1, extraEntries)[0] || null;

export const buildSearchNavigationTarget = (query, extraEntries = []) => {
  const match = getBestSearchMatch(query, extraEntries);
  if (match) {
    return match.path;
  }

  const trimmed = query.trim();
  return trimmed
    ? "/explore-solutions"
    : "/explore-solutions?service=customer-communication-management";
};

export const navigateToSiteSearch = (navigate, query, extraEntries = []) => {
  const trimmed = query.trim();
  if (!trimmed) return;

  navigateToSearchPath(navigate, buildSearchNavigationTarget(trimmed, extraEntries));
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
