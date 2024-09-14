import { GITHUB_REPO_URL, MAIL_CHARITY, MAIL_LUCA } from "src/helpers/vars";
import ExternalLink from "../shared/ExternalLink";
import MailLink from "../shared/MailLink";
import { sendMessage } from "src/helpers/send-message";
import styled from "styled-components";
import { useState } from "react";

const Heading1 = styled.h1`
  font-size: 24px;
  margin: 18px 0;
`;

const Form = styled.div`
  text-align: left;

  > div {
    box-sizing: border-box;
    margin: 12px auto;
    max-width: 100%;
    width: 50%;

    &:last-child {
      text-align: right;
    }

    @media (max-width: 800px) {
      width: 80%;
    }

    @media (max-width: 400px) {
      width: 100%;
    }
  }

  input,
  textarea {
    box-sizing: border-box;
    display: block;
    padding: 4px;
    width: 100%;
  }

  textarea {
    min-height: 100px;
  }
`;

const ContactsForm: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<Error>();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onSend = () => {
    setError(undefined);
    setIsSending(true);

    sendMessage({ message, name })
      .then(() => setIsSent(true))
      .catch((err: Error) => setError(err))
      .finally(() => setIsSending(false));
  };

  const isValid = name.length > 2 && message.length > 8;

  return (
    <>
      <Heading1>How to get in touch</Heading1>

      <p>There are several ways to get in touch with us. Don't be shy!</p>

      <ul style={{ textAlign: "left" }}>
        <li>
          To contact the website author, either send an email to{" "}
          <MailLink obfuscatedAddress={MAIL_LUCA} /> or visit its{" "}
          <ExternalLink url={GITHUB_REPO_URL}>GitHub page</ExternalLink>.
        </li>
        <li>
          Any concern in regard to the donation campaigns listed in the home
          page, send an email to <MailLink obfuscatedAddress={MAIL_CHARITY} />.
        </li>
        <li>Any request can be made using the contact form below:</li>
      </ul>

      {isSent ? (
        <p style={{ fontWeight: "bold" }}>Message sent! Thank you!</p>
      ) : (
        <Form>
          <div>
            Your name or nickname
            <input
              autoComplete="off"
              maxLength={80}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="Your name..."
              type="text"
              value={name}
            />
          </div>

          <div>
            Your message
            <textarea
              maxLength={3500}
              onInput={(e) => setMessage(e.currentTarget.value)}
              placeholder="Your message..."
              required
              value={message}
            />
          </div>

          {error && <div>{error.message}</div>}

          <div>
            <button disabled={isSending || !isValid} onClick={onSend}>
              {isSending ? `Sending...` : `Send`}
            </button>
          </div>
        </Form>
      )}

      <p>
        <strong>There is no privacy policy here</strong>, we simply do not
        collect any kind of data and we don't share any received message with
        anyone.
        <br />
        This website does <strong>not</strong> use cookies and does{" "}
        <strong>not</strong> use any tracking technologies.
      </p>
    </>
  );
};

export default ContactsForm;
