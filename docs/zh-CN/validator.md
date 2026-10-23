# 数据验证

[English](../validator.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js。完整类型见[根入口 API](api/index.md)，实现见 [validator.ts](../../src/validator.ts)。

```ts
import { Validator } from "utilane";
import type { SchemaType } from "utilane";

const schemas: SchemaType[] = [
  { key: "mobile", rules: ["required", "mobile"] },
  { key: "confirmPassword", rules: ["required", "same:password"] },
];
const validator = new Validator(schemas);
try {
  validator.validate({
    mobile: "13812345678",
    password: "example",
    confirmPassword: "example",
  }); // true
} catch (error) {
  console.error(error); // 包含 key、message、detail
}
```

`validate(data, all = false)` 是同步方法，成功返回 true，失败抛错误；不是 Promise，也不是失败返回 false。all 为 true 时收集多个字段错误。

`validateKey(key, value, data?)` 成功返回 `{ key, value }`，失败抛错；跨字段规则需要传入 data。未配置的字段直接返回输入值。

`addSchema(s)` / `addSchemas` 添加规则；`setSchema` / `setSchemas` 替换；`removeSchema` 删除；`hasSchema` 查询。支持 required、mobile、same 规则及正则、自定义函数等形式，完整结构见 SchemaType、RuleType。

ValidateError 类未公开导出，调用方可根据捕获错误的 key、message 和 detail 处理。前端校验不能代替服务端校验。内置错误消息目前为中文，文档翻译不改变运行时消息。
