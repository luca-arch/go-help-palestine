import styled from "styled-components";

const Image = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
`;

// Big banner.
const SectionFreePalestineBanner: React.FC = () => (
  <Image alt="#freepalestine" src="/assets/banner-hashtag.png" />
);

export default SectionFreePalestineBanner;
