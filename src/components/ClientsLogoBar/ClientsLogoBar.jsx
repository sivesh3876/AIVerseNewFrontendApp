import "./ClientsLogoBar.scss";
import clientLogo1 from "../../assets/images/client_logo1.svg";
import clientLogo2 from "../../assets/images/client_logo2.svg";
import clientLogo3 from "../../assets/images/client_logo3.svg";
import clientLogo4 from "../../assets/images/client_logo4.svg";
import clientLogo5 from "../../assets/images/client_logo5.svg";
import clientLogo6 from "../../assets/images/client_logo7.svg";
import clientLogo7 from "../../assets/images/client_logo8.svg";

const defaultClients = [
  { name: "Shopify", logo: clientLogo1 },
  { name: "HubSpot", logo: clientLogo2 },
  { name: "KIBO", logo: clientLogo3 },
  { name: "Quadient", logo: clientLogo4 },
  { name: "Kofax Partner", logo: clientLogo5 },
  { name: "Shopify", logo: clientLogo1 },
  { name: "Sitecore", logo: clientLogo6 },
  { name: "Microsoft Partner", logo: clientLogo7 },
];

const ClientsLogoBar = ({ clients = defaultClients, label = "Clients" }) => {
  const marqueeItems = [...clients, ...clients];

  return (
    <section className="clients_bar" aria-label="Client logos">
      <div className="clients_bar__inner">
        <span className="clients_bar__label">{label}</span>

        <div className="clients_bar__marquee">
          <div className="clients_bar__track">
            {marqueeItems.map((client, index) => (
              <div
                className="clients_bar__logo"
                key={`${client.name}-${index}`}
                aria-hidden={index >= clients.length}
              >
                <img src={client.logo} alt={client.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLogoBar;
