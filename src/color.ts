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

const hueStep = 2; // 色相阶梯
const saturationStep = 0.16; // 饱和度阶梯，浅色部分
const saturationStep2 = 0.05; // 饱和度阶梯，深色部分
const brightnessStep1 = 0.05; // 亮度阶梯，浅色部分
const brightnessStep2 = 0.15; // 亮度阶梯，深色部分

/* 解析: rgb(0,0,0), rgba(0,0,0,0.1) 格式的正则 */
const rgbRegex =
  /^\s*rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)\s*$/;

/* 匹配 16 进制颜色字符串的正则: #fff, #ffffff */
const hexRegex =
  /^#(?:([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})|([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f]))$/;

// 通用数值工具：减少重复 clamp / toFixed 逻辑
const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

const clamp01 = (value: number) => clamp(value, 0, 1);

const round2 = (value: number) => Math.round(value * 100) / 100;

function isRgb(color: any): color is RGBColorObject {
  return color?.r != null && color?.g != null && color?.b != null;
}

function isHsv(color: any): color is HSVColorObject {
  return color?.h != null && color?.s != null && color?.v != null;
}

function parseRgbString(color: string): RGBColorObject | undefined {
  const colorValue = color.match(rgbRegex);

  // 恢复输入校验：正则匹配失败时不继续解析
  if (colorValue == null) {
    return;
  }

  const r = parseInt(colorValue[1]!, 10);
  const g = parseInt(colorValue[2]!, 10);
  const b = parseInt(colorValue[3]!, 10);

  // 检查RGB值是否为NaN
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    throw new Error("Invalid RGB color.");
  }

  let a = 1;

  // 如果是RGBA，解析透明度值
  if (colorValue[4] != null) {
    a = parseFloat(colorValue[4]!);

    if (Number.isNaN(a)) {
      a = 1;
    }
  }

  return {
    r,
    g,
    b,
    a,
  };
}

function parseHexString(color: string): RGBColorObject | undefined {
  const colorMatch = color.match(hexRegex);

  // 恢复输入校验：正则匹配失败时不继续解析
  if (colorMatch == null) {
    return;
  }

  // 判断是否是缩写形式的颜色（3个字符）
  const isShortForm = colorMatch[4] !== undefined;

  const r = parseInt(isShortForm ? colorMatch[4]! + colorMatch[4]! : colorMatch[1]!, 16);
  const g = parseInt(isShortForm ? colorMatch[5]! + colorMatch[5]! : colorMatch[2]!, 16);
  const b = parseInt(isShortForm ? colorMatch[6]! + colorMatch[6]! : colorMatch[3]!, 16);

  // 恢复输入校验：hex 解析结果理论上不应为 NaN，但保留防御
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    throw new Error("Invalid HEX color.");
  }

  return {
    r,
    g,
    b,
  };
}

/**
 * 将输入的颜色值转换为RGB对象格式。
 * @param color 可以是字符串, 也可以是一个 HSV 对象[一个包含 h、s、v 属性的对象]
 * @returns 返回一个包含r、g、b和a（透明度）属性的RGB对象。
 * @throws 如果输入的字符串不是有效的颜色表示，则抛出错误。
 */
export function toRgb(color: ColorType): RGBColorObject {
  if (typeof color === "string") {
    // 恢复输入校验：先尝试 hex，再尝试 rgb/rgba，都失败则抛错
    const rgb = parseHexString(color) ?? parseRgbString(color);

    if (rgb != null) {
      return rgb;
    }

    throw new Error("Invalid color string");
  }

  // 处理RGB对象输入
  if (isRgb(color)) {
    return color;
  }

  // 处理HSV对象输入
  if (isHsv(color)) {
    return hsvToRgb(color);
  }

  // 恢复输入校验：非合法颜色对象时抛错
  throw new Error("Invalid color");
}

/**
 * 将颜色转换为HSV颜色模型。
 * @param color - 字符串或者RGB对象
 * @returns 返回一个包含h、s、v属性的对象，代表HSV颜色值，其中h是色相（取值范围0到360），s是饱和度（取值范围0到1），v是明度（取值范围0到1）。
 */
