import "./TrustedByGlobalLeaders.scss";

const defaultPartners = [
  "Microsoft",
  "Salesforce",
  "Databricks",
  "UiPath",
  "Contentful",
  "Sitecore",
  "OpenText",
  "Ellucian",
  "Aisera",
];

const TrustedByGlobalLeaders = ({
  partners = defaultPartners,
  title = "Trusted by Global Leaders",
}) => {
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="trusted_leaders">
      <div className="trusted_leaders__container">
        <h2>{title}</h2>

        <div className="trusted_leaders__marquee" aria-label="Partner logos">
          <div className="trusted_leaders__track">
            {marqueeItems.map((partner, index) => (
              <div
                className="trusted_leaders__card"
                key={`${partner}-${index}`}
                aria-hidden={index >= partners.length}
              >
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByGlobalLeaders;
