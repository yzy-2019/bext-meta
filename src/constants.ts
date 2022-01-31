import { createTheme } from '@fluentui/react';
import isMobile from 'is-mobile';

export const ID_RULE = /^[0-9]+$/;

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
    neutralLighterAlt: '#282828',
    neutralLighter: '#313131',
    neutralLight: '#3f3f3f',
    neutralQuaternaryAlt: '#484848',
    neutralQuaternary: '#4f4f4f',
    neutralTertiaryAlt: '#6d6d6d',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#1e1e1e',
  },
});

export const IS_MOBILE = isMobile();

export const DEFAULT_SCHEMA = {
  type: 'object',
  properties: {
    key1: {
      type: 'string',
      title: '示例选项1',
    },
    key2: {
      type: 'string',
      title: '示例选项2',
    },
  },
  required: ['key2'],
};
