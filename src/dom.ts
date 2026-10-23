/**
 * web(浏览器端) DOM 文件操作
 * 现今不推荐在使用这种方式，现在开发前端的时候，推荐使用一些成熟的框架例如：React、Preact、Vue、Angular、Svelte、Ember、Knockout等
 * 在使用这些框架的时候额外的一些不可避免的 dom 操作时才使用这个工具；如果确实需要使用原生开发推荐使用 jquery 或者想要更精简的话可以使用 https://github.com/finom/bala 封装
 */
/**
 * 根据选择器获取节点
 * @param {string} selector 选择器
 */
type FormatStyleParam =
  | (string | undefined | null)[]
  | Record<string, boolean | string | undefined | null>
  | string;
type FormatClassParam =
  | (string | undefined | null | boolean)[]
  | Record<string, boolean | string | undefined | null | boolean>
  | string;
type DocumentContext = HTMLElement | ShadowRoot | Document;
type NodeChildren =
  | HTMLElement
  | DocumentFragment
  | HTMLElement[]
  | NodeListOf<HTMLElement>
  | HTMLCollection;
export function elem(selector: string | HTMLElement, dom?: DocumentContext): HTMLElement[] {
  if (typeof selector === "string") {
    return (dom || document).querySelectorAll<HTMLElement>(selector) as any;
  } else {
    return [selector];
  }
}

/**
 * 根据选择器获取 DOM 元素。
 * @param selector - 选择器字符串或 HTMLElement 实例。
 * @param dom - 可选参数，指定在哪个 DOM 节点下查找元素，默认为 document。
 * @returns 返回匹配到的 HTMLElement 实例。
 */
export function $(selector: string | HTMLElement, dom?: DocumentContext): HTMLElement[] {
  return elem(selector, dom);
}

/**
 * 创建一个 HTML 元素，支持通过标签名或 HTML 字符串创建。
 * @param tag - 元素标签名或 HTML 字符串。
 * @param option - 元素的属性、样式、文本内容等配置。所有不是指定的属性，都会通过 setAttribute 设置
 * @param children - 子节点
 * @returns 创建的 HTML 元素。
 */
export function create(
  tag: string,
  option: {
    class?: FormatClassParam;
    style?: FormatStyleParam;
    textContent?: string;
    innerHTML?: string;
    outerHTML?: string;
    [index: string]: any;
  } = {},
  children?: NodeChildren,
): HTMLElement {
  let $el;
  if (tag.startsWith("<") && tag.endsWith(">")) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tag, "text/html");
    $el = doc.body.firstElementChild as HTMLElement;
  } else {
    $el = document.createElement(tag);
  }
  if ($el) {
    if (option) {
      for (const key in option) {
        const value = option[key];
        if (value != null) {
          if (key === "class") {
            $el.className = formatClass(value);
          } else if (key === "style") {
            $el.style.cssText = formatStyle(value);
          } else if (key === "textContent" && value) {
            $el.textContent = value;
          } else if (key === "innerHTML" && value) {
            $el.innerHTML = value;
          } else if (key === "outerHTML" && value) {
            $el.outerHTML = value;
          } else {
            if (typeof value === "boolean" && value === true) {
              $el.setAttribute(key, "");
            } else {
              $el.setAttribute(key, value);
            }
          }
        }
      }
    }
    if (children) {
      if (children instanceof HTMLElement || children instanceof DocumentFragment) {
        $el.appendChild(children);
      } else {
        let len = children.length;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < len; i++) {
          const child = children[i];
          if (child instanceof HTMLElement) {
            fragment.appendChild(child);
          }
        }
        if (len > 0) {
          $el.appendChild(fragment);
        }
      }
    }
  }
  return $el;
}
/** 创建节点 */
export function $$(
  tag: string,
  option: {
    class?: FormatClassParam;
    style?: FormatStyleParam;
    textContent?: string;
    innerHTML?: string;
    outerHTML?: string;
    [index: string]: any;
  } = {},
  children?: NodeChildren,
): HTMLElement {
  return create(tag, option, children);
}
/**
 * 根据选择器获取匹配的第一个 DOM 元素。
 * @param selector - 选择器字符串或直接的 HTMLElement。
 * @param dom - 可选的父级 DOM 元素，默认为当前文档。
 * @returns 返回匹配的第一个 HTMLElement，如果没有找到则返回 null。
 */
