# INE-CP-004 — Complementary and Either-Or Conclusions

INE-CP-004 proves complementary/either-or conclusions from the relation domain permitted by the displayed statements. It does not accept pairs through symbol matching alone.

## Provisional authorities

| Authority                         | Learner task                                                                   | Profile                |
| --------------------------------- | ------------------------------------------------------------------------------ | ---------------------- |
| `CLASSIFY_COMPLEMENTARY_PAIR`     | Decide whether a pair is valid either-or, incomplete, or overlapping           | Guided concept         |
| `IDENTIFY_COMPLEMENTARY_PAIR`     | Select the only pair that is individually uncertain, exclusive, and exhaustive | Guided concept         |
| `RESOLVE_EITHER_OR_CONCLUSIONS`   | Solve the four-option two-conclusion exam format                               | Banking mock prototype |
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
- all twelve topologies include formal complementary evidence;
- the longer Banking structures contain up to five displayed relations;
- reversal forms are generated and checked canonically;
- options have explicit misconception ownership;
- every generated question has exactly four unique answer options;
- explanations show individual non-definiteness, mutual exclusivity, and joint exhaustiveness;
- exam-facing stems and mock solutions use concise source-shaped language;
- mock assembly must mix CP-004 records with CP-003 non-complementary outcomes to prevent answer-category leakage;
- source-ledger IDs are attached to every authority;
- permanent QLs and Question Studio visibility remain disabled.

## Exam boundary

The two conclusion-mask authorities are Banking mock prototypes under the product's four-option rule. The guided classification authorities teach the same reasoning but are not labelled as SSC or Banking mock questions. CP-004 must not be published as a standalone mock set because every valid CP-004 mock answer contains an either-or result.
