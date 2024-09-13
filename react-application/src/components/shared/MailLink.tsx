const deobfuscateMailAddress = (addr: string): string =>
  addr.split("X").join("");

type Props = {
  obfuscatedAddress: string;
};

const MailLink: React.FC<Props> = ({ obfuscatedAddress }) => (
  <a href={`mailto:${deobfuscateMailAddress(obfuscatedAddress)}`}>
    {deobfuscateMailAddress(obfuscatedAddress)}
  </a>
);

export default MailLink;
