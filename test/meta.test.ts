import { ID_RULE } from '../src/constants';
import Ajv from 'ajv';
import fs from 'fs';
import { generateSchema, getProgramFromFiles } from 'typescript-json-schema';

const ajv = new Ajv();

const program = getProgramFromFiles(['./src/types.ts'], {
  strictNullChecks: true,
  esModuleInterop: true,
});
const validate = ajv.compile(
  generateSchema(program, 'Meta', { required: true }),
);
const metas = fs.readdirSync('./meta').map((fileName) => ({
  ...JSON.parse(fs.readFileSync(`./meta/${fileName}`, { encoding: 'utf-8' })),
  id: fileName.replace(/\.json$/, ''),
}));

describe('Meta 格式校验', () => {
  metas.forEach((meta) => {
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
