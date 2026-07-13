export const stripHtml = (html = "") => {
  if (!html) return "";

  if (typeof document !== "undefined") {
    const element = document.createElement("div");
    element.innerHTML = html;
    return (element.textContent || element.innerText || "").trim();
  }

  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const truncateText = (text = "", maxLength = 100) => {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
};

export const isHtmlContentEmpty = (html = "") => !stripHtml(html);
