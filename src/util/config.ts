import BEXT_HOME from '!!raw-loader!../../BEXT_HOME';

interface Config {
  env: 'dev' | 'production' | 'preview';
  metaPrefix: string;
  jse: string;
}

const origin = window.location.origin;

const env: Config['env'] = origin.startsWith(BEXT_HOME)
  ? 'production'
  : origin.includes('surge.sh')
  ? 'preview'
  : 'dev';

// 加上 ?jse-dev 切换至本地 jse
const JSE_EDITOR = location.search.includes('jse-dev')
  ? 'http://localhost:1234/'
  : 'https://lemon399.gitee.io/json-schema-editor-visual/';

const defaultConfig: Config = {
  env: 'production',
  // FIXME: jsdelivr
  // metaPrefix: `https://cdn.jsdelivr.net/gh/ikkz/bext@${BUILD_HASH}/public/meta`,
  metaPrefix: `https://cdn.staticaly.com/gh/ikkz/bext@${BUILD_HASH}/public/meta`,
  jse: JSE_EDITOR,
};

const devConfig: Partial<Config> = {
  env: 'dev',
  metaPrefix: '/meta',
};

const previewConfig: Partial<Config> = {
  env: 'preview',
  metaPrefix: devConfig.metaPrefix,
};

export const config: Config = {
  ...defaultConfig,
  ...{
    dev: devConfig,
    preview: previewConfig,
    production: {},
  }[env],
};

export const isBextClient = !!window.ReactNativeWebView;
