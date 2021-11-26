import { Meta, MetaVersion } from '@/types';
import dayjs from 'dayjs';
import fs from 'fs';
import first from 'lodash/first';
import pick from 'lodash/pick';
import shuffle from 'lodash/shuffle';
import sortBy from 'lodash/sortBy';
import takeRight from 'lodash/takeRight';
import path from 'path';
import shelljs from 'shelljs';
import simpleGit, { SimpleGit } from 'simple-git';
import { IApi } from 'umi';

let gitInstance: SimpleGit;
const metaConfig = {
  dir: 'meta',
  public: 'public/meta',
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

  api.addTmpGenerateWatcherPaths(() => metaConfig.dir);

  api.onGenerateFiles(async () => {
    const { metas, latestUpdate } = await generatePublicMeta();
    for (const { fileMap, id } of metas) {
      const dir = path.join(metaConfig.public, id);
      shelljs.rm('-rf', dir);
      await api.utils.mkdirp(dir);
      fileMap.forEach((content, fileName) =>
        fs.writeFileSync(path.join(metaConfig.public, id, fileName), content),
      );
    }
    fs.writeFileSync(
      path.join(metaConfig.public, '_index.json'),
      JSON.stringify({
        metas: metas.map(({ currentJson, id }) => ({
          id,
          ...pick(currentJson, ['name', 'version', 'tags', 'type', 'synopsis']),
        })),
        latestUpdate,
      }),
    );
  });
};

async function generatePublicMeta() {
  const latestUpdate: { id: string; date: number }[] = [];
  const metas = await Promise.all(
    fs.readdirSync(metaConfig.dir).map(async (fileName) => {
      const fileMap = new Map<string, string>();
      const id = fileName.replace(/\.json$/, '');
      const filePath = `${metaConfig.dir}/${id}.json`;

      const versions: MetaVersion[] = (
        await gitInstance.log(['-p', '--', filePath])
      ).all
        .filter(({ message }) => !message.startsWith('skip:'))
        .map(({ refs, body, diff, ...rest }) => ({
          ...rest,
          version: '',
          date: dayjs(rest.date).unix(),
        }));
      for (const version of versions) {
        const content = await gitInstance.show(`${version.hash}:${filePath}`);
        version.version = JSON.parse(content).version;
        fileMap.set(`${version.hash}.json`, content);
      }

      const currentContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
      const currentJson: Meta = JSON.parse(currentContent);

      if (
        versions.length === 0 ||
        fileMap.get(`${first(versions)?.hash}.json`)?.trim() !==
          currentContent.trim()
      ) {
        versions.unshift({
          hash: 'WIP',
          date: dayjs().unix(),
          message: 'commit message 将在这里展示',
          author_name:
            (await gitInstance.getConfig('user.name')).value || 'UNKNOWN',
          author_email:
            (await gitInstance.getConfig('user.email')).value || 'UNKNOWN',
          version: `${currentJson.version}(WIP)`,
        });
        fileMap.set('WIP.json', currentContent);
      }

      fileMap.set(
        '_index.json',
        JSON.stringify({
          versions,
          meta: currentJson,
          hash: first(versions)?.hash,
        }),
      );

      latestUpdate.push({ id, date: first(versions)?.date || 0 });
      return { id, fileMap, currentJson };
    }),
  );

  return {
    metas: shuffle(metas),
    latestUpdate: takeRight(sortBy(latestUpdate, 'date'), 6)
      .map(({ id }) => id)
      .reverse(),
  };
}
