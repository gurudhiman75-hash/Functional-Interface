# BLR-CP-007 — Editorial V2 Remediation

Status: **executable English human-review candidate; V1 learner-facing freeze authority superseded; human approval required**.

## Identity preserved

The critical review found no defect in the five permanent solve identities or the coded-family graph solver. These remain unchanged:

```text
BLR-QL-031  SELECT_CODED_EXPRESSION
BLR-QL-032  COMPLETE_MISSING_CODE_TOKEN
BLR-QL-033  COMPLETE_ORDERED_CODE_TOKEN_PAIR
BLR-QL-034  COMPLETE_MISSING_PERSON
BLR-QL-035  SELECT_CODED_STATEMENT_BY_VALIDITY
```

`BLR-QL-036` remains unallocated.

## V1 authority boundary

`BLR_CP007_ENGLISH_DISCOVERY_FREEZE_V1` remains evidence for:

- source-prototype discovery;
- five-way permanent QL ownership;
- deterministic coded-relation parsing;
- graph-solving correctness;
- answer uniqueness;
- explicit gender evidence;
- displayed-expression parity.

It is **not** an approved learner-facing editorial, localisation or release authority. Its review pack is superseded because it contained answer-sequence leakage, generic explanations, incorrect-statement polarity defects, formatting leakage, weak missing-person candidates, impossible distractor graphs, forced explanation sections, insufficient diagram semantics and incomplete review metadata.

## V2 remediation

The V2 review runtime now provides:

- seeded Fisher-Yates option ordering with no legacy prototype answer cycle;
- separate `statementValidity` and `isCorrectAnswerForTask` fields;
- correct polarity for all valid/invalid statement tasks;
- one exact failure code and explanation for every wrong option;
- four graph-valid options for every question;
- 504 graph-valid wrong options and zero impossible-graph options;
- QL-034 candidates `P`, `Q`, `R` and `S`, each correct exactly eight times;
- natural missing-person stems containing only the decisive coded statements;
- semicolon formatting in both correct and wrong options;
- adaptive explanation modes selected from the actual reasoning route;
- labelled relation direction, highlighted query path and coded-versus-inferred diagram evidence;
- corrected accessibility summaries and mobile-responsive diagrams;
- explicit `FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED` V1 policy;
- visible ID, seed, QL, prototype, topology, target path, fingerprint, independent-solver status, uniqueness, graph/renderer status and human-review state.

The graph-friendly distractor pass deterministically replaced 29 impossible or unusable option routes in the executable bank. The exported review contains 22 option-text replacements; five first-link token dictionaries required an unused `wife` token to become `husband` so all four choices could remain graph-valid without changing the keyed father relation.

## Current executable inventory

```text
English review questions                         168
source prototypes                                 21
permanent solve authorities                        5
option analyses                                  672
correct-answer positions                41 / 45 / 42 / 40
valid wrong-option graphs                        504
invalid option graphs                              0
correct invalid-statement selections              16
valid unselected statements correctly described   48
QL-034 correct labels                    P/Q/R/S = 8 each
unique semantic fingerprints                     168
human review required                            true
```

## Remaining gates

This remediation is not a final freeze. Human review must still approve:

- exam realism and wording;
- relation-target breadth;
- difficulty calibration;
- QL-033 construction depth;
- QL-034 naturalness;
- explanation usefulness and brevity;
- diagram readability.

Only an approved immutable V2 dataset may proceed to the chapter-wide English audit, localisation, Question Studio, Question Bank, mock tests, publication or production staging.

## Lifecycle

```text
reviewOnly:                  true
questionStudioVisible:       false
questionBankEligible:        false
mockTestEligible:            false
publiclyPublishable:         false
Hindi/Punjabi localisation:  blocked
manual English freeze:       blocked
merge:                       not authorised
```
