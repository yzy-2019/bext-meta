import express from 'express';
import cors from 'cors';
import open from 'open';
import { noop } from 'lodash-es';

// yarn bext preview
export default function(meta: string) {
  if (!meta) {
    throw new Error('meta is required');
  }
  const PORT = 8001;
  const app = express();

  app.use(cors());
  app.use(
    express.static('meta', {
      index: false,
      redirect: false,
    })
  );

  app.listen(PORT, () => {
    const url = `https://bext.ketra.fun/meta/preview?previewId=${meta}&previewMeta=${encodeURIComponent(
      `http://localhost:${PORT}/${meta}.json`
    )}`;
    console.log(`Try to open ${url}`);
    open(url).catch(noop);
  });
}
