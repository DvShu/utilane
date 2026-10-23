/**
 * 全局 Collator 单例缓存，避免重复创建
 */
let _collator: Intl.Collator | undefined;

/**
 * 获取 Intl.Collator 单例（支持数字感知的字符串比较，如 "a2" < "a10"）
 * 使用 ??= 运算符实现惰性初始化
 */
function _getCollator(): Intl.Collator {
  return (_collator ??= new Intl.Collator(undefined, { numeric: true }));
}

/**
 * 数组排序（不修改原数组，返回新数组）
 * @param arr 待排序数组
 * @param order 排序方向: "asc" - 升序（默认）, "desc" - 降序
 * @param orderKey 如果数组元素是对象，指定按哪个字段排序；为 null 时按元素本身排序
 * @returns 排序后的新数组
 */
export function order<T>(
  arr: T[],
  order: "asc" | "desc" = "asc",
  orderKey: keyof T | null = null,
): T[] {
  // 获取字符串比较器（单例，避免重复创建）
  const collator = _getCollator();

  // 提前计算排序方向系数：升序为 1，降序为 -1，后续通过乘法统一处理
  const sign = order === "asc" ? 1 : -1;

  // 提前绑定取值函数，避免在 sort 回调中每次都判断 orderKey 是否为 null
  // orderKey 为 null 时直接返回元素本身，否则返回对象对应字段的值
  const get = orderKey == null ? (v: T) => v : (v: T) => (v as any)[orderKey];

  // 使用扩展运算符浅拷贝数组，避免修改原始数组
  return [...arr].sort((a, b) => {
    const av = get(a);
    const bv = get(b);

    // 字符串使用 Intl.Collator 比较（支持多语言、数字感知排序）
    // 其他类型使用通用比较运算符
    const cmp =
      typeof av === "string" ? collator.compare(av, bv as string) : av < bv ? -1 : av > bv ? 1 : 0;

    // 乘以方向系数：升序保持原值，降序取反
    return cmp * sign;
  });
}

/* ================================================================
 * 内部辅助函数
 * ================================================================ */

/**
 * 获取集合大小（兼容 Set 和 Array）
 * @param v Set 或 Array
 * @returns 元素个数
 */
function _size<T>(v: Set<T> | T[]): number {
  return v instanceof Set ? v.size : v.length;
}

/**
 * 将 Set 或 Array 统一转为 Set（如果已经是 Set 则直接返回，避免重复创建）
 * @param v Set 或 Array
 * @returns Set 实例
 */
function _toSet<T>(v: Set<T> | T[]): Set<T> {
  return v instanceof Set ? v : new Set(v);
}

/**
 * 检测对象上是否存在可用的原生方法（ES2025 Set 新方法检测）
 * @param obj 目标对象
 * @param name 方法名
 * @returns 是否为可调用的函数
 */
function _hasNative(obj: any, name: string): boolean {
  return typeof obj[name] === "function";
}

/* ================================================================
 * intersection - 交集
 * ================================================================ */

/** 重载：所有参数为 Set 时，返回 Set */
export function intersection<T>(...arrs: Set<T>[]): Set<T>;
/** 重载：所有参数为 Array 时，返回 Array */
export function intersection<T>(...arrs: T[][]): T[];
/**
 * 返回所有集合交集的元素组成的新集合
 * - 以第一个参数的类型决定返回 Set 还是 Array
 * - 支持混合传入 Set 和 Array
 * - 优先使用原生 ES2025 Set.prototype.intersection
 * @param arrs 多个集合/数组
 * @returns 交集结果（Set 或 Array）
 */
export function intersection<T>(...arrs: (Set<T> | T[])[]): Set<T> | T[] {
  // 根据第一个参数的类型决定输出模式
  const isSet = arrs[0] instanceof Set;

  // 初始化累加器（浅拷贝，避免修改原始数据）
  let acc: Set<T> | T[] = isSet ? new Set(arrs[0] as Set<T>) : [...(arrs[0] as T[])];

  // 从第二个集合开始逐个求交集
  // 循环条件中加入 _size(acc) > 0：一旦交集为空立即停止，避免无效计算
  for (let i = 1; i < arrs.length && _size(acc) > 0; i++) {
    const cur = arrs[i];

    // 当前集合为空，交集必然为空，直接返回空结果
    if (_size(cur) === 0) {
      return isSet ? new Set<T>() : [];
    }

    if (isSet) {
      const accSet = acc as Set<T>;
      // 统一转为 Set，兼容混合输入
      const curSet = _toSet(cur);

      // 优先调用原生 ES2025 intersection 方法
      acc = _hasNative(accSet, "intersection")
        ? (accSet as any).intersection(curSet)
        : _intersectFallback(accSet, curSet);
    } else {
      // 数组模式：将 cur 转为 Set 后用 filter 过滤，O(1) 查找
      const curSet = _toSet(cur);
      acc = (acc as T[]).filter((x) => curSet.has(x));
    }
  }
  return acc;
}

