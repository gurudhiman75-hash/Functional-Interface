# SPA-FND-001 Visual Runtime Status

## Current stage

`FOUNDATION_RUNTIME_PROOF_IMPLEMENTED_WITH_PRE_WAVE_02_SAFEGUARDS`

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
- explicit vertical, horizontal and 180-degree symmetry classification;
- accidental self-symmetry rejection for ordinary transform questions;
- pre-option collision checks across unchanged, mirror, water and 180-degree rotation candidates;
- script-aware locale contracts for glyph-based questions;
- canonical scene-based glyph authority validation, avoiding browser-font text as geometry authority;
- continuous analog-clock hour-hand modelling at 0.5 degrees per minute;
- independent mirror-clock geometry versus arithmetic-shortcut cross-check;
- explicit `DIAGRAM_ONLY` policy for water-reflected analog clocks because their reflected hand positions generally do not represent a valid real time;
- expanded review-metadata contracts for transform, symmetry, option and clock proof evidence;
- executable proof covering all safeguards above.

## Architecture decisions frozen before Wave 02

- `MIR-001` and `WAT-001` remain separate chapter packages while consuming the same shared reflection engine.
- Letter/glyph stimuli are `SCRIPT_SPECIFIC`; they are not translated by replacing English text with Hindi or Punjabi text.
- Digits, clocks and geometric scenes may localise their instructions and explanations while keeping language-neutral geometry.
- Only mirror-clock questions may use an arithmetic time shortcut, and only after it agrees with continuous hand-angle geometry.
- Water-clock questions must use diagram options and direct angle validation; no stated-time shortcut is authoritative.
- Self-symmetry classification is available as a runtime capability but remains a prototype until exam-source auditing supports a permanent checkpoint.
- Glyph fidelity mismatch is a generation rejection, not a normal learner distractor.

## Explicitly not implemented yet

- Question Studio registration;
- API or database schema changes;
- chapter QLs or permanent identities;
- production glyph corpora for Latin, Devanagari or Gurmukhi scripts;
- seeded visual generators;
- misconception distractor engines;
- explanation overlay rendering;
- paper-folding, graph-counting or cube-orientation engines;
- the 48-question proof corpus;
- Hindi or Punjabi localisation content;
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

1. Correct any exact-head CI findings from the expanded foundation proof.
2. Add deterministic seeded scene construction utilities.
3. Add solver-evidence and explanation-overlay contracts.
4. Implement initial `MIR-001` and `WAT-001` geometric proof generators separately.
5. Build canonical digit/symbol glyph authority before any glyph-string QLs.
6. Expand into the approved 48-question cross-chapter corpus only after the foundation remains deterministic and non-interfering.
