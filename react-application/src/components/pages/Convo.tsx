import Conversation from "../conversation/Conversation";
import Footer from "../shared/Footer";
import Header from "../shared/Header";
import HowToHelp from "../conversation/HowToHelp";
import { ScrollRestoration } from "react-router-dom";
import SectionFreePalestineBanner from "../homepage/SectionFreePalestineBanner";
import ShareLinks from "../shared/ShareLinks";

type Props = {
  showConversation?: boolean;
};

// Separate page with a bunch of messages we exchanged and a few call to action points.
const Convo: React.FC<Props> = ({ showConversation }) => (
  <>
    <Header />

    <SectionFreePalestineBanner />

    {showConversation !== false && <Conversation />}

    <HowToHelp />

    <ShareLinks />

    <Footer />

    <ScrollRestoration />
  </>
);

export default Convo;
