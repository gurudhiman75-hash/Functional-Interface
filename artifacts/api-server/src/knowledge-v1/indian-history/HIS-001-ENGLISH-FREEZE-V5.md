# HIS-001 Indian History — English Freeze V5

Status: **ENGLISH REVIEW FREEZE — CORRECTIVE V5 AUDIT GREEN**  
Lifecycle: **REVIEW_ONLY**  
Runtime registration: **DISABLED**

## Frozen authority

- Chapter: `HIS-001` Indian History
- Scope: `HIS-CP-001` through `HIS-CP-024`
- Questions: **1,434**
- Canonical facts: **1,379**
- World History: **outside this freeze**

V5 supersedes `HIS-001-ENGLISH-FREEZE-V4` as the semantic authority for new History localization work.

## V4 → V5 correction

A localization-stage review of `HIS-CP-023` found one incorrect year in the Fort William College fact and stem.

Corrected item:

- `HIS-CP023-V1-004`: Fort William College was founded by Lord Wellesley in **1800**, not 1801. Its purpose in this question remains the training of Company civil servants.

The correction is evidence-backed and changes only the year in the CP023 canonical fact and question stem. The answer, distractor identities, CP, QL, difficulty and provenance bindings remain unchanged.

## Invariants preserved

The correction does not change:

- question count or canonical-fact count;
- CP or QL identity;
- difficulty;
- source IDs or canonical fact IDs;
- correct-answer position;
- review-only lifecycle;
- any question outside CP023 Q4.

## Structural guard

The CP023 localization audit must fail if:

- CP023 Q4 does not contain the year `1800`;
- the localized Hindi or Punjabi version loses `1800`;
- the answer or correct-index binding drifts from the English authority.

## Localization rule

New localization beginning with CP023 must bind to `HIS-001-ENGLISH-FREEZE-V5` and preserve CP, QL, difficulty, provenance, option order, correct-index parity and answer semantics.

Previously approved localization remains valid because V5 changes only the CP023 English authority, which had not yet been localized or approved.

Runtime registration remains disabled until the remaining multilingual localization and final parity review are explicitly approved.
