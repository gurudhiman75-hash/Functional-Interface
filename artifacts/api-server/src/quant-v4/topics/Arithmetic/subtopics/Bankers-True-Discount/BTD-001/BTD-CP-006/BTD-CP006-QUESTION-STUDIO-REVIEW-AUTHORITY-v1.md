# BTD-001 CP006 — Question Studio Review-Only Authority v1

## Scope

This checkpoint activates the frozen English authority for `BTD-QL-001..020` inside Question Studio **for admin review generation only**.

It does not authorize Question Bank writes, test eligibility, mock-test eligibility, automatic learner publication or public release.

## Frozen upstream

- CP005 frozen English authority head: `c5463791e3bbbbe0eca5a7771d7ebb13570ab391`
- freeze version: `BTD-001-CP005-ENGLISH-FREEZE-v1`
- frozen chapter fingerprint: `63e9ea9e1199cf5f0f987482649bb8264e35607fb7701e0a4dc3b2f030480659`
- permanent QLs: `BTD-QL-001..020`
- supported Question Studio language: English only (`en`)

## Studio activation boundary

```text
status: QUESTION_STUDIO_REVIEW_ONLY
activationAuthorized: true
questionStudioDiscoverable: true
questionStudioGenerationEnabled: true
questionBankStatus: NOT_STORED
questionBankWritable: false
testEligibility: INELIGIBLE
testEligible: false
mockTestEligible: false
publiclyPublishable: false
automaticStudentPublication: false
contentMutationAuthorized: false
```

Question Studio may persist generated packages only into the generation-run review workspace (`generation_runs`, `generation_run_items`, `generation_item_versions`). The route rejects any BTD package whose downstream lifecycle locks are not all closed.

## Routing

The package is exposed as `BTD-001` under Quantitative Aptitude → Arithmetic → Banker's Discount & True Discount.

Selectors supported:
- package/pattern: `BTD-001` / `BTD`
- checkpoints: `BTD-CP-001`, `BTD-CP-002`
- direct permanent QL: `BTD-QL-001..020`
- English language only
- Easy / Medium / Hard Studio filtering

Difficulty is routing metadata only and does not mutate frozen content:
- Easy: 4 direct core QLs
- Medium: 13 inverse/relationship QLs
- Hard: 3 relation-square / two-bill-system QLs

## Integration architecture

`shared-generation-engine-btd.ts` extends the actual stack-local CP014 aggregate. BTD is additive: it must preserve all pre-BTD package IDs and add exactly one `BTD-001` package.

`admin-question-studio-btd.ts` is mounted before the CP014 router in the canonical Question Studio route registry so its aggregate `/capabilities` response includes prior packages plus BTD, while non-BTD POST requests fall through unchanged.

## Validation

The validation workflow first re-proves the complete CP005 English freeze, then runs the CP006 Studio audit.

Initial exact-head validation on `38264a72828da08e39c06934da6008ecac263b39`:
- CP005 4,000-question freeze re-proof: PASS
- CP006 Studio questions: 2,000 (`20 QLs × 100 seeds`)
- frozen-content equality checks: 10,000
- frozen fingerprint checks: 2,000
- deterministic Studio replay checks: 2,000
- option checks: 8,000
- explanation checks: 10,000
- lifecycle checks: 22,000
- JSON checks: 4,000
- unique Studio question IDs: 2,000
- answer positions: `506 / 487 / 482 / 525`
- difficulty inventory: `Easy 4 / Medium 13 / Hard 3`
- pre-BTD Question Studio packages: 36
- aggregate packages after BTD: 37
- canonical route mount: PASS
- API server build: PASS
- exact-head assertion: PASS

Workflow run: `33228469609`; job: `99036714173`; artifact: `9707671425`; artifact SHA256: `a44db91408fd3e0766709d0c3a5e0ec144ef356a6b96d2a1feb33a8a803772af`.

A final exact-head run must pass after this authority record is committed before CP006 is treated as closure-ready.
