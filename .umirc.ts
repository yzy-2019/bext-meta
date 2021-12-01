import font from './src/assets/font';
import dayjs from 'dayjs';
import path from 'path';
import shelljs from 'shelljs';
import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  extraPostCSSPlugins: [require('tailwindcss')],
  plugins: ['./src/plugins/meta'],
  links: [
    ...font.map((href) => ({
      rel: 'preload',
      as: 'font',
      crossorigin: 'anonymous',
      href,
    })),
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css',
    },
  ],
  define: {
    BUILD_TIMESTAMP: dayjs().unix(),
    BUILD_HASH: shelljs.exec('git rev-parse --short HEAD').toString(),
  },
  externals: {
    quill: 'window.Quill',
  },
  headScripts: ['https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js'],
  chainWebpack: (config) => {
    config.module
      .rule('lib')
      .test(/nevermatch/)
      .use('raw')
      .loader('raw-loader');
  },
  alias: {
    '@bext': path.resolve(__dirname, 'src/lib'),
  },
});
