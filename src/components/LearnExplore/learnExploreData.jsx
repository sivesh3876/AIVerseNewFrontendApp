import {
  GridIcon,
  SparklesIcon,
  BeakerIcon,
  CloudIcon,
  SearchIcon,
  LayersIcon,
  ShieldIcon,
} from "./TrackNavIcons";

export const learnExploreTracks = [
  { id: "all", label: "All", icon: GridIcon },
  { id: "generative-ai", label: "Generative AI", icon: SparklesIcon },
  { id: "agentic-systems", label: "Agentic Systems", icon: BeakerIcon },
  { id: "cloud-mlops", label: "Cloud & MLOps", icon: CloudIcon },
  { id: "rag-architecture", label: "RAG Architecture", icon: SearchIcon },
  { id: "multimodal-ai", label: "Multimodal AI", icon: LayersIcon },
  { id: "governance", label: "Governance", icon: ShieldIcon },
];

export const learnExploreResources = [
  {
    id: "ai-adoption-financial-services-2026",
    trackId: "generative-ai",
    badge: "INDUSTRY REPORT",
    badgeColor: "#4D90E3",
    title: "AI Adoption in Financial Services 2026",
    description:
      "A comprehensive analysis of how banks, insurers, and fintech leaders are deploying generative AI across risk, compliance, and customer engagement.",
    date: "June 12, 2026",
  },
  {
    id: "economics-of-ai",
    trackId: "generative-ai",
    badge: "RESEARCH",
    badgeColor: "#18E0CC",
    title: "The Economics of AI",
    description:
      "Quantifying ROI from enterprise AI investments — from pilot programs to production-scale deployments across industries.",
    date: "May 28, 2026",
  },
  {
    id: "generative-ai-enterprise",
    trackId: "generative-ai",
    badge: "TRENDS REPORT",
    badgeColor: "#F5B800",
    title: "Generative AI in Enterprise",
    description:
      "Key trends shaping how organizations integrate LLMs into workflows, products, and customer experiences at scale.",
    date: "May 15, 2026",
  },
  {
    id: "responsible-ai-ethics",
    trackId: "governance",
    badge: "WHITEPAPER",
    badgeColor: "#3A8D9D",
    title: "Building Responsible AI: Ethics Framework",
    description:
      "A practical framework for designing, deploying, and governing AI systems with fairness, transparency, and accountability.",
    date: "April 30, 2026",
  },
  {
    id: "education-ai-case-study",
    trackId: "multimodal-ai",
    badge: "CASE STUDY",
    badgeColor: "#EF8E29",
    title: "How Education Leaders Transform with AI",
    description:
      "How leading universities deployed multimodal AI to personalize learning paths and automate administrative workflows.",
    date: "April 18, 2026",
  },
  {
    id: "ai-readiness-assessment",
    trackId: "cloud-mlops",
    badge: "GUIDE",
    badgeColor: "#4D90E3",
    title: "AI Readiness Assessment",
    description:
      "A step-by-step guide to evaluating your organization's infrastructure, data, and talent readiness for AI at scale.",
    date: "April 5, 2026",
  },
  {
    id: "agentic-systems-future",
    trackId: "agentic-systems",
    badge: "FEATURED ARTICLE",
    badgeColor: "#18E0CC",
    title: "The Future of Enterprise AI: Agentic Systems and Autonomous Workflows",
    description:
      "Explore how autonomous AI agents are transforming enterprise operations, from customer service to complex decision-making processes.",
    date: "June 1, 2026",
  },
  {
    id: "agentic-workflows-playbook",
    trackId: "agentic-systems",
    badge: "GUIDE",
    badgeColor: "#EF8E29",
    title: "Agentic Workflows Playbook",
    description:
      "Design patterns and best practices for orchestrating multi-agent systems that collaborate on complex enterprise tasks.",
    date: "March 22, 2026",
  },
  {
    id: "rag-architecture-blueprint",
    trackId: "rag-architecture",
    badge: "WHITEPAPER",
    badgeColor: "#3A8D9D",
    title: "Enterprise RAG Architecture Blueprint",
    description:
      "Reference architecture for retrieval-augmented generation pipelines with vector stores, embedding models, and guardrails.",
    date: "March 10, 2026",
  },
  {
    id: "multimodal-ai-trends",
    trackId: "multimodal-ai",
    badge: "TRENDS REPORT",
    badgeColor: "#F5B800",
    title: "Multimodal AI Trends 2026",
    description:
      "How vision, audio, and text models are converging to power next-generation enterprise applications and interfaces.",
    date: "February 28, 2026",
  },
  {
    id: "mlops-at-scale",
    trackId: "cloud-mlops",
    badge: "INDUSTRY REPORT",
    badgeColor: "#4D90E3",
    title: "MLOps at Cloud Scale",
    description:
      "Lessons from enterprises running ML pipelines on AWS, Azure, and GCP with automated monitoring and retraining.",
    date: "February 14, 2026",
  },
  {
    id: "ai-governance-2026",
    trackId: "governance",
    badge: "RESEARCH",
    badgeColor: "#18E0CC",
    title: "AI Governance in Regulated Industries",
    description:
      "Navigating GDPR, HIPAA, and emerging AI regulations with robust governance frameworks and audit-ready documentation.",
    date: "January 30, 2026",
  },
];

export const homeInsights = learnExploreResources
  .filter((resource) =>
    [
      "ai-adoption-financial-services-2026",
      "responsible-ai-ethics",
      "education-ai-case-study",
      "generative-ai-enterprise",
      "economics-of-ai",
      "ai-readiness-assessment",
    ].includes(resource.id),
  )
  .map(({ id, badge, badgeColor, title, description, date }) => ({
    id,
    badge,
    badgeColor,
    title,
    description,
    date,
  }));

export const featuredArticle = {
  id: "agentic-systems-future",
  badge: "Certification",
  title: "AI-901: Azure AI Fundamentals",
  description:
    "Prepare for the AI-901 exam and build a strong foundation in artificial intelligence and Microsoft Azure AI services. Explore core ML concepts, computer vision, natural language processing, and responsible AI principles.",
  linkText: "Read Full Article",
  linkTo: "/learn-explore?track=all",
};

export const getResourceById = (resourceId) =>
  learnExploreResources.find((resource) => resource.id === resourceId);

export const getTrackIndexById = (trackId) => {
  const index = learnExploreTracks.findIndex((track) => track.id === trackId);
  return index >= 0 ? index : 0;
};

export const getTrackById = (trackId) =>
  learnExploreTracks[getTrackIndexById(trackId)];

export const getResourcesByTrack = (trackId) => {
  if (!trackId || trackId === "all") {
    return learnExploreResources;
  }

  return learnExploreResources.filter((resource) => resource.trackId === trackId);
};

const BLOG_BADGES = new Set([
  "FEATURED ARTICLE",
  "GUIDE",
  "RESEARCH",
  "TRENDS REPORT",
  "INDUSTRY REPORT",
]);

export const getResourcesByCategory = (category) => {
  switch (category) {
    case "blogs":
      return learnExploreResources.filter((resource) => BLOG_BADGES.has(resource.badge));
    case "whitepapers":
      return learnExploreResources.filter((resource) => resource.badge === "WHITEPAPER");
    case "case-studies":
      return learnExploreResources.filter((resource) => resource.badge === "CASE STUDY");
    default:
      return learnExploreResources;
  }
};
