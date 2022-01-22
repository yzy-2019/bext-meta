declare module '@bext/ui' {
  export function getBextBar(): HTMLDivElement;

  export function toast(
    t: string,
    s?: number,
    c?: {
      text?: string;
      color?: string;
      onclick?: Function;
      onclose?: Function;
    },
  ): void;
}