/**
 * 交集回退实现（不支持原生 intersection 时使用）
 * 性能优化：始终遍历较小的集合，减少迭代次数
 * @param a 集合 A
 * @param b 集合 B
 * @returns 交集 Set
 */
function _intersectFallback<T>(a: Set<T>, b: Set<T>): Set<T> {
  // 选择较小的集合进行遍历，在较大的集合中查找
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  const res = new Set<T>();
  for (const v of smaller) {
    if (larger.has(v)) {
      res.add(v);
    }
  }
  return res;
}

/* ================================================================
 * difference - 差集
 * ================================================================ */

/** 重载：所有参数为 Set 时，返回 Set */
export function difference<T>(...arrs: Set<T>[]): Set<T>;
/** 重载：所有参数为 Array 时，返回 Array */
export function difference<T>(...arrs: T[][]): T[];
/**
 * 返回第一个集合中有但后续所有集合中没有的元素组成的新集合
 * - 优先使用原生 ES2025 Set.prototype.difference
 * - 数组模式使用 Set.has 替代 includes，性能从 O(n×m) 降至 O(n+m)
 * @param arrs 多个集合/数组
 * @returns 差集结果（Set 或 Array）
 */
export function difference<T>(...arrs: (Set<T> | T[])[]): Set<T> | T[] {
  const isSet = arrs[0] instanceof Set;

  // 初始化累加器（浅拷贝）
  let acc: Set<T> | T[] = isSet ? new Set(arrs[0] as Set<T>) : [...(arrs[0] as T[])];

  // 逐个减去后续集合
  // acc 为空时提前终止，避免无效迭代
  for (let i = 1; i < arrs.length && _size(acc) > 0; i++) {
    // 将当前集合统一转为 Set，确保 has 查找为 O(1)
    const curSet = _toSet(arrs[i]);

    if (isSet) {
      const accSet = acc as Set<T>;

      // 优先使用原生 difference 方法
      acc = _hasNative(accSet, "difference")
        ? (accSet as any).difference(curSet)
        : _filterSet(accSet, (v) => !curSet.has(v));
    } else {
      // 数组模式：用 Set.has 过滤，O(1) 查找
      acc = (acc as T[]).filter((v) => !curSet.has(v));
    }
  }
  return acc;
}

/**
 * Set 过滤辅助函数：返回满足条件的新 Set
 * @param set 源集合
 * @param predicate 过滤条件函数
 * @returns 过滤后的新 Set
 */
function _filterSet<T>(set: Set<T>, predicate: (v: T) => boolean): Set<T> {
  const res = new Set<T>();
  for (const v of set) {
    if (predicate(v)) {
      res.add(v);
    }
  }
  return res;
}

/* ================================================================
 * union - 并集
 * ================================================================ */

/** 重载：所有参数为 Set 时，返回 Set */
export function union<T>(...arrs: Set<T>[]): Set<T>;
/** 重载：所有参数为 Array 时，返回 Array */
export function union<T>(...arrs: T[][]): T[];
/**
 * 返回多个集合的并集
 * - 优先使用原生 ES2025 Set.prototype.union
 * - Set 模式自动去重；Array 模式保持原有行为（拼接，不去重）
 * @param arrs 多个集合/数组
 * @returns 并集结果（Set 或 Array）
 */
export function union<T>(...arrs: (Set<T> | T[])[]): Set<T> | T[] {
  const isSet = arrs[0] instanceof Set;

  // 初始化累加器（浅拷贝）
  let acc: Set<T> | T[] = isSet ? new Set(arrs[0] as Set<T>) : [...(arrs[0] as T[])];

  // 逐个合并后续集合
  for (let i = 1; i < arrs.length; i++) {
    const cur = arrs[i];

    if (isSet) {
      const accSet = acc as Set<T>;
      // 统一转为 Set，兼容混合输入
      const curSet = _toSet(cur);

      // 优先使用原生 union 方法
      // 注意：修复了原代码中检测 cur.union 而非 acc.union 的 Bug
      acc = _hasNative(accSet, "union")
        ? (accSet as any).union(curSet)
        : new Set([...accSet, ...curSet]); // 展开合并，Set 自动去重
    } else {
      // 数组模式：直接拼接（保持原行为）
      acc = [...(acc as T[]), ...(cur as T[])];
    }
  }
  return acc;
}

/* ================================================================
 * symmetricDifference - 对称差
 * ================================================================ */

/** 重载：所有参数为 Set 时，返回 Set */
export function symmetricDifference<T>(...arrs: Set<T>[]): Set<T>;
/** 重载：所有参数为 Array 时，返回 Array */
export function symmetricDifference<T>(...arrs: T[][]): T[];
/**
 * 对称差：返回只存在于其中一个集合中的元素（不同时存在于两个集合中的元素）
 * - 优先使用原生 ES2025 Set.prototype.symmetricDifference
 * - 数组模式使用 Set.has 替代 includes，性能大幅提升
 * @param arrs 多个集合/数组
 * @returns 对称差结果（Set 或 Array）
 */
