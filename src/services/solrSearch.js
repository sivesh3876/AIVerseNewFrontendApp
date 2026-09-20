import { buildApiPath } from "./apiConfig";

const PRODUCTION_HOST = "aiverse.espire.com";

export const isSolrSearchEnabled = () => {
  const flag = import.meta.env.VITE_SOLR_SEARCH_ENABLED;
  if (flag === "true") return true;
  if (flag === "false") return false;
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  return window.location.hostname === PRODUCTION_HOST;
};

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const searchSolr = async (query, limit = 10) => {
  const trimmed = String(query || "").trim();
  if (!trimmed) return [];

  const response = await fetch(
    buildApiPath("solr-search", { q: trimmed, limit }),
  );
  const result = await parseJson(response);

  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Solr search is unavailable");
  }

  return result.data.map((item) => ({
    id: item.id,
    title: item.title || "",
    subtitle: item.subtitle || item.type || "",
    description: item.description || "",
    path: item.path || "/explore-solutions",
    type: item.type || "page",
    score: item.score || 0,
  }));
};
