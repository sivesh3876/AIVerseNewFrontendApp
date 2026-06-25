const BrandLogoMark = ({ item, className = "", imageClassName = "" }) => {
  if (item.logo) {
    return (
      <img
        src={item.logo}
        alt={item.name}
        loading="lazy"
        className={imageClassName}
      />
    );
  }

  const initials =
    item.initials ??
    item.name
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase();

  return (
    <span className={`brand_logo_mark__fallback ${className}`.trim()}>
      <span className="brand_logo_mark__initials">{initials}</span>
      <span className="brand_logo_mark__name">{item.name}</span>
    </span>
  );
};

export default BrandLogoMark;
