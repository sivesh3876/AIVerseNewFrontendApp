import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import IndustryExplore from "../components/IndustryExplore";
import { getIndustryById } from "../components/IndustryExplore/industrySolutionsData";

const IndustrySolutionsPage = () => {
  const [searchParams] = useSearchParams();
  const activeIndustry = getIndustryById(searchParams.get("industry"));

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Industry Solutions", to: "/industry-solutions" },
          { label: activeIndustry.title },
        ]}
      />
      <IndustryExplore />
    </>
  );
};

export default IndustrySolutionsPage;
