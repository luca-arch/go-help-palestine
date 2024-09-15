import ExternalLink from "./ExternalLink";
import { SECTION_ID } from "src/helpers/share";
import styled from "styled-components";

// Website home URL, this will be used to build sharer links.
const ROOT_DOMAIN = location.origin;

// Link to Facebook share.
const FB_SHARE_URL = new URL("https://www.facebook.com/sharer/sharer.php");
FB_SHARE_URL.searchParams.append("u", ROOT_DOMAIN);

// Link to LinkedIn share.
const LINKEDIN_SHARE_URL = new URL(
  "https://www.linkedin.com/shareArticle?mini=true",
);
LINKEDIN_SHARE_URL.searchParams.append("url", ROOT_DOMAIN);

// Link to WhatsApp share.
const WHATSAPP_SHARE_URL = new URL("whatsapp://send");
WHATSAPP_SHARE_URL.searchParams.append("text", ROOT_DOMAIN);

// Link to X share.
const X_SHARE_URL = new URL("https://twitter.com/intent/tweet");
X_SHARE_URL.searchParams.append("url", ROOT_DOMAIN);

// Action to copy the website's URL to the clipboard.
const copyToClipboard = (e: React.MouseEvent) => {
  e.preventDefault();

  navigator.clipboard.writeText(ROOT_DOMAIN);
};

const Section = styled.section`
  background-color: #ffffff;
  box-sizing: border-box;
  color: #111111;
  margin: 0;
  padding: 24px 0 48px 0;
  text-align: center;
  width: 100%;

  div {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-evenly;
    margin: 0 auto;
    min-width: 310px;
    width: 80%;

    a {
      color: #595959;
      font-weight: bold;
      text-decoration: none;
      vertical-align: middle;

      img {
        height: 42px;
        vertical-align: middle;
        width: 42px;
      }

      &:hover {
        color: #111111;
        text-decoration: underline;
      }
    }
  }
`;

// A section with 5 links to share on external platforms. The link shared is ALWAYS the root domain, not the page where the component is rendered!
const ShareLinks: React.FC = () => (
  <Section id={SECTION_ID}>
    <h1>Please share this website!</h1>

    <div>
      <ExternalLink url={FB_SHARE_URL}>
        <img
          src="/assets/icon-facebook.png"
          alt="Share on Facebook"
          title="Share on Facebook"
        />{" "}
        Facebook
      </ExternalLink>

      <ExternalLink url={X_SHARE_URL}>
        <img
          src="/assets/icon-twitter.png"
          alt="Share on X"
          title="Share on X"
        />{" "}
        Twitter / X
      </ExternalLink>

      <ExternalLink url={LINKEDIN_SHARE_URL}>
        <img
          src="/assets/icon-linkedin.png"
          alt="Share on LinkedIn"
          title="Share on LinkedIn"
        />{" "}
        LinkedIn
      </ExternalLink>

      <ExternalLink url={WHATSAPP_SHARE_URL}>
        <img
          src="/assets/icon-whatsapp.png"
          alt="Share on WhatsApp"
          title="Share on WhatsApp"
        />{" "}
        WhatsApp
      </ExternalLink>

      <a href="#" onClick={copyToClipboard}>
        <img
          src="/assets/icon-copy.png"
          alt="Copy to clipboard"
          title="Copy to clipboard"
        />{" "}
        Copy to clipboard
      </a>
    </div>
  </Section>
);

export default ShareLinks;
