// FIXME: jsdelivr
// importScripts(
//   'https://cdn.jsdelivr.net/npm/rollup@2.60.1/dist/rollup.browser.js',
//   'https://cdn.jsdelivr.net/npm/path-browser@2.2.1/path.min.js',
// );
importScripts(
  'https://unpkg.com/rollup@2.60.1/dist/rollup.browser.js',
  'https://unpkg.com/path-browser@2.2.1/path.min.js',
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

const URL_REG = /^https?:/;

const url = () => {
  return {
    resolveId(source, importer) {
      if (URL_REG.test(source)) {
        return source;
      }
      if (URL_REG.test(importer)) {
        const url = new URL(importer);
        url.pathname = path.resolve(url.pathname, '..', source);
        return url.toString();
      }
      return null;
    },
    async load(id) {
      if (URL_REG.test(id)) {
        // FIXME: jsdelivr
        // const parsedUrl = new URL(id);
        // const fileName = parsedUrl.pathname.split('/').pop();
        // if (
        //   parsedUrl.searchParams.has('min') &&
        //   fileName.endsWith('.js') &&
        //   !fileName.endsWith('min.js')
        // ) {
        //   const minFileName = fileName.replace(/\.js$/, '.min.js');
        //   id = path.resolve(id, '..', minFileName);
        // }
        return (
          await fetch(
            id
              .replace('cdn.jsdelivr.net/npm', 'unpkg.com')
              .replace('cdn.jsdelivr.net/gh', 'cdn.staticaly.com/gh'),
          )
        ).text();
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
  const { output } = await bundle.generate({
    format: 'iife',
    output: { strict: false },
  });
  return `(function(){
${output[0].code}
})();`;
}
