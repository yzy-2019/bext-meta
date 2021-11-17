import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'bextMeta',
    config: {},
  });

  api.onGenerateFiles((files) => {
    console.log('files', files);
  });

  api.addTmpGenerateWatcherPaths(() => ['./meta/']);
};

// const fs = require('fs');
// const shelljs = require('shelljs');
// const simpleGit = require('simple-git');

// if (!shelljs.which('git')) {
//   shelljs.echo('需要 git');
//   shelljs.exit(1);
// }

// const git = simpleGit({
//   baseDir: process.cwd(),
//   binary: 'git',
// });

// const META_DIR = 'meta';
// const PUBLIC_META_DIR = 'config/public/meta';

// const generate = () => {
//   const extensions = fs.readdirSync(META_DIR).map(fileName => ({
//     ...JSON.parse(
//       fs.readFileSync(`${META_DIR}/${fileName}`, { encoding: 'utf-8' }),
//     ),
//     id: fileName.replace(/\.json$/, ''),
//   }));

//   if (fs.existsSync(PUBLIC_META_DIR)) {
//     shelljs.rm('-rf', PUBLIC_META_DIR);
//   }
//   shelljs.mkdir(PUBLIC_META_DIR);

//   fs.writeFileSync(
//     `${PUBLIC_META_DIR}/index.json`,
//     JSON.stringify(
//       extensions.map(({ id, name, synopsis, tags }) => ({
//         id,
//         name,
//         synopsis,
//         tags,
//       })),
//     ),
//   );

//   extensions.forEach(async ext => {
//     const metaFile = `${META_DIR}/${ext.id}.json`;
//     const dir = `${PUBLIC_META_DIR}/${ext.id}`;
//     shelljs.mkdir(dir);
//     const commits = (
//       await git.log({
//         file: metaFile,
//       })
//     ).all
//       .filter(({ message }) => !message.startsWith('skip:'))
//       .map(({ refs, body, ...rest }) => rest);
//     for (const commit of commits) {
//       const content = await git.show(`${commit.hash}:${metaFile}`);
//       commit.version = JSON.parse(content).version;
//       fs.writeFileSync(`${dir}/${commit.hash}.json`, content);
//     }

//     fs.writeFileSync(
//       `${dir}/index.json`,
//       JSON.stringify({
//         versions: commits,
//         meta: ext,
//         hash: commits[0].hash,
//       }),
//     );
//   });
// };

// if (process.argv[2] === 'build') {
//   generate();
// }

// module.exports.generate = generate;
