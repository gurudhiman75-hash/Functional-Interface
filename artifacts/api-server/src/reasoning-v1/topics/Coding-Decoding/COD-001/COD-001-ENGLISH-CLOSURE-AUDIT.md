# COD-001 — English Runtime Closure Audit

Status: **executable whole-chapter audit; localisation remains open**.

## Frozen English identity

```text
Checkpoints: COD-CP-001..010
Permanent range: COD-QL-001..199
Permanent QLs: 199
```

The earlier fixed reservation of 260 QLs is not authoritative. The evidence-backed English identity ends at `COD-QL-199` unless new source evidence passes the open-discovery amendment.

## Exact executable coverage

The closure test generates every permanent QL through its real checkpoint runtime for twelve deterministic seeds, producing 2,388 questions.

It enforces:

- continuous and unique identity from `COD-QL-001` through `COD-QL-199`;
- deterministic repeat generation;
- exact QL and checkpoint ownership;
- four semantically unique options;
- exactly one marked answer and correct-index agreement;
- complete student stems and explanations;
- no unresolved placeholders or internal contract leakage;
- no exact displayed-question collision across the sampled chapter corpus;
- at least two English stem and explanation forms per QL;
- all ten checkpoints, all three difficulties and at least four renderers;
- all four answer positions with a chapter-wide max/min ratio no greater than 1.25;
- review-only release safety with Question Studio and public publication disabled.

## Multilingual audit result

The current chapter is English-only at runtime. `hi-IN` and `pa-IN` are declared in foundation types but no permanent chapter-wide Hindi or Punjabi generator is currently exposed.

Localisation must therefore be implemented in guarded groups:

1. translational checkpoints `CP-001..007` and `CP-010`, preserving Latin letters, digits and symbols while authoring Hindi/Punjabi instructions and explanations;
2. language-adapted `CP-008`, using natural locale-specific referent datasets;
3. language-adapted `CP-009`, using separately authored natural sentence datasets and grammar;
4. one final whole-chapter three-locale parity and editorial gate.

## Release boundary

English closure does not enable Question Studio, Question Bank conversion, mock-test eligibility or public routing. Multilingual review must close first.
