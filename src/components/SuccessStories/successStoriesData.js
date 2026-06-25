import educationImage from "../../assets/images/industries01.svg";
import insuranceImage from "../../assets/images/industries03.svg";
import logisticsImage from "../../assets/images/industries04.svg";
import featuredImage from "../../assets/images/insigts.svg";
import sitecoreLogo from "../../assets/logo/site core logo 1.svg";
import salesforceLogo from "../../assets/logo/salesforce-no-type-logo 1.svg";
import { resolveLogoEntry } from "../../utils/logoResolver";

const adlmLogo = resolveLogoEntry({ logoKeywords: ["adlm", "diagnostics"] });
const inspereXLogo = resolveLogoEntry({ logoKeywords: ["inspere", "inspereX"] });

export const successStories = [
  {
    id: "adlm-sitecore-ai",
    client: "ADLM",
    industry: "Healthcare & Life Sciences",
    badge: "SUCCESS STORY",
    badgeColor: "#3A8D9D",
    subtitle: "ADLM – Association for Diagnostics & Laboratory Medicine",
    title: "Modernizing Member Experience on Sitecore AI",
    description:
      "Delivered end-to-end CX, EX, and BX transformation via a custom digital platform for a global clinical laboratory science organization.",
    date: "June 2026",
    industryTag: "HEALTHCARE",
    statValue: "Stronger",
    statLabel: "member engagement with personalized digital experiences",
    metric: "Stronger member engagement with personalized digital experiences",
    image: educationImage,
    clientLogo: adlmLogo,
    clientContext:
      "The Association for Diagnostics & Laboratory Medicine is a global scientific and medical professional organization dedicated to clinical laboratory science and its application to healthcare.",
    digitalPartnerRole:
      "As the digital partner, we continuously enhance and evolve the platform — modernizing from Sitecore XP to Sitecore AI, improving personalization and search, and streamlining content with Sitecore Content Hub DAM — while enabling seamless member experiences through integrations with Salesforce and HubSpot, all backed by proactive monitoring and continuous, data-driven improvements.",
    solutionDelivered: [
      "Continuously enhancing customer-facing digital and partner platforms to deliver faster, smoother, and more intuitive experiences.",
      "Progressively moving from Sitecore XP to Sitecore AI to build a scalable, future-ready foundation.",
      "Improving personalization and search with Sitecore Search to make content more relevant and easier to find.",
      "Streamlining content with Sitecore Content Hub DAM and strengthening integrations with Salesforce and HubSpot.",
      "Enhancing member experiences through profile management and AMS tools for seamless membership operations.",
      "Ensuring reliability with proactive monitoring, while using analytics to continuously improve customer journeys and roll out ongoing enhancements.",
    ],
    businessBenefits: [
      "Stronger customer engagement with faster, more personalized digital experiences.",
      "Higher adoption driven by improved search and easier content discovery.",
      "Simplified content management with Sitecore Content Hub DAM.",
      "Better member experience through unified profiles and seamless membership tools.",
      "More effective marketing and customer management with Salesforce and HubSpot.",
      "Faster issue resolution with proactive monitoring and support.",
      "Continuous improvement of customer journeys through data and insights.",
      "A scalable, future-ready platform supporting ongoing growth.",
    ],
    outcome:
      "ADLM strengthened its digital brand presence, improved member confidence, and supported organizational growth through a stable and scalable digital platform.",
    websiteUrl: "https://myadlm.org/",
    partnerTechnologies: [
      { name: "Sitecore AI", logo: sitecoreLogo },
      { name: "Netlify" },
      { name: "Salesforce", logo: salesforceLogo },
      { name: "HubSpot" },
    ],
    challenge:
      "ADLM needed a modern digital platform that could evolve with member expectations while unifying content, search, personalization, and membership operations across a complex ecosystem.",
    solution:
      "AI Verse partnered with ADLM to continuously enhance its digital experience — migrating to Sitecore AI, centralizing content in Content Hub DAM, and integrating Salesforce and HubSpot for seamless member engagement.",
    results: [
      "Stronger member engagement with faster, more personalized digital experiences.",
      "Higher adoption driven by improved search and easier content discovery.",
      "A scalable, future-ready platform supporting ongoing growth.",
    ],
    technologies: ["Sitecore AI", "Sitecore Search", "Content Hub DAM", "Salesforce", "HubSpot"],
  },
  {
    id: "insperex-b2c-platform",
    client: "InspereX",
    industry: "Investment & Wealth Management",
    badge: "SUCCESS STORY",
    badgeColor: "#4D90E3",
    subtitle: "InspereX – Investment & Wealth Management (B2C)",
    title: "Revamping B2C Investment & Wealth Management Platform",
    description:
      "Revamped customer-facing digital, public, and partner platforms with a modern UX for a high-growth investment and wealth management firm.",
    date: "May 2026",
    industryTag: "BFSI",
    statValue: "Scalable",
    statLabel: "future-ready platform supporting rapid growth",
    metric: "Scalable future-ready platform supporting rapid growth",
    image: featuredImage,
    clientLogo: inspereXLogo,
    clientContext:
      "InspereX is a high-growth investment and wealth management firm operating a public-facing digital platform used by investors, partners, and advisors.",
    digitalPartnerRole:
      "Espire partnered with InspereX to enhance customer engagement, platform stability, and digital scalability while supporting rapid business growth.",
    solutionDelivered: [
      "Revamped customer-facing digital, public, and partner platforms with a modern UX, making them faster, smoother, and more intuitive.",
      "Enabled multi-site and microsite capabilities for greater flexibility and quicker launches.",
      "Migrated from Sitecore XP to Sitecore AI to build a scalable, future-ready foundation.",
      "Introduced personalization to create more relevant and engaging user experiences.",
      "Integrated Content Hub DAM to streamline and centralize content management.",
      "Implemented Sitecore Search to improve content discovery and user engagement.",
      "Established proactive monitoring and SLA-driven support for consistent performance.",
      "Used analytics to continuously refine customer journeys and rolled out enhancements aligned with business growth.",
    ],
    businessBenefits: [
      "Improved customer engagement with faster, more intuitive, and personalized digital experiences.",
      "Increased digital adoption through enhanced search, discoverability, and seamless multi-site experiences.",
      "Boosted content efficiency with centralized asset management via Content Hub DAM.",
      "Reduced incident response time with proactive monitoring and SLA-driven support.",
      "Enabled continuous, data-driven optimization of customer journeys.",
      "Built a scalable, future-ready platform to support growth without increasing operational cost.",
    ],
    outcome:
      "InspereX strengthened its digital brand presence, improved customer confidence, and supported revenue growth through a stable and scalable digital platform.",
    websiteUrl: "https://www.insperex.com/",
    partnerTechnologies: [
      { name: "Sitecore AI", logo: sitecoreLogo },
      { name: "Vercel" },
    ],
    challenge:
      "InspereX required a modern B2C digital platform that could scale with rapid business growth while improving engagement, stability, and content agility across multiple sites.",
    solution:
      "AI Verse modernized InspereX's digital estate with Sitecore AI, personalization, Content Hub DAM, Sitecore Search, and proactive SLA-driven support to deliver a faster and more intuitive investor experience.",
    results: [
      "Improved customer engagement with faster, more intuitive, and personalized digital experiences.",
      "Increased digital adoption through enhanced search and seamless multi-site experiences.",
      "Built a scalable, future-ready platform to support growth without increasing operational cost.",
    ],
    technologies: ["Sitecore AI", "Sitecore Search", "Content Hub DAM", "Personalization"],
  },
  {
    id: "hh-global-ai-translation",
    client: "HH Global",
    industry: "Marketing Services",
    badge: "SUCCESS STORY",
    badgeColor: "#3A8D9D",
    title: "Scaling Multilingual Campaigns with AI Document Translation",
    description:
      "HH Global accelerated global campaign delivery by automating document translation workflows across African and European markets with AI-powered quality controls.",
    date: "June 2026",
    industryTag: "MARKETING",
    statValue: "65%",
    statLabel: "faster localization turnaround",
    metric: "65% faster localization",
    image: featuredImage,
    challenge:
      "HH Global managed high volumes of marketing collateral across dozens of regions. Manual translation cycles created bottlenecks, inconsistent terminology, and delayed go-to-market timelines for enterprise clients.",
    solution:
      "AI Verse deployed an AI-powered document translation workflow using Python and Google AI services, integrated with existing CCM pipelines. Human reviewers receive side-by-side comparisons, glossary enforcement, and automated routing for high-risk content.",
    results: [
      "65% reduction in average localization turnaround time",
      "Consistent brand terminology enforced across 18 language pairs",
      "Audit-ready translation logs for enterprise compliance reviews",
      "Seamless handoff between marketing ops and regional review teams",
    ],
    technologies: ["Python", "Google AI", "CCM Integration"],
  },
  {
    id: "canopius-claims-intelligence",
    client: "Canopius",
    industry: "Insurance",
    badge: "SUCCESS STORY",
    badgeColor: "#4D90E3",
    title: "Intelligent Claims Triage for MGA Operations",
    description:
      "Canopius improved claims handling speed and accuracy with AI-driven document classification and policy-aware routing for specialty insurance lines.",
    date: "May 2026",
    industryTag: "INSURANCE",
    statValue: "40%",
    statLabel: "faster claims triage",
    metric: "40% faster triage",
    image: insuranceImage,
    challenge:
      "Specialty MGA teams processed heterogeneous claim submissions with unstructured attachments, leading to manual sorting delays and inconsistent routing to underwriting specialists.",
    solution:
      "AI Verse implemented document intelligence and agentic automation to classify incoming submissions, extract key entities, and route cases based on policy type, severity, and regulatory requirements.",
    results: [
      "40% faster initial claims triage across specialty lines",
      "Higher straight-through processing for low-complexity submissions",
      "Improved adjuster productivity with AI-generated case summaries",
      "Reduced rework from misrouted or incomplete submissions",
    ],
    technologies: ["Document AI", "Agentic Automation", "Azure AI"],
  },
  {
    id: "charles-sturt-student-success",
    client: "Charles Sturt University",
    industry: "Education",
    badge: "SUCCESS STORY",
    badgeColor: "#EF8E29",
    title: "Personalized Student Support with Multimodal AI",
    description:
      "Charles Sturt University deployed AI assistants to personalize learning pathways and automate high-volume student service requests across digital channels.",
    date: "April 2026",
    industryTag: "EDUCATION",
    statValue: "30%",
    statLabel: "higher student engagement",
    metric: "30% higher engagement",
    image: educationImage,
    challenge:
      "Growing enrollment and digital-first student expectations strained support teams. Students needed faster answers across enrollment, financial aid, and academic advising without sacrificing quality.",
    solution:
      "AI Verse delivered multimodal AI assistants integrated with LMS and student portals, combining conversational AI, knowledge retrieval, and workflow automation for common administrative tasks.",
    results: [
      "30% improvement in student engagement with digital support channels",
      "Reduced average response time for routine inquiries by over 50%",
      "Advisors freed to focus on complex retention and success cases",
      "FERPA-aligned governance framework for responsible AI use",
    ],
    technologies: ["Conversational AI", "RAG", "LMS Integration"],
  },
  {
    id: "publicis-ccm-automation",
    client: "Publicis Groupe",
    industry: "Customer Communications",
    badge: "SUCCESS STORY",
    badgeColor: "#18E0CC",
    title: "Enterprise CCM Modernization with Agentic Workflows",
    description:
      "Publicis Groupe streamlined high-volume customer communications with AI-assisted content generation, PII remediation, and automated QA across regulated templates.",
    date: "March 2026",
    industryTag: "HEALTHCARE",
    statValue: "45%",
    statLabel: "improvement in compliance QA cycles",
    metric: "50% QA time saved",
    image: featuredImage,
    challenge:
      "Enterprise CCM teams faced rising template complexity, strict compliance requirements, and manual QA cycles that slowed campaign launches for financial and healthcare clients.",
    solution:
      "AI Verse integrated content assist capabilities, PII remediation pipelines, and agentic QA bots into the existing CCM stack, enabling business users to draft, sanitize, and validate communications faster.",
    results: [
      "50% reduction in manual QA effort for regulated templates",
      "Automated PII detection and remediation before production release",
      "Faster content iteration cycles for business stakeholders",
      "Improved compliance confidence with full audit trails",
    ],
    technologies: ["CCM", "PII Remediation", "Content Assist"],
  },
  {
    id: "tds-dispute-resolution",
    client: "The Dispute Service",
    industry: "Financial Services",
    badge: "SUCCESS STORY",
    badgeColor: "#3A8D9D",
    title: "AI-Powered Case Insight for Dispute Resolution",
    description:
      "The Dispute Service improved analyst productivity with an AI issue insight hub that surfaces historical precedents and accelerates evidence review.",
    date: "February 2026",
    industryTag: "BFSI",
    statValue: "60%",
    statLabel: "faster adjudication process",
    metric: "35% faster reviews",
    image: insuranceImage,
    challenge:
      "Dispute analysts spent significant time searching historical cases and synthesizing evidence across unstructured documents, emails, and submission forms.",
    solution:
      "AI Verse built an Issue Insight Hub using RAG architecture to index case history, enable semantic search, and generate structured summaries with cited sources for analyst review.",
    results: [
      "35% faster case review cycles for complex disputes",
      "Improved consistency in precedent identification",
      "Analysts spend more time on judgment and less on document hunting",
      "Searchable knowledge base grows automatically with closed cases",
    ],
    technologies: ["RAG", "Issue Insight Hub", "Azure AI Foundry"],
  },
  {
    id: "ceva-logistics-visibility",
    client: "CEVA Logistics",
    industry: "Logistics",
    badge: "SUCCESS STORY",
    badgeColor: "#4D90E3",
    title: "Predictive Operations Intelligence for Global Logistics",
    description:
      "CEVA Logistics enhanced shipment visibility and exception handling with predictive analytics and intelligent automation across supply chain workflows.",
    date: "January 2026",
    industryTag: "LOGISTICS",
    statValue: "3x",
    statLabel: "faster global deployment",
    metric: "25% fewer delays",
    image: logisticsImage,
    challenge:
      "Global logistics operations generated fragmented data across warehouses, carriers, and customer portals, making proactive exception management difficult at scale.",
    solution:
      "AI Verse deployed predictive analytics and intelligent automation to flag delays early, recommend corrective actions, and orchestrate notifications across operations teams and customer-facing channels.",
    results: [
      "25% reduction in preventable shipment delays",
      "Earlier exception detection across multi-leg routes",
      "Unified operational dashboards for regional control towers",
      "Automated customer updates for high-impact disruptions",
    ],
    technologies: ["Predictive Analytics", "Intelligent Automation", "Integration Hub"],
  },
];

export const featuredSuccessStory = successStories[0];

const priorityStoryIds = [
  "adlm-sitecore-ai",
  "insperex-b2c-platform",
  "tds-dispute-resolution",
  "ceva-logistics-visibility",
  "publicis-ccm-automation",
];

export const homeCarouselStories = [
  ...priorityStoryIds
    .map((id) => successStories.find((story) => story.id === id))
    .filter(Boolean),
  ...successStories.filter((story) => !priorityStoryIds.includes(story.id)),
];

export const homeSuccessStories = successStories.slice(1, 4);

export const getSuccessStoryById = (storyId) =>
  successStories.find((story) => story.id === storyId);

export const getSuccessStoryIndexById = (storyId) => {
  const index = successStories.findIndex((story) => story.id === storyId);
  return index >= 0 ? index : 0;
};

export const isFullCaseStudy = (story) =>
  Boolean(story?.clientContext && story?.solutionDelivered);
