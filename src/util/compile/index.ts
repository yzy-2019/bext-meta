import BEXT_HOME from '!!raw-loader!../../../BEXT_HOME';
import COMPILE_WORKER from '!!raw-loader!./worker.js';
import LIB_BROWSER from '!!raw-loader!@/lib/browser.js';
import LIB_UTIL from '!!raw-loader!@/lib/util.js';
import { Meta } from '@/types.js';
import workerize from 'workerize';

const compileWorker = workerize(COMPILE_WORKER);

export function excuteCompile(context: {
  meta: Required<Pick<Meta, 'id' | 'name' | 'source' | 'version'>> &
    Pick<Meta, 'options'>;
}): Promise<string> {
  if (context.meta?.options) {
    return compileWorker.compile({
      ...context,
      env: {
        // bextHome: BEXT_HOME,
      },
      builtins: {
        browser: LIB_BROWSER,
        util: LIB_UTIL,
      },
    });
  }
  return Promise.resolve(context.meta.source);
}
