import HeroBannerSlider from "../components/HeroBanner/HeroBanner";
import TotalExperienceFramework from "../components/TotalExperienceFramework";
import ComprehensiveAICapabilities from "../components/ComprehensiveAICapabilities";
import EnterpriseTransformationServices from "../components/EnterpriseTransformationServices";
import IndustrySpecificAISolutions from "../components/IndustrySpecificAISolutions";
import TrustedByGlobalLeaders from "../components/TrustedByGlobalLeaders";
import SuccessStories from "../components/SuccessStories";
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
      <TotalExperienceFramework />
      <ComprehensiveAICapabilities />
      <EnterpriseTransformationServices />
      <IndustrySpecificAISolutions />
      <TrustedByGlobalLeaders />
      <SuccessStories />
      <InsightsThoughtLeadership />
      <MeetOurAIExperts />
      <NewsletterSubscribe />
    </>
  );
};

export default HomePage;
