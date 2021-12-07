import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['**/*.{jsx,tsx,js,ts}'],
    exclude: [
      'node_modules',
      '.git',
      'dist',
      'mock',
      '.umi',
      '.umi-production',
    ],
  },
  plugins: [require('windicss/plugin/line-clamp')],
});