export function $one(selector: string | HTMLElement, dom?: DocumentContext): HTMLElement | null {
  if (typeof selector === "string") {
    return (dom || document).querySelector<HTMLElement>(selector);
  }
  return selector;
}

/**
 * 为节点添加 class
 * @param {HTMLElement} elem 待添加 class 的节点
 * @param {string} clazz     需要添加的 class
 */
export function addClass(elem: HTMLElement, clazz: string): void {
  elem.classList.add(clazz);
}

/**
 * 节点移除 class
 * @param {HTMLElement} elem 待移除 class 的节点
 * @param {string} clazz     需要移除的 class
 */
export function removeClass(elem: HTMLElement, clazz: string): void {
  elem.classList.remove(clazz);
}

/**
 * 判断节点是否包含某个 class
 * @param elem  待判断 class 的节点
 * @param clazz 待判断的 class
 * @returns
 */
export function hasClass(elem: HTMLElement, clazz: string): boolean {
  return elem.classList.contains(clazz);
}

/**
 * 切换指定元素的类名。
 * 如果元素已包含该类名，则移除它；否则添加它。
 * @param el - 要操作的 HTML 元素。
 * @param clazz - 要切换的类名。
 */
export function toggleClass(el: HTMLElement, clazz: string): void {
  if (hasClass(el, clazz)) {
    removeClass(el, clazz);
  } else {
    addClass(el, clazz);
  }
}

/**
 * 替换指定元素的 CSS 类
 *
 * 该函数用于根据给定的旧类名或类索引，将其替换为新类名。
 * 如果旧类不存在，则不会进行替换。
 *
 * @param el - 目标 HTML 元素，将对其类进行操作
 * @param oldClazz - 要替换的旧类名或类索引（基于数字时对应 classList 的索引位置）
 * @param newClazz - 新的类名，用于替换旧的类
 * @returns void
 */
export function replaceClass(el: HTMLElement, oldClazz: string | number, newClazz: string): void {
  // 判断 oldClazz 是否为数字，若是则通过索引从 el.classList 中获取对应类名，否则直接使用字符串值
  let old = typeof oldClazz === "number" ? el.classList.item(oldClazz) : oldClazz;
  // 如果旧类存在，则使用 classList.replace 方法进行替换
  if (old) {
    el.classList.replace(old, newClazz);
  }
}

type EventHandler = EventListenerOrEventListenerObject | ((e: CustomEvent) => void);

/**
 * 为节点添加事件处理
 * @param {HTMLElement} element   添加事件的节点
 * @param {string}      listener  事件名称
 * @param {function}    fn     事件处理函数
 * @param {boolean}     option  是否是只运行一次的处理函数或者配置，其中 eventFlag 为 string，如果配置该项，则表明为委托事件
 */
export function on(
  element:
    | HTMLElement
    | ShadowRoot
    | Document
    | HTMLCollection
    | NodeListOf<HTMLElement>
    | HTMLElement[],
  listener: string,
  fn: EventHandler,
  option?: boolean | (AddEventListenerOptions & { eventFlag?: string }),
): void {
  // 提取公共的绑定逻辑
  const addListener = (el: EventTarget) => {
    // 重要：只有 Element (包含 HTMLElement) 才有 setAttribute 方法
    // Document 和 ShadowRoot 是没有 setAttribute 的，必须做类型守卫
    if (typeof option === "object" && option?.eventFlag && el instanceof Element) {
      el.setAttribute(option.eventFlag, "__stop__");
    }
    el.addEventListener(listener, fn as any, option);
  };

  // 核心识别逻辑：
  // 如果是 Node 实例，说明是单一节点（HTMLElement, Document, ShadowRoot 都是 Node）
  if (element instanceof Node) {
    addListener(element);
  } else {
    // 否则，说明是 HTMLCollection、NodeList 或 Array，直接遍历
    // （即使 length 为 0，iterate 内部通常也会安全跳过，不需要在外部判断 length > 0）
    iterate(element as HTMLElement[], addListener as any);
  }
}

