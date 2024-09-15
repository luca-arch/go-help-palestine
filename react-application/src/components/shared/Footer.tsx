import { GITHUB_REPO_URL, INSTAGRAM_MAIN_URL } from "src/helpers/vars";
import ExternalLink from "./ExternalLink";
import styled from "styled-components";

// Credits for all the free icons downloaded from flaticon.com.
const Credits = styled.div`
  font-size: 11px;
  margin-top: 12px;

  a {
    color: #ffffff;
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    a {
      display: block;
      text-align: center;
    }

    span {
      display: none;
    }
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

    .socials a {
      color: #d0d0d0;
      display: block;
      font-family: monospace;
      font-size: 12px;
      padding: 4px 0;
      text-decoration: none;

      img {
        height: 24px;
        vertical-align: middle;
        width: 24px;
      }

      &:hover {
        color: #ffffff;
      }
    }
  }

  #scroll-top {
    display: block;
    float: right;
    background-image: url(/assets/up-arrow.png);
    background-size: cover;
    margin-top: -48px;
    height: 48px;
    width: 48px;
  }

  @media (max-width: 400px) {
    padding-bottom: 48px;

    #scroll-top {
      margin-top: -12px;
    }
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
      <p>Made with ❤️</p>

      <p className="socials">
        <ExternalLink url={GITHUB_REPO_URL}>
          <img src="/assets/icon-github.png" /> github.com/luca-arch
        </ExternalLink>

        <ExternalLink url={INSTAGRAM_MAIN_URL}>
          <img src="/assets/icon-instagram.png" /> @gohelppalestine
        </ExternalLink>
      </p>

      <Credits>
        <ExternalLink url="https://www.flaticon.com/authors/frdmn">
          Palestine icons created by frdmn - Flaticon
        </ExternalLink>

        <span>&nbsp;&ndash;&nbsp;</span>

        <ExternalLink url="https://www.flaticon.com/authors/pixel-perfect">
          Social icons created by Pixel perfect - Flaticon
        </ExternalLink>
      </Credits>
    </main>

    <a href="#" id="scroll-top" onClick={scrollTop}></a>
  </HTMLFooter>
);

export default Footer;
