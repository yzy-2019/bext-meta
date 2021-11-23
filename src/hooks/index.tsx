import { FC } from 'react';
import { MetaProvider } from './use-meta';
import { PreferenceProvider } from './use-preference';

export const CommonProvider: FC = ({ children }) => (
  <PreferenceProvider>
    <MetaProvider>{children}</MetaProvider>
  </PreferenceProvider>
);
