import { Link } from "react-router-dom";
import "./Breadcrumb.scss";
import homeIcon from "../../assets/images/home.svg";

const defaultItems = [
  { label: "AI Verse", to: "/" },
  { label: "Enterprise Services", to: "/explore-solutions" },
  { label: "Customer Communication Management" },
];

const Breadcrumb = ({ items = defaultItems }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link to="/" className="breadcrumb__home" aria-label="Home">
            <img src={homeIcon} alt="" aria-hidden="true" />
          </Link>
        </li>

        {items.map((item, index) => (
          <li className="breadcrumb__item" key={`${item.label}-${index}`}>
            <span className="breadcrumb__separator" aria-hidden="true">
              &gt;
            </span>

            {item.to && index < items.length - 1 ? (
              <Link to={item.to} className="breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
