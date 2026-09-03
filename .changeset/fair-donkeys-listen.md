---
"@tmrp/env": minor
---

Delegate missing and null value semantics to Zod. Missing values now reach the
configured schema as `undefined`, enabling optional and defaulted schemas, while
explicit `null` values work with nullable schemas in record-based runtimes.
