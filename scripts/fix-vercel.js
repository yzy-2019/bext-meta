const shelljs = require('shelljs');
const lodash = require('lodash');
const fs = require('fs');
const package = JSON.parse(
  fs.readFileSync('package.json', { encoding: 'utf-8' }),
);
const TMP = 'git-tmp';

async function main() {
  const branch = lodash.trim(
    shelljs.exec('git branch --show-current').toString(),
    '\n',
  );
  if (branch != 'master') {
    console.log(`skip fix branch: ${branch}`);
    return;
  }
  shelljs.exec(`git clone --branch=${branch} ${package.repository.url} ${TMP}`);
  shelljs.rm('-rf', '.git');
  shelljs.mv(`${TMP}/.git`, '.git');
}

if (process.env.VERCEL) {
  main();
}
