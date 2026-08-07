# MAL-CP-004 — Clutter-Free English V2 Review Candidate

## Purpose

Human review of the released `MAL-CP-004` questions found that the mathematical content was sound but the explanation surface was unnecessarily crowded.

The V1 presentation forced all of the following into every question:

- Core Concept & Formula;
- Step-by-Step Solution;
- a separate 10-Second Exam Shortcut;
- a Quick Check;
- a repeated Final Answer;
- all three distractor analyses.

In many questions the shortcut merely repeated the calculation. The extra headings made simple questions look longer and more mechanical than necessary.

## V2 presentation contract

The default learner view now contains only:

1. **Method** — the governing relation or conserved quantity;
2. **Calculation** — the number-specific working;
3. **Answer** — the concise final value.

`More help` is collapsed by default and contains:

- why the three displayed wrong options are wrong;
- verification only for `MAL-QL-045` and `MAL-QL-047`, where the inverse reconstruction benefits from it.

No Fast Method is generated merely to fill a section. A future alternative method may be added only when it is genuinely different and shorter than the main calculation.

## Preserved authority

The remediation changes presentation only. It must preserve exactly:

- permanent QLs `MAL-QL-038..047`;
- mathematical state and fingerprint;
- stems;
- option text, values and order;
- correct option index;
- exact answer;
- source evidence;
- difficulty, task direction and answer semantic;
- reasoning graph;
- Question Studio, Question Bank, test and publication permissions.

The frozen V1 runtime remains available as the immutable comparison authority.

## Candidate identity

```text
release candidate:       MAL-CP004-EN-v2
runtime:                 MAL-CP004-EN-PERMANENT-RUNTIME-V2
presentation:            MAL-CP004-EN-CLUTTER-FREE-PRESENTATION-V2
permanent QL range:      MAL-QL-038..MAL-QL-047
languages:               English only
human review:            pending
merge:                   not authorised before review
```

## Executable review plan

```text
10 permanent QLs × 200 seeds = 2,000 V2 questions
2,000 deterministic repeats
2,000 exact V1/V2 presentation-parity checks
6,000 hidden displayed-option analyses
2,000 explicit Question Studio route checks
100 human-review questions
forced Fast Method sections: 0
```

## Lifecycle boundary

This branch is a review candidate. It does not alter the Hindi or Punjabi status and must remain unmerged until the simplified 100-question review pack is accepted.
