import { useCallback, useEffect, useState } from "react";
import {
  fetchSuccessStories,
  fetchSuccessStory,
} from "../../services/successStoriesApiService";
import { normalizeSuccessStory } from "../../utils/successStoryAdminUtils";

export const useSuccessStories = ({
  includeUnpublished = true,
  autoLoad = true,
} = {}) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const loadStories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSuccessStories({ includeUnpublished });
      const normalized = data.map(normalizeSuccessStory);
      setStories(normalized);
      return normalized;
    } catch (loadError) {
      setStories([]);
      setError(loadError.message || "Unable to load success stories.");
      throw loadError;
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  const loadStory = useCallback(async ({ id, slug }) => {
    setLoading(true);
    setError("");
    try {
      return normalizeSuccessStory(
        await fetchSuccessStory({ id, slug, includeUnpublished: true }),
      );
    } catch (loadError) {
      setError(loadError.message || "Unable to load the success story.");
      throw loadError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return undefined;
    let active = true;

    fetchSuccessStories({ includeUnpublished })
      .then((data) => {
        if (!active) return;
        setStories(data.map(normalizeSuccessStory));
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setStories([]);
        setError(loadError.message || "Unable to load success stories.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [autoLoad, includeUnpublished]);

  const replaceStory = useCallback((updatedStory) => {
    const normalized = normalizeSuccessStory(updatedStory);
    setStories((current) =>
      current.map((story) =>
        String(story.id) === String(normalized.id) ? normalized : story,
      ),
    );
    return normalized;
  }, []);

  return {
    stories,
    loading,
    error,
    loadStories,
    loadStory,
    replaceStory,
    setStories,
  };
};
