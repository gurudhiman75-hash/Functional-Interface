# SEA-001 CP-003 Circular Facing-Centre Evidence

## Scope delivered

- four authoritative blueprint candidates `SEA-PBA-009` through `SEA-PBA-012`;
- centre-facing circular topology with clockwise seat indexing;
- left = clockwise and right = anticlockwise semantics;
- wrap-around and directional arc counting;
- rotation-class canonicalisation when no external marker exists;
- explicit landmark symmetry breaking for entrance, stage or door variants;
- even-seat opposite relations and hard odd-seat prohibition;
- hidden-state-first typed clue generation;
- authority-coverage clues plus removal-audited essential clue core;
- production backtracking solver and independently coded seat-filling oracle;
- four-child caselets with distinct answer-determining facts;
- balanced answer positions by child position;
- method-derived misconception options and question-specific explanations;
- text and SVG solved-circle diagrams;
- deterministic review export in JSON, CSV and HTML.

## Proof result

```text
PASS_SEA_001_CP003_CIRCULAR_FOUNDATION
named blueprint authorities 4
generated deterministic caselets 500
generated child questions 2000
odd-seat guarded caselets 154
landmark-anchored caselets 125
deterministic replay checks 20
permanent QLs 0
```

The proof additionally covers rotation metamorphism, landmark rotation breaking, clockwise and anticlockwise wrap-around, centre-facing left/right, even opposite seats, odd opposite rejection, required 6/8/10 reachability, guarded odd reachability, blueprint-specific clue contracts, semantic option uniqueness, child-query diversity, essential-clue removal checks and lifecycle locks.

## Authority note

The V3 authority lists 6, 8 and 10 as standard CP-003 sizes and separately requires odd-N variants without opposite clues. The implementation retains both instructions by keeping `SEA-PBA-009` even-only and allowing 7/9 discovery cases for the other three blueprints under a structural no-opposite guard.

## Deliberately open gates

- final exam-source audit and landmark-source sign-off;
- Wave 4 independent model-oracle abstraction and broader metamorphic suite;
- parent/child Question Studio schema;
- CP-002, CP-004 and CP-005;
- package saturation and English manual review;
- merge/split, inverse and gap audits;
- permanent QL allocation;
- Hindi and Punjabi parity;
- Question Bank, mock-test and public activation.
