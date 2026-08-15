# NUM-CP-003 — English Editorial V2 Remediation

## Scope

This controlled review remediates the learner-facing English surface for `NUM-CP-003` while preserving the approved permanent mathematical identities `NUM-QL-001..NUM-QL-017`.

Permanent allocation, hidden-state mathematics, independent answer verification, solve-mode ownership and source evidence remain unchanged.

## Explanation contract

The learner-facing explanation is:

1. **Concept** — state the exact inference being tested in this generated question and name the governing rule(s).
2. **Solution** — show the decisive question-specific calculation/evidence.
3. **Answer** — show the exact correct option.

A Concept must not be a generic chapter label such as “use divisibility rules” or “the missing digit must satisfy all conditions.” It must identify the actual answer burden and reasoning rule. Examples:

- unique missing digit in `X572`: suffix `72` controls divisibility by `4`, while digit sum `14 + X` controls divisibility by `9`;
- ordered-pair count under divisibility by `36`: the question tests pair counting using the last-two-digit and digit-sum rules;
- boundary multiple: identify whether the least/greatest `n`-digit multiple is tested and how the boundary remainder is used;
- data sufficiency: test whether each statement alone fixes one unique digit rather than merely solving the number;
- claim checking: compare each stated divisible/not-divisible claim with the actual arithmetic fact.

Concrete arithmetic belongs in **Solution**, so Concept remains concise rather than duplicating the working.

## Editorial V2 learner model

- concise Concept → Solution → Answer;
- no forced shortcut section;
- no forced wrong-option/trap rationales;
- natural SSC/Banking learner language;
- question-specific calculations;
- MathJax-safe learner mathematics;
- 2–4 direct solution lines;
- Concept capped at 180 characters;
- old four-tier headings and internal engine identities banned.

## Self-review findings remediated

Generated-pack review found and fixed issues that mechanical answer validation would not catch well, including:

- generic Concepts that did not identify what the individual question tested;
- incomplete evidence before digit/pair counts;
- symbolic rather than substituted linked-arithmetic checks;
- a legacy false ordered-pair explanation that showed `66 ÷ 4 = 16.5` and then called the condition satisfied;
- verbose nested wording such as `Check 36: Check 4 and 9`;
- cryptic composite-rule shorthand such as `36 → 4 + 9`;
- stale fixed-suffix wording and punctuation gaps.

## Final English concept-specific evidence

Validated code head: `d16bfffd98bc910ce23a7ebc900fbcbe3b695c49`

The subsequent repository-head changes are documentation-only and do not alter the validated runtime/editorial code.

Dedicated workflow: `Validate NUM-CP-003 English Editorial V2`

- run: `31880969581`
- result: **SUCCESS**
- artifact ID: `9246008629`
- artifact SHA-256: `ca5d971fa9e0a89a1c8fa8477f8cee275adfb45540ab76dd24922c2845870bd8`

Audit coverage:

- `1,360` generated questions (`80 × 17` permanent QLs);
- `68` human-review questions (`4` per QL);
- `1,358` unique learner surfaces;
- `1,342` unique explanations;
- `0` raw-math violations;
- `0` legacy four-tier leaks;
- `0` internal identity leaks;
- retained-runtime regression PASS;
- permanent-allocation regression PASS.

## Lifecycle boundary

This remains controlled English review only:

```text
active: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```

No Question Bank, scored-test, mock-test or public release is authorized. Do not merge or localize until English human review is approved.
