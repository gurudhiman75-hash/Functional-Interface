# DIR-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE QUESTION-STUDIO MAPPING AND MULTILINGUAL INTEGRITY REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`DIR-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure remains historical evidence. This authority records the post-closure verification of the already-implemented Direction Sense chapter after its multilingual freeze and standard Question Studio registration.

## Scope

- chapter: `DIR-001`
- permanent QLs: **44**
- checkpoints: CP001–CP008
- languages: English / Hindi / Punjabi
- solver: existing coordinate/vector Direction Sense solver
- diagram policy: explanation-only
- Matrix/Games/Tournament: out of scope
- no new permanent QL required

## Material post-closure work

### 1. Final learner answer mapping is now fail-closed

New authority:

`DIR_001_SOLVER_TO_QUESTION_STUDIO_MAPPING_PROOF_2026_10_04`

The final generated surface and Question Studio mapping are now rejected unless:

- exactly four learner options exist;
- option labels are non-empty and unique;
- exactly one generated option is solver-correct;
- that option is the runtime `correctIndex`;
- the solver answer equals the semantic value carried by the correct option;
- solver verification metadata is present;
- Question Studio preserves the localized option order/content;
- Question Studio preserves the correct index and semantic answer;
- localized Hindi/Punjabi output retains answer-parity verification;
- the review-only lifecycle remains locked.

A deliberately corrupted mapped correct index is rejected by the post-closure audit.

### 2. Standard Reasoning Question Studio integration

DIR-001 is exposed through the current standard `reasoning-v1` adapter.

Current package characteristics:

- package id: `DIR-001`
- permanent QLs: **44**
- supported languages: English / Hindi / Punjabi
- supported difficulties: Easy / Medium / Hard
- deterministic generation
- QL and checkpoint selectors supported
- generated-instance difficulty filtering
- multilingual parity verification
- explanation-only diagrams
- review-only lifecycle

The adapter preserves the existing solver authority instead of recomputing answers from displayed text.

### 3. Multilingual post-closure sweep

New executable audit:

`dir-001-post-closure-audit-20261004.test.ts`

Coverage:

`44 QLs × 8 deterministic samples × 3 languages = 1,056 mapped learner surfaces`

The audit proves for every sampled QL:

- English, Hindi and Punjabi use the same numeric seed;
- Hindi/Punjabi preserve the English semantic answer;
- correct-option index parity is preserved;
- all mapped options remain unique;
- solver verification survives mapping;
- localized answer parity is asserted;
- question diagrams remain absent;
- explanation diagrams remain allowed;
- Question Bank/Test/Mock/Public/Production release remain locked.

## Existing chapter proofs preserved

The dedicated DIR runtime workflow replays:

- foundation solver proof;
- CP001;
- CP002;
- CP003;
- CP004;
- CP005;
- CP006;
- CP007;
- CP008;
- final audit review-pack proof;
- existing Question Studio integration proof;
- multilingual freeze proof;
- final closure proof;
- new 1,056-surface post-closure audit.

Dedicated English, Hindi and Punjabi chapter-corpus workflows also remain green.

## Exact substantive-head validation

Substantive head:

`8d11205aae4357d338af496b7803ffb3d81ac560`

Workflow:

`Reasoning DIR-001 Runtime` — run **#606**

Result: **SUCCESS**

The same head also passed:

- English chapter corpus
- Hindi chapter corpus
- Punjabi chapter corpus
- Reasoning current-head status
- global Reasoning audit reconciliation
- branch topology
- workflow CI hygiene

The runtime workflow additionally passed the production API build and final audit review-pack export/upload.

## Lifecycle

DIR remains review-only:

```text
Question Bank writable:           false
test eligible:                    false
mock-test eligible:               false
publicly publishable:             false
automatic publication:            false
production release authorized:    false
```

## Final disposition

```text
semantic QL breadth:                   CLOSED — 44 PERMANENT QLs
solver authority:                      CLOSED
final option/answer mapping:           CLOSED — FAIL_CLOSED
EN/HI/PA semantic parity:              CLOSED
difficulty filter integrity:           CLOSED
diagram policy:                        CLOSED — EXPLANATION ONLY
standard reasoning-v1 adapter:         REGISTERED
Question Studio lifecycle:             REVIEW_ONLY
Question Bank/Test/Mock/Public:        LOCKED
post-closure deep-audit status:         CLOSED
```

Reopen DIR-001 only for a newly evidenced recurring Direction Sense family not representable by the 44 QLs, a solver/mapping regression, a localization regression, a permanent audit-gate failure, or a separately approved release transition.