/**
 * 移除指定元素的事件监听器。
 * @param el - 要移除监听器的 HTML 元素。
 * @param listener - 事件名称。
 * @param fn - 要移除的事件监听器函数。
 */
export function off(
  el:
    | HTMLElement
    | ShadowRoot
    | Document
    | HTMLCollection
    | NodeListOf<HTMLElement>
    | HTMLElement[],
  listener: string,
  fn: EventHandler,
  option?: boolean | EventListenerOptions,
): void {
  // 提取公共的解绑逻辑
  // HTMLElement、Document、ShadowRoot 本质上都实现了 EventTarget 接口
  const removeListener = (target: EventTarget) => {
    target.removeEventListener(listener, fn as any, option);
  };

  // 核心判断：只要是 Node，就是单一节点
  if (el instanceof Node) {
    removeListener(el);
  } else {
    // 否则就是集合（HTMLCollection / NodeList / Array），直接遍历
    iterate(el as HTMLElement[], removeListener as any);
  }
}

/**
 * 判断事件是否应该继续传递。
 * 从事件目标开始向上遍历DOM树，检查每个节点上是否存在指定的属性。
 * 如果找到该属性且其值不为'__stop__'，则返回true，表示事件可以继续传递。
 * 否则，返回false，表示事件应该停止传递。
 * 通常用于事件委托时判断是否继续传递事件。
 *
 * @param e - 触发的事件对象
 * @param eventFlag - 需要检查的属性名
 * @param endRoot - 可选，如果传递该参数，则表示停止遍历的节点，如果未传递，则表示遍历到文档根节点为止
 * @returns 包含三个元素的数组：[是否继续传递事件, 属性值, 当前检查的DOM节点]
 */
export function shouldEventNext(
  e: Event,
  eventFlag: string,
  endRoot?: HTMLElement | ShadowRoot,
): [boolean, string, HTMLElement] {
  let target = e.target as HTMLElement;
  let flag = "";
  do {
    if ((endRoot && endRoot.isSameNode(target)) || target.tagName === "BODY") {
      break;
    }
    if (target.getAttribute) {
      flag = target.getAttribute(eventFlag) || "";
    }
    if (flag === "") {
      target = target.parentNode as HTMLElement;
    }
    if (!target) break;
  } while (flag === "");
  return [flag !== "__stop__" && flag !== "", flag, target];
}

/**
 * 设置或获取节点的 innerHTML 属性
 * @param element
 * @param htmlstr 可选，如果传递该参数，则表示设置；否则表示获取
 * @returns
 */
export function html(element: HTMLElement, htmlstr?: string): string | undefined {
  if (htmlstr == null) {
    return element.innerHTML;
  } else {
    element.innerHTML = htmlstr;
    return undefined;
  }
}

/**
 * 设置或获取节点的 textContent 属性
 * @param element
 * @param textstr 可选，如果传递该参数，则表示设置；否则表示获取
 * @returns
 */
export function text(element: HTMLElement, textstr?: string): string | undefined | null {
  if (textstr == null) {
    return element.textContent;
  } else {
    element.textContent = textstr;
    return undefined;
  }
}

export function iterate<T>(elems: T[], fn: (el: T, index: number) => any): void;
export function iterate(
  elems: NodeList | HTMLCollection | NodeListOf<HTMLElement>,
  fn: (el: HTMLElement, index: number) => any,
): void;
/**
 * 节点列表遍历
 * @param elems
 * @param fn 遍历到节点时的回调，回调第一个参数为遍历到的节点，第2个参数为 index；如果回调函数返回 true，则会终止遍历(break)
 */
