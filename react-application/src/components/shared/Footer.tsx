import ExternalLink from "./ExternalLink";
import { GITHUB_REPO_URL } from "src/helpers/vars";
import styled from "styled-components";

// Credits for all the free icons downloaded from flaticon.com.
const Credits = styled.div`
  font-size: 12px;
  margin-top: 12px;

  a {
    color: #ffffff;
  }
`;

const HTMLFooter = styled.footer`
  background-color: #111111;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 18px;
  margin: 0;
  padding: 24px;
  width: 100%;

  > main {
    background-color: #111111;
    border-top: 1px dashed #f5f5f5;
    margin: 24px auto 0 auto;
    padding: 24px 0 0 0;
    width: 80%;

    p {
      margin-top: 0;
    }
  }

  #scroll-top {
    display: block;
    float: right;
    background-image: url(/up-arrow.png);
    background-size: cover;
    margin-top: -48px;
    height: 48px;
    width: 48px;
  }
`;

const scrollTop = (e: React.MouseEvent) => {
  e.preventDefault();

  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });
};

// Website footer.
const Footer: React.FC = () => (
  <HTMLFooter>
    <main>
      <p>
        Made with ❤️ not AI &ndash;{" "}
        <ExternalLink url={GITHUB_REPO_URL}>github.com/luca-arch</ExternalLink>
      </p>

      <Credits>
        <ExternalLink url="https://www.flaticon.com/authors/frdmn">
          Palestine icons created by frdmn - Flaticon
        </ExternalLink>
        &nbsp;&ndash;&nbsp;
        <ExternalLink url="https://www.flaticon.com/authors/pixel-perfect">
          Social icons created by Pixel perfect - Flaticon
        </ExternalLink>
      </Credits>
    </main>

    <a href="#" id="scroll-top" onClick={scrollTop}></a>
  </HTMLFooter>
);

export default Footer;
