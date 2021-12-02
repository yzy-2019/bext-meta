importScripts(
  'https://cdn.jsdelivr.net/npm/rollup@2.60.1/dist/rollup.browser.js',
  'https://cdn.jsdelivr.net/npm/@babel/standalone@7.16.4/babel.min.js',
);

const BUILTIN_PREFIX = '@bext/';
const bext = ({ builtins, meta, env }) => {
  const context = ['id', 'name', 'version', 'bextHome']
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
    transform(code, id) {
      if (id.startsWith(BUILTIN_PREFIX)) {
        const comments = [];
        this.parse(code, {
          onComment: comments,
        });
        const sortedComments = comments.sort((a, b) => b.start - a.start);
        for (const { start, end } of sortedComments) {
          code = code.slice(0, start) + code.slice(end);
        }
        return code;
      }
      return null;
    },
  };
};

export async function compile(payload) {
  const bundle = await rollup.rollup({
    input: '@bext/entry',
    plugins: [bext(payload)],
  });
  const { output } = await bundle.generate({ format: 'iife' });
  return output[0].code;
}
