export const normalizeBlogUrl = (url = "") => {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export const getResourceLinkMeta = (resource) => {
  const externalUrl = normalizeBlogUrl(resource?.url);

  if (externalUrl) {
    return {
      href: externalUrl,
      isExternal: true,
    };
  }

  if (resource?.linkTo) {
    return {
      href: resource.linkTo,
      isExternal: false,
    };
  }

  return {
    href: `/learn-explore?article=${resource?.id || ""}`,
    isExternal: false,
  };
};
