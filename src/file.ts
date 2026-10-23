/** nodejs 文件操作工具类 */
import path from "node:path";
import fs from "node:fs/promises";

/**
 * 读取文件内容
 * @example <caption>1. 读取JSON文件, 内容为字符串列表</caption>
 * read<string[]>('a.json', []);
 * @example <caption>2. 读取JSON文件, 内容为对象</caption>
 * read<{ name: string }>('b.json', {});
 * @param filepath     文件路径
 * @param defaultValue 文件不存在时默认值, 不传则抛异常, 如果传递的是对象形式则会将结果转换为 JSON
 * @returns 文件内容
 */
export async function read<T>(filepath: string, defaultValue?: T): Promise<T> {
  let content;
  try {
    content = await fs.readFile(filepath, "utf8");
    if (defaultValue != null && typeof defaultValue === "object") {
      return JSON.parse(content);
    }
    return content as any;
  } catch (error) {
    if (defaultValue === undefined) {
      throw error;
    }
    return defaultValue;
  }
}

/**
 * 写入 JSON 格式的数据到文件
 * @param file 待写入的文件
 * @param data 待写入的数据
 * @param opts 写入配置
 * @property opts.json 是否写入 JSON 格式的数据，写入数据时对数据进行 JSON 格式化，默认为：true
 * @property opts.format 是否在写入 json 数据时，将 JSON 数据格式化2个空格写入, 默认为 true
 */
export async function write(
  file: string,
  data: any,
  opts?: { json: boolean; format: boolean },
): Promise<void> {
  let writeData: string = data.toString();
  opts = { json: true, format: true, ...opts };
  if (opts.json === true && typeof data === "object") {
    writeData = JSON.stringify(data, null, opts.format === true ? 2 : 0);
  }
  await fs.writeFile(path.resolve(file), writeData);
}

/**
 * 根据文件的 stat 获取文件的 etag
 * @param filePath 文件地址
 * @returns file stat etag
 */
export async function statTag(filePath: string): Promise<string> {
  let stat = await fs.stat(filePath);
  return `${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}`;
}
