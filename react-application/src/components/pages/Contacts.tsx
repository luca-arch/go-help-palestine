import ContactsForm from "../contacts/ContactForm";
import Footer from "../shared/Footer";
import Header from "../shared/Header";
import { ScrollRestoration } from "react-router-dom";
import Section from "../shared/Section";
import ShareLinks from "../shared/ShareLinks";

// The contact form
const Contacts: React.FC = () => (
  <>
    <Header />

    <Section>
      <ContactsForm />
    </Section>

    <ShareLinks />

    <Footer />

    <ScrollRestoration />
  </>
);

export default Contacts;
