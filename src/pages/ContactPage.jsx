import Breadcrumb from "../components/Breadcrumb";
import Contact from "../components/Contact";

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Contact" },
        ]}
      />
      <Contact />
    </>
  );
};

export default ContactPage;
