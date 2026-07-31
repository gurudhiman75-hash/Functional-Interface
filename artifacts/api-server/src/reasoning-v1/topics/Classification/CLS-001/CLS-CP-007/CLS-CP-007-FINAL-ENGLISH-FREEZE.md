# CLS-CP-007 — Final English Freeze

Status: `FROZEN_ENGLISH_RUNTIME_PROOF`

Permanent QLs: `2`

## Permanent learner contracts

### CLS-QL-012 — Find the odd complete letter cluster

Solve contract:

```text
CP007-FIND-ODD-LETTER-CLUSTER
```

Learner action:

```text
inspect every complete three-, four- or five-letter cluster
  -> recover the common internal alphabet structure
  -> verify that structure across every option
  -> select the complete cluster with the different structure
```

Admitted source-backed rule families:

1. exact signed adjacent-gap vector;
2. exact absolute adjacent-gap vector;
3. normalized signed-gap ratio;
4. adjacent-gap equality topology;
5. cluster vowel count;
6. repeated-letter equality topology;
7. complete alphabet-position total;
8. first two positions sum to the third;
9. absolute difference between first-half and second-half position totals;
10. opposite pairing at indexes 1–3 and 2–4;
11. opposite pairing at indexes 1–2 and 3–4;
12. signed movement inside two adjacent pair-blocks;
13. absolute central gap.

Cluster length, exact rule values, direction, option count, answer position and difficulty are instance variables. They do not change the complete-cluster answer object or mismatch contract.

### CLS-QL-013 — Find the odd complete letter-cluster pair

Solve contract:

```text
CP007-FIND-ODD-LETTER-CLUSTER-PAIR
```

Learner action:

```text
inspect the position-wise transformation inside every complete cluster pair
  -> identify the transformation shared by all but one option
  -> select the complete pair with the different transformation
```

The frozen source-backed transformation is corresponding opposite letters:

```text
for each corresponding index i:
position(left[i]) + position(right[i]) = 27
```

Every option is complete and self-contained. This remains Classification rather than Analogy because no external source relation is transferred to an incomplete target.

## Why the two QLs remain separate

`CLS-QL-012` returns one complete token sequence and proves relations among letters inside that sequence.

`CLS-QL-013` returns one complete pair of token sequences and proves a position-wise transformation across the explicit pair boundary.

Their answer objects, parsers, evidence structures and independent verifier registries therefore differ materially. A shared odd-one-out response does not justify merging them.

## Source and rule compression

### Single-cluster compression

All thirteen source families merge into `CLS-QL-012` because the learner always evaluates one complete cluster under one bounded option-local structure and selects the unique mismatching cluster.

The following remain distinct verifier values but not separate QLs:

- signed versus absolute movement;
- exact vector versus normalized ratio;
- numerical gap values versus equality topology;
- whole-cluster total versus indexed equations;
- indexed opposite-pair topologies;
- three-, four- and five-letter presentation.

### Cluster-pair compression

The recovered source inventory contains one concrete self-contained cluster-pair authority: corresponding opposite-letter transformation.

The complete competing-rule registry also checks:

- exact corresponding position-sum vector;
- corresponding signed-shift vector;
- corresponding absolute-shift vector;
- direct reversal;
- reversed opposite transformation;
- left/right vowel-count signature;
- left/right repeated-letter topology signature.

These additional relations reject accidental competing answers. They do not become source prototypes or separate QLs without repeated source authority.

Named opposite transformation and the exact sum vector `27,27,27` may support the same answer. Same-answer support is admitted; different-answer support is rejected.

## Executable evidence

### Logical single-cluster registry

```text
Canonical deterministic domain:       57,664
Audit questions:                         390
Unique visible questions:                390
Temporary prototypes:                     13
Complete compatible-rule universe:        13
Cluster lengths:                       3, 4, 5
Option counts:                          4 and 5
Difficulty bands:          EASY, MEDIUM, HARD
Same-answer multi-rule states:             218
Maximum regeneration attempts:              12
```

### Source-shaped single-cluster quality layer

```text
Audit questions:                         156
Unique visible questions:                156
Close controlled distractors:            156
Ratio questions proving scale reduction:  12
Topology questions proving raw diversity: 24
Maximum common-group attempt:             10
Maximum outlier attempt:                 267
```

