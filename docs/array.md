# Arrays and sets

English | [简体中文](zh-CN/array.md)

Import from `utilane`. Environment: browser / Node.js. See the [root API](api/index.md) and [array.ts](../src/array.ts).

```ts
import { intersection, difference, union, isSubsetOf } from "utilane";
intersection([1, 2], [2, 3]); // [2]
difference([1, 2], [2, 3]); // [1]
union([1, 2], [2, 3]); // [1, 2, 2, 3]; array mode preserves duplicates
isSubsetOf([1], [1, 2]); // true
```

| API                                     | Purpose                                                             |
| --------------------------------------- | ------------------------------------------------------------------- |
| `order`                                 | Sort an array by direction and optional property; see its signature |
| `intersection` / `difference` / `union` | Intersection / difference / union                                   |
| `symmetricDifference`                   | Symmetric difference                                                |
| `isSubsetOf` / `isSupersetOf`           | Subset / superset checks                                            |
| `isDisjointFrom`                        | Check whether inputs have no common elements                        |

Array inputs return arrays; Set inputs return Sets. The array overload of union concatenates without deduplication. Use Set inputs for a deduplicated union. Prefer the same container type throughout a call. Sets compare objects by reference, not by deep equality. The implementation detects native Set operations and provides fallbacks.
