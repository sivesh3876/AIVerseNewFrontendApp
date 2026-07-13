import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import CertificationDetails from "../components/CertificationDetails/CertificationDetails";

const CertificationDetailsPage = () => {
  const { certificationId } = useParams();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Learn & Explore", to: "/#learn-explore" },
          { label: "Certification Details" },
        ]}
      />
      <CertificationDetails certificationId={certificationId || null} />
    </>
  );
};

export default CertificationDetailsPage;
