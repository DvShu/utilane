# utilane API reference

English | [简体中文](../zh-CN/api/index.md)

<!-- Maintained with source changes by contributors and AI coding agents. -->

Environment: Browsers and Node.js. Back to the [documentation index](../index.md).

The table lists names you can import from this entry. Use `import type` for types. Supporting declarations and parent classes are not necessarily public exports. See the guides and source for defaults and runtime limitations.

| Export                | Kind  | Description                                                      |
| --------------------- | ----- | ---------------------------------------------------------------- |
| `add`                 | Value | Add a calendar amount; optionally format the result.             |
| `adjust`              | Value | Lighten or darken a color.                                       |
| `aesDecrypt`          | Value | Decrypt AES data; see entry-specific key and argument formats.   |
| `aesEncrypt`          | Value | Encrypt AES data; see entry-specific key and argument formats.   |
| `Base32`              | Value | RFC 4648 Base32 with strict uppercase and padding validation.    |
| `Base62`              | Value | Base62 conversion using the 0-9, A-Z, a-z alphabet.              |
| `bufferToHex`         | Value | Convert binary data to a hexadecimal string.                     |
| `dateOf`              | Value | Set a date boundary.                                             |
| `difference`          | Value | Compute a difference for arrays or Sets.                         |
| `endOf`               | Value | Get the final millisecond of a calendar unit in local time.      |
| `format`              | Value | Format a date using case-sensitive tokens.                       |
| `formatData`          | Value | Convert object field values according to a configuration.        |
| `formatMoney`         | Value | Format a number with the zh-CN locale and two fractional digits. |
| `getJSONValue`        | Value | Read a nested JSON property.                                     |
| `hash`                | Value | Compute a digest asynchronously with Web Crypto.                 |
| `hmacHash`            | Value | Compute a keyed digest asynchronously with Web Crypto.           |
| `intersection`        | Value | Compute an intersection for arrays or Sets.                      |
| `isBlank`             | Value | Check for an absent or blank value.                              |
| `isBoolean`           | Value | Check for a boolean string.                                      |
| `isDisjointFrom`      | Value | Check that inputs have no common elements.                       |
| `isNumeric`           | Value | Check for a numeric string.                                      |
| `isSubsetOf`          | Value | Check whether the first input is a subset.                       |
| `isSupersetOf`        | Value | Check whether the first input is a superset.                     |
| `order`               | Value | Return a sorted copy of an array.                                |
| `parse`               | Value | Parse a date, timestamp, or string.                              |
| `random`              | Value | Generate a random string or number using Math.random.            |
| `reverseStr`          | Value | Reverse a string.                                                |
| `rgbToHex`            | Value | Convert an RGB object to uppercase hex.                          |
| `round`               | Value | Round a number to a precision.                                   |
| `rsaDecrypt`          | Value | Decrypt RSA data; see entry-specific formats.                    |
| `rsaEncrypt`          | Value | Encrypt RSA data; see entry-specific formats.                    |
| `RuleType`            | Type  | Supported validation rule types.                                 |
| `SchemaType`          | Type  | Validation schema configuration.                                 |
| `sha`                 | Value | Compute a SHA digest asynchronously with Web Crypto.             |
| `shieldBankCard`      | Value | Mask a bank card number.                                         |
| `shieldEmail`         | Value | Mask an email address.                                           |
| `shieldIdCard`        | Value | Mask an identity card number.                                    |
| `shieldMobile`        | Value | Mask a mobile number.                                            |
| `shieldName`          | Value | Mask a name.                                                     |
| `shieldString`        | Value | Mask a string with configurable rules.                           |
| `shieldWithLimit`     | Value | Mask a string with an output length limit.                       |
| `ShortUUID`           | Value | Convert UUIDs to and from a shorter representation.              |
| `smartShield`         | Value | Mask recognized sensitive information.                           |
| `smartSummary`        | Value | Summarize a string with configurable masking.                    |
| `snakeCaseStyle`      | Value | Convert a name to a separator-based style.                       |
| `SnowflakeID`         | Value | Generate and parse Snowflake-style IDs.                          |
| `startOf`             | Value | Get a starting date boundary.                                    |
| `symmetricDifference` | Value | Compute a symmetric difference.                                  |
| `timestamp`           | Value | Get a timestamp in seconds or milliseconds.                      |
| `toHex`               | Value | Convert a color to hex; valid hex strings are preserved.         |
| `toHsv`               | Value | Convert a color to HSV.                                          |
| `toRgb`               | Value | Convert a color to RGB.                                          |
| `union`               | Value | Concatenate arrays or compute a deduplicated Set union.          |
| `Validator`           | Value | Validate fields synchronously; failures throw.                   |

## Complete type declarations

The declaration reference below includes overloads, return types, and supporting types. Maintain it alongside source changes. tsdown generates the distributed .d.ts files. Relative imports describe declaration relationships, not additional public package paths.

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