export function iterate<T>(
  elems: NodeList | HTMLCollection | T[],
  fn: (el: HTMLElement | T, index: number) => any,
) {
  for (let i = 0, len = elems.length; i < len; i++) {
    let r = fn(elems[i] as T, i);
    if (r === true) {
      break;
    }
  }
}

/**
 * 设置或获取节点 data-* 属性
 * @param elem
 * @param key data- 后面跟随的值
 * @param value 如果传递该值表示获取；否则表示设置
 * @returns
 */
export function attr(elem: HTMLElement, key: string, value?: string): string | null | undefined {
  if (value != null) {
    elem.setAttribute("data-" + key, value);
  } else {
    return elem.getAttribute("data-" + key);
  }
}

/**
 * 获取属性值
 * @param key 属性名称
 */
export function getAttr(el: HTMLElement, key: string): string;
/**
 * 获取属性值，同时将值转换为默认值的类型，如果未赋值，则返回默认值；
 * @param key 属性名称
 * @param defaultValue 默认值
 */
export function getAttr(el: HTMLElement, filepath: string, defaultValue: string): string;
export function getAttr(el: HTMLElement, filepath: string, defaultValue: number): number;
export function getAttr(el: HTMLElement, filepath: string, defaultValue: boolean): boolean;
export function getAttr<T extends Record<string, string | number | boolean>>(
  el: HTMLElement,
  filepath: string,
  defaultValue: T,
): T;
export function getAttr(el: HTMLElement, key: string, defaultValue?: unknown) {
  const value = el.getAttribute(key);
  if (defaultValue == null) return value;
  const valueType = typeof defaultValue;
  if (value == null) return defaultValue;
  // 类型转换
  if (valueType === "bigint" || valueType === "number") {
    if (value === "") return defaultValue;
    return Number(value);
  }
  if (valueType === "boolean") {
    if (value === "" || value === "1" || value === "true" || value === key) {
      return true;
    }
    return false;
  }
  if (valueType === "object") {
    if (value === "") return defaultValue;
    return JSON.parse(value);
  }
  return value;
}

/**
 * 获取指定节点的父节点
 * @param el
 * @returns
 */
export function parent(el: HTMLElement) {
  return el.parentNode as HTMLElement;
}

/**
 * 获取隐藏节点的尺寸, 如果 parent 传空, 且 hideNode 为节点，则会通过修改原始样式方式计算
 * @param {string | HTMLElement} hideNode - The node to hide.
 * @param parent - 添加临时节点的父节点, 如果传递 null, 则通过修改原始样式方式计算，默认为: body.
 * @returns The DOMRect of the element.
 */
export function queryHideNodeSize(
  hideNode: string | HTMLElement,
  parent: null | HTMLElement = document.body,
): { width: number; height: number } {
  if (parent == null && typeof hideNode !== "string") {
    // 保存原来的样式
    const originalDisplay = hideNode.style.display;
    const originalVisibility = hideNode.style.visibility;
    const originalPosition = hideNode.style.position;

    // 设置为可见但不可见状态，不影响布局
    hideNode.style.position = "absolute";
    hideNode.style.visibility = "hidden";
    hideNode.style.display = "block";

    // 读取高度
    const rect = hideNode.getBoundingClientRect();

    // 恢复原样式
    hideNode.style.display = originalDisplay;
    hideNode.style.visibility = originalVisibility;
    hideNode.style.position = originalPosition;
    return { width: rect.width, height: rect.height };
  }
  // 计算折叠菜单的高度
  let $tmp = document.createElement("div");
  $tmp.style.cssText = "position:fixed;left:-1000px;top:-1000px;opacity:0;";
  let $tmpInner = document.createElement("div");
  $tmpInner.style.cssText = "position:relative;";
  if (typeof hideNode === "string") {
    $tmpInner.innerHTML = hideNode;
  } else {
    $tmpInner.appendChild(hideNode.cloneNode(true));
  }
  $tmp.appendChild($tmpInner);
  (parent || document.body).appendChild($tmp);
  let rect = $tmpInner.children[0].getBoundingClientRect();
  (parent || document.body).removeChild($tmp);
  return { width: rect.width, height: rect.height };
}

