import HeroBannerSlider from "../components/HeroBanner/HeroBanner";
import ExploreAISolutions from "../components/ExploreAISolutions";
import ComprehensiveAICapabilities from "../components/ComprehensiveAICapabilities";
import EnterpriseTransformationServices from "../components/EnterpriseTransformationServices";
import IndustrySpecificAISolutions from "../components/IndustrySpecificAISolutions";
import TrustedByGlobalLeaders from "../components/TrustedByGlobalLeaders";
import InsightsThoughtLeadership from "../components/InsightsThoughtLeadership";
import MeetOurAIExperts from "../components/MeetOurAIExperts";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import ClientsLogoBar from "../components/ClientsLogoBar";
import StatsSection from "../components/StatsSection/StatsSection";

const HomePage = () => {
  return (
    <>
      <HeroBannerSlider />
      <ClientsLogoBar />
      <StatsSection />
      <ExploreAISolutions />
      <ComprehensiveAICapabilities />
      <EnterpriseTransformationServices />
      <IndustrySpecificAISolutions />
      <TrustedByGlobalLeaders />
      <InsightsThoughtLeadership />
      <MeetOurAIExperts />
      <NewsletterSubscribe />
    </>
  );
};

export default HomePage;
