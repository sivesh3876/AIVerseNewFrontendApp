import { Link } from "react-router-dom";
import { homePartners } from "../ClientExplore/clientsData";
import "./TrustedByGlobalLeaders.scss";

const TrustedByGlobalLeaders = ({
  partners = homePartners,
  title = "Trusted by Global Leaders",
}) => {
  const marqueeItems = [...partners, ...partners];

  return (
    <section id="partners" className="trusted_leaders">
      <div className="trusted_leaders__container">
        <h2>{title}</h2>

        <div className="trusted_leaders__marquee" aria-label="Partner logos">
          <div className="trusted_leaders__track">
            {marqueeItems.map((partner, index) => (
              <Link
                to={`/clients?client=${partner.id}`}
                className="trusted_leaders__card"
                key={`${partner.id}-${index}`}
                aria-hidden={index >= partners.length}
                aria-label={partner.name}
              >
                <span>{partner.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByGlobalLeaders;
