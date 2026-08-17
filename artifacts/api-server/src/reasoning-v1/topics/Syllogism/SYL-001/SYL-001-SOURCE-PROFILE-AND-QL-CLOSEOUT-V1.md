# SYL-001 — Source Profile, Difficulty and QL Closeout V1

Authority: `SYL_001_SOURCE_PROFILE_CLOSEOUT_V1`

Status: **audit open; mock weighting and permanent QL freeze remain blocked**.

Base: `cf14902141176f09bff0b8524773ad173fc480cd`

## Why this phase exists

The learner content, diagrams and multilingual viewport pack are approved. That approval does not answer three separate product questions:

1. Which task shapes belong in SSC, Banking and Punjab mock tests?
2. How frequently should each task family appear?
3. Which of the current 18 QLs are true exam archetypes, and which are practice or teaching diagnostics?

The current runtime treats all scenarios inside a scenario group as a shuffled pool. It has no exam-profile weighting layer. Difficulty is inherited from static scenario labels rather than computed from the generated task and scenario together.

## Source boundary

The current source snapshot covers:

- SSC concept and complementary-pair authority through SATHEE;
- representative RPF/SSC two-statement, two-conclusion, four-option questions;
- representative RBI Assistant, RBI Grade B and NABARD Banking questions;
- representative JIPMAT three-conclusion cross-exam questions.

This evidence supports task-shape decisions. It is not presented as a complete historical frequency census.

### Punjab boundary

No direct Punjab-state syllogism PYQ sample is frozen in the repository.

Therefore:

```text
Punjab mock weighting: BLOCKED
Punjab provenance claim: PROHIBITED
Cross-exam fallback labelled as Punjab PYQ: PROHIBITED
```

English, Hindi and Punjabi localization remains approved. Localization approval is not Punjab-exam provenance.

## Baseline findings

### Scenario pool

```text
Total scenarios: 36

CORE:   12
ONLY:    8
FEW:     8
MIXED:   8

EASY:    4
MEDIUM: 12
HARD:   20
```

The static pool is therefore 55.6% `HARD` before the task shell is considered.

Source-pattern allocation is also uneven:

```text
SSC core:             4
Banking core:         5
Banking ONLY:         5
Banking FEW:          6
Multilingual mixed:   4
Cross advanced:      12
```

One third of the pool is attached to the cross-advanced authority. That is acceptable for architecture coverage but not automatically appropriate for every target mock profile.

## QL role audit

The 18 current QLs are preserved during this audit, but they are no longer assumed to be 18 final mock-test archetypes.

```text
Mock-authentic:                5
Authentic practice variants:   7
Training diagnostics:          6

Directly retain:               4
Merge candidates:              7
Remodel before mock:           1
Training-only:                 6
```

### Direct mock-authentic retains

- `SYL-QL-001` — classical single definite conclusion;
- `SYL-QL-003` — SSC-style two-conclusion four-option mask;
- `SYL-QL-004` — cross-exam three-conclusion combination;
- `SYL-QL-008` — Banking five-option two-conclusion/either-or shell.

### Mock-authentic but duplicate-archetype candidate

- `SYL-QL-017` — merge with the three-conclusion archetype represented by `SYL-QL-004`; mixed premise forms should be scenario variants rather than a second task archetype.

### Practice/remodel candidates

- `SYL-QL-002` — non-following inverse task is valid practice, but the reviewed SSC shell asks which conclusion follows;
- `SYL-QL-005` — possibility is authentic, but reviewed Banking questions place it inside the ordinary conclusion-option shell;
- `SYL-QL-010`, `011`, `013`, `015` — ONLY and ONLY_A_FEW are source-authentic premise families, but they should normally be variants inside Banking task shells rather than separate QLs solely because of premise vocabulary;
- `SYL-QL-016` — mixed two-conclusion practice is supported, but its final target-exam shell is not yet frozen.

### Training-only diagnostics

These remain useful in lessons and adaptive practice but receive zero mock-test weight:

- `SYL-QL-006` — explicit impossibility selection;
- `SYL-QL-007` — core three-label modality classification;
- `SYL-QL-009` — pair classification;
- `SYL-QL-012` — ONLY modality classification;
- `SYL-QL-014` — ONLY_A_FEW modality classification;
- `SYL-QL-018` — mixed modality classification.

## Provisional target mixes

These are source-backed product targets, not claimed historical frequencies.

### SSC

```text
55%  two-conclusion four-option
25%  single definite selection
10%  complementary pair
10%  advanced three-conclusion adapted practice
```

ONLY and ONLY_A_FEW remain outside the SSC mock mix until direct SSC evidence is frozen.

### Banking

```text
35%  two-conclusion five-option
20%  either-or complementary pair
20%  possibility inside conclusion set
15%  ONLY / ONLY_A_FEW premise variants
10%  advanced three-conclusion combinations
```

Standalone modality and pair-classification diagnostics receive zero mock weight.

### Cross-exam practice

```text
60%  three-conclusion combination
40%  labelled mixed practice
```

### Punjab

No mix is assigned.

## Difficulty calibration candidate

`SYL_001_STRUCTURAL_DIFFICULTY_CALIBRATION_V1` is audit-only.

It computes a structural prior from:

- number of premises;
- number of terms;
- topology;
- special statement forms;
- task-processing load.

Bands:

```text
0–2  EASY
3–5  MEDIUM
6+   HARD
```

This score does not replace the runtime difficulty yet. It must first be compared with generated-question distribution and later calibrated against student accuracy and solve-time data.

## Proposed final archetype boundary

The closeout should converge toward task archetypes, with premise families represented as scenario variants:

1. SSC single definite conclusion;
2. SSC two-conclusion four-option;
3. Banking two-conclusion five-option, including either-or;
4. Banking possibility conclusion inside an ordinary option shell;
5. Cross/advanced three-conclusion combination;
6. Special-form Banking variants for ONLY and ONLY_A_FEW within the above Banking shells;
7. training diagnostics, excluded from mock weighting.

The exact final ID allocation is not frozen in this checkpoint.

## Implementation checkpoints

### CP-008A — Baseline authority

Implemented in this branch:

- current source snapshots;
- provisional profile mixes;
- QL role/action decisions;
- current scenario and difficulty baseline audit;
- audit-only structural difficulty scorer.

### CP-008B — Source saturation

Required next:

- collect and classify a direct Punjab-state PYQ sample;
- expand each target profile beyond one representative page;
- record question-level task-shape evidence rather than page-level claims;
- set confidence and sample-size thresholds.

### CP-008C — QL consolidation

- remodel Banking possibility into exam-shaped option shells;
- merge statement-form-only QLs into task archetypes;
- keep training diagnostics accessible but mock-ineligible;
- preserve old IDs through compatibility aliases where necessary.

### CP-008D — Weighting and calibrated generation

- add explicit `SSC`, `BANKING`, `PUNJAB` and `CROSS_EXAM` generation profiles;
- apply task-family and scenario-family weights;
- activate difficulty scoring only after generated distribution review;
- add deterministic profile-level regression suites.

### CP-008E — Final freeze

- approve final QL inventory;
- approve profile mixes;
- approve difficulty distribution;
- update manifest authority;
- retain Question Studio and release locks until integration proof is separately complete.

## Current decision

```text
mockWeightingFrozen: false
permanentQlFreezePermitted: false
PunjabProfileStatus: BLOCKED_NO_DIRECT_PYQ_SAMPLE
difficultyCalibrationStatus: AUDIT_ONLY_NOT_ACTIVE
questionStudioEnabled: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
public: false
```
