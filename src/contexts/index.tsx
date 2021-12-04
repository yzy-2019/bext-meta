import { CustomThemeProvider } from './custom-theme-provider';
import { MetaPrefixProvider } from './meta-prefix';
import { DraftProvider } from './use-draft';
import { MetaProvider } from './use-meta';
import { PreferenceProvider } from './use-preference';
import { FC } from 'react';

export const CommonProvider: FC = ({ children }) => (
  <PreferenceProvider>
    <CustomThemeProvider>
      <MetaPrefixProvider>
        <MetaProvider>
          <DraftProvider>{children}</DraftProvider>
        </MetaProvider>
      </MetaPrefixProvider>
    </CustomThemeProvider>
  </PreferenceProvider>
);
