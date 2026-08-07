# INE-CP-004 — Complementary and Either-Or Conclusions

INE-CP-004 proves complementary/either-or conclusions from the relation domain permitted by the displayed statements. It does not accept pairs through symbol matching alone.

## Provisional authorities

| Authority                         | Learner task                                                                   | Profile                |
| --------------------------------- | ------------------------------------------------------------------------------ | ---------------------- |
| `CLASSIFY_COMPLEMENTARY_PAIR`     | Decide whether a pair is valid either-or, incomplete, or overlapping           | Guided concept         |
| `IDENTIFY_COMPLEMENTARY_PAIR`     | Select the only pair that is individually uncertain, exclusive, and exhaustive | Guided concept         |
| `RESOLVE_EITHER_OR_CONCLUSIONS`   | Solve the five-mask two-conclusion Banking format                              | Banking mock prototype |
| `RESOLVE_DEFINITE_PLUS_EITHER_OR` | Combine one definite conclusion with an either-or pair                         | Banking mock prototype |

## Formal either-or contract

Two conclusions form a valid either-or pair only when:

- both concern the same pair, including canonical reversal;
- neither conclusion is definite on its own;
- both conclusions are possible;
- their satisfying relation domains do not overlap;
- their union covers every atomic relation still permitted by the statements;
- the displayed graph is consistent and has at least one valid model.

This correctly handles conditional pairs. For example, `A > B` versus `A = B` is valid only when the statements already restrict the domain to `A ≥ B`.

## Discovery safeguards

- graph and model-enumeration solvers must agree;
- all eight topologies include formal complementary evidence;
- reversal forms are generated and checked canonically;
- options have explicit misconception ownership;
- explanations show individual non-definiteness, mutual exclusivity, and joint exhaustiveness;
- source-ledger IDs are attached to every authority;
- permanent QLs and Question Studio visibility remain disabled.
