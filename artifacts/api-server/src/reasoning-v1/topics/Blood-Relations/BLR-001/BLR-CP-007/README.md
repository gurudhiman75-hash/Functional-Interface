# BLR-CP-007 — Coded Relation Construction

Status: **V4 Wave 3 final English corpus is an executable product-owner review candidate; human approval, English freeze, localisation, activation, release and merge remain locked**.

## Permanent QLs

- `BLR-QL-031 — SELECT_CODED_EXPRESSION`
- `BLR-QL-032 — COMPLETE_MISSING_CODE_TOKEN`
- `BLR-QL-033 — COMPLETE_ORDERED_CODE_TOKEN_PAIR`
- `BLR-QL-034 — COMPLETE_MISSING_PERSON`
- `BLR-QL-035 — SELECT_CODED_STATEMENT_BY_VALIDITY`

Next available Blood Relations identity: `BLR-QL-036`.

## Current learner-facing authority

```text
BLR_CP007_V4_WAVE3_FINAL_HUMAN_REVIEW_CANDIDATE
```

V1 graph-solver and permanent-identity evidence remains valid. V2 option-security evidence and V3 scenario evidence remain retained regression authorities. V4 Wave 1 and Wave 2 are superseded learner-facing review layers; their tests remain active.

## Final English inventory

```text
English records                         168
QL-031 / 032 / 033 / 034 / 035   48 / 32 / 24 / 32 / 32
Easy / Medium / Hard             48 / 104 / 16
foundation practice                      32
release candidates                      136
remediation holds                         0
Guided / Standard / Advanced     32 / 120 / 16
shared sets                              21
shared-set / standalone items       84 / 84
answer positions                  42 / 42 / 42 / 42
unique stems                            168
unique final fingerprints              168
```

## Final self-review corrections

- Missing-symbol explanations name the **direct relation represented by the blank symbol**, not the derived relation of the complete chain.
- Reverse parent/child questions include the gender evidence required for exact answers.
- All learner-facing code systems use symbols; colour words, letter/person collisions and software-style `token` wording are absent.
- Derived `BLR-QL-031` distractors vary multiple statement positions or directions and are solver-verified.
- Every `BLR-QL-033` option set varies both blank positions and contains a genuinely two-error distractor.
- `BLR-QL-034` contains 18 decisive family structures, exact relation targets, connected candidate networks and balanced P/Q/R/S answers.
- No `BLR-QL-034` correct candidate is written directly in the target relation.
- Reverse `BLR-QL-031` and `BLR-QL-032` options are rebuilt from solver-filtered relation pools so only one option satisfies the target.
- Direct `BLR-QL-035` validity questions are classified Easy; derived validity questions remain Medium or Hard according to reasoning depth.
- Displayed code keys are trimmed to the symbols actually used by the item or shared set.
- Shortcut and common-trap repetition is capped at eight exact occurrences.

## Final zero-defect evidence

```text
semantic ambiguities                         0
malformed learner explanations               0
QL-034 answer mentioned in target             0
QL-032 blank-meaning mismatches                0
learner-visible token-word occurrences         0
code/person collisions                        0
single-position derived QL-031 records         0
fixed-blank QL-033 records                     0
broad QL-034 targets                           0
disconnected QL-034 networks                  0
maximum exact shortcut repetition              8
maximum exact trap repetition                  8
maximum displayed key size                     8
average displayed key size                 5.149
QL-034 maximum statements                      9
QL-034 average statements                  6.625
```

## Final implementation files

- `cp007-editorial-v4-wave3-core.ts` — shared solver-backed remediation helpers;
- `cp007-editorial-v4-wave3-wording-core.ts` — task-specific stems and guidance;
- `cp007-editorial-v4-wave3-unique-options.ts` — reverse-option semantic uniqueness;
- `cp007-editorial-v4-wave3-ql034-compact.ts` — compact connected missing-person networks;
- `cp007-editorial-v4-wave3-ql034-secure-v2.ts` — reverse-path QL-034 scenarios without target-name shortcuts;
- `cp007-editorial-v4-wave3.ts` — complete Wave 3 bank and telemetry;
- `cp007-editorial-v4-wave3-final.ts` — final key trimming and learner-facing polish;
- `cp007-editorial-v4-wave3-final.test.ts` — complete semantic/editorial corpus contract;
- `cp007-editorial-v4-wave3-no-target-shortcut.test.ts` — QL-034 target shortcut prohibition;
- `export-cp007-editorial-v4-wave3-final-review.ts` — final JSONL, CSV, HTML and Markdown exporter.

## Lifecycle

```text
human approval:             pending
English freeze:             not granted
Hindi/Punjabi:              not started
Question Studio:            disabled
Question Bank:              NOT_STORED
mock-test product release:  disabled
public publication:         false
production staging:         disabled
merge:                      not authorised
```

## Next gate

Product-owner review of the final Wave 3 artifact. Only explicit approval may start the renewed chapter-wide English audit and manual-freeze decision. Localisation and product integration remain downstream of that freeze.
