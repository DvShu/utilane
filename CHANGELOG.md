# Changelog

English | [简体中文](CHANGELOG.zh-CN.md)

## Unreleased

### Fixed

- Simplified documentation maintenance: contributors and AI agents edit bilingual Markdown directly; a separate read-only checker validates documents before publishing. Removed automatic Markdown generation and the separate English description map.
- Storage get now preserves falsy stored values and defaults, consistently falls back for missing or expired data, and retains read-and-delete behavior. Added session/local Storage regression tests.
- ShortUUID now restores leading zero hex digits when decoding and encodes the nil UUID with the alphabet's first character. Added regression tests for leading zeros, custom alphabets, and 128-bit limits.
- Corrected month/year boundaries in endOf and dateOf, including leap years. Fixed year-unit matching shared with startOf and preserved years below 100. Added date boundary regression tests.

### Initial release preparation — 1.0.0

- Added Oxlint and Oxfmt configuration, lint/fix and format/check commands, and lint/format checks before publishing.

- Required AI workflow: maintain Chinese source comments and all bilingual Markdown guides and API references in the same task; validate with a read-only documentation checker.
- TypeScript / JavaScript ESM utilities for browsers and Node.js.
- Three public entry points: utilane, utilane/browser, and utilane/node.
- String, number, array, date, color, ID, crypto, validation, and browser / Node tools.
- RFC 4648 Base32 and Base62 encoding and decoding.
- Type declarations, named imports, and tree-shaking support.
- English-default documentation with complete Chinese guides and AI-maintained API references.
- AI documentation index, contribution instructions, and repository maintenance rules.
- Type checks, codec tests, bilingual documentation checks, and prepack validation.

Version 1.0.0 is prepared for the first Utilane release. Move this entry under the actual release version and date when published.
