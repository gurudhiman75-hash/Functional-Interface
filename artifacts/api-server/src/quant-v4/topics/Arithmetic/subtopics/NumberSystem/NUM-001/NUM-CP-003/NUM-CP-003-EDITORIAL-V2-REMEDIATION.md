# NUM-CP-003 — English Editorial V2 Remediation

## Scope

This change remediates the learner-facing English surface for `NUM-CP-003` (divisibility and missing digits) while preserving the already-approved permanent mathematical identities `NUM-QL-001..NUM-QL-017`.

The permanent allocation, hidden-state mathematics, independent answer verification, solve-mode ownership and source evidence are not changed.

## Why V2 is required

The older combined CP003/CP004 editorial layer still used a forced four-tier explanation structure:

- Main Rule;
- Step-by-Step Solution;
- Exam Speed Trick;
- Common Traps, including one rationale per wrong option.

That structure is more cluttered than the later Number System editorial standard established for CP001/CP002.

## Editorial V2 learner model

The controlled-review surface now uses only:

1. **Concept** — one short question-relevant principle;
2. **Solution** — 2 to 4 direct working lines;
3. **Answer** — the exact visible correct option.

No shortcut or trap section is forced. No internal engine terminology is exposed.

## Question-specific working

The V2 surface uses the verified CP003 hidden state and existing deterministic teacher calculations. It retains explicit working for:

- direct divisibility checks;
- one missing digit;
- two ordered missing digits;
- divisibility by 2, 3, 4, 5, 8, 9, 11 and supported composite rules;
- greatest/least n-digit multiples;
- inclusive range counts;
- repeated-block divisibility;
- linked arithmetic and divisibility constraints;
- data sufficiency;
- claim validation.

## Math rendering

Legacy `$...$` spans are normalized to `\(...\)`. Common raw learner expressions such as number templates, ordered pairs, sets, assignments and arithmetic workings are wrapped in MathJax-safe inline LaTeX.

## Executable audit

The Editorial V2 audit checks 80 deterministic seeds for each of the 17 permanent QLs (1,360 generated questions) and requires:

- 17/17 permanent QLs represented;
- concise 2–4-line solutions;
- exact answer/index agreement;
- no legacy four-tier wording;
- no internal identity leakage;
- balanced inline MathJax;
- no targeted raw-math leakage;
- at least four distinct learner surfaces and explanations per QL;
- all downstream lifecycle gates still closed.

The audit also exports a fixed 68-question human-review pack: four diverse questions per permanent QL.

## Lifecycle boundary

This is a controlled editorial review only:

```text
active: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```

No Question Bank, scored-test, mock-test or public release is authorized by this remediation.
