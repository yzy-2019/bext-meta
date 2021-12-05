module.exports = {
  moduleNameMapper: {
    '@bext/(.*)': '<rootDir>/src/lib/$1.js',
    '!!raw-loader!../../BEXT_HOME': '<rootDir>/tests/mocks/bext-home.js',
  },
};
