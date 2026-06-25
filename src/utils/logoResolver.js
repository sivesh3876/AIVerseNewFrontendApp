const logoFolderModules = import.meta.glob("../assets/logo/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const clientImageModules = import.meta.glob("../assets/images/client_logo*.svg", {
  eager: true,
  import: "default",
});

const allLogoModules = {
  ...logoFolderModules,
  ...clientImageModules,
};

const normalizeKey = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const resolveLogoByKeywords = (keywords = []) => {
  const normalizedKeywords = keywords.map(normalizeKey).filter(Boolean);
  if (normalizedKeywords.length === 0) {
    return null;
  }

  let bestMatch = null;
  let bestScore = 0;

  Object.entries(allLogoModules).forEach(([path, url]) => {
    const normalizedPath = normalizeKey(path);
    const score = normalizedKeywords.reduce((total, keyword) => {
      if (!normalizedPath.includes(keyword)) {
        return total;
      }

      return total + keyword.length;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = url;
    }
  });

  return bestScore > 0 ? bestMatch : null;
};

export const resolveLogoEntry = ({ logo, logoKeywords = [] } = {}) =>
  logo || resolveLogoByKeywords(logoKeywords);
