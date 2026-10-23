import { adjust } from "./color.js";

/** 获取当前系统的主题 */
export function getSystemTheme(): "light" | "dark" | "auto" {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "auto";
}

/**
 * 初始化主题, 让网页能够适应系统主题, 同时根据缓存的主题切换主题
 * @returns 当前应用的主题
 */
export async function initTheme(): Promise<"light" | "dark" | "auto"> {
  // 让网页能够适应系统主题
  let $themeStyle = document.getElementById("theme-style") as HTMLStyleElement | null;
  if ($themeStyle == null) {
    $themeStyle = document.createElement("style");
    $themeStyle.id = "theme-style";
    $themeStyle.innerHTML =
      ":root{color-scheme:light dark;}html.light{color-scheme: light;}html.dark {color-scheme: dark;}";
    document.head.appendChild($themeStyle);
  }
  // 获取已经应用的主题设置
  const cacheTheme = localStorage.getItem("web-theme-appearance");
  return toggleTheme(cacheTheme as unknown as "light");
}

/**
 * 切换主题, 通常用于预览
 * @param theme 切换的主题
 * @param transition 是否使用过渡动画, 注意浏览器必须支持 document.startViewTransition, 默认: true
 * @returns 切换后的主题
 */
export async function toggleTheme(
  theme?: "light" | "dark" | "auto",
  transition = true,
): Promise<"light" | "dark" | "auto"> {
  return new Promise((resolve) => {
    const classList = document.documentElement.classList;
    if (theme == null) {
      theme = getSystemTheme();
    }

    function updateThemeClass() {
      if (theme === "light") {
        classList.add("light");
        classList.remove("dark");
      } else if (theme === "dark") {
        classList.add("dark");
        classList.remove("light");
      } else {
        classList.remove("light", "dark");
      }
    }
    // @ts-ignore
    if (transition && document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => {
        updateThemeClass();
        resolve(theme as any);
      });
    } else {
      updateThemeClass();
      resolve(theme);
    }
  });
}

/** 获取当前主题 */
export function getTheme() {
  // 1. 从根节点获取
  let theme: any = document.documentElement.className.match(/light|dark/);
  if (theme != null) {
    theme = theme[0];
  }
  if (theme == null) {
    theme = localStorage.getItem("web-theme-appearance");
  }
  if (theme == null) {
    theme = getSystemTheme();
  }
  return theme as string;
}

/**
 * 应用主题
 * @param theme 待应用的主题
 * @param cache 是否缓存应用的主题, 让应用下一次启动的时候, 可以应用主题, 默认: true
 * @param transition 是否使用过渡动画, 注意浏览器必须支持 document.startViewTransition, 默认: true
 * @returns 应用的主题
 */
export async function applyTheme(
  theme?: "light" | "dark" | "auto",
  cache = true,
  transition = true,
): Promise<"light" | "dark" | "auto"> {
  if (cache === true) {
    localStorage.setItem("web-theme-appearance", theme == null ? "auto" : theme);
  }
  return toggleTheme(theme, transition);
}

/** 获取当前主题色 */
export function getColorTheme(defaultValue?: string): string | undefined {
  const root = document.documentElement;
  const match = root.className.match(/color-([0-9a-fA-F]{6})/);
  if (match == null) {
    // 获取 --nt-primary-color 的值
    let color = getComputedStyle(root).getPropertyValue("--l-primary-color");
    if (color === "") {
      color = localStorage.getItem("web-theme-color") as string;
    }
    return color ? color : defaultValue;
  }
  return `#${match[1]}`;
}

/**
 * 初始化主题色, 让网页能够适应系统主题色, 同时根据缓存的主题色切换主题色
 * @returns 当前应用的主题色
 */
export function initColorTheme(): Promise<string> | null {
  // 获取缓存主题色
  const color = localStorage.getItem("web-theme-color");
  if (color != null) {
    return toggleColorTheme(color);
  }
  return color;
}

/**
 * 切换主题色, 通常用于预览
 * @param color 待切换的主题色
 * @returns 切换后的主题色
 */
export async function toggleColorTheme(color: string): Promise<string> {
  const vars = [
    `--l-primary-color: ${color};`,
    `--l-primary-color-dark1: ${adjust(color, 1, false)};`,
  ];
  for (let i = 1; i <= 5; i++) {
    vars.push(`--l-primary-color-light${i}: ${adjust(color, i)};`);
  }
  let $style = document.getElementById("color-theme-style");
  if ($style == null) {
    $style = document.createElement("style");
    $style.id = "color-theme-style";
    document.head.appendChild($style);
  }
  $style.innerHTML = `:root{${vars.join("")}}`;
  return color;
}

/**
 * 应用主题色
 * @param color 主题色
 * @param cache 是否缓存主题色, 让应用下一次启动的时候, 可以应用主题色, 默认: true
 * @returns 切换后的主题色
 */
export function applyColorTheme(color: string, cache = true): Promise<string> {
  if (cache === true) {
    localStorage.setItem("web-theme-color", color);
  }
  return toggleColorTheme(color);
}
