const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] != null) return source[key];
  }
  return undefined;
};

const toText = (value) => (value == null ? "" : String(value).trim());

const toArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return value
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const toNamedArray = (value) =>
  toArray(value)
    .map((item) => (typeof item === "object" ? item.name : item))
    .map(toText)
    .filter(Boolean);

const normalizeStatus = (value) => {
  const status = toText(value) || "Draft";
  return status === "Archive" ? "Archived" : status;
};

export const SUCCESS_STORY_STATUSES = ["Draft", "Published", "Archived"];
export const SUCCESS_STORY_DEFAULT_STATUS_FILTER = "active";

export const SUCCESS_STORY_CATEGORY_PRESETS = [
  "LOGISTICS",
  "BFSI",
  "HEALTHCARE",
  "EDUCATION",
  "INSURANCE",
  "MARKETING",
];

export const SUCCESS_STORY_ADD_NEW_CATEGORY = "__add_new__";

export const normalizeSuccessStory = (story = {}) => {
  const id = getValue(
    story,
    "apiId",
    "APIID",
    "ID",
    "Id",
    "StoryId",
    "story_id",
    "id",
  );
  const client = toText(
    getValue(story, "client", "Client", "ClientName", "client_name"),
  );
  const category = toText(
    getValue(story, "category", "Category", "Industry", "industry"),
  );
  const shortDescription = toText(
    getValue(
      story,
      "shortDescription",
      "ShortDescription",
      "description",
      "Description",
    ),
  );
  const keyMetric = toText(
    getValue(story, "keyMetric", "KeyMetric", "statValue", "StatValue", "metric"),
  );
  const metricDescription = toText(
    getValue(
      story,
      "metricDescription",
      "MetricDescription",
      "statLabel",
      "StatLabel",
    ),
  );

  return {
    ...story,
    id: id == null ? "" : id,
    slug: toText(getValue(story, "slug", "Slug")),
    client,
    title: toText(getValue(story, "title", "Title")),
    category,
    industry: category,
    industryTag: toText(
      getValue(story, "industryTag", "IndustryTag", "industry_tag"),
    ) || category,
    shortDescription,
    description: shortDescription,
    keyMetric,
    statValue: keyMetric,
    metricDescription,
    statLabel: metricDescription,
    challenge: toText(
      getValue(
        story,
        "challenge",
        "Challenge",
        "ChallengeDescription",
        "challenge_description",
      ),
    ),
    solutionDescription: toText(
      getValue(
        story,
        "solutionDescription",
        "SolutionDescription",
        "solution",
        "Solution",
      ),
    ),
    solutionBullets: toNamedArray(
      getValue(
        story,
        "solutionBullets",
        "SolutionBullets",
        "solutionDelivered",
        "SolutionDelivered",
      ),
    ),
    results: toNamedArray(
      getValue(story, "results", "Results", "ResultBullets", "result_bullets"),
    ),
    technologies: toNamedArray(
      getValue(story, "technologies", "Technologies"),
    ),
    services: toNamedArray(getValue(story, "services", "Services")),
    testimonial: toText(
      getValue(
        story,
        "testimonial",
        "Testimonial",
        "testimonialQuote",
        "TestimonialQuote",
      ),
    ),
    testimonialAuthor: toText(
      getValue(story, "testimonialAuthor", "TestimonialAuthor"),
    ),
    ctaText: toText(
      getValue(
        story,
        "ctaText",
        "CtaText",
        "CTAText",
        "ctaLabel",
        "CtaLabel",
      ),
    ),
    ctaUrl: toText(getValue(story, "ctaUrl", "CtaUrl", "CTAUrl")),
    heroImageUrl: toText(
      getValue(
        story,
        "heroImageUrl",
        "HeroImageUrl",
        "HeroImageURL",
        "image",
      ),
    ),
    clientLogoUrl: toText(
      getValue(story, "clientLogoUrl", "ClientLogoUrl", "ClientLogoURL"),
    ),
    additionalImageUrls: toArray(
      getValue(
        story,
        "additionalImageUrls",
        "additionalImages",
        "AdditionalImageUrls",
        "AdditionalImages",
      ),
    ),
    status: normalizeStatus(
      getValue(
        story,
        "status",
        "Status",
        "recordStatus",
        "PublicationStatus",
      ),
    ),
    viewCount: Number(
      getValue(story, "viewCount", "ViewCount", "views", "Views") || 0,
    ),
    createdAt: toText(
      getValue(
        story,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate",
        "created_at",
        "date",
        "Date",
      ),
    ),
    publishedAt: toText(
      getValue(story, "publishedAt", "PublishedAt", "published_at"),
    ),
  };
};

export const generateSuccessStorySlug = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getEmptySuccessStoryForm = () => ({
  client: "",
  category: "",
  title: "",
  slug: "",
  shortDescription: "",
  keyMetric: "",
  metricDescription: "",
  challenge: "",
  solutionDescription: "",
  solutionBullets: [""],
  results: [""],
  technologies: "",
  services: "",
  testimonial: "",
  testimonialAuthor: "",
  ctaText: "",
  ctaUrl: "",
  status: "Draft",
  heroImageUrl: "",
  clientLogoUrl: "",
  additionalImageUrls: [],
});

export const successStoryToFormValues = (story) => {
  const normalized = normalizeSuccessStory(story);
  return {
    ...getEmptySuccessStoryForm(),
    ...normalized,
    technologies: normalized.technologies.join(", "),
    services: normalized.services.join(", "),
    solutionBullets: normalized.solutionBullets.length
      ? normalized.solutionBullets
      : [""],
    results: normalized.results.length ? normalized.results : [""],
  };
};

