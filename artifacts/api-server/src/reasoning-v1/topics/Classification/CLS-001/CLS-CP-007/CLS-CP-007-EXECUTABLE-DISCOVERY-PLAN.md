# CLS-CP-007 — Executable Discovery Plan

Status: `SINGLE_CLUSTER_WAVE_EXECUTABLE__CLUSTER_PAIR_WAVE_EXECUTABLE__MERGE_SPLIT_OPEN`

## Discovery objective

Build deterministic review-only English runtimes for direct odd-one-out classification among:

1. complete letter-clusters of length three to five; and
2. complete self-contained pairs of three-letter clusters.

The executable waves must determine with evidence:

- which source-backed rule families survive complete competing-rule enumeration;
- whether direct single-cluster families share one permanent learner contract;
- whether complete cluster-pair options require a separate learner contract;
- which descriptions are genuine rules and which compress into narrower or broader authorities.

No permanent QL identity is allocated by this plan.

## Temporary task directions

### Wave 1 — complete single cluster

```text
FIND_ODD_LETTER_CLUSTER
```

```text
inspect every complete cluster
  -> recover the common internal alphabet structure
  -> verify that structure across all options
  -> select the complete cluster with the different structure
```

### Wave 2 — complete cluster pair

```text
FIND_ODD_LETTER_CLUSTER_PAIR
```

```text
inspect the position-wise transformation inside every complete cluster pair
  -> identify the transformation shared by all but one option
  -> select the complete pair with the different transformation
```

## Temporary prototype waves

### Single-cluster Wave 1

| Prototype | Source-backed working family | Lengths |
|---|---|---|
| `CLS-CP007-PROT-001` | exact signed adjacent-gap vector | 3–5 |
| `CLS-CP007-PROT-002` | exact absolute adjacent-gap vector | 3–5 |
| `CLS-CP007-PROT-003` | normalized signed-gap ratio | 4 |
| `CLS-CP007-PROT-004` | adjacent-gap equality topology | 3–5 |
| `CLS-CP007-PROT-005` | vowel-count classification | 3–5 |
| `CLS-CP007-PROT-006` | repeated-letter equality pattern | 3–5 |
| `CLS-CP007-PROT-007` | complete position total | 3–5 |
| `CLS-CP007-PROT-008` | first two positions sum to the third | 3 |
| `CLS-CP007-PROT-009` | difference between half-cluster totals | 4 |
| `CLS-CP007-PROT-010` | opposite pairing at indexes 1–3 and 2–4 | 4 |
| `CLS-CP007-PROT-011` | opposite pairing at indexes 1–2 and 3–4 | 4 |
| `CLS-CP007-PROT-012` | signed gaps inside adjacent pair-blocks | 4 |
| `CLS-CP007-PROT-013` | absolute central gap | 4 |

### Complete cluster-pair Wave 2

| Prototype | Source-backed working family | Length |
|---|---|---|
| `CLS-CP007-PAIR-PROT-001` | corresponding opposite-letter transformation | 3 + 3 |

Prototype count is evidence inventory, not a QL quota.

## Canonical models

### Single cluster

```text
alphabet position: A=1, B=2, ... Z=26
signed adjacent gap i: position(letter[i+1]) - position(letter[i])
absolute adjacent gap i: |signed gap i|
normalized gap ratio: divide all signed gaps by their positive greatest common divisor
opposite letters: positions total 27
repeat pattern: assign the same label to equal letters in occurrence order
```

Examples:

```text
CEG  -> signed gaps +2,+2
KQNT -> signed gaps +6,-3,+6 -> normalized ratio +2,-1,+2
ABBA -> repeat pattern 1-2-2-1
ABCA -> repeat pattern 1-2-3-1
```

### Complete cluster pair

For `ABC–ZYX`, compare corresponding positions rather than treating the six letters as one flat total.

```text
corresponding total i = position(left[i]) + position(right[i])
opposite transformation = every corresponding total equals 27
signed shift i = position(right[i]) - position(left[i])
```

A quality-safe outlier preserves the whole corresponding-total sum:

```text
common:  27,27,27 -> total 81
outlier: 28,26,27 -> total 81
```

The learner must therefore inspect the intended position-wise mapping.

## Valid-state-first generation

### Single cluster

```text
select temporary prototype and governed length
  -> select one common rule value with enough members
  -> choose three or four nuisance-matched common clusters
  -> choose one close controlled non-match
  -> place the answer deterministically
  -> independently parse every displayed cluster
  -> enumerate every compatible single-cluster rule
  -> reject competing-answer states
  -> render calculation-complete explanation
```

