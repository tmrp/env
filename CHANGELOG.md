# @tmrp/env

## 0.5.3

### Patch Changes

- [`c41c44f`](https://github.com/tmrp/env/commit/c41c44f9b4f44d2abbe921a847c10df2f5ad6404)
  Thanks [@tmrp](https://github.com/tmrp)! - Update internal dependencies

## 0.5.2

### Patch Changes

- [`bdb8081`](https://github.com/tmrp/env/commit/bdb80810484e5e6ccd12d0d4e9165753669c7ad6)
  Thanks [@tmrp](https://github.com/tmrp)! - Update internal dependencies

## 0.5.1

### Patch Changes

- [#81](https://github.com/tmrp/env/pull/81)
  [`2423f19`](https://github.com/tmrp/env/commit/2423f19305a86422d7f8d205db9a972cb5e3883d)
  Thanks [@tmrp](https://github.com/tmrp)! - Remove the fixed-scope repair offer
  from the package documentation.

## 0.5.0

### Minor Changes

- [#79](https://github.com/tmrp/env/pull/79)
  [`83ac2c0`](https://github.com/tmrp/env/commit/83ac2c07239683339ef84bb7c63f403caeff71ab)
  Thanks [@tmrp](https://github.com/tmrp)! - Correct return types so they match
  runtime behavior. Values returned while validation is skipped are now typed as
  `unknown`, because parsing, coercion, defaults, and transforms do not run.
  Client-prefix filtering now types exposed keys as parsed values and filtered
  server-only keys as `undefined`.

## 0.4.3

### Patch Changes

- [#74](https://github.com/tmrp/env/pull/74)
  [`c107898`](https://github.com/tmrp/env/commit/c1078988e6c1d7348f350dbbf8ef0a14405c2aec)
  Thanks [@tmrp](https://github.com/tmrp)! - Client prefix types now return as
  schema value or undefined

## 0.4.2

### Patch Changes

- [`3d14938`](https://github.com/tmrp/env/commit/3d1493885bf53193f868e1f6652062043efd5159)
  Thanks [@tmrp](https://github.com/tmrp)! - Update internal dependencies

## 0.4.1

### Patch Changes

- [`ab4a1c2`](https://github.com/tmrp/env/commit/ab4a1c2f87cc0ae9b2049915239648af846aef18)
  Thanks [@tmrp](https://github.com/tmrp)! - update jsdoc

## 0.4.0

### Minor Changes

- [#67](https://github.com/tmrp/env/pull/67)
  [`1aba18d`](https://github.com/tmrp/env/commit/1aba18d21bd6587c95b5c6c8bb061f2407c06e0f)
  Thanks [@tmrp](https://github.com/tmrp)! - refactor validation

## 0.3.0

### Minor Changes

- [#64](https://github.com/tmrp/env/pull/64)
  [`3aad125`](https://github.com/tmrp/env/commit/3aad125675f7c7e4160e38d2ad6654c5dea024cf)
  Thanks [@tmrp](https://github.com/tmrp)! - Avoid trimming value for variables
  that contain deliberate spaces.

## 0.2.1

### Patch Changes

- [`d3b69d3`](https://github.com/tmrp/env/commit/d3b69d3db015b650030f7e10314bfdfeb3ad4139)
  Thanks [@tmrp](https://github.com/tmrp)! - Bump minor and patch internal
  dependency versions

## 0.2.0

### Minor Changes

- [#59](https://github.com/tmrp/env/pull/59)
  [`529b9a6`](https://github.com/tmrp/env/commit/529b9a6db1f353d946889b47858fc2855b31d874)
  Thanks [@tmrp](https://github.com/tmrp)! - Make skipped-validation and
  client-filtered return types reflect their runtime values, isolate automatic
  runtime detection from malformed unrelated globals, and ignore inherited
  properties in explicit environment records.

## 0.1.9

### Patch Changes

- [#53](https://github.com/tmrp/env/pull/53)
  [`5929236`](https://github.com/tmrp/env/commit/5929236fbc17301ffcee49274a9549fd6e1d7348)
  Thanks [@dependabot](https://github.com/apps/dependabot)! - patch dependency
  versions

## 0.1.8

### Patch Changes

- [#52](https://github.com/tmrp/env/pull/52)
  [`a5baacd`](https://github.com/tmrp/env/commit/a5baacd47b393a61da54c795767553818bbb9f14)
  Thanks [@tmrp](https://github.com/tmrp)! - update project dependencies

## 0.1.7

### Patch Changes

- [#43](https://github.com/tmrp/env/pull/43)
  [`0a02479`](https://github.com/tmrp/env/commit/0a02479db54e55b77dd83ae377a6dce7a9fe719c)
  Thanks [@tmrp](https://github.com/tmrp)! - update dependencies

## 0.1.6

### Patch Changes

- [#34](https://github.com/tmrp/env/pull/34)
  [`f927339`](https://github.com/tmrp/env/commit/f9273395d0c87f097a133e9ad1e5fdd7e9b507f2)
  Thanks [@tmrp](https://github.com/tmrp)! - Internal maintenance: dependency
  updates, move to the Node.js LTS baseline, and adopt the automated Changesets
  release flow. No changes to the public API or runtime behavior.

## 0.1.4

### Patch Changes

- Move to Node.js LTS; CI updates. (Released manually; backfilled for history.)

## 0.1.3

### Patch Changes

- Dependency updates and CI updates; add SECURITY.md. (Released manually;
  backfilled for history.)

## 0.1.2

### Minor Changes

- Allow client-exposed variables via `clientPrefix`. (Released manually;
  backfilled for history.)

## 0.1.1

### Patch Changes

- 7f085f4: minor changes made to the repo

## 0.1.0

### Minor Changes

- Adds functionality for skipping zod validation
