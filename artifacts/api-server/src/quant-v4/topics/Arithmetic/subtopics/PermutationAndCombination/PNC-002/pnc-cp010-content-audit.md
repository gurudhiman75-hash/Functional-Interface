# PNC-CP-010 Final English Content Audit

## Represented scope

- unrestricted distinct round-table seating;
- reference-person normalization;
- one circular pair or larger group together;
- one specified pair or larger specified group not entirely consecutive by complement;
- two blocks together, including unequal sizes;
- required pair together with another pair apart;
- two formed pair-blocks not adjacent;
- at least one, neither or exactly one of two disjoint pairs together;
- a named person between two named neighbours;
- opposite seats;
- directed immediate clockwise adjacency;
- exact, at-least and at-most clockwise gaps;
- prescribed clockwise order for three and four named people;
- equal-category alternation;
- circular non-adjacency by gap placement;
- inverse recovery for unrestricted and pair-together counts;
- rotation-only circular displays;
- reflection-equivalent distinct necklaces;
- reflection-equivalent necklaces with a specified adjacent pair;
- unrestricted proper-subset selection followed by rotation-only circular arrangement;
- unrestricted proper-subset selection followed by rotation-plus-reflection ring arrangement;
- round-table seating equivalence based on every person's unordered neighbour pair.

## Audit admissions

The initial 27-QL checkpoint left two materially distinct contracts uncovered:

1. **A larger specified group not all consecutive.** The pair-apart QL did not visibly represent the group-complement form. This became `PNC-QL-204` while reusing the same solver authority.
2. **Exactly one of two pair events.** “At least one” and “neither” do not cover the exclusive event. This became `PNC-QL-205` with a new solve mode and XOR-based independent verifier.

The final source-backed audit then found three further contracts:

3. **Choose `r` of `n`, then arrange circularly with reverse orders different.** This became `PNC-QL-206`.
4. **Choose `r` of `n` for a reversible ring with reverse orders identical.** This became `PNC-QL-207`.
5. **Identify round-table seatings by unchanged unordered neighbour sets.** This became `PNC-QL-208`.

The active checkpoint is therefore 32 QLs and 25 solve modes. The counts were discovered through ownership and gap audits rather than fixed in advance.

## Final review evidence

The 32-row generated English review confirms:

- contiguous IDs `PNC-QL-177..208`;
- all rows valid;
- exact solver and independent-enumerator agreement;
- four unique positive options with one correct answer;
- answer positions represented across all four indices;
- no exact or normalized stem duplicate groups;
- no exact or normalized explanation duplicate groups;
- no unresolved placeholders;
- no malformed TeX commands, control characters or undelimited formulas;
- QL-specific misconception traps for QLs 206–208.

## Deliberately excluded

- repeated colours or repeated bead types requiring Burnside/Pólya analysis;
- named-member, category, quota or other conditional selection followed by circular arrangement;
- circular distribution/grouping systems;
- broader mixed systems whose primary authority is CP-011 or CP-012;
- linear restrictions already owned by CP-007 or CP-008;
- ambiguous statements such as “k people between A and B” without a stated direction or arc convention;
- cosmetic contexts that reuse an existing mathematical fingerprint;
- fixed labelled-seat questions whose rotational normalization disappears;
- undirected separation variants that collapse to existing opposite-seat or directed-gap contracts after the arc convention is made precise.

Pure unrestricted selection of a proper subset followed immediately by circular equivalence is retained in CP-010. It crosses into CP-012 only when the selection layer itself contains substantive conditions.

## Verdict

`SATURATED FOR CURRENT ENGLISH OWNERSHIP AT RUNTIME-PROOF MATURITY`

No further QL is justified merely by changing nouns, values, table sizes, block sizes or wording. Localization, publication and chapter freeze remain separate stages.
