/**
 * 数据验证器
 */

// 默认的错误提示信息
const defaultMsgs: { [index: string]: string } = {
  mobile: "请输入正确的手机号",
  same: "两次输入不一致",
  required: "%s为必填字段",
  default: "请输入正确的数据",
};

// 一些常用的验证正则
const ruleRegexs: any = {
  /** 验证跟其余数据相等的正则，一般用于验证再次输入密码 */
  same: /^same:(.+)$/i,
  /** 验证手机号的正则表达式 */
  mobile: /^1[3456789]\d{9}$/,
  /** 非空验证的正则表达式 */
  required: /\S/,
};

// 规则比对函数
const ruleFns = {
  /** 验证相等 */
  same(val1: string, val2: string) {
    return val2 === val1;
  },
  /** 正则匹配 */
  pattern(regex: RegExp, val: string) {
    if (val == null) {
      return false;
    }
    return regex.test(String(val));
  },
};

interface RuleItem {
  rule: RegExp | ((v: any) => boolean) | "required";
  message: string;
  sameKey?: string;
}

class ValidateError extends Error {
  public name: string;
  public key: string;
  public detail: Record<string, string>;
  public constructor(detail: Record<string, string>, key: string, message: string) {
    super(message);
    this.name = "ValidateError";
    this.key = key;
    this.detail = detail;
  }
}

export type RuleType =
  | string
  | RegExp
  | ((v: any) => boolean)
  | (
      | RegExp
      | string
      | ((v: any) => boolean)
      | { rule: string | RegExp | ((v: any) => boolean); message?: string }
    );

export interface SchemaType {
  /** 数据字段 */
  key: string;
  /** 是否必须 */
  required?: boolean;
  /** 验证规则列表 */
  rules?: RuleType[];
  /** 错误信息 */
  message?: string;
}

/**
 * 数据验证器
 */
class Validator {
  public rules: Record<string, RuleItem[]>;
  /**
   * 构造数据验证转换器
   *
   * See {@link https://github.com/DvShu/utilane/blob/HEAD/docs/validator.md | Validator documentation}.
   *
   * @param schemas 配置验证转换规则
   *
   * @example
   *
   * const validator = new Validator([
   *  { key: 'mobile', rules: ['required', 'mobile'] },
   *  { key: 'code', rules: /^\d{6}$/, message: '请输入正确的验证码' },
   *  { key: 'confirmPassword', rules: ['required', 'same:password'] }
   * ])
   * // 验证某一个字段
   * validator.validateKey('mobile', '13812345678') // 同步返回，失败时抛错
   */
  public constructor(schemas: SchemaType[]) {
    this.setSchemas(schemas);
  }

  public addSchemas(schemas: SchemaType[]): void {
    for (let schema of schemas) {
      this.addSchema(schema);
    }
  }

  public addSchema(schema: SchemaType): void {
    if (schema.key in this.rules) {
      this.rules[schema.key] = [...this.rules[schema.key], ...this._parseSchemaRules(schema)];
    } else {
      this.rules[schema.key] = this._parseSchemaRules(schema);
    }
  }

  public setSchema(schema: SchemaType): void {
    this.rules[schema.key] = this._parseSchemaRules(schema);
  }

  public setSchemas(schemas: SchemaType[]): void {
    this.rules = {};
    for (let schema of schemas) {
      this.rules[schema.key] = this._parseSchemaRules(schema);
    }
  }

  public removeSchema(key: string): void {
    delete this.rules[key];
  }
  public hasSchema(key: string): boolean {
    return key in this.rules;
  }

  /**
   * 进行数据验证
   * @param data 待验证的数据
   * @param all 是否全部验证, false - 只要验证错误一个则停止验证
   * @returns
   */
  public validate(data: any, all = false): boolean {
    const detail: Record<string, string> = {};
    let currentKey: string | undefined = undefined;
    let currentMessage: string | undefined = undefined;
    for (let key in this.rules) {
      let errMsg = this._validateRule(this.rules[key], data[key], data);
      if (errMsg !== "") {
        errMsg = errMsg.replace("%s", key);
        detail[key] = errMsg;
        currentKey = key;
        currentMessage = errMsg;
        if (!all) break;
      }
    }
    if (currentKey == null) {
      return true;
    }
    throw new ValidateError(detail, currentKey, currentMessage as string);
  }