### Complete cluster pair

```text
select one nuisance group with enough opposite-transform pairs
  -> choose three or four common pairs with distinct left clusters
  -> choose one near-miss pair
  -> change two corresponding target letters by +1 and -1
  -> preserve whole total, vowel signature and repeat topology
  -> independently parse every displayed cluster pair
  -> enumerate the complete cluster-pair rule registry
  -> reject competing-answer states
  -> render all three corresponding calculations per option
```

Arbitrary options followed by post-hoc rule invention are prohibited.

## Deterministic domains

The single-cluster domain is a versioned union of:

- all uppercase three-letter clusters;
- source-shaped constant, alternating and multi-gap translations;
- bounded normalized-ratio profiles;
- deterministic four- and five-letter controls;
- repeated-letter topology controls;
- opposite-pairing controls;
- equation and pair-block controls.

The cluster-pair domain contains:

- every ordered unique-letter three-letter left cluster;
- its position-wise opposite right cluster;
- governed two-index near misses preserving the overall corresponding-total sum;
- nuisance grouping by left/right vowel counts and repeated-letter topology.

Neither domain uses runtime LLM generation.

## Ambiguity model

For every compatible rule, the independent verifier groups displayed options by exact rule value. A rule supports an outlier only when one value occurs once and another value occurs in every remaining option.

A state is accepted only when:

```text
- the intended rule supports the stored answer;
- at least one admitted rule supports an answer;
- every supporting rule points to the same answer index;
- displayed options are unique and structurally valid;
- the independent parser and solver reproduce the result.
```

Same-answer overlap is allowed and recorded. Competing-answer overlap is rejected.

The cluster-pair verifier checks:

- corresponding position-sum vector;
- opposite-transform status;
- signed and absolute shift vectors;
- direct reversal;
- reversed opposite transformation;
- vowel-count signature;
- repeat-topology signature.

## Editorial contract

Every accepted question must include:

1. **Core Rule** — natural exam-language statement of the common structure.
2. **Check the Options** — active calculation for every complete option.
3. **Exam Speed Shortcut** — action-led screening order.
4. **Common Trap** — a rule-specific warning against the most plausible shortcut.

Additional enforced controls:

- no fixed statements such as “three options share the rule”;
- no repeated-letter giveaway outside the repeat-topology family;
- matched nuisance vowel and repeat features;
- normalized-ratio questions must use multiple raw scales;
- equality-topology questions must use multiple raw vectors and no raw adjacent jump above twelve;
- opposite-pair outliers must preserve the whole-cluster or whole-pair total;
- every option check must conclude explicitly whether it follows or fails.

## Difficulty model

Difficulty is derived from:

- answer-object type;
- cluster length;
- number of indexed relations;
- arithmetic demand;
- direction sensitivity;
- one-layer versus multi-layer structure;
- four versus five options;
- same-answer support count;
- answer position and surface similarity.

Difficulty is not permanently attached to a prototype.

## Executable proof targets

The CI gate must validate:

### Logical single-cluster corpus

- deterministic replay;
- all thirteen prototypes and rules;
- lengths three, four and five;
- four- and five-option states;
- every answer position;
- Easy, Medium and Hard coverage;
- complete competing-rule enumeration.

### Source-shaped single-cluster corpus

- close controlled outliers;
- nuisance-feature parity;
- ratio and topology non-collapse;
- bounded raw topology movements;
- no visual repeat shortcuts;
- calculation-complete explanations.

### Complete cluster-pair corpus

- deterministic replay;
- both option counts and every answer position;
- complete pair parsing and verification;
- corresponding totals `27,27,27` for common options;
- controlled outlier totals `26,27,28` in some order;
- whole six-letter total parity;
- nuisance parity and distinct left clusters;
- same-answer support from opposite status and exact sum vector;
- no Analogy, Coding-Decoding or Series wording.

All waves require JSON/Markdown reviewer exports and complete lifecycle locks.

## Follow-up audits

After both executable waves:

- complete the source-gap pass for any other self-contained cluster-pair transformation;
- decide whether all single-cluster families compress into one learner contract;
- keep single-cluster and cluster-pair answer objects separate unless proof justifies a merge;
- inspect whether a genuine reference-cluster matching task exists;
- audit source frequency for repeated-letter topology and whole-position totals;
- allocate permanent QLs only after meaningful uncovered contracts reach zero.

## Lifecycle boundary

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED_DISCOVERY
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```
