# MEN-CP-011 — Open-Container Exposure Wave 01

## Status

```text
Authority:                    MEN-CP011-OPEN-CONTAINER-EXPOSURE-WAVE-01-V1
Permanent QLs:               0
Question Studio:             disabled
Question Bank:               NOT_STORED
Test eligibility:            INELIGIBLE
Public publication:          false
Direct source normalisation: pending
Manual English review:       pending
```

This wave resolves the first open-container gap without duplicating an authority already owned elsewhere in MEN-002.

## Ownership decision

The initial discovery candidate:

```text
MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA
```

is **not** added as a second runtime family. Its direct open-top cuboid sheet-area contract is already implemented by:

```text
Canonical problem: MEN-CP-007
Prototype:         MEN-CP007-PROT-OPEN-TOP-BOX-AREA
Solve mode:        findOpenTopCuboidSheetArea
```

Wave 01 executes 32 boundary proofs against that owner runtime. MEN-CP-011 may revisit the boundary only when a future source or topology audit proves a genuinely distinct exposure contract, such as internal lining, mixed open faces or an inverse missing-face task.

## New executable families

```text
MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA
MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA
```

### Cylinder open at one end

The physical ledger includes:

```text
curved wall:    exposed
open top:       absent
bottom base:    exposed
```

Formula authority:

```text
2πrh + πr²
```

### Cylinder open at both ends

The physical ledger includes:

```text
curved wall:    exposed
top base:       absent
bottom base:    absent
```

Formula authority:

```text
2πrh
```

The learner is required to decide which surfaces physically exist before calculation. An open mouth is not treated as a zero-area material disc; the disc is absent.

## Representation matrix

Both runtime families support:

- centimetre dimensions with answers in square centimetres;
- metre dimensions with answers in square metres;
- exact π answers;
- declared `π = 22/7` answers using integral-friendly states;
- four balanced correct-option positions;
- text-complete attempt mode;
- optional deterministic ExamTree open-container diagrams for practice and solution views.

Declared `π = 3.14`, mixed linear units and diameter representations remain outside this first wave.

## Misconception authority

The option engine distinguishes:

- adding a top disc that is physically absent;
- omitting a bottom disc that is physically present;
- calculating the base only;
- adding one absent end to a two-ended sleeve;
- treating an open sleeve as a closed cylinder;
- omitting the factor 2 from the circumference.

Internal misconception IDs are admin-only.

## Executable proof

```text
Runtime prototypes:                 2
Deterministic packages per family: 128
Total deterministic packages:     256
Balanced review records:           32
Records per family:                 16
Unit/π profiles:                     4
Records per family/profile cell:     4
Unique physical states:             32
Correct positions:               A8 B8 C8 D8
Open-cuboid ownership proofs:        32
```

The proof rejects invalid topology ledgers, duplicate exact options, multiple correct answers, mismatched diagram labels, learner-visible internal codes, malformed MathJax and lifecycle leakage.

## Updated initial-discovery position

Before this wave, 14 of the initial 20 discovery candidates were unresolved. This wave resolves three candidates:

- one is reassigned to its existing MEN-CP-007 owner;
- two become executable MEN-CP-011 cylinder-exposure families.

Therefore 11 initial candidates remain unresolved. The largest remaining groups are:

- inverse thickness and inverse length;
- hollow cube, cuboid, spherical and hemispherical material volume;
- joined and placed solids;
- cost, lining, ratio and percentage-change applications.

## Active blockers

```text
DIRECT_SOURCE_NORMALISATION_PENDING
MANUAL_ENGLISH_REVIEW_PENDING
CHAPTER_COVERAGE_INCOMPLETE
PERMANENT_QLS_UNALLOCATED
```
