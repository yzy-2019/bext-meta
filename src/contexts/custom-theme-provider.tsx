import { usePreference } from './use-preference';
import { DARK_THEME } from '@/constants';
import { ThemeProvider } from '@fluentui/react';
import { FC, useEffect, useMemo } from 'react';
import useMedia from 'use-media';

export const CustomThemeProvider: FC = ({ children }) => {
  const { preference } = usePreference();
  const systemDarkMode = useMedia('(prefers-color-scheme: dark)');

  const theme = useMemo(() => {
    if (typeof preference.darkMode === 'undefined') {
      return systemDarkMode ? DARK_THEME : undefined;
    }
    return preference.darkMode === 'dark' ? DARK_THEME : undefined;
  }, [preference.darkMode, systemDarkMode]);

  // useEffect(() => {
  //   let observer: MutationObserver | null = null;
  //   if (preference.darkMode) {
  //     observer = new MutationObserver((mutations) => {
  //       for (let mutation of mutations) {
  //         mutation.addedNodes.forEach((node) => {
  //           if (browserHackSet.has((node as any)?.id)) {
  //             clearHackNode(node);
  //           }
  //         });
  //       }
  //     });
  //     observer.observe(document.head);
  //   }
  //   return () => {
  //     observer?.disconnect();
  //   };
  // }, [preference.darkMode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// const browserHackSet = new Set([
//   'via_inject_css_night',
//   'metaNight',
//   'yjbrowser_night_mode_style',
//   'yjbrowser_night_mode_style2',
//   '360browser_night_mode_style',
//   '360browser_night_mode_style2',
//   'mixiaba_css_id',
//   'x_style_element_id',
//   'x_link_element_id',
//   'alook_theme',
//   'miui_mini_night_mode',
//   'preucbrowser_sheet_theme',
//   'bnightThme',
//   'sq_root_css',
// ]);

// const clearHackNode = (node: HTMLElement) => {
//   if (node.nodeName === 'STYLE') {
//     node.innerHTML = '';
//   } else if (node.nodeName === 'LINK' && node.rel === 'stylesheet') {
//     node.href = '#';
//   }
// };
