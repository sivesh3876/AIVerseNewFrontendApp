import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import AICapabilitiesExplore from "../components/AICapabilitiesExplore";
import { getCapabilityById } from "../components/AICapabilitiesExplore/aiCapabilitiesData";

const AICapabilitiesPage = () => {
  const [searchParams] = useSearchParams();
  const activeCapability = getCapabilityById(searchParams.get("capability"));

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "AI Capabilities", to: "/ai-capabilities" },
          { label: activeCapability.title },
        ]}
      />
      <AICapabilitiesExplore />
    </>
  );
};

export default AICapabilitiesPage;
