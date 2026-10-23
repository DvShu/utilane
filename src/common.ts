/**
 * node 和 web 通用的基础工具函数
 */
/** 包含字母+数字的随机数字符 */
const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** 只包含数字的随机数字符 */
const NUMBER_RANDOM_CHARS = "0123456789";

/**
 * 验证参数是否为空
 * @param str               待验证的参数
 * @param ignoreWhitespace  如果是字符串是否忽略空格(包括空白字符串以及[\r\t\n]之类的制表符)，默认为true
 */
export function isBlank(str?: any, ignoreWhitespace = true): boolean {
  if (str == null) return true;
  if (typeof str !== "string") return str.length === 0;
  return ignoreWhitespace ? str.trim().length === 0 : str.length === 0;
}

/**
 * 屏蔽手机号，中间部分用 * 展示（保持向后兼容）
 * @param mobile 待屏蔽的手机号
 * @param placeholder 遮掩字符，默认: '*'
 * @returns 屏蔽后的手机号，例如：138****5678
 */
export function shieldMobile(mobile: string, placeholder = "*"): string {
  return shieldString({
    str: mobile,
    startKeep: 3,
    endKeep: 4,
    placeholder,
    addSpaces: false,
  });
}

/**
 * 通用的字符串遮掩配置
 */
interface ShieldOptions {
  /** 需要遮掩的字符串 */
  str: string;
  /** 开始保留的字符数（从开头计数），默认: 3 */
  startKeep?: number;
  /** 结束保留的字符数（从结尾计数），默认: 4 */
  endKeep?: number;
  /** 遮掩字符，默认: '*' */
  placeholder?: string;
  /** 是否在遮掩部分前后添加空格，默认: false */
  addSpaces?: boolean;
  /** 自定义遮掩逻辑函数，如果提供则忽略其他配置 */
  customShield?: (str: string) => string;
  /** 最大输出长度，超过则截断，默认: 不限制 */
  maxLength?: number;
  /** 截断时是否显示省略号，默认: true */
  showEllipsis?: boolean;
  /** 省略号字符，默认: '...' */
  ellipsis?: string;
}

/**
 * 通用字符串遮掩函数
 * @param options 配置参数
 * @returns 遮掩后的字符串
 *
 * @example
 * // 基本遮掩: 13812345678 -> 138****5678
 * shieldString({ str: '13812345678' })
 *
 * @example
 * // 限制长度: 64位字符串 -> 只显示前20位
 * shieldString({
 *   str: '1234567890123456789012345678901234567890123456789012345678901234',
 *   startKeep: 8,
 *   endKeep: 8,
 *   maxLength: 20
 * })
 * // 结果: 12345678****87654321
 *
 * @example
 * // 带省略号截断
 * shieldString({
 *   str: '1234567890123456789012345678901234567890123456789012345678901234',
 *   startKeep: 8,
 *   endKeep: 8,
 *   maxLength: 15,
 *   showEllipsis: true
 * })
 * // 结果: 12345678...8765
 */
export function shieldString(options: ShieldOptions): string {
  const {
    str,
    startKeep = 3,
    endKeep = 4,
    placeholder = "*",
    addSpaces = false,
    customShield,
    maxLength,
    showEllipsis = true,
    ellipsis = "...",
  } = options;

  // 如果提供了自定义遮掩函数，直接使用
  let result: string;
  if (customShield) {
    result = customShield(str);
  } else {
    // 参数校验：如果字符串长度小于 startKeep + endKeep，则全部遮掩
    if (str.length <= startKeep + endKeep) {
      result = placeholder.repeat(str.length);
    } else {
      // 计算需要遮掩的字符数
      const shieldCount = str.length - startKeep - endKeep;
      const shieldStr = placeholder.repeat(shieldCount);

      // 构建遮掩后的字符串
      const startPart = str.slice(0, startKeep);
      const endPart = str.slice(-endKeep);

      result = addSpaces
        ? `${startPart} ${shieldStr} ${endPart}`.trim()
        : startPart + shieldStr + endPart;
    }
  }

  // 如果设置了最大长度且结果超过该长度，进行截断
  if (maxLength != null && result.length > maxLength) {
    // 如果配置了不显示省略号，直接截断
    if (!showEllipsis) {
      return result.slice(0, maxLength);
    }

    // 计算省略号长度
    const ellipsisLen = ellipsis.length;

    // 如果最大长度小于省略号长度，只返回省略号
    if (maxLength <= ellipsisLen) {
      return ellipsis.slice(0, maxLength);
    }

    // 预留省略号位置，截取前半部分
    const keepLen = maxLength - ellipsisLen;

    // 优先保留开头部分，如果开头部分被截断太多，保留结尾部分
    const startKeepLen = Math.min(Math.floor(keepLen * 0.7), keepLen);
    const endKeepLen = keepLen - startKeepLen;

    // 如果开头保留长度小于原始 startKeep，尝试从结尾多保留
    if (startKeepLen < 3 && endKeepLen > 0) {
      const startPart = result.slice(0, Math.min(startKeepLen, result.length));
      const endPart = result.slice(-endKeepLen);
      return startPart + ellipsis + endPart;
    }

    const startPart = result.slice(0, startKeepLen);
    const endPart = result.slice(-endKeepLen);
    return startPart + ellipsis + endPart;
  }

  return result;
}

