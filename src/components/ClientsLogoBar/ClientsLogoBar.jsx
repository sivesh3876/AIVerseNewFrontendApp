import { Link } from "react-router-dom";
import { homeClients } from "../ClientExplore/clientsData";
import "./ClientsLogoBar.scss";

const ClientsLogoBar = ({ clients = homeClients, label = "Clients" }) => {
  const marqueeItems = [...clients, ...clients];

  return (
    <section className="clients_bar" aria-label="Client logos">
      <div className="clients_bar__inner">
        <span className="clients_bar__label">{label}</span>

        <div className="clients_bar__marquee">
          <div className="clients_bar__track">
            {marqueeItems.map((client, index) => (
              <Link
                to={`/clients?client=${client.id}`}
                className="clients_bar__logo"
                key={`${client.id}-${index}`}
                aria-hidden={index >= clients.length}
                aria-label={client.name}
              >
                <img src={client.logo} alt={client.name} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLogoBar;
