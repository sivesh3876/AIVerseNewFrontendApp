const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

const DEMO_REQUEST_ENDPOINT =
  import.meta.env.VITE_REQUEST_DEMO_EMAIL_ENDPOINT || "send-demo-request";

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY || "";

export const REQUEST_DEMO_EMAIL_SETUP_MESSAGE =
  "Demo request API is not configured yet. Add VITE_API_BASE_URL in your .env file and restart the app.";

export const isRequestDemoEmailConfigured = () => Boolean(API_BASE_URL.trim());

const parseJsonResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const assertSuccessResponse = (response, result, fallbackMessage) => {
  if (!response.ok || (result.status && result.status !== "success")) {
    throw new Error(
      result.message || fallbackMessage || `Server returned ${response.status}.`,
    );
  }
};

const buildDemoRequestUrl = () => {
  const url = new URL(`${API_BASE_URL}/${DEMO_REQUEST_ENDPOINT}`);

  if (EMAIL_API_KEY) {
    url.searchParams.set("code", EMAIL_API_KEY);
  }

  return url.toString();
};

const buildLegacyEmailUrl = (endpoint) => {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);

  if (EMAIL_API_KEY) {
    url.searchParams.set("code", EMAIL_API_KEY);
  }

  return url.toString();
};

export const parseSolutionId = (value) => {
  if (value == null || value === "") {
    return null;
  }

  const normalized = String(value).trim();
  const withoutPrefix = normalized.toLowerCase().startsWith("api-")
    ? normalized.slice(4).trim()
    : normalized;

  if (!/^\d+$/.test(withoutPrefix)) {
    return null;
  }

  return Number(withoutPrefix);
};

export const buildRequestDemoEmailPayload = (capability, form = {}) => {
  const solutionId = parseSolutionId(capability?.id);

  return {
    FullName: (form.name || "").trim(),
    Email: (form.email || "").trim(),
    Company: (form.company || "").trim(),
    Phone: (form.phone || "").trim(),
    Message: (form.message || "").trim(),
    SolutionTitle: capability?.title || "",
    ...(solutionId != null ? { SolutionId: solutionId } : {}),
  };
};

export const buildRequestDemoSuccessMessage = (result = {}) => {
  const toAddresses = result?.data?.notified_to || [];
  const ccAddresses = result?.data?.notified_cc || [];

  if (toAddresses.length === 0 && ccAddresses.length === 0) {
    return result?.message || "Demo request submitted successfully.";
  }

  const parts = [];
  if (toAddresses.length > 0) {
    parts.push(`To: ${toAddresses.join(", ")}`);
  }
  if (ccAddresses.length > 0) {
    parts.push(`CC: ${ccAddresses.join(", ")}`);
  }

  return `Demo request sent (${parts.join("; ")}).`;
};

const postDemoRequest = async (payload) => {
  const response = await fetch(buildDemoRequestUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseJsonResponse(response);
  assertSuccessResponse(
    response,
    result,
    `Failed to submit demo request. Server returned ${response.status}.`,
  );

  return result;
};

export const buildContactEmailPayload = (form = {}) => ({
  FullName: (form.name || "").trim(),
  Email: (form.email || "").trim(),
  Company: (form.company || "").trim(),
  Phone: (form.phone || "").trim(),
  Message: (form.message || "").trim(),
  Subject: "Contact Inquiry: AI Verse",
});

export const buildContactSuccessMessage = (result = {}) =>
  result?.message || "Message sent successfully.";

export const buildNewsletterSubscribePayload = (email = "") => ({
  Email: email.trim(),
});

export const buildNewsletterSubscribeSuccessMessage = (result = {}) =>
  result?.message || "You're subscribed! Check your inbox for AI insights.";

const postJsonRequest = async (endpoint, payload, fallbackMessage) => {
  const response = await fetch(buildLegacyEmailUrl(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseJsonResponse(response);
  assertSuccessResponse(response, result, fallbackMessage);
  return result;
};

export const sendNewsletterSubscribe = async ({ email }) => {
  if (!isRequestDemoEmailConfigured()) {
    throw new Error(REQUEST_DEMO_EMAIL_SETUP_MESSAGE);
  }

  const payload = buildNewsletterSubscribePayload(email);
  const result = await postJsonRequest(
    "subscribe-email",
    payload,
    "Failed to subscribe. Please try again.",
  );

  return {
    ...result,
    successMessage: buildNewsletterSubscribeSuccessMessage(result),
  };
};

export const sendContactEmail = async ({ form }) => {
  if (!isRequestDemoEmailConfigured()) {
    throw new Error(REQUEST_DEMO_EMAIL_SETUP_MESSAGE);
  }

  const payload = buildContactEmailPayload(form);
  const result = await postJsonRequest(
    "contact-us",
    payload,
    "Failed to send message. Please try again.",
  );

  return {
    ...result,
    successMessage: buildContactSuccessMessage(result),
  };
};

export const sendRequestDemoEmail = async ({ capability, form }) => {
  if (!isRequestDemoEmailConfigured()) {
    throw new Error(REQUEST_DEMO_EMAIL_SETUP_MESSAGE);
  }

  const payload = buildRequestDemoEmailPayload(capability, form);
  const result = await postDemoRequest(payload);

  return {
    ...result,
    successMessage: buildRequestDemoSuccessMessage(result),
  };
};
