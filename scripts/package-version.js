const fs = require('fs');

const packageJson = JSON.parse(
  fs.readFileSync('package.json', { encoding: 'utf-8' }),
);
packageJson.version += `-${process.env.GITHUB_SHA}`;
fs.writeFileSync('package.json', JSON.stringify(packageJson));
