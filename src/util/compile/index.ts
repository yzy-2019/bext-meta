import LIB_BROWSER from '!!raw-loader!@/lib/browser.js';
import LIB_UTIL from '!!raw-loader!@/lib/util.js';
import CompileWorker from './compile.worker.js';
import { Meta } from '@/types.js';
import { uniqueId } from 'lodash-es';

const messageHandlers: Record<string, (data: any) => void> = {};

export const workerReady = new Promise((resolve) => {
  messageHandlers.ready = resolve;
});

const worker = new CompileWorker();

worker.addEventListener('message', ({ data }) => {
  const { id, type } = data || {};
  switch (type) {
    case 'success':
    case 'error':
      messageHandlers[id]?.(data);
      delete messageHandlers[id];
      break;
    case 'ready':
      messageHandlers['ready']?.(data);
      delete messageHandlers.ready;
      break;
    default:
      break;
  }
});

export function excuteCompile(context: {
  meta: Required<Pick<Meta, 'id' | 'name' | 'source' | 'version' | 'options'>>;
}) {
  return new Promise<string>((resolve, reject) => {
    const id = uniqueId('bext_');
    messageHandlers[id] = ({ type, payload }) => {
      switch (type) {
        case 'success':
          resolve(payload);
          break;
        case 'error':
          reject(payload);
          break;
        default:
          break;
      }
    };
    setTimeout(() => {
      if (messageHandlers[id]) {
        messageHandlers[id]({ type: 'error' });
        delete messageHandlers[id];
      }
    }, 3000);
    worker.postMessage({
      type: 'compile',
      id,
      payload: {
        ...context,
        builtins: {
          browser: LIB_BROWSER,
          util: LIB_UTIL,
        },
      },
    });
  });
}
