import Breadcrumb from "../components/Breadcrumb";
import ResourcesHub from "../components/ResourcesHub";

const BlogsPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Resources", to: "/learn-explore" },
          { label: "Blogs" },
        ]}
      />
      <ResourcesHub
        eyebrow="Resources"
        title="Blogs & Insights"
        description="Expert perspectives on enterprise AI adoption, trends, guides, and research from the AI Verse team."
        category="blogs"
      />
    </>
  );
};

export default BlogsPage;
