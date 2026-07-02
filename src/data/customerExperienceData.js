export const customerExperienceMeta = {
  pageTitle:
    "Customer Experience - Espire AI Support Across the Customer Lifecycle",
  heroSubtitle:
    "From generic interactions to hyper-personalized, predictive customer journeys - powered by Agentic AI & Gen AI, at every phase.",
  intro:
    "Modern CX demands enterprise-scale agility combined with surgical personalization. Espire AI bridges the gap between massive data silos and individual customer needs, turning every interaction into a moment of value.",
};

// Card titles for linked solutions are loaded from the API by solutionId (Excel ID).
// Only solutionId stays fixed here — if the title changes in Excel/edit, the card updates automatically.
export const customerJourneyStages = [
  {
    id: "awareness",
    label: "AWARENESS",
    headerColor: "#0d3b6e",
    stageDescription:
      "Delivers intuitive, personalized, and responsive digital experiences that create a strong first impression, increasing customer engagement and brand perception.",
    cards: [
      {
        id: "gen-ai-content",
        icon: "sparkle",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "AI assists business users in creating compelling marketing content, campaigns, blogs, emails, and social media posts, helping attract and engage potential customers.",
        solutionId: 28,
      },
    ],
  },
  {
    id: "consideration",
    label: "CONSIDERATION",
    headerColor: "#2563eb",
    stageDescription:
      "Enables rapid creation of interactive prototypes, helping customers visualize solutions early, validate requirements quickly, and make informed decisions with confidence.",
    cards: [
      {
        id: "document-translation-workflow",
        icon: "journey",
        cardBg: "#eef4ff",
        iconBg: "#dbeafe",
        iconColor: "#2563eb",
        description:
          "Enables customers to access product information, proposals, brochures, and technical documents in their preferred language, improving understanding and confidence during evaluation.",
        solutionId: 70,
      },
    ],
  },
  {
    id: "purchase",
    label: "PURCHASE",
    headerColor: "#0f766e",
    stageDescription:
      "Streamlines the buying journey through intuitive interfaces and faster solution validation, reducing decision cycles and improving conversion rates.",
    cards: [
      {
        id: "purchase-document-translation",
        icon: "journey",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "Accelerates contract, quotation, and compliance document translation, reducing turnaround time and enabling faster purchasing decisions across global markets.",
        solutionId: 70,
      },
      {
        id: "purchase-content-assist",
        icon: "sparkle",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "Creates quotations, business communications, and customer responses that speed up decision-making and improve the buying experience.",
        solutionId: 28,
      },
      {
        id: "purchase-inspera-crm",
        icon: "chart",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "Inspera is a lightweight CRM and commercial operations platform designed to give organisations a single, structured workspace for managing the full customer engagement lifecycle. It brings together lead capture, customer and contact management, opportunity tracking, quotation creation, approval governance, task follow-up, commercial handover and reporting into one connected solution.",
        solutionId: 60,
      },
    ],
  },
  {
    id: "service",
    label: "SERVICE",
    headerColor: "#16a34a",
    stageDescription:
      "Continuously enhances application performance, security, scalability, and reliability, ensuring seamless service delivery, reduced downtime, and superior customer satisfaction.",
    cards: [
      {
        id: "pii-remediation",
        icon: "heart",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "Automatically detects, masks, or removes Personally Identifiable Information (PII) from customer communications and documents, ensuring secure, compliant, and privacy-focused service delivery.",
        solutionId: 27,
      },
      {
        id: "nova-astra-migration",
        icon: "journey",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "AI accelerates migration of customer communication templates from SmartComm to Quadient, ensuring faster modernization, minimal business disruption, and consistent customer communications.",
        solutionId: 33,
      },
      {
        id: "ccm-content-rationalization",
        icon: "sparkle",
        cardBg: "#e8f8f2",
        iconBg: "#d1fae5",
        iconColor: "#166534",
        description:
          "AI analyzes, consolidates, and optimizes customer communication content by eliminating duplicates, standardizing templates, and improving consistency. This enables accurate, personalized, and compliant communications across all customer touchpoints.",
        solutionId: 29,
      },
    ],
  },
  {
    id: "loyalty",
    label: "LOYALTY",
    headerColor: "#166534",
    stageDescription:
      "Provides consistent, secure, and high-performing applications while continuously enhancing user experience, driving customer trust, retention, and long-term loyalty.",
    cards: [
      {
        id: "predictive-insights",
        icon: "chart",
        cardBg: "#eef4ff",
        iconBg: "#dbeafe",
        iconColor: "#2563eb",
        title: "Predictive Customer Insights",
        description:
          "Predictive customer insights help organizations anticipate customer needs, reduce churn, and take proactive actions before issues arise.",
        metric: "28% churn reduction",
        metricColor: "#2563eb",
      },
    ],
  },
];
