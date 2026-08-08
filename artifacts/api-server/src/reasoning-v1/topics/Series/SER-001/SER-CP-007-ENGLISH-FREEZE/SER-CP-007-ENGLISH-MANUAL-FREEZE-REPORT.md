# SER-CP-007 — English Manual Freeze Report

**Chapter:** `SER-001 — Series`  
**Checkpoint:** `SER-CP-007`  
**Approval recorded:** 2026-08-07  
**Approved authority model:** 13 permanent solve contracts  
**Frozen prototype templates:** 140  
**Approved learner release pools:** 135  
**Permanent allocation:** handled separately as inactive identities  
**Question Studio / Question Bank / test / public exposure:** disabled

## 1. Freeze decision

The product owner approved the V7.1 English release-remediation candidate and directed the chapter to continue.

This closes the manual English-review gate for:

- the 135 mutually independent PRIMARY learner release pools;
- the 96 Standard Mock PRIMARY candidates;
- the 39 Advanced Practice PRIMARY candidates;
- the 13-authority contract-first model;
- exam-style stems, answer options and student explanations;
- difficulty, release-tier and exam-suitability metadata;
- case-marker and periodic-gap rendering contracts;
- one-question-per-release-pool enforcement.

The approval does **not** activate the chapter. It does not authorise Question Studio discovery, Question Bank writes, test use, public publication or localization release.

## 2. Approved authority decisions

The chapter freezes the following 13 solve contracts:

```text
1. ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE
2. COLUMNWISE_FIXED_CLUSTER_MOVEMENT
3. COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT
4. CUMULATIVE_PREFIX_CLUSTER
5. DIRECTIONAL_CONSECUTIVE_CLUSTER
6. EDGE_DELETION_WORD_SEQUENCE
7. INTERLEAVED_CLUSTER_SERIES
8. MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
9. PATTERNED_INTERIOR_INSERTION_GROWTH
10. PERIODIC_BLOCK_COMPLETION
11. POSITION_PERMUTATION_CLUSTER
12. PROGRESSIVE_POSITIONAL_SUBSTITUTION
13. SYMMETRIC_EDGE_GROWTH
```

### Approved merges

```text
TWO_INTERLEAVED_CLUSTER_SERIES
K_INTERLEAVED_CLUSTER_SERIES
  -> INTERLEAVED_CLUSTER_SERIES

VARIABLE_LENGTH_CONSECUTIVE_CLUSTER
GROWING_CONSECUTIVE_CLUSTER
  -> DIRECTIONAL_CONSECUTIVE_CLUSTER

REPEATED_BLOCK_COMPLETION
ALTERNATING_BLOCK_COMPLETION
  -> PERIODIC_BLOCK_COMPLETION

CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
  -> POSITION_PERMUTATION_CLUSTER
```

The final merge is valid because immutable subtype metadata preserves cyclic rotation, adjacent swap, reversal and odd-even reorder behavior. If subtype or provenance preservation is later weakened, this authority must be reopened rather than silently changing the permanent identity.

## 3. V7.1 evidence accepted

The approved V7.1 gate established:

```text
Temporary templates:                    140
Sampled generated questions:            420
Independent learner release pools:      135
Standard PRIMARY candidates:             96
Advanced PRIMARY candidates:             39
Standard correct-answer positions: 24/24/24/24
Advanced correct-answer positions: 10/10/10/9
Interleaved unseen future terms:           0
Weak cumulative-prefix distractors:        0
Explanation-mode mismatches:               0
Question Bank metadata proof:            PASS
Real assembler release-pool proof:       PASS
Accessible rendering-contract proof:     PASS
Learner application production build:    PASS
```

The 400-record review export remains validation evidence. It represents 135 independent release pools; mutually exclusive variants must not be delivered together as separate learner questions.

## 4. Editorial corrections now frozen

The approved English layer includes:

- displayed-only proofs for interleaved sequences;
- two-sided verification of interior missing groups where the visible evidence permits it;
- realistic cumulative-prefix distractors based on append, insertion, omission and transposition errors;
- balanced PRIMARY answer positions;
- accurate explanation-mode labels;
- exam-suitability metadata;
- advanced-practice restriction for the approved long four-row records;
- internal-only restriction for the under-evidenced `SER-CP-007-TMP-014` seed-2 record;
- case-sensitive marker rendering that does not rely on colour alone;
- non-wrapping, horizontally scrollable periodic gap lines.

## 5. Historical evidence remains immutable

Discovery and candidate records remain historical evidence with:

```text
permanentQlId: null
freezeApproved: false
```

The new freeze authority creates a separate immutable binding from each of the 140 prototype templates to an approved permanent solve contract. Historical review files are not rewritten retrospectively.

## 6. Lifecycle boundary

```text
English content status:          FROZEN
Permanent identity status:       ALLOCATED_INACTIVE
Localization:                    NOT_STARTED
Question Studio discoverable:    false
Question Bank writable:          false
Test eligible:                    false
Publicly publishable:             false
```

English freeze is content approval, not publication approval.

## 7. Next permitted phase

The next chapter phase is:

```text
SER_CP007_HINDI_PUNJABI_LOCALIZATION_AND_PARITY_PROOF
```

Hindi and Punjabi must preserve the frozen solve contract, answer, option order where practical, difficulty, release tier, rendering behavior and release-pool identity. Public and test exposure remain blocked until multilingual parity and the later activation gate are explicitly approved.
