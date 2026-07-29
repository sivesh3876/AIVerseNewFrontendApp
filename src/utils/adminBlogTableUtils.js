import { stripHtml } from "./htmlContent";

const normalize = (value = "") => String(value).trim().toLowerCase();

const getSearchableText = (blog) =>
  [
    blog.title,
    blog.category,
    blog.trackLabel,
    blog.author,
    stripHtml(blog.description),
    blog.date,
    blog.publishedDate,
    blog.recordStatus,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getUniqueBlogValues = (blogs, key) =>
  [...new Set(blogs.map((item) => item[key]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );

export const filterAdminBlogs = (
  blogs,
  { search = "", status = "all", category = "all", track = "all" } = {},
) =>
  blogs.filter((blog) => {
    const query = normalize(search);
    const matchesSearch = !query || getSearchableText(blog).includes(query);
    const matchesStatus =
      status === "all" || (blog.recordStatus || "Published") === status;
    const matchesCategory =
      category === "all" || blog.category === category;
    const matchesTrack = track === "all" || blog.trackLabel === track;

    return matchesSearch && matchesStatus && matchesCategory && matchesTrack;
  });

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const EXPORT_COLUMNS = [
  { key: "url", label: "URL Link" },
  {
    key: "publishedDate",
    label: "Published Date",
    format: (value, blog) =>
      blog.recordStatus === "Draft" ? "" : value || "",
  },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "trackLabel", label: "Track" },
  { key: "author", label: "Author" },
  {
    key: "viewCount",
    label: "Views",
    format: (value) => Number(value || 0),
  },
  {
    key: "recordStatus",
    label: "Status",
    format: (value) => value || "Published",
  },
  { key: "description", label: "Description", format: (value) => stripHtml(value) },
];

export const exportAdminBlogsToCsv = (blogs, filename) => {
  if (!blogs.length) return false;

  const header = EXPORT_COLUMNS.map((column) => escapeCsv(column.label)).join(",");
  const rows = blogs.map((blog) =>
    EXPORT_COLUMNS.map((column) => {
      const raw = column.format
        ? column.format(blog[column.key], blog)
        : blog[column.key];
      return escapeCsv(raw ?? "");
    }).join(","),
  );

  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = filename || `blog-records-${dateStamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
