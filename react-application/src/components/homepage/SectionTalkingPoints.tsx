import { Link } from "react-router-dom";
import Section from "../shared/Section";
import styled from "styled-components";

const Item = styled.li`
  background-color: #c8f068;
  border-radius: 10px;
  color: #111111;
  font-size: 20px;
  line-height: 150%;
  list-style: none;
  padding: 20px;
  width: 320px;

  > strong {
    display: block;
    font-size: 24px;
    margin-bottom: 12px;
  }

  &:hover {
    background-color: #eaecf3;
  }
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-evenly;
  margin: 0;
  padding: 0;
  text-align: justify;

  @media (max-width: 600px) {
    justify-content: center;
  }

  @media (max-width: 1000px) {
    justify-content: space-around;
  }
`;

// Section with talking points.
const SectionTalkingPoints: React.FC = () => (
  <Section
    style={{
      backgroundColor: "inherit",
      color: "#FFFFFF",
      marginBottom: 0,
      paddingBottom: 0,
    }}
  >
    <h1>What to do?</h1>

    <List>
      <Item>
        <strong>Talk!</strong>
        Make sure we have this conversation! Ask, speak!
      </Item>

      <Item>
        <strong>Remember!</strong>
        Every little helps! This site was made by someone who didn't think
        they'd matter.
      </Item>

      <Item>
        <strong>Share!</strong>
        Use your social media accounts, it doesn't have to happen on a daily
        basis.
      </Item>

      <Item>
        <strong>Donate if you can!</strong>
        See the list below and pick the cause you like the most.
      </Item>

      <Item>
        <strong>Still not sure?</strong>
        Read <Link to="how-to-help">this tiny list</Link> to see what you can
        do. No money involved!
      </Item>
    </List>
  </Section>
);

export default SectionTalkingPoints;
