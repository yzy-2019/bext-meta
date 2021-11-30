import { createTheme } from '@fluentui/react';

export const ID_RULE = /^[\w-]+$/;

export const DARK_THEME = createTheme({
  palette: {
    themePrimary: '#448aff',
    themeLighterAlt: '#03050a',
    themeLighter: '#0b1629',
    themeLight: '#15294d',
    themeTertiary: '#295299',
    themeSecondary: '#3d79e0',
    themeDarkAlt: '#5795ff',
    themeDark: '#72a5ff',
    themeDarker: '#97bdff',
    neutralLighterAlt: '#111111',
    neutralLighter: '#111111',
    neutralLight: '#101010',
    neutralQuaternaryAlt: '#0f0f0f',
    neutralQuaternary: '#0f0f0f',
    neutralTertiaryAlt: '#0e0e0e',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#121212',
  },
});
