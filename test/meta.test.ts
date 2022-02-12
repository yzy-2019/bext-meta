import Ajv from 'ajv';
import fs from 'fs';

const ajv = new Ajv();

const ID_RULE = /^[0-9]+$/;
const META_SCHEMA = {
  type: 'object',
  properties: {
    version: { type: 'string' },
    id: { type: 'string' },
    name: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    synopsis: { type: 'string' },
    match: { type: 'array', items: { type: 'string' } },
    detail: { type: 'string' },
    type: { type: 'string', enum: ['javascript'] },
    source: { type: 'string' },
    extra: { type: 'object', properties: { xMetaComment: { type: 'string' } } },
    configSchema: {},
    defaultConfig: {},
  },
  required: [
    'detail',
    'id',
    'name',
    'source',
    'synopsis',
    'tags',
    'type',
    'version',
  ],
  $schema: 'http://json-schema.org/draft-07/schema#',
};

const validate = ajv.compile(META_SCHEMA);

const metas = fs.readdirSync('./meta').map(fileName => ({
  ...JSON.parse(fs.readFileSync(`./meta/${fileName}`, { encoding: 'utf-8' })),
  id: fileName.replace(/\.json$/, ''),
}));

describe('Meta 格式校验', () => {
  metas.forEach(meta => {
    test(meta.id, () => {
      expect(ID_RULE.test(meta.id) || meta.id === 'example').toBeTruthy();

      expect(() => {
        const result = validate(meta);
        if (!result) {
          throw validate.errors;
        }
      }).not.toThrow();
    });
  });
});
