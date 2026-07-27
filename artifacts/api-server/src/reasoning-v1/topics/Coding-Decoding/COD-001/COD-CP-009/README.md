# COD-CP-009 — Sentence and Artificial-Language Coding

Status: **executable prototype discovery advanced; 12 task contracts proven; four source-backed gaps remain; permanent QLs not allocated**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-009-END-TO-END-DESIGN.md`
3. `COD-CP-009-QL-DISCOVERY-AUDIT.md`
4. `COD-CP-009-EXECUTABLE-GAP-RESOLUTION.md`
5. `COD-CP-009-IMPLEMENTATION-PLAN.md`

## Core decision

CP-009 is implemented as a bounded constraint-satisfaction runtime over a hidden one-to-one word-token mapping. Displayed code-token order is irrelevant. Every exact, possible or impossible answer is proven against the complete mapping space reconstructed from displayed statements.

## Executable coverage

The merged prototype runtime now proves:

- exact word-to-token and token-to-word questions across direct, chained, difference, forked and global-bijection modes;
- exact invariant phrase/token sets and their inverse;
- missing word and missing code-token presentations;
- possible atomic word/token relationships;
- impossible atomic word/token relationships;
- possible mixed word/token sets;
- two-way and three-way partial-information solution spaces;
- complete dual-solver agreement, row minimality and natural English language parity.

These are prototype contracts, not permanent QLs. Counts and IDs remain open until the final source-backed gaps and merge/split audits pass.

## Remaining source-backed gaps

- exact new phrase/set composed from independently resolved components, plus inverse;
- complete candidate-set answers such as `either X or Y`, plus inverse.

Impossible phrase/set questions are not retained without direct source evidence.

## Explicit exclusions

- Data Sufficiency wrappers;
- positional token-order coding;
- operator substitution;
- conditional table coding;
- renaming entities;
- free-form sentence generation.

## Next action

Implement the four remaining source-backed prototypes. Do not allocate permanent QLs, expose CP-009 in Question Studio or begin localisation yet.
