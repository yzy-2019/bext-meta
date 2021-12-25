declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare var BUILD_TIMESTAMP: number;
declare var BUILD_HASH: string;

declare module '*.worker.js' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export = WebpackWorker;
}

declare module '@bext/*';

declare module '!!raw-loader!*' {
  const content: string;
  export default content;
}

declare module 'workerize';

declare interface Window {
  _hmt: any[][];
  Quill: typeof import('quill').Quill;
}
