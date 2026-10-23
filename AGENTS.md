# Repository maintenance rules

This repository is Utilane, a TypeScript ESM utility library for browsers and Node.js.

## Read first

Read README.md, docs/index.md, the relevant guides, API references, and source. English is the default documentation language. Chinese counterparts live in root *.zh-CN.md files and docs/zh-CN/.

## Public entries and environments

- src/index.ts → utilane: common tools and Web Crypto.
- src/browser.ts → utilane/browser: DOM, Storage, themes, clipboard, and web tools.
- src/node.ts → utilane/node: Node Crypto, files, and child processes.
- Do not invent subpaths such as utilane/date. Keep Node built-ins out of the root entry.
- Root hash returns a Promise; Node hash is synchronous with different arguments.
- Supporting declarations and parent classes in API references are not necessarily public exports.

## Editing rules

- Preserve ESM, named exports, and tree-shaking. Keep sideEffects: false accurate; initialization effects require corresponding metadata updates.
- Write source TSDoc / JSDoc in Chinese: purpose, arguments, defaults, results, errors, and examples. Keep identifiers and standard tags unchanged.
- Contributors and AI agents write and maintain all Markdown guides and API references directly, including docs/api/ and docs/zh-CN/api/. There is no Markdown generation command or separate English description mapping.
- tsdown generates JavaScript and distributed .d.ts files. Do not hand-edit or commit lib/.
- Keep reciprocal language links and update English and Chinese pages together.
- Utilane is a new standalone package; do not add predecessor-package migration instructions.
- Base32 must follow RFC 4648 and pass strict decoding tests. Do not silently change Base62 alphabets or formats.
- Do not modify unrelated user work. Do not guess GitHub URLs, release history, or publication status. Push or publish only with user authorization.

## Required workflow for public API changes

Adding, changing, renaming, or removing a public function, class, method, or type includes documentation in the same task. Do not wait for a separate reminder.

1. Inspect source and both language documents. Implement the API and update its public entry when necessary.
2. Write or update Chinese source comments, including defaults, units, boundaries, results, errors, and a realistic example.
3. Directly update both entry API references in docs/api/ and docs/zh-CN/api/: export tables, descriptions, signatures, overloads, and affected supporting types. Check them against source and the built .d.ts files. Remove obsolete declarations and descriptions when removing APIs.
4. Update the English module guide in docs/ and Chinese guide in docs/zh-CN/. Explain use cases, actual imports, arguments, defaults, results, errors, and standalone examples. New modules need both guides, reciprocal links, both documentation indexes, and llms.txt entries. Update READMEs when quick-start instructions change.
5. Update both changelogs and relevant behavior tests. Prefer meaningful boundary and error checks over tests that mirror trivial implementation.
6. Run npm run format after edits, then npm run lint, npm run format:check, npm run typecheck, npm test, and npm run docs:check. Fix failures before declaring completion. Report any check that could not run.
7. Review code, comments, guides, and API references for semantic consistency in both languages. Summarize these updates and validation in the final response.

All prose and translations are authored by contributors or AI agents. The checker never writes or translates Markdown and does not verify API reference freshness or translation accuracy; reviewing those is the agent's responsibility.

## Documentation validation

npm run docs:check builds current JS and .d.ts files, then checks local file links, reciprocal language pairs, and standalone ts code blocks. Use ts fences for executable examples with real public imports. Use typescript fences for declaration references or fragments that are not standalone examples.

The checker does not execute examples, check remote URLs or Markdown anchors, prove translation equivalence, or compare reference signatures to source. Browser examples must state when client execution is required. Do not claim unexecuted examples are runtime-verified.

Oxlint checks source, scripts, tests, and the build config using .oxlintrc.json. Oxfmt formats supported repository files using .oxfmtrc.json; ignore dependencies, lib, and the generated pnpm lockfile. Keep two-space indentation, double quotes, semicolons, and LF line endings. Review lint fixes rather than applying unsafe automatic fixes.

Before release, inspect package contents with npm pack --dry-run. The prepack hook runs lint, format checks, type checks, tests/build, and the read-only documentation checker. sideEffects: false does not mean all functions are free of effects when called.
