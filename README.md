# Utilane

English | [简体中文](README.zh-CN.md)

[GitHub](https://github.com/DvShu/utilane) · [Issues](https://github.com/DvShu/utilane/issues)

A TypeScript / JavaScript ESM utility library for browsers and Node.js, with type declarations, named imports, and tree-shaking support.

## Installation

```sh
npm install utilane
# or pnpm add utilane
```

## Quick start

```ts
import { isBlank, format, Base32 } from "utilane";

isBlank("  "); // true
format(new Date(2026, 9, 23), "yyyy-mm-dd"); // "2026-10-23"
const codec = new Base32();
codec.encode("hello"); // "NBSWY3DP"
codec.decode("NBSWY3DP"); // "hello"
```

These docs describe Utilane. See the [changelog](CHANGELOG.md) for release information.

## Entry points

| Import path       | Tools                                                                             | Environment                                                                       |
| ----------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `utilane`         | Strings, numbers, arrays, dates, colors, IDs, Base codecs, Web Crypto, validation | Browser / Node.js; individual APIs require the corresponding runtime capabilities |
| `utilane/browser` | DOM, clipboard, Storage, themes, forms, URLs, debounce and throttle               | Browser                                                                           |
| `utilane/node`    | Node Crypto, files, child processes                                               | Node.js                                                                           |

Each entry exports its own tools. The browser and Node entries do not re-export the root entry. Paths such as `utilane/date` and `utilane/src/*` are not public exports.

```ts
import { debounce } from "utilane/browser";
const save = debounce(() => console.log("save"), 300);
save();
save.cancel();
```

```ts
import { hash } from "utilane/node";
const digest = hash("hello"); // Synchronous SHA-256 hex string
```

The root `hash` returns a Promise and accepts different arguments. See the [crypto guide](docs/crypto.md).

## Runtime and bundling

The package ships ESM targeting ES2020. APIs may require BigInt, TextEncoder / TextDecoder, and Web Crypto. Root crypto functions need `crypto.subtle`; in browsers this normally requires a secure context. Call DOM and Storage functions only on the client, including in SSR applications. There is no separate CommonJS build; examples use `import`.

Use named imports with a production bundler that supports tree-shaking. The package declares `sideEffects: false`. Passing the whole module namespace elsewhere or dynamically enumerating its exports can retain all tools. Classes generally retain their methods and relevant parent methods. Loading ESM directly at runtime does not perform tree-shaking.

## Documentation

- [English documentation and API reference](docs/index.md)
- [中文文档](docs/zh-CN/index.md)
- [Contributing and releasing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- AI reading index: [llms.txt](llms.txt); repository maintenance rules: [AGENTS.md](AGENTS.md)

## Development

Recommended development setup: Node.js 22.18+ or newer and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm docs:check
```

Sources live in `src/`; tsdown builds JavaScript and .d.ts files into `lib/`. Contributors and AI agents directly maintain all English and Chinese Markdown guides and API references. `pnpm docs:check` builds the package and validates local links, language pairs, and standalone TypeScript examples without rewriting documentation.

Before publishing, run `npm pack --dry-run`. The prepack hook runs lint, formatting checks, type checks, tests (including a build), and documentation checks. Use `pnpm format` to format files and `pnpm lint:fix` for safe lint fixes. See the contribution guide for the release workflow.

## Base encoding

Base32 follows RFC 4648 with the standard alphabet, required `=` padding, and strict decoding. Strings use UTF-8. Integers are encoded as their shortest big-endian byte sequence (zero is one zero byte). Base62 uses the alphabet `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`. See the [Base codec guide](docs/base-codec.md) for details.

## License

[MIT](LICENSE)
