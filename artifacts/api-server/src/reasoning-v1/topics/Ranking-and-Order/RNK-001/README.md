# RNK-001 — Ranking and Order

Status: **CP-001 through CP-005 English discovery frozen at `RNK-QL-001..043`; CP-006 onward remains open.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals and exact-middle inverses | frozen: `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison and mixed-end total constraints | frozen: `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal and changed ranks | frozen: `RNK-QL-018..026` |
| `RNK-CP-004` | exact multi-entity comparison and explicit order reconstruction | frozen: `RNK-QL-027..035` |
| `RNK-CP-005` | reusable shared evidence that must be reconstructed before linked questions | remodel frozen: `RNK-QL-036..043` |
| `RNK-CP-006` | attribute-led ranking ownership extensions | planned ownership audit |
| `RNK-CP-007` | partial-order, definite/possible and uniqueness semantics | planned |
| `RNK-CP-008` | advanced synthesis | planned |

## Permanent inventory

```text
CP-001  RNK-QL-001..009  one-person rank arithmetic
CP-002  RNK-QL-010..017  two-position relationships
CP-003  RNK-QL-018..026  movement and transformation
CP-004  RNK-QL-027..035  standalone explicit-order reconstruction
CP-005  RNK-QL-036..043  reconstruction-led shared ranking sets
```

Next available identity: `RNK-QL-044`.

## CP-004 freeze

```text
frozen authorities:      9
permanent questions:     1,728
questions/authority:     192
freeze version:          RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
projection SHA-256:      39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

## CP-005 reasoning-remodel freeze

The original CP-005 presentation could expose complete rank tables or already ordered ledgers. That made several linked questions direct lookup exercises. The authoritative V2 runtime removes that weakness.

```text
frozen authorities:      8
shared sets:             192
English review corpus:   144
permanent questions:     1,536
questions/authority:     192
reasoning version:       RNK_CP005_REASONING_REMODEL_V2
runtime version:         RNK_CP005_PERMANENT_RUNTIME_V2
language version:        RNK_CP005_EXAM_LANGUAGE_V2
freeze version:          RNK_CP005_ENGLISH_REASONING_REMODEL_FREEZE_V2
direct-rank exposure:    0
unrelated pair options:  0
target-own-neighbour:    0
projection SHA-256:      8ab6d6ab6965aec6be32753bec5d7f083f2b1b03810609b1b2bb40ea02ae8822
```

CP-005 now provides three evidence contracts:

```text
PARTIAL_RANK_TABLE     528 questions
MIXED_CLUE_LEDGER      528 questions
COMPARISON_CLUES       480 questions
```

Each set combines incomplete evidence such as one fixed-rank anchor, shuffled comparisons, immediate-position relations and rank gaps. An independent visible-evidence solver rejects the set unless exactly one order is possible.

It covers row, queue, merit-list, race-finish, interview-shortlist and performance-order contexts exactly 256 times each. Each permanent QL has `48/48/48/48` answer-position balance and the permanent gate reports zero duplicate mathematical fingerprints.

The option-quality gate checks all 1,536 questions. All 192 pair questions keep every option focused on the named pair, and all 192 neighbour questions exclude the target from the answer choices.

Difficulty after the remodel:

```text
Easy:     128
Medium:   896
Hard:     512
```

## Registered CP-004 + CP-005 projection

```text
combined projection SHA-256:
ef24476ee421e6c8de926a2a02d68f5e9a76333a10289ef66ae83dc97d78c0de
```

Question Studio remains discovery-only and blocked before generation or persistence.

## Proof summary

```text
CP-001: 13 prototypes / 3,120 discovery / 54 approved / 9 authorities
CP-002: 13 prototypes / 3,120 discovery / 48 approved / 8 authorities / 1,536 permanent
CP-003: 13 prototypes / 3,120 discovery / 78 approved / 9 authorities / 1,728 permanent
CP-004: 11 source forms / 2,640 discovery / 132 approved / 9 authorities / 1,728 permanent
CP-005: 3 evidence modes / 192 unique visible-evidence sets / 144 review / 8 authorities / 1,536 permanent
```

## Construction model

```text
construct a valid hidden ranking state
  -> derive incomplete learner-visible evidence
  -> solve that visible evidence independently
  -> reject complete answer exposure, cycles and ambiguity
  -> construct misconception-owned options
  -> reject unrelated pair options and self-neighbour distractors
  -> render question-specific teaching
  -> pin the permanent projection digest
```

## Ownership boundaries

- one-person rank arithmetic → CP-001;
- two fixed positions → CP-002;
- movement/interchange/insertion/removal → CP-003;
- standalone unique order reconstruction → CP-004;
- reusable reconstruction-led shared sets → CP-005;
- height, age, marks and attribute ranking → CP-006;
- partial-order uncertainty → CP-007;
- advanced mixed shared synthesis → CP-008;
- statement-wise sufficiency → Data Sufficiency;
- facing/adjacency geometry → Seating Arrangement.

## Current lifecycle

```text
cumulative permanent range:      RNK-QL-001..043
next available ID:               RNK-QL-044
CP-001 discovery frozen:         true
CP-002 discovery frozen:         true
CP-003 discovery frozen:         true
CP-004 discovery frozen:         true
CP-005 reasoning remodel frozen: true
chapter-wide freeze:             false
Hindi/Punjabi:                   NOT_STARTED
Question Studio:                 DISABLED
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
manual NVDA/VoiceOver gate:      PENDING
```