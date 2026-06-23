import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import CustomerCommunicationManagement from "../components/CustomerCommunicationManagement";
import { getEnterpriseServiceById } from "../components/CustomerCommunicationManagement/enterpriseServicesData";

const ExploreSolutions = () => {
  const [searchParams] = useSearchParams();
  const domainCode = searchParams.get("domain");
  const activeService = getEnterpriseServiceById(searchParams.get("service"));
  const pageLabel = domainCode
    ? domainCode.replace(/([a-z])([A-Z])/g, "$1 $2")
    : activeService.label;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Enterprise Services", to: "/explore-solutions" },
          { label: pageLabel },
        ]}
      />
      <CustomerCommunicationManagement />
    </>
  );
};

export default ExploreSolutions;
