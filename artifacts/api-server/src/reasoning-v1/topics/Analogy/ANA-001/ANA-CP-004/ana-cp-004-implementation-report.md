# ANA-CP-004 Implementation Report

Status: English runtime complete in source; checked-out execution and editorial review pending.

## Delivered

- 32 QLs: `ANA-QL-109` through `ANA-QL-140`
- 16 number-set rule families
- missing-member and equivalent-set-selection modes
- deterministic seeded generation
- typed contexts and bounded integer domains
- independent solver and full-rule matching
- rejection of equal-or-simpler competing rules
- independent distractor validation
- exactly four unique options and one answer
- worked source and target explanations
- 1,600-question exhaustive audit (`32 × 50 seeds`)
- exact 64-question runtime review exporter

## Runtime commands

From the repository root:

```powershell
pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-004\ana-cp-004.test.ts
pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-004\export-review.ts
```

Expected review output:

`ANA-CP-004/ana-cp-004-runtime-review.md`

## Remaining before localization

- execute the exhaustive audit in a checked-out workspace
- inspect any rule unable to generate an ambiguity-safe instance
- inspect all 64 exact runtime samples
- tune weak set distractors or over-mechanical wording
- approve English runtime
- implement Hindi and Punjabi stems and explanations
