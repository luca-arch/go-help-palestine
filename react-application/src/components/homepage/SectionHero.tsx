import { Link } from "react-router-dom";
import Section from "../shared/Section";

const imgStyle: React.CSSProperties = {
  borderRadius: "5px",
  display: "block",
  width: "100%",
};

// Homepage first section.
const SectionHero: React.FC = () => (
  <Section>
    <img
      alt="What can we do to help Palestine"
      id="main-banner"
      src="/banner.jpg"
      style={imgStyle}
    />

    <h1 style={{ fontSize: "2em" }}>A message from the author</h1>

    <p>
      This is not about politics, nor it is to let you decide whether to pick
      one side or the other.
    </p>

    <p>
      There are some really bad atrocities going on right now all around the
      world, and I, for first, always{" "}
      <strong>thought there was very little I could do</strong> about it.
    </p>

    <p style={{ fontSize: "larger" }}>
      <strong>It turned out I was wrong.</strong>
    </p>

    <p>
      Only fools and dead men don't change their minds. So what made me change
      my mind?
    </p>

    <p>
      Nothing big,{" "}
      <strong>I just had a conversation with a long-term friend</strong>, whom I
      had not seen for almost five years. I am glad we are still in touch.
    </p>

    <p>
      You can read it in full <Link to="stef-point-of-view">here</Link>, or you
      can scroll down the next section and immediately read what you can do.
    </p>
  </Section>
);

export default SectionHero;
