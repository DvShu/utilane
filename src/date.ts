/**
 * node 和 web 端日期处理工具类
 */
// 配置日期格式的正则表达式
const REGEX_FORMAT = /yy(?:yy)?|([HMmds])\1?|(S)?/g;
// 由于 Date.parse() 不能正确解析 yyyy-dd-mm 格式的日期, 所以匹配手动解析
const REGEX_PARSE =
  /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/;

const ofArgs = {
  start: [0, 0, 1, 0, 0, 0, 0],
  end: [0, 11, -2, 23, 59, 59, 999],
};

const units = {
  Date: ["date", "Date", "day", "Day", "D", "d"],
  Month: ["Month", "month", "m"],
  FullYear: ["Year", "year", "y"],
  Hours: ["Hours", "hours", "H"],
  Minutes: ["Minutes", "Minute", "minute", "minutes", "M"],
  Seconds: ["Seconds", "seconds", "Second", "second", "s"],
  Milliseconds: ["Milliseconds", "Millisecond", "milliseconds", "illisecond", "S"],
};

/**
 * 不足位数, 前位补 0
 * @param s 日期数字
 * @param l 截取位数
 * @returns {string}  补0后的日期数字
 */
function p(s: number, l = 2): string {
  /*
   * 由于年份最多为4为，所以前面先添3个0
   * slice() 从后开始提前字符串
   */
  return `000${s}`.slice(l * -1);
}

/**
 * 将单位转换为首字母大写, 例如：hours -> Hours
 * @param unit hours
 * @returns
 */
function getUnit(unit: string): string {
  let period: string | null = null;
  for (const [key, value] of Object.entries(units)) {
    if (value.includes(unit)) {
      period = key;
      break;
    }
  }
  if (period == null) {
    throw new Error(`Invalid unit: ${unit}`);
  }
  return period;
}

/**
 * 获取指定日期某个月的最后一天
 * @param date  日期
 * @param month 月份, 如果不传, 则当前月的最后一天
 * @returns
 */
function getLastDayOfMonth(date: Date, month?: number) {
  // 下个月的第 0 天即本月最后一天；克隆日期以保留 0～99 年的真实年份。
  const lastDate = new Date(date.getTime());
  lastDate.setMonth((month ?? date.getMonth()) + 1, 0);
  return lastDate.getDate();
}

/**
 * 将日期格式化为指定形式的字符串
 * @param date      日期
 * @param pattern   格式化字符串 yyyy - 年, mm - 月, dd - 日, HH - 小时(24时制), MM - 分钟, ss - 秒, S - 毫秒, 默认: yyyy-mm-dd HH:MM:ss
 */
export function format(
  date?: Date | string | number | null,
  pattern = "yyyy-mm-dd HH:MM:ss",
): string {
  date = parse(date);
  const d = date.getDate();
  const y = date.getFullYear();
  const m = date.getMonth();
  const H = date.getHours();
  const M = date.getMinutes();
  const s = date.getSeconds();
  const flags: any = {
    yy: p(y),
    yyyy: y,
    m: m + 1,
    mm: p(m + 1),
    d: d,
    dd: p(d),
    H: H,
    HH: p(H),
    M: M,
    MM: p(M),
    s: s,
    ss: p(s),
    S: p(date.getMilliseconds(), 3),
  };
  if (pattern != null) {
    return pattern.replace(REGEX_FORMAT, (flag: string) => {
      if (flag in flags) {
        return flags[flag];
      }
      return flag;
    });
  }
  return String(date.getTime());
}

/**
 * 将指定的参数解析为日期对象(Date)
 * 参考 dayjs 实现, 也可以参考 https://github.com/nomiddlename/date-format
 * @param date 待解析的日期参数
 */
export function parse(date?: Date | string | number | null): Date {
  if (date == null) return new Date();
  if (typeof date === "string" && !/Z$/i.test(date)) {
    const d: any = date.match(REGEX_PARSE);
    if (d) {
      return new Date(d[1], d[2] - 1, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, d[7] || 0);
    }
  }
  if (typeof date === "number") {
    return new Date(date <= 9999999999 ? date * 1000 : date);
  }
  return new Date(date);
}

/**
 * 设置日期的开始或者结束的点
 * @param date 日期，能够被 parse 解析的日期
 * @param unit 单位，Date[D]、Minute[M], 默认为 Date
 * @param isEnd true则为 endOf
 */