This layer proves matched nuisance features, no repeated-letter giveaway outside the repeat family, bounded raw movements, multiple raw scales for ratio questions, multiple raw vectors for topology questions, close equation misses and explicit option-level match/failure conclusions.

### Complete cluster-pair layer

```text
Common opposite-transform domain:       15,600
Governed balanced near-miss domain:     18,300
Audit questions:                           240
Unique visible questions:                  240
Complete competing-rule universe:            8
Option counts:                           4 and 5
Difficulty bands:                 MEDIUM, HARD
Same-answer multi-rule states:               240
Maximum pool/outlier attempt:                0 / 0
```

Common options use corresponding totals `27,27,27`. The controlled outlier uses `26,27,28` in some order while preserving the same whole six-letter position total. The learner must therefore inspect the intended position-wise relation.

### Permanent English runtime

```text
Total permanent runtime questions:       1,520
CLS-QL-012 questions:                     1,040
CLS-QL-013 questions:                       480
CLS-QL-012 unique visible questions:      1,040
CLS-QL-013 unique visible questions:        480
Unique explanation fingerprints:         1,520
CLS-QL-012 same-answer overlaps:            413
CLS-QL-013 same-answer overlaps:            480
```

Answer-position coverage:

```text
CLS-QL-012: 222, 231, 236, 233, 118
CLS-QL-013: 107, 109, 105, 112, 47
```

The fifth position applies only to five-option states.

## Permanent review artifact

The combined permanent reviewer export contains:

```text
Total questions:      76
CLS-QL-012 questions: 52
CLS-QL-013 questions: 24
Option counts:        4 and 5
Single-cluster rules: all 13
Single-cluster lengths: 3, 4 and 5
Difficulty bands:    EASY, MEDIUM and HARD
```

The complete artifact was checked for:

- stored-answer integrity;
- independent unique solving;
- all rule and prototype authorities;
- lifecycle and publication locks;
- cardinality-safe stems;
- correct singular and plural wording;
- bounded topology movements;
- balanced cluster-pair totals;
- nuisance-feature parity;
- explicit match/failure result for every option;
- natural indexed calculation prose;
- no internal identifiers or diagnostic vocabulary in learner text.

No unresolved defect remained.

## Editorial contract

Every accepted question includes:

1. **Core Concept** — the common relation in natural exam language;
2. **Check the Options** — the active position or pattern calculation for every complete option;
3. **Exam Speed Shortcut** — an action-led screening method;
4. **Common Trap** — a rule-specific warning against the nearest plausible shortcut.

The permanent gates reject:

- fixed-cardinality stem mismatches;
- repeated-letter giveaways outside the intended family;
- ratio questions that collapse to one raw vector;
- topology questions that collapse to one exact gap profile;
- extreme topology jumps above the governed bound;
- opposite-pair outliers exposed by a whole-total shortcut;
- duplicated equation prose such as `result = result`;
- compact index labels in place of natural teacher language;
- calculation-only evidence without a match/failure conclusion;
- internal IDs, lifecycle terms or diagnostic fields in learner text.

## Strict ownership boundary

CP-007 owns classification whose answer is one complete letter cluster or one complete self-contained letter-cluster pair.

It excludes:

- single-letter and complete two-letter-pair answers — CP-006;
- source-to-incomplete-target rule transfer — Analogy;
- next, missing or wrong cluster in a progression — Series;
- hidden encoding or decoding — Coding-Decoding;
- direct requested position, count or rearranged output — Alphabet Test;
- mixed letter-number or symbol options — CP-008;
- renderer-dependent visual letter properties without separate renderer-safe proof.

## Lifecycle and integration policy

```text
Locale:                       en-IN
Review status:                FROZEN_ENGLISH_RUNTIME_PROOF
Question Studio exposure:     disabled
Question Bank storage:        disabled
Test eligibility:             disabled
Public publication:           disabled
Hindi localisation:           not started
Punjabi localisation:         not started
```

The English QL boundary is frozen. Product wiring and multilingual freeze require separate explicit phases. No later `CLS-QL-*` identity is reserved.