  /**
   * 只验证指定 key 的数据格式
   * @param key   指定待验证的 key
   * @param value 待验证的数据
   * @param data 原始数据，当验证确认密码时需要使用
   */
  public validateKey(key: string, value: any, data?: any): { key: string; value: any } {
    let keyRules = this.rules[key];
    if (keyRules == null) {
      return { key, value };
    }
    let errMsg = this._validateRule(keyRules, value, data);
    if (errMsg !== "") {
      errMsg = errMsg.replace("%s", key);
      throw new ValidateError({ [key]: errMsg }, key, errMsg);
    }
    return { key, value };
  }

  private _validateRule(rules: RuleItem[], value: string, data?: any) {
    let errMsg = "";
    for (let rule of rules) {
      if (!rule) continue;
      // 如果数据为空，则判断是否是必填
      if (rule.rule === "required") {
        if (value == null || !ruleFns.pattern(ruleRegexs.required, value)) {
          errMsg = rule.message;
        }
      } else if (typeof rule.rule === "function") {
        if (!rule.rule(value)) {
          errMsg = rule.message;
        }
      } else if (rule.sameKey != null) {
        if (data != null) {
          if (!ruleFns.same(value, data[rule.sameKey])) {
            errMsg = rule.message;
          }
        }
      } else {
        if (rule && !ruleFns.pattern(rule.rule, value)) {
          errMsg = rule.message;
        }
      }

      if (errMsg !== "") {
        break;
      }
    }
    return errMsg;
  }

  private _parseSchemaRules(schema: SchemaType): RuleItem[] {
    // 解析规则
    let rules: RuleItem[] = [];
    let rule = schema.rules;
    if (schema.required === true) {
      rules.push(...this._parseStringRule("required", schema.message));
    }
    if (rule != null) {
      if (typeof rule === "string") {
        rules.push(...this._parseStringRule(rule, schema.message));
      } else if (rule instanceof Array) {
        for (let ruleItem of rule) {
          if (typeof ruleItem === "string") {
            rules.push(...this._parseStringRule(ruleItem, schema.message));
          } else if (ruleItem instanceof RegExp || typeof ruleItem === "function") {
            rules.push({
              rule: ruleItem,
              message: schema.message || defaultMsgs["default"],
            });
          } else {
            const emessage = ruleItem.message || schema.message || defaultMsgs["default"];
            if (typeof ruleItem.rule === "string") {
              rules.push(...this._parseStringRule(ruleItem.rule, emessage));
            } else {
              rules.push({
                rule: ruleItem.rule,
                message: emessage,
              });
            }
          }
        }
      } else {
        rules.push({ rule, message: defaultMsgs["default"] });
      }
    }

    return rules;
  }

  private _parseStringRule(rule: string, ruleErrMsg?: string) {
    let rules: any[] = [];
    let trule = rule.split("|");
    for (let r of trule) {
      let message = ruleErrMsg;
      let rrule: RegExp | "required" | null = null;
      let sameKey: string | undefined;
      if (r === "required") {
        rrule = "required";
        message = message || ruleErrMsg || defaultMsgs.required;
      } else if (ruleRegexs.same.test(r)) {
        let m = r.match(ruleRegexs.same);
        if (m != null) {
          rrule = ruleRegexs.same;
          sameKey = m[1];
          message = message || defaultMsgs["same"];
        }
      } else if (Object.hasOwn(ruleRegexs, r)) {
        rrule = ruleRegexs[r];
        message = message || defaultMsgs[r];
      }
      if (rrule) {
        rules.push({ rule: rrule, message: message, sameKey });
      }
    }
    return rules;
  }
}

export default Validator;
