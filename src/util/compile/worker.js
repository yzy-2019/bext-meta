importScripts(
  'https://cdn.jsdelivr.net/npm/rollup@2.60.1/dist/rollup.browser.js',
  'https://cdn.jsdelivr.net/npm/path-browser@2.2.1/path.min.js',
);

const BUILTIN_PREFIX = '@bext/';
const bext = ({ builtins, meta, env }) => {
  const context = ['id', 'name', 'version', ...Object.keys(env || {})]
    .map(
      (prop) =>
        `export const ${prop} = decodeURIComponent('${encodeURIComponent(
          meta[prop] || env[prop],
        )}');`,
    )
    .join('\n');
  Object.assign(builtins, {
    context,
    entry: meta.source,
  });
  return {
    name: 'bext',
    resolveId(id) {
      if (
        id.startsWith(BUILTIN_PREFIX) &&
        id.replace(BUILTIN_PREFIX, '') in builtins
      ) {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id.startsWith(BUILTIN_PREFIX)) {
        const index = id.replace(BUILTIN_PREFIX, '');
        return builtins[index];
      }
      return null;
    },
    renderChunk(code) {
      const comments = [];
      this.parse(code, {
        onComment: comments,
      });
      const sortedComments = comments.sort((a, b) => b.start - a.start);
      for (const { start, end } of sortedComments) {
        code = code.slice(0, start) + code.slice(end);
      }
      return code;
    },
  };
};

const URL = /^https?:/;

const url = () => {
  return {
    resolveId(source, importer) {
      if (URL.test(source)) {
        return source;
      }
      if (URL.test(importer)) {
        return path.resolve(importer, '..', source);
      }
      return null;
    },
    async load(id) {
      if (URL.test(id)) {
        return (await fetch(id)).text();
      }
      return null;
    },
  };
};

export async function compile(payload) {
  const bundle = await rollup.rollup({
    input: '@bext/entry',
    plugins: [bext(payload), url()],
  });
  const { output } = await bundle.generate({ format: 'iife' });
  return output[0].code;
}
