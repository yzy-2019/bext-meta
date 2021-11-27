import { DraftProvider } from './use-draft';
import { MetaProvider } from './use-meta';
import { PreferenceProvider } from './use-preference';
import { FC } from 'react';

export const CommonProvider: FC = ({ children }) => (
  <PreferenceProvider>
    <MetaProvider>
      <DraftProvider>{children}</DraftProvider>
    </MetaProvider>
  </PreferenceProvider>
);
