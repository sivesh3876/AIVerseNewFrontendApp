import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import {
  TechStackLabelIcon,
  CoeLabelIcon,
  EvangelistLabelIcon,
  VideoCameraIcon,
} from "./CapabilityIcons";
import {
  enterpriseServicesData,
  getEnterpriseServiceIndexById,
} from "./enterpriseServicesData";
import "./CustomerCommunicationManagement.scss";

const getInitials = (name) =>
  name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="#3A8D9D" strokeWidth="1.75" />
    <path
      d="m8 12 2.5 2.5L16 9"
      stroke="#3A8D9D"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonAvatar = ({ name, color }) => (
  <span className={`ccm_dashboard__avatar ccm_dashboard__avatar--${color}`}>
    {getInitials(name)}
  </span>
);

const CapabilityCard = ({ capability }) => {
  const CardIcon = capability.icon;

  return (
    <article className="ccm_dashboard__capability">
      <div className="ccm_dashboard__capability-head">
        <span className="ccm_dashboard__capability-icon" aria-hidden="true">
          <CardIcon />
        </span>
        <h4>{capability.title}</h4>
      </div>

      <p>{capability.description}</p>

      <div className="ccm_dashboard__meta">
        <div className="ccm_dashboard__meta-block">
          <span className="ccm_dashboard__section-label">
            <TechStackLabelIcon />
            TECH STACK
          </span>
          <div className="ccm_dashboard__tags">
            {capability.techStack.map((tech) => (
              <div className="ccm_dashboard__tag" key={tech.name}>
                <strong>{tech.name}</strong>
                <span>{tech.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ccm_dashboard__meta-block">
          <span className="ccm_dashboard__section-label">
            <CoeLabelIcon />
            COE
          </span>
          <div className="ccm_dashboard__person">
            <PersonAvatar
              name={capability.coe.name}
              color={capability.coe.color}
            />
            <div>
              <strong>{capability.coe.name}</strong>
              <span>{capability.coe.title}</span>
            </div>
          </div>
        </div>

        <div className="ccm_dashboard__meta-block">
          <span className="ccm_dashboard__section-label">
            <EvangelistLabelIcon />
            AI EVANGELISTS
          </span>
          <div className="ccm_dashboard__evangelists">
            {capability.evangelists.map((person) => (
              <div className="ccm_dashboard__person" key={person.name}>
                <PersonAvatar name={person.name} color={person.color} />
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ccm_dashboard__capability-actions">
        <button type="button" className="ccm_dashboard__action-btn">
          Request Demo
        </button>
        <button type="button" className="ccm_dashboard__action-btn">
          Recorded Demo
          <VideoCameraIcon />
        </button>
      </div>
    </article>
  );
};

const CustomerCommunicationManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const [activeServiceIndex, setActiveServiceIndex] = useState(() =>
    getEnterpriseServiceIndexById(serviceId),
  );

  useEffect(() => {
    setActiveServiceIndex(getEnterpriseServiceIndexById(serviceId));
  }, [serviceId]);

  const handleServiceChange = (index) => {
    setActiveServiceIndex(index);
    navigate(`/explore-solutions?service=${enterpriseServicesData[index].id}`, {
      replace: true,
    });
  };

  const activeService = enterpriseServicesData[activeServiceIndex];
  const BannerIcon = activeService.navIcon;

  return (
    <div className="ccm_dashboard">
      <aside className="ccm_dashboard__sidebar">
        <nav className="ccm_dashboard__nav" aria-label="Enterprise services">
          <h2>ALL ENTERPRISE SERVICES</h2>
          <ul>
            {enterpriseServicesData.map((service, index) => {
              const isActive = index === activeServiceIndex;
              const NavIcon = service.navIcon;

              return (
                <li key={service.id}>
                  <button
                    type="button"
                    className={`ccm_dashboard__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleServiceChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="ccm_dashboard__nav-icon" aria-hidden="true">
                      <NavIcon />
                    </span>
                    <span className="ccm_dashboard__nav-label">{service.label}</span>
                    {isActive && (
                      <span className="ccm_dashboard__nav-arrow" aria-hidden="true">
                        &rsaquo;
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="ccm_dashboard__main" key={activeService.label}>
        <section className="ccm_dashboard__banner">
          <div className="ccm_dashboard__banner-header">
            <div className="ccm_dashboard__banner-icon" aria-hidden="true">
              <BannerIcon />
            </div>
            <div className="ccm_dashboard__banner-copy">
              <h1>{activeService.label}</h1>
              <p>{activeService.subtitle}</p>
            </div>
          </div>

          <div className="ccm_dashboard__banner-body">
            <ul className="ccm_dashboard__features">
              {activeService.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ccm_dashboard__capabilities">
          <div className="ccm_dashboard__capabilities-header">
            <div>
              <h2>Key Capabilities</h2>
              <p>
                {activeService.capabilities.length} solution areas — hover a card to manage
              </p>
            </div>
            <span className="ccm_dashboard__badge">
              {activeService.capabilities.length} Solutions
            </span>
          </div>

          <div className="ccm_dashboard__grid">
            {activeService.capabilities.map((capability) => (
              <CapabilityCard capability={capability} key={capability.title} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerCommunicationManagement;
