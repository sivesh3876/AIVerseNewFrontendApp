const PROVIDER_BADGE_COLORS = {
  microsoft: "#4D90E3",
  azure: "#4D90E3",
  aws: "#EF8E29",
  "amazon web services": "#EF8E29",
  amazon: "#EF8E29",
  "google cloud": "#18E0CC",
  google: "#18E0CC",
  gcp: "#18E0CC",
  cisco: "#3A8D9D",
  oracle: "#F5B800",
  ibm: "#3A8D9D",
  databricks: "#EF8E29",
};

export const getProviderBadgeColor = (provider = "") => {
  const key = String(provider).trim().toLowerCase();
  if (!key) return "#3A8D9D";
  return PROVIDER_BADGE_COLORS[key] || "#3A8D9D";
};
