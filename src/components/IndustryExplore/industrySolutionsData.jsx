import educationImage from "../../assets/images/industries01.svg";
import healthcareImage from "../../assets/images/industries02.svg";
import financialServicesImage from "../../assets/images/industries03.svg";
import retailImage from "../../assets/images/industries04.svg";
import {
  EducationIcon,
  FinancialServicesIcon,
  HealthcareIcon,
  RetailIcon,
} from "../IndustrySpecificAISolutions/IndustryIcons";

export const industrySolutionsData = [
  {
    id: "education",
    title: "Education",
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
      "Transform teaching, learning, and campus operations with AI built for educational institutions.",
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
    solutions: [
      {
        title: "Student Success Platform",
        description:
          "Holistic view of student engagement with AI-driven nudges and advisor dashboards.",
      },
      {
        title: "Campus Virtual Assistant",
        description:
          "24/7 conversational support for enrollment, financial aid, and campus services.",
      },
      {
        title: "Learning Analytics",
        description:
          "Insights from LMS data to improve curriculum design and instructional effectiveness.",
      },
      {
        title: "Document Automation",
        description:
          "Intelligent processing of transcripts, applications, and compliance paperwork.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    shortDescription: "AI for care and operations",
    icon: HealthcareIcon,
    iconBg: "#18E0CC",
    accentColor: "#18E0CC",
    image: healthcareImage,
    features: [
      "Patient Care AI",
      "Diagnostic Support",
      "Clinical Documentation",
      "Operational Efficiency",
    ],
    metric: "50% Reduced Admin Time",
    subtitle:
      "Enhance patient care and streamline clinical workflows with secure, compliant healthcare AI.",
    contentHeading: "AI That Supports Care Teams",
    contentParagraphs: [
      "Healthcare organizations need AI that augments clinicians—not replaces them. Our healthcare solutions reduce documentation burden, surface relevant patient insights, and optimize scheduling and revenue cycle operations while meeting HIPAA and regional privacy requirements.",
      "Clinical documentation assistants capture encounter notes in real time, coding support accelerates billing accuracy, and patient-facing chatbots handle appointment scheduling and pre-visit intake at scale.",
      "Every deployment is designed with clinical governance, audit trails, and integration into EHR and practice management systems your teams already rely on.",
    ],
    highlights: [
      {
        title: "Less Documentation Burden",
        description:
          "Ambient clinical documentation and structured note generation save hours per clinician per week.",
      },
      {
        title: "Better Patient Access",
        description:
          "Self-service scheduling, triage bots, and multilingual support improve patient experience.",
      },
      {
        title: "Operational Intelligence",
        description:
          "Predict no-shows, optimize staffing, and reduce claim denials with data-driven insights.",
      },
    ],
    solutions: [
      {
        title: "Clinical Documentation AI",
        description:
          "Voice-enabled note generation with EHR integration and physician review workflows.",
      },
      {
        title: "Patient Engagement Hub",
        description:
          "Omnichannel bots for appointments, reminders, and post-discharge follow-up.",
      },
      {
        title: "Diagnostic Decision Support",
        description:
          "Evidence-based suggestions to assist radiology and pathology review workflows.",
      },
      {
        title: "Revenue Cycle Automation",
        description:
          "Prior authorization, coding assistance, and denial prediction for faster reimbursement.",
      },
    ],
  },
  {
    id: "financial-services",
    title: "Financial Services",
    shortDescription: "AI for risk and compliance",
    icon: FinancialServicesIcon,
    iconBg: "#EF8E29",
    accentColor: "#EF8E29",
    image: financialServicesImage,
    features: [
      "Risk Modeling",
      "Fraud Detection",
      "Compliance Automation",
      "Customer Insights",
    ],
    metric: "40% Faster Decisions",
    subtitle:
      "Strengthen risk management, fraud prevention, and customer engagement with regulated AI.",
    contentHeading: "Trusted AI for Financial Institutions",
    contentParagraphs: [
      "Banks, insurers, and fintech companies operate in one of the most regulated environments in enterprise technology. AI Verse financial services solutions deliver real-time fraud detection, credit risk scoring, and compliance automation with explainability built in for auditors and regulators.",
      "Customer-facing AI powers personalized product recommendations, intelligent service bots, and faster loan processing—while back-office automation handles KYC document review, regulatory reporting, and anomaly detection across transactions.",
      "We partner with core banking, payment, and CRM platforms to deploy models that meet SOC 2, PCI, and regional financial compliance standards.",
    ],
    highlights: [
      {
        title: "Real-Time Fraud Defense",
        description:
          "Score transactions in milliseconds and adapt to emerging fraud patterns automatically.",
      },
      {
        title: "Explainable Risk Models",
        description:
          "Transparent credit and underwriting decisions with reason codes for compliance review.",
      },
      {
        title: "Compliance at Scale",
        description:
          "Automate AML screening, regulatory reporting, and policy document analysis.",
      },
    ],
    solutions: [
      {
        title: "Fraud Detection Engine",
        description:
          "Real-time transaction monitoring with adaptive models and investigator dashboards.",
      },
      {
        title: "Credit Risk Analytics",
        description:
          "Alternative data and traditional signals combined for faster, fairer lending decisions.",
      },
      {
        title: "Regulatory Compliance Suite",
        description:
          "Automated KYC, sanctions screening, and audit-ready documentation workflows.",
      },
      {
        title: "Wealth & Service AI",
        description:
          "Personalized advisory insights and secure client service across digital channels.",
      },
    ],
  },
  {
    id: "retail",
    title: "Retail",
    shortDescription: "AI for commerce growth",
    icon: RetailIcon,
    iconBg: "#F5B800",
    accentColor: "#D4A017",
    image: retailImage,
    features: [
      "Personalization",
      "Inventory Optimization",
      "Visual Search",
      "Dynamic Pricing",
    ],
    metric: "35% Higher Conversion",
    subtitle:
      "Drive conversion, loyalty, and supply chain efficiency with retail-ready AI solutions.",
    contentHeading: "Commerce Intelligence at Every Touchpoint",
    contentParagraphs: [
      "Retailers compete on experience as much as price. AI Verse retail solutions personalize every shopper journey—from product discovery and visual search to dynamic pricing and inventory optimization across stores and digital channels.",
      "Recommendation engines increase basket size, demand forecasting reduces stockouts, and computer vision powers shelf analytics and frictionless checkout experiences in physical locations.",
      "Integrations with Shopify, Salesforce Commerce Cloud, and major POS systems ensure AI insights flow directly into the tools your merchandising and operations teams use daily.",
    ],
    highlights: [
      {
        title: "Higher Conversion",
        description:
          "Personalized product rankings and offers based on real-time shopper behavior.",
      },
      {
        title: "Smarter Inventory",
        description:
          "Forecast demand by SKU and location to reduce waste and prevent stockouts.",
      },
      {
        title: "Omnichannel Experience",
        description:
          "Consistent AI-powered service across web, app, and in-store interactions.",
      },
    ],
    solutions: [
      {
        title: "Personalization Engine",
        description:
          "Real-time product and content recommendations across web and mobile storefronts.",
      },
      {
        title: "Visual Search & Discovery",
        description:
          "Shop by image and similarity search to help customers find products faster.",
      },
      {
        title: "Demand Forecasting",
        description:
          "ML-driven planning for inventory, staffing, and promotional campaigns.",
      },
      {
        title: "Store Intelligence",
        description:
          "Shelf monitoring, footfall analytics, and planogram compliance via computer vision.",
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
