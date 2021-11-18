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

declare interface Window {
  via?: {
    getInstalledAddonID: () => string;
    addon: (ext: string) => void;
  };
  alook?: {
    addon: (ext: string) => void;
  };
}
