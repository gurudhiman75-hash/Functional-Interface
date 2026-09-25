# HIS-001 Indian History — English Freeze V4

Status: **ENGLISH REVIEW FREEZE — CORRECTIVE V4 AUDIT GREEN**  
Lifecycle: **REVIEW_ONLY**  
Runtime registration: **DISABLED**

## Frozen authority

- Chapter: `HIS-001` Indian History
- Scope: `HIS-CP-001` through `HIS-CP-024`
- Questions: **1,434**
- Canonical facts: **1,379**
- World History: **outside this freeze**

V4 supersedes `HIS-001-ENGLISH-FREEZE-V3` as the semantic authority for new History localization work.

## V3 → V4 correction

A localization-stage review of `HIS-CP-020` found two malformed English question specifications. Their canonical fact records and explanation notes were already correct, but the review-spec answer fields were accidentally populated with place names rather than the product or craft being tested.

Corrected questions:

- `HIS-CP020-V1-033`: Kashmir, Lahore and Agra are tested as centres of **shawl and carpet making**.
- `HIS-CP020-V1-038`: Khetri in Rajasthan is tested as a centre of **copper production**.

The two stems and distractor sets were also rewritten so each question now asks one clear exam-grade fact. In the same pass, grammar-only wording defects in CP020 Q22, Q35, Q39 and Q45 were normalized without changing their facts, answer positions, QLs or provenance.

## Invariants preserved

The correction does not change:

- question count or canonical-fact count;
- CP or QL identity;
- difficulty;
- source IDs or canonical fact IDs;
- correct-answer position;
- review-only lifecycle;
- any question outside CP020 Q33 and Q38.

## Structural guard

The chapter-wide V2 expansion audit now explicitly fails if:

- CP020 Q33 does not resolve to `Shawl and carpet making`;
- CP020 Q38 does not resolve to `Copper production`;
- either corrected answer is missing from its option set.

## Localization rule

New localization beginning with CP020 must bind to `HIS-001-ENGLISH-FREEZE-V4` and preserve CP, QL, difficulty, provenance, option order, correct-index parity and answer semantics.

Existing approved CP017–CP019 localization remains valid because V4 changes only CP020 Q33 and Q38.

Runtime registration remains disabled until the remaining multilingual localization and final parity review are explicitly approved.
