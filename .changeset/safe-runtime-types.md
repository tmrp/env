---
"@tmrp/env": minor
---

Correct return types so they match runtime behavior. Values returned while
validation is skipped are now typed as `unknown`, because parsing, coercion,
defaults, and transforms do not run. Client-prefix filtering now types exposed
keys as parsed values and filtered server-only keys as `undefined`.
