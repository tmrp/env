---
"@tmrp/env": minor
---

Add opt-in `errorMode: "all"` to every environment creator to report all schema
validation failures together. Export `EnvValidationError` and its
`EnvValidationIssue` type for inspecting variable names, issue codes, nested
paths, and messages without attaching raw input values. The default continues to
stop at the first failure.