/**
 * 简化版：遮掩并限制长度
 * @param str 待遮掩的字符串
 * @param options 配置选项
 * @returns 遮掩并截断后的字符串
 *
 * @example
 * // 遮掩手机号并限制显示长度
 * shieldWithLimit('13812345678', { maxLength: 8 }) // 138****78
 *
 * @example
 * // 遮掩长字符串
 * shieldWithLimit('12345678901234567890', {
 *   startKeep: 4,
 *   endKeep: 4,
 *   maxLength: 12
 * }) // 1234****7890
 */
export function shieldWithLimit(
  str: string,
  options: Omit<ShieldOptions, "str"> & { maxLength: number },
): string {
  return shieldString({ str, ...options });
}

/**
 * 智能摘要：根据重要性自动调整保留位数
 * @param str 待处理的字符串
 * @param maxLength 最大输出长度
 * @param placeholder 遮掩字符
 * @returns 摘要后的字符串
 *
 * @example
 * // 长字符串自动摘要
 * smartSummary('12345678901234567890', 10) // 1234****90
 *
 * @example
 * // 短字符串不变
 * smartSummary('12345', 10) // 12345
 */
export function smartSummary(str: string, maxLength: number, placeholder = "*"): string {
  // 如果字符串本身就不超过最大长度，直接返回
  if (str.length <= maxLength) {
    return str;
  }

  // 如果最大长度小于3，直接截断
  if (maxLength < 3) {
    return str.slice(0, maxLength);
  }

  // 计算保留位数：前1/3，后1/3，中间遮掩
  const totalKeep = maxLength - placeholder.length;
  const startKeep = Math.floor(totalKeep / 2);
  const endKeep = totalKeep - startKeep;

  return shieldString({
    str,
    startKeep: Math.max(1, startKeep),
    endKeep: Math.max(1, endKeep),
    placeholder,
    maxLength,
    showEllipsis: false,
  });
}

/**
 * 屏蔽邮箱
 * @param email 待屏蔽的邮箱
 * @param placeholder 遮掩字符，默认: '*'
 * @returns 屏蔽后的邮箱，例如：exa****@email.com
 */
export function shieldEmail(email: string, placeholder = "*"): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;

  const keepLength = Math.min(3, Math.floor(name.length / 2));
  const shieldCount = name.length - keepLength;
  const shieldStr = placeholder.repeat(Math.min(shieldCount, 4)); // 最多遮掩4个字符

  return `${name.slice(0, keepLength)}${shieldStr}@${domain}`;
}

/**
 * 屏蔽身份证号
 * @param idCard 待屏蔽的身份证号
 * @param placeholder 遮掩字符，默认: '*'
 * @returns 屏蔽后的身份证号，例如：110101********1234
 */
export function shieldIdCard(idCard: string, placeholder = "*"): string {
  return shieldString({
    str: idCard,
    startKeep: 6,
    endKeep: 4,
    placeholder,
    addSpaces: false,
  });
}

/**
 * 屏蔽银行卡号（带空格格式化）
 * @param bankCard 待屏蔽的银行卡号
 * @param placeholder 遮掩字符，默认: '*'
 * @returns 屏蔽后的银行卡号，例如：622848 **** **** 9018
 */
export function shieldBankCard(bankCard: string, placeholder = "*"): string {
  return shieldString({
    str: bankCard,
    startKeep: 6,
    endKeep: 4,
    placeholder,
    addSpaces: true,
  });
}

/**
 * 屏蔽姓名
 * @param name 待屏蔽的姓名
 * @param placeholder 遮掩字符，默认: '*'
 * @returns 屏蔽后的姓名，例如：张** 或 张*三
 */
export function shieldName(name: string, placeholder = "*"): string {
  if (name.length <= 2) {
    // 单姓或复姓：保留姓，其余遮掩
    return name.charAt(0) + placeholder.repeat(name.length - 1);
  }
  // 三个字及以上：保留首尾，中间遮掩
  return shieldString({
    str: name,
    startKeep: 1,
    endKeep: 1,
    placeholder,
    addSpaces: false,
  });
}

