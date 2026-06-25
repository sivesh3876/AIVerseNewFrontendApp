export const experiencePillars = {
  cx: {
    id: "cx",
    label: "Customer Experience",
    shortLabel: "CX",
    headerColor: "#0d1e32",
    accentColor: "#4D90E3",
    cardBg: "#eef5ff",
    iconBg: "#dbeafe",
  },
  ex: {
    id: "ex",
    label: "Employee Experience",
    shortLabel: "EX",
    headerColor: "#3A8D9D",
    accentColor: "#18E0CC",
    cardBg: "#eefcfb",
    iconBg: "#ccfbf1",
  },
  bx: {
    id: "bx",
    label: "Business Experience",
    shortLabel: "BX",
    headerColor: "#059669",
    accentColor: "#34d399",
    cardBg: "#ecfdf5",
    iconBg: "#d1fae5",
  },
};

const buildExperience = (pillarId, items) =>
  items.map((item) => ({ ...item, pillarId }));

export const industryExperiences = {
  education: {
    pageTitle: "Industry : Education — AI Across Every Experience",
    intro:
      "The education industry is undergoing a digital revolution, with institutions embracing e-learning, personalized curricula, and data-driven student engagement to improve outcomes across K-12, higher education, and corporate training.",
    pillars: {
      cx: buildExperience("cx", [
        {
          id: "personalised-learning-journeys",
          title: "Personalised Learning Journeys",
          description:
            "AI adapts content, pace, and assessments to each student's learning profile and performance signals.",
          detail: {
            overview:
              "Personalised learning journeys use AI to continuously adapt coursework, assessments, and support resources based on each learner's progress, preferences, and performance signals across LMS and student portals.",
            benefits: [
              "Adaptive pathways that match each student's pace and learning style.",
              "Higher completion rates through timely content recommendations.",
              "Better visibility for educators into learner progress and gaps.",
            ],
            outcomes: [
              "Improved student engagement and course completion.",
              "More equitable learning experiences across diverse cohorts.",
            ],
          },
        },
        {
          id: "conversational-ai-student-support",
          title: "Conversational AI Student Support",
          description:
            "24/7 AI advisors guide students through course selection, deadlines, and query resolution.",
          detail: {
            overview:
              "Conversational AI advisors provide always-on support for enrolment, course selection, financial aid queries, and campus services — integrated with SIS, CRM, and knowledge bases.",
            benefits: [
              "Instant answers to common student questions across channels.",
              "Reduced load on administrative and advisor teams.",
              "Consistent, policy-aligned guidance for every student.",
            ],
            outcomes: [
              "Faster resolution of routine student inquiries.",
              "Higher satisfaction during peak enrolment periods.",
            ],
          },
        },
        {
          id: "gen-ai-content-campaign-mgmt",
          title: "Gen-AI Content & Campaign Mgmt",
          description:
            "Automated enrolment campaigns and personalised outreach tailored to each prospective student's interests.",
          detail: {
            overview:
              "Generative AI accelerates content creation for enrolment campaigns, event promotion, and personalised outreach while maintaining brand and compliance guardrails.",
            benefits: [
              "Faster campaign production for admissions and marketing teams.",
              "Personalised messaging at scale for prospective students.",
              "Integrated workflows from content draft to approval and publish.",
            ],
            outcomes: [
              "Shorter campaign cycles and improved conversion rates.",
              "More relevant communications for every stage of the enrolment funnel.",
            ],
          },
        },
        {
          id: "predictive-dropout-analytics",
          title: "Predictive Dropout Analytics",
          description:
            "ML models identify at-risk students early, enabling counsellors to intervene before disengagement escalates.",
          detail: {
            overview:
              "Predictive analytics combine academic, engagement, and behavioural signals to flag at-risk students and recommend timely advisor interventions.",
            benefits: [
              "Early warning alerts for disengagement and dropout risk.",
              "Prioritised outreach lists for counsellors and success teams.",
              "Continuous model refinement using institutional data.",
            ],
            outcomes: [
              "Higher retention through proactive student support.",
              "Better allocation of advisor time to high-impact cases.",
            ],
          },
        },
        {
          id: "student-voice-feedback",
          title: "Student Voice & Feedback",
          description:
            "NLP-powered analysis of student surveys, forums, and support tickets to surface sentiment trends.",
          detail: {
            overview:
              "NLP models analyse surveys, forums, and support interactions to uncover sentiment trends, emerging issues, and opportunities to improve student experience.",
            benefits: [
              "Automated theme detection across unstructured feedback.",
              "Real-time sentiment dashboards for leadership teams.",
              "Actionable insights linked to service improvement plans.",
            ],
            outcomes: [
              "Faster response to student concerns and service gaps.",
              "Data-driven improvements to campus and digital experience.",
            ],
          },
        },
      ]),
      ex: buildExperience("ex", [
        {
          id: "ai-copilots-for-faculty",
          title: "AI Copilots for Faculty",
          description:
            "AI assistants help educators auto-grade assignments and generate personalised student feedback at scale.",
          detail: {
            overview:
              "Faculty copilots assist with grading, feedback generation, lesson planning, and administrative tasks so educators can focus on high-value teaching and mentorship.",
            benefits: [
              "Automated first-pass grading with human review gates.",
              "Personalised feedback drafts aligned to rubrics.",
              "Time savings on repetitive academic workflows.",
            ],
            outcomes: [
              "More time for faculty-student interaction.",
              "Consistent, timely feedback across large cohorts.",
            ],
          },
        },
        {
          id: "ai-powered-staff-learning-paths",
          title: "AI-Powered Staff Learning Paths",
          description:
            "Staff upskilling journeys continuously updated by AI, aligned to institutional goals and EdTech skills.",
          detail: {
            overview:
              "AI-curated learning paths help staff build digital, pedagogical, and operational skills aligned to institutional strategy and emerging EdTech capabilities.",
            benefits: [
              "Role-based upskilling recommendations for staff.",
              "Continuously refreshed content based on skills gaps.",
              "Progress tracking tied to institutional competency frameworks.",
            ],
            outcomes: [
              "Stronger digital capability across faculty and operations teams.",
              "Faster adoption of new platforms and teaching models.",
            ],
          },
        },
        {
          id: "intelligent-admin-automation",
          title: "Intelligent Admin Automation",
          description:
            "Automated scheduling, HR workflows, and compliance reporting free academic staff to focus on teaching.",
          detail: {
            overview:
              "Intelligent automation streamlines scheduling, HR workflows, document routing, and compliance reporting across campus operations.",
            benefits: [
              "Reduced manual effort in routine administrative processes.",
              "Fewer errors in scheduling and compliance submissions.",
              "Integrated workflows across HR, finance, and academic systems.",
            ],
            outcomes: [
              "Lower operational overhead for administrative teams.",
              "More capacity for student-facing support and campus services.",
            ],
          },
        },
        {
          id: "workforce-insights-planning",
          title: "Workforce Insights & Planning",
          description:
            "Predictive analytics surface faculty burnout risk, skills gaps, and succession planning opportunities.",
          detail: {
            overview:
              "Workforce analytics combine HR, workload, and engagement data to support succession planning, skills development, and wellbeing initiatives.",
            benefits: [
              "Early identification of burnout and retention risks.",
              "Skills gap analysis for strategic workforce planning.",
              "Executive dashboards for staffing and capacity decisions.",
            ],
            outcomes: [
              "Improved faculty and staff retention.",
              "Better alignment of talent strategy with institutional goals.",
            ],
          },
        },
        {
          id: "faculty-wellbeing-retention",
          title: "Faculty Wellbeing & Retention",
          description:
            "AI tools that monitor staff engagement signals and recommend wellbeing interventions.",
          detail: {
            overview:
              "AI-enabled wellbeing programs monitor engagement signals and recommend timely interventions to support faculty health, balance, and retention.",
            benefits: [
              "Confidential wellbeing check-ins and trend monitoring.",
              "Targeted support resources based on role and workload.",
              "Leadership visibility into systemic wellbeing patterns.",
            ],
            outcomes: [
              "Healthier, more sustainable academic workplaces.",
              "Reduced attrition among high-performing faculty.",
            ],
          },
        },
      ]),
      bx: buildExperience("bx", [
        {
          id: "ai-powered-student-data-platform",
          title: "AI-Powered Student Data Platform",
          description:
            "Unified data fabric integrates SIS, LMS, and CRM — giving leadership real-time institutional intelligence.",
          detail: {
            overview:
              "A unified student data platform connects SIS, LMS, CRM, and engagement systems into a single intelligence layer for leaders and operational teams.",
            benefits: [
              "360° view of student journeys across systems.",
              "Real-time dashboards for enrolment, retention, and outcomes.",
              "Governed data access with privacy and compliance controls.",
            ],
            outcomes: [
              "Faster, more confident institutional decision-making.",
              "Better coordination across academic and operational teams.",
            ],
          },
        },
        {
          id: "enterprise-system-integration",
          title: "Enterprise System Integration",
          description:
            "Seamless integration of legacy student management, financial and HR systems via AI-orchestrated APIs.",
          detail: {
            overview:
              "AI-orchestrated integrations connect legacy student management, finance, HR, and third-party EdTech platforms without disruptive rip-and-replace projects.",
            benefits: [
              "Faster integration of new tools into existing ecosystems.",
              "Reduced manual data reconciliation across systems.",
              "API-led architecture for scalable future expansion.",
            ],
            outcomes: [
              "Lower integration cost and time to value.",
              "More agile response to new academic and operational needs.",
            ],
          },
        },
        {
          id: "compliance-accreditation-ai",
          title: "Compliance & Accreditation AI",
          description:
            "Automated regulatory reporting, audit trails, and accreditation evidence packs — always audit-ready.",
          detail: {
            overview:
              "Compliance AI automates regulatory reporting, audit trails, and accreditation evidence collection so institutions stay continuously audit-ready.",
            benefits: [
              "Automated evidence gathering for accreditation cycles.",
              "Policy-aligned audit logs and reporting workflows.",
              "Reduced manual effort during inspection periods.",
            ],
            outcomes: [
              "Lower compliance risk and reporting burden.",
              "More time for quality improvement instead of paperwork.",
            ],
          },
        },
        {
          id: "scalable-edtech-platform-eng",
          title: "Scalable EdTech Platform Eng.",
          description:
            "Cloud-native learning platforms built for elastic scale — handling peak enrolment demand without disruption.",
          detail: {
            overview:
              "Cloud-native EdTech platforms engineered for elastic scale, high availability, and seamless peak-load performance during enrolment and exam periods.",
            benefits: [
              "Auto-scaling infrastructure for seasonal demand spikes.",
              "Modern UX across web and mobile learning experiences.",
              "DevOps practices for continuous platform improvement.",
            ],
            outcomes: [
              "Reliable digital experiences during critical academic periods.",
              "Platform readiness for institutional growth.",
            ],
          },
        },
        {
          id: "edtech-roi-analytics",
          title: "EdTech ROI & Analytics",
          description:
            "Unified dashboards tracking learning outcomes, platform usage, and technology investment returns.",
          detail: {
            overview:
              "ROI analytics unify learning outcomes, platform adoption, and technology spend to help leaders measure and optimise EdTech investments.",
            benefits: [
              "Clear visibility into platform usage and impact.",
              "Investment prioritisation based on outcome data.",
              "Executive reporting for board and stakeholder reviews.",
            ],
            outcomes: [
              "Higher return on EdTech and AI investments.",
              "Evidence-based technology roadmap decisions.",
            ],
          },
        },
      ]),
    },
  },
  insurance: {
    pageTitle: "Industry : Insurance — AI Across Every Experience",
    intro:
      "Insurers and MGAs are reimagining policy lifecycle operations with AI — from personalised policyholder engagement and agent productivity to compliant, data-driven underwriting and claims at scale.",
    pillars: {
      cx: buildExperience("cx", [
        {
          id: "policyholder-self-service",
          title: "Policyholder Self-Service AI",
          description:
            "24/7 digital assistants for quotes, endorsements, claims status, and policy servicing across channels.",
          detail: {
            overview:
              "AI-powered self-service helps policyholders manage quotes, endorsements, claims updates, and documents through web, mobile, and contact centre channels.",
            benefits: [
              "Instant answers to policy and claims questions.",
              "Reduced call centre volume for routine requests.",
              "Consistent, compliant responses across all channels.",
            ],
            outcomes: [
              "Higher policyholder satisfaction and digital adoption.",
              "Lower cost-to-serve for standard servicing requests.",
            ],
          },
        },
        {
          id: "claims-conversational-ai",
          title: "Claims Conversational AI",
          description:
            "Guided FNOL and claims updates with document upload, triage, and proactive status notifications.",
          detail: {
            overview:
              "Conversational AI guides first notice of loss, document submission, and status tracking while routing complex cases to adjusters with full context.",
            benefits: [
              "Faster FNOL completion with guided workflows.",
              "Automated document capture and validation.",
              "Proactive notifications at each claims milestone.",
            ],
            outcomes: [
              "Shorter claims cycle times and improved NPS.",
              "Better adjuster productivity with pre-qualified submissions.",
            ],
          },
        },
        {
          id: "personalised-policy-recommendations",
          title: "Personalised Policy Recommendations",
          description:
            "AI analyses customer profiles and life events to recommend relevant coverage and cross-sell opportunities.",
          detail: {
            overview:
              "Recommendation engines analyse customer profiles, policy history, and life events to suggest relevant coverage options and renewal strategies.",
            benefits: [
              "Timely, relevant product recommendations.",
              "Improved cross-sell and retention opportunities.",
              "Explainable suggestions aligned to suitability rules.",
            ],
            outcomes: [
              "Higher policy retention and wallet share.",
              "More personalised customer relationships at scale.",
            ],
          },
        },
        {
          id: "customer-communication-orchestration",
          title: "Customer Communication Orchestration",
          description:
            "Automated, compliant policyholder communications across email, SMS, and portal with CCM integration.",
          detail: {
            overview:
              "Orchestrated communications deliver timely, compliant policyholder messages across channels with template governance and audit trails.",
            benefits: [
              "Consistent messaging across renewal, claims, and servicing.",
              "Regulatory-compliant templates and approval workflows.",
              "Integrated CCM for personalised, high-volume communications.",
            ],
            outcomes: [
              "Fewer communication errors and compliance gaps.",
              "Stronger policyholder trust through timely updates.",
            ],
          },
        },
      ]),
      ex: buildExperience("ex", [
        {
          id: "underwriter-copilot",
          title: "Underwriter Copilot",
          description:
            "AI assists underwriters with submission summaries, risk signals, and guideline-aligned recommendations.",
          detail: {
            overview:
              "Underwriter copilots extract submission data, highlight risk signals, and draft recommendations aligned to underwriting guidelines and appetite rules.",
            benefits: [
              "Faster submission review with AI-generated summaries.",
              "Consistent application of underwriting guidelines.",
              "Explainable risk indicators for human decision-makers.",
            ],
            outcomes: [
              "Higher underwriting throughput without sacrificing quality.",
              "Improved consistency across underwriting teams.",
            ],
          },
        },
        {
          id: "agent-advisor-enablement",
          title: "Agent & Advisor Enablement",
          description:
            "AI tools help brokers and agents find answers, generate proposals, and resolve servicing queries faster.",
          detail: {
            overview:
              "Enablement platforms give brokers and agents instant access to product knowledge, proposal support, and servicing workflows powered by AI.",
            benefits: [
              "Faster quote and proposal preparation.",
              "Reduced dependency on back-office teams for routine queries.",
              "Embedded compliance checks in advisor workflows.",
            ],
            outcomes: [
              "Higher agent productivity and satisfaction.",
              "Improved speed-to-quote for commercial and specialty lines.",
            ],
          },
        },
        {
          id: "claims-adjuster-assist",
          title: "Claims Adjuster Assist",
          description:
            "Document extraction, damage assessment support, and precedent search to accelerate adjuster decisions.",
          detail: {
            overview:
              "Adjuster assist tools extract claim documents, surface precedents, and support damage assessment workflows to accelerate fair, consistent decisions.",
            benefits: [
              "Automated extraction from claim forms and attachments.",
              "Semantic search across historical claims and precedents.",
              "Draft correspondence and reserve recommendations for review.",
            ],
            outcomes: [
              "Reduced adjuster handling time per claim.",
              "More consistent outcomes across adjusters and regions.",
            ],
          },
        },
        {
          id: "workforce-compliance-training",
          title: "Workforce Compliance Training",
          description:
            "AI-curated training paths for regulatory, product, and fraud awareness across distribution and operations teams.",
          detail: {
            overview:
              "Adaptive training programs keep distribution, underwriting, and claims teams current on regulatory, product, and fraud awareness requirements.",
            benefits: [
              "Role-based learning paths with completion tracking.",
              "Automated updates when regulations or products change.",
              "Audit-ready training records for compliance reviews.",
            ],
            outcomes: [
              "Lower compliance risk across the workforce.",
              "Faster onboarding for new products and markets.",
            ],
          },
        },
      ]),
      bx: buildExperience("bx", [
        {
          id: "core-system-integration",
          title: "Core System Integration",
          description:
            "AI-orchestrated APIs connect policy admin, CRM, billing, and document platforms for seamless data flow.",
          detail: {
            overview:
              "Integration hubs connect policy administration, CRM, billing, and document systems with governed APIs and event-driven workflows.",
            benefits: [
              "Reduced manual re-keying between core systems.",
              "Real-time data sync for underwriting and claims.",
              "Extensible architecture for new partners and channels.",
            ],
            outcomes: [
              "Lower operational cost and integration complexity.",
              "Faster launch of new products and digital journeys.",
            ],
          },
        },
        {
          id: "fraud-analytics-platform",
          title: "Fraud Analytics Platform",
          description:
            "ML models detect anomalous claims and application patterns with investigator-ready case packs.",
          detail: {
            overview:
              "Fraud analytics platforms score claims and applications for anomalous patterns, generating investigator-ready case packs with explainable signals.",
            benefits: [
              "Early detection of suspicious claims and applications.",
              "Prioritised investigation queues for SIU teams.",
              "Continuous model learning from investigation outcomes.",
            ],
            outcomes: [
              "Reduced fraud losses and leakage.",
              "More efficient use of special investigation resources.",
            ],
          },
        },
        {
          id: "regulatory-reporting-ai",
          title: "Regulatory Reporting AI",
          description:
            "Automated regulatory filings, audit evidence, and governance dashboards for multi-jurisdiction insurers.",
          detail: {
            overview:
              "Regulatory AI automates filing preparation, audit evidence collection, and governance reporting for multi-jurisdiction insurance operations.",
            benefits: [
              "Automated data aggregation for regulatory submissions.",
              "Audit trails and evidence packs for examinations.",
              "Executive dashboards for compliance posture monitoring.",
            ],
            outcomes: [
              "Lower reporting effort and compliance risk.",
              "Faster response to regulatory inquiries.",
            ],
          },
        },
        {
          id: "insurance-data-intelligence",
          title: "Insurance Data Intelligence",
          description:
            "Unified analytics across underwriting, claims, and distribution for portfolio and profitability insights.",
          detail: {
            overview:
              "Unified data intelligence connects underwriting, claims, and distribution data for portfolio performance, loss ratio, and profitability analytics.",
            benefits: [
              "Executive dashboards for portfolio and line performance.",
              "Drill-down analytics for underwriters and product owners.",
              "Data governance aligned to insurance regulatory requirements.",
            ],
            outcomes: [
              "Better pricing and portfolio decisions.",
              "Improved visibility into profitability drivers.",
            ],
          },
        },
      ]),
    },
  },
  logistics: {
    pageTitle: "Industry : Logistics — AI Across Every Experience",
    intro:
      "Logistics providers are deploying AI to improve shipment visibility, optimise warehouse and last-mile operations, and deliver proactive customer experiences across complex global supply chains.",
    pillars: {
      cx: buildExperience("cx", [
        {
          id: "shipment-visibility-ai",
          title: "Shipment Visibility AI",
          description:
            "Real-time tracking, predictive ETAs, and proactive exception alerts for customers and partners.",
          detail: {
            overview:
              "Visibility platforms combine carrier data, IoT signals, and predictive models to deliver accurate ETAs and proactive exception alerts to customers and partners.",
            benefits: [
              "Real-time shipment tracking across multi-leg routes.",
              "Predictive ETA updates when delays are likely.",
              "Automated customer notifications for critical exceptions.",
            ],
            outcomes: [
              "Higher customer satisfaction and fewer inbound status queries.",
              "Reduced cost of manual tracking and customer support.",
            ],
          },
        },
        {
          id: "customer-service-automation",
          title: "Customer Service Automation",
          description:
            "AI assistants resolve delivery queries, reroute requests, and document issues across digital channels.",
          detail: {
            overview:
              "AI assistants handle delivery inquiries, reroute requests, and issue logging across chat, email, and customer portals with seamless escalation to agents.",
            benefits: [
              "Instant resolution for common delivery questions.",
              "Structured issue capture with automated ticket creation.",
              "Integrated workflows with TMS and WMS systems.",
            ],
            outcomes: [
              "Lower contact centre volume and handle times.",
              "Consistent service quality across regions and channels.",
            ],
          },
        },
        {
          id: "partner-portal-intelligence",
          title: "Partner Portal Intelligence",
          description:
            "Self-service portals for shippers and 3PL partners with AI-guided booking, pricing, and SLA insights.",
          detail: {
            overview:
              "Partner portals provide shippers and 3PL customers with AI-guided booking, dynamic pricing insights, and SLA performance dashboards.",
            benefits: [
              "Self-service booking and documentation workflows.",
              "Transparent pricing and capacity recommendations.",
              "Performance analytics for shipper and carrier partners.",
            ],
            outcomes: [
              "Stronger partner relationships and retention.",
              "Reduced manual coordination between ops teams.",
            ],
          },
        },
        {
          id: "delivery-experience-personalisation",
          title: "Delivery Experience Personalisation",
          description:
            "Preference-aware delivery scheduling, notifications, and alternative drop-off recommendations.",
          detail: {
            overview:
              "Personalisation engines use customer preferences and historical behaviour to optimise delivery windows, notifications, and alternative drop-off options.",
            benefits: [
              "Preference-aware scheduling and notification timing.",
              "Smart alternative delivery recommendations.",
              "Higher first-attempt delivery success rates.",
            ],
            outcomes: [
              "Improved last-mile success and customer NPS.",
              "Lower redelivery and exception handling costs.",
            ],
          },
        },
      ]),
      ex: buildExperience("ex", [
        {
          id: "driver-route-copilot",
          title: "Driver & Route Copilot",
          description:
            "AI-assisted route planning, dynamic rerouting, and in-cab guidance for drivers and dispatch teams.",
          detail: {
            overview:
              "Route copilots optimise dispatch plans, suggest dynamic reroutes, and provide in-cab guidance based on traffic, weather, and SLA constraints.",
            benefits: [
              "Dynamic route optimisation with live conditions.",
              "Reduced fuel consumption and idle time.",
              "Driver-friendly mobile guidance and exception handling.",
            ],
            outcomes: [
              "Lower transportation costs per shipment.",
              "Improved on-time delivery performance.",
            ],
          },
        },
        {
          id: "warehouse-assistant-ai",
          title: "Warehouse Assistant AI",
          description:
            "Voice and mobile AI assistants guide pick, pack, and slotting tasks on the warehouse floor.",
          detail: {
            overview:
              "Warehouse assistants use voice and mobile interfaces to guide picking, packing, and slotting while surfacing anomalies and safety alerts in real time.",
            benefits: [
              "Hands-free task guidance for warehouse associates.",
              "Faster onboarding for seasonal and temporary staff.",
              "Real-time anomaly detection for inventory discrepancies.",
            ],
            outcomes: [
              "Higher pick accuracy and throughput.",
              "Reduced training time for new warehouse workers.",
            ],
          },
        },
        {
          id: "control-tower-copilot",
          title: "Control Tower Copilot",
          description:
            "Operations copilots summarise network exceptions and recommend corrective actions for planners.",
          detail: {
            overview:
              "Control tower copilots aggregate network exceptions, prioritise disruptions, and recommend corrective actions for planners and operations leaders.",
            benefits: [
              "Unified exception view across warehouses and lanes.",
              "AI-prioritised action lists for operations teams.",
              "Scenario modelling for capacity and disruption response.",
            ],
            outcomes: [
              "Faster resolution of network-wide disruptions.",
              "Better coordination between regional control towers.",
            ],
          },
        },
        {
          id: "workforce-scheduling-ai",
          title: "Workforce Scheduling AI",
          description:
            "Predictive staffing models align labour to demand across warehouses, hubs, and last-mile fleets.",
          detail: {
            overview:
              "Workforce scheduling AI forecasts demand and aligns labour across warehouses, hubs, and last-mile fleets to minimise overtime and service gaps.",
            benefits: [
              "Demand-driven shift planning and labour allocation.",
              "Reduced overtime through better capacity matching.",
              "Visibility into skills gaps and training needs.",
            ],
            outcomes: [
              "Lower labour cost per unit shipped.",
              "More reliable service levels during peak periods.",
            ],
          },
        },
      ]),
      bx: buildExperience("bx", [
        {
          id: "demand-forecasting-platform",
          title: "Demand Forecasting Platform",
          description:
            "ML forecasts by lane, SKU, and season to optimise inventory placement and transport capacity.",
          detail: {
            overview:
              "Demand forecasting platforms predict volume by lane, SKU, and season to optimise inventory positioning and transport capacity planning.",
            benefits: [
              "Accurate volume forecasts for network planning.",
              "Reduced stockouts and excess inventory holding.",
              "Integration with TMS, WMS, and ERP planning cycles.",
            ],
            outcomes: [
              "Lower working capital tied up in inventory.",
              "Better asset utilisation across the network.",
            ],
          },
        },
        {
          id: "tms-wms-integration",
          title: "TMS & WMS Integration Hub",
          description:
            "AI-orchestrated integration across transport, warehouse, and ERP systems for end-to-end visibility.",
          detail: {
            overview:
              "Integration hubs connect TMS, WMS, and ERP platforms with event-driven workflows and governed APIs for end-to-end supply chain visibility.",
            benefits: [
              "Elimination of manual data handoffs between systems.",
              "Real-time inventory and in-transit visibility.",
              "Extensible architecture for new carriers and warehouses.",
            ],
            outcomes: [
              "Faster integration of acquisitions and new sites.",
              "Lower IT maintenance cost for point-to-point interfaces.",
            ],
          },
        },
        {
          id: "supply-chain-analytics",
          title: "Supply Chain Analytics",
          description:
            "Unified dashboards for cost, SLA, carbon footprint, and network performance across operations.",
          detail: {
            overview:
              "Supply chain analytics unify cost, SLA, sustainability, and network KPIs into executive and operational dashboards for continuous improvement.",
            benefits: [
              "Single source of truth for network performance.",
              "Drill-down analytics by lane, customer, and facility.",
              "Carbon and sustainability metrics alongside cost KPIs.",
            ],
            outcomes: [
              "Data-driven network optimisation decisions.",
              "Improved accountability for SLA and cost targets.",
            ],
          },
        },
        {
          id: "automation-orchestration",
          title: "Automation Orchestration",
          description:
            "Agentic workflows connect booking, customs, billing, and exception handling across the logistics lifecycle.",
          detail: {
            overview:
              "Agentic automation orchestrates booking, customs, billing, and exception handling workflows across the logistics lifecycle with human oversight gates.",
            benefits: [
              "End-to-end workflow automation with audit trails.",
              "Reduced manual touchpoints in order-to-cash cycles.",
              "Configurable business rules for regional operations.",
            ],
            outcomes: [
              "Lower cost per shipment processed.",
              "Faster scaling of operations without linear headcount growth.",
            ],
          },
        },
      ]),
    },
  },
};

export const getIndustryExperienceMeta = (industryId) =>
  industryExperiences[industryId] ?? industryExperiences.education;

export const getAllIndustryExperienceItems = (industryId) => {
  const meta = getIndustryExperienceMeta(industryId);
  return ["cx", "ex", "bx"].flatMap((pillarId) => meta.pillars[pillarId] ?? []);
};

export const getIndustryExperienceItem = (industryId, solutionId) =>
  getAllIndustryExperienceItems(industryId).find((item) => item.id === solutionId);

export const getIndustryExperiencePillar = (pillarId) =>
  experiencePillars[pillarId] ?? experiencePillars.cx;