/**
 * 判断元素是否在父元素的可视区域内。
 *
 * @param el 要检查的元素
 * @param parent 元素的父元素，默认为document.body
 * @param direction 检查的方向，默认为"horizontal"
 * @returns 如果元素在父元素的可视区域内，则返回true；否则返回false。
 */
export function isVisible(
  el: HTMLElement,
  parent: HTMLElement | null | undefined = null,
  direction = "horizontal",
): boolean {
  if (parent == null) {
    parent = el.offsetParent as HTMLElement;
  }
  // 获取父元素的边界信息
  const containerRect = parent.getBoundingClientRect();
  // 获取元素的边界信息
  const elementRect = el.getBoundingClientRect();

  // 根据检查方向，确定元素的起始和结束位置
  // 元素的上、下边界
  let elStart = direction === "horizontal" ? elementRect.left : elementRect.top;
  let elEnd = direction === "horizontal" ? elementRect.right : elementRect.bottom;

  // 根据检查方向，确定父元素的起始和结束位置
  // 容器的可视区域的上、下边界
  let containerStart = direction === "horizontal" ? containerRect.left : containerRect.top;
  let containerEnd = direction === "horizontal" ? containerRect.right : containerRect.bottom;

  // 判断元素是否在父元素的可视区域内
  // 判断元素是否完全在容器的可视区域内
  return elStart >= containerStart && elEnd <= containerEnd;
}

/**
 * 判断当前设备是否为移动设备。
 *
 * 本函数通过检查用户代理字符串和屏幕尺寸来判断设备是否为移动设备。
 * 这对于需要根据设备类型进行不同布局或功能调整的应用非常有用。
 *
 * @returns {boolean} 如果设备是移动设备，则返回true；否则返回false。
 */
export function isMobile(): boolean {
  // 通过正则表达式匹配用户代理字符串，判断是否为移动设备
  // 检查是否为移动设备
  const isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  // 获取窗口的 innerWidth 和 innerHeight，用于判断屏幕尺寸
  // 获取屏幕宽度和高度
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 判断屏幕宽度或高度是否小于等于800或600，用于进一步确认是否为移动设备
  const isScreenMobile = screenWidth <= 800 || screenHeight <= 600;

  // 如果是移动设备或屏幕尺寸符合移动设备特征，则返回true
  return isMobile || isScreenMobile;
}

type ClsxValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClsxValue[]
  | Record<string, boolean | string | number | undefined | null>;

/**
 * 条件化类名拼接工具，支持任意嵌套的字符串、数组、对象参数。
 * - 字符串/数字：直接拼接
 * - 数组：递归处理每个元素
 * - 对象：值为真时拼接键名
 * - falsy 值（false、null、undefined、0、""）：跳过
 * @param args - 任意数量的类名参数
 * @returns 拼接后的类名字符串
 */
export function clsx(...args: ClsxValue[]): string {
  let classes = "";
  for (let i = 0, len = args.length; i < len; i++) {
    const arg = args[i];
    if (!arg) continue;
    if (typeof arg === "string" || typeof arg === "number") {
      classes += arg + " ";
    } else if (Array.isArray(arg)) {
      const inner = clsx(...arg);
      if (inner) classes += inner + " ";
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if (arg[key]) classes += key + " ";
      }
    }
  }
  return classes.trim();
}

/**
 * 格式化类名，支持数组和对象两种形式。
 * - 数组形式：数组中的每个元素代表一个类名，非空元素将被添加到结果字符串中。
 * - 对象形式：对象的键代表类名，值为真（非空、非undefined、非null）时，键将被添加到结果字符串中。
 * @param classObj - 类名对象或数组
 * @returns 格式化后的类名字符串
 */
