import { selectTopOrderedSolutions } from "../utils/solutionMapper";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

export const getUsecasesApiBaseUrl = () => API_BASE_URL;

export const fetchAllUseCases = async () => {
  const response = await fetch(`${API_BASE_URL}/get-usecases`);
  const result = await response.json();

  if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to fetch solutions");
  }

  return result.data;
};

export const fetchTopOrderedSolutions = async (limit = 8) => {
  const data = await fetchAllUseCases();
  return selectTopOrderedSolutions(data, limit);
};

export const fetchUseCaseById = async (solutionId) => {
  const response = await fetch(`${API_BASE_URL}/get-usecases?id=${solutionId}`);
  const result = await response.json();

  if (
    !response.ok ||
    result.status !== "success" ||
    !result.data
  ) {
    throw new Error(result.message || "Solution not found");
  }

  return result.data;
};

export const deleteUseCase = async (solutionId) => {
  const url = `${API_BASE_URL}/delete-usecase?id=${solutionId}`;

  const parseResponse = async (response) => {
    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }
    return { response, result };
  };

  const attemptDelete = async (method) => {
    const { response, result } = await parseResponse(
      await fetch(url, { method }),
    );
    return { response, result };
  };

  let { response, result } = await attemptDelete("POST");

  if (response.status === 405) {
    ({ response, result } = await attemptDelete("DELETE"));
  }

  if (response.ok && result.status === "success") {
    return { success: true, message: result.message || "Solution deleted successfully." };
  }

  if (response.status === 404) {
    return {
      success: true,
      message: result.message || "Solution was already removed from the server.",
    };
  }

  throw new Error(result.message || "Failed to delete solution from server.");
};
