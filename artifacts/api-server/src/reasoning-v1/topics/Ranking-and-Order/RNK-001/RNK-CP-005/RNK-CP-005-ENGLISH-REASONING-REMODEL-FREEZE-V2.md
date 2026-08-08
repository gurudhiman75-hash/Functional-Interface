# RNK-CP-005 — English Reasoning Remodel Freeze V2

Status: **ENGLISH_REASONING_REMODEL_FREEZE_READY**

## Frozen identity

```text
checkpoint:             RNK-CP-005
ownership:              reconstruction-led shared ranking sets
permanent QL range:     RNK-QL-036..043
next available QL:      RNK-QL-044
reasoning version:      RNK_CP005_REASONING_REMODEL_V2
language version:       RNK_CP005_EXAM_LANGUAGE_V2
runtime version:        RNK_CP005_PERMANENT_RUNTIME_V2
freeze version:         RNK_CP005_ENGLISH_REASONING_REMODEL_FREEZE_V2
projection SHA-256:     c1d205d2d49d3fe97bf3049d65c8d2b57e8594eb99abb57982384a4fa6605d8f
```

## Remediation accepted

V1 exposed complete rank tables and pre-arranged ledgers. Those formats allowed direct lookup questions and were not strong enough for SSC or banking reasoning practice.

V2 invalidates that projection and replaces it with incomplete learner-visible evidence. The complete order appears only after the student reconstructs it or inside the explanation.

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
direct-rank exposure:           0
normalized duplicates:         0
```

Each QL has exact answer-position counts:

```text
A: 48
B: 48
C: 48
D: 48
```

## Learner-visible evidence

Every set contains all names but not the final order. Evidence combines:

- zero or one fixed-rank anchor;
- shuffled above/below, before/after, left/right or ahead/behind comparisons;
- immediate-position relations;
- an exact rank-gap or people-between clue.

A separate visible-evidence solver checks all constraints and requires exactly one solution.

## Evidence-mode coverage

```text
PARTIAL_RANK_TABLE:     528 questions / 66 shared sets
MIXED_CLUE_LEDGER:      528 questions / 66 shared sets
COMPARISON_CLUES:       480 questions / 60 shared sets
```

The old structural seed labels do not authorize complete tables or ordered ledgers.

## Context coverage

```text
ROW:                    256
QUEUE:                  256
MERIT_LIST:             256
RACE_FINISH:            256
INTERVIEW_SHORTLIST:    256
PERFORMANCE_ORDER:      256
```

## Difficulty coverage

```text
EASY:                   128
MEDIUM:                 896
HARD:                   512
```

## Review evidence

The English review pack contains 144 representative questions:

- 18 per authority;
- all six contexts;
- all three evidence modes;
- explicit reconstruction instructions;
- no complete displayed ranking;
- unique visible-evidence reconstruction;
- complete question-specific explanations;
- four option analyses per question;
- no internal IDs in learner text;
- context-specific exam language.

Automated gates prove:

- 192 deterministic and distinct shared-set fingerprints;
- every clue set mentions all entities;
- every clue set has at least two clue types;
- every clue set contains rank-gap evidence;
- zero complete-rank exposure;
- exactly one visible-evidence solution per set;
- identical passage fingerprints across linked authorities;
- independent answer replay for all 1,536 questions;
- unique four-option construction;
- exact answer-position balance;
- zero duplicate permanent mathematical fingerprints;
- frozen lifecycle locks;
- pinned permanent and registry projection digests.

## Registered cumulative projection

```text
CP-004:                 39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP-005 V2:              c1d205d2d49d3fe97bf3049d65c8d2b57e8594eb99abb57982384a4fa6605d8f
combined:               080af7fa6787f6752208c0504dce45bc0498c23eb7df7091a4130619ecfb4c2e
```

## Frozen lifecycle

```text
reasoningRemodelFrozen: true
questionStudio:         DISABLED
persistence:            DISABLED
questionBank:           NOT_STORED
testEligibility:        INELIGIBLE
publicPublication:      false
hindiPunjabi:           NOT_STARTED
```

This freeze does not claim completion of the separate human NVDA and VoiceOver validation tracked for the CP-004 renderer.
