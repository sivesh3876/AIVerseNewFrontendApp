import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import LearnExplore from "../components/LearnExplore";
import {
  getResourceById,
  getTrackById,
} from "../components/LearnExplore/learnExploreData";

const LearnExplorePage = () => {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("article");
  const trackId = searchParams.get("track");
  const resource = articleId ? getResourceById(articleId) : null;
  const track = resource
    ? getTrackById(resource.trackId)
    : trackId
      ? getTrackById(trackId)
      : null;

  const breadcrumbLabel = resource?.title ?? track?.label ?? "Learn & Explore";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Learn & Explore", to: "/learn-explore" },
          { label: breadcrumbLabel },
        ]}
      />
      <LearnExplore />
    </>
  );
};

export default LearnExplorePage;
