const assessmentData = {
  general: [
    {
      id: "data",
      title: "Data Readiness",
      questions: [
        {
          id: "data-1",
          text: "Availability and quality of data required to identify and support AI use cases",
        },
        {
          id: "data-2",
          text: "Data governance, accessibility, security, and infrastructure supporting AI initiatives",
        },
      ],
    },
    {
      id: "technology",
      title: "Technology & Infrastructure",
      questions: [
        {
          id: "technology-1",
          text: "Availability of scalable technology and infrastructure to develop, deploy, and support AI solutions",
        },
        {
          id: "technology-2",
          text: "Integration of AI capabilities with existing technology, applications, and business systems",
        },
      ],
    },
    {
      id: "talent",
      title: "Talent & Skills",
      questions: [
        {
          id: "talent-1",
          text: "Availability of AI, data, technical, and business skills needed to adopt and scale AI",
        },
        {
          id: "talent-2",
          text: "Ability of teams to develop, deploy, manage, and use AI solutions effectively and responsibly",
        },
      ],
    },
    {
      id: "strategy",
      title: "Strategy & Leadership",
      questions: [
        {
          id: "strategy-1",
          text: "Strength of AI strategy, leadership commitment, investment, and organizational alignment",
        },
        {
          id: "strategy-2",
          text: "Ability to identify, prioritize, implement, and measure the value of AI use cases",
        },
      ],
    },
    {
      id: "process",
      title: "Process & Operating Model",
      questions: [
        {
          id: "process-1",
          text: "Integration of AI into business processes, workflows, and day-to-day operations",
        },
        {
          id: "process-2",
          text: "Ability to continuously improve AI solutions through feedback, performance monitoring, and learning",
        },
      ],
    },
    {
      id: "risk",
      title: "Risk, Ethics & Governance",
      questions: [
        {
          id: "risk-1",
          text: "Maturity of processes for identifying and managing AI, security, privacy, ethical, and operational risks",
        },
        {
          id: "risk-2",
          text: "Maturity of AI governance covering compliance, transparency, explainability, accountability, and human oversight",
        },
      ],
    },
  ],

  education: [
    {
      id: "data",
      title: "Data Readiness",
      questions: [
        {
          id: "data-1",
          text: "Availability, quality, and effective use of student and academic data to support AI initiatives",
        },
        {
          id: "data-2",
          text: "Maturity of data governance, accessibility, and infrastructure required to support AI",
        },
      ],
    },
    {
      id: "technology",
      title: "Technology & Infrastructure",
      questions: [
        {
          id: "technology-1",
          text: "Availability of scalable technology and computing infrastructure to develop and support AI solutions",
        },
        {
          id: "technology-2",
          text: "Integration of AI capabilities with learning, student management, and other education systems",
        },
      ],
    },
    {
      id: "talent",
      title: "Talent & Skills",
      questions: [
        {
          id: "talent-1",
          text: "Level of AI, data, and analytical skills available across faculty, business, and technology teams",
        },
        {
          id: "talent-2",
          text: "Capability to develop, deploy, maintain, and use AI solutions responsibly and effectively",
        },
      ],
    },
    {
      id: "strategy",
      title: "Strategy & Leadership",
      questions: [
        {
          id: "strategy-1",
          text: "Strength of AI strategy, leadership sponsorship, investment, and organizational priorities",
        },
        {
          id: "strategy-2",
          text: "Maturity of AI use-case prioritization and measurement of business and educational value",
        },
      ],
    },
    {
      id: "process",
      title: "Process & Operating Model",
      questions: [
        {
          id: "process-1",
          text: "Adoption of AI across teaching, learning, student support, and administrative processes",
        },
        {
          id: "process-2",
          text: "Ability to continuously improve AI solutions using feedback, outcomes, and user experience",
        },
      ],
    },
    {
      id: "risk",
      title: "Risk, Ethics & Governance",
      questions: [
        {
          id: "risk-1",
          text: "Maturity of processes for identifying and managing AI risks, ethical concerns, privacy, and bias",
        },
        {
          id: "risk-2",
          text: "Maturity of AI compliance, explainability, transparency, accountability, and human oversight",
        },
      ],
    },
  ],

  insurance: [
    {
      id: "data",
      title: "Data Readiness",
      questions: [
        {
          id: "data-1",
          text: "Availability, quality, and effective use of customer, policy, claims, and risk data to support AI initiatives",
        },
        {
          id: "data-2",
          text: "Maturity of data governance, accessibility, and infrastructure required to support AI",
        },
      ],
    },
    {
      id: "technology",
      title: "Technology & Infrastructure",
      questions: [
        {
          id: "technology-1",
          text: "Availability of scalable technology and computing infrastructure to develop and support AI solutions",
        },
        {
          id: "technology-2",
          text: "Integration of AI capabilities with policy, claims, underwriting, CRM, and other core insurance systems",
        },
      ],
    },
    {
      id: "talent",
      title: "Talent & Skills",
      questions: [
        {
          id: "talent-1",
          text: "Level of AI, data, and analytical skills available across business, actuarial, and technology teams",
        },
        {
          id: "talent-2",
          text: "Capability to develop, deploy, maintain, and use AI solutions responsibly and effectively",
        },
      ],
    },
    {
      id: "strategy",
      title: "Strategy & Leadership",
      questions: [
        {
          id: "strategy-1",
          text: "Strength of AI strategy, leadership sponsorship, investment, and organizational priorities",
        },
        {
          id: "strategy-2",
          text: "Maturity of AI use-case prioritization and measurement of business and customer value",
        },
      ],
    },
    {
      id: "process",
      title: "Process & Operating Model",
      questions: [
        {
          id: "process-1",
          text: "Adoption of AI across underwriting, claims, customer service, risk, and operational processes",
        },
        {
          id: "process-2",
          text: "Ability to continuously improve AI solutions using business feedback, outcomes, and model performance",
        },
      ],
    },
    {
      id: "risk",
      title: "Risk, Ethics & Governance",
      questions: [
        {
          id: "risk-1",
          text: "Maturity of processes for identifying and managing AI, model, regulatory, privacy, and ethical risks",
        },
        {
          id: "risk-2",
          text: "Maturity of AI compliance, explainability, transparency, accountability, and human oversight",
        },
      ],
    },
  ],

  logistics: [
    {
      id: "data",
      title: "Data Readiness",
      questions: [
        {
          id: "data-1",
          text: "Availability, quality, and effective use of shipment, route, fleet, warehouse, and operational data to support AI",
        },
        {
          id: "data-2",
          text: "Maturity of data governance, accessibility, real-time data, and infrastructure required to support AI",
        },
      ],
    },
    {
      id: "technology",
      title: "Technology & Infrastructure",
      questions: [
        {
          id: "technology-1",
          text: "Availability of scalable technology, computing, IoT, and data infrastructure to develop and support AI",
        },
        {
          id: "technology-2",
          text: "Integration of AI capabilities with transportation, warehouse, fleet, ERP, and other logistics systems",
        },
      ],
    },
    {
      id: "talent",
      title: "Talent & Skills",
      questions: [
        {
          id: "talent-1",
          text: "Level of AI, data, and analytical skills available across operations, supply chain, and technology teams",
        },
        {
          id: "talent-2",
          text: "Capability to develop, deploy, maintain, and use AI solutions responsibly and effectively",
        },
      ],
    },
    {
      id: "strategy",
      title: "Strategy & Leadership",
      questions: [
        {
          id: "strategy-1",
          text: "Strength of AI strategy, leadership sponsorship, investment, and organizational priorities",
        },
        {
          id: "strategy-2",
          text: "Maturity of AI use-case prioritization and measurement of operational and business value",
        },
      ],
    },
    {
      id: "process",
      title: "Process & Operating Model",
      questions: [
        {
          id: "process-1",
          text: "Adoption of AI across transportation, warehousing, inventory, fleet, and delivery processes",
        },
        {
          id: "process-2",
          text: "Ability to continuously improve AI solutions using operational feedback, outcomes, and performance data",
        },
      ],
    },
    {
      id: "risk",
      title: "Risk, Ethics & Governance",
      questions: [
        {
          id: "risk-1",
          text: "Maturity of processes for identifying and managing AI, operational, security, safety, and ethical risks",
        },
        {
          id: "risk-2",
          text: "Maturity of AI compliance, explainability, transparency, accountability, and human oversight",
        },
      ],
    },
  ],
};

export default assessmentData;