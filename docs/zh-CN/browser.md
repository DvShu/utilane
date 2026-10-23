# 浏览器工具

[English](../browser.md) | 简体中文

入口：`utilane/browser`。完整签名见[浏览器 API](api/browser.md)。涉及 DOM、navigator、Storage 的函数应在浏览器中调用；SSR 应放在客户端生命周期内。

## Web、DOM 与剪贴板

```ts
import { query, debounce, clsx, copy } from "utilane/browser";
query("?tag=a&tag=b"); // { tag: ["a", "b"] }
clsx("button", { active: true, disabled: false }); // "button active"
const onSearch = debounce((value: string) => console.log(value), 300);
onSearch("hello");
onSearch.cancel();
// 在用户点击等事件内调用：
// const success = await copy("hello");
```

| 分组             | API                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| 查询与创建       | `elem`、`$`、`$$`、`$one`、`create`、`parent`                                                                      |
| 类名、样式       | `addClass`、`removeClass`、`hasClass`、`toggleClass`、`replaceClass`、`clsx`、`formatClass`、`styx`、`formatStyle` |
| 内容、属性、事件 | `html`、`text`、`attr`、`getAttr`、`iterate`、`on`、`off`、`shouldEventNext`                                       |
| 尺寸与交互       | `queryHideNodeSize`、`isVisible`、`isMobile`、`transition`、`calcuteCursorPosition`                                |
| Web              | `query`、`formJson`、`throttle`、`debounce`、`copy`                                                                |

`query` 未传参时读取 location.search，重复参数返回数组。`formJson` 解析表单元素，可通过 data-type 声明 number / boolean，不等于完整的 HTML 表单提交序列化。

防抖和节流默认间隔 500 毫秒，返回的函数包含 cancel 方法。防抖在最后一次调用后执行；节流支持尾部调用。回调返回值不会作为包装函数的返回值。

`copy` 返回 Promise<boolean>，受浏览器权限和用户手势影响。`calcuteCursorPosition` 是当前公共名称，保留其现有拼写。

## Storage

```ts
import { set, get, remove } from "utilane/browser";
set("profile", { name: "Ada" }, { storage: "local", expire: 3600 });
const profile = get("profile", null, { storage: "local" });
remove("profile", "local");
```

默认使用 sessionStorage；expire 单位为秒，默认 -1 表示不设置工具层过期时间（仍受浏览器存储生命周期限制）。通过 JSON 保存数据，不能保存循环引用。

`get` 原样保留保存的 0、false、空字符串和 null。数据不存在、过期或保存值为 undefined 时返回传入的默认值；未提供默认值时返回 null。默认值本身为假值时也会保留。过期条目会被删除；delete 为 true 时返回有效值后删除条目。读取到非本工具格式的 JSON 或存储不可用时可能抛错。`clear` 会清空所选 Storage 的所有条目，不限于本工具写入的数据。

```ts
import { set, get } from "utilane/browser";
set("count", 0);
get("count", 99); // 0
set("enabled", false);
get("enabled", true); // false
set("label", "");
get("label", "fallback"); // ""
```

## 主题

提供 `getSystemTheme`、`initTheme`、`toggleTheme`、`getTheme`、`applyTheme`、`getColorTheme`、`initColorTheme`、`toggleColorTheme`、`applyColorTheme`。

```ts
import { applyTheme } from "utilane/browser";
await applyTheme("dark", true, false); // 缓存设置，不使用过渡动画
```

主题操作会修改根节点类名、样式或 localStorage；initTheme 可插入样式节点。只有调用时才执行这些操作。View Transition 可用时可启用过渡，不可用时回退。主题色的支持范围和返回值见 API 与 [theme.ts](../../src/theme.ts)。
