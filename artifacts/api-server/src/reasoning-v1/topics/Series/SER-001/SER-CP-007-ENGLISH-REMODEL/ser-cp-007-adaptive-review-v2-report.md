# SER-CP-007 adaptive English candidate V2

## Result

```text
Status: PASS_SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V2
Temporary templates:            140
Sampled seeds per template:       3
Sampled learner reviews:        420
Proof models represented:         6
Manual full-pack approval:  PENDING
English discovery freeze:   BLOCKED
Permanent QLs:               0
```

Candidate V2 is executable and has passed targeted high-risk spot review. It has not received full manual approval and is not a permanent English freeze.

## Baseline → V1 → V2

| Measure | Baseline | V1 | V2 |
|---|---:|---:|---:|
| Average review words | 152.22 | 114.46 | 96.71 |
| Maximum review words | 226 | 161 | 170 |
| Reviews above 180 words | 113 | 0 | 0 |
| Reviews above 160 words | — | — | 9 |
| Distinct opening lines | 10 | 19 | semantic stem pool retained |
| Visible trap codes | 420 | 0 | 0 |
| Forced old four-heading shell | 420 | 0 | 0 |
| Shortcut blocks | 420 | 363 | 180 |
| Check/common-mistake blocks | 420 | 366 | 102 |

The small V2 increase in maximum length versus V1 is intentional. V2 retains complete position tables and all answer-producing transitions instead of optimizing only for brevity.

## Exact V2 proof metrics

```text
Single-/replacement-term decisive answer proofs: 372
Continuous-gap reconstruction proofs:             12
Two-answer ordered-pair proofs:                    21
Wrong → replacement pair proofs:                    3
Complete generated position tables retained:      12
Missing-term answer proofs:                        99
Replacement proofs without full-series preamble:  99
Task-correct replacement-check wording proofs:     99
Shortcut reviews:                                 180
Check reviews:                                    102
Average words:                                  96.71
Minimum words:                                     53
Maximum words:                                    170
Reviews above 160 words:                            9
```

## Why V2 replaced V1

V1 removed the major presentation defects but manual inspection found four proof-quality issues:

1. Missing-term explanations could omit the transition producing the missing answer.
2. Mixed-column questions could omit middle position rows.
3. Shortcut and Check blocks remained present in roughly 86% of reviews.
4. Two-answer questions could prove only the later group, while wrong-pair questions could duplicate the same transition.

V2 corrects these issues through canonical answer-index tracking rather than by adding more generic prose.

## V2 proof-selection rules

### Every required answer term is proved

For single-term tasks, the worked proof contains the answer-producing transition or a canonical term step derived from hidden mathematical state.

For ordered two-answer tasks, both canonical answer groups must appear in the worked proof.

For wrong → replacement tasks, the replacement is proved once and the final conclusion identifies the displayed wrong group.

### Complete position tables are preserved

When a generator provides `Position 1`, `Position 2`, and so on, every generated row remains visible. A five-letter answer is never justified using only positions 1, 2 and 5.

### Generator bookkeeping is removed

Lines such as:

```text
First write the correct series: ...
First check the shown groups: ...
```

are hidden when the structural proof remains available. If the legacy explanation steps were truncated before the answer term, V2 derives one explicit answer step from canonical terms.

### Gap completion uses reconstruction evidence

Continuous-gap tasks are not judged by whether the missing letters appear as one contiguous token. The proof must reconstruct the complete repeating line or block and then read the missing letters/groups in blank order.

### Support blocks are genuinely selective

A Shortcut is permitted only for:

```text
interleaved rows
continuous gap completion
marker/boundary movement
multi-position direct movement
```

A Check is rendered only for:

```text
REPLACE_WRONG_TERM
WRONG_AND_REPLACEMENT
```

Replacement checks are task-normalized; wording such as “row containing the blank” becomes “row containing the incorrect term.”

## Targeted spot-review record

The regenerated V2 pack was manually inspected at the previously failing or high-risk templates:

| Template | Risk checked | Result |
|---|---|---|
| `SER-CP-007-TMP-002` | missing-term answer transition | `SLPL → VOSO` retained; missing answer is justified |
| `SER-CP-007-TMP-006` | five-column mixed movement | all five position rows retained |
| `SER-CP-007-TMP-016` | interleaved wrong-term bookkeeping leak | odd/even rows retained; full-series prefix removed; Check wording corrected |
| `SER-CP-007-TMP-032` | truncated shrinking-series wrong-term proof | canonical `KLMNOPQ` step derived and displayed |
| `SER-CP-007-TMP-033` | flat gap-letter answer | complete `SWA` line reconstructed before reading missing letters |
| `SER-CP-007-WB-TMP-025` | grouped gaps | complete `WAEI` line plus ordered missing groups displayed |
| `SER-CP-007-WC-TMP-009` | two missing groups | both `PIMI` and `YRVR` proved |
| `SER-CP-007-WC-TMP-010` | wrong → replacement pair | `SLRL → SLPL` conclusion shown without duplicate answer step |
| `SER-CP-007-WC-TMP-001` | three interleaved rows | all three rows shown; decisive row ends in `GREP` |
| Wave-E marker/substitution samples | answer transition and shortcut safety | marker/boundary positions and final transition shown |

This is targeted risk review, not a claim that every exported sample has received human approval.

## Remaining manual review

The complete 140-sample pack still requires a final learner-facing pass for:

1. Naturalness and exam realism of stems.
2. Whether any long position table should be rendered visually rather than as numbered lines.
3. Whether every Check corresponds to an actual misconception represented in the options.
4. Whether each authority needs a custom renderer beyond the six shared proof models.
5. Cross-template wording repetition after the adaptive renderer.
6. Final authority merge/split decisions before permanent IDs.

## Lifecycle

```text
Source ledger:              COMPLETE
Mathematical saturation:    PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE
Baseline English audit:     COMPLETE_REMODEL_REQUIRED
Adaptive candidate V1:      EXECUTABLE_NOT_APPROVED
Adaptive candidate V2:      EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Manual full-pack approval:  PENDING
English discovery freeze:   BLOCKED
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
CP-008:                     blocked
```

## Evidence

```text
Workflow: Validate SER-001 CP-007 adaptive English V2
Run:      30992579720
Artifact: 8924749521
Digest:   sha256:11c4b20f32669434e5bcf8a4d65217e33530356c777b1efb0ebc5271339f9e39
```

## Next authority

```text
SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V2_FULL_MANUAL_REVIEW
```
