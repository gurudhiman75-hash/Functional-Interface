# RNK-CP-005 — Shared Ranking Sets Requiring Reconstruction

Status: **English reasoning remodel frozen at `RNK-QL-036..043`; activation remains disabled.**

## Why CP-005 was remodelled

The first CP-005 projection allowed complete rank tables and already ordered ledgers. Questions such as “Who is third?” then became direct lookup rather than ranking reasoning.

That presentation is no longer authoritative. V2 enforces this rule:

> Shared information may provide clues and a limited anchor, but it must not display the complete final ranking.

Every permanent set is independently solved from learner-visible clues and rejected unless exactly one complete order is possible.

## Ownership

CP-005 owns ranking questions whose defining burden is a reusable shared evidence block. Students reconstruct the common order once and answer several linked questions from it.

Included:

- partial-rank tables combined with comparison clues;
- mixed clue ledgers whose statements are deliberately out of order;
- comparison, immediate-position and rank-gap clue sets;
- rows, queues, merit lists, interview shortlists, races and performance rankings.

Excluded:

- complete rank tables followed by lookup questions;
- already ordered name lists followed by lookup questions;
- standalone rank arithmetic, movement or single-question arrangements;
- incomplete or non-unique partial orders.

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

## Visible-evidence contract

Every set contains:

- six to eight unique entities;
- one stable shared-set identity and fingerprint;
- incomplete learner-visible evidence;
- at most one directly stated rank anchor;
- shuffled ordering and immediate-position relations;
- at least one rank-gap clue;
- exactly one independently reconstructed order;
- eight possible authority questions, normally assembled as four linked questions.

Permanent gates reject:

- a rank row for every entity;
- a pre-arranged complete name order;
- clues that omit an entity;
- zero-solution or multi-solution passages;
- linked questions that reconstruct different orders;
- pair-relation options about unrelated people;
- neighbour options that offer the target as their own neighbour.

## Evidence modes

| Evidence mode | What the student sees | Permanent questions |
|---|---|---:|
| `PARTIAL_RANK_TABLE` | one rank anchor plus shuffled relation and gap clues | 528 |
| `MIXED_CLUE_LEDGER` | mixed fixed-rank, immediate, comparison and gap statements | 528 |
| `COMPARISON_CLUES` | shuffled relative/immediate comparisons with a validating gap clue | 480 |

## Versions and projection

```text
reasoning remodel:      RNK_CP005_REASONING_REMODEL_V2
exam language:          RNK_CP005_EXAM_LANGUAGE_V2
runtime:                RNK_CP005_PERMANENT_RUNTIME_V2
freeze:                 RNK_CP005_ENGLISH_REASONING_REMODEL_FREEZE_V2
permanent QLs:          RNK-QL-036..043
questions per QL:       192
permanent questions:    1,536
shared sets:            192
direct-rank exposure:   0
projection SHA-256:     8ab6d6ab6965aec6be32753bec5d7f083f2b1b03810609b1b2bb40ea02ae8822
```

Coverage:

```text
ROW:                    256
QUEUE:                  256
MERIT_LIST:             256
RACE_FINISH:            256
INTERVIEW_SHORTLIST:    256
PERFORMANCE_ORDER:      256

Easy:                   128
Medium:                 896
Hard:                   512
```

Each QL retains exact `48/48/48/48` answer-position balance and zero duplicate permanent mathematical fingerprints.

The option-quality gate checks all 1,536 questions. Across the 192 pair questions, every option refers to the same named pair. Across the 192 immediate-neighbour questions, no option offers the target person as their own neighbour.

## Lifecycle

```text
reasoning remodel frozen: true
Question Studio:          DISABLED
persistence:              DISABLED
Question Bank:            NOT_STORED
test eligibility:         INELIGIBLE
public publication:       false
Hindi/Punjabi:            NOT_STARTED
```

CP-005 completion does not close the separate CP-004 manual NVDA/VoiceOver gate and does not authorize generation or publication.