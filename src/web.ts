/**
 * web(浏览器) 端工具类
 */

// 定义更精确的类型
type FormValue = string | number | boolean;

/**
 * 解析 Form 表单中的 input 元素的数据为 JSON 格式，key: input-name；value: input-value
 * @param form {object} Form 节点对象
 */
export const formJson = function <T extends Record<string, FormValue>>(form: HTMLFormElement): T {
  const value: Record<string, FormValue> = {};
  const elements = form.elements;

  for (let i = 0; i < elements.length; i++) {
    const item = elements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    if (!item.name) continue;

    // 处理不同元素类型
    if (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement) {
      const val = item.value.trim();
      if (!val) continue;

      const dataType = item.dataset.type;
      switch (dataType) {
        case "number":
          value[item.name] = Number(val);
          break;
        case "boolean":
          value[item.name] = val === "true" || val === "1";
          break;
        default:
          value[item.name] = val;
      }
    } else if (item instanceof HTMLSelectElement) {
      value[item.name] = item.options[item.selectedIndex]?.value ?? "";
    }
  }

  return value as T;
};

type QueryResult = string | string[];
/**
 * 获取 url query 参数 (get 请求的参数)
 * @param search 如果是 React 应用就需要传递 useLocation().search
 * @returns
 */
export function query(search?: string): Record<string, QueryResult> {
  const searchStr = search ?? location.search;
  const searchParams = new URLSearchParams(searchStr);
  const result: Record<string, QueryResult> = {};

  // 使用 Set 对 keys 进行去重
  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  return result;
}

/**
 * 函数节流 - 每隔单位时间，只执行一次
 * @param cb    待节流的函数
 * @param wait  间隔时间
 * @returns
 */
export function throttle<R extends unknown[], T>(
  fn: (...args: R) => T,
  wait = 500,
): {
  (...args: R): void;
  cancel: () => void;
} {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 使用 function 声明以保留调用时的 this 上下文
  const throttled = function (this: any, ...args: R) {
    const now = Date.now();
    const remaining = wait - (now - last);

    // 如果时间到了，或者系统时间被修改
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      // 保证最后一次触发能被执行（尾部调用）
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };

  throttled.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    last = 0;
  };

  return throttled;
}

/**
 * 函数防抖 - 当重复触发某一个行为（事件时），只执行最后一次触发
 * @param fn        防抖函数
 * @param interval  间隔时间段
 * @returns
 */
export function debounce<R extends unknown[], T>(
  fn: (...args: R) => T,
  interval = 500,
): {
  (...args: R): void;
  cancel: () => void;
} {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 使用 function 声明以保留调用时的 this 上下文
  const debounced = function (this: any, ...args: R) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, interval);
  };

  debounced.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
