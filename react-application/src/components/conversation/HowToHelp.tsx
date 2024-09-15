import { GITHUB_REPO_URL, SAMMY_IG_URL } from "src/helpers/vars";
import ExternalLink from "../shared/ExternalLink";
import { Link } from "react-router-dom";
import Section from "../shared/Section";
import { scrollToSharedLinks } from "src/helpers/share";
import styled from "styled-components";

const Heading1 = styled.h1`
  font-size: 24px;
  margin: 18px 0;
`;

const Heading2 = styled.h2`
  font-size: 20px;
  margin: 18px 0 15px 0;
`;

const List = styled.ul`
  text-align: left;
  margin-left: 0;

  @media (max-width: 700px) {
    padding-left: 10px;
    text-align: justify;
  }
`;

const AwesomeLinksList: React.FC = () => (
  <List>
    <li>
      <ExternalLink url="https://www.instagram.com/letstalkpalestine/">
        @letstalkpalestine
      </ExternalLink>
      - Let’s Talk Palestine, <strong>very active</strong> (Instagram / multiple
      accounts in English, Spanish, Italian and Portuguese)
    </li>
    <li>
      <ExternalLink url={SAMMY_IG_URL}>@sammyobeid</ExternalLink> - the comedian
      who is running the CeaseFire tour (Instagram account).
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/landpalestine/">
        @landpalestine
      </ExternalLink>{" "}
      - activists' page exposing some atrocities, its admins are verified and
      the videos are real (Instagram account).
    </li>
    <li>
      <ExternalLink url="https://t.me/landpalestinenews">
        Land Palestine News
      </ExternalLink>{" "}
      - their Telegram channel.
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/jewishvoiceforpeace/">
        Jewish Voice for Peace
      </ExternalLink>
      - organizing toward Palestinian liberation and Judaism beyond Zionism
      (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/everydaypalestine/">
        EveryDayPalestine
      </ExternalLink>{" "}
      - Everyday life of Palestinians in Palestine and the diaspora (Instagram
      account).
      <br />
      See also their{" "}
      <ExternalLink url="https://www.facebook.com/profile.php?id=100066486292397">
        Facebook page
      </ExternalLink>
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/souloffilasteen/">
        Soul of Filasteen
      </ExternalLink>
      - elevating Palestinuan voices, one story at a time (Instagram, based in
      Ramallah)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/rosypirani/">
        Rosy Fazil Pirani
      </ExternalLink>
      - lawyer and Humanitarian, founder of @kozykulture (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/imamomarsuleiman/">
        Imam Omar Suleiman
      </ExternalLink>
      - advocate for humanity, <strong>very active</strong> (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/zeenaaqel/">
        Zeena Aqel
      </ExternalLink>
      - proud Palestinian, I Speak Up,Empower Women and Believe ”The Power Of
      The People Is Greater Than The People In Power” (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/_doaa_mohammad/">
        Doaa Albaz
      </ExternalLink>
      - press Photographer in Palestine (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/eye.on.palestine/">
        @eye.on.palestine
      </ExternalLink>
      - news &amp; Media, uncensored (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/wael_eldahdouh/">
        Wael Al Dahdouh
      </ExternalLink>
      - press Photographer in Palestine (Instagram)
      <br />
      also on{" "}
      <ExternalLink url="https://x.com/WaelDahdouh">Twitter / X</ExternalLink>
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/hindkhoudary/">
        Hind Khoudary
      </ExternalLink>
      - journalist (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/khaledbeydoun/">
        Khaled Beydoun
      </ExternalLink>
      - law professor (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/motaz_azaiza/">
        Motaz Azaiza
      </ExternalLink>
      - photographer, activist (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/m.z.gaza/">
        Mohammed Zaanoun
      </ExternalLink>
      - photojournalist,Documentary filmmake (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/plestia.alaqad/">
        Plestia Alaqad
      </ExternalLink>
      - journalist (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/palestinianyouthmovement/">
        Palestinian Youth Movement
      </ExternalLink>
      - transnational independent movement of Palestinian & Arab youth
      struggling for the liberation of their homeland (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/myzfrancois/">
        Dr Myriam Francois
      </ExternalLink>
      - presenter, documentary film-maker (Instagram)
    </li>
    <li>
      <ExternalLink url="https://linktr.ee/fababs">Abby Martin</ExternalLink>-
      journalist for @empirefiles (LinkTree, with all her social media accounts)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/wissamgaza/">
        Wissam Nassar
      </ExternalLink>
      - photographer, <strong>very active</strong>, possibly{" "}
      <ExternalLink url="https://en.wikipedia.org/wiki/Shadow_banning">
        shadow-banned
      </ExternalLink>{" "}
      (Instagram)
    </li>
    <li>
      <ExternalLink url="https://www.instagram.com/sbeih.jpg/">
        @sbeih.jpg
      </ExternalLink>
      - social media strategy for @palestine.academy and cultural merch
      supporting the cause (Instagram)
    </li>
  </List>
);

const HowToHelp: React.FC = () => (
  <Section>
    <Heading1>How to help, in short</Heading1>

    <p>
      Be open, be smart. Take one step at a time, it will take you no effort!
      <br />
      And you won't necessarely have to donate any money, unless you can afford
      it!
    </p>

    <Heading2>1. The quickest thing</Heading2>

    <p>
      <strong>
        Share this website, use one of the buttons in the{" "}
        <a href="#" onClick={scrollToSharedLinks}>
          next section
        </a>
        ! This is by far the easiest and quickest way to give your contribute!
      </strong>
    </p>

    <Heading2>2. Talk with your friends next time you see them</Heading2>

    <p>
      It will not cost you any money, and you will have the opportunity to spark
      a different conversation.
    </p>

    <Heading2>3. Stay informed</Heading2>

    <p>
      There are tons of channels and social media accounts that are doing their
      part to bring the subject up.
      <br />
      You can follow such accounts and like their pages: it might mean nothing
      to you but remember <strong>every single count</strong> and this is a good
      way to show support.
      <br />
      Here is an awesome list{" "}
      <ExternalLink url="https://www.google.com/search?q=what+is+an+awesome+list">
        <span style={{ fontSize: "x-small" }}>(what is an awesome list?)</span>
      </ExternalLink>{" "}
      of some active accounts you can follow to stay informed and support the
      cause.
    </p>

    <AwesomeLinksList />

    <Heading2>4. Donate if you can</Heading2>

    <p>
      Even it it's just one dollar, less than a cup of coffee, remember: every
      little helps!
      <br />
      See the donations section in the <Link to="/">home page</Link> and pick
      any one of your choice.
    </p>

    <Heading2>5. Last but not least</Heading2>

    <p>
      <strong>Help ME out</strong>. This website will cost around 20 USD per
      year, but worry not, it's on me!
      <br />
      If you are aware of any other website/source/account that can be added to
      the awesome list above, please share it using the contact form.
      <br />
      If you can suggest anything that concerns this website, its technologies,
      its stack, or if you have any suggestion to improve the design and
      graphics, the source code is available on{" "}
      <ExternalLink url={GITHUB_REPO_URL}>GitHub</ExternalLink>
      .
      <br />I made it public, open-source, and chose the{" "}
      <ExternalLink url="https://www.gnu.org/licenses/gpl-3.0.en.html">
        GNU GPL v3
      </ExternalLink>{" "}
      as a licence. Pull requests are welcome too!
    </p>
  </Section>
);

export default HowToHelp;
