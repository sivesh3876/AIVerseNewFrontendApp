import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import SuccessStoriesHub from "../components/SuccessStories/SuccessStoriesHub";
import { getSuccessStoryById } from "../components/SuccessStories/successStoriesData";

const SuccessStoriesPage = () => {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("story");
  const story = storyId ? getSuccessStoryById(storyId) : null;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Success Stories", to: "/success-stories" },
          ...(story ? [{ label: story.client }] : []),
        ]}
      />
      <SuccessStoriesHub />
    </>
  );
};

export default SuccessStoriesPage;
