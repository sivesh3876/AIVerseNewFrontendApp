import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import CustomerCommunicationManagement from "../components/CustomerCommunicationManagement";
import { getEnterpriseServiceById } from "../components/CustomerCommunicationManagement/enterpriseServicesData";
import { fetchUseCaseById } from "../services/usecasesService";

const ExploreSolutions = () => {
  const [searchParams] = useSearchParams();
  const domainCode = searchParams.get("domain");
  const serviceId = searchParams.get("service");
  const solutionId = searchParams.get("solution");
  const activeService = getEnterpriseServiceById(serviceId);
  const [solutionTitle, setSolutionTitle] = useState("Solution Details");

  useEffect(() => {
    if (!solutionId) {
      setSolutionTitle("Solution Details");
      return;
    }

    const apiMatch = solutionId.match(/^api-(\d+)$/);
    if (!apiMatch) {
      setSolutionTitle("Solution Details");
      return;
    }

    let isMounted = true;

    fetchUseCaseById(apiMatch[1])
      .then((solution) => {
        if (isMounted && solution?.Title) {
          setSolutionTitle(solution.Title);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSolutionTitle("Solution Details");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [solutionId]);

  const breadcrumbItems = [
    { label: "AI Verse", to: "/" },
    { label: "Enterprise Services", to: "/explore-solutions" },
  ];

  if (domainCode) {
    breadcrumbItems.push({
      label: domainCode.replace(/([a-z])([A-Z])/g, "$1 $2"),
    });
  } else if (serviceId && activeService) {
    breadcrumbItems.push({
      label: activeService.label,
      to: `/explore-solutions?service=${serviceId}`,
    });
  }

  if (solutionId) {
    breadcrumbItems.push({ label: solutionTitle });
  } else if (!serviceId && !domainCode) {
    breadcrumbItems.push({ label: "All Services" });
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <CustomerCommunicationManagement />
    </>
  );
};

export default ExploreSolutions;
