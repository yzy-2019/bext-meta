import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (request: VercelRequest, response: VercelResponse) => {
  response.setHeader("Cache-Control", "max-age=0, s-maxage=31536000");
  response.status(200).json({
    hash: process.env.VERCEL_GIT_COMMIT_SHA
  });
};
