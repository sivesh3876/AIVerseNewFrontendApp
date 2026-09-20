import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteSuccessStory,
  updateSuccessStoryStatus,
} from "../../services/successStoriesApiService";
import {
  exportSuccessStoriesToCsv,
  filterSuccessStories,
  getSuccessStoryCategories,
  SUCCESS_STORY_DEFAULT_STATUS_FILTER,
  SUCCESS_STORY_STATUSES,
} from "../../utils/successStoryAdminUtils";
import AdminBlogActionDropdown from "./AdminBlogActionDropdown";
import AdminBlogDeleteModal from "./AdminBlogDeleteModal";
import AdminTablePagination from "./AdminBlogPagination";
import AdminBlogStatusDropdown from "./AdminBlogStatusDropdown";
import AdminBlogTableToolbar from "./AdminBlogTableToolbar";
import AdminDemoPageShell from "./AdminDemoPageShell";
import { useSuccessStories } from "./useSuccessStories";
import "./AdminLayout.scss";
import "./AdminSuccessStories.scss";

const PAGE_SIZE = 10;
const COLUMN_COUNT = 8;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const AdminSuccessStories = () => {
  const navigate = useNavigate();
  const { stories, loading, error, loadStories } = useSuccessStories();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(SUCCESS_STORY_DEFAULT_STATUS_FILTER);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState("");

  const categories = useMemo(
    () => getSuccessStoryCategories(stories),
    [stories],
  );
  const filteredStories = useMemo(
    () => filterSuccessStories(stories, { search, status, category }),
    [stories, search, status, category],
  );
  const totalPages = Math.max(1, Math.ceil(filteredStories.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStories.slice(start, start + PAGE_SIZE);
  }, [filteredStories, currentPage]);

  const handleAction = (story, action) => {
    if (action === "view") {
      window.open(
        `/success-stories?story=${encodeURIComponent(story.slug)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (action === "edit") {
      navigate(`/admin/success-stories/${story.id}/edit`);
    } else if (action === "delete") {
      setDeleteTarget(story);
    }
  };

  const handleStatusChange = async (story, nextStatus) => {
    setBusyId(String(story.id));
    try {
      await updateSuccessStoryStatus(story.id, nextStatus);
      await loadStories();
    } catch (statusError) {
      window.alert(
        statusError.message || "Failed to update success story status.",
      );
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (story) => {
    setBusyId(String(story.id));
    try {
      await deleteSuccessStory(story.id);
      setDeleteTarget(null);
      await loadStories();
    } catch (deleteError) {
      window.alert(deleteError.message || "Failed to delete success story.");
    } finally {
      setBusyId("");
    }
  };

  const hasActiveFilters =
    search.trim() ||
    status !== SUCCESS_STORY_DEFAULT_STATUS_FILTER ||
    category !== "all";

  return (
    <AdminDemoPageShell
      title="Success Stories"
      description="Manage all success stories, their content, metrics and publication status."
    >
      <AdminBlogTableToolbar
        searchQuery={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        statusFilter={status}
        onStatusFilterChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        categoryFilter={category}
        onCategoryFilterChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        trackFilter="all"
        onTrackFilterChange={() => {}}
        categoryOptions={categories}
        trackOptions={[]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setSearch("");
          setStatus(SUCCESS_STORY_DEFAULT_STATUS_FILTER);
          setCategory("all");
          setPage(1);
        }}
        onExport={() =>
          exportSuccessStoriesToCsv(
            filteredStories,
            `success-stories-${new Date().toISOString().slice(0, 10)}.csv`,
          )
        }
        exportDisabled={filteredStories.length === 0}
        onAdd={() => navigate("/admin/success-stories/new")}
        onRefresh={() => loadStories().catch(() => {})}
        loading={loading}
        filteredCount={filteredStories.length}
        totalCount={stories.length}
        statuses={SUCCESS_STORY_STATUSES}
        defaultStatusFilter={SUCCESS_STORY_DEFAULT_STATUS_FILTER}
        defaultStatusLabel="Active stories"
        addLabel="Add Success Story"
        searchPlaceholder="Search by client, title, category, or description..."
        searchAriaLabel="Search success stories"
        showTrackFilter={false}
      />

      {error && (
        <div className="admin_success_stories__error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => loadStories().catch(() => {})}>
            Retry
          </button>
        </div>
      )}

      <div className="admin_demo_table__wrap">
        <table className="admin_demo_table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Date</th>
              <th>Client</th>
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th className="admin_demo_table__status-col">Status</th>
              <th>Published Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>Loading success stories…</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  Unable to load success stories.
                </td>
              </tr>
            ) : stories.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>No success stories available.</td>
              </tr>
            ) : filteredStories.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  No records match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedStories.map((story) => (
                <tr key={story.id}>
                  <td>
                    <AdminBlogActionDropdown
                      ariaLabel="Open success story actions menu"
                      onSelect={(action) => handleAction(story, action)}
                    />
                  </td>
                  <td>{formatDate(story.createdAt)}</td>
                  <td>{story.client || "—"}</td>
                  <td>{story.title || "—"}</td>
                  <td>{story.category || "—"}</td>
                  <td>{story.viewCount.toLocaleString("en-IN")}</td>
                  <td className="admin_demo_table__status-cell">
                    <AdminBlogStatusDropdown
                      value={story.status}
                      statuses={SUCCESS_STORY_STATUSES}
                      disabled={busyId === String(story.id)}
                      onChange={(nextStatus) =>
                        handleStatusChange(story, nextStatus)
                      }
                    />
                  </td>
                  <td>
                    {story.status === "Draft"
                      ? "—"
                      : formatDate(story.publishedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredStories.length > 0 && (
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStories.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemLabel="success stories"
        />
      )}

      {deleteTarget && (
        <AdminBlogDeleteModal
          blog={deleteTarget}
          entityLabel="Success Story"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminDemoPageShell>
  );
};

export default AdminSuccessStories;
