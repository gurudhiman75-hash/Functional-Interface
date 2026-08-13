# INE-CP-002 — Executable Discovery Status

## Current gate

- **Phase:** English executable discovery
- **Permanent QLs:** `0`
- **Frozen solve modes:** `0`
- **Question Studio visibility:** Disabled
- **Public release:** Disabled
- **Manual review:** Accepted during sequential INE-001 review; revalidated at chapter closure on 13 August 2026
- **Next authority gate:** INE-001 chapter-closure approval

## Implemented provisional authorities

| Authority                                 | Discovery ownership                                                   |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `DETERMINE_LONG_CHAIN_RELATION`           | Two- to four-link chains with strictness and equality composition     |
| `DETERMINE_MULTI_ROUTE_RELATION`          | Two independently valid routes connecting the same pair               |
| `APPLY_ALTERNATE_PATH_STRICTNESS`         | Inclusive direct evidence strengthened by a strict alternate path     |
| `DETERMINE_BRANCHED_GRAPH_RELATION`       | Querying sibling terms on a branched graph                            |
| `FILTER_IRRELEVANT_STATEMENTS`            | Solving from the relevant component while ignoring unrelated evidence |
| `IDENTIFY_PAIR_WITH_DEFINITE_RELATION`    | Selecting the only candidate pair with a fixed relation               |
| `IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION` | Selecting the only candidate pair whose order remains open            |
| `DETERMINE_DISCONNECTED_PAIR_RELATION`    | Querying across two non-trivial disconnected components               |
| `PROPAGATE_EQUALITY_ACROSS_BRANCHES`      | Equality compression across a hub with outgoing branches              |

All authorities remain provisional. Graph shape alone does not justify a permanent QL split.

## Executable evidence

- 180 deterministic audit questions across nine authorities;
- exactly balanced correct-answer positions: 45 in each of four positions;
- all six relation outcomes covered: `>`, `<`, `=`, `≥`, `≤`, and indeterminate;
- 40 pair-selection audit questions;
- 40 indeterminate-relation audit questions;
- every relation and candidate pair checked by the graph solver and independent bounded model enumerator;
- option text verified against stored mathematical semantics;
- exam-standard relation options have exactly one necessarily true answer;
- all five source operators (`>`, `<`, `=`, `≥`, `≤`) are rendered and orientation reversal is parity-tested;
- answer placement uses independently seeded, balanced four-question permutation blocks;
- the synchronized review pack contains four seeds per authority and 36 records;
- undetermined answers include two learner-facing countermodels without leaking internal entity IDs;
- pair-selection explanations show the decisive path for every definite pair;
- stable record IDs, content hashes, competency, topology, clue counts, explanation mode, and review status are exported;
- the synchronized four-seed review pack contains 29 canonical graph fingerprints across 36 records;
- 31 named topologies span three to five nodes and two to six statements;
- calibrated difficulty coverage contains 9 easy, 14 medium, and 13 hard review records;
- standard relation explanations use a short path/interpretation/conclusion structure, while pair-selection records retain a full pair audit;
- every record exports separate concise mock and detailed learning solutions;
- release-tier metadata separates `SSC_STANDARD_MOCK`, `BANKING_PRELIMS`, and `ADVANCED_PRACTICE` from difficulty;
- hard pair audits reject direct exposure of the correct pair and require a path of at least two statements;
- multi-route records reject any source statement that directly contains the queried pair;
- empty proof text and `: , so ...` route defects are rejected by runtime validation and mutation tests;
- distractors expose auditable misconception roles, including direction, strictness, equality, common-bound, disconnected-pair, and definite-path errors;
- deterministic English review-pack export for every authority.

## Critical-review remediation

The remediation passes address the August 2026 English prototype reviews:

- removed the fixed `A, B, C, D, A` seed pattern;
- replaced the ambiguous strongest-relation contract with mutually unambiguous exam-standard options;
- separated connected-branch and disconnected-component explanations;
- added mixed sign orientation and solver-parity checks;
- diversified definite-pair outcomes across `>`, `<`, `=`, `≥`, and `≤`;
- added attached and disconnected irrelevant-clue variants;
- varied statement counts, node counts, chain length, branch depth, equality placement, component shape, and route length;
- added canonical graph-fingerprint diversity gates and explicit difficulty bases;
- repaired equality-path rendering for pair audits and removed all direct-answer hard pair constructions;
- corrected pair-audit topology labels and added dual-solution and release-tier contracts.

Further corpus-scale expansion remains appropriate after the nine provisional authorities are merged or split into final QLs; it is not a blocker for the next manual prototype review.

## Provisional merge/split questions

| Candidate authorities                                    | Current decision                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Long chain vs CP-001 transitive relation                 | Revisit after manual review; path length alone may be difficulty-only        |
| Multiple routes vs alternate strict path                 | Keep separate provisionally because strictness aggregation changes the proof |
| Branched relation vs indeterminate pair selection        | Keep separate provisionally because answer contracts differ                  |
| Irrelevant evidence vs ordinary relation solving         | Likely merge; retain only as an adversarial generation axis                  |
| Disconnected components vs CP-001 indeterminate relation | Revisit; component complexity may be difficulty-only                         |
| Equality across branches vs CP-001 equality propagation  | Revisit after explanation and source review                                  |

## Closure decision

The historical merge/split questions are resolved by `chapter-closure/registry.ts`. Connected relation tasks merge with CP-001 relation determination; disconnected relation tasks merge with the indeterminate-relation candidate; pair-selection tasks share a separate parameterized candidate.

Permanent QL allocation has not been authorized. CP-002 remains excluded from Question Studio and public delivery until the chapter closure is accepted.
