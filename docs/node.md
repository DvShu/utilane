# Node.js tools

English | [简体中文](zh-CN/node.md)

Import from `utilane/node`. This entry depends on Node built-ins and is not for browser bundles. See the [Node API](api/node.md) and [crypto guide](crypto.md).

## Files

```ts
import { read, write, statTag } from "utilane/node";
await write("settings.json", { theme: "dark" });
const settings = await read("settings.json", {});
const tag = await statTag("settings.json");
```

`read`(filepath, defaultValue?) returns a Promise. A non-null object default enables JSON parsing; otherwise the result is a UTF-8 string. With a default, read or JSON parse failures return that default. Without one, errors are thrown. A generic type argument alone does not enable JSON parsing.

`write` serializes objects as JSON with two-space indentation by default. Options include json and format. It does not create parent directories; failures reject.

`statTag` derives a tag from file size and mtimeMs, not file contents. Implementation: [file.ts](../src/file.ts).

## Child processes

```ts
import { exec, spawn } from "utilane/node";
const version = await exec("node", ["--version"]);
const result = await spawn("node", ["--version"]);
console.log(version.stdout, result.stdout);
```

Both return Promise<{ stdout: string; stderr: string }>. `exec` wraps execFile and enables shell by default. Its current public option type does not accept shell: false. Prefer `spawn` for running an executable with separate arguments. Do not concatenate untrusted strings into shell commands.

`spawn` supports the wrapper option { shell: "powershell" }, which requires powershell.exe. Handle rejected Promises for command failures and process errors. Implementation: [server.ts](../src/server.ts).
