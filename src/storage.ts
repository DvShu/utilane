/**
 * 缓存相关
 */
type StorageType = "session" | "local";

function getStorage(storage = "session") {
  return storage === "session" ? sessionStorage : localStorage;
}

interface StorageSetOption {
  storage?: StorageType;
  /** 数据有效期, 单位秒, 默认: -1 - 永久存储 */
  expire?: number;
}

/**
 * 存储值到 Storage 中
 * @param key 设置的 key
 * @param value 设置的值
 * @param [option.storage] session 或 local, 默认: session
 * @param [option.expire] 数据有效期, 单位秒, 默认: -1 - 永久存储
 *
 * @example <caption>1. 存储到 SessionStorage</caption>
 * set("key", "value");
 *
 * @example <caption>2. 存储到 LocalStorage</caption>
 * set("key", "value", { storage: "local" });
 */
export function set(key: string, value: any, option?: StorageSetOption): void {
  const opts: Required<StorageSetOption> = {
    expire: -1,
    storage: "session",
    ...option,
  };
  const saveData = JSON.stringify({
    value,
    time: Date.now(),
    expire: opts.expire === -1 ? -1 : Math.floor(Date.now() / 1000) + opts.expire,
  });
  getStorage(opts.storage).setItem(key, saveData);
}

/**
 * 清空所有的缓存内容
 * @param storage 待清空的缓存对象
 */
export function clear(storage?: StorageType): void {
  getStorage(storage).clear();
}

/**
 * 删除存储到 Storage 中的数据
 * @param key
 * @param storage
 */
export function remove(key: string, storage?: StorageType): void {
  getStorage(storage).removeItem(key);
}

/** 从 Storage 中获取数据时的配置 */
interface StorageQueryOption {
  /** 数据是否持久化, 默认为: false, 设置为 true 则会在每一次取出数据后删除 */
  delete?: boolean;
  /** 存储对象, session、local */
  storage?: StorageType;
}

/**
 * 从 Storage 中取出数据
 * @param key 保存时的 key
 * @param defaultValue 数据不存在、过期或值为 undefined 时的默认值；未提供则返回 null
 * @param [option.delete] 是否在取出后删除数据，默认 false，不删除
 * @param [option.storage] 使用 session 或 local，默认 session
 * @returns 保存的值（保留 0、false、空字符串和 null），无数据时返回默认值
 */
export function get<T>(key: string, defaultValue?: T, option?: StorageQueryOption): T {
  const opts = (option || { delete: false }) as Required<StorageQueryOption>;
  const storage = getStorage(opts.storage);
  const fallback = defaultValue === undefined ? (null as T) : defaultValue;
  let data: any = storage.getItem(key);
  if (data == null) {
    return fallback;
  }
  data = JSON.parse(data);
  if (data.expire !== -1) {
    // 数据过期
    if (Math.floor(Date.now() / 1000) > data.expire) {
      storage.removeItem(key);
      return fallback;
    }
  }
  if (opts.delete) {
    storage.removeItem(key);
  }
  return data.value === undefined ? fallback : data.value;
}
