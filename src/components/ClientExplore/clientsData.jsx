import clientLogo1 from "../../assets/images/client_logo1.svg";
import clientLogo3 from "../../assets/images/client_logo3.svg";
import clientLogo4 from "../../assets/images/client_logo4.svg";
import clientLogo5 from "../../assets/images/client_logo5.svg";
import clientLogo6 from "../../assets/images/client_logo7.svg";
import clientLogo7 from "../../assets/images/client_logo8.svg";
import { resolveLogoEntry } from "../../utils/logoResolver";

export const realClients = [
  {
    id: "hh-global",
    name: "HH Global",
    logo: resolveLogoEntry({ logoKeywords: ["hhglobal", "hglobal"] }),
    initials: "HH",
    tagline: "Global marketing execution at scale",
    subtitle:
      "Accelerating multilingual campaign delivery with AI-powered document translation and CCM automation.",
    contentParagraphs: [
      "HH Global is a leading marketing execution partner for enterprise brands, managing high volumes of localized collateral across dozens of regions.",
      "Espire partners with HH Global to automate document translation workflows, enforce brand terminology, and integrate AI quality controls into existing CCM pipelines.",
      "Together we reduce localization bottlenecks while maintaining audit-ready translation logs for enterprise compliance reviews.",
    ],
    highlights: [
      {
        title: "AI Document Translation",
        description: "Automated translation with glossary enforcement and human-in-the-loop review.",
      },
      {
        title: "CCM Integration",
        description: "Seamless handoff between marketing ops and regional review teams.",
      },
      {
        title: "Compliance Ready",
        description: "Audit trails and side-by-side comparisons for regulated content.",
      },
    ],
    pocs: [
      {
        storyId: "hh-global-ai-translation",
        title: "Scaling Multilingual Campaigns with AI Document Translation",
        description:
          "65% faster localization turnaround across African and European markets with AI-powered quality controls.",
      },
    ],
  },
  {
    id: "the-dispute-service",
    name: "The Dispute Service Limited",
    logo: resolveLogoEntry({ logoKeywords: ["tds"] }),
    initials: "TDS",
    tagline: "Trusted dispute resolution",
    subtitle:
      "Improving analyst productivity with AI-powered case insight and semantic search over historical precedents.",
    contentParagraphs: [
      "The Dispute Service Limited provides independent dispute resolution services, handling complex cases with extensive evidence across unstructured documents, emails, and submission forms.",
      "Espire built an Issue Insight Hub using RAG architecture to index case history, enable semantic search, and generate structured summaries with cited sources for analyst review.",
      "Analysts spend more time on judgment and less on document hunting, with a searchable knowledge base that grows automatically with closed cases.",
    ],
    highlights: [
      {
        title: "Issue Insight Hub",
        description: "RAG-powered search across historical cases and evidence repositories.",
      },
      {
        title: "Case Summaries",
        description: "AI-generated structured summaries with cited sources for faster review.",
      },
      {
        title: "Knowledge Retention",
        description: "Automatically indexed precedents improve consistency in adjudication.",
      },
    ],
    pocs: [
      {
        storyId: "tds-dispute-resolution",
        title: "AI-Powered Case Insight for Dispute Resolution",
        description:
          "35% faster case review cycles with an AI issue insight hub surfacing historical precedents.",
      },
    ],
  },
  {
    id: "canopius",
    name: "Vave MGA (Canopius Insurance Services)",
    logo: resolveLogoEntry({ logoKeywords: ["canopius"] }),
    initials: "VM",
    tagline: "Specialty insurance intelligence",
    subtitle:
      "AI-driven claims triage and document classification for MGA operations across specialty insurance lines.",
    contentParagraphs: [
      "Canopius Insurance Services operates as a specialty MGA, processing heterogeneous claim submissions with unstructured attachments across multiple insurance lines.",
      "Espire implemented document intelligence and agentic automation to classify incoming submissions, extract key entities, and route cases based on policy type, severity, and regulatory requirements.",
      "The solution improves straight-through processing for low-complexity submissions while giving adjusters AI-generated case summaries.",
    ],
    highlights: [
      {
        title: "Claims Triage",
        description: "40% faster initial triage with policy-aware routing.",
      },
      {
        title: "Document Intelligence",
        description: "Automated classification and entity extraction from submissions.",
      },
      {
        title: "Adjuster Productivity",
        description: "AI-generated summaries reduce rework from misrouted cases.",
      },
    ],
    pocs: [
      {
        storyId: "canopius-claims-intelligence",
        title: "Intelligent Claims Triage for MGA Operations",
        description:
          "40% faster claims triage with AI-driven document classification and policy-aware routing.",
      },
    ],
  },
  {
    id: "culina",
    name: "Cullina",
    logo: resolveLogoEntry({ logoKeywords: ["culina"] }),
    initials: "CU",
    tagline: "Supply chain visibility",
    subtitle:
      "Intelligent automation and predictive analytics for logistics and distribution operations.",
    contentParagraphs: [
      "Cullina operates in logistics and distribution, managing complex supply chain workflows that generate fragmented operational data across warehouses, carriers, and customer channels.",
      "Espire delivers intelligent automation and predictive analytics to flag delays early, recommend corrective actions, and orchestrate notifications across operations teams.",
      "Our solutions unify operational dashboards and automate customer updates for high-impact disruptions.",
    ],
    highlights: [
      {
        title: "Predictive Operations",
        description: "Early exception detection across multi-leg routes and warehouses.",
      },
      {
        title: "Workflow Automation",
        description: "Intelligent routing and notifications for supply chain exceptions.",
      },
      {
        title: "Customer Visibility",
        description: "Automated status updates for high-impact shipment disruptions.",
      },
    ],
    pocs: [
      {
        title: "Supply Chain Exception Intelligence",
        description:
          "Predictive analytics and intelligent automation to reduce preventable delays and improve operational visibility.",
        href: "/contact",
        ctaLabel: "Discuss this POC",
      },
    ],
  },
  {
    id: "inspereX",
    name: "InspereX",
    logo: resolveLogoEntry({ logoKeywords: ["inspere", "inspereX"] }),
    initials: "IX",
    tagline: "Investment & wealth management",
    subtitle:
      "Revamping B2C digital platforms with Sitecore AI, personalization, and scalable multi-site capabilities.",
    contentParagraphs: [
      "InspereX is a high-growth investment and wealth management firm operating a public-facing digital platform used by investors, partners, and advisors.",
      "Espire partnered with InspereX to revamp customer-facing digital platforms with modern UX, migrate from Sitecore XP to Sitecore AI, and introduce personalization for more relevant user experiences.",
      "Proactive monitoring, Content Hub DAM, and Sitecore Search improved platform stability, content agility, and digital scalability during rapid business growth.",
    ],
    highlights: [
      {
        title: "Sitecore AI Migration",
        description: "Scalable, future-ready foundation with personalization and search.",
      },
      {
        title: "Multi-Site Platform",
        description: "Microsite capabilities for flexible, faster digital launches.",
      },
      {
        title: "SLA-Driven Support",
        description: "Proactive monitoring and analytics-driven journey optimization.",
      },
    ],
    pocs: [
      {
        storyId: "insperex-b2c-platform",
        title: "Revamping B2C Investment & Wealth Management Platform",
        description:
          "Modern UX, Sitecore AI migration, and personalization for a scalable investor experience.",
      },
    ],
  },
  {
    id: "publicis-groupe",
    name: "Publicis Groupe",
    logo: resolveLogoEntry({ logoKeywords: ["publicis"] }),
    initials: "PG",
    tagline: "Enterprise customer communications",
    subtitle:
      "CCM modernization with AI-assisted content generation, PII remediation, and automated QA.",
    contentParagraphs: [
      "Publicis Groupe delivers enterprise customer communications for financial and healthcare clients, facing rising template complexity and strict compliance requirements.",
      "Espire integrated content assist capabilities, PII remediation pipelines, and agentic QA bots into the existing CCM stack.",
      "Business users can draft, sanitize, and validate communications faster with full audit trails for compliance confidence.",
    ],
    highlights: [
      {
        title: "Content Assist",
        description: "AI-assisted drafting and iteration for regulated templates.",
      },
      {
        title: "PII Remediation",
        description: "Automated detection and sanitization before production release.",
      },
      {
        title: "Agentic QA",
        description: "50% reduction in manual QA effort with audit-ready workflows.",
      },
    ],
    pocs: [
      {
        storyId: "publicis-ccm-automation",
        title: "Enterprise CCM Modernization with Agentic Workflows",
        description:
          "50% QA time saved with AI-assisted content generation and automated compliance validation.",
      },
    ],
  },
];

