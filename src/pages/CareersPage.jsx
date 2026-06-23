import Breadcrumb from "../components/Breadcrumb";
import Careers from "../components/Careers";

const CareersPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Careers" },
        ]}
      />
      <Careers />
    </>
  );
};

export default CareersPage;
