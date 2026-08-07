# MAL-CP-004 — Solution-First English V2 Review Candidate

## Purpose

The first `MAL-CP-004` English release was mathematically sound, but its learner-facing explanation was unnecessarily crowded. It forced a concept heading, a step-by-step heading, a shortcut, a verification, a repeated conclusion and three detailed option analyses into nearly every question.

Product-owner review also identified repeated numerical review cases, awkward generated contexts, ambiguous fraction notation, weak distractors and an imbalanced review sample.

## Final V2 learner contract

The default learner view now contains:

1. **Solution** — one to four number-specific lines;
2. **Answer** — the concise final value.

`More help` is collapsed by default and contains:

- one QL-specific common mistake;
- verification only for `MAL-QL-045` and `MAL-QL-047`.

The learner payload does not contain:

- a compulsory Method section;
- a separate Calculation section;
- a Fast Method or 10-Second Shortcut;
- a visible Quick Check;
- three compulsory wrong-option explanations.

Detailed option audit data remains internal for validation.

## QL-specific explanation depth

- `MAL-QL-038..040`: exactly one worked calculation line;
- `MAL-QL-041..044`: two or three direct conserved-quantity lines;
- `MAL-QL-045`: explicit one-variable evaporation equation;
- `MAL-QL-046..047`: dry-matter conservation in two or three lines.

All arithmetic uses MathJax. Ambiguous chained forms such as `1/4V` or `6/25/5` are rejected.

## Editorial remediation

V2 is an editorial overlay over the frozen mathematical runtime. It may improve:

- stem grammar and exam voice;
- context realism;
- option values and ordering;
- misconception labels;
- learner-facing explanation;
- presentation reasoning graph.

It must preserve exactly:

- permanent QLs `MAL-QL-038..047`;
- core runtime `MAL-CP004-EN-PERMANENT-RUNTIME-V1`;
- exact mathematical state;
- exact answer value and text;
- mathematical fingerprint;
- source evidence;
- difficulty, task direction and answer semantic;
- Question Studio, Question Bank, test and publication permissions.

## Numerical diversity correction

`MAL-QL-045` originally had only eight inverse-evaporation numerical cases. Four clean cases were added to the source-backed case pool, increasing it to twelve and making a ten-question duplicate-free human review possible.

The review pack now contains:

- ten questions per permanent QL;
- 100 distinct mathematical states;
- no numerical clone in the review sample;
- exactly 25 correct answers in each option position.

## Candidate identity

```text
release candidate:       MAL-CP004-EN-v2
core runtime:            MAL-CP004-EN-PERMANENT-RUNTIME-V1
presentation runtime:    MAL-CP004-EN-PRESENTATION-RUNTIME-V2
presentation contract:   MAL-CP004-EN-SOLUTION-FIRST-PRESENTATION-V2
permanent QL range:      MAL-QL-038..MAL-QL-047
languages:               English only
human review:            pending
merge:                   not authorised before review
```

## Executable evidence

```text
10 permanent QLs × 200 seeds:     2,000 questions
Deterministic repeats:             2,000
Exact mathematical parity checks:  2,000
Question Studio route checks:      2,000
Editorially improved stems:        1,503
Editorially improved option sets:  1,990
Forced Fast Method sections:           0
Learner-facing option analyses:        0
Human-review questions:              100
Distinct review mathematical states: 100
Answer positions:              25/25/25/25
Maximum visible solution:          19 words
Maximum solution length:            3 lines
```

## Lifecycle boundary

This branch remains a review candidate. Hindi and Punjabi remain excluded. The PR must remain unmerged until the regenerated 100-question English review pack is accepted by the product owner.
