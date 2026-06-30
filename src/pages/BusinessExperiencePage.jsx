import ExperienceDetailLayout from "../components/ExperienceDetail/ExperienceDetailLayout";
import {
  businessExperienceMeta,
  businessJourneyStages,
} from "../data/businessExperienceData";

const BusinessExperiencePage = () => (
  <ExperienceDetailLayout
    breadcrumbLabel="Business Experience"
    meta={businessExperienceMeta}
    stages={businessJourneyStages}
  />
);

export default BusinessExperiencePage;
