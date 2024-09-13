import Footer from "../shared/Footer";
import Header from "../shared/Header";
import { ScrollRestoration } from "react-router-dom";
import SectionDonations from "../homepage/SectionDonations";
import SectionFreePalestineBanner from "../homepage/SectionFreePalestineBanner";
import SectionHero from "../homepage/SectionHero";
import SectionTalkingPoints from "../homepage/SectionTalkingPoints";
import ShareLinks from "../shared/ShareLinks";

// Home page.
const HomePage: React.FC = () => (
  <>
    <Header />

    <SectionHero />

    <SectionTalkingPoints />

    <SectionFreePalestineBanner />

    <SectionDonations />

    <ShareLinks />

    <Footer />

    <ScrollRestoration />
  </>
);

export default HomePage;
