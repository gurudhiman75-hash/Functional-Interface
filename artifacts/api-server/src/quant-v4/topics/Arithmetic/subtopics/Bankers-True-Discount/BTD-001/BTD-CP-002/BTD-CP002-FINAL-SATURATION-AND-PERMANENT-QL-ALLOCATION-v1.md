# BTD-CP-002 — Final Source Saturation and Permanent-QL Allocation v1

Status: **source-saturation green; permanent semantic IDs allocated; content delivery still locked**  
Chapter: `BTD-001 — Banker's Discount / True Discount`  
Parent discovery authority: `BTD-CP-001`

## Closure basis

The exact-head CP002 v2 audit validated 11 new source-backed inverse/system families in addition to the 9 CP001 discovery families.

Validated source-saturation head: `49b1f4c0b1a0e52450efa3ca4c6ec8d20b5e8c5d`  
Workflow run: `33226244494`  
Job: `99030464580`  
Artifact: `9706957199`  
Artifact SHA256: `1574eeae2e49ced724fa0f14f74f7294b2447a564801bb4042277e396da2b342`

Hard results:

- 11 CP002 candidates × 150 seeds = 1,650 generated questions;
- 11 fixed source regressions passed;
- 3,300 solver/verifier checks passed;
- 8,250 option checks passed;
- 8,250 explanation checks passed;
- 11,550 lifecycle checks passed;
- 3,300 JSON checks passed;
- 0 exact cross-candidate stem collisions;
- all four answer positions exercised;
- minimum required unique states per new authority = 60;
- observed unique-state counts = `130 / 148 / 122 / 148 / 106 / 146 / 140 / 136 / 147 / 80 / 88`;
- API server build passed;
- exact-head assertion passed.

## Merge/split verdict

All 20 source-backed semantic signatures survive as separate permanent authorities because each changes the given/unknown contract, answer semantic, system topology, or source-backed inverse relation. Mere wording, context, currency, and presentation variation remain parameters and do not create QLs.

## Permanent inventory

```text
BTD-QL-001  face value + rate + time -> present worth
BTD-QL-002  face value + rate + time -> true discount
BTD-QL-003  face value + rate + time -> banker's discount
BTD-QL-004  face value + rate + time -> banker's gain
BTD-QL-005  face value + true discount -> banker's discount
BTD-QL-006  BD:TD ratio + known time -> annual rate
BTD-QL-007  banker's gain + rate + time -> present worth
BTD-QL-008  bill date + term + discount date + rate -> banker's discount, including grace days
BTD-QL-009  BD:TD ratio + R = kT relation -> annual rate
BTD-QL-010  present worth + banker's gain -> true discount
BTD-QL-011  two bills: total face + two terms + common rate + total BD -> face-value difference
BTD-QL-012  banker's discount + true discount -> face value
BTD-QL-013  banker's discount + rate + time -> true discount
BTD-QL-014  BD:TD ratio + annual rate -> time
BTD-QL-015  banker's gain + rate + time -> true discount
BTD-QL-016  present worth + true discount -> banker's discount
BTD-QL-017  present worth + true discount -> banker's gain
BTD-QL-018  BD on one face = TD on another, same rate/time -> time
BTD-QL-019  banker's discount + true discount + time -> annual rate
BTD-QL-020  true discount + rate + time -> banker's discount
```

Next free permanent ID: `BTD-QL-021`.

## Explicit non-QL variants

These stay inside the above QLs as parameters/presentation variants:

- bill / trade bill / promissory note / merchant story contexts;
- rupee values, paise-safe values, and equivalent currency wording;
- direct statement versus exam-style prose;
- reordered givens with the same mathematical unknown;
- equivalent year/month expression of the same term;
- asking which of two recovered face values is larger when the same two-bill system is otherwise unchanged.

## Held / rejected without source-backed distinction

No permanent QL is created merely because an algebraic rearrangement is possible. Unsourced higher-order multi-bill systems, arbitrary three-equation constructions, trivial identity restatements, and cosmetic variants remain held until independent competitive-exam evidence justifies a distinct contract.

## Lifecycle boundary

Permanent identity allocation does **not** imply delivery readiness:

```text
permanentQlAllocationAuthorized: true
contentFreezeStatus: REVIEW_LOCKED
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
mockTestEligible: false
publiclyPublishable: false
```

The next checkpoint should build/freeze production-grade generators for these permanent QLs and only then consider Question Studio review integration.
