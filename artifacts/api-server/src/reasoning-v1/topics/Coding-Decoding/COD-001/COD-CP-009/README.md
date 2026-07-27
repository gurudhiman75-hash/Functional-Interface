# COD-CP-009 — Sentence and Artificial-Language Coding

Status: **16 source-backed English task-contract prototypes complete; exact-head combined saturation passed; 24 provisional solve contracts discovered; permanent QLs are not allocated**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-009-END-TO-END-DESIGN.md`
3. `COD-CP-009-QL-DISCOVERY-AUDIT.md`
4. `COD-CP-009-EXECUTABLE-GAP-RESOLUTION.md`
5. `COD-CP-009-PROTOTYPE-SATURATION-STATUS.md`
6. `COD-CP-009-MERGE-SPLIT-DECISION.md`
7. `COD-CP-009-IMPLEMENTATION-PLAN.md`

The saturation-status and merge/split documents supersede older statements that four source-backed prototypes remain unimplemented or that exact atomic topology splitting is unresolved.

## Core decision

CP-009 is implemented as a bounded constraint-satisfaction runtime over a hidden one-to-one word-token mapping. Displayed code-token order is irrelevant. Every exact, possible or impossible answer is proved against the complete mapping space reconstructed from the displayed statements.

## Executable prototype coverage

The merged prototype runtime proves 16 provisional task contracts:

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

## Merge/split result

The five exact atomic proof topologies split in each query direction because their student solve paths and explanation obligations are materially different. The other fourteen prototype contracts currently survive one-to-one.

```text
Exact atomic: 2 directions × 5 solve modes = 10
Other retained prototype contracts:             14
---------------------------------------------------
Current provisional solve-contract inventory:   24
```

Two-way versus three-way uncertainty, statement count and static renderer variations remain instance properties rather than separate solve contracts.

These remain provisional identities, not permanent QLs. CP-009 must not reserve IDs before CP-007 and CP-008 discover their final ranges.

## Combined saturation result

The combined workflow passed on head `6571e4d0a9c067f3f355d3f451089e7d9757a05d` in run `30281306137`.

It reran the solver, topology, English-language and six family-specific prototype suites, then generated 720 cross-contract questions across 30 contract/topology pairings.

The final report proves:

- 24 successful generations and 24 distinct questions per pairing;
- all five English scenarios per pairing;
- all four answer positions per pairing;
- zero bounded-generation failures;
- zero exact displayed-question collisions;
- zero normalised query-stem collisions;
- zero normalised full-explanation collisions;
- zero permanent CP-009 QLs.

The first combined attempt had identified an identical forward/inverse possible-set explanation skeleton. The explanation authority was made direction-specific, and the exact-head pass proves the correction without solver or option regression.

## Remaining work

- repeat the final concept, task, inverse, edge, representation, source-format and ownership gap audit;
- freeze the current English inventory only if no meaningful gap remains;
- complete CP-007 and CP-008 before assigning sequential CP-009 `COD-QL-*` identities;
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

Run the final CP-009 concept/source/ownership gap freeze. Do not allocate permanent QLs, expose CP-009 in Question Studio or begin localisation yet.
