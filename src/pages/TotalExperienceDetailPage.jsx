import ExperienceDetailLayout from "../components/ExperienceDetail/ExperienceDetailLayout";
import {
  totalExperienceDetailMeta,
  totalExperienceJourneyStages,
} from "../data/totalExperienceDetailData";

const TotalExperienceDetailPage = () => (
  <ExperienceDetailLayout
    breadcrumbLabel="Total Experience"
    meta={totalExperienceDetailMeta}
    stages={totalExperienceJourneyStages}
  />
);

export default TotalExperienceDetailPage;
