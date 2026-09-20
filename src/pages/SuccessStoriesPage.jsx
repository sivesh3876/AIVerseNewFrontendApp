import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import SuccessStoriesHub from "../components/SuccessStories/SuccessStoriesHub";
import { fetchSuccessStory } from "../services/successStoriesApiService";
import { normalizeSuccessStory } from "../utils/successStoryAdminUtils";

const SuccessStoriesPage = () => {
  const [searchParams] = useSearchParams();
  const storySlug = searchParams.get("story");
  const [breadcrumbStory, setBreadcrumbStory] = useState({
    slug: "",
    label: "",
  });

  useEffect(() => {
    let isCurrent = true;

    if (!storySlug) {
      return () => {
        isCurrent = false;
      };
    }

    fetchSuccessStory({ slug: storySlug })
      .then((data) => {
        const rawStory =
          data?.story ??
          (data?.data && !Array.isArray(data.data) ? data.data : data);
        const rawStatus =
          rawStory?.status ??
          rawStory?.Status ??
          rawStory?.recordStatus ??
          rawStory?.PublicationStatus;
        const isPublished =
          rawStory &&
          (!rawStatus || String(rawStatus).toLowerCase() === "published");

        if (isCurrent && isPublished) {
          const story = normalizeSuccessStory(rawStory);
          setBreadcrumbStory({
            slug: storySlug,
            label: story.client || story.clientName || story.title || "",
          });
        }
      })
      .catch(() => {
        if (isCurrent) setBreadcrumbStory({ slug: storySlug, label: "" });
      });

    return () => {
      isCurrent = false;
    };
  }, [storySlug]);

  const storyLabel =
    breadcrumbStory.slug === storySlug ? breadcrumbStory.label : "";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Success Stories", to: "/success-stories" },
          ...(storyLabel ? [{ label: storyLabel }] : []),
        ]}
      />
      <SuccessStoriesHub />
    </>
  );
};

export default SuccessStoriesPage;
