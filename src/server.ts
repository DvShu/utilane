import { execFile, spawn as spawnOri } from "node:child_process";
import type {
  ExecFileOptionsWithStringEncoding,
  SpawnOptionsWithoutStdio,
} from "node:child_process";
import { promisify } from "node:util";

const execFilePromise = promisify(execFile);

/**
 * 执行命令
 * @param command 待执行的命令
 * @param args    命令参数
 */
export function exec(command: string, args?: string[]): Promise<{ stdout: string; stderr: string }>;
export function exec(
  command: string,
  options?: SpawnOptions,
): Promise<{ stdout: string; stderr: string }>;
export function exec(
  command: string,
  args?: string[],
  options?: SpawnOptions,
): Promise<{ stdout: string; stderr: string }>;
/**
 * 执行命令
 * @param cmd 执行的命令
 * @returns
 */
export function exec(command: string, ...params: any) {
  let argvs: string[] = [];
  const commandItems = command.split(" ");
  const cmd = commandItems.shift() as string;
  if (commandItems.length > 0) {
    argvs = commandItems;
  }
  let opts = { shell: true } as any;
  if (params[0] != null) {
    if (params[0] instanceof Array) {
      argvs.push(...params[0]);
      if (params[1] != null) {
        opts = params[1];
      }
    } else {
      opts = params[0];
    }
  }
  return execFilePromise(cmd, argvs, opts as ExecFileOptionsWithStringEncoding);
}

type SpawnOptions = SpawnOptionsWithoutStdio & {
  shell?: "powershell";
};

/**
 * 执行命令并返回执行结果的Promise
 * @param command 要执行的命令
 * @param args 命令参数数组
 * @param options 执行选项，支持指定shell类型
 * @returns Promise对象，成功时resolve包含stdout和stderr的对象，失败时reject包含错误信息
 */
export function spawn(
  command: string,
  args?: string[],
  options: SpawnOptions = {},
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    let execArgs = [];
    let cmd: string;
    // 根据是否指定powershell shell来设置实际执行的命令和参数
    if (options.shell === "powershell") {
      cmd = "powershell.exe";
      execArgs = ["-NoProfile", "-Command", command, ...(args || [])];
    } else {
      cmd = command;
      execArgs = args || [];
    }
    delete options.shell;
    const child = spawnOri(cmd, execArgs, options);

    let stdout = "",
      stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));

    // 监听子进程关闭事件，根据退出码决定resolve或reject
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`spawn failed (${code}): ${stderr}`));
    });
    // 监听子进程错误事件，发生错误时直接reject
    child.on("error", reject);
  });
}