/**
 * 检测敏感信息并智能遮掩（支持长度控制）
 * @param str 待检测的字符串
 * @param placeholder 遮掩字符，默认: '*'
 * @param maxLength 最大输出长度，默认: 不限制
 * @returns 遮掩后的字符串，自动识别类型
 *
 * @example
 * // 手机号：138****5678
 * smartShield('13812345678')
 *
 * @example
 * // 邮箱：exa****@email.com
 * smartShield('example@email.com')
 *
 * @example
 * // 身份证：110101********1234
 * smartShield('110101199001011234')
 *
 * @example
 * // 限制长度
 * smartShield('13812345678', '*', 8) // 138****78
 */
export function smartShield(str: string, placeholder = "*", maxLength?: number): string {
  // 移除空格
  const cleanStr = str.replace(/\s/g, "");

  let result: string;

  // 检测手机号（11位数字，以1开头）
  if (/^1\d{10}$/.test(cleanStr)) {
    result = shieldMobile(cleanStr, placeholder);
  }
  // 检测邮箱
  else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanStr)) {
    result = shieldEmail(cleanStr, placeholder);
  }
  // 检测身份证号（15位或18位）
  else if (/^[1-9]\d{14}(\d{2}[\dXx])?$/.test(cleanStr)) {
    result = shieldIdCard(cleanStr, placeholder);
  }
  // 检测银行卡号（16-19位数字）
  else if (/^\d{16,19}$/.test(cleanStr)) {
    result = shieldBankCard(cleanStr, placeholder);
  }
  // 默认：保留前1/3和后1/3，中间遮掩
  else {
    const keepLength = Math.floor(cleanStr.length / 3);
    result = shieldString({
      str: cleanStr,
      startKeep: keepLength,
      endKeep: keepLength,
      placeholder,
      addSpaces: false,
    });
  }

  // 如果设置了最大长度，进行截断
  if (maxLength != null && result.length > maxLength) {
    return result.slice(0, maxLength);
  }

  return result;
}

/**
 * 验证参数是否是数字
 * @param str 待验证的字符串
 * @param numericParam 通过参数标记是否包含小数、正数
 * @param numericParam.isPositive 是否是正数, 默认: false
 * @param numericParam.isFloat 是否是小数, 默认: true
 * @returns true 是数字, false 不是数字
 */
export function isNumeric(
  str: string,
  numericParam?: { isPositive?: boolean; isFloat?: boolean },
): boolean {
  const { isPositive = false, isFloat = true } = numericParam ?? {};
  const symbol = isPositive ? "[+]?" : "[+-]?";
  const main = isFloat ? "([0-9]*[.])?[0-9]+" : "[0-9]+";
  return new RegExp(`^${symbol}${main}$`).test(str);
}

/**
 * 验证参数是否是Boolean 类型
 * @param str 待验证的字符串
 * @returns
 */
export function isBoolean(str: string): boolean {
  return ["true", "false"].includes(str);
}

/** 生成随机数的选项 */
interface RandomStringOption {
  /** 生成指定长度的随机字符串 */
  length: number;
  /** 是否包含英文字母, 默认为: true */
  hasLetter?: boolean;
  /** 生成纯数字的随机数时, 首位是否允许为 0, 默认为: true */
  firstIsZero?: boolean;
}

interface RangeRandomOption {
  /** 配合 max 生成 [min~max] 之间的随机数 */
  min: number;
  /** 配合 max 生成 [min~max] 之间的随机数 */
  max: number;
  /** 生成的随机数，是否包含 max, 默认: false */
  hasEnd?: boolean;
  /** 生成的随机数是否是整数, 默认: true */
  isInteger?: boolean;
}

/**
 * 生成指定长度的随机数
 *
 * @param len - 生成的随机数长度
 *
 * @example <caption>1. 生成指定长度的随机字符串</caption>
 * random(1); // 长度为 1 的随机字符串
 */
export function random(len: number): string;

/**
 * 生成介于 [min, max] 之间的随机数
 *
 * @param option 配置项
 * @param option.min 生成介于 [min, max] 之间的随机数
 * @param option.max 生成介于 [min, max] 之间的随机数
 * @param option.hasEnd 生成的随机数，是否包含 max, 默认: false
 * @param option.isInteger 生成的随机数是否是整数, 默认: true
 */
export function random(option: RangeRandomOption): number;

/**
 * 生成指定长度随机数
 *
 * @param option 配置项
 * @param option.length 生成的随机数长度
 * @param option.hasLetter 是否包含英文字母, 默认为: true
 * @param option.firstIsZero 生成纯数字的随机数时, 首位是否允许为 0, 默认为: true
 *
 * @example <caption>2. 生成纯数字且首位不能为0长度为1的随机字符</caption>
 * random({ length: 1, hasLetter: false, firstIsZero: false })
 */
