# CAL-001 — Post-Closure Deep Audit

Status: **CLOSED — INDEPENDENT ANSWER PROOF AND BANK_ONLY LIFECYCLE RECONCILIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`CAL-001-FINAL-DEEP-AUDIT-CLOSURE-20260927.md`

The September closure and earlier Question Studio completion records remain immutable historical evidence. This authority records defects found when the current Calendar package was re-audited against the newer standardized Question Studio lifecycle and the final answer-verification boundary.

## Scope

- chapter: `CAL-001`
- permanent QLs: `CAL-QL-001..036`
- checkpoint span: `CAL-CP-001..010`
- original provisional prototype authorities: 44
- source-gap authorities: 3
- languages: English / Hindi / Punjabi
- deterministic Gregorian arithmetic engine retained
- no new permanent QL required
- Matrix/Games/Tournament out of scope

## Material defects found

### 1. Final Question Studio projection did not itself re-run the independent verifier

The Calendar discovery layer already had a strong independent verifier for the original 44 provisional prototypes.

However, the final permanent-QL Question Studio pipeline selected a source package and projected its authored answer/options without invoking that verifier again at the final delivery boundary.

This meant answer integrity depended on earlier generator/proof assumptions rather than failing closed immediately before Question Studio output.

Remediation:

- every normal Calendar source package is now re-verified through `assertCalendarPackageIntegrity` at the final Question Studio boundary;
- the validation surface records an explicit `independent-answer-proof` gate;
- traceability records which proof authority was used.

### 2. The three source-gap prototypes lacked an equivalent independent verifier

The later source-gap authorities:

- `CAL-GAP-PROT-001` — same-date weekday recurrence
- `CAL-GAP-PROT-002` — dates of a named weekday within a month
- `CAL-GAP-PROT-003` — inclusive leap-day count

had dedicated deterministic generators but were outside the normal Calendar verifier switch.

A separate independent authority is now added:

`CAL_001_SOURCE_GAP_INDEPENDENT_PROOF_2026_10_04`

It recomputes answers from raw facts:

- recurrence by exact Gregorian day differences / weekday match;
- weekday-date set from first-day weekday and month length;
- leap-day count from inclusive Gregorian leap-year arithmetic.

The verifier also proves:

- four semantic options;
- semantic uniqueness;
- answer index alignment;
- displayed answer alignment.

Tampered normal and source-gap answers are explicitly tested to fail closed.

### 3. Calendar had three contradictory lifecycle states

Before this audit, the same chapter simultaneously exposed:

1. legacy Calendar release metadata claiming:
   - Question Bank writable
   - test eligible
   - mock-test eligible
   - publicly publishable
2. Calendar package metadata already using standardized `BANK_ONLY`;
3. the unified `reasoning-v1` adapter forcing Calendar to `REVIEW_ONLY`.

This was a governance defect.

## Current lifecycle

Calendar is now consistently standardized to:

`QUESTION-STUDIO-STANDARD-BANK-ONLY-V1`

Current state:

```text
lifecycle stage:                 BANK_ONLY
manual review:                   REQUIRED
Question Bank status:            READY_FOR_STORAGE
Question Bank writable:          true after approval
Question Bank acceptance mode:   BANK_ONLY
scored-test eligible:            false
mock-test eligible:              false
publicly publishable:            false
production release authorized:   false
automatic student publication:   false
```

This is not a content downgrade. It makes explicit the intended separation:

- reviewed generated items may be accepted into Question Bank;
- test/mock/public release requires a separate later lifecycle transition.

The legacy Calendar-specific route, dedicated review adapter, package capability and unified Reasoning adapter now expose the same lifecycle.

## Post-closure executable proof

New gate:

`cal-001-post-closure-audit-20261004.test.ts`

Coverage:

- all 36 permanent QLs
- English / Hindi / Punjabi
- 8 deterministic final-pipeline seeds per QL/language
- 864 final Question Studio learner surfaces
- 864 BANK_ONLY lifecycle/acceptance checks
- 224 independently verified normal-prototype samples
- 192 independently verified source-gap samples
- standard unified adapter Punjabi source-gap batch
- deliberate normal-answer tamper
- deliberate source-gap-answer tamper

Total explicitly audited/generated proof surfaces in the new gate: **1,283**.

The existing much larger Calendar foundation, editorial, multilingual, difficulty and generated-profile proofs continue to run unchanged.

## Exact substantive-head validation

Substantive head:

`7a4f770243e1f493f54bbe4a782e217767c05947`

Workflow:

`Validate CAL-001 end-to-end foundation` — run **#984**

Result: **SUCCESS**

The exact head passed:

- strict TypeScript check;
- Gregorian foundation proof;
- exam-readiness proof;
- simple-English stem proof;
- final English editorial freeze V2;
- Hindi/Punjabi human-freeze and parity proof;
- Hindi/Punjabi grammar-quality proof;
- final source-gap/permanent-identity freeze proof;
- reconciled Question Studio lifecycle proof;
- reconciled production integration proof;
- post-closure independent-answer + BANK_ONLY proof;
- deep-audit learner-surface proof;
- difficulty reachability proof;
- generated-content profile proof;
- review-pack exports.

Parallel exact-head validation also passed:

- Reasoning final current-head status;
- global Reasoning audit reconciliation;
- branch topology;
- CI workflow hygiene.

## Historical evidence

The following remain historical records and are not rewritten to pretend they were authored under the current lifecycle:

- `CAL-001-FINAL-DEEP-AUDIT-CLOSURE-20260927.md`
- `CAL-001-QUESTION-STUDIO-COMPLETION.md`
- source/freeze/editorial records from the earlier Calendar implementation.

Their older test/mock/public release wording is superseded by this post-closure BANK_ONLY authority.

## Final disposition

```text
permanent QLs:                    36
answer proof at final boundary:   CLOSED
source-gap independent proof:     CLOSED
EN/HI/PA:                         CLOSED
difficulty reachability:          CLOSED
Question Studio unified adapter:  CLOSED
Question Bank acceptance:         BANK_ONLY
test eligibility:                 LOCKED
mock eligibility:                 LOCKED
public release:                   LOCKED
automatic publication:            LOCKED
post-closure deep audit:          CLOSED
```

Reopen CAL-001 only for a new recurring Calendar solve contract not representable by the 36 permanent QLs, a verifier/generator disagreement, a localization/editorial regression, a permanent audit-gate failure, or a separately approved lifecycle transition.
