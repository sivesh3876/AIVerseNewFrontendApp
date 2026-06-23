import { getRequestDemoRecipientEmails, getRequestDemoRecipientNames } from "../utils/solutionMapper";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

const EMAIL_ENDPOINT =
  import.meta.env.VITE_REQUEST_DEMO_EMAIL_ENDPOINT || "send-demo-request";

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY || "";
const CONTACT_RECIPIENT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "info@aiverse.com";

export const REQUEST_DEMO_EMAIL_SETUP_MESSAGE =
  "Email API is not configured yet. Add VITE_EMAIL_API_KEY in your .env file and restart the app to enable Send Mail.";

export const isRequestDemoEmailConfigured = () => Boolean(EMAIL_API_KEY.trim());

const postEmailPayload = async (payload) => {
  const response = await fetch(buildRequestUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": EMAIL_API_KEY,
      "x-functions-key": EMAIL_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  let result = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok || (result.status && result.status !== "success")) {
    throw new Error(
      result.message || `Failed to send email. Server returned ${response.status}.`,
    );
  }

  return result;
};

const buildRequestUrl = () => {
  const url = new URL(`${API_BASE_URL}/${EMAIL_ENDPOINT}`);

  if (EMAIL_API_KEY) {
    url.searchParams.set("code", EMAIL_API_KEY);
  }

  return url.toString();
};

export const buildRequestDemoEmailPayload = (capability, form = {}) => {
  const name = (form.name || "").trim();
  const email = (form.email || "").trim();
  const company = (form.company || "").trim();
  const phone = (form.phone || "").trim();
  const message = (form.message || "").trim();
  const cardRecipients = getRequestDemoRecipientEmails(capability);
  const recipientEmails = [...new Set([email, ...cardRecipients])].filter(Boolean);

  return {
    Name: name,
    Email: email,
    Company: company,
    Phone: phone,
    Message: message,
    SolutionTitle: capability?.title || "",
    SolutionId: capability?.id || "",
    BusinessDomain: capability?.businessDomain || "",
    Subject: `Demo Request: ${capability?.title || "AI Solution"}`,
    ToEmails: recipientEmails.join(","),
    RecipientEmails: recipientEmails,
    CoeName: capability?.coe?.name || "",
    CoeEmail: capability?.coe?.email || "",
    AiEvangelists: (capability?.evangelists || [])
      .filter((person) => person.name !== "Not assigned")
      .map((person) => person.name)
      .join(", "),
  };
};

export const buildContactEmailPayload = (form = {}) => {
  const name = (form.name || "").trim();
  const email = (form.email || "").trim();
  const company = (form.company || "").trim();
  const phone = (form.phone || "").trim();
  const message = (form.message || "").trim();
  const recipientEmails = [...new Set([CONTACT_RECIPIENT_EMAIL, email])].filter(Boolean);

  return {
    Name: name,
    Email: email,
    Company: company,
    Phone: phone,
    Message: message,
    SolutionTitle: "Footer Contact Form",
    SolutionId: "",
    BusinessDomain: "Contact",
    Subject: "Contact Inquiry: AI Verse",
    ToEmails: recipientEmails.join(","),
    RecipientEmails: recipientEmails,
    CoeName: "",
    CoeEmail: CONTACT_RECIPIENT_EMAIL,
    AiEvangelists: "",
  };
};

export const buildContactSuccessMessage = () =>
  `Mail sent to ${CONTACT_RECIPIENT_EMAIL}.`;

const NEWSLETTER_RECIPIENT_EMAIL =
  import.meta.env.VITE_NEWSLETTER_EMAIL || CONTACT_RECIPIENT_EMAIL;

export const buildNewsletterSubscribePayload = (email = "") => {
  const trimmedEmail = email.trim();
  const recipientEmails = [...new Set([NEWSLETTER_RECIPIENT_EMAIL, trimmedEmail])].filter(
    Boolean,
  );

  return {
    Name: "Newsletter Subscriber",
    Email: trimmedEmail,
    Company: "",
    Phone: "",
    Message: "Please add this email to the AI Verse newsletter mailing list.",
    SolutionTitle: "Newsletter Subscription",
    SolutionId: "",
    BusinessDomain: "Newsletter",
    Subject: "Newsletter Subscription: AI Verse",
    ToEmails: recipientEmails.join(","),
    RecipientEmails: recipientEmails,
    CoeName: "",
    CoeEmail: NEWSLETTER_RECIPIENT_EMAIL,
    AiEvangelists: "",
  };
};

export const buildNewsletterSubscribeSuccessMessage = () =>
  "You're subscribed! Check your inbox for AI insights.";

export const sendNewsletterSubscribe = async ({ email }) => {
  if (!EMAIL_API_KEY.trim()) {
    throw new Error(REQUEST_DEMO_EMAIL_SETUP_MESSAGE);
  }

  const payload = buildNewsletterSubscribePayload(email);
  const result = await postEmailPayload(payload);

  return {
    ...result,
    successMessage: buildNewsletterSubscribeSuccessMessage(),
  };
};

export const sendContactEmail = async ({ form }) => {
  if (!EMAIL_API_KEY.trim()) {
    throw new Error(REQUEST_DEMO_EMAIL_SETUP_MESSAGE);
  }

  const payload = buildContactEmailPayload(form);
  const result = await postEmailPayload(payload);

  return {
    ...result,
    successMessage: buildContactSuccessMessage(),
  };
};

export const buildRequestDemoSuccessMessage = (capability, form = {}) => {
  const recipientNames = getRequestDemoRecipientNames(capability);

  if (recipientNames.length === 1) {
    return `Mail sent to ${recipientNames[0]}.`;
  }

  if (recipientNames.length > 1) {
    return `Mail sent to ${recipientNames.join(", ")}.`;
  }

  const fallbackName = (form.name || form.email || "").trim();
  return fallbackName
    ? `Mail sent to ${fallbackName}.`
    : "Mail sent successfully.";
};

export const sendRequestDemoEmail = async ({ capability, form }) => {
  if (!EMAIL_API_KEY.trim()) {
    throw new Error(REQUEST_DEMO_EMAIL_SETUP_MESSAGE);
  }

  const payload = buildRequestDemoEmailPayload(capability, form);
  const result = await postEmailPayload(payload);

  return {
    ...result,
    successMessage: buildRequestDemoSuccessMessage(capability, form),
    recipientNames: getRequestDemoRecipientNames(capability),
  };
};
