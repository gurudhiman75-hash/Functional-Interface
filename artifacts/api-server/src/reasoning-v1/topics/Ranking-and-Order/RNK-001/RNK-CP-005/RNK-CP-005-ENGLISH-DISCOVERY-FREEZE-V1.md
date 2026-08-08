# RNK-CP-005 — English Discovery Freeze V1

Status: **ENGLISH_DISCOVERY_FREEZE_READY**

## Frozen identity

```text
checkpoint:             RNK-CP-005
ownership:              presentation-led and shared ranking sets
permanent QL range:     RNK-QL-036..043
next available QL:      RNK-QL-044
runtime version:        RNK_CP005_PERMANENT_RUNTIME_V1
freeze version:         RNK_CP005_ENGLISH_DISCOVERY_FREEZE_V1
projection SHA-256:     3fcc8981c4eb66b04cc455605da5d2f89a29555a48a7c17bd2e3d51403fa2c29
```

## Permanent assignments

| QL | Authority |
|---|---|
| `RNK-QL-036` | shared-set endpoint entity |
| `RNK-QL-037` | shared-set entity at position |
| `RNK-QL-038` | shared-set rank of named entity |
| `RNK-QL-039` | shared-set pair relation |
| `RNK-QL-040` | shared-set exact rank gap |
| `RNK-QL-041` | shared-set immediate neighbour |
| `RNK-QL-042` | shared-set complete order |
| `RNK-QL-043` | shared-set definitely true statement |

## Frozen projection

```text
permanent authorities:       8
questions per authority:   192
permanent questions:      1,536
shared set seeds:           192
possible authorities/set:     8
recommended assembly/set:      4
normalized duplicates:         0
```

Each QL has exact answer-position counts:

```text
A: 48
B: 48
C: 48
D: 48
```

## Context coverage

```text
ROW:                    256
QUEUE:                  256
MERIT_LIST:             256
RACE_FINISH:            256
INTERVIEW_SHORTLIST:    256
PERFORMANCE_ORDER:      256
```

## Presentation coverage

```text
RANK_TABLE:             528
ORDER_LEDGER:           528
COMPARISON_CLUES:       480
```

## Difficulty coverage

```text
EASY:                   132
MEDIUM:               1,284
HARD:                   120
```

Difficulty reflects presentation and query burden. Context alone does not change difficulty.

## Review evidence

The English review pack contains 144 representative questions:

- 18 per authority;
- all six contexts;
- all three presentation modes;
- complete question-specific explanations;
- four value-specific option analyses per question;
- no internal IDs in learner text.

Automated gates prove:

- deterministic generation;
- unique passage reconstruction;
- identical passage fingerprints across linked authorities;
- unique four-option construction;
- independent answer replay;
- exact answer-position balance;
- complete renderer metadata;
- frozen lifecycle locks;
- pinned projection digest.

## Frozen lifecycle

```text
discoveryFrozen:        true
questionStudio:         DISABLED
persistence:            DISABLED
questionBank:           NOT_STORED
testEligibility:        INELIGIBLE
publicPublication:      false
hindiPunjabi:           NOT_STARTED
```

## Change policy

Any change to a frozen question-bearing field requires:

1. a replacement runtime version;
2. a new projection digest;
3. complete CP-005 foundation, editorial and permanent-gate reruns;
4. an explicit freeze amendment;
5. no activation of Question Studio, Question Bank, test eligibility or publication without their separate gates.

This freeze does not claim completion of the separate human NVDA and VoiceOver validation tracked for the CP-004 renderer.
