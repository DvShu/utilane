/**
 * 创建一个临时节点缓存待复制数据
 * @param {String} value
 * @return {HTMLElement}
 */
function createFakeElement(value: string): HTMLTextAreaElement {
  const fakeElement = document.createElement("textarea");
  // 使用 fixed 定位，避免影响页面滚动，也避免可见闪烁
  fakeElement.style.position = "fixed";
  fakeElement.style.left = "-9999px";
  fakeElement.style.top = "0";
  fakeElement.style.opacity = "0";
  fakeElement.style.pointerEvents = "none";

  // 清除默认样式，避免影响页面
  fakeElement.style.border = "0";
  fakeElement.style.padding = "0";
  fakeElement.style.margin = "0";

  // 只读，避免移动端聚焦时弹出键盘
  fakeElement.readOnly = true;

  // 对辅助技术隐藏该临时节点
  fakeElement.setAttribute("aria-hidden", "true");

  fakeElement.value = value;

  return fakeElement;
}

/** 通过执行 execCommand 来执行复制 */
function copyFromCommand(text: string) {
  // 添加节点
  const fakeEl = createFakeElement(text);
  document.body.append(fakeEl);
  fakeEl.focus();
  fakeEl.select();
  // 兼容部分移动端浏览器
  fakeEl.setSelectionRange(0, fakeEl.value.length);
  // 执行复制
  const res = document.execCommand("copy");
  fakeEl.remove(); // 删除节点
  return Promise.resolve(res);
}

/** 使用 navigator.clipboard 复制 */
async function copyFromClipboard(text: string) {
  const theClipboard = navigator.clipboard;
  if (theClipboard != null) {
    try {
      theClipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/** 解析待复制的文本 */
function parseCopyText(source: string | HTMLElement) {
  let copyText = null; // 待复制文本
  let sourceEl = null;
  // 获取待复制数据
  if (typeof source === "string") {
    // 从节点拿数据
    if (source.startsWith("#") || source.startsWith(".")) {
      sourceEl = document.querySelector(source);
      if (sourceEl == null) {
        copyText = source;
      }
    } else {
      copyText = source;
    }
  }
  if (source instanceof HTMLElement) {
    sourceEl = source;
  }
  // 从节点获取待复制数据
  if (sourceEl != null) {
    if (sourceEl.hasAttribute("data-copy-text")) {
      copyText = sourceEl.getAttribute("data-copy-text");
    } else {
      const tagName = sourceEl.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        copyText = (sourceEl as HTMLInputElement).value;
      } else {
        copyText = sourceEl.textContent;
      }
    }
  }
  return copyText;
}

/**
 * 复制数据, 可以从多种类型的数据
 *    1. 直接复制文本: await copy("待复制的文本")
 *    2. 复制节点上的 data-copy-text:
 *      <button data-copy-text="这是待复制的文本">复制</button>
 *      await copy(e.target) // or await copy("#a") or await copy(document.querySelector('#a'))
 *    3. 直接复制节点本身数据: await copy('#a')
 * @param {string | HTMLElement} source 复制源, 从中解析待复制的数据
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copy(source: string | HTMLElement): Promise<boolean> {
  // 待复制文本
  const copyText = parseCopyText(source);
  if (copyText == null) {
    return false;
  }
  const v = await copyFromClipboard(copyText);
  if (!v) {
    return copyFromCommand(copyText);
  }
  return true;
}