export function random(option: RandomStringOption): string;

export function random(opts: any) {
  if (typeof opts === "object" && opts !== null && "min" in opts && "max" in opts) {
    // 生成两个数字之间的随机数(number)
    const { min, max, hasEnd = false, isInteger = true } = opts;
    const end = hasEnd ? 1 : 0;
    const resRandom = Math.random() * (max - min + end) + min;
    return isInteger ? Math.floor(resRandom) : resRandom;
  }

  // 校验参数
  const len = typeof opts === "object" ? opts.length : opts;
  if (len == null) throw new Error("random_length_cannot_null");

  // 使用更高效的随机字符生成
  const chars =
    typeof opts === "object" && opts.hasLetter === false ? NUMBER_RANDOM_CHARS : RANDOM_CHARS;
  const charsLen = chars.length;

  const generate = (): string => {
    const result: string[] = [];
    let i = 0;
    while (i < len) {
      result.push(chars[Math.floor(Math.random() * charsLen)]);
      i++;
    }
    return result.join("");
  };

  const result = generate();
  // 检查首位是否为0，如果是则重新生成
  if (typeof opts === "object" && opts.firstIsZero === false && result.at(0) === "0") {
    return random(opts);
  }
  return result;
}

/**
 * 使用 zh-CN 的 Intl.NumberFormat 格式化金额，固定两位小数并遵循 Intl 舍入规则。
 * @param {number} number 待转换的金额数字
 * @return string
 */
export function formatMoney(number: number): string {
  if (!Number.isFinite(number)) return "0.00";

  const formatter = new Intl.NumberFormat("zh-CN", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return formatter.format(number);
}

/**
 * 将风格由大写风格转换为下划线风格: HelloWorld -> hello-world
 * @param name 命名, 例如: HelloWorld
 * @param connector 连接符, 默认为: _
 */
export function snakeCaseStyle(name: string, connector = "-"): string {
  return name.replace(/([A-Z])/g, (match, p1, offset) =>
    offset > 0 ? connector + match.toLowerCase() : match.toLowerCase(),
  );
}

/**
 * 对数字进行四舍五入处理
 * @param num 需要进行四舍五入的数字
 * @param precision 精度，默认为2，即保留小数点后两位
 * @param roundType 舍入类型，默认为0，提供三种取值:
 *        0: 标准四舍五入
 *        1: 向上取整
 *        2: 向下取整
 * @returns 返回经过指定方式舍入后的数字
 */
export function round(num: number, precision = 2, roundType: 0 | 1 | 2 = 0): number {
  if (!Number.isFinite(num)) return num;

  const factor = 10 ** precision;
  const roundMap = {
    0: Math.round,
    1: Math.ceil,
    2: Math.floor,
  } as const;
  const roundFn = roundMap[roundType];
  if (!roundFn) return num;
  return roundFn(num * factor) / factor;
}

/**
 * 反转字符串
 */
export function reverseStr(str: string): string {
  return str.split("").reverse().join("");
}

/** 数据格式化配置 */
interface FormDataConfig<T> {
  /** 配置需要转换为数字的字段 */
  numberFields?: (keyof T)[];
  /** 配置需要转换为字符串的字段 */
  stringFields?: (keyof T)[];
  /** 自定义的格式化 */
  formatter?: {
    [K in keyof T]?: "number" | "string" | ((value: any) => number | string);
  };
}

/**
 * 嵌套的 json 指定 key 数据
 * @param data JSON格式数据
 * @param keys 待获取的数据 key, 可以通过 [.] 获取嵌套数据, 例如: a.b.c
 * @returns
 */
export function getJSONValue(
  data: Record<string, any>,
  keystr: string,
): Record<string, any> | null {
  if (data == null) return null;
  return keystr
    .split(".")
    .reduce<Record<string, any> | null>((acc, key) => acc?.[key] ?? null, data);
}

/**
 * 数据格式化主要用于数据类型转换
 * @param data 待转换数据类型的数据
 * @param config 转换配置
 * @returns
 */
export function formatData<T extends Record<string, any>>(data: T, config?: FormDataConfig<T>): T {
  if (data == null) return data;

  const { numberFields = [], stringFields = [], formatter = {} } = config ?? {};
  const result = Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      let formater = (formatter as any)[key];

      if (formater == null) {
        if (numberFields.includes(key as keyof T)) {
          formater = "number";
        } else if (stringFields.includes(key as keyof T)) {
          formater = "string";
        }
      }

      let newValue = value;
      if (formater != null) {
        if (typeof formater === "function") {
          newValue = formater(value);
        } else if (formater === "number") {
          newValue = Number(value);
        } else if (formater === "string") {
          newValue = String(value);
        }
      }

      return [key, newValue];
    }),
  ) as T;

  return result;
}
