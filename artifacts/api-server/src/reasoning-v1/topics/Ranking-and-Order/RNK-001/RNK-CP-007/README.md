# RNK-CP-007 — Derived and Compositional Ranking Discovery

Status: **DISCOVERY V1.1 IMPLEMENTED — exact-head/manual review pending; zero permanent QLs allocated**.

CP007 exists because the post-CP006 page-level source audit found Ranking questions whose displayed evidence must first be transformed arithmetically or compositionally before a rank/order conclusion can be reached.

It is **not** a permanent checkpoint yet.

## Discovery candidates

```text
CATEGORY_COMPOSITION_AROUND_RANK
DERIVED_QUANTITY_ORDER
NUMERIC_VALUE_CONSTRAINED_ORDER
RELATIONAL_SIDE_COUNT_EQUATION
```

## Why V1.1 was required

The first 28-question V1 pack was mathematically correct but manual review found editorial shortcuts that executable answer-key tests did not catch:

- some category-composition questions contained decorative rank or ratio clues;
- some numeric distractors exceeded an obvious subgroup/rank bound;
- ordinal rendering produced forms such as `42th`;
- scaled-object questions could use synthetic labels such as `P9` or `Q12`;
- scaled distractors were not always close to the requested rank;
- transfer explanations could end with an incomplete conclusion such as `Therefore Kavya`.

V1.1 fixes these weaknesses rather than relaxing the gates.

## CATEGORY_COMPOSITION_AROUND_RANK — V1.1

Source basis: Aggarwal Ranking Q65 and Q67.

Typical solve burden:

```text
whole-group total
+ category ratio
+ target category
+ target rank
+ one opposite-category count ahead/after
-> requested category count ahead/after
```

V1.1 modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER
```

The old `UNKNOWN_CATEGORY_AHEAD` mode was removed because its ratio could become decorative.

Corpus:

```text
4 modes x 72 questions = 288
answer positions:          72 / 72 / 72 / 72
permanent QL:              none
```

### V1.1 evidence-essentiality contract

Every generated question must prove that all displayed reasoning evidence matters:

1. perturb the target rank -> answer must change;
2. perturb the category total supplied by the ratio -> answer must change;
3. perturb the displayed opposite-category count -> answer must change.

The displayed subgroup clue always concerns the category opposite the requested one. Direct subgroup-count lookup is therefore forbidden by construction.

Numeric options are bounded by the visible mathematical maximum:

```text
requested AHEAD count <= target rank - 1
requested AFTER count <= requested-category population minus target where applicable
```

This removes impossible-option shortcuts.

Ordinal rendering is now grammatical (`21st`, `32nd`, `43rd`, etc.), and explanation rendering suppresses meaningless `- 0` arithmetic.

Current disposition remains:

```text
PROVISIONAL_AUTHORITY_CANDIDATE
```

Nearest alternative remains a CP001 composition extension. No QL is allocated yet.

## DERIVED_QUANTITY_ORDER — V1.1

Source basis:

- Aggarwal Q35 [CSAT 2015] — money transfers -> final balances -> rank/relation;
- Aggarwal Q68 [SSC MTS 2021] — weight ratios/equations -> derived order -> rank.

Source forms:

```text
TRANSFER_BALANCE_ORDER
SCALED_OBJECT_ORDER
```

Transfer modes:

```text
HIGHEST_BALANCE
LOWEST_BALANCE
SECOND_HIGHEST_BALANCE
TRUE_FINAL_RELATION
```

Scaled-object modes:

```text
HEAVIEST_OBJECT
LIGHTEST_OBJECT
SECOND_FROM_BOTTOM
FOURTH_FROM_TOP
```

Corpus:

```text
8 modes x 32 questions = 256
transfer questions:         128
scaled-object questions:    128
answer positions:            64 / 64 / 64 / 64
permanent QL:                none
```

### Transfer remediation

Transfer states still:

- start all four people with an equal balance;
- use three compact transfers;
- preserve total money;
- require four distinct final balances;
- replay the ledger independently.

V1.1 explanations now finish with a complete mode-specific conclusion, such as:

```text
Therefore X has the highest final balance.
Therefore Y has the second-highest final balance.
Therefore the true statement is: ...
```

Arithmetic burden remains `LIGHT`.

### Scaled-object remediation

The shared V2 object pool still contains 52 symbolic objects for infrastructure capacity, but this exam-facing source form now selects **six single-letter A-Z symbols only**.

Labels such as `P9` and `Q12` are forbidden for this family.

Scaled states deliberately retain at least two valid complete orders because two middle objects may exchange places. The requested rank must nevertheless be invariant across every witness order.

Distractors are now rank-aware: entities appearing nearest to the requested rank across witness orders are preferred. Executable gates require at least two of the three distractors to have appeared within two positions of the requested rank in a valid witness order.

Arithmetic burden is now `MODERATE`, not `LIGHT`.

## Architecture warning: discovery family does not automatically mean QL

The preferred architecture hypothesis for `DERIVED_QUANTITY_ORDER` remains:

```text
DERIVATION ADAPTER
  -> normalized quantity/order state
  -> existing CP004/CP005 query authority where possible
