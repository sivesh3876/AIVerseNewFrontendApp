const PRODUCTION_API_BASE =
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  const useDirectInDev = import.meta.env.VITE_API_USE_DIRECT_URL === "true";

  if (import.meta.env.DEV && !useDirectInDev) {
    return "/api";
  }

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return PRODUCTION_API_BASE;
};

export const getApiProxyTarget = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configured && configured.startsWith("http")) {
    return configured.replace(/\/api\/?$/, "");
  }

  return PRODUCTION_API_BASE.replace(/\/api\/?$/, "");
};

export const buildApiPath = (endpoint = "", query = {}) => {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const normalizedEndpoint = String(endpoint).replace(/^\//, "");
  const path = `${base}/${normalizedEndpoint}`.replace(/([^:]\/)\/+/g, "$1");

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value != null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};
