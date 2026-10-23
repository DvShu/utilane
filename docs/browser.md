# Browser tools

English | [简体中文](zh-CN/browser.md)

Import from `utilane/browser`. See the [browser API](api/browser.md) for complete signatures. Call APIs that require DOM, navigator, or Storage only in the browser; SSR applications should use client lifecycle hooks.

## Web, DOM, and clipboard

```ts
import { query, debounce, clsx, copy } from "utilane/browser";
query("?tag=a&tag=b"); // { tag: ["a", "b"] }
clsx("button", { active: true, disabled: false }); // "button active"
const onSearch = debounce((value: string) => console.log(value), 300);
onSearch("hello");
onSearch.cancel();
// Call during a user action, such as a click:
// const success = await copy("hello");
```

| Group                       | APIs                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Queries and creation        | `elem`, `$`, `$$`, `$one`, `create`, `parent`                                                                      |
| Classes and styles          | `addClass`, `removeClass`, `hasClass`, `toggleClass`, `replaceClass`, `clsx`, `formatClass`, `styx`, `formatStyle` |
| Content, attributes, events | `html`, `text`, `attr`, `getAttr`, `iterate`, `on`, `off`, `shouldEventNext`                                       |
| Layout and interaction      | `queryHideNodeSize`, `isVisible`, `isMobile`, `transition`, `calcuteCursorPosition`                                |
| Web                         | `query`, `formJson`, `throttle`, `debounce`, `copy`                                                                |

`query` reads location.search when omitted and returns arrays for repeated keys. `formJson` parses form elements with data-type hints for number / boolean; it is not a complete HTML form submission serializer.

Debounce and throttle default to 500 milliseconds. The returned functions have a cancel method. Debounce invokes after the final call; throttle supports trailing calls. The wrapper does not return the callback's result.

`copy` returns Promise<boolean> and is subject to browser permissions and user-gesture requirements. `calcuteCursorPosition` retains its existing public spelling.

## Storage

```ts
import { set, get, remove } from "utilane/browser";
set("profile", { name: "Ada" }, { storage: "local", expire: 3600 });
const profile = get("profile", null, { storage: "local" });
remove("profile", "local");
```

The default is sessionStorage. `expire` is in seconds; -1 (the default) disables expiration at the utility layer but does not extend the browser storage lifetime. Values use JSON; circular data is unsupported.

`get` preserves stored 0, false, empty strings, and null. Missing or expired entries, and entries whose value is undefined, return the supplied default; without a default they return null. Falsy defaults are preserved too. Expired entries are removed. With `delete: true`, a valid entry is returned and then removed. Unexpected JSON formats or unavailable storage can throw. `clear` removes every item in the selected Storage, including items written by other code.

```ts
import { set, get } from "utilane/browser";
set("count", 0);
get("count", 99); // 0
set("enabled", false);
get("enabled", true); // false
set("label", "");
get("label", "fallback"); // ""
```

## Themes

APIs: getSystemTheme, initTheme, toggleTheme, getTheme, applyTheme, getColorTheme, initColorTheme, toggleColorTheme, applyColorTheme.

```ts
import { applyTheme } from "utilane/browser";
await applyTheme("dark", true, false); // Cache the preference; disable transitions
```

Theme functions may change root classes, styles, or localStorage. `initTheme` can insert a style element. These effects happen when called. View Transition is optional and has a fallback. See the API and [theme.ts](../src/theme.ts) for theme-color support and return types.
