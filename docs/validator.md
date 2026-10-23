# Validation

English | [简体中文](zh-CN/validator.md)

Import from `utilane`. Environment: browser / Node.js. See the [root API](api/index.md) and [validator.ts](../src/validator.ts).

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
  console.error(error); // Contains key, message, and detail
}
```

`validate`(data, all = false) is synchronous: it returns true on success and throws on failure. It does not return a Promise or false on failure. Set all to true to collect errors from multiple fields.

`validateKey`(key, value, data?) returns { key, value } on success and throws on failure. Cross-field rules need data. Fields without rules return the input value directly.

`addSchema` / `addSchemas` add rules; setSchema / setSchemas replace them; removeSchema removes and hasSchema checks for them. Supported rules include required, mobile, same, regular expressions, and custom functions. See SchemaType and RuleType for their structure.

ValidateError is not a public export. Handle captured errors using their key, message, and detail fields. Frontend validation does not replace server validation. Built-in error messages are currently Chinese; translating the documentation does not change runtime messages.
