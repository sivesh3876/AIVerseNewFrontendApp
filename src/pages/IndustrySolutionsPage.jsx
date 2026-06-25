import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import IndustryExplore from "../components/IndustryExplore";
import { getIndustryById } from "../components/IndustryExplore/industrySolutionsData";
import { getIndustryExperienceItem } from "../components/IndustryExplore/industryExperiencesData";

const IndustrySolutionsPage = () => {
  const [searchParams] = useSearchParams();
  const industryId = searchParams.get("industry");
  const solutionId = searchParams.get("solution");
  const activeIndustry = getIndustryById(industryId);
  const activeSolution = solutionId
    ? getIndustryExperienceItem(activeIndustry.id, solutionId)
    : null;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Industry Solutions", to: "/industry-solutions" },
          { label: activeIndustry.title, to: `/industry-solutions?industry=${activeIndustry.id}` },
          ...(activeSolution ? [{ label: activeSolution.title }] : []),
        ]}
      />
      <IndustryExplore />
    </>
  );
};

export default IndustrySolutionsPage;
