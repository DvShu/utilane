# 数组与集合

[English](../array.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js。签名见[根入口 API](api/index.md)，实现见 [array.ts](../../src/array.ts)。

```ts
import { intersection, difference, union, isSubsetOf } from "utilane";
intersection([1, 2], [2, 3]); // [2]
difference([1, 2], [2, 3]); // [1]
union([1, 2], [2, 3]); // [1, 2, 2, 3]，数组模式保留重复项
isSubsetOf([1], [1, 2]); // true
```

| API                                     | 用途                                         |
| --------------------------------------- | -------------------------------------------- |
| `order`                                 | 数组排序，支持属性和排序方向，参数见类型声明 |
| `intersection` / `difference` / `union` | 交集 / 差集 / 并集                           |
| `symmetricDifference`                   | 对称差集                                     |
| `isSubsetOf` / `isSupersetOf`           | 子集 / 超集判断                              |
| `isDisjointFrom`                        | 是否没有共同元素                             |

集合运算支持数组和 Set 重载；数组输入得到数组，Set 输入得到 Set。union 的数组模式直接拼接、不去重；需要去重并集时使用 Set 输入。建议一次调用使用同种容器。Set 使用值比较规则，对象按引用比较，不做深比较。实现包含原生 Set 运算能力检测与回退。
