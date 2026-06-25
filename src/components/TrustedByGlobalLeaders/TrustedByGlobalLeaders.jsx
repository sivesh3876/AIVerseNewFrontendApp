import { Link } from "react-router-dom";
import { clientsData } from "../ClientExplore/clientsData";
import BrandLogoMark from "../BrandLogoMark/BrandLogoMark";
import { homePagePartners } from "../../data/homeLogoBarData";
import "./TrustedByGlobalLeaders.scss";

const TrustedByGlobalLeaders = ({
  partners = homePagePartners,
  title = "Our Partners",
}) => {
  const marqueeItems = [...partners, ...partners];

  return (
    <section id="partners" className="trusted_leaders">
      <div className="trusted_leaders__container">
        <h2>{title}</h2>

        <div className="trusted_leaders__marquee" aria-label="Partner logos">
          <div className="trusted_leaders__track">
            {marqueeItems.map((partner, index) => {
              const hasClientPage = clientsData.some(
                (client) => client.id === partner.id,
              );
              const content = (
                <BrandLogoMark
                  item={partner}
                  imageClassName="trusted_leaders__image"
                />
              );

              if (hasClientPage) {
                return (
                  <Link
                    to={`/clients?client=${partner.id}`}
                    className="trusted_leaders__card"
                    key={`${partner.id}-${index}`}
                    aria-hidden={index >= partners.length}
                    aria-label={partner.name}
                    title={partner.name}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  className="trusted_leaders__card"
                  key={`${partner.id}-${index}`}
                  aria-hidden={index >= partners.length}
                  aria-label={partner.name}
                  title={partner.name}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByGlobalLeaders;
