import Breadcrumb from "../components/Breadcrumb";
import AboutUs from "../components/AboutUs";

const AboutUsPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "About Us" },
        ]}
      />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;
