const AdminTablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "records",
}) => {
  if (totalItems <= pageSize) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="admin_blog_pagination">
      <p className="admin_blog_pagination__summary">
        Showing {start}–{end} of {totalItems} {itemLabel}
      </p>

      <div className="admin_blog_pagination__controls">
        <button
          type="button"
          className="admin_blog_pagination__btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>

        <div className="admin_blog_pagination__pages">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`admin_blog_pagination__page${page === currentPage ? " is-active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="admin_blog_pagination__btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminTablePagination;
