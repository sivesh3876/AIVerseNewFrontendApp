import {
  CERTIFICATIONS_CHANGED_EVENT,
  loadAdminCertifications,
} from "./adminCertificationStorage";
import {
  CERTIFIED_PROFESSIONALS_CHANGED_EVENT,
  loadCertifiedProfessionals,
} from "./adminCertifiedProfessionalStorage";
import { getProviderBadgeColor } from "./providerBadgeColors";
import { stripHtml } from "./htmlContent";

export const PUBLIC_CERTIFICATION_EVENTS = [
  CERTIFICATIONS_CHANGED_EVENT,
  CERTIFIED_PROFESSIONALS_CHANGED_EVENT,
];

export const isPublicCertification = (certification) => {
  if (!certification) return false;

  const isPublished =
    certification.publish === "Yes" ||
    certification.publicationStatus === "Published";

  // Published certifications are visible on the public Certification Details page
  return isPublished && certification.status !== "Inactive";
};

export const getPublicCertificationById = (certificationId) => {
  const certification = loadAdminCertifications().find(
    (item) => item.id === certificationId,
  );

  if (!certification || !isPublicCertification(certification)) {
    return null;
  }

  return certification;
};

export const getPublicCertifications = () =>
  loadAdminCertifications().filter(isPublicCertification);

export const getPublicCertifiedHolders = (certificationId) =>
  loadCertifiedProfessionals(certificationId).filter(
    (professional) => professional.status === "Published",
  );

export const toPublicHolderCard = (professional, certification) => {
  const provider =
    professional.provider || certification?.provider || "Certification";
  const level = certification?.level || "";
  const category = certification?.category || "";
  const certificationName =
    professional.certificationName || certification?.name || "";
  const certificateLink =
    professional.certificatePdf ||
    professional.certificateVerificationUrl ||
    professional.certificateUrl ||
    "";

  return {
    id: professional.id,
    certificationId: certification?.id || professional.certificationId || "",
    name: professional.employeeName,
    employeeId: professional.employeeId,
    designation: professional.designation,
    department: professional.department,
    officeLocation: professional.officeLocation,
    email: professional.email,
    completionDate: professional.completionDate,
    credentialId: professional.credentialId,
    score: professional.examScore || professional.score,
    percentage: professional.percentage,
    profilePhoto: professional.profilePhoto,
    linkedInUrl: professional.linkedInUrl,
    certificateUrl: certificateLink,
    certificationName,
    provider,
    category,
    level,
    badge: level || provider,
    badgeColor: getProviderBadgeColor(provider),
  };
};

export const getAllPublicCertifiedHolders = () => {
  const certifications = getPublicCertifications();

  return certifications
    .flatMap((certification) =>
      getPublicCertifiedHolders(certification.id).map((professional) =>
        toPublicHolderCard(professional, certification),
      ),
    )
    .sort((a, b) => {
      const aTime = a.completionDate ? new Date(a.completionDate).getTime() : 0;
      const bTime = b.completionDate ? new Date(b.completionDate).getTime() : 0;
      return bTime - aTime;
    });
};

export const getPublicCertificationDetailsPage = (certificationId) => {
  // Hub / Learn & Explore: show every published professional across all certifications
  if (!certificationId) {
    const holders = getAllPublicCertifiedHolders();
    return {
      certification: null,
      holders,
      isHub: true,
    };
  }

  const certification = getPublicCertificationById(certificationId);
  if (!certification) {
    return null;
  }

  // Single-cert URL still shows ALL published professionals on Learn & Explore
  const holders = getAllPublicCertifiedHolders();

  return {
    certification: {
      ...certification,
      plainDescription: stripHtml(certification.description),
    },
    holders,
    isHub: true,
  };
};

/** @deprecated Use getPublicCertificationDetailsPage */
export const getPublicCertificationHoldersPage =
  getPublicCertificationDetailsPage;
