import {
  enterpriseServicesData,
  getEnterpriseServiceById,
} from "../components/CustomerCommunicationManagement/enterpriseServicesData";
import {
  getServiceIdForDomain,
  mapApiSolutionToCapability,
} from "../utils/solutionMapper";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getStaticSolutionId = (serviceId, capabilityTitle) =>
  `${serviceId}-${slugify(capabilityTitle)}`;

const mapPerson = (person) => ({
  name: person?.name || "Not assigned",
  title: person?.title || "",
  email: person?.email || "",
  color: person?.color || "teal",
});

const capabilityToCard = (service, capability) => ({
  id: getStaticSolutionId(service.id, capability.title),
  title: capability.title,
  icon: capability.icon,
  iconKey: capability.iconKey || "brain",
  description: capability.description,
  techStack: capability.techStack || [],
  coe: capability.coe,
  evangelists: capability.evangelists || [],
  demoLink: capability.demoLink || "",
  recordedDemoLink: capability.recordedDemoLink || "",
  isApiSolution: false,
});

const buildStaticSolutions = () => {
  const solutions = [];

  enterpriseServicesData.forEach((service) => {
    service.capabilities.forEach((capability) => {
      const id = getStaticSolutionId(service.id, capability.title);

      solutions.push({
        id,
        title: capability.title,
        serviceLine: service.id,
        serviceLineLabel: service.label,
        industry: null,
        shortDescription: capability.description,
        detailedDescription: capability.description,
        keyBenefits: service.features,
        capabilities: service.capabilities.map((item) =>
          capabilityToCard(service, item),
        ),
        techStack: capability.techStack || [],
        coe: [mapPerson(capability.coe)],
        aiEvangelists: (capability.evangelists || []).map(mapPerson),
        demoLink: capability.demoLink || "",
        recordedDemoLink: capability.recordedDemoLink || "",
        image: null,
        icon: capability.icon,
        iconKey: capability.iconKey || "brain",
        primaryCapability: capabilityToCard(service, capability),
      });
    });
  });

  return solutions;
};

export const solutionsCatalog = buildStaticSolutions();

export const getSolutionById = (id) =>
  solutionsCatalog.find((solution) => solution.id === id) || null;

export const getAllSolutions = () => solutionsCatalog;

export const solutionToCapabilityCard = (solution) => {
  if (!solution) return null;

  if (solution.primaryCapability) {
    return solution.primaryCapability;
  }

  return {
    id: solution.id,
    title: solution.title,
    iconKey: solution.iconKey || "brain",
    description: solution.shortDescription || solution.detailedDescription,
    techStack:
      solution.techStack?.length > 0
        ? solution.techStack
        : [{ name: "Not specified", label: "Technology" }],
    coe: {
      name: solution.coe?.[0]?.name || "Not assigned",
      title: solution.coe?.[0]?.title || "Center of Excellence",
      color: solution.coe?.[0]?.color || "teal",
      email: solution.coe?.[0]?.email || "",
    },
    evangelists:
      solution.aiEvangelists?.length > 0
        ? solution.aiEvangelists.map((person, index) => ({
            name: person.name,
            title: person.title || "AI Evangelist",
            color: person.color || ["teal", "navy", "orange", "sky"][index % 4],
            email: person.email || "",
          }))
        : [
            {
              name: "Not assigned",
              title: "AI Evangelist",
              color: "sky",
              email: "",
            },
          ],
    demoLink: solution.demoLink || "",
    recordedDemoLink: solution.recordedDemoLink || solution.demoLink || "",
    isApiSolution: Boolean(solution.isApiSolution),
  };
};

export const mapApiSolutionToDetail = (
  apiSolution,
  { evangelistDirectory = [], solutionOwners = [], businessDomains = [] } = {},
) => {
  const capability = mapApiSolutionToCapability(apiSolution, {
    evangelistDirectory,
    solutionOwners,
  });

  const serviceLine =
    getServiceIdForDomain(apiSolution.BusinessDomain) || "agentic-automation";
  const service = getEnterpriseServiceById(serviceLine);
  const domain = businessDomains.find(
    (entry) => entry.DomainCode === apiSolution.BusinessDomain,
  );

  return {
    id: `api-${apiSolution.ID}`,
    title: apiSolution.Title || "Untitled Solution",
    serviceLine,
    serviceLineLabel: service.label,
    industry: domain?.DomainName || apiSolution.BusinessDomain || null,
    shortDescription: apiSolution.SolutionContext || "",
    detailedDescription: apiSolution.SolutionContext || "",
    keyBenefits: service.features,
    capabilities: [capability],
    techStack: capability.techStack,
    coe: [
      mapPerson({
        ...capability.coe,
        email: capability.coe.email || "",
      }),
    ],
    aiEvangelists: capability.evangelists.map(mapPerson),
    demoLink: capability.recordedDemoLink || "",
    recordedDemoLink: capability.recordedDemoLink || "",
    image: null,
    icon: null,
    iconKey: capability.iconKey || "brain",
    primaryCapability: {
      ...capability,
      isApiSolution: true,
    },
    isApiSolution: true,
  };
};
