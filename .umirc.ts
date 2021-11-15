import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  extraPostCSSPlugins: [require('tailwindcss')],
  bextMeta: {},
});
