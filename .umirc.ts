import font from './src/assets/font';
import { defineConfig } from 'umi';

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
