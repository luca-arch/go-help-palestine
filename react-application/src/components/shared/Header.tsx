import styled from "styled-components";

const HTMLHeader = styled.header`
  box-sizing: border-box;
  color: #ffffff;
  font-size: 52px;
  margin: 0 auto 10px auto;
  max-width: 1200px;
  text-align: left;
  width: 95%;

  @media (max-width: 600px) {
    font-size: 32px;
    text-align: center;
  }

  span {
    cursor: pointer;
  }

  a {
    display: block;
    float: right;
    margin-top: 15px;

    @media (max-width: 600px) {
      border-radius: 50%;
      bottom: 5px;
      left: 5px;
      margin: 0;
      position: fixed;
    }
  }

  img {
    display: block;
    height: 48px;
    width: 48px;
  }
`;

// Website header.
const Header: React.FC = () => (
  <HTMLHeader>
    <span onClick={() => location.assign("/")}>Go Help Palestine!</span>

    <a href="/contacts">
      {" "}
      {/* Do not use Link component here, it breaks on /contacts page */}
      <img src="/assets/contacts.png" alt="✉️" title="Send us a message" />
    </a>
  </HTMLHeader>
);

export default Header;
