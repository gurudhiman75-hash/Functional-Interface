# NUM-CP-003 and NUM-CP-004 — English Editorial Remediation Record

## Scope

This checkpoint responds to the senior editorial review of the 153-question Number System corpus covering `NUM-QL-001..NUM-QL-045`.

The remediation is editorial only. It does not alter mathematical state, answer verification, permanent identity, solve-mode ownership or lifecycle eligibility.

## Accepted findings

The following findings are accepted and implemented:

- several student-facing stems used option-centric or engine-like wording;
- the combined review artifact flattened structured explanation arrays into dense inline paragraphs;
- data-sufficiency statements required vertical separation;
- the prime data-sufficiency sample exposed derived candidate sets instead of real mathematical evidence;
- large standalone integers in English-India prose required Indian digit grouping;
- known inline forms such as `n−1` and `n+1` required MathJax-safe review rendering;
- review explanations required a consistent four-tier presentation:
  - `📌 Core Concept`;
  - `📝 Step-by-Step Solution`;
  - `⚡ Exam Speed Shortcut`;
  - `⚠️ Common Traps & Student Warnings`.

## Audit corrections

Two audit statements are not adopted as authority:

1. `NUM-QL-010` is the complete ordered digit-pair-set authority inside `NUM-CP-003`. A remainder question such as `7^84 mod 342` does not belong to this QL and is owned by the modular-arithmetic checkpoint `NUM-CP-008`.
2. The statement that all 153 questions were independently verified as mathematically perfect is not treated as executable proof. Existing canonical/verifier parity tests remain the mathematical authority.

The explanation source models were already structured. The observed text collapse occurred in the combined review renderer, which joined arrays into inline prose. The fix is therefore applied at the review-rendering boundary while preserving structured runtime explanation fields.

## Implemented remediation

- Added one permanent-runtime English stem hardening layer for `NUM-QL-001..NUM-QL-045`.
- Replaced robotic phrases such as:
  - `For which option is ... exactly divisible?`;
  - `minimum signed integer adjustments`;
  - `built around`;
  - `reference prime`;
  - `Statement I narrows p to ...`.
- Reworked `NUM-QL-044` review stems into real inequality evidence while preserving the same verified surviving sets.
- Added multiline data-sufficiency formatting for `NUM-QL-016` and `NUM-QL-044`.
- Added locale-aware grouping for standalone five-or-more-digit English-India literals.
- Added a combined 153-question permanent review exporter with unique mathematical states.
- Added a four-tier Markdown explanation renderer with option-specific misconception diagnostics.
- Added an executable editorial audit covering:
  - corpus and QL counts;
  - banned engine wording;
  - large-number formatting;
  - option uniqueness and correct-index range;
  - data-sufficiency presentation;
  - duplicate mathematical review states;
  - difficulty presence;
  - lead-in clustering;
  - lifecycle locks.

## Lifecycle decision

The external recommendation to change the corpus to `Active Staging` is explicitly not applied.

All routes remain disabled:

```text
active: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
language: en only
```

Editorial approval is not equivalent to release approval. Hindi/Punjabi localisation, multilingual parity, Question Studio registration, Question Bank writes, test eligibility and publication remain separate downstream gates.