export function toHsv(color: ColorType): HSVColorObject {
  if (isHsv(color)) return color;

  const rgbColor = toRgb(color);

  // 将RGB值标准化到0到1的范围
  const r = rgbColor.r / 255;
  const g = rgbColor.g / 255;
  const b = rgbColor.b / 255;

  // 获取最大和最小值，计算色彩的明度（V）
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const v = max;

  // 计算饱和度（S）
  const s = max === 0 ? 0 : delta / max;

  // 计算色相（H）
  if (delta === 0) {
    return { h: 0, s, v }; // achromatic (no hue)
  }

  let h = 0;

  // 根据最大值和最小值的不同，计算色相
  switch (max) {
    case r:
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / delta + 2) / 6;
      break;
    case b:
      h = ((r - g) / delta + 4) / 6;
      break;
  }

  // 将色相值乘以360，转换为度数
  return { h: h * 360, s, v };
}

/**
 * 将HSV颜色模型转换为RGB颜色模型。
 * @param hsv 包含色相(h)、饱和度(s)和明度(v)的对象。s 和 v 可以是 0~1之间的小数, 也可以是 0~100 直接的整数, 推荐为小数，结果更精准
 * @returns 返回一个包含红色(r)、绿色(g)和蓝色(b)值的对象，范围为0-255。
 */
function hsvToRgb(hsv: HSVColorObject): RGBColorObject {
  // 将百分比形式的饱和度和明度转换为0-1的数值
  const s = hsv.s > 1 ? hsv.s / 100 : hsv.s;
  const v = hsv.v > 1 ? hsv.v / 100 : hsv.v;

  // 归一化色相，避免负数或越界值影响计算
  const h = ((hsv.h % 360) + 360) % 360;

  // 根据色相值计算色相角，并计算出六个区域中的位置
  const hh = h / 60;
  const hi = Math.floor(hh);
  const f = hh - hi;

  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  // 根据色相角确定RGB值的具体计算
  let r = 0;
  let g = 0;
  let b = 0;

  switch (hi) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  // 将计算得到的RGB值从0-1范围转换为0-255范围
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function getHue(hsv: HSVColorObject, i: number, light?: boolean): number {
  const h = Math.round(hsv.h);

  // 根据色相不同，色相转向不同
  const hue =
    h >= 60 && h <= 240
      ? light
        ? h - hueStep * i
        : h + hueStep * i
      : light
        ? h + hueStep * i
        : h - hueStep * i;

  // 使用模运算处理环绕，比手动 +/- 360 更稳定
  return ((hue % 360) + 360) % 360;
}

function getSaturation(hsv: HSVColorObject, i: number, light?: boolean): number {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }

  const saturation = light ? hsv.s - saturationStep * i : hsv.s + saturationStep2 * i;

  // 边界值修正
  return round2(clamp(saturation, 0.06, 1));
}

function getValue(hsv: HSVColorObject, i: number, light?: boolean): number {
  const value = light ? hsv.v + brightnessStep1 * i : hsv.v - brightnessStep2 * i;

  // 边界值修正
  return round2(clamp01(value));
}

/**
 * 将RGB颜色对象转换为十六进制颜色字符串。
 * @param rgb - 包含红色(r), 绿色(g), 蓝色(b)成分的对象。
 * @returns 返回一个表示RGB颜色的十六进制字符串，例如"#FF0000"。
 */
export function rgbToHex(rgb: RGBColorObject): string {
  // 将一个数字转换为两位数的十六进制字符串
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  // 将RGB颜色值转换为十六进制字符串并大写化
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * 将颜色转换为 16 进制字符串
 * @param color - 颜色, 可以 rgb(0,0,0),rgba(0,0,0,0)字符串, 也可以是 rgb、hsv对象
 * @returns 返回颜色的十六进制字符串，例如"#FF0000"
 */
export function toHex(color: ColorType): string {
  // 恢复输入校验：只有合法 hex 字符串才快速返回
  if (typeof color === "string" && hexRegex.test(color)) {
    return color;
  }

  return rgbToHex(toRgb(color));
}

/**
 * 调整给定颜色深[darken]浅[lighten]
 * @param color - 输入的颜色，可以是任意颜色表示方式
 * @param level - 调整深浅级别, 可以是小数。默认: 1
 * @param light - 控制调整的方向。如果为true，[lighten] 变浅，如果为false，[darken] 变深。默认: true
 * 1. 颜色变浅
 * adjust('#4998f4', 3, true)
 * @returns 返回调整后颜色的十六进制字符串表示。
 */
export function adjust(color: ColorType, level = 1, light = true): string {
  // 将输入的颜色转换为HSV格式
  const hsv = toHsv(color);

  // 根据level和light参数调整颜色的H、S、V值，并转换回十六进制颜色表示
  return toHex({
    h: getHue(hsv, level, light),
    s: getSaturation(hsv, level, light),
    v: getValue(hsv, level, light),
  });
}
