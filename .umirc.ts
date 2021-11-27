import font from './src/assets/font';
import dayjs from 'dayjs';
import shelljs from 'shelljs';
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
  define: {
    BUILD_TIMESTAMP: dayjs().unix(),
    BUILD_HASH: shelljs.exec('git rev-parse --short HEAD').toString(),
  },
});
