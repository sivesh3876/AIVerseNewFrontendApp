import Breadcrumb from "../components/Breadcrumb";
import ResourcesHub from "../components/ResourcesHub";

const CaseStudiesPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Case Studies" },
        ]}
      />
      <ResourcesHub
        eyebrow="Resources"
        title="Case Studies"
        description="Real-world stories of how organizations transform operations and customer experiences with AI Verse solutions."
        category="case-studies"
      />
    </>
  );
};

export default CaseStudiesPage;
