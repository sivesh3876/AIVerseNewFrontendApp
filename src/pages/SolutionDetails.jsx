import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import CustomerCommunicationManagement from "../components/CustomerCommunicationManagement";
import {
  getSolutionById,
  mapApiSolutionToDetail,
} from "../data/solutionsData";
import { getEnterpriseServiceById } from "../components/CustomerCommunicationManagement/enterpriseServicesData";
import "./SolutionDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

const SolutionDetails = () => {
  const { id } = useParams();
  const [solution, setSolution] = useState(() => getSolutionById(id));
  const [loading, setLoading] = useState(() => !getSolutionById(id));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const staticSolution = getSolutionById(id);
    if (staticSolution) {
      setSolution(staticSolution);
      setLoading(false);
      setNotFound(false);
      return;
    }

    const apiMatch = id?.match(/^api-(\d+)$/);
    if (!apiMatch) {
      setSolution(null);
      setLoading(false);
      setNotFound(true);
      return;
    }

    let isMounted = true;

    const fetchApiSolution = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const [solutionResponse, domainsResponse, ownersResponse, evangelistsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/get-usecases?id=${apiMatch[1]}`),
            fetch(`${API_BASE_URL}/get-business-domains`),
            fetch(`${API_BASE_URL}/get-solution-owners`),
            fetch(`${API_BASE_URL}/get-ai-evangelists`),
          ]);

        const solutionResult = await solutionResponse.json();
        const domainsResult = await domainsResponse.json();
        const ownersResult = await ownersResponse.json();
        const evangelistsResult = await evangelistsResponse.json();

        if (
          !isMounted ||
          !solutionResponse.ok ||
          solutionResult.status !== "success" ||
          !solutionResult.data
        ) {
          setSolution(null);
          setNotFound(true);
          return;
        }

        const mappedSolution = mapApiSolutionToDetail(solutionResult.data, {
          businessDomains:
            domainsResult.status === "success" ? domainsResult.data : [],
          solutionOwners:
            ownersResult.status === "success" ? ownersResult.data : [],
          evangelistDirectory:
            evangelistsResult.status === "success" ? evangelistsResult.data : [],
        });

        setSolution(mappedSolution);
        setNotFound(false);
      } catch (error) {
        console.error("Error loading solution details:", error);
        if (isMounted) {
          setSolution(null);
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchApiSolution();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "AI Verse", to: "/" },
            { label: "Enterprise Services", to: "/explore-solutions" },
            { label: "Loading..." },
          ]}
        />
        <div className="solution_details__state">Loading solution details...</div>
      </>
    );
  }

  if (notFound || !solution) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "AI Verse", to: "/" },
            { label: "Enterprise Services", to: "/explore-solutions" },
            { label: "Solution Not Found" },
          ]}
        />
        <div className="solution_details__state solution_details__state--error">
          <h1>Solution Not Found</h1>
          <p>The solution you are looking for does not exist or may have been removed.</p>
          <Link to="/explore-solutions" className="solution_details__back-link">
            Back to Enterprise Services
          </Link>
        </div>
      </>
    );
  }

  const service = getEnterpriseServiceById(solution.serviceLine);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Enterprise Services", to: "/explore-solutions" },
          {
            label: service.label,
            to: `/explore-solutions?service=${solution.serviceLine}`,
          },
          { label: solution.title },
        ]}
      />
      <CustomerCommunicationManagement detailSolution={solution} />
    </>
  );
};

export default SolutionDetails;
