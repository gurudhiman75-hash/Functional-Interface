# PNC-002 CP-007 Implementation Report

## Checkpoint

- CP: `PNC-CP-007 — Together, Apart & Block Restrictions`
- QLs: `PNC-QL-107` through `PNC-QL-118`
- English QLs: 12
- solve modes: 6
- explanations: 12 QL-specific natural narratives
- proof cases: 12 QLs × 20 seeds = 240, each generated twice
- independent verifier: bounded full permutation enumeration for direct modes; separate bounded search for inverse modes
- formula rendering: LaTeX/MathJax delimiters in every visible equation
- publication: disabled

## Ownership safety

The checkpoint covers only linear block and block-complement reasoning. It does not implement fixed-position, relative-order, alternation or general gap-placement families owned by CP-008, nor circular blocks owned by CP-010.

## Admission rationale

The six solve modes differ in formula, evidence, validation or inverse direction. Context-only variants reuse the same mode. No fixed final QL target is implied.
