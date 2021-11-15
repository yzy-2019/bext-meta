import { FC } from 'react';
import { AvatarProvider } from './use-avatar';
import { BridgeProvider } from './use-bridge';
import { MetaProvider } from './use-meta';
import { PreferenceProvider } from './use-preference';

export const CommonProvider: FC = ({ children }) => (
  <BridgeProvider>
    <PreferenceProvider>
      <MetaProvider>
        <AvatarProvider>{children}</AvatarProvider>
      </MetaProvider>
    </PreferenceProvider>
  </BridgeProvider>
);