export function formatClass(
  classObj:
    | (boolean | string | undefined | null)[]
    | Record<string, boolean | string | undefined | null>
    | string,
): string {
  return clsx(classObj);
}

type StyxBaseValue = string | boolean | undefined | null;

type StyxValue = StyxBaseValue | StyxBaseValue[] | Record<string, StyxBaseValue | number>;

/**
 * 条件化样式拼接工具，支持任意嵌套的字符串、数组、对象参数。
 * - 字符串：直接拼接（自动补 `;`）
 * - 数组：递归处理每个元素
 * - 对象：拼接为 `key:value;` 格式
 * - falsy 值（false、null、undefined、0、""）：跳过
 * @param args - 任意数量的样式参数
 * @returns 拼接后的样式字符串
 */
export function styx(...args: StyxValue[]): string {
  let styleStr = "";
  for (let i = 0, len = args.length; i < len; i++) {
    const arg = args[i];
    if (!arg) continue;
    if (typeof arg === "string") {
      styleStr += arg.endsWith(";") ? arg : arg + ";";
    } else if (Array.isArray(arg)) {
      const inner = styx(...arg);
      if (inner) styleStr += inner;
    } else if (typeof arg === "object") {
      for (const key in arg) {
        const value = arg[key];
        if (value || value === 0) {
          styleStr += `${key}:${value};`;
        }
      }
    }
  }
  return styleStr;
}

/**
 * 将样式对象格式化为 CSS 样式字符串。
 * @param styleObj - 样式对象，可以是字符串数组或键值对对象。
 * @returns 格式化后的 CSS 样式字符串。
 */
export function formatStyle(styleObj: FormatStyleParam): string {
  return styx(styleObj);
}

function toggleCssProperty(
  el: HTMLElement,
  properties: [string, string][],
  method: "set" | "remove" = "set",
) {
  for (let i = 0, len = properties.length; i < len; i++) {
    const rec = properties[i];
    if (method === "set") {
      el.style.setProperty(rec[0], rec[1]);
    } else {
      el.style.removeProperty(rec[0]);
    }
  }
}

/**
 * 执行元素的过渡动画。
 *
 * 如果是名称类似于 Vue.js 的过渡动画，通过添加 `*-active`、`*-from|to` class 类名。
 *
 * @param el - 需要执行过渡动画的 HTML 元素。
 * @param nameOrProperties - 过渡动画的名称或属性数组。可以是字符串表示的动画名称，或者是包含属性名称、初始值或目标值、持续时间。eg. [['opacity', '0.5']] | 'nt-opacity'
 * @param dir - 过渡动画的方向，"leave" 表示离开，"enter" 表示进入。默认值为 "enter"。
 * @param finish - 过渡动画结束时的回调函数。
 *
 * @example <caption>执行 `nt-opacity` 名称动画</caption>
 * // css
 * .nt-opacity-enter-active,
 * .nt-opacity-leave-active {
 *  transition: opacity 0.3s ease;
 * }
 * .nt-opacity-enter-from,
 * .nt-opacity-leave-to {
 *   opacity: 0;
 * }
 * // js
 * transition($el, "nt-opacity", "enter");
 *
 * @example <caption>执行 `style` 属性动画</caption>
 * transition($el, [["opacity", "0", "0.3s"]], "enter");
 *
 * @example <caption>动画结束后移除节点</caption>
 * transition($el, [["opacity", "0", "0.3s"]], "leave", () => {  $el.remove(); });
 */
