import ExperienceDetailLayout from "../components/ExperienceDetail/ExperienceDetailLayout";
import {
  employeeExperienceMeta,
  employeeJourneyStages,
} from "../data/employeeExperienceData";

const EmployeeExperiencePage = () => (
  <ExperienceDetailLayout
    breadcrumbLabel="Employee Experience"
    meta={employeeExperienceMeta}
    stages={employeeJourneyStages}
  />
);

export default EmployeeExperiencePage;
