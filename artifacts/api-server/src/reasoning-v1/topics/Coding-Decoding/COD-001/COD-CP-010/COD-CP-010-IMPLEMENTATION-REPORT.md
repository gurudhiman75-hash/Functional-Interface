# COD-CP-010 — English Runtime Implementation Report

Status: **`COD-QL-199` implemented at English runtime-proof maturity; review-only**.

## Permanent contract

```text
COD-QL-199 — APPLY_CONDITIONAL_TABLE_FORWARD
```

The runtime reuses the frozen prototype generator and independent displayed-prompt solver. It does not duplicate or weaken the audited condition logic.

## Student solve path

1. obtain the ordinary code from the displayed lookup table;
2. classify the first and last source tokens;
3. identify the one mutually exclusive condition that applies;
4. apply the stated override exactly once;
5. choose the complete resulting mixed-code sequence.

## Runtime coverage

`COD-QL-199` reaches:

- letter and digit tables;
- vowel/consonant and odd/even endpoint classification;
- all eight domain/endpoint signatures;
- constant endpoint replacement;
- endpoint-code interchange;
- copying the left endpoint code to both endpoints;
- copying the right endpoint code to both endpoints;
- class-wide vowel replacement by a designated table code;
- source lengths from five to seven tokens;
- Easy, Medium and Hard instances;
- all four answer positions.

## Validation target

The permanent audit generates 800 questions and requires:

- deterministic identity and output;
- exact parity with the frozen prototype payload;
- independent solver agreement;
- one permanent QL and no top-level prototype identity;
- four unique options with exactly one correct answer;
- misconception-labelled distractors;
- complete condition-selection explanations;
- no internal enum or placeholder leakage;
- broad complete-question diversity.

The checkpoint workflow also reruns the final discovery freeze and 800-question prototype audit before exporting a 40-question English review pack.

## Safety

```text
Locale: en-IN
Review-only: true
Question Studio visibility: false
Public publishability: false
Question Bank conversion: disabled
Mock-test eligibility: disabled
Hindi/Punjabi: not started
```
