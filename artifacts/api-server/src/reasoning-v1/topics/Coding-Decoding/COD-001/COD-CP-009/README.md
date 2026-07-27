# COD-CP-009 — Sentence and Artificial-Language Coding

Status: **all 16 currently admitted source-backed task contracts have executable English prototypes; permanent QLs are not allocated; final combined saturation and merge/split audits remain open**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-009-END-TO-END-DESIGN.md`
3. `COD-CP-009-QL-DISCOVERY-AUDIT.md`
4. `COD-CP-009-EXECUTABLE-GAP-RESOLUTION.md`
5. `COD-CP-009-PROTOTYPE-SATURATION-STATUS.md`
6. `COD-CP-009-IMPLEMENTATION-PLAN.md`

The saturation-status document supersedes older statements that four source-backed prototypes remain unimplemented.

## Core decision

CP-009 is implemented as a bounded constraint-satisfaction runtime over a hidden one-to-one word-token mapping. Displayed code-token order is irrelevant. Every exact, possible or impossible answer is proved against the complete mapping space reconstructed from the displayed statements.

## Executable prototype coverage

The merged prototype runtime now proves 16 provisional task contracts:

1. exact word to code token;
2. exact code token to word;
3. exact invariant word set to code-token set;
4. exact invariant code-token set to word set;
5. missing code token;
6. missing word;
7. possible code token for a word;
8. possible word for a code token;
9. impossible code token for a word;
10. impossible word for a code token;
11. possible code-token set for a word pair;
12. possible word pair for a code-token set;
13. exact resolved word set to code-token set;
14. exact resolved code-token set to word set;
15. complete possible-code candidate set for one word;
16. complete possible-word candidate set for one code token.

The runtime covers ten proven topology families, including direct, chained, difference, forked, global-bijection, two-way and three-way uncertainty, invariant ambiguous sets, missing-member completion and independently resolved component composition.

These are prototype contracts, not permanent QLs. Counts and IDs remain open until the combined sixteen-contract audit, final solve-mode merge/split audit and final source/ownership gap audit pass.

## Remaining work

- audit all sixteen contracts together for collisions, duplication, yield and editorial concentration;
- freeze the final task-contract and solve-mode inventory;
- decide which topology distinctions remain metadata and which require separate QLs;
- wait for CP-007 and CP-008 allocation before assigning sequential CP-009 `COD-QL-*` identities;
- implement the frozen English runtime and review corpus;
- complete Hindi and Punjabi only after English ownership freezes;
- keep Question Studio and publication routing disabled until all gates pass.

## Explicit exclusions

- Data Sufficiency wrappers;
- positional token-order coding;
- operator substitution;
- conditional table coding;
- renaming entities;
- free-form sentence generation;
- impossible phrase/set contracts without direct source evidence.

## Next action

Run the combined sixteen-contract saturation and merge/split audit. Do not allocate permanent QLs, expose CP-009 in Question Studio or begin localisation yet.
