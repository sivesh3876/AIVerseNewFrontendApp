import {
  ConversationalAIIcon,
  AgenticAIIcon,
  AdvancedNLPIcon,
  ComputerVisionIcon,
  DocumentIntelligenceIcon,
  PredictiveAnalyticsIcon,
  IntelligentAutomationIcon,
  RecommendationEnginesIcon,
  MultiLanguageAIIcon,
  KnowledgeAssistantsIcon,
  GenerativeAIIcon,
  EnterpriseSearchIcon,
} from "../ComprehensiveAICapabilities/CapabilityIcons";

export const aiCapabilitiesData = [
  {
    id: "conversational-ai",
    title: "Conversational AI",
    shortDescription: "Natural language interfaces",
    navIcon: ConversationalAIIcon,
    subtitle: "Deploy intelligent chatbots and voice assistants that understand context and resolve customer queries at scale.",
    features: [
      "Omnichannel chat across web, mobile, and messaging apps",
      "Context-aware dialog with memory and handoff to agents",
      "Sentiment detection and escalation workflows",
      "Enterprise integration with CRM and knowledge bases",
    ],
    contentHeading: "Reimagining Customer Engagement",
    contentParagraphs: [
      "Conversational AI transforms how enterprises interact with customers by delivering natural, context-aware experiences across every channel. From intelligent virtual agents to voice-enabled IVR, organizations can resolve routine inquiries instantly while freeing human agents for complex, high-value conversations.",
      "Our approach combines proven dialog design with enterprise-grade NLU, CRM integration, and analytics so every interaction improves over time. Whether you are deflecting tier-1 support tickets or building proactive outreach bots, we help you launch quickly and scale confidently.",
      "Espire partners with leading platforms and cloud providers to deliver secure, compliant conversational experiences that align with your brand voice and operational workflows.",
    ],
    highlights: [
      {
        title: "40% Faster Resolution",
        description: "Reduce average handle time with AI-first routing and self-service that resolves common issues on the first contact.",
      },
      {
        title: "24/7 Availability",
        description: "Serve customers across time zones without overnight staffing gaps or inconsistent after-hours support.",
      },
      {
        title: "Seamless Agent Handoff",
        description: "Transfer full conversation context to live agents when escalation is needed, eliminating repeat questions.",
      },
    ],
  },
  {
    id: "agentic-ai",
    title: "Agentic AI",
    shortDescription: "Autonomous AI agents",
    navIcon: AgenticAIIcon,
    subtitle: "Orchestrate autonomous agents that plan, execute, and adapt multi-step enterprise workflows.",
    features: [
      "Multi-agent collaboration across business systems",
      "Tool use via APIs, MCP, and enterprise connectors",
      "Human-in-the-loop approval gates",
      "Observable agent runs with audit trails",
    ],
    contentHeading: "Autonomous Agents for Enterprise Workflows",
    contentParagraphs: [
      "Agentic AI moves beyond single-turn chatbots to autonomous systems that plan, reason, and execute multi-step tasks across your enterprise stack. Agents can research, call APIs, update records, and coordinate with other agents to complete workflows that previously required manual orchestration.",
      "With human-in-the-loop approval gates, policy enforcement, and full run observability, teams can deploy agent fleets that adapt to changing conditions while staying within compliance boundaries. Every action is logged, traceable, and auditable for regulated environments.",
      "From finance reconciliation to IT service management, agentic workflows unlock productivity gains by handling repetitive multi-system tasks end to end.",
    ],
    highlights: [
      {
        title: "Multi-System Orchestration",
        description: "Connect agents to ERP, CRM, ticketing, and custom APIs through secure enterprise connectors.",
      },
      {
        title: "Governed Autonomy",
        description: "Define approval thresholds, guardrails, and escalation paths before agents act on sensitive data.",
      },
      {
        title: "Measurable ROI",
        description: "Track task completion rates, time saved, and error reduction across every automated workflow.",
      },
    ],
  },
  {
    id: "advanced-nlp",
    title: "Advanced NLP",
    shortDescription: "Language understanding",
    navIcon: AdvancedNLPIcon,
    subtitle: "Extract meaning, classify intent, and generate language with state-of-the-art NLP pipelines.",
    features: [
      "Custom entity recognition and relation extraction",
      "Fine-tuned models for domain-specific language",
      "Multilingual NLP with 100+ languages",
      "Real-time inference at enterprise throughput",
    ],
    contentHeading: "Language Understanding at Scale",
    contentParagraphs: [
      "Advanced NLP unlocks structured insight from unstructured text across contracts, emails, tickets, social feeds, and internal communications. Domain-tuned models extract entities, classify intent, detect sentiment, and summarize lengthy documents at enterprise throughput.",
      "We design pipelines that balance accuracy with latency—whether you need real-time classification on inbound support tickets or batch processing of millions of historical records for analytics and compliance.",
      "Continuous evaluation, drift monitoring, and MLOps practices keep models performing as language and business terminology evolve over time.",
    ],
    highlights: [
      {
        title: "Domain-Specific Models",
        description: "Fine-tune on your industry terminology for higher precision in legal, healthcare, and financial use cases.",
      },
      {
        title: "Multilingual Coverage",
        description: "Process and analyze text in 100+ languages with consistent quality across global operations.",
      },
      {
        title: "Production-Ready MLOps",
        description: "Deploy, monitor, and retrain models with automated evaluation and version control.",
      },
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    shortDescription: "Visual intelligence",
    navIcon: ComputerVisionIcon,
    subtitle: "Detect, classify, and analyze visual data for quality, safety, and operational insights.",
    features: [
      "Object detection and image classification",
      "Video analytics for real-time monitoring",
      "OCR and visual document understanding",
      "Edge deployment for low-latency inference",
    ],
    contentHeading: "Visual Intelligence for Operations",
    contentParagraphs: [
      "Computer vision turns cameras and sensors into actionable business signals—from defect detection on manufacturing lines to real-time safety monitoring, identity verification, and retail shelf analytics.",
      "Our solutions span cloud training and edge inference so you get accurate results where latency, bandwidth, and privacy matter most. Pre-built model templates accelerate time to value while custom training addresses unique visual inspection requirements.",
      "Integrate vision outputs directly into MES, WMS, and operational dashboards so teams act on insights in the moment, not days later.",
    ],
    highlights: [
      {
        title: "Quality Assurance",
        description: "Catch defects early with automated visual inspection that outperforms manual sampling.",
      },
      {
        title: "Safety & Compliance",
        description: "Monitor restricted zones, PPE usage, and hazardous conditions with real-time alerts.",
      },
      {
        title: "Edge + Cloud Flexibility",
        description: "Run inference on-premises or at the edge when data cannot leave the facility.",
      },
    ],
  },
  {
    id: "document-intelligence",
    title: "Document Intelligence",
    shortDescription: "Automated processing",
    navIcon: DocumentIntelligenceIcon,
    subtitle: "Digitize, classify, and extract data from documents with AI-powered understanding.",
    features: [
      "Intelligent OCR for scanned and digital PDFs",
      "Template-free extraction from varied layouts",
      "Document classification and routing",
      "Compliance-ready audit and lineage",
    ],
    contentHeading: "From Documents to Decisions",
    contentParagraphs: [
      "Document intelligence automates the capture, classification, and extraction of data from invoices, contracts, forms, claims, and correspondence. Template-free AI understanding handles varied layouts without brittle rule-based configurations.",
      "Validated extractions flow directly into ERP, CLM, and workflow systems—reducing manual keying, shortening processing cycles, and improving data quality across finance, legal, and operations teams.",
      "Full audit trails and lineage tracking support regulated industries that require proof of how every field was derived and who approved it.",
    ],
    highlights: [
      {
        title: "90% Less Manual Entry",
        description: "Automate data capture from high-volume document streams with human review only for exceptions.",
      },
      {
        title: "Faster Cycle Times",
        description: "Route, classify, and process documents in minutes instead of days.",
      },
      {
        title: "Compliance Ready",
        description: "Maintain complete audit logs and confidence scores for every extracted field.",
      },
    ],
  },
  {
    id: "predictive-analytics",
    title: "Predictive Analytics",
    shortDescription: "Data-driven forecasting",
    navIcon: PredictiveAnalyticsIcon,
    subtitle: "Forecast outcomes and prescribe actions with machine learning on enterprise data.",
    features: [
      "Churn, demand, and risk prediction models",
      "AutoML for rapid model prototyping",
      "Explainable AI for regulated decisions",
      "Embedded analytics in business applications",
    ],
    contentHeading: "Forecast What Matters Next",
    contentParagraphs: [
      "Predictive analytics turns historical and real-time data into forward-looking insight for churn, demand, fraud, credit risk, and asset health. Machine learning models surface patterns humans miss and recommend actions before problems escalate.",
      "We combine AutoML for rapid prototyping with explainable AI techniques so business stakeholders and compliance teams understand why a prediction was made—not just what it is.",
      "Models embed directly into CRM, ERP, and operational dashboards so predictions drive daily decisions rather than sitting in isolated data science notebooks.",
    ],
    highlights: [
      {
        title: "Proactive Retention",
        description: "Identify at-risk customers early and trigger personalized retention campaigns automatically.",
      },
      {
        title: "Demand Planning",
        description: "Forecast inventory and staffing needs with time-series models tuned to seasonality.",
      },
      {
        title: "Explainable Decisions",
        description: "Meet regulatory requirements with feature importance and reason codes for every score.",
      },
    ],
  },
  {
    id: "intelligent-automation",
    title: "Intelligent Automation",
    shortDescription: "Process automation",
    navIcon: IntelligentAutomationIcon,
    subtitle: "Combine RPA, AI, and process mining to automate end-to-end business workflows.",
    features: [
      "Process discovery and bottleneck analysis",
      "Attended and unattended bot orchestration",
      "AI-assisted exception handling",
      "End-to-end SLA monitoring",
    ],
    contentHeading: "End-to-End Process Automation",
    contentParagraphs: [
      "Intelligent automation blends process mining, RPA, and AI to discover bottlenecks and automate entire workflows—not just individual tasks. Start by visualizing how work actually flows, then target the highest-impact opportunities for automation.",
      "From attended bots that assist employees in real time to fully unattended pipelines that run overnight, we help enterprises scale automation with governance, ROI tracking, and AI-assisted exception handling when bots encounter edge cases.",
      "A centralized automation center of excellence ensures bots are maintained, documented, and aligned with security and change management policies.",
    ],
    highlights: [
      {
        title: "Process Discovery",
        description: "Uncover inefficiencies and variants from system event logs before automating.",
      },
      {
        title: "Hyperautomation",
        description: "Combine RPA, APIs, and AI in unified workflows that span multiple applications.",
      },
      {
        title: "Exception Intelligence",
        description: "Use AI to classify and resolve bot failures instead of routing every error to IT.",
      },
    ],
  },
  {
    id: "recommendation-engines",
    title: "Recommendation Engines",
    shortDescription: "Personalization",
    navIcon: RecommendationEnginesIcon,
    subtitle: "Deliver personalized products, content, and offers with real-time recommendation systems.",
    features: [
      "Collaborative and content-based filtering",
      "Real-time personalization at scale",
      "A/B testing and experimentation",
      "Privacy-preserving recommendations",
    ],
    contentHeading: "Personalization That Converts",
    contentParagraphs: [
      "Recommendation engines deliver the right product, content, or offer to each user in real time based on behavior, preferences, and context. Hybrid collaborative and content-based approaches ensure strong performance even for new users and long-tail catalogs.",
      "Built-in experimentation frameworks let you A/B test ranking strategies, measure lift, and roll out improvements safely. Feature stores and model refresh pipelines keep recommendations fresh as inventory, content, and user tastes change.",
      "Privacy-preserving techniques ensure personalization respects consent preferences and regulatory requirements across regions.",
    ],
    highlights: [
      {
        title: "Higher Conversion",
        description: "Increase average order value and click-through with context-aware product and content ranking.",
      },
      {
        title: "Real-Time Personalization",
        description: "Serve recommendations in milliseconds using low-latency feature pipelines.",
      },
      {
        title: "Continuous Optimization",
        description: "Run experiments and shadow tests to validate model updates before full rollout.",
      },
    ],
  },
  {
    id: "multi-language-ai",
    title: "Multi-language AI",
    shortDescription: "Cross-language support",
    navIcon: MultiLanguageAIIcon,
    subtitle: "Break language barriers with translation, localization, and multilingual AI experiences.",
    features: [
      "Neural machine translation for 100+ languages",
      "Locale-aware content generation",
      "Multilingual chatbots and voice",
      "Quality estimation and human review loops",
    ],
    contentHeading: "AI Without Language Barriers",
    contentParagraphs: [
      "Multi-language AI enables global enterprises to serve customers and employees in their preferred language without maintaining separate systems per locale. Neural machine translation, locale-aware content generation, and multilingual bots work together as a cohesive stack.",
      "Quality estimation and human review loops ensure translations meet brand and regulatory standards before they reach end users. Glossaries and style guides are enforced automatically across documents, UI strings, and conversational flows.",
      "Cross-lingual search lets users query in one language and retrieve relevant content authored in another—breaking down knowledge silos across international teams.",
    ],
    highlights: [
      {
        title: "100+ Languages",
        description: "Translate and localize content at scale with enterprise-grade neural MT pipelines.",
      },
      {
        title: "Unified Bot Experiences",
        description: "Deploy a single conversational flow with automatic language detection and switching.",
      },
      {
        title: "Localization QA",
        description: "Automate linguistic checks and glossary compliance before content goes live.",
      },
    ],
  },
  {
    id: "knowledge-assistants",
    title: "Knowledge Assistants",
    shortDescription: "Knowledge management",
    navIcon: KnowledgeAssistantsIcon,
    subtitle: "Empower teams with AI assistants grounded in your enterprise knowledge.",
    features: [
      "RAG over SharePoint, Confluence, and wikis",
      "Citation-backed answers for trust",
      "Role-based knowledge access",
      "Continuous ingestion from source systems",
    ],
    contentHeading: "Your Knowledge, Instantly Accessible",
    contentParagraphs: [
      "Knowledge assistants put enterprise expertise at everyone's fingertips using retrieval-augmented generation over wikis, policies, tickets, product docs, and internal repositories. Answers are grounded in your data—not generic model knowledge—and include citations for verification.",
      "Role-based access ensures employees only see information they are authorized to view. Continuous ingestion pipelines keep assistants current as source systems update, so answers reflect the latest policies and procedures.",
      "From HR onboarding to technical support copilots, knowledge assistants reduce time spent searching and improve consistency of responses across teams and regions.",
    ],
    highlights: [
      {
        title: "Citation-Backed Answers",
        description: "Every response links to source documents so users can verify and dive deeper.",
      },
      {
        title: "Secure by Design",
        description: "Respect existing permissions from SharePoint, Confluence, and ticketing systems.",
      },
      {
        title: "Always Up to Date",
        description: "Sync knowledge bases automatically as content changes in source systems.",
      },
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    shortDescription: "Content generation",
    navIcon: GenerativeAIIcon,
    subtitle: "Create text, images, and code with enterprise-grade generative AI platforms.",
    features: [
      "Prompt engineering and template libraries",
      "Brand-safe content generation",
      "Code copilots for developers",
      "Content moderation and safety filters",
    ],
    contentHeading: "Enterprise-Grade Content Creation",
    contentParagraphs: [
      "Generative AI accelerates marketing copy, code, images, and design exploration while keeping brand voice and safety guardrails in place. Prompt libraries and templates help teams produce consistent, on-brand content without starting from scratch every time.",
      "Centralized GenAI gateways provide logging, moderation, cost controls, and model routing so IT can govern usage while business teams innovate. Code copilots integrate into existing IDEs with repo-aware context for faster, safer development.",
      "Content moderation and safety filters screen outputs before they reach customers or public channels, reducing brand and compliance risk.",
    ],
    highlights: [
      {
        title: "Brand-Safe Generation",
        description: "Enforce tone, terminology, and style guidelines through templates and guardrails.",
      },
      {
        title: "Developer Productivity",
        description: "Accelerate coding with context-aware copilots trained on your repositories and standards.",
      },
      {
        title: "Governed Access",
        description: "Centralize API keys, usage tracking, and policy enforcement across all GenAI tools.",
      },
    ],
  },
  {
    id: "enterprise-search",
    title: "Enterprise Search",
    shortDescription: "Intelligent search",
    navIcon: EnterpriseSearchIcon,
    subtitle: "Unified, intelligent search across applications, documents, and data silos.",
    features: [
      "Semantic and keyword hybrid retrieval",
      "Federated search across SaaS and on-prem",
      "Personalized ranking and facets",
      "Security-trimmed results per user",
    ],
    contentHeading: "Find Anything, Instantly",
    contentParagraphs: [
      "Enterprise search unifies discovery across applications, documents, and data silos with semantic and keyword hybrid retrieval. Employees get a single search experience instead of hunting through dozens of disconnected systems.",
      "Personalized ranking and facets surface the most relevant results for each user based on role, history, and context. Security trimming ensures users only see content they are permitted to access—enforced at query time, not as an afterthought.",
      "Search analytics reveal zero-result queries, content gaps, and tuning opportunities so your knowledge base improves continuously over time.",
    ],
    highlights: [
      {
        title: "Unified Discovery",
        description: "Search across M365, SAP, file shares, and SaaS apps from one intelligent portal.",
      },
      {
        title: "Semantic Understanding",
        description: "Find relevant results even when query wording does not match document text exactly.",
      },
      {
        title: "Access-Aware Results",
        description: "Honor ACLs and permissions so search never exposes restricted information.",
      },
    ],
  },
];

export const homeCapabilities = aiCapabilitiesData.map(
  ({ id, title, shortDescription, navIcon }) => ({
    id,
    title,
    description: shortDescription,
    icon: navIcon,
  }),
);

export const getCapabilityIndexById = (capabilityId) => {
  const index = aiCapabilitiesData.findIndex((item) => item.id === capabilityId);
  return index >= 0 ? index : 0;
};

export const getCapabilityById = (capabilityId) =>
  aiCapabilitiesData[getCapabilityIndexById(capabilityId)];
