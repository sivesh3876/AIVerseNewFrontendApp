import { useCallback, useEffect, useState } from "react";
import {
  BLOGS_CHANGED_EVENT,
  loadAdminBlogs,
} from "../../utils/adminBlogStorage";

export const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = useCallback(() => {
    try {
      setLoading(true);
      setError("");
      setBlogs(loadAdminBlogs());
    } catch (loadError) {
      setError(loadError.message || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  useEffect(() => {
    const handleRefresh = () => loadBlogs();

    window.addEventListener(BLOGS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener(BLOGS_CHANGED_EVENT, handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, [loadBlogs]);

  const handleBlogUpdated = useCallback((updatedBlog) => {
    setBlogs((prev) =>
      prev.map((item) => (item.id === updatedBlog.id ? updatedBlog : item)),
    );
  }, []);

  return {
    blogs,
    loading,
    error,
    loadBlogs,
    handleBlogUpdated,
  };
};
