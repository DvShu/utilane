import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));

async function markdownFiles(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const item of items) {
    const path = resolve(directory, item.name);
    if (item.isDirectory()) result.push(...(await markdownFiles(path)));
    else if (item.name.endsWith(".md")) result.push(path);
  }
  return result;
}
const documents = [
  "README.md",
  "README.zh-CN.md",
  "AGENTS.md",
  "CONTRIBUTING.md",
  "CONTRIBUTING.zh-CN.md",
  "CHANGELOG.md",
  "CHANGELOG.zh-CN.md",
  "llms.txt",
]
  .map((name) => resolve(root, name))
  .concat(await markdownFiles(resolve(root, "docs")));
const examples = new Map();
const exampleOrigins = new Map();
for (const file of documents) {
  const markdown = await readFile(file, "utf8");
  for (const match of markdown.matchAll(/```ts\r?\n([\s\S]*?)```/g)) {
    const virtualPath = resolve(root, `.docs-example-${examples.size}.mts`);
    examples.set(virtualPath, match[1]);
    exampleOrigins.set(virtualPath, relative(root, file));
  }
  const content = markdown.replace(/```[\s\S]*?```/g, "");
  for (const match of content.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const link = match[1];
    if (/^(?:[a-z]+:|#)/i.test(link)) continue;
    const target = resolve(dirname(file), decodeURIComponent(link.split("#")[0]));
    await readFile(target).catch(() => {
      throw new Error(`${relative(root, file)} 链接不存在：${link}`);
    });
  }
}

// Require both language files and reciprocal language links, including new guides.
const pairs = ["README", "CONTRIBUTING", "CHANGELOG"].map((name) => [
  resolve(root, `${name}.md`),
  resolve(root, `${name}.zh-CN.md`),
]);
for (const english of documents.filter(
  (file) =>
    file.startsWith(resolve(root, "docs") + "/") || file.startsWith(resolve(root, "docs") + "\\"),
)) {
  const path = relative(resolve(root, "docs"), english).replaceAll("\\", "/");
  if (path.startsWith("zh-CN/")) continue;
  pairs.push([english, resolve(root, "docs/zh-CN", path)]);
}
const paired = new Set(pairs.flat());
for (const file of documents) {
  if (file.startsWith(resolve(root, "docs/zh-CN")) && !paired.has(file)) {
    throw new Error(`Chinese page has no English counterpart: ${relative(root, file)}`);
  }
}
for (const [english, chinese] of pairs) {
  for (const [page, counterpart] of [
    [english, chinese],
    [chinese, english],
  ]) {
    const text = await readFile(page, "utf8");
    const expectedLink = relative(dirname(page), counterpart).replaceAll("\\", "/");
    if (!text.includes(`](${expectedLink})`))
      throw new Error(`Missing language link in ${relative(root, page)}: ${expectedLink}`);
  }
}

// 用虚拟文件校验示例，不产生临时文件，也不执行浏览器或文件操作。
const options = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  types: ["node"],
};
const host = ts.createCompilerHost(options);
const getSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (file, languageVersion, ...rest) =>
  examples.has(resolve(file))
    ? ts.createSourceFile(file, examples.get(resolve(file)), languageVersion, true)
    : getSourceFile(file, languageVersion, ...rest);
const exampleProgram = ts.createProgram([...examples.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(exampleProgram);
if (diagnostics.length) {
  throw new Error(
    diagnostics
      .map((diagnostic) => {
        const location = diagnostic.file
          ? (exampleOrigins.get(resolve(diagnostic.file.fileName)) ?? diagnostic.file.fileName)
          : "文档示例";
        return `${location}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
      })
      .join("\n"),
  );
}
console.log(
  `${pairs.length} English/Chinese page pairs, local links, and ${examples.size} TypeScript example checks passed.`,
);
