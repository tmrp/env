# Contributing to `@tmrp/env`

Thanks for contributing! This project uses
[Changesets](https://github.com/changesets/changesets) to manage versioning and
publishing. The flow is fully automated — you only need to describe your change.

## Development

```bash
pnpm install        # install dependencies
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test           # unit tests (Vitest)
pnpm build          # build to dist/
pnpm test:runtime   # Node + Bun + Deno smoke tests (requires bun & deno)
```

See the [Development](README.md#development) section of the README for details.

## Adding a changeset

Any change that affects published behavior needs a changeset. After making your
change:

```bash
pnpm changeset
```

This prompts you to:

1. Pick the **bump type** — follow [semver](https://semver.org):
   - **patch** — bug fixes, internal/CI-only changes, docs in the package
   - **minor** — new, backwards-compatible features (e.g. a new runtime entry
     point)
   - **major** — breaking changes to the public API
2. Write a **summary** — this becomes the CHANGELOG entry, so write it for
   consumers of the package, not for reviewers.

It writes a markdown file under `.changeset/`. Commit it with your change.

> CI runs `changeset status` on every pull request and will flag PRs that are
> missing a changeset. If your change genuinely doesn't affect the published
> package, add an empty changeset with `pnpm changeset --empty`.

## How a release happens

Releases are automatic — **do not bump the version in `package.json` by hand.**

1. You open a PR that includes a changeset, and it gets merged to `main`.
2. The `Release` workflow opens (or updates) a **"Version Packages"** PR. That
   PR consumes the pending changesets, bumps the version, and updates
   `CHANGELOG.md`.
3. A maintainer reviews and merges the "Version Packages" PR.
4. Merging it triggers the `Release` workflow again, which **publishes to npm**
   with [provenance](https://docs.npmjs.com/generating-provenance-statements).

That's it — no manual `npm publish`, no manual version bumps, no manual
CHANGELOG edits.
