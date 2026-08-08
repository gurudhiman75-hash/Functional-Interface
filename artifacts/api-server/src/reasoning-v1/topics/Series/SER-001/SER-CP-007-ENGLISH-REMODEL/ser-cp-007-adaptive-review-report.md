# SER-CP-007 adaptive English candidate V1

## Purpose

Candidate V1 remodels learner-facing English without altering the mathematical generators, authority ownership, answer keys or lifecycle locks.

It is a review candidate, not an approved freeze.

## Baseline being corrected

The full 420-review baseline audit found:

```text
Forced four-heading shell:    420 / 420
Visible internal trap codes:  420 / 420
WRONG_TERM samples that actually answer a replacement: 99
Distinct opening lines:        10
Average review length:         152.22 words
Maximum review length:         226 words
Reviews above 180 words:       113
```

## Candidate architecture

### Semantic task normalization

```text
WRONG_TERM -> REPLACE_WRONG_TERM
```

The current generated answer is a corrected cluster, so the editorial task and stem now state replacement explicitly. This does not yet add a separate `IDENTIFY_WRONG_TERM` generator; it prevents incorrect analytics and learner wording for existing records.

### Six proof models

```text
DIRECT_COLUMN_MOVEMENT
INTERLEAVED_ROWS
POSITION_TRANSFORMATION
LENGTH_OR_CONTENT_CHANGE
CONTINUOUS_GAP_COMPLETION
MARKER_OR_BOUNDARY_MOVEMENT
```

The model is selected from the canonical authority. It controls the worked-action label and how many transitions are needed to establish the answer.

### Learner-facing rendering

Candidate output contains:

```text
question stem
numeric options
answer
Explanation
question-appropriate worked action
optional Shortcut
optional Check
```

It does not show:

```text
temporary template ID
canonical authority ID
proof-model ID
editorial task ID
trap code
old compulsory Rule/Solution/Quick Method/Common Mistake headings
```

Audit navigation metadata is retained only in HTML comments in the exported review pack.

### Proof compression

The renderer removes repeated transitions after the pattern is established.

```text
Simple/direct families:
  first transition + second confirming transition + answer transition

Interleaved rows:
  retain enough row evidence to separate and continue the required row

Continuous gaps:
  retain the compact reconstruction proof

Wrong-term and previous-term tasks:
  retain the corrected/backward setup and decisive transitions
```

Compression is not allowed to remove the rule statement, the answer application or the conclusion.

### Selective support blocks

A shortcut is rendered only when it is short and sufficiently different from the rule statement.

A check is rendered for replacement questions and structurally confusing proof models, but omitted from simple direct movement when it would merely repeat the rule.

## Executable acceptance gates

Across three seeds for every one of the 140 temporary templates, Candidate V1 must prove:

```text
sampled reviews:                  420
proof models represented:           6
REPLACE_WRONG_TERM normalizations:  99
old forced headings:                 0
visible trap codes:                  0
visible internal metadata:           0
letter option labels:                0
shortcuts:                     >0 and <420
checks:                        >0 and <420
opening-line diversity:             >10
average review words:          <152.22
maximum review words:              <226
reviews over 180 words:            <113
```

The exact resulting metrics are emitted by `adaptive-review.test.ts` and must be inspected before manual approval.

## Known limits of Candidate V1

Candidate V1 is intentionally conservative.

It does not yet:

```text
create new IDENTIFY_WRONG_TERM questions;
rebuild distractors around every authority-specific misconception;
redesign the underlying explanation data model;
set production task-frequency weights;
allocate permanent QLs;
start localization.
```

The current generators still produce explanation fields shaped by the discovery system. Candidate V1 adapts those fields into a cleaner proof, but a later approved runtime should store structured proof evidence rather than prewritten section strings.

## Manual review questions

The exported 140-sample pack must be checked for:

1. Whether compressed proofs remain sufficient for every authority.
2. Whether optional checks are useful and correspond to actual options.
3. Whether interleaved and marker/boundary explanations are visually clear.
4. Whether any shortcut is unsafe for a generated parameter combination.
5. Whether the stem pool feels like real exam language without becoming repetitive.
6. Whether any authority still needs a custom renderer rather than the shared model.
7. Whether the 17-authority merge/split result remains editorially defensible.

## Lifecycle

```text
Source ledger:              COMPLETE
Mathematical saturation:    PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE
Baseline English audit:     COMPLETE_REMODEL_REQUIRED
Adaptive candidate V1:      EXECUTABLE_PENDING_CI_AND_MANUAL_REVIEW
Manual English approval:    PENDING
English discovery freeze:   BLOCKED
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
CP-008:                     blocked
```

## Next authority

```text
SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V1_MANUAL_REVIEW
```
