# ALP-001 Editorial V2 Remediation Contract

Status: **BLOCKING — CP-001 through CP-005 are mathematically implemented but not editorially frozen.**

## Audit conclusion

The current runtime preserves correct positional logic and answer keys, but its learner-facing layer is not production-ready. The defects are structural rather than isolated copy edits:

1. explanations often restate the computed answer instead of teaching the method;
2. one generic trap warning is reused across unrelated solve modes;
3. several stems are mechanically assembled rather than exam-authentic;
4. word and alphabet transformations lack visual position tracking;
5. Hindi and Punjabi explanations leak English solver trace lines;
6. Hindi and Punjabi ordinal and agreement forms are unreliable;
7. some distractors are impossible for the question domain, such as positions greater than the supplied word length.

## Non-negotiable editorial architecture

Every generated question must expose four learner-facing blocks:

1. **Core concept** — a solve-mode-specific rule, formula or invariant;
2. **Step-by-step solution** — substituted working using the actual generated values;
3. **Exam-speed shortcut** — only when a genuine shortcut exists; never canned filler;
4. **Common trap analysis** — tied to actual displayed wrong options and their misconception labels.

The mathematical generator, exact answer, QL identity and validated transformation state must remain unchanged unless an option-domain audit proves a distractor invalid.

## English requirements

- fluent SSC/Banking/PSSSB-style stems;
- no telegraphic fragments;
- direct rank questions teach `A=1 ... Z=26` and may use EJOTY anchors where useful;
- opposite-letter questions teach the sum-27 rule;
- interval questions distinguish distance, exclusive gap and inclusive span;
- transformation questions show original order, selected segment/group, transformed order and final lookup;
- no generic trap sentence shared across unrelated solve modes;
- no impossible position distractors for bounded word questions;
- options should carry meaningful units where the answer type requires them.

## Hindi requirements

- no English prose in stems, explanation headings, steps, shortcut or trap analysis;
- correct grammatical agreement, including forms such as `24वाँ अक्षर`, `तीसरे से पाँचवें स्थान तक`, and `पहली बार आने वाला R`;
- natural exam Hindi rather than literal token-by-token translation;
- mathematical symbols and Latin alphabet letters may remain unchanged.

## Punjabi requirements

- no English prose in stems, explanation headings, steps, shortcut or trap analysis;
- correct agreement, including forms such as `24ਵਾਂ ਅੱਖਰ`, `ਤੀਜੇ ਤੋਂ ਪੰਜਵੇਂ ਅੱਖਰ ਤੱਕ`, and natural first-occurrence wording;
- everyday Punjab-exam phrasing; avoid overly technical vocabulary;
- mathematical symbols and Latin alphabet letters may remain unchanged.

## Visual tracking contracts

For sequence or word transformations, explanations must render aligned position tracks, for example:

```text
Position : 1  2  3  4  5  6
Original : M  A  R  K  E  T
Changed  : M  A  E  K  R  T
```

For grouping transformations, show the extracted groups before recombination. For unchanged-position tasks, compare original and transformed rows position by position and mark matches.

## Distractor contract

Each wrong option must:

- be valid for the answer domain;
- be generated from a named misconception;
- remain unique and non-equivalent to the correct answer;
- be explicitly analysed in the explanation using its displayed option label and value.

Examples of required misconception ownership include wrong reference end, endpoint included/excluded, off-by-one movement, pre-transform position, partial-range reversal, unstable regrouping, occurrence confusion and wrong transformation order.

## Freeze gates

ALP-001 CP-001 through CP-005 cannot be marked `FROZEN` until all gates pass:

- all 104 English QLs receive editorial-v2 rendering;
- all 104 Hindi QLs are fully localised with no English prose leaks;
- all 104 Punjabi QLs are fully localised with no English prose leaks;
- all generated explanations contain the four required blocks, except speed shortcut may be explicitly marked not applicable only where justified;
- all transformation QLs include visual tracking;
- every wrong option is domain-valid and individually explained;
- ordinal/agreement audits pass in Hindi and Punjabi;
- no canned trap sentence survives;
- no generic rule boilerplate survives;
- mathematical fingerprints and correct answers remain unchanged;
- exhaustive generated review files pass human review.

## Release boundary

Until these gates pass, the current implementation remains a mathematical runtime candidate only. It must not be treated as production-ready editorial content, and CP-006 implementation should not be used to bypass this remediation.
