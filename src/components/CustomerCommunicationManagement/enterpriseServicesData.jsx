import {
  GlobeIcon,
  RefreshIcon,
  BrainIcon,
  ZapIcon,
  ShieldIcon,
  ChartIcon,
} from "./CapabilityIcons";
import {
  MessageSquareIcon,
  SmileIcon,
  SparklesIcon,
  CpuIcon,
  DatabaseIcon,
  BotIcon,
} from "./ServiceNavIcons";

const coe = {
  sarah: { name: "Dr. Sarah Chen", title: "Chief AI Officer", color: "teal" },
  michael: {
    name: "Michael Rodriguez",
    title: "VP of Engineering",
    color: "navy",
  },
  maria: { name: "Maria Garcia", title: "AI Ethics Lead", color: "orange" },
  priya: { name: "Priya Patel", title: "Director of Research", color: "sky" },
  robert: { name: "Robert Kim", title: "Senior Engineer", color: "orange" },
  tom: { name: "Tom Morrison", title: "Innovation Director", color: "navy" },
};

export const enterpriseServicesSource = [
  {
    id: "customer-communication-management",
    label: "Customer Communication Management",
    navIcon: MessageSquareIcon,
    subtitle:
      "Intelligent, omnichannel communication delivered at enterprise scale.",
    features: [
      "Unify communications across email, SMS, print, and web",
      "Migrate seamlessly from legacy CCM platforms",
      "AI-generated, personalized content at millions-scale",
      "Full compliance with GDPR, HIPAA, and FINRA",
    ],
    capabilities: [
      {
        title: "Omnichannel Document Management",
        icon: GlobeIcon,
        description:
          "Generate, manage, and deliver personalized documents across every customer touchpoint.",
        techStack: [
          { name: "OpenText Exstream", label: "CCM Platform" },
          { name: "AWS SES", label: "Delivery" },
          { name: "Salesforce", label: "CRM Integration" },
        ],
        coe: coe.sarah,
        evangelists: [coe.maria, coe.tom],
      },
      {
        title: "Legacy CCM Migration",
        icon: RefreshIcon,
        description:
          "Accelerate migration from legacy platforms with automated content transformation and validation.",
        techStack: [
          { name: "IBM FileNet", label: "Legacy Source" },
          { name: "Azure APIM", label: "API Gateway" },
          { name: "Informatica", label: "ETL Pipeline" },
        ],
        coe: coe.michael,
        evangelists: [coe.priya],
      },
      {
        title: "AI-Driven Content Intelligence",
        icon: BrainIcon,
        description:
          "Leverage LLMs to auto-generate, personalize, and optimize customer communications at scale.",
        techStack: [
          { name: "Azure OpenAI", label: "LLM" },
          { name: "Python FastAPI", label: "Backend" },
          { name: "LangChain", label: "Orchestration" },
        ],
        coe: coe.sarah,
        evangelists: [coe.robert],
      },
      {
        title: "Real-Time Journey Orchestration",
        icon: ZapIcon,
        description:
          "Trigger personalized communications based on real-time customer events and behavioral signals.",
        techStack: [
          { name: "Twilio", label: "SMS Gateway" },
          { name: "Apigee", label: "API Gateway" },
          { name: "MuleSoft", label: "Integration" },
        ],
        coe: coe.maria,
        evangelists: [coe.tom],
      },
      {
        title: "Compliance & Audit Automation",
        icon: ShieldIcon,
        description:
          "Automated compliance checks, audit trails, and regulatory reporting for all communications.",
        techStack: [
          { name: "OneTrust", label: "GDPR" },
          { name: "Actimize", label: "FINRA" },
          { name: "Azure Monitor", label: "Audit Logs" },
        ],
        coe: coe.michael,
        evangelists: [coe.priya, coe.robert],
      },
      {
        title: "Predictive Engagement Analytics",
        icon: ChartIcon,
        description:
          "Analyze engagement patterns and predict optimal communication timing across all channels.",
        techStack: [
          { name: "Databricks", label: "Analytics" },
          { name: "Power BI", label: "Dashboards" },
          { name: "Snowflake", label: "Data Warehouse" },
        ],
        coe: coe.sarah,
        evangelists: [coe.maria],
      },
    ],
  },
  {
    id: "enterprise-application",
    label: "Enterprise Application",
    navIcon: SmileIcon,
    subtitle:
      "Deliver hyper-personalized customer journeys powered by AI across every CRM touchpoint.",
    features: [
      "360° customer view with real-time AI insights",
      "Intelligent case routing and sentiment analysis",
      "Automated next-best-action recommendations",
      "Seamless integration with Salesforce and Dynamics 365",
    ],
    capabilities: [
      {
        title: "AI-Powered Customer Insights",
        icon: BrainIcon,
        description:
          "Surface predictive customer behavior and churn risk from unified CRM data lakes.",
        techStack: [
          { name: "Salesforce Einstein", label: "CRM AI" },
          { name: "Snowflake", label: "Data Cloud" },
          { name: "Tableau", label: "Visualization" },
        ],
        coe: coe.maria,
        evangelists: [coe.sarah, coe.priya],
      },
      {
        title: "Omnichannel Service Hub",
        icon: GlobeIcon,
        description:
          "Connect voice, chat, email, and social channels into a single agent workspace.",
        techStack: [
          { name: "Genesys", label: "Contact Center" },
          { name: "Zendesk", label: "Ticketing" },
          { name: "AWS Connect", label: "Voice" },
        ],
        coe: coe.michael,
        evangelists: [coe.tom],
      },
      {
        title: "Loyalty & Retention Engine",
        icon: ChartIcon,
        description:
          "Build AI-driven loyalty programs with personalized offers and reward optimization.",
        techStack: [
          { name: "Adobe Target", label: "Personalization" },
          { name: "Segment", label: "CDP" },
          { name: "HubSpot", label: "Marketing" },
        ],
        coe: coe.sarah,
        evangelists: [coe.maria],
      },
      {
        title: "Voice of Customer Analytics",
        icon: ZapIcon,
        description:
          "Extract themes and sentiment from surveys, calls, and reviews using NLP pipelines.",
        techStack: [
          { name: "Azure OpenAI", label: "NLP" },
          { name: "Qualtrics", label: "Surveys" },
          { name: "Databricks", label: "Analytics" },
        ],
        coe: coe.priya,
        evangelists: [coe.robert],
      },
      {
        title: "CRM Data Modernization",
        icon: RefreshIcon,
        description:
          "Consolidate fragmented CRM instances with automated deduplication and enrichment.",
        techStack: [
          { name: "Informatica", label: "MDM" },
          { name: "MuleSoft", label: "Integration" },
          { name: "Azure Data Factory", label: "ETL" },
        ],
        coe: coe.michael,
        evangelists: [coe.priya],
      },
      {
        title: "Privacy-First CX Compliance",
        icon: ShieldIcon,
        description:
          "Enforce consent management and data residency rules across all customer interactions.",
        techStack: [
          { name: "OneTrust", label: "Consent" },
          { name: "Salesforce", label: "CRM" },
          { name: "Privacera", label: "Governance" },
        ],
        coe: coe.maria,
        evangelists: [coe.sarah],
      },
    ],
  },
  {
    id: "digital-experience",
    label: "Digital Experience",
    navIcon: SparklesIcon,
    subtitle:
      "Create immersive, AI-enhanced digital experiences that convert and delight users.",
    features: [
      "Composable experience platforms at enterprise scale",
      "AI-driven content personalization in real time",
      "Headless CMS with multi-channel delivery",
      "Performance-optimized progressive web applications",
    ],
    capabilities: [
      {
        title: "Composable Experience Platform",
        icon: GlobeIcon,
        description:
          "Build modular digital experiences with API-first architecture and micro-frontends.",
        techStack: [
          { name: "Contentful", label: "Headless CMS" },
          { name: "Next.js", label: "Frontend" },
          { name: "Vercel", label: "Edge Delivery" },
        ],
        coe: coe.tom,
        evangelists: [coe.robert, coe.maria],
      },
      {
        title: "AI Content Personalization",
        icon: BrainIcon,
        description:
          "Dynamically adapt page content, layouts, and CTAs based on visitor intent signals.",
        techStack: [
          { name: "Adobe AEM", label: "CMS" },
          { name: "Optimizely", label: "A/B Testing" },
          { name: "Azure OpenAI", label: "Content AI" },
        ],
        coe: coe.sarah,
        evangelists: [coe.priya],
      },
      {
        title: "Design System Acceleration",
        icon: SparklesIcon,
        description:
          "Deploy enterprise design systems with AI-assisted component generation and documentation.",
        techStack: [
          { name: "Figma", label: "Design" },
          { name: "Storybook", label: "Components" },
          { name: "React", label: "UI Library" },
        ],
        coe: coe.michael,
        evangelists: [coe.tom],
      },
      {
        title: "Digital Accessibility Suite",
        icon: ShieldIcon,
        description:
          "Automated WCAG compliance scanning and remediation across all digital properties.",
        techStack: [
          { name: "axe DevTools", label: "Auditing" },
          { name: "Siteimprove", label: "Monitoring" },
          { name: "Pa11y", label: "Automation" },
        ],
        coe: coe.maria,
        evangelists: [coe.sarah],
      },
      {
        title: "Experience Analytics",
        icon: ChartIcon,
        description:
          "Track user journeys, funnel drop-offs, and conversion drivers with AI anomaly detection.",
        techStack: [
          { name: "Google Analytics 4", label: "Web Analytics" },
          { name: "Hotjar", label: "Heatmaps" },
          { name: "Amplitude", label: "Product Analytics" },
        ],
        coe: coe.priya,
        evangelists: [coe.robert],
      },
      {
        title: "Legacy Portal Migration",
        icon: RefreshIcon,
        description:
          "Modernize outdated portals to cloud-native architectures with zero-downtime cutover.",
        techStack: [
          { name: "SharePoint", label: "Legacy Portal" },
          { name: "Azure", label: "Cloud" },
          { name: "Kubernetes", label: "Orchestration" },
        ],
        coe: coe.michael,
        evangelists: [coe.tom],
      },
    ],
  },
  {
    id: "digital-engineering",
    label: "Digital Engineering",
    navIcon: CpuIcon,
    subtitle:
      "Build resilient, cloud-native platforms with AI-accelerated software engineering practices.",
    features: [
      "DevSecOps pipelines with AI code assistance",
      "Microservices and API-first architecture",
      "Quality engineering with intelligent test automation",
      "Platform engineering and internal developer portals",
    ],
    capabilities: [
      {
        title: "AI-Assisted Development",
        icon: BrainIcon,
        description:
          "Accelerate delivery with copilot integrations, code review bots, and automated documentation.",
        techStack: [
          { name: "GitHub Copilot", label: "Code AI" },
          { name: "SonarQube", label: "Code Quality" },
          { name: "GitLab", label: "DevOps" },
        ],
        coe: coe.robert,
        evangelists: [coe.michael, coe.sarah],
      },
      {
        title: "Cloud-Native Platform Engineering",
        icon: CpuIcon,
        description:
          "Golden-path developer portals with self-service infrastructure and paved roads.",
        techStack: [
          { name: "Backstage", label: "Developer Portal" },
          { name: "Kubernetes", label: "Orchestration" },
          { name: "ArgoCD", label: "GitOps" },
        ],
        coe: coe.michael,
        evangelists: [coe.robert],
      },
      {
        title: "API Management & Integration",
        icon: GlobeIcon,
        description:
          "Design, secure, and monetize APIs with full lifecycle governance and analytics.",
        techStack: [
          { name: "Apigee", label: "API Gateway" },
          { name: "MuleSoft", label: "Integration" },
          { name: "Postman", label: "API Design" },
        ],
        coe: coe.tom,
        evangelists: [coe.priya],
      },
      {
        title: "Intelligent Test Automation",
        icon: ZapIcon,
        description:
          "AI-generated test cases, self-healing scripts, and continuous quality gates in CI/CD.",
        techStack: [
          { name: "Selenium", label: "UI Testing" },
          { name: "k6", label: "Load Testing" },
          { name: "Testim", label: "AI Testing" },
        ],
        coe: coe.priya,
        evangelists: [coe.robert],
      },
      {
        title: "DevSecOps Pipeline",
        icon: ShieldIcon,
        description:
          "Shift-left security with SAST, DAST, SCA, and policy-as-code in every deployment.",
        techStack: [
          { name: "Snyk", label: "Security" },
          { name: "HashiCorp Vault", label: "Secrets" },
          { name: "Jenkins", label: "CI/CD" },
        ],
        coe: coe.michael,
        evangelists: [coe.tom],
      },
      {
        title: "Observability Platform",
        icon: ChartIcon,
        description:
          "Unified logging, metrics, and tracing with AI-powered incident detection and root cause analysis.",
        techStack: [
          { name: "Datadog", label: "APM" },
          { name: "Grafana", label: "Dashboards" },
          { name: "OpenTelemetry", label: "Tracing" },
        ],
        coe: coe.robert,
        evangelists: [coe.maria],
      },
    ],
  },
  {
    id: "data-management",
    label: "Data Management",
    navIcon: DatabaseIcon,
    subtitle:
      "Unlock enterprise data value with AI-powered governance, integration, and analytics platforms.",
    features: [
      "Unified data mesh and fabric architectures",
      "Real-time data pipelines and streaming analytics",
      "Master data management with AI enrichment",
      "Enterprise-grade data governance and lineage",
    ],
    capabilities: [
      {
        title: "Data Lakehouse Platform",
        icon: DatabaseIcon,
        description:
          "Consolidate structured and unstructured data on a scalable lakehouse with open formats.",
        techStack: [
          { name: "Databricks", label: "Lakehouse" },
          { name: "Delta Lake", label: "Storage" },
          { name: "Apache Spark", label: "Processing" },
        ],
        coe: coe.priya,
        evangelists: [coe.sarah, coe.robert],
      },
      {
        title: "Real-Time Data Streaming",
        icon: ZapIcon,
        description:
          "Ingest and process high-volume event streams for operational and analytical workloads.",
        techStack: [
          { name: "Apache Kafka", label: "Streaming" },
          { name: "Flink", label: "Processing" },
          { name: "Confluent", label: "Platform" },
        ],
        coe: coe.michael,
        evangelists: [coe.tom],
      },
      {
        title: "Master Data Management",
        icon: RefreshIcon,
        description:
          "Create golden records with AI-powered matching, deduplication, and enrichment.",
        techStack: [
          { name: "Informatica MDM", label: "MDM" },
          { name: "Collibra", label: "Governance" },
          { name: "Talend", label: "Integration" },
        ],
        coe: coe.priya,
        evangelists: [coe.maria],
      },
      {
        title: "Data Governance & Lineage",
        icon: ShieldIcon,
        description:
          "Automated cataloging, classification, and policy enforcement across the data estate.",
        techStack: [
          { name: "Alation", label: "Catalog" },
          { name: "Privacera", label: "Access Control" },
          { name: "Apache Atlas", label: "Lineage" },
        ],
        coe: coe.maria,
        evangelists: [coe.priya],
      },
      {
        title: "AI-Ready Data Pipelines",
        icon: BrainIcon,
        description:
          "Feature stores and vector databases optimized for ML and generative AI workloads.",
        techStack: [
          { name: "Snowflake", label: "Warehouse" },
          { name: "Pinecone", label: "Vector DB" },
          { name: "dbt", label: "Transformation" },
        ],
        coe: coe.sarah,
        evangelists: [coe.robert],
      },
      {
        title: "Enterprise BI & Analytics",
        icon: ChartIcon,
        description:
          "Self-service analytics with AI-generated insights and natural language query interfaces.",
        techStack: [
          { name: "Power BI", label: "BI" },
          { name: "Tableau", label: "Visualization" },
          { name: "Azure Synapse", label: "Analytics" },
        ],
        coe: coe.priya,
        evangelists: [coe.sarah],
      },
    ],
  },
  {
    id: "agentic-automation",
    label: "Agentic Automation",
    navIcon: BotIcon,
    subtitle:
      "Deploy autonomous AI agents that orchestrate complex workflows across your enterprise.",
    features: [
      "Multi-agent systems for end-to-end process automation",
      "Human-in-the-loop governance and oversight",
      "Integration with enterprise systems via MCP and APIs",
      "Continuous learning from operational feedback loops",
    ],
    capabilities: [
      {
        title: "Autonomous Process Agents",
        icon: BotIcon,
        description:
          "Deploy AI agents that plan, execute, and adapt multi-step business processes autonomously.",
        techStack: [
          { name: "LangGraph", label: "Agent Framework" },
          { name: "Azure OpenAI", label: "LLM" },
          { name: "Celery", label: "Task Queue" },
        ],
        coe: coe.sarah,
        evangelists: [coe.robert, coe.tom],
      },
      {
        title: "Enterprise Agent Orchestration",
        icon: ZapIcon,
        description:
          "Coordinate specialized agents across departments with shared memory and tool registries.",
        techStack: [
          { name: "CrewAI", label: "Multi-Agent" },
          { name: "Redis", label: "Memory Store" },
          { name: "FastAPI", label: "API Layer" },
        ],
        coe: coe.michael,
        evangelists: [coe.priya],
      },
      {
        title: "RPA + AI Hybrid Automation",
        icon: RefreshIcon,
        description:
          "Combine traditional RPA bots with LLM agents for intelligent document and workflow handling.",
        techStack: [
          { name: "UiPath", label: "RPA" },
          { name: "Microsoft Power Automate", label: "Workflow" },
          { name: "Azure AI", label: "Cognitive Services" },
        ],
        coe: coe.tom,
        evangelists: [coe.maria],
      },
      {
        title: "Agent Safety & Governance",
        icon: ShieldIcon,
        description:
          "Guardrails, audit trails, and policy engines to ensure responsible autonomous operations.",
        techStack: [
          { name: "Guardrails AI", label: "Safety" },
          { name: "LangSmith", label: "Observability" },
          { name: "OpenPolicy Agent", label: "Policy" },
        ],
        coe: coe.maria,
        evangelists: [coe.sarah],
      },
      {
        title: "MCP Tool Integration",
        icon: GlobeIcon,
        description:
          "Connect agents to enterprise systems through Model Context Protocol servers and APIs.",
        techStack: [
          { name: "MCP SDK", label: "Protocol" },
          { name: "Apigee", label: "API Gateway" },
          { name: "Salesforce", label: "CRM" },
        ],
        coe: coe.robert,
        evangelists: [coe.michael],
      },
      {
        title: "Agent Performance Analytics",
        icon: ChartIcon,
        description:
          "Monitor agent success rates, latency, cost, and human escalation patterns in real time.",
        techStack: [
          { name: "Datadog", label: "Monitoring" },
          { name: "Langfuse", label: "LLM Ops" },
          { name: "Grafana", label: "Dashboards" },
        ],
        coe: coe.priya,
        evangelists: [coe.robert],
      },
    ],
  },
];

const ENTERPRISE_SERVICE_ORDER = [
  "digital-engineering",
  "digital-experience",
  "customer-communication-management",
  "agentic-automation",
  "data-management",
  "enterprise-application",
];

export const ENTERPRISE_SERVICE_ID_ALIASES = {
  "customer-experience-crm": "enterprise-application",
};

export const normalizeEnterpriseServiceId = (serviceId = "") =>
  ENTERPRISE_SERVICE_ID_ALIASES[serviceId] || serviceId;

export const enterpriseServicesData = ENTERPRISE_SERVICE_ORDER.map((id) =>
  enterpriseServicesSource.find((service) => service.id === id),
).filter(Boolean);

export const getEnterpriseServiceIndexById = (serviceId) => {
  const normalizedId = normalizeEnterpriseServiceId(serviceId);
  const index = enterpriseServicesData.findIndex(
    (service) => service.id === normalizedId,
  );
  return index >= 0 ? index : 0;
};

export const getEnterpriseServiceById = (serviceId) =>
  enterpriseServicesData[getEnterpriseServiceIndexById(serviceId)];
