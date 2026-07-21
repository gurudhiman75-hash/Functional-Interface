# AVG-001 — CP-002 Symmetric AP Properties Implementation Report

Status: **clean implementation candidate; repository CI running on the final head.**

## Scope

- canonical problem: `AVG-CP-002`;
- stable production QL range: `AVG-QL-073–122`;
- 50 human-authored English QLs;
- 14 `findAverageOfConsecutiveSet`;
- 12 `findMiddleTermFromAverage`;
- 12 `findExtremeFromAverageAndCount`;
- 12 `findAverageOfOddOrEvenSet`;
- difficulty distribution: 22 Easy / 15 Medium / 13 Hard;
- answer types: 26 Average / 24 Member Value;
- Hindi and Punjabi localization contracts only; no runtime exposure.

## Mathematical architecture

The production runtime constructs a valid arithmetic progression from:

```txt
first term
common difference
count
last term
average
middle term(s)
requested extreme
term parity
```

Production solving uses AP symmetry. The independent verifier enumerates every generated term, recomputes the exact total and mean, then selects the requested target without using the production answer.

## Required invariants

- `last = first + (count − 1)d`;
- `average = (first + last)/2`;
- generated terms are equally spaced;
- odd/even wording matches every term;
- middle-term shortcut is used only for odd counts;
- Easy/Medium count does not exceed 15;
- all answer and option values are exact;
- no generic fallback or rejection loop exists.

## Local validation completed

- 50 QLs × 12 seeds = 600 forced AP states;
- independent enumeration agreement on every forced state;
- exact mode, difficulty, answer-type, QL-range and placeholder coverage;
- zero normalized duplicate CP-002 templates;
- 1,000-question residual QA;
- 150 explanation-quality cases;
- full deterministic 50-row editorial inspection and root-cause parity/profile correction.

## Exposure

- maturity remains `RUNTIME_PROOF`;
- `publiclyPublishable: false`;
- Average is not registered in Question Studio;
- only English runtime is permitted.

## Review state

The deterministic 50-row CP-002 review CSV is generated with `PENDING` editorial status. No product-ready or freeze-ready claim is made. The implementation remains unmerged and stacked on the CP-001 proof branch.
