import ExperienceDetailLayout from "../components/ExperienceDetail/ExperienceDetailLayout";
import {
  customerExperienceMeta,
  customerJourneyStages,
} from "../data/customerExperienceData";

const CustomerExperiencePage = () => (
  <ExperienceDetailLayout
    breadcrumbLabel="Customer Experience"
    meta={customerExperienceMeta}
    stages={customerJourneyStages}
  />
);

export default CustomerExperiencePage;
