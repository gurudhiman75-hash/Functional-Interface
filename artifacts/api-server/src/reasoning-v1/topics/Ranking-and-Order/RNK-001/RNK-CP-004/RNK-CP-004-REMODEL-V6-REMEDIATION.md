# RNK-CP-004 — English Remodel V6 Remediation

Status: **implemented for manual English review; permanent QL allocation remains open**.

## Source proposal

V6 implements the detailed SSC and banking exam-readiness proposal that called for preserving the validated ranking graphs while remodelling:

- context and stem language;
- clue-expression variety;
- explanation sequencing and depth;
- option-generation contracts;
- difficulty calibration;
- the valid-relation and missing-comparison families.

## Preserved mathematical authority

V6 does not replace the validated CP-004 order engine. It retains:

- deterministic graph generation;
- independent answer reconstruction;
- total-order and two-block uniqueness checks;
- clue-role accounting;
- proof-type separation;
- balanced answer positions;
- semantic duplicate controls;
- lifecycle locks.

## Exam-authentic student surface

Six coherent context families are used in the 66-question review pack:

```text
SELECTION_TEST             11
MERIT_LIST                 11
COMPETITION_STANDINGS      11
PERFORMANCE_REVIEW         11
INTERVIEW_SHORTLIST        11
NEUTRAL_RANKING            11
```

Each question stays within one context. Direct and reversed clue pools are kept separate, and no relation wording may appear more than twice in a question.

Medium and Hard questions contain at least one naturally reversed clue. The final language profile and difficulty components are reconciled after generation.

## Explanation depths

```text
DIRECT
SEGMENT_BUILDING
FULL_POSITIONAL
```

- Direct mode uses only the decisive chain for simple endpoints and pair direction.
- Segment-building mode shows how short chains are joined.
- Full-positional mode shows complete ordering, numbering, local highlighting or block joining where the task requires it.

The learner payload does not expose clue-role, reduction-edge or proof-debug terminology. Optional distractor help remains a native collapsed product component.

## Prototype corrections

### Named rank

The options can include the corresponding bottom rank, and the explanation explicitly distinguishes top rank from bottom rank.

### Relative pair

The option contract now includes:

```text
correct direction
reverse direction
correct direction with wrong gap
wrong direction with plausible gap
```

The explanation uses the shortest decisive path.

### Definitely true relation

The old student-facing `VALID_RANK_STATEMENT` contract is presented as:

```text
DEFINITELY-TRUE-RELATION
```

The stem asks which statement is definitely true. The option set contains one true transitive relation and three false relations. A directly displayed true option is not included.

A cannot-determine distractor is not introduced inside CP-004 because genuine partial-order uncertainty remains owned by CP-007.

### Missing comparison

Every wrong option is independently enumerated. The learner help shows either:

- two concrete valid orders that remain possible; or
- the exact contradiction when the option is inconsistent.

### Exact rank difference

The distractor pool distinguishes:

```text
reverse direction
number of people between
inclusive count
```

The explanation explicitly teaches:

```text
rank difference = absolute difference of rank numbers
people between = rank difference - 1
```

## Difficulty model

V6 uses:

```text
RNK_CP004_DIFFICULTY_V2
```

Stored components cover:

- entity load;
- essential clue load;
- reversed-clue load;
- disconnected-block load;
- non-adjacent comparison load;
- exact-position load;
- confirmatory-clue load;
- option competition;
- shortest proof;
- task burden.

Every score is recomputed from its stored components. Human-readable reasons accompany the numeric score.

## Final executable evidence before manual review

```text
runtime authorities:                         11
runtime questions:                        2,640
review questions:                            66
reconciled runtime questions:                86
review essential clues:                     322
review confirmatory clues:                   45
review unclassified clues:                    0
review difficulty:              10 Easy / 41 Medium / 15 Hard
average visible explanation words:        41.53
average words including optional help:     82.59
answer positions:                     16/17/17/16
repeated four-answer sequences:               0
normalized semantic duplicates:               0
```

## Scope boundary

V6 makes CP-004 a stronger strict-comparison ranking module. It does not claim complete Ranking and Order chapter coverage.

The following remain elsewhere in the chapter plan:

```text
combined top/bottom rank and total persons       -> earlier ranking authorities
rank interchange and movement                    -> RNK-CP-003
row, queue, merit and race presentation ownership -> RNK-CP-005
height, marks, age and other attribute ownership -> RNK-CP-006
partial order, possible, definite, impossible    -> RNK-CP-007
shared passages and advanced synthesis           -> RNK-CP-008
```

## Remaining gates

```text
manual English exam-authenticity review
  -> Question Studio native-disclosure integration and UI/accessibility proof
  -> source and inverse expansion
  -> ownership and boundary audit
  -> merge/split consolidation
  -> permanent runtime proof
  -> English discovery freeze
```

## Safety boundary

```text
permanent QLs allocated:        none
next available identity:        RNK-QL-027
English discovery frozen:       false
Hindi/Punjabi:                  not started
Question Studio:                disabled
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
public publication:             false
```
