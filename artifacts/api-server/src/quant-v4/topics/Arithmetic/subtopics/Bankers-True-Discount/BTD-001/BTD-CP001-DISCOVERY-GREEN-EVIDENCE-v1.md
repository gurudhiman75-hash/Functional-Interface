# BTD-001 / BTD-CP-001 Discovery Green Evidence v1

## Scope

This evidence record belongs to the separate `BTD-001` Banker’s Discount / True Discount discovery package. It does not reopen or extend `INT-001`.

## Official source authority

- Authority ID: `OFFICIAL-GPSC-GOA-JSO-BATCH8-2026-Q27`
- Publisher: Goa Public Service Commission
- Exam: Prescreening test of Junior Scale Officer of Goa Civil Service Batch 8
- Exam code: `GPSC092025018`
- Exam date: `2026-06-14`
- Question: Q27
- Source semantic: `BD:TD = 6:5` together with annual rate numerically `5 ×` the bill term in years
- Official answer: `10%`

## Validated implementation snapshot

The breadth-remediated nine-prototype implementation passed the dedicated exact-head discovery gate on commit:

`e149881c9db0440b5d9224548aeec8d2b58a3ebb`

GitHub Actions evidence:

- workflow: `Validate BTD-001 CP001 Source-Bound Discovery V1`
- run: `33185840310`
- job: `98898501575`
- audit: `BTD-001-CP001-BREADTH-REMEDIATION-AUDIT-v5`
- packaging: `BTD-001-CP001-BREADTH-REMEDIATION-v6`
- artifact ID: `9691737283`
- artifact SHA256: `a451c955fd1fa39c75fe8932806a4b0fabb96f044565201feff5d98ebf01be58`

All dedicated job steps passed, including the discovery audit, API-server build, exact-head assertion and evidence upload.

## Audit results

- prototypes: **9**
- deterministic seeds per prototype: **200**
- generated discovery questions: **1,800**
- deterministic replay checks: **1,800**
- solver/verifier checks: **3,600**
- option checks: **9,000**
- explanation checks: **7,200**
- lifecycle checks: **12,600**
- JSON checks: **3,600**
- bill-date grace checks: **400**
- formula identity checks: **600**
- exact cross-prototype learner-stem collisions: **0**
- answer positions: **463 / 463 / 430 / 444**
- option-safe remediated packages: **28 / 1,800 = 1.56%**
- maximum packaging attempts observed: **3**
- maximum allowed: **8**

Unique mathematical states by prototype:

- `BTD-PROT-001`: 134
- `BTD-PROT-002`: 124
- `BTD-PROT-003`: 131
- `BTD-PROT-004`: 138
- `BTD-PROT-005`: 123
- `BTD-PROT-006`: 153
- `BTD-PROT-007`: 123
- `BTD-PROT-008`: 169
- `BTD-PROT-009`: 94

The required floor is **70 unique mathematical states per prototype**. No threshold was reduced during remediation.

## Discovery defects caught and remediated

1. `BTD-PROT-007`: rare paise-safe distractor exhaustion. Fixed with deterministic, bounded option-safe state selection.
2. `BTD-PROT-006`: correlated selector produced only 29 unique states. Replaced with an explicit 360-state pool selected by SHA-256.
3. `BTD-PROT-009`: correlated selector produced only 58 unique states. Replaced with an explicit 120-state pool selected by SHA-256.
4. `BTD-PROT-009`: low-rate misconception options could collide. Replaced with a wider exact integer-rate misconception pool without reseeding the canonical state.

## Workflow hygiene remediation

After the green implementation run, the central workflow-hygiene guard identified CI-definition issues in the BTD validator. The workflow was corrected to:

- target `New-main` explicitly;
- remain path-scoped to the `BTD-001` package;
- use concurrency with `cancel-in-progress: true`;
- stop listing its own workflow YAML in `pull_request.paths`.

This evidence-file commit intentionally changes the BTD package path so the corrected workflow performs a fresh exact-head validation of the final branch state.

## Lifecycle boundary

The discovery result does **not** allocate permanent BTD question-language identities and does not open learner delivery.

```text
permanentQlAllocationAuthorized: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
mockTestEligible: false
publiclyPublishable: false
```

A final-head green result authorizes progression to source-saturation / allocation design only. Permanent allocation and Question Studio activation remain separate decisions.
