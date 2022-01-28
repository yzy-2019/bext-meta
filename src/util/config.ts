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

const defaultConfig: Config = {
  env: 'production',
  metaPrefix: `https://cdn.jsdelivr.net/gh/ikkz/bext@${BUILD_HASH}/public/meta`,
  jse: 'https://lemon399.gitee.io/json-schema-editor-visual/',
};

const devConfig: Partial<Config> = {
  env: 'dev',
  metaPrefix: '/meta',
  jse: location.search.includes('jse-dev')
    ? 'http://127.0.0.1:8082/index.html'
    : defaultConfig.jse,
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
