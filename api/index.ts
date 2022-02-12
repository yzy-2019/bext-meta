import type { VercelRequest, VercelResponse } from '@vercel/node';
import shelljs from 'shelljs';

export default (request: VercelRequest, response: VercelResponse) => {
  response.setHeader("Cache-Control", "max-age=0, s-maxage=31536000");
  response.status(200).json({
    hash: shelljs.exec('git rev-parse HEAD').toString().replace('\n', '')
  });
};
