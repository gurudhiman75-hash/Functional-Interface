# INE-CP-001 — Executable Discovery Status

## Current gate

- **Phase:** English executable discovery
- **Permanent QLs:** `0`
- **Frozen solve modes:** `0`
- **Question Studio visibility:** Disabled
- **Public release:** Disabled
- **Manual review:** Accepted during sequential INE-001 review; revalidated at chapter closure on 13 August 2026
- **Next authority gate:** INE-001 chapter-closure approval

## Implemented provisional authorities

| Authority                               | Prototype contract                           | Current evidence                                         |
| --------------------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| `DETERMINE_DIRECT_RELATION`             | Direct strict, equality, and inclusive edge  | Deterministic runtime and independent verification       |
| `DETERMINE_TRANSITIVE_RELATION`         | Two-link strict or mixed chain               | Strict-path composition proof                            |
| `DETERMINE_STRONGEST_DEFINITE_RELATION` | All-inclusive chain                          | Equality-preserving endpoint domain                      |
| `DETERMINE_RELATION_THROUGH_EQUALITY`   | Equality-compressed chain                    | Equality propagation and optional irrelevant evidence    |
| `DETERMINE_RELATION_OR_INDETERMINATE`   | Opposing branch                              | `LT`, `EQ`, and `GT` counter-witnesses                   |
| `EVALUATE_SINGLE_CONCLUSION`            | Definite, possible, or impossible conclusion | Model-based conclusion classification                    |
| `SELECT_VALID_CONCLUSION`               | Select the only definite conclusion          | Four independently evaluated conclusions                 |
| `SELECT_INVALID_CONCLUSION`             | Select the only non-following conclusion     | Three definite conclusions and one impossible conclusion |

All authorities remain provisional. Their names express solve ownership, not permanent QL allocation.

## Executable evidence

- foundation audit covers direct, reverse, strict, inclusive, equality, disconnected, opposing-branch, and contradiction cases;
- exhaustive three-entity audit covers 216 statement sets and 648 pair queries;
- relation runtime audit covers 500 deterministic questions across five prototype authorities;
- conclusion runtime audit covers 300 deterministic questions across three prototype authorities;
- answer positions are exactly balanced across all four positions;
- every generated instance is checked by the graph solver and bounded model enumerator;
- every distractor has an explicit misconception owner;
- canonically equivalent options are rejected even when one is written in reverse, such as `A > B` and `B < A`;
- indeterminate questions retain concrete `LT`, `EQ`, and `GT` witnesses;
- learner explanations use the displayed chain and symbolic possibilities rather than internal numeric assignments;
- the synchronized English review pack contains 32 deterministic questions, with four seeds for each of the eight authorities.

## Open source and representation work

The design’s uploaded-material pass establishes direct chains, inclusive operators, equality, no-relation cases, conclusion evaluation, and coded/linguistic extensions. Before CP-001 can close, the direct-chain source ledger still needs page-level source identities and a saturation declaration.

Representation-only differences must not create new QLs:

- letters versus names;
- query reversal;
- `>` versus reversed `<` presentation;
- statement order;
- option order;
- chain length within the same proof contract;
- surface contexts such as marks, salary, or height.

## Provisional merge/split decisions

| Candidate pair                                | Current decision                 | Reason                                                                 |
| --------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Direct relation vs transitive relation        | Keep separate provisionally      | Proof-path length and misconception behavior differ                    |
| Transitive strict vs strongest inclusive      | Keep separate                    | Answer semantics differ: exact strict relation versus inclusive domain |
| Equality propagation vs ordinary transitivity | Revisit after review             | Solver uses equality compression, but learner contract may merge       |
| Definite relation vs indeterminate relation   | Keep separate                    | Indeterminate answers require counter-witness evidence                 |
| Single-conclusion vs select-valid             | Keep separate                    | Answer contract and renderer structure differ                          |
| Select-valid vs select-invalid                | Keep as inverse provisional pair | Misconception architecture and prompt polarity differ                  |

## Explicitly deferred beyond CP-001

- multi-route and larger branched graphs: `INE-CP-002`;
- general definite/possible/impossible relation sets: `INE-CP-003`;
- complementary and either-or conclusion sets: `INE-CP-004`;
- linguistic inequality rendering: `INE-CP-005`;
- fixed coded maps: `INE-CP-006`;
- map recovery and missing operators: `INE-CP-007`;
- advanced multi-set synthesis: `INE-CP-008`.

## Closure decision

The historical merge/split questions are resolved by `chapter-closure/registry.ts`. Direct, transitive, equality, and complex connected relation tasks merge into one relation-determination candidate. Indeterminate relation tasks remain a separate candidate, selection-by-truth authorities merge under one parameterized candidate, and the single-conclusion truth classifier remains guided-only.

No permanent QL allocation has been authorized. CP-001 remains unavailable in Question Studio and public delivery until the chapter closure is accepted.
