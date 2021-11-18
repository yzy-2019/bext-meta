import { IApi, utils } from 'umi';
import fs from 'fs';
import shelljs from 'shelljs';
import simpleGit, { SimpleGit } from 'simple-git';
import { MetaVersion } from '@/types';
import first from 'lodash/first';

let gitInstance: SimpleGit;

const metaConfig = {
  dir: 'meta',
  public: 'config/public/meta',
};

export default (api: IApi) => {
  api.describe({
    key: 'bextMeta',
    config: {},
  });

  api.onStart(() => {
    if (!shelljs.which('git')) {
      throw Error('需要 git');
    }

    gitInstance = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
    });
  });

  api.addTmpGenerateWatcherPaths(() => [metaConfig.dir]);

  api.onGenerateFiles(({ files }) => {
    if (files.length) {
      console.log('generate ', files);
    } else {
      console.log('全量生成');
    }
  });
};

async function generatePublicMeta() {
  const metas = await Promise.all(
    fs.readdirSync(metaConfig.dir).map(async (fileName) => {
      const fileMap = new Map<string, string>();
      const id = fileName.replace(/\.json$/, '');
      const filePath = `${metaConfig.dir}/${id}.json`;

      const versions: MetaVersion[] = (
        await gitInstance.log({
          file: filePath,
        })
      ).all
        .filter(({ message }) => !message.startsWith('skip:'))
        .map(({ refs, body, diff, ...rest }) => ({ ...rest, version: '' }));

      for (const version of versions) {
        const content = await gitInstance.show(`${version.hash}:${filePath}`);
        version.version = JSON.parse(content).version;
        fileMap.set(`${version.hash}.json`, content);
      }

      const diskContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

      if (
        versions.length === 0 ||
        fileMap.get(`${first(versions)?.hash}.json`)?.trim() ===
          diskContent.trim()
      ) {
        versions.unshift({
          hash: 'WIP',
          date: Date.now().toString(),
          message: 'commit message 将在这里展示',
          author_name:
            (await gitInstance.getConfig('user.name')).value || 'UNKNOWN',
          author_email:
            (await gitInstance.getConfig('user.email')).value || 'UNKNOWN',
          version: JSON.parse(diskContent).version,
        });
        fileMap.set('wip.json', diskContent);
      }

      fileMap.set(
        'index.json',
        JSON.stringify({
          versions,
          meta: diskContent,
          hash: first(versions)?.hash,
        }),
      );

      return fileMap;
    }),
  );

  // console.log(metas);

  // fs.writeFileSync(
  //   `${PUBLIC_META_DIR}/index.json`,
  //   JSON.stringify(
  //     extensions.map(({ id, name, synopsis, tags }) => ({
  //       id,
  //       name,
  //       synopsis,
  //       tags,
  //     })),
  //   ),
  // );
}
