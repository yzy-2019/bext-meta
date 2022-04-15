import meow from 'meow';
import generate from './generate';
import preview from './preview';

const cli = meow(
  `
	Usage
	  $ bext generate
    $ bext dev
`,
  {
    importMeta: import.meta,
  }
);

switch (cli.input[0]) {
  case 'generate':
    generate();
    break;
  case 'preview':
    preview(cli.input[1]);
    break;
  default:
    break;
}
