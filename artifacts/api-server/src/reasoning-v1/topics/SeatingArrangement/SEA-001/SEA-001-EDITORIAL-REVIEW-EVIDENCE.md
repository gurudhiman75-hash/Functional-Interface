# SEA-001 — English / Exam-Readiness Editorial Review Evidence

Authority: **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Status: **Editorial remediation complete; signed human English review approved and English presentation frozen for the exact fingerprinted 100-caselet corpus.**

## Review scope

The balanced SEA-001 review candidate was inspected as student-facing exam content, not only as generated data:

- 100 caselets;
- 400 child questions;
- exactly 20 caselets per checkpoint;
- exactly 5 caselets per named PBA;
- CP-001 review slices include V3 QC016, QC017 and QC019;
- directions, clue wording, solved arrangements, options, answers, option rationales, child explanations and teaching explanations were included in the pass.

## Editorial findings and remediation

### 1. Correct-option explanations were too generic

The review exposed correct options whose rationale only said that the option matched the solved arrangement. The child explanation itself was specific, but the option-level explanation was not.

Remediation:

- every correct option now carries the question-specific child explanation;
- QC016/QC017/QC019 also carry relation-specific recomputation evidence and specific correct-option rationales;
- production saturation rejects any correct option whose explanation diverges from the child explanation or falls back to a generic `This matches ...` rationale.

### 2. Fallback distractors could be weak or self-referential

The review found fallback fillers whose generic rationale did not explain why the visible value was wrong. Some person/pair fallbacks could also reuse a participant explicitly named in the query, producing visibly weak options.

Remediation:

- fallback explanations are value-specific and compare the wrong visible value against the required result;
- person/pair fallbacks may not reuse a queried participant;
- generic `possible-looking` / `does not match the solved arrangement` fallback language is rejected by saturation;
- visible option text is checked for four-way uniqueness in the balanced review corpus.

### 3. Mixed-facing and explanation language needed polishing

The review exposed mechanical surface forms and overly technical teaching language.

Remediation:

- sixth/seventh/eighth relation labels use natural English words;
- option labels use `Immediately to the left/right`;
- shared puzzle solutions use plain teacher-style language;
- answer explanations and wrong-option explanations use the same plain-language standard;
- engine-style terms such as `reference person`, `orientation`, `physical adjacency`, `strictly between`, `queried seat` and similar phrases are rejected by the teaching-language proof;
- the balanced review corpus is regression-scanned for rejected wording and grammar artefacts.

### 4. PBA-020 was technically correct but too constructed

The original `SEA-PBA-020` candidate commonly exposed 10–12 clues and nearly handed out the complete clockwise order, followed by a repetitive chain of binary if/otherwise facing statements. The underlying constraints were valid, but the passage did not meet the desired exam-authenticity bar.

Remediation keeps the V3 authority intact while changing the solve composition:

- one explicit facing anchor remains;
- at least one genuine conditional-facing constraint remains;
- at least two reference-facing left/right constraints must remain;
- at least one physical cyclic-placement constraint must remain;
- the minimiser chooses only clues needed for the unique state;
- only one explicit if/otherwise facing clue is shown;
- binary-equivalent conditional links, when retained, render naturally as same/opposite-facing statements;
- PBA-020 displayed passages are capped at 9 clues;
- the proof rejects passages that still disclose almost the whole clockwise order through immediate-clockwise clues.

The regenerated balanced review examples now use 8–9 displayed clues for PBA-020 instead of the earlier 10–12 pattern.

## Automated evidence after remediation

The package gate continues to require:

- production and independent-oracle agreement;
- unique solution state/class as appropriate;
- clue necessity;
- semantic option uniqueness;
- exactly one correct option;
- answer/index alignment;
- cross-question leakage safety;
- checkpoint skill coverage;
- query-contract reachability;
- question-specific correct-option explanations;
- value-specific fallback explanations;
- plain student-facing explanation language;
- natural relation wording;
- lifecycle locks.

The focused CP-005 proof additionally exercises 400 deterministic mixed-circle caselets and requires all 100 PBA-020 cases to satisfy the diversified conditional-orientation presentation contract.

## Human review approval

The final plain-teacher 100-caselet English artifact was approved by the project owner on **2026-08-13**.

The approval record is stored in `review/approved-review.ts` and is locked to:

- 100 `ACCEPT` decisions;
- 0 `PENDING`;
- 0 `REWRITE`;
- 0 `REJECT`;
- reviewer `gurudhiman75-hash`;
- review timestamp `2026-08-13T07:56:00+05:30`;
- exact approved 100-caselet content fingerprint `e3a4bdcd5c3afb656bed4a695e50f2f4218e45907647e23d8c733feffb59ca22`;
- approved artifact SHA-256 `68972a48f078118b45fffbd69e6552b66c71a2373df741e678270de3657f29cf`.

If any caselet ID or review-content fingerprint changes, the approval record fails closed and the review must be performed again.

## Permanent allocation and freeze

After signed-review closure, the V3 merge/split result retains all 20 named PBAs as separate solve authorities. Permanent identities are therefore allocated one-to-one as `SEA-QL-001..SEA-QL-020`, with `SEA-QL-021` reserved as the next unused identity.

The permanent layer freezes:

- solve inventory: 20 retained authorities, zero merges, zero splits;
- query mix: checkpoint-owned query-contract sets and four child questions per caselet;
- English: approved `en-IN` plain-teacher presentation tied to the signed review fingerprint.

The historical discovery layer is intentionally preserved. The permanent registry/freeze is separate and inactive so the exact approved review evidence remains reproducible.

## Governance status

```text
signed 100-caselet human English review   APPROVED — 100/100 ACCEPT
permanent QL allocation                    APPLIED — SEA-QL-001..SEA-QL-020
solve-inventory freeze                     FROZEN
query-mix freeze                           FROZEN
English freeze                             FROZEN
localization                               NOT_STARTED
Question Studio registration               false
Question Bank writes                       false
mock-test eligibility                      false
public delivery                            false
permanent QLs                              20
```

Human English review, permanent allocation and the three freezes are no longer blockers. Localization and activation remain separate downstream gates. No Question Studio, Question Bank, mock-test or public-delivery flag is enabled by this freeze.
