# CLS-CP-004 — Hindi/Punjabi Localisation Audit

Status: `LOCALIZED_REVIEW_REQUIRED`

CP004 owns one permanent learner contract, `CLS-QL-007`: identify the displayed number whose conventional number property differs from the others.

## Localisation model

The English runtime remains authoritative for the complete mathematical state. The native runtime only changes learner-facing language.

Preserved exactly across locales:

- QL and prototype identity;
- intended rule and common rule value;
- displayed numbers and option order;
- correct answer and answer index;
- ambiguity proof;
- generated-instance difficulty and difficulty features;
- four/five-option profile.

Native text covers all admitted CP004 number-property rules, including divisibility, parity, primality, squares/cubes, divisor count, digit composition/sum/product, palindrome, near-power and triangular-number forms.

## Explanation standard

The learner explanation is intentionally compact:

1. state the common property;
2. show why the outlier differs;
3. state the answer.

Forced shortcut and common-trap blocks are empty on this learner review surface. Option-level evidence remains available in the structured question object for QA, but it is not dumped into the Markdown reviewer pack.

## Executable review gate

The gate sweeps 2,000 canonical seeds in both Hindi and Punjabi (4,000 localized questions total) and requires:

- deterministic replay;
- exact English-state parity;
- all admitted rules represented;
- Easy/Medium/Hard represented;
- four- and five-option forms represented;
- answer/option uniqueness unchanged;
- Hindi/Punjabi script present;
- no English instructional leakage;
- no internal QL/rule implementation leakage;
- no shortcut/trap boilerplate;
- downstream lifecycle locks unchanged.

The review exporter selects two questions per rule per locale, producing 88 editorial review questions.

## Lifecycle

`LOCALIZED_REVIEW_REQUIRED` is not a multilingual freeze. No Question Studio, Question Bank, test/mock, student or public-release gate is opened here.
