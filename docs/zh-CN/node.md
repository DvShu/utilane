# Node.js 工具

[English](../node.md) | 简体中文

入口：`utilane/node`。此入口依赖 node: 内置模块，不用于浏览器包。完整签名见 [Node.js API](api/node.md)；加密相关见[摘要与加密](crypto.md)。

## 文件

```ts
import { read, write, statTag } from "utilane/node";
await write("settings.json", { theme: "dark" });
const settings = await read("settings.json", {});
const tag = await statTag("settings.json");
```

`read(filepath, defaultValue?)` 返回 Promise。defaultValue 为非 null 对象时解析 JSON，否则返回 UTF-8 字符串。传默认值时读取或 JSON 解析失败都会返回该默认值；不传则抛错。泛型本身不会触发 JSON 解析。

`write` 默认对对象进行 JSON 序列化并缩进两个空格；opts 接受 json 和 format。不会自动创建父目录，写入失败会拒绝。

`statTag` 根据文件大小和 mtimeMs 生成标签，不是文件内容摘要。实现见 [file.ts](../../src/file.ts)。

## 子进程

```ts
import { exec, spawn } from "utilane/node";
const version = await exec("node", ["--version"]);
const result = await spawn("node", ["--version"]);
console.log(version.stdout, result.stdout);
```

两者返回 `Promise<{ stdout: string; stderr: string }>`。exec 基于 execFile，默认启用 shell；当前公开选项类型不接受 shell: false，需要直接运行可执行文件与独立参数时优先使用 spawn。不要把不可信字符串拼接到 shell 命令中。

spawn 支持 `{ shell: "powershell" }` 这一封装选项；启用时依赖 powershell.exe。命令失败、进程异常等应捕获 Promise 拒绝。实现见 [server.ts](../../src/server.ts)。
