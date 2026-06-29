export const TOTAL_EXPERIENCE_ROUTE = "/customer-experience";

export const totalExperienceFrameworkMeta = {
  title: "Espire - Total Experience Framework",
  subtitle:
    "Unified AI-powered pillars that converge into a single seamless experience",
  foundationLabel: "AI Foundation:",
};

export const totalExperienceInputPillars = [
  {
    id: "cx",
    code: "CX",
    title: "Customer Experience",
    color: "#4D90E3",
    highlights: [
      "Brand Building & AI Content",
      "Campaign & e-commerce AI",
      "Predictive CX Insights",
    ],
    detailPath: TOTAL_EXPERIENCE_ROUTE,
  },
  {
    id: "ex",
    code: "EX",
    title: "Employee Experience",
    color: "#18E0CC",
    highlights: [
      "AI Co-pilots & Collaboration",
      "Employee Content Management",
      "Intelligent Automation",
    ],
    detailPath: null,
  },
  {
    id: "bx",
    code: "BX",
    title: "Business Experience",
    color: "#0f6b7a",
    highlights: [
      "AI-Gen-AI Automation",
      "Industry ERP + Agentic AI",
      "Business Intelligence & Reporting",
    ],
    detailPath: null,
  },
];

export const totalExperienceResultPillar = {
  id: "tx",
  code: "TX",
  title: "Total Experience",
  color: "#84cc16",
  highlights: ["Happy Customer - endless experience"],
  detailPath: null,
  isResult: true,
};

export const totalExperienceFoundations = [
  "Enterprise-Wide Integration",
  "Data & Analytics",
  "Generative AI",
  "Scalability",
  "Security & Governance",
];

// Backward-compatible export for any existing imports
export const totalExperiencePillars = [
  ...totalExperienceInputPillars,
  totalExperienceResultPillar,
];
