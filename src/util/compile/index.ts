import COMPILE_WORKER from '!!raw-loader!./worker.js';
import LIB_BROWSER from '!!raw-loader!@/lib/browser.js';
import LIB_PREACT from '!!raw-loader!@/lib/preact.js';
import LIB_UI from '!!raw-loader!@/lib/ui.js';
import LIB_UTIL from '!!raw-loader!@/lib/util.js';
import { Meta } from '@/types';
import workerize from 'workerize';

const compileWorker = workerize(COMPILE_WORKER);

export function excuteCompile(context: {
  meta: Required<Pick<Meta, 'id' | 'name' | 'source' | 'version'>>;
}): Promise<string> {
  return compileWorker.compile({
    ...context,
    env: {
      // bextHome: BEXT_HOME,
    },
    builtins: {
      browser: LIB_BROWSER,
      util: LIB_UTIL,
      ui: LIB_UI,
      preact: LIB_PREACT,
    },
  });
}