export const validateSuccessStoryForm = (
  values,
  { requireHeroImage = true } = {},
) => {
  const errors = {};
  const required = {
    client: "Client / organization name",
    category: "Category / industry",
    title: "Story title",
    slug: "Slug",
    shortDescription: "Short description",
    keyMetric: "Key metric",
    metricDescription: "Metric description",
    challenge: "Challenge description",
  };

  Object.entries(required).forEach(([key, label]) => {
    if (!toText(values[key])) errors[key] = `${label} is required.`;
  });
  if (!values.solutionBullets?.some((item) => toText(item))) {
    errors.solutionBullets = "At least one solution bullet is required.";
  }
  if (!values.results?.some((item) => toText(item))) {
    errors.results = "At least one result is required.";
  }
  if (requireHeroImage && !values.heroImageUrl && !values.heroImageFile) {
    errors.heroImage = "Hero image is required.";
  }
  if (
    values.slug &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)
  ) {
    errors.slug = "Use lowercase letters, numbers, and single hyphens only.";
  }
  if (values.ctaUrl) {
    try {
      new URL(values.ctaUrl);
    } catch {
      errors.ctaUrl = "Enter a valid absolute URL.";
    }
  }
  if (normalizeStatus(values.status) === "Published" && Object.keys(errors).length) {
    errors.status =
      "Complete all required fields before publishing this success story.";
  }
  return errors;
};

const append = (formData, key, value) =>
  formData.append(key, value == null ? "" : String(value));

export const buildSuccessStoryFormData = (
  values,
  {
    id,
    heroImageFile,
    clientLogoFile,
    additionalImageFiles = [],
    removeHeroImage = false,
    removeClientLogo = false,
    removedAdditionalImages = [],
  } = {},
) => {
  const formData = new FormData();
  if (id != null && id !== "") append(formData, "ID", id);

  const industryTag = toText(values.category).toUpperCase();
  const createdDateLabel = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const fields = {
    Client: values.client,
    Industry: values.category,
    IndustryTag: industryTag,
    Badge: "SUCCESS STORY",
    Title: values.title,
    Slug: values.slug,
    Description: values.shortDescription,
    StoryDate: values.storyDate || createdDateLabel,
    StatValue: values.keyMetric,
    StatLabel: values.metricDescription,
    Metric: [values.keyMetric, values.metricDescription]
      .filter(Boolean)
      .join(" "),
    Challenge: values.challenge,
    ClientContext: values.challenge,
    Solution: values.solutionDescription || values.solutionBullets.find(toText),
    DigitalPartnerRole: values.solutionDescription,
    SolutionDelivered: JSON.stringify(
      values.solutionBullets.map(toText).filter(Boolean),
    ),
    Results: JSON.stringify(values.results.map(toText).filter(Boolean)),
    BusinessBenefits: JSON.stringify(values.results.map(toText).filter(Boolean)),
    Technologies: JSON.stringify(toNamedArray(values.technologies)),
    Services: JSON.stringify(toNamedArray(values.services)),
    TestimonialQuote: values.testimonial,
    TestimonialAuthor: values.testimonialAuthor,
    CtaLabel: values.ctaText,
    CtaUrl: values.ctaUrl,
    Status: values.status,
    AdditionalImages: JSON.stringify(values.additionalImageUrls || []),
    removeHeroImage,
    removeClientLogo,
    removedAdditionalImages: JSON.stringify(removedAdditionalImages),
  };
  Object.entries(fields).forEach(([key, value]) => append(formData, key, value));

  if (heroImageFile) formData.append("HeroImage", heroImageFile);
  if (clientLogoFile) formData.append("ClientLogo", clientLogoFile);
  additionalImageFiles.forEach((file) =>
    formData.append("AdditionalImages", file),
  );
  return formData;
};

const searchableText = (story) =>
  [
    story.client,
    story.title,
    story.category,
    story.shortDescription,
    story.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const filterSuccessStories = (
  stories,
  { search = "", status = SUCCESS_STORY_DEFAULT_STATUS_FILTER, category = "all" } = {},
) => {
  const query = toText(search).toLowerCase();
  return stories.filter((story) => {
    const matchesSearch = !query || searchableText(story).includes(query);
    const matchesStatus =
      status === "all" ||
      (status === "active" && story.status !== "Archived") ||
      story.status === status;
    const matchesCategory =
      category === "all" || story.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });
};

export const getSuccessStoryCategories = (stories) =>
  [...new Set(stories.map((story) => story.category).filter(Boolean))].sort(
    (left, right) => left.localeCompare(right),
  );

export const getSuccessStoryCategoryOptions = (stories = []) => {
  const extras = getSuccessStoryCategories(stories).filter(
    (category) =>
      !SUCCESS_STORY_CATEGORY_PRESETS.some(
        (preset) => preset.toLowerCase() === category.toLowerCase(),
      ),
  );
  return [...SUCCESS_STORY_CATEGORY_PRESETS, ...extras];
};

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const exportSuccessStoriesToCsv = (stories, filename) => {
  if (!stories.length) return false;
  const columns = [
    ["Client", "client"],
    ["Title", "title"],
    ["Category", "category"],
    ["Slug", "slug"],
    ["Views", "viewCount"],
    ["Status", "status"],
    ["Published Date", "publishedAt"],
    ["Description", "shortDescription"],
  ];
  const rows = stories.map((story) =>
    columns.map(([, key]) => escapeCsv(story[key])).join(","),
  );
  const csv = [
    columns.map(([label]) => escapeCsv(label)).join(","),
    ...rows,
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename || `success-stories-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
