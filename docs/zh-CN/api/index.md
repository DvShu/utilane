# utilane API 参考

[English](../../api/index.md) | 简体中文

<!-- 由贡献者与 AI 编码助手随源码变更维护。 -->

环境：浏览器与 Node.js 通用。返回[文档目录](../index.md)。

以下表格列出此入口可导入的名称；标为类型的名称请使用 `import type`。表外的辅助声明和父类不代表公共导出。默认值与运行时限制见分类指南及源码。

| 导出                  | 类别 | 说明                                                                           |
| --------------------- | ---- | ------------------------------------------------------------------------------ |
| `add`                 | 值   | 日期加上指定时间后的日期                                                       |
| `adjust`              | 值   | 调整给定颜色深[darken]浅[lighten]                                              |
| `aesDecrypt`          | 值   | AES 解密                                                                       |
| `aesEncrypt`          | 值   | AES 加密                                                                       |
| `Base32`              | 值   | RFC 4648 Base32：使用大写字符和 = 填充，严格校验解码输入                       |
| `Base62`              | 值   | 使用 0-9、A-Z、a-z 字符表的 Base62 整数进制编解码器                            |
| `bufferToHex`         | 值   | 将原始的二进制数据转换为 Hex String                                            |
| `dateOf`              | 值   | 设置日期的开始或者结束的点                                                     |
| `difference`          | 值   | 重载：所有参数为 Set 时，返回 Set                                              |
| `endOf`               | 值   | 设置日期的结束点                                                               |
| `format`              | 值   | 将日期格式化为指定形式的字符串                                                 |
| `formatData`          | 值   | 数据格式化主要用于数据类型转换                                                 |
| `formatMoney`         | 值   | 使用 zh-CN 的 Intl.NumberFormat 格式化金额，固定两位小数并遵循 Intl 舍入规则。 |
| `getJSONValue`        | 值   | 嵌套的 json 指定 key 数据                                                      |
| `hash`                | 值   | 哈希算法                                                                       |
| `hmacHash`            | 值   | 使用 HMAC 算法计算消息的哈希值                                                 |
| `intersection`        | 值   | 重载：所有参数为 Set 时，返回 Set                                              |
| `isBlank`             | 值   | 验证参数是否为空                                                               |
| `isBoolean`           | 值   | 验证参数是否是Boolean 类型                                                     |
| `isDisjointFrom`      | 值   | 判断两个集合是否没有公共元素（不相交）                                         |
| `isNumeric`           | 值   | 验证参数是否是数字                                                             |
| `isSubsetOf`          | 值   | 判断 a1 是否是 a2 的子集（a1 的所有元素是否都在 a2 中）                        |
| `isSupersetOf`        | 值   | 判断 a1 是否是 a2 的超集（a2 的所有元素是否都在 a1 中）                        |
| `order`               | 值   | 数组排序（不修改原数组，返回新数组）                                           |
| `parse`               | 值   | 将指定的参数解析为日期对象(Date)                                               |
| `random`              | 值   | 生成指定长度的随机数                                                           |
| `reverseStr`          | 值   | 反转字符串                                                                     |
| `rgbToHex`            | 值   | 将RGB颜色对象转换为十六进制颜色字符串。                                        |
| `round`               | 值   | 对数字进行四舍五入处理                                                         |
| `rsaDecrypt`          | 值   | RSA 解密                                                                       |
| `rsaEncrypt`          | 值   | RSA 加密                                                                       |
| `RuleType`            | 类型 | 见下方类型声明与分类指南                                                       |
| `SchemaType`          | 类型 | 见下方类型声明与分类指南                                                       |
| `sha`                 | 值   | SHA 哈希算法                                                                   |
| `shieldBankCard`      | 值   | 屏蔽银行卡号（带空格格式化）                                                   |
| `shieldEmail`         | 值   | 屏蔽邮箱                                                                       |
| `shieldIdCard`        | 值   | 屏蔽身份证号                                                                   |
| `shieldMobile`        | 值   | 屏蔽手机号，中间部分用 * 展示（保持向后兼容）                                  |
| `shieldName`          | 值   | 屏蔽姓名                                                                       |
| `shieldString`        | 值   | 通用字符串遮掩函数                                                             |
| `shieldWithLimit`     | 值   | 简化版：遮掩并限制长度                                                         |
| `ShortUUID`           | 值   | 将uuid转换为更简单的唯一标记id                                                 |
| `smartShield`         | 值   | 检测敏感信息并智能遮掩（支持长度控制）                                         |
| `smartSummary`        | 值   | 智能摘要：根据重要性自动调整保留位数                                           |
| `snakeCaseStyle`      | 值   | 将风格由大写风格转换为下划线风格: HelloWorld -> hello-world                    |
| `SnowflakeID`         | 值   | 雪花ID, 推荐在全局构造一个对象用于生成id                                       |
| `startOf`             | 值   | 设置日期的开始的点                                                             |
| `symmetricDifference` | 值   | 重载：所有参数为 Set 时，返回 Set                                              |
| `timestamp`           | 值   | 获取时间戳                                                                     |
| `toHex`               | 值   | 将颜色转换为 16 进制字符串                                                     |
| `toHsv`               | 值   | 将颜色转换为HSV颜色模型。                                                      |
| `toRgb`               | 值   | 将输入的颜色值转换为RGB对象格式。                                              |
| `union`               | 值   | 重载：所有参数为 Set 时，返回 Set                                              |
| `Validator`           | 值   | 数据验证器                                                                     |