export function dateOf(date?: Date | string | number | null, unit?: string, isEnd = false): Date {
  /* 如果是设置某一天的开始时刻, 就需要将时、分、秒、毫秒设置为0，依次类推设置 */
  const periods = ["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds", "Milliseconds"];
  let index = periods.indexOf(getUnit(unit || "Date"));
  const clone = parse(date);
  index++;
  const setValues = ofArgs[isEnd === true ? "end" : "start"];
  for (const len = periods.length; index < len; index++) {
    let value = setValues[index];
    if (value === -2) {
      // 设置为某个月的最后一天的日期
      value = getLastDayOfMonth(clone);
    }
    (Date as any).prototype["set" + periods[index]].apply(clone, [value]);
  }
  return clone;
}

/**
 * 设置日期的开始的点
 * @param date 日期，能够被 parse 解析的日期
 * @param unit 单位，Date[D]、Minute[M], 默认为 Date
 * @returns
 */
export function startOf(date?: Date | string | number | null, unit?: string): Date {
  return dateOf(date, unit);
}

/**
 * 设置日期的结束点
 * @param date 日期，能够被 parse 解析的日期
 * @param unit 单位，Date[D]、Minute[M], 默认为 Date
 * @returns
 */
export function endOf(date?: Date | string | number | null, unit?: string): Date {
  return dateOf(date, unit, true);
}

/**
 * 获取时间戳
 * @param ctime 时间
 * @param pre 精度, s - 精确到秒, ms - 精确到毫秒, 默认: s
 * @returns
 */
export function timestamp(ctime?: Date | string | number, pre: "s" | "ms" = "s"): number {
  let tm = parse(ctime).getTime();
  return pre === "s" ? Math.floor(tm / 1000) : tm;
}

/**
 * 日期加上指定时间后的日期
 * @param date 指定的日期
 * @param num  需要添加的数字, 如果这个参数传递一个小于0的数字，则就是日期减去相应的数字
 * @param unit 需要添加的单位，date、month、year、hours、minute、second
 *
 * 查阅文档: {@link https://github.com/DvShu/utilane/blob/HEAD/docs/date.md Utilane}
 *
 * @example <caption>1. 分钟加1并格式化显示时间</caption>
 *
 * add(new Date(), 1, 'minute', 'HHMMss')
 */
export function add(date: Date | string | number | null, num: number, unit: string): Date;
/**
 * 日期加上指定时间后的日期
 * @param date    指定的日期, 传递为 null ，则表示为当前日期
 * @param num     需要添加的数字, 如果这个参数传递一个小于0的数字，则就是日期减去相应的数字
 * @param unit    需要添加的单位，date - 加减天数
 * @param fmt     如果传递了格式化的单位，则返回格式化后的日期, 格式化字符串 yyyy - 年, mm - 月, dd - 日, HH - 小时, MM - 分钟, ss - 秒
 *
 * #### 1. 前一天的日期字符串形式
 * ```javascript
 * add(new Date(), -1, 'Date', 'yyyy-mm-dd')
 * ```
 */
export function add(
  date: Date | string | number | null,
  num: number,
  unit: string,
  fmt: string,
): string;
/**
 * 日期加上指定时间后的日期
 * @param date  指定的日期
 * @param num   需要添加的数字, 如果这个参数传递一个小于0的数字，则就是日期减去相应的数字
 * @param unit  需要添加的单位，date - 加减天数
 * @param fmt   可选参数，如果传递了格式化的单位，则返回格式化后的日期, 格式化字符串 yyyy - 年, mm - 月, dd - 日, HH - 小时, MM - 分钟, ss - 秒
 * @returns {Date | string} 如果传递了 fmt 参数，则返回 string，否则返回 Date
 */
export function add(
  date: Date | string | number | null,
  num: number,
  unit: string,
  fmt?: string,
): any {
  let sdate = new Date();
  if (date != null) {
    sdate = parse(date);
  }
  unit = getUnit(unit);
  let fn = "set" + unit;
  let gn = "get" + unit;
  // @ts-ignore
  let oldValue = Date.prototype[gn].apply(sdate);
  // @ts-ignore
  Date.prototype[fn].apply(sdate, [oldValue + num]);
  if (typeof fmt === "string") {
    return format(sdate, fmt);
  } else {
    return sdate;
  }
}
