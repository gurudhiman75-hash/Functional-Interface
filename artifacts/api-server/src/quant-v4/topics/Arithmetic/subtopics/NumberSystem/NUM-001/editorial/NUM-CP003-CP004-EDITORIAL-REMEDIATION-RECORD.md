# NUM-CP-003 and NUM-CP-004 — English Editorial Remediation Record

## Scope

This record covers the 153-question Number System corpus across `NUM-QL-001..NUM-QL-045`:

- `NUM-CP-003`: 69 questions;
- `NUM-CP-004`: 84 questions.

The mathematical state, canonical answers, independent verifiers, permanent QL identities and solve-mode ownership remain unchanged.

## V1 remediation completed

The first editorial pass delivered:

- natural exam-style stems instead of option-centric or engine-like wording;
- vertically separated data-sufficiency statements;
- real mathematical evidence in `NUM-QL-044`;
- English-India number grouping;
- MathJax-safe rendering for common expressions;
- the four-tier explanation layout:
  - `📌 Core Concept`;
  - `📝 Step-by-Step Solution`;
  - `⚡ Exam Speed Shortcut`;
  - `⚠️ Common Traps & Student Warnings`;
- a combined 153-question review exporter;
- executable editorial and lifecycle audits.

## V2 findings accepted

The senior V2 audit identified three remaining issues. All are accepted:

1. Some divisibility explanations still jumped from the possible digit range to the final valid value without showing the rule calculation.
2. A few explanation lines used formal phrases such as `Compute or infer`, `Exact testing leaves`, `admissible domain`, `cardinality` and `remainder status`.
3. The Markdown review export marked the correct option with `**✓**`, even though the underlying JSON question options did not contain that marker.

## V2 remediation implemented

### Transparent calculations

`NUM-QL-002..NUM-QL-010` now build the step-by-step solution directly from the verified hidden state.

The explanation shows the actual rule used, including:

- digit-sum calculations for divisibility by 3 and 9;
- last-digit checks for divisibility by 2 and 5;
- last-two-digit checks for divisibility by 4 and 25;
- last-three-digit checks for divisibility by 8;
- alternating-sum calculations for divisibility by 11;
- factor-rule breakdowns for 6, 12, 18, 24, 36 and 45;
- the completed number for each surviving digit or ordered pair;
- exact division used as the final verification.

The explanation no longer hides the working behind phrases such as `Exact testing leaves the valid set`.

### Simpler teacher voice

Student-facing explanations replace formal engine language with plain instructions such as:

- `Find` instead of `Compute or infer`;
- `possible digits` instead of `admissible domain`;
- `number of pairs` instead of `cardinality`;
- direct remainder wording instead of `remainder status`.

### Option safety

Answer markers are now stripped by the exporter before any option is written to JSON, CSV or Markdown.

The Markdown review no longer places a checkmark beside the correct option. The answer appears only in the separate editorial answer line.

## Staging lifecycle decision

The product owner has now explicitly approved this corpus for staging.

The combined review corpus is therefore marked:

```text
environment: STAGING
status: ACTIVE_STAGING
active: true
stagingReviewEligible: true
questionStudioStagingDiscoverable: true
language: en
```

This approval is limited to staging review. Production routes remain off:

```text
production.questionStudioDiscoverable: false
production.questionBankWritable: false
production.testEligible: false
production.publiclyPublishable: false
```

Hindi/Punjabi localisation, production Question Bank writes, live-test eligibility and public publication remain separate downstream gates.

## Executable proof requirements

The V2 audit must prove:

- 153 total questions across all 45 permanent QLs;
- 69 questions from `NUM-CP-003` and 84 from `NUM-CP-004`;
- explicit calculation evidence in every review item from `NUM-QL-002..NUM-QL-010`;
- no banned formal explanation phrases;
- no answer marker inside any option;
- Active Staging metadata present;
- every production route still disabled;
- all existing Number System regressions remain green.
