import React, { memo } from 'react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url: keyof typeof getURL;
  children: React.ReactNode | string;
}

const getURL = {
  github: 'https://github.com/sepehrity/my-tapsi-extension',
  mapboxToken: 'https://account.mapbox.com/access-tokens',
  sepehrity: 'https://twitter.com/sepehrity',
  tapsiHome: 'https://tapsi.ir/',
  tapsiPWA: 'https://app.tapsi.cab',
} as const;

const Link = ({ children, url, ...rest }: Props) => {
  return (
    <a rel="noopener noreferrer" href={getURL[url]} target="_blank" {...rest}>
      {children}
    </a>
  );
};

export default memo(Link);
