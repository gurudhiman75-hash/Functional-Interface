# RNK-CP-005 — Presentation-led and Shared Ranking Sets

Status: **English discovery frozen at `RNK-QL-036..043`; activation remains disabled.**

## Ownership

CP-005 owns ranking questions whose defining burden is a reusable shared presentation rather than a new rank formula. One evidence block is reconstructed once and supports linked questions.

Included:

- rank tables, ordered ledgers and comparison-clue passages;
- rows and queues;
- merit lists and interview shortlists;
- race finishing orders and performance rankings.

Excluded:

- standalone rank arithmetic, CP-001/CP-002;
- interchange or movement, CP-003;
- standalone explicit-order reconstruction, CP-004;
- attribute calculation, CP-006;
- incomplete or non-unique partial orders, CP-007;
- advanced mixed transformations, CP-008.

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

Next available identity: `RNK-QL-044`.

## Shared-set contract

Every set contains:

- stable `sharedSetId` and seed;
- one context family;
- one presentation mode and renderer class;
- six to eight unique entities;
- complete displayed evidence;
- one unique independently reconstructed order;
- one shared-passage fingerprint reused by all linked questions.

The runtime exposes eight possible authority questions per set. Product assembly should normally select four and reuse the same displayed evidence.

## Presentation modes

| Mode | Renderer | Evidence contract |
|---|---|---|
| `RANK_TABLE` | `STRUCTURED_TABLE` | shuffled entity/rank rows |
| `ORDER_LEDGER` | `ORDERED_LEDGER` | start-to-end ordered rows |
| `COMPARISON_CLUES` | `STRUCTURED_TEXT` | complete adjacent comparison chain |

## Exam-language layer

`RNK_CP005_EXAM_LANGUAGE_V1` adapts learner wording by context rather than substituting generic direction words. It provides natural constructions such as:

- extreme left/right for rows;
- front/back and ahead/behind for queues;
- first/last and above/below for merit lists and shortlists;
- finished first/last/before/after for race results;
- highest/lowest performer and ranked above/below for performance orders.

Editorial gates reject known awkward constructions including `top end`, `last end`, `lowest end`, generic `side` wording and unnatural `towards ... of` phrases.

## Permanent runtime

```text
runtime version:       RNK_CP005_PERMANENT_RUNTIME_V1
language version:      RNK_CP005_EXAM_LANGUAGE_V1
freeze version:        RNK_CP005_ENGLISH_DISCOVERY_FREEZE_V1
permanent QLs:         RNK-QL-036..043
questions per QL:      192
permanent questions:   1,536
shared sets:           192
projection SHA-256:    021079af803fb43bc1a51296290fed7b9c0654f508fb665f41847c5981448305
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
- all four answer positions;
- complete option-specific explanations;
- no internal identifier leakage;
- no banned awkward context phrases.

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
