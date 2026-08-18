import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {

  exportAdminBlogsToCsv,

  filterAdminBlogs,

  getUniqueBlogValues,

  BLOG_ADMIN_DEFAULT_STATUS_FILTER,

} from "../../utils/adminBlogTableUtils";

import {

  createAdminBlogRecord,

  deleteAdminBlogRecord,

  getDefaultAuthorName,

  updateAdminBlogRecord,

} from "../../utils/adminBlogStorage";

import AdminBlogActionDropdown from "./AdminBlogActionDropdown";

import AdminBlogDeleteModal from "./AdminBlogDeleteModal";

import AdminBlogDescriptionCell from "./AdminBlogDescriptionCell";

import AdminBlogFormModal from "./AdminBlogFormModal";

import AdminTablePagination from "./AdminBlogPagination";

import AdminBlogTableToolbar from "./AdminBlogTableToolbar";

import AdminBlogViewModal from "./AdminBlogViewModal";

import AdminDemoPageShell from "./AdminDemoPageShell";

import AdminBlogStatusDropdown from "./AdminBlogStatusDropdown";

import { useAdminAuth } from "../../context/AdminAuthContext";

import { useAdminBlogs } from "./useAdminBlogs";

import "./AdminLayout.scss";



const PAGE_SIZE = 10;

const COLUMN_COUNT = 10;



const formatCell = (value) => value || "—";



const formatViews = (blog) => {

  const views = Number(blog.viewCount);

  return Number.isFinite(views) ? views.toLocaleString("en-IN") : "0";

};



const formatPublishedDate = (blog) => {
  if (blog.recordStatus === "Draft") return "—";
  return formatCell(blog.publishedDate);
};



