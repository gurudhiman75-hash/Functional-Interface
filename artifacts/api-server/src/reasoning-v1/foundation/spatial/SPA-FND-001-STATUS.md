# SPA-FND-001 Visual Runtime Status

## Current stage

`FOUNDATION_RUNTIME_PROOF_IMPLEMENTED`

This package is intentionally isolated and inactive. It is not registered in Question Studio, does not allocate permanent QLs, does not write to the Question Bank and is not eligible for mock-test delivery.

## Implemented in this slice

- versioned `SpatialScene` and visual-question payload contracts;
- language-neutral line, circle, polygon, polyline and arc primitives;
- affine translation, rotation and reflection across arbitrary lines;
- vertical mirror and horizontal water-image helpers;
- orientation-safe arc transformation;
- canonical scene normalisation;
- ID/order-independent semantic fingerprints;
- equivalent-option detection;
- structural, geometry and SVG-style validation;
- deterministic sanitised SVG rendering;
- executable proof covering transformation reversibility, canonical identity, option uniqueness and renderer safety.

## Explicitly not implemented yet

- Question Studio registration;
- API or database schema changes;
- chapter QLs or permanent identities;
- seeded visual generators;
- misconception distractor engines;
- explanation overlay rendering;
- paper-folding, graph-counting or cube-orientation engines;
- the 48-question proof corpus;
- Hindi or Punjabi localisation;
- production activation.

## Validation command

```bash
pnpm install --frozen-lockfile
pnpm --dir artifacts/api-server build
mkdir -p artifacts/api-server/dist/reasoning-v1/spatial
pnpm --dir artifacts/api-server exec esbuild \
  src/reasoning-v1/tests/spatial-foundation.test.ts \
  --bundle --platform=node --format=esm \
  --outfile=dist/reasoning-v1/spatial/spatial-foundation.test.mjs
node artifacts/api-server/dist/reasoning-v1/spatial/spatial-foundation.test.mjs
```

Expected proof status:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
```

## Next controlled slice

1. Correct any exact-head CI findings.
2. Add seeded scene construction utilities.
3. Add solver-evidence and explanation-overlay contracts.
4. Implement the first Mirror/Water proof generators.
5. Expand into the approved 48-question cross-chapter corpus only after the foundation remains deterministic and non-interfering.
