# BLR-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE QUESTION-STUDIO MAPPING AND LIFECYCLE REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`BLR-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure remains historical evidence.

## Scope

- chapter: `BLR-001`
- permanent QLs: `BLR-QL-001..BLR-QL-035`
- `BLR-QL-036`: remains unallocated
- checkpoints: CP001..CP007
- languages: English / Hindi / Punjabi
- Matrix/Games/Tournament: out of scope
- no new permanent QL required

## Answer architecture

BLR already had strong independent semantic authorities.

For graph-backed relation questions, `foundation/graph-closure.ts` reconstructs a family graph from structured clues and derives the queried relation from the shortest unambiguous supported relation path.

CP006 and CP007 frozen coded-relation banks independently preserve exactly-one reviewed answer proofs and frozen learner-facing authorities.

The post-closure audit therefore did not replace source solvers. It hardened the final frozen-source -> standard Question Studio mapping boundary.

## Material defect found

### Lower-level standard integration exposed persistence as allowed

`question-studio-standard-integration.ts` returned:

`persistenceAllowed: true`

even though every generated question simultaneously declared:

- Question Bank not stored / not writable;
- test ineligible;
- mock ineligible;
- public release locked;
- automatic publication false;
- review-only/manual approval required.

This was not harmless metadata: the lower-level standard integration is directly reachable through the shared generation engine.

Remediation:

`persistenceAllowed` is now **false** at the lower-level boundary as well as the chapter-level adapter.

## Post-closure mapping proof

New authority:

`BLR_001_FROZEN_SOURCE_TO_STANDARD_MAPPING_PROOF_2026_10_04`

The final mapping fails closed unless:

- the frozen source contains exactly four unique learner options;
- the source correct index is valid;
- when source option-proof details are present, exactly one option is semantically correct;
- that semantic correct option is located at the source correct index;
- option text/order is preserved by the standard adapter;
- mapped `correct` / `correctIndex` preserves the source key;
- mapped answer text preserves the frozen source answer;
- the standard adapter does not weaken current review-only lifecycle locks.

A mutation test deliberately changes the final mapped correct index and requires rejection.

## CP007 future-approval boundary

CP007 retains `releaseEligibleAfterApproval: true` as a future transition capability only.

Current state remains explicitly locked:

- persistence false;
- Question Bank writable false;
- test eligible false;
- mock eligible false;
- public/student delivery false;
- automatic publication false.

This audit does not constitute that separate approval.

## Executable post-closure audit

New gate:

`blr-001-post-closure-audit-20261004.test.ts`

Coverage:

- all **35** permanent QLs;
- all **3** languages;
- **840** lower-level frozen-source -> standard integration surfaces;
- **210** chapter-level `BLR-001` adapter surfaces;
- **1,050 total mapped surfaces**;
- deterministic multi-seed generation;
- CP007 lifecycle boundary;
- mapping mutation rejection.

Semantic digest:

`c35add228d3339251fd439e0e07ce6fb053a8ffa1727bfba339aa1ab47e89141`

## Exact substantive-head validation

Substantive code head:

`ae477d22e364e946084b52f4f01e2e2c959f4663`

Workflow:

`Validate CAE BLR Question Studio routes` — run **#90**

Result: **SUCCESS**

This head passed:

- shared CAE/BLR standard route regression;
- 1,050-surface BLR post-closure mapping audit;
- production API build.

Shared Reasoning current-head status, global reconciliation, branch topology and CI hygiene were also green during the pass.

## Final disposition

```text
semantic QL breadth:                    CLOSED — 35 PERMANENT QLS
BLR-QL-036:                             UNALLOCATED
graph/frozen source answer authority:   CLOSED / INDEPENDENT
final standard mapping integrity:       CLOSED — FAIL_CLOSED
lower-level persistence boundary:       LOCKED
EN/HI/PA:                               CLOSED
Question Studio chapter adapter:        CLOSED
CP007 future approval marker:           PRESERVED, NOT ACTIVATED
Question Bank writable:                 false
test/mock eligible:                     false
public/student delivery:                false
automatic publication:                  false
production API build:                   PASS
post-closure deep-audit status:         CLOSED
```

Reopen BLR-001 only for a newly evidenced recurring family-relation learner operation not representable by the 35 permanent QLs, a graph/frozen-answer regression, a mapping/lifecycle regression, an editorial/localization regression, a permanent audit-gate failure, or a separately approved release transition.
