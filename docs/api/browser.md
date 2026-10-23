# utilane/browser API reference

English | [简体中文](../zh-CN/api/browser.md)

<!-- Maintained with source changes by contributors and AI coding agents. -->

Environment: Browsers only. Back to the [documentation index](../index.md).

The table lists names you can import from this entry. Use `import type` for types. Supporting declarations and parent classes are not necessarily public exports. See the guides and source for defaults and runtime limitations.

| Export                  | Kind  | Description                                                 |
| ----------------------- | ----- | ----------------------------------------------------------- |
| `$`                     | Value | Query matching DOM elements.                                |
| `$$`                    | Value | Create a DOM node.                                          |
| `$one`                  | Value | Query the first matching DOM element.                       |
| `addClass`              | Value | Add an element class.                                       |
| `applyColorTheme`       | Value | Apply and optionally cache a color theme.                   |
| `applyTheme`            | Value | Apply and optionally cache a theme.                         |
| `attr`                  | Value | Get or set a data attribute.                                |
| `calcuteCursorPosition` | Value | Calculate cursor position after a text change.              |
| `clear`                 | Value | Clear all entries from the selected Storage.                |
| `clsx`                  | Value | Combine conditional class names.                            |
| `copy`                  | Value | Copy text or element content to the clipboard.              |
| `create`                | Value | Create an HTML element.                                     |
| `debounce`              | Value | Invoke after calls stop for an interval.                    |
| `elem`                  | Value | Resolve a selector or element to an element array.          |
| `formatClass`           | Value | Format class names from an array or object.                 |
| `formatStyle`           | Value | Format CSS styles.                                          |
| `formJson`              | Value | Parse supported form fields into an object.                 |
| `get`                   | Value | Read stored data with optional expiration and deletion.     |
| `getAttr`               | Value | Read an attribute with optional type conversion.            |
| `getColorTheme`         | Value | Get the current color theme.                                |
| `getSystemTheme`        | Value | Read the system theme preference.                           |
| `getTheme`              | Value | Get the current theme.                                      |
| `hasClass`              | Value | Check for an element class.                                 |
| `html`                  | Value | Read or write innerHTML.                                    |
| `initColorTheme`        | Value | Initialize a color theme.                                   |
| `initTheme`             | Value | Initialize theme styles and preferences.                    |
| `isMobile`              | Value | Detect a mobile device using browser information.           |
| `isVisible`             | Value | Check visibility within a parent.                           |
| `iterate`               | Value | Iterate over DOM elements.                                  |
| `off`                   | Value | Remove event listeners.                                     |
| `on`                    | Value | Register event handlers.                                    |
| `parent`                | Value | Get a parent element.                                       |
| `query`                 | Value | Parse URL query parameters.                                 |
| `queryHideNodeSize`     | Value | Measure hidden content.                                     |
| `remove`                | Value | Remove a Storage entry.                                     |
| `removeClass`           | Value | Remove an element class.                                    |
| `replaceClass`          | Value | Replace an element class.                                   |
| `set`                   | Value | Store a JSON value with optional expiration.                |
| `shouldEventNext`       | Value | Determine whether delegated event handling should continue. |
| `styx`                  | Value | Combine conditional CSS styles.                             |
| `text`                  | Value | Read or write textContent.                                  |
| `throttle`              | Value | Limit call frequency, with trailing invocation.             |
| `toggleClass`           | Value | Toggle an element class.                                    |
| `toggleColorTheme`      | Value | Switch the color theme.                                     |
| `toggleTheme`           | Value | Switch the appearance theme.                                |
| `transition`            | Value | Run an element transition.                                  |

## Complete type declarations

The declaration reference below includes overloads, return types, and supporting types. Maintain it alongside source changes. tsdown generates the distributed .d.ts files. Relative imports describe declaration relationships, not additional public package paths.

