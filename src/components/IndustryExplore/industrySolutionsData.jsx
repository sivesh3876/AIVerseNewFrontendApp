import educationImage from "../../assets/images/industries01.svg";
import insuranceImage from "../../assets/images/industries03.svg";
import logisticsImage from "../../assets/images/industries04.svg";
import {
  EducationIcon,
  InsuranceIcon,
  LogisticsIcon,
} from "../IndustrySpecificAISolutions/IndustryIcons";

export const industrySolutionsData = [
  {
    id: "education",
    title: "Education",
    domainCode: "Education",
    shortDescription: "AI for learning and administration",
    icon: EducationIcon,
    iconBg: "#4D90E3",
    accentColor: "#4D90E3",
    image: educationImage,
    features: [
      "Student Success AI",
      "Administrative Automation",
      "Personalized Learning",
      "Virtual Assistants",
    ],
    metric: "30% Improved Engagement",
    subtitle:
      "Transforming learning experiences at every level.",
    contentHeading: "Smarter Campuses, Better Outcomes",
    contentParagraphs: [
      "Educational institutions face growing pressure to improve student outcomes while managing complex administrative workloads. AI Verse education solutions help universities, K-12 districts, and ed-tech providers personalize learning paths, automate routine tasks, and support students before challenges escalate.",
      "From intelligent tutoring and adaptive coursework to enrollment chatbots and financial aid assistants, our solutions integrate with LMS platforms, SIS systems, and student portals already in use across your campus.",
      "We design with accessibility, data privacy, and FERPA compliance in mind so institutions can innovate responsibly while protecting student information.",
    ],
    highlights: [
      {
        title: "Personalized Learning",
        description:
          "Adaptive content recommendations and AI tutors tailored to each student's pace and learning style.",
      },
      {
        title: "Administrative Efficiency",
        description:
          "Automate admissions inquiries, scheduling, and document processing to free staff for high-touch support.",
      },
      {
        title: "Early Intervention",
        description:
          "Identify at-risk students with predictive models and trigger timely advisor outreach.",
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    domainCode: "Insurance",
    shortDescription: "AI for underwriting and claims",
    icon: InsuranceIcon,
    iconBg: "#EF8E29",
    accentColor: "#EF8E29",
    image: insuranceImage,
    features: [
      "Claims Automation",
      "Underwriting Intelligence",
      "Policy Servicing AI",
      "Fraud Detection",
    ],
    metric: "40% Faster Claims Processing",
    subtitle:
      "Modernize underwriting, claims, and customer service with secure AI built for insurers and MGAs.",
    contentHeading: "Intelligent Insurance Operations",
    contentParagraphs: [
      "Insurance carriers and MGAs need AI that accelerates policy lifecycle workflows while maintaining strict compliance and auditability. AI Verse insurance solutions automate document intake, claims triage, and customer communications across broker, policyholder, and internal channels.",
      "From FNOL chatbots and claims document extraction to underwriting risk scoring and policy renewal assistants, our solutions integrate with core policy admin, CRM, and document management platforms.",
      "Every deployment is designed with regulatory governance, explainability, and human review gates for high-risk decisions.",
    ],
    highlights: [
      {
        title: "Claims Acceleration",
        description:
          "Automate FNOL, document classification, and adjuster routing to reduce cycle times.",
      },
      {
        title: "Smarter Underwriting",
        description:
          "Surface risk signals from submissions and third-party data with explainable scoring.",
      },
      {
        title: "Policyholder Experience",
        description:
          "24/7 self-service for quotes, endorsements, and status updates across digital channels.",
      },
    ],
  },
  {
    id: "logistics",
    title: "Logistics",
    domainCode: "Logistics",
    shortDescription: "AI for supply chain and fulfillment",
    icon: LogisticsIcon,
    iconBg: "#18E0CC",
    accentColor: "#18E0CC",
    image: logisticsImage,
    features: [
      "Route Optimization",
      "Demand Forecasting",
      "Warehouse Automation",
      "Shipment Visibility",
    ],
    metric: "35% Operational Efficiency Gain",
    subtitle:
      "Optimize planning, fulfillment, and last-mile delivery with AI for logistics and supply chain teams.",
    contentHeading: "Supply Chain Intelligence at Scale",
    contentParagraphs: [
      "Logistics organizations operate on thin margins and tight SLAs. AI Verse logistics solutions improve demand forecasting, route planning, warehouse throughput, and exception management across carriers, 3PLs, and enterprise supply chain teams.",
      "Computer vision, predictive analytics, and agentic automation connect TMS, WMS, and ERP systems to reduce delays, cut costs, and improve customer delivery experiences.",
      "We deploy models with real-time monitoring and operational dashboards so teams can trust AI recommendations on the warehouse floor and in the control tower.",
    ],
    highlights: [
      {
        title: "Predictive Planning",
        description:
          "Forecast demand and capacity needs by lane, SKU, and season to reduce stockouts and idle assets.",
      },
      {
        title: "Dynamic Routing",
        description:
          "Optimize dispatch and last-mile routes with live traffic, weather, and SLA constraints.",
      },
      {
        title: "Warehouse Intelligence",
        description:
          "Automate slotting, pick-path optimization, and anomaly detection across fulfillment operations.",
      },
    ],
  },
];

export const homeIndustries = industrySolutionsData.map(
  ({
    id,
    title,
    icon,
    iconBg,
    accentColor,
    image,
    features,
    metric,
  }) => ({
    id,
    title,
    icon,
    iconBg,
    accentColor,
    image,
    features,
    metric,
  }),
);

export const getIndustryIndexById = (industryId) => {
  const index = industrySolutionsData.findIndex((item) => item.id === industryId);
  return index >= 0 ? index : 0;
};

export const getIndustryById = (industryId) =>
  industrySolutionsData[getIndustryIndexById(industryId)];

export const getIndustryDomainCode = (industryId) =>
  getIndustryById(industryId)?.domainCode || "Education";
