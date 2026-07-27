# OPS-001 Foundation Pilot

This directory contains the executable shared foundation for `OPS-001 — Mathematical Operations and Symbol Substitution`.

## Status

```text
FOUNDATION_PILOT = IMPLEMENTED
PERMANENT_QL_ALLOCATION = NOT_STARTED
PRODUCTION_EXPOSURE = DISABLED
```

## Modules

- `types.ts` — typed display tokens, semantic tokens, ASTs, mappings, traces and rejection codes.
- `exact-rational.ts` — exact `bigint` rational arithmetic and finite-decimal parsing.
- `tokenizer.ts` — source-aware expression tokenisation and canonical rendering.
- `transformations.ts` — supplied mappings and simultaneous operator, number and digit transformations.
- `parser.ts` — precedence-aware arithmetic/relation AST parser and semantic fingerprints.
- `evaluator.ts` — exact AST and relation evaluation.
- `solver.ts` — repair enumeration and hidden-mapping inference.
- `index.ts` — foundation exports.
- `ops-foundation.test.ts` — executable contract proof.

## Run the proof

From `artifacts/api-server`:

```bash
pnpm exec tsc \
  --noEmit \
  --target es2022 \
  --module esnext \
  --moduleResolution bundler \
  --allowSyntheticDefaultImports \
  --strictNullChecks \
  --noImplicitAny \
  --noImplicitReturns \
  --noFallthroughCasesInSwitch \
  --skipLibCheck \
  --types node \
  $(find src/reasoning-v1/topics/Mathematical-Operations/OPS-001/foundation -name '*.ts' -print)

pnpm dlx tsx ./src/reasoning-v1/topics/Mathematical-Operations/OPS-001/foundation/ops-foundation.test.ts
```

The same commands run through `.github/workflows/ops-001-foundation-pilot.yml`.

## Design constraints

- Transform typed tokens before parsing.
- Use exact arithmetic only.
- Apply every swap simultaneously within its identity domain.
- Reparse every candidate from the original expression.
- Distinguish whole-number and digit swaps.
- Reject leading-zero digit transformations.
- Rediscover relation boundaries after transformation.
- Require complete eligible-pool uniqueness before accepting a generated question.

The foundation is local to OPS-001 until another chapter demonstrates the same stable reuse requirement.
