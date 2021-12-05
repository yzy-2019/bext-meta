const shelljs = require('shelljs');

if (process.env.VERCEL) {
  shelljs.rm('-rf', 'dist/meta');
}
