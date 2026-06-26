import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import ClientExplore from "../components/ClientExplore";
import {
  CLIENT_SECTION,
  getSectionItemById,
} from "../components/ClientExplore/clientsData";

const ClientsPage = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client");
  const { section, item: activeClient } = getSectionItemById(clientId);
  const isClientSection = section === CLIENT_SECTION;
  const sectionLabel = isClientSection ? "Clients" : "Partners";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          {
            label: sectionLabel,
            to: isClientSection
              ? "/clients"
              : `/clients?client=${activeClient.id}`,
          },
          { label: activeClient.name },
        ]}
      />
      <ClientExplore />
    </>
  );
};

export default ClientsPage;
