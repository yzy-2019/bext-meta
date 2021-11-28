importScripts(
  'https://cdn.jsdelivr.net/npm/rollup@2.60.1/dist/rollup.browser.js',
  'https://cdn.jsdelivr.net/npm/@babel/standalone@7.16.4/babel.min.js',
  'https://cdn.jsdelivr.net/npm/terser@5.10.0/dist/bundle.min.js',
);

const BUILTIN_PREFIX = '@bext/';
const bext = ({ builtins, meta }) => {
  const context = ['id', 'name', 'version']
    .map(
      (prop) =>
        `export const ${prop} = decodeURIComponent('${encodeURIComponent(
          meta[prop],
        )}');`,
    )
    .join('');
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
        return index === 'entry'
          ? builtins[index]
          : await Terser.minify(builtins[index]);
      }
      return null;
    },
  };
};

const compile = async (payload) => {
  const bundle = await rollup.rollup({
    input: '@bext/entry',
    plugins: [bext(payload)],
  });
  const { output } = await bundle.generate({ format: 'iife' });
  return output[0].code;
};

self.addEventListener('message', async ({ data }) => {
  const result = { id: data.id, type: 'success' };
  try {
    switch (data.type) {
      case 'compile':
        result.payload = await compile(data.payload);
        break;
      default:
        break;
    }
  } catch (error) {
    result.type = 'error';
    result.payload = error;
  }
  self.postMessage(result);
});

self.postMessage({
  type: 'ready',
});
