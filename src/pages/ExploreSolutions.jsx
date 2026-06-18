import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import CustomerCommunicationManagement from "../components/CustomerCommunicationManagement";
import { getEnterpriseServiceById } from "../components/CustomerCommunicationManagement/enterpriseServicesData";

const ExploreSolutions = () => {
  const [searchParams] = useSearchParams();
  const activeService = getEnterpriseServiceById(searchParams.get("service"));

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Enterprise Services", to: "/explore-solutions" },
          { label: activeService.label },
        ]}
      />
      <CustomerCommunicationManagement />
    </>
  );
};

export default ExploreSolutions;