export function transition(
  el: HTMLElement,
  nameOrProperties: string | [string, string, string][],
  dir: "leave" | "enter" = "enter",
  finish?: () => void,
): void {
  const p = dir === "enter" ? "from" : "to";
  let nameClass = "",
    activeClass = "";
  /** 动画状态, -1 - 准备, 0 - 进行中, 1 - 完成 */
  let status = -1;
  const trans: string[] = [];
  if (typeof nameOrProperties === "string") {
    nameClass = `${nameOrProperties}-${dir}-${p}`;
    activeClass = `${nameOrProperties}-${dir}-active`;
  } else {
    for (let i = 0, len = nameOrProperties.length; i < len; i++) {
      const rec = nameOrProperties[i];
      if (rec.length >= 3) {
        trans.push(`${rec[0]} ${rec[2]}`);
      }
    }
  }
  status = 0;
  if (dir === "enter") {
    if (nameClass) {
      el.classList.add(nameClass);
      setTimeout(() => {
        el.classList.add(activeClass);
        requestAnimationFrame(() => {
          el.classList.remove(nameClass);
        });
      }, 0);
    } else {
      toggleCssProperty(el, nameOrProperties as any, "set");
      setTimeout(() => {
        if (trans.length > 0) {
          el.style.setProperty("transition", trans.join(", "));
        }
        requestAnimationFrame(() => {
          toggleCssProperty(el, nameOrProperties as any, "remove");
        });
      }, 0);
    }
  } else {
    if (nameClass) {
      el.classList.add(activeClass);
      requestAnimationFrame(() => {
        el.classList.add(nameClass);
      });
    } else {
      if (trans.length > 0) {
        el.style.setProperty("transition", trans.join(", "));
      }
      requestAnimationFrame(() => {
        toggleCssProperty(el, nameOrProperties as any, "set");
      });
    }
  }
  el.addEventListener(
    "transitionend",
    () => {
      if (status === 0) {
        status = 1;
        if (nameClass) {
          el.classList.remove(activeClass);
          requestAnimationFrame(() => {
            el.classList.remove(nameClass);
          });
        } else {
          if (trans) {
            el.style.removeProperty("transition");
          }
          requestAnimationFrame(() => {
            toggleCssProperty(el, nameOrProperties as any, "remove");
          });
        }
        if (finish) {
          finish();
        }
      }
    },
    { once: true },
  );
}

/**
 * 计算光标位置
 *
 * 根据输入值的变化计算新的光标位置，主要用于输入框内容变化时的光标位置调整
 *
 * @param start - 光标起始位置，通常为: input.selectionStart
 * @param end - 光标结束位置（通常与起始位置相同，用于选择范围），通常为: input.selectionEnd
 * @param oldValue - 变化前的值
 * @param newValue - 变化后的值
 * @returns 新的光标位置对象，包含新的起始和结束位置
 *
 * @example
 * // 删除字符时，光标向前移动
 * calcuteCursorPosition(2, 2, "abc", "ac"); // 返回 { start: 1, end: 1 }
 *
 * @example
 * // 添加字符时，光标向后移动
 * calcuteCursorPosition(2, 2, "ac", "abc"); // 返回 { start: 3, end: 3 }
 *
 * @example
 * // 替换字符时，保持位置
 * calcuteCursorPosition(2, 2, "abc", "axc"); // 返回 { start: 2, end: 2 }
 */
export function calcuteCursorPosition(
  start: number,
  end: number,
  oldValue: string,
  newValue: string,
): { start: number; end: number } {
  // 5. 【关键】计算新光标位置并恢复
  let newStart = start;
  let newEnd = end;

  // 简单策略：如果新值比旧值短，说明删了字符，光标前移
  // 更健壮的做法：对比差异，但通常可简化处理
  if (newValue.length < oldValue.length) {
    // 例如：用户在中间删了一个非法字符
    newStart = Math.max(0, start - (oldValue.length - newValue.length));
    newEnd = newStart;
  } else if (newValue.length > oldValue.length) {
    // 插入合法字符，光标通常就在插入点后，可保持原偏移
    // 但需防止超出长度
    newStart = Math.min(newValue.length, start + (newValue.length - oldValue.length));
    newEnd = newStart;
  } else {
    // 长度不变（如替换），保持原位置（但要限制范围）
    newStart = Math.min(newValue.length, start);
    newEnd = newStart;
  }
  return { start: newStart, end: newEnd };
}
