# TMW-CP-001 English Editorial Review

**Checkpoint:** `TMW-CP-001 — Fundamental Work–Rate–Time Mapping`  
**Review set:** 60 generated rows, three deterministic seeds per QL  
**QL range:** `TMW-QL-001`–`TMW-QL-020`  
**Review date:** 26 July 2026  
**Verdict:** English freeze candidate after corrections

## Review method

The generated Question Studio-style export was inspected row by row for:

- SSC/Banking/Punjab exam-like wording;
- whether every workload was fully specified;
- actor/action/context consistency;
- option realism and answer-unit consistency;
- formula relevance;
- whether every worked step used only visible or explicitly derived information;
- conclusion naturalness;
- repeated or generic explanation language.

## Defects found in the first green export

Automated structural checks were green, but manual review found material editorial weaknesses:

1. Completion-time stems sometimes said that an operator could “complete pages/files/applications” without defining a fixed workload.
2. Equal-time comparison questions could pair a clerk with an unrelated machine or team.
3. Discrete-output questions could offer fractional cartons, parcels or bottles as distractors.
4. Fraction-of-work options could exceed the whole assignment.
5. Time-block conversion answers were rendered as “per 2 hours” instead of as output completed in the requested period.
6. Conclusions repeated the generic phrase “is required” rather than closing in the question’s context.
7. One-day-work explanations repeated the same reciprocal expression without identifying the completion time first.
8. Rate-increase/reduction explanations exposed arbitrary hidden work totals and rates that were not stated in the question.
9. Several comparison conclusions used generic labels such as “worker or unit.”

## Corrections applied

- Added a validated `jobPhrase` for every scenario, such as “a typing assignment” or “a fixed batch of applications.”
- Added same-context peer actors for comparisons.
- Restricted indivisible output options to whole numbers.
- Restricted work-fraction options to values not exceeding one and percentage options to values not exceeding 100.
- Classified time-block conversion as an output answer and rendered it as “12 booklets,” with the requested duration retained in the stem and conclusion.
- Added solve-mode-specific contextual conclusions.
- Rewrote reciprocal worked steps as `T → r = 1/T`.
- Reworked percentage rate-change solutions directly from the visible time and rate multiplier:

  \[
  t_{new}=\frac{t_{old}}{1\pm p/100}
  \]

- Added runtime-proof guards against incomplete workload phrases, generic conclusions and inadmissible fraction/count options.

## Post-correction evidence

Local strict execution after correction:

- 20 QLs;
- 50 proof seeds per QL;
- 1,000 deterministic cases;
- all four correct positions represented;
- 619 distinct rendered stems;
- structural audit: 240 cases;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed MathJax delimiter groups: 0;
- option-contract failures: 0;
- exact and normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicate groups: 0.

Exact-head GitHub Actions:

- head: `f1512a995cd7bc71d5f8d5592443fc7dcb17acec`;
- workflow: `Validate TMW-CP-001 runtime proof`;
- run: `30186644576`;
- result: PASS;
- evidence artifact: `tmw-cp001-runtime-proof` (`8627235868`).

## Remaining boundary

This review freezes only the current English QL/runtime ownership for CP-001. It does not:

- publish any generated question;
- route the runtime into Question Studio;
- approve any instance into the Question Bank;
- assemble tests;
- expose questions to students;
- localise Hindi or Punjabi;
- declare the full TMW-001 chapter complete.

## Final verdict

`TMW-CP-001` is **SATURATED FOR CURRENT ENGLISH OWNERSHIP AT RUNTIME-PROOF MATURITY**.

The checkpoint is ready to merge into the TMW-001 chapter base while remaining non-publishable.
