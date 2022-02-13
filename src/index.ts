import meow from 'meow';
import generate from './generate';
import server from './server';

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
  case 'server':
    server();
    break;
  default:
    break;
}
