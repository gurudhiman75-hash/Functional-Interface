# INE-CP-002 — Executable Discovery Status

## Current gate

- **Phase:** English executable discovery
- **Permanent QLs:** `0`
- **Frozen solve modes:** `0`
- **Question Studio visibility:** Disabled
- **Public release:** Disabled
- **Next authority gate:** Human review, source mapping, and merge/split decisions

## Implemented provisional authorities

| Authority                                 | Discovery ownership                                                   |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `DETERMINE_LONG_CHAIN_RELATION`           | Four-link chains with strictness and equality composition             |
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
- exported five-seed pack positions are balanced `12 / 11 / 12 / 10`, with eight distinct prototype sequences;
- undetermined answers include two learner-facing countermodels without leaking internal entity IDs;
- pair-selection explanations show the decisive path for every definite pair;
- stable record IDs, content hashes, competency, topology, clue counts, explanation mode, and review status are exported;
- deterministic English review-pack export for every authority.

## Critical-review remediation

The first remediation pass addresses the August 2026 English prototype critical review:

- removed the fixed `A, B, C, D, A` seed pattern;
- replaced the ambiguous strongest-relation contract with mutually unambiguous exam-standard options;
- separated connected-branch and disconnected-component explanations;
- added mixed sign orientation and solver-parity checks;
- diversified definite-pair outcomes across `>`, `<`, `=`, `≥`, and `≤`;
- added attached and disconnected irrelevant-clue variants with three- and four-statement forms.

Broader topology, node-count, branch-depth, and difficulty variation remains a later discovery gate rather than being treated as complete.

## Provisional merge/split questions

| Candidate authorities                                    | Current decision                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Long chain vs CP-001 transitive relation                 | Revisit after manual review; path length alone may be difficulty-only        |
| Multiple routes vs alternate strict path                 | Keep separate provisionally because strictness aggregation changes the proof |
| Branched relation vs indeterminate pair selection        | Keep separate provisionally because answer contracts differ                  |
| Irrelevant evidence vs ordinary relation solving         | Likely merge; retain only as an adversarial generation axis                  |
| Disconnected components vs CP-001 indeterminate relation | Revisit; component complexity may be difficulty-only                         |
| Equality across branches vs CP-001 equality propagation  | Revisit after explanation and source review                                  |

## Closure blockers

1. The remediated English review pack requires a new manual approval pass.
2. Page-level source mapping is unavailable because the synced project library currently contains no source files.
3. The provisional merge/split decisions above are unresolved.
4. Permanent QL allocation has not been authorized.

Until those gates close, CP-002 remains prototype-only and excluded from Question Studio and public delivery.
