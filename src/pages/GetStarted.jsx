import Breadcrumb from "../components/Breadcrumb";
import AddNewAISolution from "../components/AddNewAISolution";

const GetStarted = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "AI Verse", to: "/" },
          { label: "Get Started" },
        ]}
      />
      <AddNewAISolution />
    </>
  );
};

export default GetStarted;
