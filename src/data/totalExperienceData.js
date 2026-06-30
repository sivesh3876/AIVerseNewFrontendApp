export const CUSTOMER_EXPERIENCE_ROUTE = "/customer-experience";
export const EMPLOYEE_EXPERIENCE_ROUTE = "/employee-experience";
export const BUSINESS_EXPERIENCE_ROUTE = "/business-experience";
export const TOTAL_EXPERIENCE_DETAIL_ROUTE = "/total-experience";

/** @deprecated Use CUSTOMER_EXPERIENCE_ROUTE */
export const TOTAL_EXPERIENCE_ROUTE = CUSTOMER_EXPERIENCE_ROUTE;

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
    detailPath: CUSTOMER_EXPERIENCE_ROUTE,
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
    detailPath: EMPLOYEE_EXPERIENCE_ROUTE,
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
    detailPath: BUSINESS_EXPERIENCE_ROUTE,
  },
];

export const totalExperienceResultPillar = {
  id: "tx",
  code: "TX",
  title: "Total Experience",
  color: "#84cc16",
  highlights: ["Happy Customer - endless experience"],
  detailPath: TOTAL_EXPERIENCE_DETAIL_ROUTE,
  isResult: true,
};

export const totalExperienceFoundations = [
  {
    id: "azure",
    label: "Azure",
    pillarId: "bx",
    detailPath: BUSINESS_EXPERIENCE_ROUTE,
  },
  {
    id: "open-ai",
    label: "Open AI",
    pillarId: "cx",
    detailPath: CUSTOMER_EXPERIENCE_ROUTE,
  },
  {
    id: "claude",
    label: "Claude",
    pillarId: "ex",
    detailPath: EMPLOYEE_EXPERIENCE_ROUTE,
  },
  {
    id: "cursor",
    label: "Cursor",
    pillarId: "tx",
    detailPath: TOTAL_EXPERIENCE_DETAIL_ROUTE,
  },
];

export const totalExperiencePillars = [
  ...totalExperienceInputPillars,
  totalExperienceResultPillar,
];
