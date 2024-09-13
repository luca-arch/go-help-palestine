type Props = {
  url: URL | string;
};

const ExternalLink: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  url,
}) => (
  <a href={url.toString()} rel="external noopener" target="_blank">
    {children}
  </a>
);

export default ExternalLink;
