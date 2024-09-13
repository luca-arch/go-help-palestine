import styled from "styled-components";

// A "nicely" styled blockquote.
const Blockquote = styled.blockquote`
  border-left: solid 4px #111111;
  margin: 16px 40px;
  padding: 1px 0 1px 4px;
  text-align: justify;

  &.highlight {
    background-color: #faebd7;
  }

  @media (max-width: 600px) {
    margin: 12px 12px;
  }
`;

export default Blockquote;