export function symmetricDifference<T>(...arrs: (Set<T> | T[])[]): Set<T> | T[] {
  const isSet = arrs[0] instanceof Set;

  // 初始化累加器（浅拷贝）
  let acc: Set<T> | T[] = isSet ? new Set(arrs[0] as Set<T>) : [...(arrs[0] as T[])];

  // 逐个计算对称差
  for (let i = 1; i < arrs.length; i++) {
    const cur = arrs[i];

    if (isSet) {
      const accSet = acc as Set<T>;
      const curSet = _toSet(cur);

      // 优先使用原生 symmetricDifference 方法
      acc = _hasNative(accSet, "symmetricDifference")
        ? (accSet as any).symmetricDifference(curSet)
        : _symDiffSetFallback(accSet, curSet);
    } else {
      // 数组模式：使用 Set 加速查找
      acc = _symDiffArrayFallback(acc as T[], cur as T[]);
    }
  }
  return acc;
}

/**
 * Set 对称差回退实现
 * 逻辑：A△B = (A-B) ∪ (B-A)
 * @param a 集合 A
 * @param b 集合 B
 * @returns 对称差 Set
 */
function _symDiffSetFallback<T>(a: Set<T>, b: Set<T>): Set<T> {
  const res = new Set<T>();
  // A 中有但 B 中没有的
  for (const v of a) {
    if (!b.has(v)) {
      res.add(v);
    }
  }
  // B 中有但 A 中没有的
  for (const v of b) {
    if (!a.has(v)) {
      res.add(v);
    }
  }
  return res;
}

/**
 * 数组对称差回退实现
 * 性能优化：将两个数组都转为 Set，查找从 O(n) 降至 O(1)
 * @param a 数组 A
 * @param b 数组 B
 * @returns 对称差数组
 */
function _symDiffArrayFallback<T>(a: T[], b: T[]): T[] {
  // 预先构建 Set，避免在循环中使用 O(n) 的 includes
  const aSet = new Set(a);
  const bSet = new Set(b);
  const res: T[] = [];

  // A 中有但 B 中没有的
  for (const v of a) {
    if (!bSet.has(v)) {
      res.push(v);
    }
  }
  // B 中有但 A 中没有的
  for (const v of b) {
    if (!aSet.has(v)) {
      res.push(v);
    }
  }
  return res;
}

/* ================================================================
 * isSubsetOf - 子集判断
 * ================================================================ */

/**
 * 判断 a1 是否是 a2 的子集（a1 的所有元素是否都在 a2 中）
 * - 优先使用原生 ES2025 Set.prototype.isSubsetOf
 * - 数组模式使用 Set.has 替代 includes，性能优化
 * @param a1 待判断集合（可能是子集）
 * @param a2 目标集合（可能是超集）
 * @returns a1 ⊆ a2 时返回 true
 */
export function isSubsetOf<T>(a1: T[] | Set<T>, a2: T[] | Set<T>): boolean {
  // 如果 a1 是 Set 且支持原生方法，直接调用原生实现
  if (a1 instanceof Set && _hasNative(a1, "isSubsetOf")) {
    return (a1 as any).isSubsetOf(_toSet(a2));
  }

  // 回退实现：将 a2 转为 Set，确保查找为 O(1)
  const set2 = _toSet(a2);

  // 遍历 a1，发现任意元素不在 a2 中则立即返回 false（提前终止）
  for (const item of a1) {
    if (!set2.has(item)) {
      return false;
    }
  }
  return true;
}

/* ================================================================
 * isSupersetOf - 超集判断
 * ================================================================ */

/**
 * 判断 a1 是否是 a2 的超集（a2 的所有元素是否都在 a1 中）
 * 逻辑等价于：a2 是 a1 的子集
 * @param a1 待判断集合（可能是超集）
 * @param a2 目标集合（可能是子集）
 * @returns a1 ⊇ a2 时返回 true
 */
export function isSupersetOf<T>(a1: T[] | Set<T>, a2: T[] | Set<T>): boolean {
  // 直接委托给 isSubsetOf，交换参数顺序即可
  return isSubsetOf(a2, a1);
}

/* ================================================================
 * isDisjointFrom - 不相交判断
 * ================================================================ */

/**
 * 判断两个集合是否没有公共元素（不相交）
 * - 优先使用原生 ES2025 Set.prototype.isDisjointFrom
 * - 数组模式使用 Set.has 替代 includes，性能优化
 * @param a1 集合 1
 * @param a2 集合 2
 * @returns 两集合无交集时返回 true
 */
export function isDisjointFrom<T>(a1: T[] | Set<T>, a2: T[] | Set<T>): boolean {
  // 如果 a1 是 Set 且支持原生方法，直接调用原生实现
  if (a1 instanceof Set && _hasNative(a1, "isDisjointFrom")) {
    return (a1 as any).isDisjointFrom(_toSet(a2));
  }

  // 回退实现：将 a2 转为 Set，确保查找为 O(1)
  const set2 = _toSet(a2);

  // 遍历 a1，发现任意公共元素则立即返回 false（提前终止）
  for (const item of a1) {
    if (set2.has(item)) {
      return false;
    }
  }
  return true;
}
