const ClientLogo = ({ client, className = "" }) => {
  if (client.logo) {
    return <img src={client.logo} alt={client.name} className={className} />;
  }

  const initials =
    client.initials ?? client.name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();

  return <span className={`client_explore__initials ${className}`.trim()}>{initials}</span>;
};

export default ClientLogo;
