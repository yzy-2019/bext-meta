import { defineConfig } from 'umi';

const fonts = [
  'https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-light.woff2',
  'https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-regular.woff2',
  'https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semibold.woff2',
  'https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-bold.woff2',
  'https://static2.sharepointonline.com/files/fabric/assets/icons/fabric-icons-a13498cf.woff',
];

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  extraPostCSSPlugins: [require('tailwindcss')],
  plugins: ['./src/plugins/meta'],
  links: fonts.map((href) => ({
    rel: 'preload',
    as: 'font',
    crossorigin: 'anonymous',
    href,
  })),
});
