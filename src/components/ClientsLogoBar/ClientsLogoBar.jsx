import { Link } from "react-router-dom";
import { clientsData } from "../ClientExplore/clientsData";
import BrandLogoMark from "../BrandLogoMark/BrandLogoMark";
import { homePageClients } from "../../data/homeLogoBarData";
import "./ClientsLogoBar.scss";

const ClientsLogoBar = ({ clients = homePageClients }) => {
  const marqueeItems = [...clients, ...clients];

  return (
    <section className="clients_bar" aria-label="Client logos">
      <div className="clients_bar__inner">
        <span className="clients_bar__label">Clients</span>

        <div className="clients_bar__marquee">
          <div className="clients_bar__track">
            {marqueeItems.map((item, index) => {
              const hasClientPage = clientsData.some(
                (client) => client.id === item.id,
              );
              const className = "clients_bar__logo";
              const content = (
                <BrandLogoMark
                  item={item}
                  imageClassName="clients_bar__image"
                />
              );

              if (!hasClientPage) {
                return (
                  <div
                    className={className}
                    key={`${item.id}-${index}`}
                    aria-hidden={index >= clients.length}
                    aria-label={item.name}
                    title={item.name}
                  >
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  to={`/clients?client=${item.id}`}
                  className={className}
                  key={`${item.id}-${index}`}
                  aria-hidden={index >= clients.length}
                  aria-label={`View ${item.name} client page`}
                  title={item.name}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLogoBar;
