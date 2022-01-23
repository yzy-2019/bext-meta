declare module '@bext/ui' {
  interface BextBar extends HTMLDivElement {
    queryAll(): string[];
    query(id: string):
      | {
          button: HTMLButtonElement;
          text: string;
          textcolor: string;
          backcolor: string;
        }
      | number;
    add(
      id: string,
      opt: {
        text: string;
        callback: (
          bar: BextBar,
          button: HTMLButtonElement,
          e: PointerEvent,
        ) => void;
        textcolor?: string;
        backcolor?: string;
      },
    ): number;
    change(
      id: string,
      opt: {
        text?: string;
        callback?: (
          bar: BextBar,
          button: HTMLButtonElement,
          e: PointerEvent,
        ) => void;
        textcolor?: string;
        backcolor?: string;
      },
    ): number;
    del(id: string): number;
  }

  export function getBextBar(): BextBar;

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