const AdminBlogs = () => {

  const { adminEmail } = useAdminAuth();

  const { blogs, loading, error, loadBlogs, handleBlogUpdated } = useAdminBlogs();

  const [formMode, setFormMode] = useState(null);

  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const [viewBlogId, setViewBlogId] = useState(null);

  const [deleteBlogId, setDeleteBlogId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState(BLOG_ADMIN_DEFAULT_STATUS_FILTER);

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [trackFilter, setTrackFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);



  const categoryOptions = useMemo(

    () => getUniqueBlogValues(blogs, "category"),

    [blogs],

  );



  const trackOptions = useMemo(

    () => getUniqueBlogValues(blogs, "trackLabel"),

    [blogs],

  );



  const filteredBlogs = useMemo(

    () =>

      filterAdminBlogs(blogs, {

        search: searchQuery,

        status: statusFilter,

        category: categoryFilter,

        track: trackFilter,

      }),

    [blogs, searchQuery, statusFilter, categoryFilter, trackFilter],

  );



  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));



  const paginatedBlogs = useMemo(() => {

    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredBlogs.slice(start, start + PAGE_SIZE);

  }, [filteredBlogs, currentPage]);



  useEffect(() => {

    setCurrentPage(1);

  }, [searchQuery, statusFilter, categoryFilter, trackFilter]);



  useEffect(() => {

    if (currentPage > totalPages) {

      setCurrentPage(totalPages);

    }

  }, [currentPage, totalPages]);



  const hasActiveFilters =

    searchQuery.trim() ||

    statusFilter !== BLOG_ADMIN_DEFAULT_STATUS_FILTER ||

    categoryFilter !== "all" ||

    trackFilter !== "all";



  const selectedBlog = useMemo(

    () => blogs.find((item) => item.id === selectedBlogId) || null,

    [blogs, selectedBlogId],

  );



  const viewBlog = useMemo(

    () => blogs.find((item) => item.id === viewBlogId) || null,

    [blogs, viewBlogId],

  );



  const deleteBlog = useMemo(

    () => blogs.find((item) => item.id === deleteBlogId) || null,

    [blogs, deleteBlogId],

  );



  const handleAction = (blog, action) => {

    if (action === "view") {

      setViewBlogId(blog.id);

      return;

    }



    if (action === "edit") {

      setSelectedBlogId(blog.id);

      setFormMode("edit");

      return;

    }



    if (action === "delete") {

      setDeleteBlogId(blog.id);

    }

  };



  const handleCloseView = () => {

    setViewBlogId(null);

  };



  const handleCloseDelete = () => {

    setDeleteBlogId(null);

  };



  const handleConfirmDelete = async (blog) => {
    try {
      await deleteAdminBlogRecord(blog.id);
      setDeleteBlogId(null);
      await loadBlogs();
    } catch (deleteError) {
      window.alert(deleteError.message || "Failed to delete blog.");
    }
  };



  const handleOpenAdd = () => {

    setSelectedBlogId(null);

    setFormMode("add");

  };



  const handleCloseForm = () => {

    setFormMode(null);

    setSelectedBlogId(null);

  };



  const handleSaveBlog = async (payload) => {
    const savePayload = {
      ...payload,
      defaultAuthorEmail: adminEmail,
      author:
        String(payload.author || "").trim() || getDefaultAuthorName(adminEmail),
    };

    try {
      if (formMode === "edit" && selectedBlogId) {
        const updated = await updateAdminBlogRecord(selectedBlogId, savePayload);
        if (updated) {
          handleBlogUpdated(updated);
          await loadBlogs();
        }
      } else {
        const created = await createAdminBlogRecord(savePayload);
        if (created) {
          await loadBlogs();
        }
      }
      handleCloseForm();
    } catch (saveError) {
      window.alert(saveError.message || "Failed to save blog.");
    }
  };

  const handleStatusChange = async (blog, recordStatus) => {
    if (
      blog.recordStatus === "Published" &&
      recordStatus === "Draft"
    ) {
      return;
    }

    const updates = { recordStatus };

    if (recordStatus === "Draft") {
      updates.publishedDate = "";
      updates.publishedAt = null;
    } else if (recordStatus === "Published" && !blog.publishedDate) {
      updates.publishedDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    try {
      const updated = await updateAdminBlogRecord(blog.id, updates);
      if (updated) {
        handleBlogUpdated(updated);
        await loadBlogs();
      }
    } catch (statusError) {
      window.alert(statusError.message || "Failed to update blog status.");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter(BLOG_ADMIN_DEFAULT_STATUS_FILTER);
    setCategoryFilter("all");
    setTrackFilter("all");
  };



  const handleExport = () => {

    const exported = exportAdminBlogsToCsv(

      filteredBlogs,

      `blog-records-${new Date().toISOString().slice(0, 10)}.csv`,

    );



    if (!exported) {

      window.alert("No records available to export.");

    }

  };



  return (

    <AdminDemoPageShell

      title="Blogs"

      description="All blog posts in one list with status and actions."

      error={error}

    >

      {!error && (

        <AdminBlogTableToolbar

          searchQuery={searchQuery}

          onSearchChange={setSearchQuery}

          statusFilter={statusFilter}

          onStatusFilterChange={setStatusFilter}

          categoryFilter={categoryFilter}

          onCategoryFilterChange={setCategoryFilter}

          trackFilter={trackFilter}

          onTrackFilterChange={setTrackFilter}

          categoryOptions={categoryOptions}

          trackOptions={trackOptions}

          hasActiveFilters={hasActiveFilters}

          onClearFilters={handleClearFilters}

          onExport={handleExport}

          exportDisabled={filteredBlogs.length === 0}

          onAddBlog={handleOpenAdd}

          onRefresh={loadBlogs}

          loading={loading}

          filteredCount={filteredBlogs.length}

          totalCount={blogs.length}

        />

      )}



      <div className="admin_demo_table__wrap">

        <table className="admin_demo_table">

          <thead>

            <tr>

              <th>Action</th>

              <th>Date</th>

              <th>Title</th>

              <th>Category</th>

              <th>Track</th>

              <th>Author</th>

              <th>Views</th>

              <th className="admin_demo_table__status-col">Status</th>

              <th>Published Date</th>

              <th className="admin_demo_table__description-col">Description</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan={COLUMN_COUNT}>Loading blogs…</td>

              </tr>

            ) : blogs.length === 0 ? (

              <tr>

                <td colSpan={COLUMN_COUNT}>No blog records found.</td>

              </tr>

            ) : filteredBlogs.length === 0 ? (

              <tr>

                <td colSpan={COLUMN_COUNT}>

                  No records match your search or filters.

                </td>

              </tr>

            ) : (

              paginatedBlogs.map((blog) => (

                <tr key={blog.id}>

                  <td>

                    <AdminBlogActionDropdown

                      onSelect={(action) => handleAction(blog, action)}

                    />

                  </td>

                  <td>{formatCell(blog.publishedDate)}</td>

                  <td>{formatCell(blog.title)}</td>

                  <td>{formatCell(blog.category)}</td>

                  <td>{formatCell(blog.trackLabel)}</td>

                  <td>{formatCell(blog.author)}</td>

                  <td>{formatViews(blog)}</td>

                  <td className="admin_demo_table__status-cell">

                    <AdminBlogStatusDropdown
                      value={blog.recordStatus || "Published"}
                      onChange={(recordStatus) =>
                        handleStatusChange(blog, recordStatus)
                      }
                    />

                  </td>

                  <td>{formatPublishedDate(blog)}</td>

                  <td className="admin_demo_table__description-cell">

                    <AdminBlogDescriptionCell description={blog.description} />

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>



      {!loading && filteredBlogs.length > 0 && (

        <AdminTablePagination

          currentPage={currentPage}

          totalPages={totalPages}

          totalItems={filteredBlogs.length}

          pageSize={PAGE_SIZE}

          onPageChange={setCurrentPage}

          itemLabel="blogs"

        />

      )}



      <p className="admin_request_demos__empty-note">
        Published blogs appear on <Link to="/blogs">/blogs</Link>. Archive hides
        a blog from the public site and removes it from this active list.
      </p>



      {formMode && (

        <AdminBlogFormModal

          blog={formMode === "edit" ? selectedBlog : null}

          mode={formMode}

          onClose={handleCloseForm}

          onSave={handleSaveBlog}

        />

      )}



      {viewBlog && (

        <AdminBlogViewModal blog={viewBlog} onClose={handleCloseView} />

      )}



      {deleteBlog && (

        <AdminBlogDeleteModal

          blog={deleteBlog}

          onClose={handleCloseDelete}

          onConfirm={handleConfirmDelete}

        />

      )}

    </AdminDemoPageShell>

  );

};



export default AdminBlogs;


