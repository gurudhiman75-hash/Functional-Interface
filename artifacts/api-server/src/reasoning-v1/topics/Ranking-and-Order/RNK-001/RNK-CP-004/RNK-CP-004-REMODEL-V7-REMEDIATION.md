# RNK-CP-004 — Targeted SSC/Banking English Remodel V7 Remediation

## Status

```text
English Remodel V7: targeted manual review pending
permanent QLs: none
next available identity: RNK-QL-027
Question Studio: disabled
Question Bank: NOT_STORED
test eligibility: INELIGIBLE
public publication: false
```

V7 implements the critical review of the V6 66-question pack. It preserves the validated order graphs, solver, clue-role accounting and ownership boundary while correcting the remaining exam-calibration and editorial-diversity issues.

## Corrected defects

- singular/plural rendering now distinguishes `1 person` from plural `people`;
- every four-option question stores exactly three distractors;
- option count and distractor count are checked as an invariant;
- `rank positions above` is replaced by natural `place/places above` wording;
- highest/lowest optional help identifies each wrong candidate's actual rank;
- missing-comparison mock help uses one concrete valid order plus a concise ambiguity statement;
- remapped direction and distance options receive matching learner-help explanations.

## Pair authority correction

`RELATIVE_ORDER_OF_PAIR` remains direction-only and now uses one consistent semantic contract:

```text
correct higher/lower relation
reverse higher/lower relation
same-rank contradiction
cannot-determine contradiction
```

Exact distance remains owned by the separate provisional authority `EXACT_RANK_DIFFERENCE_OF_PAIR`. Its options use natural exam language such as `A is three places above B` and test:

```text
correct difference and direction
correct difference with reversed direction
number of people between
inclusive endpoint count
```

## Difficulty V3

V7 introduces:

```text
RNK_CP004_DIFFICULTY_V3
```

The model gives primary weight to the shortest proof and actual task burden. Entity count is a small scanning cost rather than the controlling feature.

Task-specific calibration includes:

- five-person middle questions are Easy;
- short direction-only pair proofs are Easy;
- named-rank and ordinary immediate-neighbour chains are capped at Medium;
- definitely-true transitive inference has a Medium floor;
- missing-comparison questions become Hard only at the larger block-merging load;
- exact rank difference is Hard only when eight entities, reversed wording and confirmatory evidence combine;
- exact-rank lookup requires both size and additional wording/redundancy burden before receiving Hard.

Runtime distribution:

```text
Easy:     838
Medium: 1,595
Hard:     207
```

Review distribution:

```text
Easy:    17
Medium: 100
Hard:    15
```

## Editorial diversity

V7 guarantees at least three stem variants and three explanation-shell variants per provisional authority.

Examples of controlled stem variation include:

```text
Who ranked first?
Who obtained the top position?
Which person was placed highest?
```

The explanation logic remains stable, but labels such as `Final order`, `Combined ranking`, `Only this chain is needed` and `The decisive chain is` vary naturally.

Confirmatory-clue counts of zero, one and two are all represented in the review evidence.

## Expanded review evidence

The manual review corpus expands from 66 to 132 questions:

```text
11 provisional authorities
12 independently structured records per authority
12 mixed-authority review batches
6 contexts × 22 records each
```

Structural fingerprints are computed after replacing names with solved-order positions. They include clue-edge shape, query shape, confirmatory count and option roles, so repeated graph structures cannot be hidden by different names or contexts.

Each authority has 12 distinct structural fingerprints.

## Answer-position authority

The 132-question pack uses a deterministic balanced unique order-4 path:

```text
A: 33
B: 33
C: 33
D: 33
unique four-answer windows: 129
repeated four-answer windows: 0
```

## Final executable evidence

```text
runtime authorities:                         11
runtime questions:                        2,640
review questions:                           132
review evidence per authority:               12
mixed review batches:                        12
contexts:                          22 in each family
average visible explanation words:        45.28
average with optional help:                87.73
normalized semantic duplicates:               0
```

All release gates pass:

```text
raw solver and discovery audit
final V6 publication regression
V7 runtime/editorial/diversity audit
V7 learner-help release alignment
```

## Remaining work before English freeze

- manual exam-authenticity approval of the 132-question V7 pack;
- source saturation and inverse-query audit;
- ownership audit against CP-005, CP-006 and CP-007;
- merge/split consolidation of provisional authorities;
- permanent runtime proof and QL allocation;
- Question Studio native-disclosure integration;
- 360/390/430 px mobile and accessibility validation.

No freeze, QL allocation, localisation, Question Studio enablement or publication is authorised by V7.
