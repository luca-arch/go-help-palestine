import {
  SAMMY_IG_URL,
  SPREADSHEET_URL,
  WATERMELON_IG_URL,
} from "src/helpers/vars";
import DonationsList from "../shared/DonationsList";
import ExternalLink from "../shared/ExternalLink";
import { Link } from "react-router-dom";
import Section from "../shared/Section";

// Section with donations list for the home page.
const SectionDonations: React.FC = () => (
  <Section
    style={{
      backgroundColor: "#EBEDE2",
      borderRadius: 0,
      marginBottom: 0,
      maxWidth: "none",
      width: "100%",
    }}
  >
    <h1>Donations</h1>

    <p>
      This section contains a working list of charities and individual campaigns
      for donating to help people, mostly in Gaza.
      <br />
      The list is automatically refreshed and it takes a number of links from{" "}
      <ExternalLink url={SPREADSHEET_URL}>this Google spreadsheet</ExternalLink>
      , which is taken care of by{" "}
      <ExternalLink url={SAMMY_IG_URL}>@sammyobeid</ExternalLink>.
    </p>

    <p>
      <strong>📣 New!</strong> Starting from the 11th November, a new list of{" "}
      charities called WaterMelon is published here.
      <br />
      This list will be rotated every so often by the people of{" "}
      <ExternalLink url={WATERMELON_IG_URL}>@watermelonfamily16</ExternalLink>,
      and it will only contain links to donations protected by the{" "}
      <ExternalLink url="https://www.gofundme.com/en-au/c/safety/gofundme-guarantee">
        GoFundMe Giving Guarantee program
      </ExternalLink>
      !
    </p>

    <p>
      Should you need anything from us, feel free to reach out , use the email
      addresses or the <Link to="contacts">contact form here</Link>!
    </p>

    <DonationsList />
  </Section>
);

export default SectionDonations;
