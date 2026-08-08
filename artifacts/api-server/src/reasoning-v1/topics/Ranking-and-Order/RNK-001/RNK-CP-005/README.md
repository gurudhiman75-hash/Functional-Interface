# RNK-CP-005 — Presentation-led and Shared Ranking Sets

Status: **English discovery frozen at `RNK-QL-036..043`; activation remains disabled.**

## Ownership

CP-005 owns ranking questions whose defining burden is a reusable shared presentation rather than a new rank formula. One evidence block is reconstructed once and then supports linked questions.

Included presentations:

- rank tables;
- ordered ledgers;
- comparison-clue passages;
- rows and queues;
- merit lists and interview shortlists;
- race results and performance orders.

Excluded:

- standalone one-person arithmetic, owned by CP-001;
- two-position arithmetic, owned by CP-002;
- interchange or movement, owned by CP-003;
- standalone explicit-order questions, owned by CP-004;
- attribute calculation, owned by CP-006;
- incomplete or non-unique partial orders, owned by CP-007;
- advanced mixed transformations, owned by CP-008.

## Permanent authorities

```text
RNK-QL-036  shared-set endpoint entity
RNK-QL-037  shared-set entity at requested position
RNK-QL-038  shared-set rank of a named entity
RNK-QL-039  shared-set relative order of a named pair
RNK-QL-040  shared-set exact rank gap
RNK-QL-041  shared-set immediate neighbour
RNK-QL-042  shared-set complete order
RNK-QL-043  shared-set definitely true statement
```

## Shared-set contract

Every set contains:

- stable `sharedSetId` and seed;
- one context family;
- one presentation mode and renderer class;
- six to eight unique entities;
- complete displayed evidence;
- a unique independently reconstructed order;
- one shared-passage fingerprint reused by all linked authority questions.

The runtime exposes eight possible authority questions per set. Product assembly should normally select four, preserving the same shared passage and avoiding repeated reconstruction work for the learner.

## Presentation modes

| Mode | Renderer | Evidence contract |
|---|---|---|
| `RANK_TABLE` | `STRUCTURED_TABLE` | shuffled entity/rank rows |
| `ORDER_LEDGER` | `ORDERED_LEDGER` | start-to-end ordered rows |
| `COMPARISON_CLUES` | `STRUCTURED_TEXT` | complete adjacent comparison chain |

## Permanent runtime

```text
runtime version:       RNK_CP005_PERMANENT_RUNTIME_V1
freeze version:        RNK_CP005_ENGLISH_DISCOVERY_FREEZE_V1
permanent QLs:         RNK-QL-036..043
questions per QL:      192
permanent questions:   1,536
shared sets:           192
projection SHA-256:    3fcc8981c4eb66b04cc455605da5d2f89a29555a48a7c17bd2e3d51403fa2c29
```

Coverage:

```text
ROW:                    256
QUEUE:                  256
MERIT_LIST:             256
RACE_FINISH:            256
INTERVIEW_SHORTLIST:    256
PERFORMANCE_ORDER:      256

RANK_TABLE:             528
ORDER_LEDGER:           528
COMPARISON_CLUES:       480

Easy:                   132
Medium:               1,284
Hard:                   120
```

Each QL has exact `48/48/48/48` answer-position balance. Permanent-gate review found zero duplicate mathematical fingerprints.

## English review pack

The representative review pack contains 144 questions:

- 18 per authority;
- all six contexts;
- all three presentation modes;
- all four option positions;
- complete option-specific explanations;
- no internal identifier leakage.

## Learner explanation contract

Every explanation:

1. identifies the common rank-line direction;
2. reconstructs the shared order once;
3. answers the exact linked query;
4. gives an exam-speed instruction to reuse the same line;
5. analyses all four displayed options;
6. concludes directly.

## Lifecycle

```text
discovery frozen:       true
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```

CP-005 completion does not close the separate CP-004 manual NVDA/VoiceOver gate and does not authorize generation or publication.
