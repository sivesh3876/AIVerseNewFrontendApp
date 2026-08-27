import {
  getEnterpriseServiceById,
} from "../components/CustomerCommunicationManagement/enterpriseServicesData";
import { getIndustryByDomainCode } from "../components/IndustryExplore/industrySolutionsData";
import {
  getServiceIdForDomain,
  isIndustryBusinessDomain,
  mapApiSolutionToCapability,
  resolveSolutionClient,
} from "../utils/solutionMapper";

const mapPerson = (person) => ({
  name: person?.name || "Not assigned",
  title: person?.title || "",
  email: person?.email || "",
  color: person?.color || "teal",
});

const resolveDetailPlacement = (businessDomain, businessDomains = []) => {
  const domain = businessDomains.find(
    (entry) => entry.DomainCode === businessDomain,
  );
  const industryMeta = getIndustryByDomainCode(businessDomain);
  const isIndustry = isIndustryBusinessDomain(businessDomain);
  const serviceLine = isIndustry
    ? null
    : getServiceIdForDomain(businessDomain) || "agentic-automation";
  const service = serviceLine ? getEnterpriseServiceById(serviceLine) : null;

  return {
    businessDomain: businessDomain || null,
    serviceLine,
    serviceLineLabel:
      service?.label || industryMeta?.title || domain?.DomainName || businessDomain || "",
    industry: domain?.DomainName || industryMeta?.title || businessDomain || null,
    keyBenefits: service?.features || industryMeta?.features || [],
  };
};

export const solutionToCapabilityCard = (solution) => {
  if (!solution) return null;

  if (solution.primaryCapability) {
    return {
      ...solution.primaryCapability,
      documents:
        solution.primaryCapability.documents?.length > 0
          ? solution.primaryCapability.documents
          : solution.documents || [],
    };
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
    client: solution.client || "",
    aiFoundation: solution.aiFoundation || [],
    documents: solution.documents || [],
    isApiSolution: Boolean(solution.isApiSolution),
  };
};

export const buildDetailFromCapability = (capability, { businessDomains = [] } = {}) => {
  if (!capability) return null;

  const placement = resolveDetailPlacement(
    capability.businessDomain,
    businessDomains,
  );

  return {
    id: capability.id,
    title: capability.title,
    serviceLine: placement.serviceLine,
    serviceLineLabel: placement.serviceLineLabel,
    industry: placement.industry,
    businessDomain: placement.businessDomain,
    client: capability.client || "",
    aiFoundation: capability.aiFoundation || [],
    shortDescription: capability.description || "",
    detailedDescription: capability.description || "",
    keyBenefits: placement.keyBenefits,
    techStack: capability.techStack || [],
    coe: [mapPerson(capability.coe)],
    aiEvangelists: (capability.evangelists || []).map(mapPerson),
    demoLink: capability.recordedDemoLink || "",
    recordedDemoLink: capability.recordedDemoLink || "",
    iconKey: capability.iconKey || "brain",
    primaryCapability: capability,
    isApiSolution: Boolean(capability.isApiSolution),
    documents: capability.documents || [],
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

  const placement = resolveDetailPlacement(
    apiSolution.BusinessDomain,
    businessDomains,
  );

  return {
    id: `api-${apiSolution.ID}`,
    title: apiSolution.Title || "Untitled Solution",
    serviceLine: placement.serviceLine,
    serviceLineLabel: placement.serviceLineLabel,
    industry: placement.industry,
    businessDomain: placement.businessDomain,
    client: resolveSolutionClient(apiSolution),
    aiFoundation: capability.aiFoundation || [],
    shortDescription: apiSolution.SolutionContext || "",
    detailedDescription: apiSolution.SolutionContext || "",
    keyBenefits: placement.keyBenefits,
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
    documents: capability.documents || [],
  };
};
