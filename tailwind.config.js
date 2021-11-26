module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.ts', './src/**/*.tsx'],
  plugins: [require('@tailwindcss/line-clamp')],
};
