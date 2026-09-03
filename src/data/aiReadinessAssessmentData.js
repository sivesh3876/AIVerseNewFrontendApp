const assessmentData = [
  {
    id: "data-readiness",
    name: "Data readiness",

    recommendation:
      "Strengthen data availability, quality, governance, and infrastructure to create a reliable foundation for AI initiatives.",

    nextStep:
      "Review data quality, accessibility, governance, and infrastructure gaps for priority AI use cases.",

    questions: [
      {
        id: "data-1",
        text:
          "Our organisation has structured data that is readily available and accessible for AI use cases.",
        context:
          "This assesses whether the organisation can readily access the data needed to support AI initiatives.",
      },
      {
        id: "data-2",
        text:
          "Our organisation has data that is clean, labelled, and consistent across key systems.",
        context:
          "This assesses whether the quality and consistency of organisational data are sufficient for reliable AI use.",
      },
      {
        id: "data-3",
        text:
          "Our organisation has clearly defined data governance policies and ownership responsibilities.",
        context:
          "This assesses whether data ownership, governance policies, and accountability are clearly established.",
      },
      {
        id: "data-4",
        text:
          "Our organisation has production-ready data pipelines, storage, and APIs to support AI workloads.",
        context:
          "This assesses whether the technical data infrastructure can reliably support AI solutions in production.",
      },
    ],
  },

  {
    id: "technology-infrastructure",
    name: "Technology & infrastructure",

    recommendation:
      "Build scalable AI infrastructure, deployment tooling, integration capabilities, and security controls to support production AI workloads.",

    nextStep:
      "Assess the current cloud, MLOps, integration, and security capabilities needed for AI workloads.",

    questions: [
      {
        id: "technology-1",
        text:
          "Our organisation has scalable computing and storage infrastructure available for AI workloads.",
        context:
          "This assesses whether the organisation has sufficient scalable infrastructure to support AI workloads.",
      },
      {
        id: "technology-2",
        text:
          "Our organisation has tools and processes to deploy, monitor, and manage AI models in production.",
        context:
          "This assesses whether the organisation can reliably deploy, monitor, version, and manage AI models.",
      },
      {
        id: "technology-3",
        text:
          "Our organisation can integrate AI solutions with existing systems through APIs and other integration capabilities.",
        context:
          "This assesses whether AI outputs can be connected effectively to existing business and technology systems.",
      },
      {
        id: "technology-4",
        text:
          "Our organisation has clear security measures to control access to AI systems and protect sensitive data used by AI.",
        context:
          "This assesses whether AI systems and the data they use are protected through appropriate access and security measures.",
      },
    ],
  },

  {
    id: "talent-skills",
    name: "Talent & skills",

    recommendation:
      "Develop AI literacy, data science, engineering, and responsible AI skills across leadership and delivery teams.",

    nextStep:
      "Identify AI skill gaps across leadership, business, data science, engineering, and responsible AI teams.",

    questions: [
      {
        id: "talent-1",
        text:
          "Our organisation's leadership and business teams understand key AI concepts, capabilities, and limitations.",
        context:
          "This assesses whether decision-makers and business teams have sufficient AI knowledge to make informed decisions.",
      },
      {
        id: "talent-2",
        text:
          "Our organisation has the data science skills needed to build and evaluate AI models.",
        context:
          "This assesses whether the organisation has sufficient internal capability to develop and evaluate AI models.",
      },
      {
        id: "talent-3",
        text:
          "Our engineering teams have the skills needed to integrate and deploy AI solutions in production.",
        context:
          "This assesses whether engineering teams can turn AI solutions into reliable production capabilities.",
      },
      {
        id: "talent-4",
        text:
          "Our teams understand how to identify bias, fairness, and risk in AI systems.",
        context:
          "This assesses whether teams have sufficient awareness of responsible AI risks and ethical considerations.",
      },
    ],
  },

  {
    id: "strategy-leadership",
    name: "Strategy & leadership",

    recommendation:
      "Establish a clear AI strategy, executive sponsorship, prioritised use cases, and an investment model aligned with business value.",

    nextStep:
      "Align AI priorities with business goals and establish executive sponsorship, use-case priorities, and investment expectations.",

    questions: [
      {
        id: "strategy-1",
        text:
          "Our organisation has a documented AI strategy and roadmap aligned with business priorities.",
        context:
          "This assesses whether AI adoption is guided by a clear strategy connected to organisational goals.",
      },
      {
        id: "strategy-2",
        text:
          "Senior leaders actively sponsor and support AI initiatives across the organisation.",
        context:
          "This assesses whether leadership provides visible support and commitment to AI adoption.",
      },
      {
        id: "strategy-3",
        text:
          "Our organisation has a prioritised portfolio of AI use cases with clear business value and feasibility.",
        context:
          "This assesses whether AI opportunities are prioritised based on expected value and practical feasibility.",
      },
      {
        id: "strategy-4",
        text:
          "Our organisation has defined funding and ROI expectations for AI programmes.",
        context:
          "This assesses whether investment decisions and expected business returns for AI initiatives are clearly defined.",
      },
    ],
  },

  {
    id: "process-operating-model",
    name: "Process & operating model",

    recommendation:
      "Improve process maturity, change management, ownership, decision rights, and continuous improvement mechanisms for AI adoption.",

    nextStep:
      "Identify processes that can benefit from AI and clarify ownership, change management, and operating responsibilities.",

    questions: [
      {
        id: "process-1",
        text:
          "Our organisation has standardised processes that are suitable for AI augmentation.",
        context:
          "This assesses whether existing workflows are sufficiently mature and consistent to benefit from AI.",
      },
      {
        id: "process-2",
        text:
          "Our organisation has a structured approach to managing AI adoption and workforce transition.",
        context:
          "This assesses whether the organisation is prepared to manage the people and organisational changes associated with AI adoption.",
      },
      {
        id: "process-3",
        text:
          "Our organisation has clearly defined ownership, roles, and decision rights for AI initiatives.",
        context:
          "This assesses whether accountability and decision-making responsibilities for AI are clearly established.",
      },
      {
        id: "process-4",
        text:
          "Our organisation has mechanisms to measure AI outcomes and continuously improve AI solutions.",
        context:
          "This assesses whether AI initiatives are measured and improved based on their actual performance and outcomes.",
      },
    ],
  },

  {
    id: "risk-ethics-governance",
    name: "Risk, ethics & governance",

    recommendation:
      "Strengthen responsible AI governance, regulatory compliance, model risk management, transparency, and accountability.",

    nextStep:
      "Review responsible AI policies, regulatory requirements, model risks, transparency, and accountability mechanisms.",

    questions: [
      {
        id: "risk-1",
        text:
          "Our organisation has a clear AI governance framework with policies and controls for responsible AI use.",
        context:
          "This assesses whether the organisation has formal governance mechanisms for responsible AI adoption.",
      },
      {
        id: "risk-2",
        text:
          "Our organisation has processes to identify and meet relevant AI and data regulatory requirements.",
        context:
          "This assesses whether regulatory and compliance requirements related to AI and data are actively managed.",
      },
      {
        id: "risk-3",
        text:
          "Our organisation has processes for testing, monitoring, and mitigating risks associated with AI models.",
        context:
          "This assesses whether AI model risks are systematically identified, monitored, and managed.",
      },
      {
        id: "risk-4",
        text:
          "Our organisation has clear mechanisms for AI transparency, documentation, explainability, and accountability.",
        context:
          "This assesses whether the organisation can explain, document, and assign accountability for AI systems and their outcomes.",
      },
    ],
  },
];

export default assessmentData;