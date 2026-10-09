# TSD reconciliation: shared registry compatibility checkpoint

Baseline: `gurudhiman75-hash/Functional-Interface`, branch
`audit/tsd-reconcile-complete-20261004`, commit
`20e3ad3b1532da534ab7fd31c5349cf0f0e29a64`, PR #3148.

This checkpoint repairs shared Question Studio catalog failures encountered
while continuing the TSD reconciliation. It does not certify completion of the
chapter's broader editorial, object-pool, diversity or MathJax audit.

## Findings and corrections

- Legacy Quant cards expose CP IDs through `canonicalProblems`. Preserve those
  IDs when adapting cards to the unified schema.
- `PCT-ALL` is a legacy mixed-generation selector, not an executable package.
  Keep individual Percentage package registrations instead.
- Calendar's native owner is `reasoning-v1`. Omit its duplicate legacy Quant
  registration from the unified catalog; the legacy API proxy remains intact.
- Legacy cards can declare individual release gates without adopting the
  standard lifecycle. Require a stage for explicit lifecycle authorities;
  preserve strict REVIEW_ONLY and BANK_ONLY gate validation.
- Probability, Trigonometry, Punjab GK and approved COA CP012 cards contained
  standard-stage labels that contradicted their existing release authorities.
  Remove conflicting labels while preserving all existing approval authorities,
  bank/test/mock/public flags, family limits and evidence gates.
- BLR and CAE spread the standard lifecycle's `stage` field without exposing
  `lifecycleStage`. Advertise their existing REVIEW_ONLY stage explicitly.
- Preserve difficulty capabilities advertised inside legacy metadata and
  normalize lowercase Trigonometry difficulty labels.

## Validation

Local runtime: Node 24.19.0; esbuild 0.27.3. CI uses its configured Node versions
and must run again on the final pushed head.

A single bundled regression entry ran the existing proof sources together:

- `question-studio/engine-registry.test.ts`, including the new compatibility,
  ownership, capability and lifecycle regressions: PASS.
- SAP Banking, NUM-001, Average and Time & Work shared engine proofs:
  **17 tests passed, 0 failed**.
- Probability Question Studio profile proof: PASS; SSC four-option and Banking
  five-option delivery and existing family restrictions preserved.
- `tsd-current-main-closure-audit.test.ts`: PASS, **105 permanent QLs**,
  **171 registered multilingual cases + 84 locked candidate cases = 255**.
- `tsd-frozen-checkpoint-proof-suite.ts`: PASS for CP003 through CP012.
- API server `node build.mjs`: PASS.
- `git diff --check`: PASS.

## TSD authority retained

| Checkpoints | Current authority |
| --- | --- |
| CP001–CP002 | Historical authority superseded into the remodel |
| CP003–CP004 | Frozen permanent authority; outside the current unified Studio registrations |
| CP005–CP009 | Frozen content exposed for Studio review only |
| CP010–CP012 | Frozen content; Studio registration and persistence remain locked |

TSD permanent QLs remain `TSD-QL-038` through `TSD-QL-142`.
TSD Question Bank writes, test/mock delivery and public publication remain locked.
No frozen question content or object pool changed in this compatibility patch.

## Next work

Push the compatibility commit, rerun the required checks on PR #3148 and reconcile
that PR before claiming current-main closure. Continue TSD's full chapter quality
audit, including object-pool breadth and MathJax-safe learner surfaces. Banking
Number Series remains after TSD; RAP stays closed.
