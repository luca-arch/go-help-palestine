import Blockquote from "./Blockquote";
import Section from "../shared/Section";

// This is an excerpt of the conversation Stef and I recently had.
const Conversation: React.FC = () => (
  <Section>
    <p>
      Here is the conversation I had with a long-term friend of mine. It’s
      almost in its full version, but since she and I are both VERY stubborn 😅,
      it is presented here only slightly redacted.
    </p>

    <Blockquote>
      <strong>Me:</strong> Hey Stef, I recently asked a question to a new friend
      of mine and she said she is very upset about what’s going on in Palestine;
      she talks a lot about it and she posts stuff on her Instagram stories. But
      she got upset too when I told her that, in my opinion, it’s rather
      pointless to talk about a problem unless you’re also pointing out a
      possible solution. I’m an engineer, after all!
    </Blockquote>

    <p>
      <em>I asked her because she too posts a lot on this matter.</em>
    </p>

    <Blockquote>
      <strong>Stef:</strong> Why are you surprised? Are you happy with what’s
      going on there or do you just not care at all?
    </Blockquote>

    <Blockquote>
      <strong>Me:</strong> I’ve never said I was happy, it’s just that I can’t
      see what a single person like me could possibly do other than share videos
      via social media. What’s the point in all of that? My friend said it’s ok
      because, even if only one conscience gets awoken, it is still better than
      nothing. But I still feel like I can’t do any good...
    </Blockquote>

    <Blockquote className="highlight">
      <strong>Stef:</strong> And your friend was right, sharing and posting is a
      lot of things! Like, if you change one opinion, and that opinion changes
      someone else’s and stuff... like, a lot of people are unaware of this
      situation, which is surprising but... For example, you and I are having
      this conversation right now, so it’s about starting conversations and
      stuff like that, which is why I post!
      <br />
      Another point is about just keeping the headlines about Palestine, because
      if it changes to something else, like it already has - it’s almost been a
      year of{" "}
      <strong title="Technically, the conflic has been going on for over 75 years, this is like the 14th war on Gaza">
        genocide
      </strong>{" "}
      - and to keep the funds coming into the country and all of these things...
      You NEED to keep talking about it!
      <br />
      So it’s not necessarely about what her, herself do, but what we do as a
      collective.
    </Blockquote>

    <p>
      <em>Then, she went on:</em>
    </p>

    <Blockquote className="highlight">
      <strong>Stef:</strong> If people had never posted about it, would it have
      been brought up to the International Court of Justice? Or would there have
      been protests all over the place? I think yeah, even if one person doesn’t
      really have that much of an effect, if everyone has this mentality then
      it’s really not gonna do anything!
      <br />
      Do I tell everyone they’re a terrible person if they don’t post? No, but I
      think that it is good if you do post... It doesn’t have to be like every
      day but whatever, it’s just like, for me, I just try to post because I
      think that it is probably good to keep sharing the message, keeping people
      aware that this is an ongoing situation...
      <br />I know there is a ton of s**t going on in the world right now, but I
      think having a debate over it is never useless...
    </Blockquote>

    <p>
      <em>My answer at this point was not relevant.</em>
    </p>

    <Blockquote>
      <strong>Stef:</strong> And in terms of what does she/I do? Not that much,
      but we’re still trying and I think that’s important, and surely there are
      better ways to help and everything, but I think it’s not a competition:
      some people want to work directly on the field, others work in policy,
      others work in other jobs and then just do what they can outside of their
      job.
      <br />I think as long as you’re aware of your privilege,{" "}
      <strong>stay educated</strong>
      and doing what you can, it’s already better than a lot of people.
      <br />
      It’s normal to feel helpless as an individual, but it’s about connecting
      and working together, not doing something alone that has a big impact
      because unless you want to lead your country or are a billionaire or
      something, it’s likely not gonna happen.
    </Blockquote>

    <Blockquote>
      <strong>Me:</strong> Wow Stef, that was really insightful and helpful,
      thanks! I don’t want to sound like a hypocrite, so I will try to get
      myself together first... but I’ll definitely follow your advice and do
      some homework - like, perhaps I could use my skills and do a little
      research to find charities online? I can start looking for them, making
      sure they’re genuine, legit, then share them on a website and donate?
    </Blockquote>

    <Blockquote>
      <strong>Stef:</strong> I have a link on my page that someone put together
      with a list of GoFundMes from families 🙂
      <br />
      But I think educating yourself and having conversations is most important
      if you don’t have the money, especially with people who disagree with you!
    </Blockquote>

    <p>
      <em>
        It was at this point that I realised I had the potential to bring a very
        tiny contribution. After all, long ago I used to make websites for a
        living.
      </em>
    </p>

    <p>
      And, let’s be honest, nowadays you don’t even need any specific skills to
      build a website, there are tons of tools out there that people can use for
      free.
    </p>

    <p>
      Although this one will cost around 20 USD per year, but hey, it’s on me 😉
    </p>
  </Section>
);

export default Conversation;
