import { useState } from "react";
import { stripHtml, truncateText } from "../../utils/htmlContent";

const PREVIEW_LENGTH = 100;

const AdminBlogDescriptionCell = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const plainText = stripHtml(description);

  if (!plainText) {
    return <span>—</span>;
  }

  const isLong = plainText.length > PREVIEW_LENGTH;
  const preview = truncateText(plainText, PREVIEW_LENGTH);

  if (expanded) {
    return (
      <div className="admin_blog_description_cell">
        <p className="admin_blog_description_cell__text">{plainText}</p>
        <button
          type="button"
          className="admin_blog_description_cell__toggle"
          onClick={() => setExpanded(false)}
        >
          Less
        </button>
      </div>
    );
  }

  return (
    <div className="admin_blog_description_cell">
      <span className="admin_blog_description_cell__text">
        {preview}
        {isLong && (
          <>
            {" "}
            <button
              type="button"
              className="admin_blog_description_cell__toggle"
              onClick={() => setExpanded(true)}
            >
              More
            </button>
          </>
        )}
      </span>
    </div>
  );
};

export default AdminBlogDescriptionCell;
