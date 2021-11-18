import { defineConfig } from 'umi';
import font from './src/assets/font';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  extraPostCSSPlugins: [require('tailwindcss')],
  plugins: ['./src/plugins/meta'],
  links: font.map((href) => ({
    rel: 'preload',
    as: 'font',
    crossorigin: 'anonymous',
    href,
  })),
});
