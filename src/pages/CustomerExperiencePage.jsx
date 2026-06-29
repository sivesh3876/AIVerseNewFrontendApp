import Breadcrumb from "../components/Breadcrumb";
import CustomerExperienceJourney from "../components/CustomerExperience";

const CustomerExperiencePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Customer Experience" },
        ]}
      />
      <main style={{ background: "#F5F7FA" }}>
        <CustomerExperienceJourney />
      </main>
    </>
  );
};

export default CustomerExperiencePage;
