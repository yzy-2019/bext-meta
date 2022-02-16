import { VercelRequest, VercelResponse } from '@vercel/node';
import meta from '../public/meta/_index.json';
import metaTag from '../meta-tag.json';

const ORIGINS = ['localhost', 'bext.ketra.fun'];

export default (request: VercelRequest, response: VercelResponse) => {
  if (
    request.headers?.origin &&
    ORIGINS.some(origin => request.headers.origin.includes(origin))
  ) {
    // cors
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    response.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (request.method === 'OPTIONS') {
      response.status(200).end();
      return;
    }
  }

  response.setHeader('Cache-Control', 'max-age=0, s-maxage=31536000');
  response.status(200).json({
    hash: process.env.VERCEL_GIT_COMMIT_SHA,
    meta,
    metaTag,
  });
};