```

A separate permanent QL is allowed only if manual/editorial evidence shows that adapter composition loses a materially different student-visible solve contract.

Current disposition:

```text
DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED
```

## Remaining candidates

### NUMERIC_VALUE_CONSTRAINED_ORDER

Source basis: Aggarwal Q27-Q28 [CSAT 2015].

Current disposition:

```text
HOLD_MERGE_WITH_DERIVED_QUANTITY
```

The source fixture is replayed, but no production corpus is generated yet. More source diversity is required before splitting it from the derived-constraint family.

### RELATIONAL_SIDE_COUNT_EQUATION

Source basis: Aggarwal Q66.

Current disposition:

```text
REDIRECT_CP001_EXTENSION
```

The equation layer normalizes into ordinary CP001 front/behind identities after a compact algebraic solve. No separate CP007 generator is justified by current evidence.

## Source-fixture replay

Executable replay covers:

```text
Q27
Q28
Q35
Q65
Q66
Q67
Q68
```

These are source anchors, not copied learner questions.

## Object-pool support

Pinned future-facing Ranking Object Pool V2:

```text
96 localized person objects
52 symbolic rankable objects
20 group objects
18 settings
12 partition schemes
8 derived quantity domains
8 derived-operation families
EN / HI / PA infrastructure
```

Manifest:

```text
RNK_OBJECT_POOL_V2_MANIFEST_V1
sha256:09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

Frozen CP001..CP006 projection paths do not adopt the new pool.

## V1.1 review pack

CI generates:

```text
RNK-CP-007-DISCOVERY-V1.1-REVIEW-28Q.md
```

Composition:

```text
CATEGORY_COMPOSITION_AROUND_RANK  12
  3 per V1.1 mode

DERIVED_QUANTITY_ORDER            16
  2 per transfer/scaled mode

TOTAL                              28
answer positions             7 / 7 / 7 / 7
```

This is a manual discovery-review artifact, not a freeze pack.

## Merge/split audit

```text
CATEGORY_COMPOSITION_AROUND_RANK
  PROVISIONAL_AUTHORITY_CANDIDATE

DERIVED_QUANTITY_ORDER
  DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED

NUMERIC_VALUE_CONSTRAINED_ORDER
  HOLD_MERGE_WITH_DERIVED_QUANTITY

RELATIONAL_SIDE_COUNT_EQUATION
  REDIRECT_CP001_EXTENSION
```

No discovery candidate owns `RNK-QL-042`.

## Ranking versus Quant boundary

Ranking owns a derived-quantity item only when:

1. arithmetic derivation is compact and instrumental;
2. the final assessed task is rank/order/relation;
3. substantial calculation is not the dominant challenge.

Calculation-heavy age, percentage, profit, equation or optimization work remains Quant even when a final comparison is asked.

## Required next gates

1. Exact-head CI over V1.1 corpora.
2. Manual inspection of all 28 regenerated questions.
3. Recheck category evidence essentiality and option realism.
4. Recheck scaled source authenticity and distractor plausibility.
5. Decide whether category composition is a new authority or CP001 extension.
6. Decide whether derived quantity is an authority or a derivation adapter over CP004/CP005.
7. Only then consider another wave or permanent identity.

## Lifecycle

```text
permanent CP007 QLs:    0
next available RNK ID:  RNK-QL-042
English freeze:         false
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```

No merge, deployment, persistence, publication, translation, Question Studio activation or QL allocation is authorized by Discovery V1.1.
