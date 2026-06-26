import { Link } from "react-router-dom";
import { clientsData } from "../ClientExplore/clientsData";
import BrandLogoMark from "../BrandLogoMark/BrandLogoMark";
import { homePagePartners } from "../../data/homeLogoBarData";
import { isIconOnlyLogo } from "../../utils/logoResolver";
import "./TrustedByGlobalLeaders.scss";

const TrustedByGlobalLeaders = ({
  partners = homePagePartners,
  title = "Our Partners",
}) => {
  const displayPartners = partners.filter(
    (partner) => partner.logo && !isIconOnlyLogo(partner.logo),
  );
  const marqueeItems = [...displayPartners, ...displayPartners];

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
                <span
                  className={`trusted_leaders__logo-shell${
                    partner.logoOnDarkSurface
                      ? " trusted_leaders__logo-shell--dark"
                      : ""
                  }`}
                >
                  <BrandLogoMark
                    item={partner}
                    imageClassName="trusted_leaders__image"
                  />
                </span>
              );

              if (hasClientPage) {
                return (
                  <Link
                    to={`/clients?client=${partner.id}`}
                    className="trusted_leaders__card"
                    key={`${partner.id}-${index}`}
                    aria-hidden={index >= displayPartners.length}
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
                  aria-hidden={index >= displayPartners.length}
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
