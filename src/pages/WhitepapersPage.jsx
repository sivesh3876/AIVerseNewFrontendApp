import Breadcrumb from "../components/Breadcrumb";
import ResourcesHub from "../components/ResourcesHub";

const WhitepapersPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Whitepapers" },
        ]}
      />
      <ResourcesHub
        eyebrow="Resources"
        title="Whitepapers"
        description="In-depth technical and strategic whitepapers on responsible AI, RAG architecture, and enterprise deployment."
        category="whitepapers"
      />
    </>
  );
};

export default WhitepapersPage;
