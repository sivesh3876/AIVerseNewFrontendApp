import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import ClientExplore from "../components/ClientExplore";
import { getClientById } from "../components/ClientExplore/clientsData";

const ClientsPage = () => {
  const [searchParams] = useSearchParams();
  const activeClient = getClientById(searchParams.get("client"));

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Clients", to: "/clients" },
          { label: activeClient.name },
        ]}
      />
      <ClientExplore />
    </>
  );
};

export default ClientsPage;