```typescript
type FormatStyleParam = (string | undefined | null)[] | Record<string, boolean | string | undefined | null> | string;
type FormatClassParam = (string | undefined | null | boolean)[] | Record<string, boolean | string | undefined | null | boolean> | string;
type DocumentContext = HTMLElement | ShadowRoot | Document;
type NodeChildren = HTMLElement | DocumentFragment | HTMLElement[] | NodeListOf<HTMLElement> | HTMLCollection;
declare function elem(selector: string | HTMLElement, dom?: DocumentContext): HTMLElement[];
declare function $(selector: string | HTMLElement, dom?: DocumentContext): HTMLElement[];
declare function create(tag: string, option?: {
    class?: FormatClassParam;
    style?: FormatStyleParam;
    textContent?: string;
    innerHTML?: string;
    outerHTML?: string;
    [index: string]: any;
}, children?: NodeChildren): HTMLElement;
declare function $$(tag: string, option?: {
    class?: FormatClassParam;
    style?: FormatStyleParam;
    textContent?: string;
    innerHTML?: string;
    outerHTML?: string;
    [index: string]: any;
}, children?: NodeChildren): HTMLElement;
declare function $one(selector: string | HTMLElement, dom?: DocumentContext): HTMLElement | null;
declare function addClass(elem: HTMLElement, clazz: string): void;
declare function removeClass(elem: HTMLElement, clazz: string): void;
declare function hasClass(elem: HTMLElement, clazz: string): boolean;
declare function toggleClass(el: HTMLElement, clazz: string): void;
declare function replaceClass(el: HTMLElement, oldClazz: string | number, newClazz: string): void;
type EventHandler = EventListenerOrEventListenerObject | ((e: CustomEvent) => void);
declare function on(element: HTMLElement | ShadowRoot | Document | HTMLCollection | NodeListOf<HTMLElement> | HTMLElement[], listener: string, fn: EventHandler, option?: boolean | (AddEventListenerOptions & {
    eventFlag?: string;
})): void;
declare function off(el: HTMLElement | ShadowRoot | Document | HTMLCollection | NodeListOf<HTMLElement> | HTMLElement[], listener: string, fn: EventHandler, option?: boolean | EventListenerOptions): void;
declare function shouldEventNext(e: Event, eventFlag: string, endRoot?: HTMLElement | ShadowRoot): [
    boolean,
    string,
    HTMLElement
];
declare function html(element: HTMLElement, htmlstr?: string): string | undefined;
declare function text(element: HTMLElement, textstr?: string): string | undefined | null;
declare function iterate<T>(elems: T[], fn: (el: T, index: number) => any): void;
declare function iterate(elems: NodeList | HTMLCollection | NodeListOf<HTMLElement>, fn: (el: HTMLElement, index: number) => any): void;
declare function attr(elem: HTMLElement, key: string, value?: string): string | null | undefined;
declare function getAttr(el: HTMLElement, key: string): string;
declare function getAttr(el: HTMLElement, filepath: string, defaultValue: string): string;
declare function getAttr(el: HTMLElement, filepath: string, defaultValue: number): number;
declare function getAttr(el: HTMLElement, filepath: string, defaultValue: boolean): boolean;
declare function getAttr<T extends Record<string, string | number | boolean>>(el: HTMLElement, filepath: string, defaultValue: T): T;
declare function parent(el: HTMLElement): HTMLElement;
declare function queryHideNodeSize(hideNode: string | HTMLElement, parent?: null | HTMLElement): {
    width: number;
    height: number;
};
declare function isVisible(el: HTMLElement, parent?: HTMLElement | null | undefined, direction?: string): boolean;
declare function isMobile(): boolean;
type ClsxValue = string | number | boolean | undefined | null | ClsxValue[] | Record<string, boolean | string | number | undefined | null>;
declare function clsx(...args: ClsxValue[]): string;
declare function formatClass(classObj: (boolean | string | undefined | null)[] | Record<string, boolean | string | undefined | null> | string): string;
type StyxBaseValue = string | boolean | undefined | null;
type StyxValue = StyxBaseValue | StyxBaseValue[] | Record<string, StyxBaseValue | number>;
declare function styx(...args: StyxValue[]): string;
declare function formatStyle(styleObj: FormatStyleParam): string;
declare function transition(el: HTMLElement, nameOrProperties: string | [
    string,
    string,
    string
][], dir?: "leave" | "enter", finish?: () => void): void;
declare function calcuteCursorPosition(start: number, end: number, oldValue: string, newValue: string): {
    start: number;
    end: number;
};
declare function copy(source: string | HTMLElement): Promise<boolean>;
type StorageType = "session" | "local";
interface StorageSetOption {
    storage?: StorageType;
    expire?: number;
}
declare function set(key: string, value: any, option?: StorageSetOption): void;
declare function clear(storage?: StorageType): void;
declare function remove(key: string, storage?: StorageType): void;
interface StorageQueryOption {
    delete?: boolean;
    storage?: StorageType;
}
declare function get<T>(key: string, defaultValue?: T, option?: StorageQueryOption): T;
declare function getSystemTheme(): "light" | "dark" | "auto";
declare function initTheme(): Promise<"light" | "dark" | "auto">;
declare function toggleTheme(theme?: "light" | "dark" | "auto", transition?: boolean): Promise<"light" | "dark" | "auto">;
declare function getTheme(): string;
declare function applyTheme(theme?: "light" | "dark" | "auto", cache?: boolean, transition?: boolean): Promise<"light" | "dark" | "auto">;
declare function getColorTheme(defaultValue?: string): string | undefined;
declare function initColorTheme(): Promise<string> | null;
declare function toggleColorTheme(color: string): Promise<string>;
declare function applyColorTheme(color: string, cache?: boolean): Promise<string>;
type FormValue = string | number | boolean;
declare const formJson: <T extends Record<string, FormValue>>(form: HTMLFormElement) => T;
type QueryResult = string | string[];
declare function query(search?: string): Record<string, QueryResult>;
declare function throttle<R extends unknown[], T>(fn: (...args: R) => T, wait?: number): {
    (...args: R): void;
    cancel: () => void;
};
declare function debounce<R extends unknown[], T>(fn: (...args: R) => T, interval?: number): {
    (...args: R): void;
    cancel: () => void;
};
export { $, $$, $one, addClass, applyColorTheme, applyTheme, attr, calcuteCursorPosition, clear, clsx, copy, create, debounce, elem, formJson, formatClass, formatStyle, get, getAttr, getColorTheme, getSystemTheme, getTheme, hasClass, html, initColorTheme, initTheme, isMobile, isVisible, iterate, off, on, parent, query, queryHideNodeSize, remove, removeClass, replaceClass, set, shouldEventNext, styx, text, throttle, toggleClass, toggleColorTheme, toggleTheme, transition };
```