const platformPartners = [
  {
    id: "shopify",
    name: "Shopify",
    logo: clientLogo1,
    tagline: "Commerce at global scale",
    subtitle:
      "Empowering merchants with AI-driven personalization, automation, and intelligent storefront experiences.",
    contentParagraphs: [
      "Espire partners with Shopify to help retailers and D2C brands launch AI-powered commerce experiences that increase conversion and customer lifetime value. From personalized product recommendations to intelligent search and automated customer support, we extend Shopify's platform with enterprise-grade AI capabilities.",
      "Our teams integrate seamlessly with Shopify Plus, custom storefronts, and headless architectures—delivering solutions that scale from mid-market merchants to global enterprise brands.",
      "Together we enable faster time-to-market for AI features while maintaining the performance and reliability commerce teams demand.",
    ],
    highlights: [
      {
        title: "Personalized Commerce",
        description: "Real-time product recommendations and dynamic merchandising across web and mobile.",
      },
      {
        title: "Intelligent Support",
        description: "AI chatbots for order tracking, returns, and product discovery integrated with Shopify data.",
      },
      {
        title: "Headless Ready",
        description: "API-first AI services for Hydrogen, custom React storefronts, and omnichannel rollouts.",
      },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    logo: resolveLogoEntry({ logoKeywords: ["hotsport", "hubspot"] }),
    tagline: "Inbound growth, amplified by AI",
    subtitle:
      "Connecting marketing, sales, and service workflows with intelligent automation on HubSpot.",
    contentParagraphs: [
      "HubSpot is at the center of modern inbound growth stacks. Espire builds AI solutions that enrich CRM data, automate lead qualification, and power conversational experiences across the customer lifecycle.",
      "We help organizations unify marketing automation with predictive scoring, content personalization, and service bots that pull context directly from HubSpot records.",
      "Our implementations respect HubSpot's permission model and integrate with Marketing Hub, Sales Hub, and Service Hub for end-to-end visibility.",
    ],
    highlights: [
      {
        title: "Lead Intelligence",
        description: "Predictive scoring and next-best-action recommendations for sales teams.",
      },
      {
        title: "Content Automation",
        description: "AI-assisted campaign copy, email variants, and landing page optimization.",
      },
      {
        title: "Service Copilots",
        description: "Agent assist and customer self-service grounded in ticket and knowledge data.",
      },
    ],
  },
  {
    id: "kibo",
    name: "KIBO",
    logo: clientLogo3,
    tagline: "Unified commerce platform",
    subtitle:
      "Delivering intelligent order management and commerce orchestration on the KIBO platform.",
    contentParagraphs: [
      "KIBO provides a unified commerce platform for complex B2B and B2C scenarios. Espire extends KIBO deployments with AI for demand forecasting, inventory optimization, and personalized buyer experiences.",
      "We work with retailers and manufacturers who need distributed order management, marketplace capabilities, and subscription commerce—all enhanced with machine learning insights.",
      "Our solutions connect KIBO's order and catalog APIs with data warehouses and AI services for real-time decisioning at scale.",
    ],
    highlights: [
      {
        title: "Order Intelligence",
        description: "Optimize routing, fulfillment, and promise dates with predictive models.",
      },
      {
        title: "B2B Personalization",
        description: "Tailored catalogs, pricing, and recommendations for business buyers.",
      },
      {
        title: "Inventory Insights",
        description: "Forecast demand and reduce stockouts across channels and regions.",
      },
    ],
  },
  {
    id: "quadient",
    name: "Quadient",
    logo: clientLogo4,
    tagline: "Customer communications excellence",
    subtitle:
      "Transforming document and communication workflows with AI on Quadient platforms.",
    contentParagraphs: [
      "Quadient leads in customer communications management and mailing solutions. Espire combines Quadient's CCM capabilities with document intelligence, generative content, and conversational AI for regulated industries.",
      "From statement generation and policy communications to customer onboarding journeys, we automate document creation, personalization, and delivery across print and digital channels.",
      "Financial services, insurance, and utilities clients benefit from faster cycle times, compliance-ready audit trails, and improved customer engagement.",
    ],
    highlights: [
      {
        title: "Document Intelligence",
        description: "Automated classification, extraction, and generation for high-volume correspondence.",
      },
      {
        title: "Journey Orchestration",
        description: "AI-triggered communications based on customer behavior and lifecycle events.",
      },
      {
        title: "Compliance Ready",
        description: "Governed content generation with approval workflows and full lineage tracking.",
      },
    ],
  },
  {
    id: "kofax",
    name: "Kofax",
    logo: clientLogo5,
    tagline: "Intelligent automation partner",
    subtitle:
      "Accelerating capture, process automation, and document workflows with Kofax and AI.",
    contentParagraphs: [
      "Kofax powers intelligent automation for document capture, OCR, and workflow orchestration. Espire enhances Kofax deployments with advanced NLP, computer vision, and agentic automation for end-to-end processing.",
      "We help enterprises digitize mailrooms, automate accounts payable, and streamline customer onboarding by combining Kofax capture with AI understanding and exception handling.",
      "Integrations with ERP, CRM, and line-of-business systems ensure extracted data flows directly into downstream processes without manual re-keying.",
    ],
    highlights: [
      {
        title: "Smart Capture",
        description: "Template-free extraction from invoices, forms, and unstructured documents.",
      },
      {
        title: "Process Automation",
        description: "Bots and AI agents that route, validate, and post transactions automatically.",
      },
      {
        title: "Exception Handling",
        description: "AI-assisted review queues that reduce manual effort on edge cases.",
      },
    ],
  },
  {
    id: "sitecore",
    name: "Sitecore",
    logo: clientLogo6,
    tagline: "Digital experience platform",
    subtitle:
      "Building personalized digital experiences with AI on the Sitecore DXP.",
    contentParagraphs: [
      "Sitecore enables brands to deliver composable digital experiences across web, email, and commerce touchpoints. Espire layers AI personalization, content generation, and search intelligence onto Sitecore XM Cloud and Content Hub deployments.",
      "Marketing teams gain dynamic content assembly, audience segmentation powered by ML, and experimentation frameworks that measure lift across campaigns.",
      "We architect headless and hybrid solutions that keep Sitecore as the experience hub while connecting best-of-breed AI services.",
    ],
    highlights: [
      {
        title: "Experience Personalization",
        description: "Real-time content and offer personalization based on visitor behavior.",
      },
      {
        title: "Content AI",
        description: "Generative tools for copy, imagery, and variant testing within brand guardrails.",
      },
      {
        title: "Composable Architecture",
        description: "API-driven AI microservices integrated with Sitecore's composable DXP.",
      },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: clientLogo7,
    tagline: "Cloud and AI innovation",
    subtitle:
      "Delivering enterprise AI on Microsoft Azure, Copilot, and the Power Platform.",
    contentParagraphs: [
      "As a Microsoft partner, Espire builds production AI solutions on Azure OpenAI, Microsoft Fabric, Power Platform, and Dynamics 365. We help enterprises adopt Copilot experiences, build custom agents, and modernize applications on Azure.",
      "From secure RAG assistants over SharePoint and Teams to predictive analytics in Fabric and automated workflows in Power Automate, our Microsoft practice covers the full AI transformation lifecycle.",
      "Security, identity, and compliance are foundational—every solution leverages Azure AD, Key Vault, and Microsoft's responsible AI tooling.",
    ],
    highlights: [
      {
        title: "Azure OpenAI",
        description: "Enterprise LLM deployments with private networking, monitoring, and cost controls.",
      },
      {
        title: "Copilot Extensions",
        description: "Custom copilots for M365, Teams, and line-of-business applications.",
      },
      {
        title: "Power Platform AI",
        description: "Low-code automation and AI builder solutions for business teams.",
      },
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    initials: "SF",
    tagline: "CRM-powered AI at scale",
    subtitle:
      "Extending Salesforce with Einstein AI, agent workflows, and intelligent customer experiences.",
    contentParagraphs: [
      "Salesforce is the world's leading CRM platform. Espire helps enterprises unlock the full potential of Salesforce Einstein, Agentforce, and Data Cloud with custom AI integrations and industry-specific solutions.",
      "We build predictive models, automated service workflows, and sales copilots that leverage your Salesforce data while respecting platform governance and security models.",
      "From Financial Services Cloud to Health Cloud and Marketing Cloud, our Salesforce practice delivers AI that drives measurable pipeline and retention outcomes.",
    ],
    highlights: [
      {
        title: "Einstein & Agentforce",
        description: "Deploy AI agents and predictive insights across sales, service, and marketing.",
      },
      {
        title: "Data Cloud AI",
        description: "Unify customer data for personalization and next-best-action recommendations.",
      },
      {
        title: "Industry Clouds",
        description: "Tailored AI solutions for regulated industries on Salesforce platforms.",
      },
    ],
  },
  {
    id: "databricks",
    name: "Databricks",
    initials: "DB",
    tagline: "Lakehouse intelligence",
    subtitle:
      "Building enterprise ML and GenAI pipelines on the Databricks Lakehouse Platform.",
    contentParagraphs: [
      "Databricks unifies data engineering, analytics, and machine learning on a single lakehouse architecture. Espire helps organizations migrate workloads, build ML models, and deploy GenAI applications on Databricks.",
      "We implement MLOps best practices, feature stores, and RAG pipelines using Mosaic AI and Unity Catalog for governed, production-ready AI.",
      "Our data engineering teams connect ERP, CRM, and IoT sources into Databricks for real-time analytics and model training at enterprise scale.",
    ],
    highlights: [
      {
        title: "Lakehouse Modernization",
        description: "Migrate data platforms to Databricks with optimized Delta Lake architectures.",
      },
      {
        title: "Mosaic AI & RAG",
        description: "Deploy retrieval-augmented GenAI with vector search and model serving.",
      },
      {
        title: "MLOps at Scale",
        description: "End-to-end model lifecycle management with MLflow and Unity Catalog.",
      },
    ],
  },
  {
    id: "uipath",
    name: "UiPath",
    initials: "UI",
    tagline: "Intelligent automation leader",
    subtitle:
      "Combining RPA, AI, and process mining for hyperautomation on the UiPath platform.",
    contentParagraphs: [
      "UiPath is a leader in robotic process automation and intelligent document processing. Espire designs UiPath solutions that blend bots, AI models, and human-in-the-loop workflows for end-to-end automation.",
      "We help enterprises discover processes with Task Mining, automate document-heavy workflows with Document Understanding, and orchestrate complex automations with UiPath Orchestrator.",
      "Our automation CoE frameworks ensure governance, scalability, and ROI tracking across bot fleets.",
    ],
    highlights: [
      {
        title: "Document Understanding",
        description: "AI-powered extraction from invoices, forms, and unstructured documents.",
      },
      {
        title: "Process Mining",
        description: "Discover automation opportunities from system logs and user interactions.",
      },
      {
        title: "Attended & Unattended Bots",
        description: "Hybrid automation that supports employees and runs autonomously at scale.",
      },
    ],
  },
  {
    id: "contentful",
    name: "Contentful",
    initials: "CF",
    tagline: "Composable content platform",
    subtitle:
      "AI-enhanced content management and delivery with Contentful's composable CMS.",
    contentParagraphs: [
      "Contentful powers digital experiences for global brands with a composable, API-first content platform. Espire integrates AI content generation, personalization, and translation workflows into Contentful deployments.",
      "Marketing and product teams benefit from automated content variants, SEO optimization, and intelligent tagging powered by ML models connected to Contentful's content graph.",
      "We build headless architectures that pair Contentful with Next.js, mobile apps, and omnichannel delivery pipelines.",
    ],
    highlights: [
      {
        title: "AI Content Workflows",
        description: "Generate, translate, and optimize content within Contentful workflows.",
      },
      {
        title: "Composable Delivery",
        description: "API-driven content for web, app, and IoT experiences at global scale.",
      },
      {
        title: "Personalization",
        description: "Dynamic content assembly based on audience segments and behavior.",
      },
    ],
  },
  {
    id: "opentext",
    name: "OpenText",
    initials: "OT",
    tagline: "Enterprise information management",
    subtitle:
      "Intelligent content services and document management with OpenText and AI.",
    contentParagraphs: [
      "OpenText provides enterprise content management, business network, and cybersecurity solutions. Espire enhances OpenText deployments with document intelligence, automated classification, and AI-driven search.",
      "We help organizations digitize archives, automate contract lifecycle management, and extract insights from content repositories at scale.",
      "Integrations with SAP, Oracle, and Microsoft ecosystems ensure content flows seamlessly across the enterprise stack.",
    ],
    highlights: [
      {
        title: "Content Intelligence",
        description: "Automated classification, extraction, and routing of enterprise documents.",
      },
      {
        title: "CLM Automation",
        description: "AI-assisted contract review, obligation tracking, and risk flagging.",
      },
      {
        title: "Enterprise Search",
        description: "Semantic search across OpenText repositories and connected systems.",
      },
    ],
  },
  {
    id: "ellucian",
    name: "Ellucian",
    initials: "EL",
    tagline: "Higher education technology",
    subtitle:
      "AI solutions for student success and institutional efficiency on Ellucian platforms.",
    contentParagraphs: [
      "Ellucian serves higher education institutions with ERP, CRM, and student information systems. Espire builds AI solutions that improve student retention, automate administrative processes, and personalize learner experiences on Ellucian Banner and Colleague.",
      "From predictive analytics for at-risk students to chatbots for enrollment and financial aid, we help universities modernize with responsible AI.",
      "Our education practice understands FERPA compliance and the unique data governance needs of academic institutions.",
    ],
    highlights: [
      {
        title: "Student Success AI",
        description: "Early alerts and intervention workflows for at-risk students.",
      },
      {
        title: "Enrollment Automation",
        description: "AI assistants for admissions, registration, and financial aid inquiries.",
      },
      {
        title: "Institutional Analytics",
        description: "Predictive models for enrollment, retention, and resource planning.",
      },
    ],
  },
  {
    id: "aisera",
    name: "Aisera",
    initials: "AI",
    tagline: "AI service management",
    subtitle:
      "Autonomous service desk and employee experience solutions powered by Aisera.",
    contentParagraphs: [
      "Aisera delivers AI-powered service experience platforms for IT, HR, and customer service. Espire implements Aisera to automate ticket resolution, provide conversational self-service, and reduce mean time to resolution.",
      "Pre-built integrations with ServiceNow, Jira, Salesforce, and Microsoft Teams enable rapid deployment of virtual agents across the enterprise.",
      "Our implementations include knowledge base ingestion, intent modeling, and continuous learning loops that improve resolution rates over time.",
    ],
    highlights: [
      {
        title: "Autonomous Service Desk",
        description: "Auto-resolve L1 tickets with AI agents trained on your knowledge base.",
      },
      {
        title: "Employee Experience",
        description: "HR and IT self-service bots integrated with collaboration tools.",
      },
      {
        title: "Proactive Support",
        description: "Predict and prevent issues before users report them.",
      },
    ],
  },
];

export const clientsData = [...realClients, ...platformPartners];

export const partnerData = platformPartners;

export const CLIENT_SECTION = "clients";
export const PARTNER_SECTION = "partners";

export const getClientSection = (clientId) => {
  if (clientId && platformPartners.some((partner) => partner.id === clientId)) {
    return PARTNER_SECTION;
  }

  return CLIENT_SECTION;
};

export const getSectionItems = (section) =>
  section === PARTNER_SECTION ? platformPartners : realClients;

export const getSectionItemById = (clientId) => {
  const section = getClientSection(clientId);
  const items = getSectionItems(section);
  const index = items.findIndex((item) => item.id === clientId);
  const resolvedIndex = index >= 0 ? index : 0;

  return {
    section,
    items,
    item: items[resolvedIndex],
    index: resolvedIndex,
  };
};

export const homeClients = realClients.map(({ id, name, logo, initials }) => ({
  id,
  name,
  logo,
  initials,
}));

const trustedPartnerIds = [
  "microsoft",
  "salesforce",
  "databricks",
  "uipath",
  "contentful",
  "sitecore",
  "opentext",
  "ellucian",
  "aisera",
];

export const homePartners = trustedPartnerIds.map((id) => {
  const partner = clientsData.find((item) => item.id === id);
  return { id: partner.id, name: partner.name };
});

export const getClientIndexById = (clientId) => {
  const { index } = getSectionItemById(clientId);
  return index;
};

export const getClientById = (clientId) => getSectionItemById(clientId).item;
