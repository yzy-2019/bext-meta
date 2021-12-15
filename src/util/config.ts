import BEXT_HOME from '!!raw-loader!../../BEXT_HOME';

interface Config {
  env: 'dev' | 'production' | 'preview';
  metaPrefix: string;
}

const origin = window.location.origin;

const env: Config['env'] = origin.startsWith(BEXT_HOME)
  ? 'production'
  : origin.includes('surge.sh')
  ? 'preview'
  : 'dev';

export const config: Config = {
  env,
  metaPrefix:
    env === 'production'
      ? `https://cdn.jsdelivr.net/gh/ikkz/bext@${BUILD_HASH}/public/meta`
      : `/meta`,
};
