import { Link } from "react-router-dom";
import { getResourceLinkMeta } from "../../utils/blogResourceLinks";

const BlogResourceLink = ({ resource, className, children, ...props }) => {
  const { href, isExternal } = getResourceLinkMeta(resource);

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} {...props}>
      {children}
    </Link>
  );
};

export default BlogResourceLink;
