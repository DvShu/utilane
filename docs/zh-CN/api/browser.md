# utilane/browser API 参考

[English](../../api/browser.md) | 简体中文

<!-- 由贡献者与 AI 编码助手随源码变更维护。 -->

环境：浏览器专用。返回[文档目录](../index.md)。

以下表格列出此入口可导入的名称；标为类型的名称请使用 `import type`。表外的辅助声明和父类不代表公共导出。默认值与运行时限制见分类指南及源码。

| 导出                    | 类别 | 说明                                                                                   |
| ----------------------- | ---- | -------------------------------------------------------------------------------------- |
| `$`                     | 值   | 根据选择器获取 DOM 元素。                                                              |
| `$$`                    | 值   | 创建节点                                                                               |
| `$one`                  | 值   | 根据选择器获取匹配的第一个 DOM 元素。                                                  |
| `addClass`              | 值   | 为节点添加 class                                                                       |
| `applyColorTheme`       | 值   | 应用主题色                                                                             |
| `applyTheme`            | 值   | 应用主题                                                                               |
| `attr`                  | 值   | 设置或获取节点 data-* 属性                                                             |
| `calcuteCursorPosition` | 值   | 计算光标位置                                                                           |
| `clear`                 | 值   | 清空所有的缓存内容                                                                     |
| `clsx`                  | 值   | 条件化类名拼接工具，支持任意嵌套的字符串、数组、对象参数。                             |
| `copy`                  | 值   | 复制数据, 可以从多种类型的数据                                                         |
| `create`                | 值   | 创建一个 HTML 元素，支持通过标签名或 HTML 字符串创建。                                 |
| `debounce`              | 值   | 函数防抖 - 当重复触发某一个行为（事件时），只执行最后一次触发                          |
| `elem`                  | 值   | 见下方类型声明与分类指南                                                               |
| `formatClass`           | 值   | 格式化类名，支持数组和对象两种形式。                                                   |
| `formatStyle`           | 值   | 将样式对象格式化为 CSS 样式字符串。                                                    |
| `formJson`              | 值   | 解析 Form 表单中的 input 元素的数据为 JSON 格式，key: input-name；value: input-value   |
| `get`                   | 值   | 从 Storage 中取出数据                                                                  |
| `getAttr`               | 值   | 获取属性值                                                                             |
| `getColorTheme`         | 值   | 获取当前主题色                                                                         |
| `getSystemTheme`        | 值   | 获取当前系统的主题                                                                     |
| `getTheme`              | 值   | 获取当前主题                                                                           |
| `hasClass`              | 值   | 判断节点是否包含某个 class                                                             |
| `html`                  | 值   | 设置或获取节点的 innerHTML 属性                                                        |
| `initColorTheme`        | 值   | 初始化主题色, 让网页能够适应系统主题色, 同时根据缓存的主题色切换主题色                 |
| `initTheme`             | 值   | 初始化主题, 让网页能够适应系统主题, 同时根据缓存的主题切换主题                         |
| `isMobile`              | 值   | 判断当前设备是否为移动设备。                                                           |
| `isVisible`             | 值   | 判断元素是否在父元素的可视区域内。                                                     |
| `iterate`               | 值   | 见下方类型声明与分类指南                                                               |
| `off`                   | 值   | 移除指定元素的事件监听器。                                                             |
| `on`                    | 值   | 为节点添加事件处理                                                                     |
| `parent`                | 值   | 获取指定节点的父节点                                                                   |
| `query`                 | 值   | 获取 url query 参数 (get 请求的参数)                                                   |
| `queryHideNodeSize`     | 值   | 获取隐藏节点的尺寸, 如果 parent 传空, 且 hideNode 为节点，则会通过修改原始样式方式计算 |
| `remove`                | 值   | 删除存储到 Storage 中的数据                                                            |
| `removeClass`           | 值   | 节点移除 class                                                                         |
| `replaceClass`          | 值   | 替换指定元素的 CSS 类                                                                  |
| `set`                   | 值   | 存储值到 Storage 中                                                                    |
| `shouldEventNext`       | 值   | 判断事件是否应该继续传递。                                                             |
| `styx`                  | 值   | 条件化样式拼接工具，支持任意嵌套的字符串、数组、对象参数。                             |
| `text`                  | 值   | 设置或获取节点的 textContent 属性                                                      |
| `throttle`              | 值   | 函数节流 - 每隔单位时间，只执行一次                                                    |
| `toggleClass`           | 值   | 切换指定元素的类名。                                                                   |
| `toggleColorTheme`      | 值   | 切换主题色, 通常用于预览                                                               |
| `toggleTheme`           | 值   | 切换主题, 通常用于预览                                                                 |
| `transition`            | 值   | 执行元素的过渡动画。                                                                   |

## 完整类型声明

以下声明参考包含重载、返回值和辅助类型，需随源码变更维护。发布包中的 .d.ts 由 tsdown 生成。相对导入描述声明关系，不是额外公共包路径。

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
