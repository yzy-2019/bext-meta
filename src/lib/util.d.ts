declare module '@bext/util' {
  export function detectBrowser():
    | 'alook'
    | 'x'
    | 'bz'
    | 'shark'
    | 'lit'
    | 'via'
    | undefined;

  export function base64(str: string): string;

  export function runOnce(fn: () => void): void;

  export function runAt(
    start: 'document-body' | 'document-end' | 'document-idle' | number,
    fn: () => void,
    ...args: any[]
  ): void;

  export function addElement(params: {
    tag: string;
    attrs: Record<string, any>;
    to?: Element;
  }): Element;

  export function getElement(
    rules: string | string[],
    all?: boolean,
    parent?: Element,
  ): Element | Element[];

  export function removeElement(
    rules: string | string[],
    withParent: boolean,
    out: number,
  ): void;

  export function loadScript(src: string): Promise<HTMLScriptElement>;

  export function addStyle(css: string): HTMLStyleElement;

  export function loadStyle(url: string): Promise<HTMLLinkElement>;

  export function getBextHome(): Promise<string>;

  export function checkUpdate(day?: number): Promise<string | undefined>;

  type Callback = (...args: any[]) => void;

  export class EventEmitter {
    private listeners: Record<string, Callback[]>;
    public on(event: string, fn: Callback): void;
    public off(event: string, fn: Callback): void;
    public emit(event: string, ...args: any[]): void;
  }
}
