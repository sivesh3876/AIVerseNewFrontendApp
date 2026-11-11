import { getAdminAuthToken } from "../utils/adminAuth";

export const getAdminAuthHeaders = (extra = {}) => {
  const token = getAdminAuthToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
