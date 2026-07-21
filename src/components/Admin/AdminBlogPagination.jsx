const AdminTablePagination = ({
  currentPage,
  totalPages,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  itemLabel = "records",
}) => {
  const safeTotalItems = Number(totalItems) || 0;
  const safePageSize = Number(pageSize) || 10;
  const safeCurrentPage = Number(currentPage) || 1;
  const safeTotalPages = Math.max(
    1,
    Number(totalPages) || Math.ceil(safeTotalItems / safePageSize) || 1,
  );

  if (safeTotalItems <= safePageSize) {
    return null;
  }

  const start = (safeCurrentPage - 1) * safePageSize + 1;
  const end = Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

  return (
    <div className="admin_blog_pagination">
      <p className="admin_blog_pagination__summary">
        Showing {start}–{end} of {safeTotalItems} {itemLabel}
      </p>

      <div className="admin_blog_pagination__controls">
        <button
          type="button"
          className="admin_blog_pagination__btn"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
        >
          Previous
        </button>

        <div className="admin_blog_pagination__pages">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`admin_blog_pagination__page${page === safeCurrentPage ? " is-active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === safeCurrentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="admin_blog_pagination__btn"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminTablePagination;
