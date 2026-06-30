import Breadcrumb from "../Breadcrumb";
import CustomerExperienceJourney from "../CustomerExperience";

const ExperienceDetailLayout = ({ breadcrumbLabel, meta, stages }) => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          {
            label: "Total Experience Framework",
            to: "/#total-experience-framework",
          },
          { label: breadcrumbLabel },
        ]}
      />
      <main style={{ background: "#F5F7FA" }}>
        <CustomerExperienceJourney meta={meta} stages={stages} />
      </main>
    </>
  );
};

export default ExperienceDetailLayout;