## 完整类型声明

以下声明参考包含重载、返回值和辅助类型，需随源码变更维护。发布包中的 .d.ts 由 tsdown 生成。相对导入描述声明关系，不是额外公共包路径。

```typescript
declare function isBlank(str?: any, ignoreWhitespace?: boolean): boolean;
declare function shieldMobile(mobile: string, placeholder?: string): string;
interface ShieldOptions {
    str: string;
    startKeep?: number;
    endKeep?: number;
    placeholder?: string;
    addSpaces?: boolean;
    customShield?: (str: string) => string;
    maxLength?: number;
    showEllipsis?: boolean;
    ellipsis?: string;
}
declare function shieldString(options: ShieldOptions): string;
declare function shieldWithLimit(str: string, options: Omit<ShieldOptions, "str"> & {
    maxLength: number;
}): string;
declare function smartSummary(str: string, maxLength: number, placeholder?: string): string;
declare function shieldEmail(email: string, placeholder?: string): string;
declare function shieldIdCard(idCard: string, placeholder?: string): string;
declare function shieldBankCard(bankCard: string, placeholder?: string): string;
declare function shieldName(name: string, placeholder?: string): string;
declare function smartShield(str: string, placeholder?: string, maxLength?: number): string;
declare function isNumeric(str: string, numericParam?: {
    isPositive?: boolean;
    isFloat?: boolean;
}): boolean;
declare function isBoolean(str: string): boolean;
interface RandomStringOption {
    length: number;
    hasLetter?: boolean;
    firstIsZero?: boolean;
}
interface RangeRandomOption {
    min: number;
    max: number;
    hasEnd?: boolean;
    isInteger?: boolean;
}
declare function random(len: number): string;
declare function random(option: RangeRandomOption): number;
declare function random(option: RandomStringOption): string;
declare function formatMoney(number: number): string;
declare function snakeCaseStyle(name: string, connector?: string): string;
declare function round(num: number, precision?: number, roundType?: 0 | 1 | 2): number;
declare function reverseStr(str: string): string;
interface FormDataConfig<T> {
    numberFields?: (keyof T)[];
    stringFields?: (keyof T)[];
    formatter?: {
        [K in keyof T]?: "number" | "string" | ((value: any) => number | string);
    };
}
declare function getJSONValue(data: Record<string, any>, keystr: string): Record<string, any> | null;
declare function formatData<T extends Record<string, any>>(data: T, config?: FormDataConfig<T>): T;
declare function format(date?: Date | string | number | null, pattern?: string): string;
declare function parse(date?: Date | string | number | null): Date;
declare function dateOf(date?: Date | string | number | null, unit?: string, isEnd?: boolean): Date;
declare function startOf(date?: Date | string | number | null, unit?: string): Date;
declare function endOf(date?: Date | string | number | null, unit?: string): Date;
declare function timestamp(ctime?: Date | string | number, pre?: "s" | "ms"): number;
declare function add(date: Date | string | number | null, num: number, unit: string): Date;
declare function add(date: Date | string | number | null, num: number, unit: string, fmt: string): string;
type RGBColorObject = {
    r: number;
    g: number;
    b: number;
    a?: number;
};
type HSVColorObject = {
    h: number;
    s: number;
    v: number;
};
type ColorType = string | RGBColorObject | HSVColorObject;
declare function toRgb(color: ColorType): RGBColorObject;
declare function toHsv(color: ColorType): HSVColorObject;
declare function rgbToHex(rgb: RGBColorObject): string;
declare function toHex(color: ColorType): string;
declare function adjust(color: ColorType, level?: number, light?: boolean): string;
declare function order<T>(arr: T[], order?: "asc" | "desc", orderKey?: keyof T | null): T[];
declare function intersection<T>(...arrs: Set<T>[]): Set<T>;
declare function intersection<T>(...arrs: T[][]): T[];
declare function difference<T>(...arrs: Set<T>[]): Set<T>;
declare function difference<T>(...arrs: T[][]): T[];
declare function union<T>(...arrs: Set<T>[]): Set<T>;
declare function union<T>(...arrs: T[][]): T[];
declare function symmetricDifference<T>(...arrs: Set<T>[]): Set<T>;
declare function symmetricDifference<T>(...arrs: T[][]): T[];
declare function isSubsetOf<T>(a1: T[] | Set<T>, a2: T[] | Set<T>): boolean;
declare function isSupersetOf<T>(a1: T[] | Set<T>, a2: T[] | Set<T>): boolean;
declare function isDisjointFrom<T>(a1: T[] | Set<T>, a2: T[] | Set<T>): boolean;
type SnowflakeIDInfo = {
    value: string;
    timeOffset: bigint;
    timestamp: number;
    machineId: bigint;
    sequence: bigint;
    epoch: number;
    version: string | undefined;
};
declare class SnowflakeID {
    private static readonly SEQUENCE_MASK;
    private static readonly TIMESTAMP_MASK;
    private static readonly MACHINE_MASK;
    private static readonly SHIFT_TIMESTAMP;
    private static readonly SHIFT_MACHINE;
    private static readonly MAX_MACHINE_ID;
    private static readonly DEFAULT_MAX_CLOCK_TOLERANCE;
    private static readonly MAX_ID;
    private static readonly STATES;
    readonly machineId: bigint;
    readonly epoch: bigint;
    private _version;
    readonly maxClockTolerance: number;
    private readonly _state;
    constructor(machineId?: number, epoch?: number, maxClockTolerance?: number);
    get version(): number;
    set version(version: number);
    generate(): string;
    parse(snowflakeID: string, epoch?: number, includeVersion?: boolean): SnowflakeIDInfo;
}
declare class ShortUUID {
    private alphabet;
    constructor(alphabet?: string);
    encode(uuid: string, alphabet?: string): string;
    decode(shortUUID: string, alphabet?: string): {
        uuidInt: bigint;
        uuid: string;
    };
    private _stringToInt;
    private _intToString;
    private _uuidHexToInt;
    private _uuidIntToHex;
}
declare function bufferToHex(bf: ArrayBuffer | Uint8Array, upper?: boolean): string;
declare function sha(message: string | ArrayBuffer, upper?: boolean, algorithm?: string): Promise<string>;
declare function hash(message: string | ArrayBuffer, upper?: boolean, algorithm?: string): Promise<string>;
type HMACAlgorithm = "SHA-256" | "SHA-512";
declare function hmacHash(message: string, secret: string, algorithm?: HMACAlgorithm, upper?: boolean): Promise<string>;
type AlgorithmResType = "hex" | "hexUpper" | "base64" | "raw";
declare function aesEncrypt(message: string, key: string, encode?: AlgorithmResType, iv?: null | Uint8Array | string): Promise<{
    ciphertext: string | ArrayBuffer;
    iv: string;
    key: string;
}>;
declare function aesDecrypt(message: Uint8Array | string, key: string, iv: string, encode?: AlgorithmResType): Promise<string>;
declare function rsaEncrypt(message: string, publicKey: string, encode?: AlgorithmResType): Promise<string | ArrayBuffer>;
declare function rsaDecrypt(privateKey: string, message: Uint8Array | string, encode?: AlgorithmResType): Promise<string>;
declare class BaseCodec {
    protected readonly alphabet: string;
    protected readonly base: bigint;
    protected readonly name: string;
    constructor(name: string, alphabet: string);
    protected intToBytes(value: bigint): Uint8Array;
    protected bytesToInt(bytes: Uint8Array): bigint;
    protected concatBytes(...arrays: Uint8Array[]): Uint8Array;
    protected bytesToUtf8(bytes: Uint8Array): string;
    protected utf8ToBytes(str: string): Uint8Array;
    protected bytesToHex(bytes: Uint8Array): string;
    protected encodeFromBytes(input: Uint8Array): string;
    protected decodeToBytes(input: string): Uint8Array;
    encodeFromInt(value: bigint): string;
    encodeFromStr(value: string): string;
    encode(value: bigint | string): string;
    decodeToInt(value: string): bigint;
    decodeToStr(value: string): string;
    decode(value: string): string;
    bufferToHex(value: Uint8Array): string;
}
declare class Base32 extends BaseCodec {
    constructor();
    protected override encodeFromBytes(input: Uint8Array): string;
    protected override decodeToBytes(input: string): Uint8Array;
}
declare class Base62 extends BaseCodec {
    constructor();
}
interface RuleItem {
    rule: RegExp | ((v: any) => boolean) | "required";
    message: string;
    sameKey?: string;
}
type RuleType = string | RegExp | ((v: any) => boolean) | (RegExp | string | ((v: any) => boolean) | {
    rule: string | RegExp | ((v: any) => boolean);
    message?: string;
});
interface SchemaType {
    key: string;
    required?: boolean;
    rules?: RuleType[];
    message?: string;
}
declare class Validator {
    rules: Record<string, RuleItem[]>;
    constructor(schemas: SchemaType[]);
    addSchemas(schemas: SchemaType[]): void;
    addSchema(schema: SchemaType): void;
    setSchema(schema: SchemaType): void;
    setSchemas(schemas: SchemaType[]): void;
    removeSchema(key: string): void;
    hasSchema(key: string): boolean;
    validate(data: any, all?: boolean): boolean;
    validateKey(key: string, value: any, data?: any): {
        key: string;
        value: any;
    };
    private _validateRule;
    private _parseSchemaRules;
    private _parseStringRule;
}
export { Base32, Base62, type RuleType, type SchemaType, ShortUUID, SnowflakeID, Validator, add, adjust, aesDecrypt, aesEncrypt, bufferToHex, dateOf, difference, endOf, format, formatData, formatMoney, getJSONValue, hash, hmacHash, intersection, isBlank, isBoolean, isDisjointFrom, isNumeric, isSubsetOf, isSupersetOf, order, parse, random, reverseStr, rgbToHex, round, rsaDecrypt, rsaEncrypt, sha, shieldBankCard, shieldEmail, shieldIdCard, shieldMobile, shieldName, shieldString, shieldWithLimit, smartShield, smartSummary, snakeCaseStyle, startOf, symmetricDifference, timestamp, toHex, toHsv, toRgb, union };
```
