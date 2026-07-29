import { buildApiPath, getApiBaseUrl } from "./apiConfig";
import { getAdminSession } from "../utils/adminAuth";
import {
  applyAuthenticatedReaction,
  getSolutionEngagement,
  getUserReaction,
} from "../utils/solutionEngagementStorage";

const REACTION_ENDPOINT =
  import.meta.env.VITE_SOLUTION_REACTION_ENDPOINT || "solution-reaction";

const AUTH_REQUIRED_MESSAGE = "Please sign in to like or dislike this solution.";

const parseJsonResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

/**
 * Submits like/dislike for the authenticated user.
 * Request body: { solutionId, action } only.
 * User identity comes from Authorization Bearer token.
 */
export const submitSolutionReaction = async ({ solutionId, action }) => {
  const session = getAdminSession();
  if (!session?.email || !session?.token) {
    const error = new Error(AUTH_REQUIRED_MESSAGE);
    error.code = "AUTH_REQUIRED";
    throw error;
  }

  const normalizedAction = String(action || "").toLowerCase();
  if (normalizedAction !== "like" && normalizedAction !== "dislike") {
    throw new Error("Action must be like or dislike.");
  }

  const payload = {
    solutionId: String(solutionId ?? "").replace(/^api-/i, ""),
    action: normalizedAction,
  };

  // Prefer backend when API base is configured; always sync local store for admin UI.
  if (getApiBaseUrl().trim()) {
    try {
      const response = await fetch(buildApiPath(REACTION_ENDPOINT), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await parseJsonResponse(response);

      if (response.ok && (!result.status || result.status === "success")) {
        const local = applyAuthenticatedReaction(payload.solutionId, normalizedAction, {
          email: session.email,
          name: session.name || session.email,
          userId: session.email,
        });

        return {
          ...local,
          message:
            result.message ||
            (normalizedAction === "like"
              ? "Liked successfully."
              : "Disliked successfully."),
          source: "api",
        };
      }

      // If API rejects because already liked, surface that without double-counting locally.
      if (response.status === 409 || result.code === "ALREADY_REACTED") {
        const engagement = getSolutionEngagement(payload.solutionId);
        return {
          engagement,
          status: normalizedAction === "like" ? "already_liked" : "already_disliked",
          message:
            result.message ||
            (normalizedAction === "like"
              ? "You already liked this solution."
              : "You already disliked this solution."),
          source: "api",
        };
      }
    } catch {
      // Fall through to local auth-based reaction when API is unavailable.
    }
  }

  const local = applyAuthenticatedReaction(payload.solutionId, normalizedAction, {
    email: session.email,
    name: session.name || session.email,
    userId: session.email,
  });

  const messages = {
    liked: "Liked successfully.",
    already_liked: "You already liked this solution.",
    disliked: "Disliked successfully.",
    already_disliked: "You already disliked this solution.",
    switched_to_like: "Changed to like successfully.",
    switched_to_dislike: "Changed to dislike successfully.",
  };

  return {
    ...local,
    message: messages[local.status] || "Reaction saved.",
    source: "local",
  };
};

export const getCurrentUserReaction = (solutionId) => {
  const session = getAdminSession();
  if (!session?.email) return null;
  return getUserReaction(solutionId, session.email);
};
