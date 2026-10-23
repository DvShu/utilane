# Documentation

English | [简体中文](zh-CN/index.md)

Start with the [README](../README.md), then choose a guide below. Release information is recorded in the [changelog](../CHANGELOG.md).

| Module                               | Guide                         | Source                                                                 | Entry point       |
| ------------------------------------ | ----------------------------- | ---------------------------------------------------------------------- | ----------------- |
| Strings, numbers, masking            | [Common utilities](common.md) | [common.ts](../src/common.ts)                                          | `utilane`         |
| Arrays and sets                      | [Arrays](array.md)            | [array.ts](../src/array.ts)                                            | `utilane`         |
| Dates                                | [Dates](date.md)              | [date.ts](../src/date.ts)                                              | `utilane`         |
| Colors                               | [Colors](color.md)            | [color.ts](../src/color.ts)                                            | `utilane`         |
| IDs                                  | [IDs](id.md)                  | [id.ts](../src/id.ts)                                                  | `utilane`         |
| Base encoding                        | [Base codecs](base-codec.md)  | [base-codec.ts](../src/base-codec.ts)                                  | `utilane`         |
| Web / Node Crypto                    | [Crypto](crypto.md)           | [crypto.ts](../src/crypto.ts), [crypto_node.ts](../src/crypto_node.ts) | See guide         |
| Validation                           | [Validator](validator.md)     | [validator.ts](../src/validator.ts)                                    | `utilane`         |
| DOM, clipboard, storage, themes, web | [Browser tools](browser.md)   | [browser.ts](../src/browser.ts)                                        | `utilane/browser` |
| Files and child processes            | [Node tools](node.md)         | [node.ts](../src/node.ts)                                              | `utilane/node`    |

## Complete API reference

- [Root API](api/index.md)
- [Browser API](api/browser.md)
- [Node.js API](api/node.md)

References list public exports, overloads, arguments, results, and supporting declarations. Contributors and AI agents maintain these Markdown files directly alongside code changes. tsdown generates the distributed .d.ts files. Review signatures against source and built declarations; the documentation checker does not compare them. Defaults and behavior are covered by guides and source comments. Supporting types and parent classes are not necessarily public exports: use the export table.

## Reading with AI

To use the library: README → this index → relevant guide → entry point API → source and tests when needed.

To modify the library, first read [AGENTS.md](../AGENTS.md) and [CONTRIBUTING.md](../CONTRIBUTING.md). Do not invent import paths or mix the two hash interfaces.
