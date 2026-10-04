# STA-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE ANSWER-INTEGRITY AND SIX-QL GOVERNANCE REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`STA-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure remains historical evidence. This authority records defects found only after re-auditing the already-frozen six-QL V4.1 runtime, its answer proof, and live Question Studio governance.

## Scope

- chapter: `STA-001`
- permanent QLs: `STA-QL-001..STA-QL-006`
- frozen V4.1 scenarios: **108**
- candidate authorities: **756**
- contexts per QL: **18**
- presentation profiles: **9**
- languages: English / Hindi / Punjabi
- Matrix/Games/Tournament: out of scope
- learner release: not authorized

No new permanent QL was required.

## Material defects found

### 1. Current V4.1 answer set relied on authored classification metadata

The active V4.1 runtime derived its answer set directly from each rendered candidate's authored `classification`.

The older structured oracle was not an independent proof for the current 108-scenario V4.1 authority.

Remediation authority:

`STA-001-V4-1-CANDIDATE-ORDINAL-MISCONCEPTION-PROOF-2026-10-04`

The frozen V4.1 candidate-construction contract is now redundantly proved from two independent features:

- candidate ordinal C1–C3 => required hidden dependency => `IMPLICIT`
- candidate ordinal C4–C7 => controlled distractor => `NOT_IMPLICIT`
- misconception taxonomy beginning with `REQUIRED_` must independently agree with the ordinal proof
- authored `classification` must agree with both proof channels or generation fails closed

The proof also verifies the correct option's semantic answer set for raw generated questions.

### 2. Live Question Studio needed a fail-closed proof boundary

The live `question-studio-review.ts` entrypoint now routes through a post-closure wrapper which independently verifies every generated question before returning it.

The active six-QL package remains:

- 6 permanent QLs
- multilingual frozen
- review-only
- Question Bank writes disabled
- tests/mocks/public release disabled
- automatic publication disabled

### 3. Historical freeze had to remain truthful

The original V4.1 certified `question-studio-review.ts` blob was preserved byte-for-byte under:

`v4-1-certified-snapshots/question-studio-review.ts.snapshot`

The historical V4.1 freeze lock now points to that immutable snapshot rather than weakening or re-certifying the original freeze.

Static verification on the remediated branch:

**16/16 historical V4.1 blob locks match.**

### 4. Stale four-QL current-integration assertions

The generic `question-studio-integration.test.ts` still asserted a superseded reopening-era state:

- permanent QL count = 4
- multilingual frozen = false
- QL005 not permanent

The actual live package had already been frozen at six permanent QLs with multilingual freeze enabled.

The test is now reconciled to the current six-QL contract and enforced by the freeze workflow.

Historical four-QL closeout/reopen proofs remain unchanged as historical evidence.

### 5. Brittle integration-test infrastructure

The current-state integration test also contained two non-semantic defects:

- persistence-lock assertion depended on exact error wording;
- route/admin source lookup depended on `import.meta.url` and broke after bundling.

These were replaced by semantic release-lock matching and bundle-safe source lookup.

### 6. CI workflow-policy debt

The modified freeze workflow still self-listed its own workflow file in `pull_request.paths`, which newer repository CI policy forbids.

The self-trigger was removed. The central workflow-hygiene gate now owns validation of workflow-file edits.

## Post-closure exhaustive proof

New executable gate:

`sta-001-post-closure-audit-20261004.test.ts`

Coverage:

- all **108** frozen scenarios
- all **756** candidate authorities
- all **6** permanent QLs
- all **9** presentation profiles
- English / Hindi / Punjabi

Generated learner surfaces:

- direct generated surfaces: **5,184**
- live Question Studio surfaces: **648**
- total post-closure generated surfaces: **5,832**

Candidate classification totals:

- implicit: **324**
- not implicit: **432**

Authority digest:

`52601b45e2bcaf7fbbac99e4a6faaacc8fea863bbb13b62ba05ea68a6e971ea3`

The gate proves that classification drift fails closed and that the live Question Studio wrapper verifies every returned question independently.

## Exact substantive-head validation

Substantive code head:

`62d72a4906683a8c84a93122fbe5b1a94d453d2a`

Workflow:

`Certify STA-001 V4.1 Six-QL Freeze` — run **#15**

Result: **SUCCESS**

This exact head passed:

- strict TypeScript V4.1 authority check
- immutable six-QL freeze locks
- original semantic and learner authority proofs
- post-closure independent answer proof
- frozen shared Question Studio integration
- current six-QL Question Studio regression
- production API build
- production admin app build
- freeze-boundary proof

Parallel exact-head validation also passed:

- `Validate STA-001 Exam Realness V4.1`
- `STA-001 Post-Merge Continuity Guard`
- Reasoning current-head status
- global Reasoning reconciliation
- branch topology
- CI workflow hygiene

## Final disposition

```text
semantic breadth:                         CLOSED — NO NEW QL REQUIRED
permanent QLs:                            6
scenario authorities:                    108
candidate authorities:                   756
current answer proof:                     CLOSED — INDEPENDENT ORDINAL + TAXONOMY PROOF
classification metadata drift:            FAIL_CLOSED
option semantic answer integrity:          CLOSED
EN/HI/PA learner surfaces:                CLOSED
Question Studio current six-QL contract:  CLOSED
historical V4.1 freeze preservation:      CLOSED — 16/16 LOCKS MATCH
production API:                           PASS
production admin app:                     PASS
Question Bank writes:                     LOCKED
test/mock/public release:                 LOCKED
automatic publication:                   LOCKED
post-closure deep-audit status:           CLOSED
```

Reopen STA-001 only for a newly evidenced recurring exam family not representable by the six permanent QLs, an answer-proof regression, an editorial/localization regression, a permanent audit-gate failure, or a separately approved release transition.
