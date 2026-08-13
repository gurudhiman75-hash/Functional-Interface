# RNK-001 — Post-CP006 Chapter Gap Audit

Date: 2026-08-12  
Audit version: `RNK_POST_CP006_GAP_AUDIT_2026_08_12_V2`  
Decision: **SOURCE_BACKED_CP007_DISCOVERY_REQUIRED**

## 1. Correction to the first pass

The first post-CP006 pass concluded that no new Ranking authority was justified. A deeper page-level re-audit of the primary Ranking chapter found source-backed question families that had not been mapped against the frozen QLs.

That first conclusion is superseded.

The corrected decision is:

```text
frozen RNK-QL-001..041:             KEEP FROZEN
frozen projection changes required: NO
RNK-QL-042 allocation:              NO
CP007 discovery:                    YES
CP007 permanent runtime/freeze:     NOT AUTHORIZED
object-pool expansion:              YES — significant
```

The important distinction is that **discovery is justified; a new permanent QL is not yet justified**. CP007 must first prove its source forms, solver contracts, ownership boundaries and merge/split decision.

## 2. Frozen coverage remains valid

### CP001 — one-person rank arithmetic

Owns opposite-end conversion, total from both-end ranks, side counts, exact-middle arithmetic and total from counts before/after one person.

### CP002 — two-person positional constraints

Owns people-between, positional gap, target position from a reference, mixed-end totals, min/max total, exact/indeterminate total and proposed-total status.

### CP003 — rank transformations

Owns interchange, movement, overtaking, insertion/removal and membership changes.

### CP004 — unique strict multi-entity order

```text
ONE_UNIQUE_STRICT_TOTAL_ORDER
RNK-QL-027..035
```

### CP005 — comparison uncertainty

```text
MULTIPLE_VALID_STRICT_TOTAL_ORDERS
RNK-QL-036..038
```

### CP006 — explicit equality

```text
ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
RNK-QL-039..041
```

The post-CP006 source findings do not invalidate any of these contracts and therefore do not require reopening their permanent projections.

## 3. Newly confirmed source-backed gap A — category composition around a rank

Primary-source Ranking questions 65 and 67 use a structure such as:

```text
known total population
+ known ratio/count of two subgroups
+ target person has a known rank
+ known number of one subgroup ahead of the target
-> ask number of the other subgroup after the target
```

Examples in the source use boys/girls and class rank.

Why this is not already a frozen solve contract:

- CP001 can convert a person's rank into total before/after counts, but does not account for subgroup composition inside those counts;
- CP002 reasons between two fixed person positions, not subgroup populations;
- CP004..006 reconstruct comparative orders of named entities rather than population-category counts.

### Provisional discovery candidate

```text
CATEGORY_COMPOSITION_AROUND_RANK
```

Disposition:

```text
DISCOVER_AS_PROVISIONAL_AUTHORITY
```

Do not allocate `RNK-QL-042` yet.

## 4. Newly confirmed source-backed gap B — derived quantity order

The Ranking chapter includes questions in which the displayed facts are **not direct order comparisons**. Numeric quantities must first be derived and only then ranked.

### Source Q35 — CSAT 2015

Four people begin with equal money. Transfers occur among them. The learner must derive final balances and then evaluate richest/poorest/comparative statements.

### Source Q68 — SSC MTS 2021

Six objects have weight relations such as:

- one object is a multiple of another;
- one is a fraction of another;
- a sum is less than another object's weight;
- another sum equation links two objects.

The source derives the resulting order and asks which object is second from the bottom.

Why this is not CP004:

```text
CP004 input: direct higher/lower comparison graph
Q35/Q68 input: arithmetic/equation relations -> derived quantities -> order/rank query
```

Why this is not automatically Quant:

The source itself places these examples in the Ranking chapter, and the final learner task is comparative order/rank. Nevertheless, CP007 must enforce a boundary: arithmetic may be small and instrumental; questions whose main burden is substantial calculation remain Quant.

### Provisional discovery candidate

```text
DERIVED_QUANTITY_ORDER
```

Disposition:

```text
DISCOVER_AS_PROVISIONAL_AUTHORITY
```

Potential modes may include deterministic final-value order and a derived state in which some local ordering remains unresolved but the requested rank fact is definite. Those modes must be independently validated rather than assumed.

## 5. Newly confirmed source-backed gap C — numeric-value-constrained order

Source questions 27–28 use cousins whose ages occupy a bounded consecutive numeric domain. The clues include:

- oldest and youngest values;
- all ages distinct;
- an exact one-year relation;
- older/younger comparisons;
- exclusions from specific values;
- a query asking a possible exact age or number of logically possible orders.

This is stronger than a direct comparison graph because exact numeric-domain constraints participate in the solution.

### Provisional discovery candidate

```text
NUMERIC_VALUE_CONSTRAINED_ORDER
```

Disposition:

```text
AUDIT_MERGE_WITH_DERIVED_QUANTITY_ORDER
```

Do not create a separate QL merely because the values are ages. CP007 must compare the solver/answer contract with `DERIVED_QUANTITY_ORDER` first.

## 6. Newly confirmed source-backed gap D — relational side-count equations

Source question 66 relates the number of people in front of and behind one person multiplicatively, then links another person's front count to the first person's behind count.

This is close to CP001 side-count arithmetic, but not identical to any frozen CP001 authority because the displayed evidence links two people's side counts through equations.

### Discovery candidate

```text
RELATIONAL_SIDE_COUNT_EQUATION
```

Disposition:

```text
AUDIT_EXTENSION_OF_CP001
```

The default expectation is **not** a new QL. First test whether this can safely become a later CP001-compatible mode without changing frozen CP001 projection identity.

## 7. Candidates that remain held or redirected

### Numerical post-tie rank convention — HOLD

A prompt such as “three candidates share 5th place; what rank follows?” is ambiguous without stating competition/dense/fractional ranking convention. The source evidence for equality does not establish one universal numbering rule.

### Multiple independent equality groups — HOLD

Mathematically feasible, but no reviewed source fixture currently establishes a distinct student-visible authority beyond CP006.

### Equality class of three or more — HOLD

Treat as possible future CP006 state expansion only if source evidence requires it. Do not create a QL for entity count alone.

### Shared Ranking caselets — INFRASTRUCTURE

Several child questions can reuse existing QLs under one passage. Shared delivery is not authority ownership.

### Ranking + family/gender inference — OTHER CHAPTER / MIXED PUZZLE

The Ranking source contains mixed height/family reasoning. If the family inference is material, ownership belongs to Blood Relations or a controlled mixed-puzzle layer rather than a new pure Ranking QL.

## 8. Corrected CP007 scope

CP007 is reopened as **source-backed discovery**, not permanent implementation.

Discovery candidates:

```text
1. CATEGORY_COMPOSITION_AROUND_RANK
   -> provisional authority discovery

2. DERIVED_QUANTITY_ORDER
   -> provisional authority discovery

3. NUMERIC_VALUE_CONSTRAINED_ORDER
   -> audit merge with DERIVED_QUANTITY_ORDER

4. RELATIONAL_SIDE_COUNT_EQUATION
   -> audit extension of CP001
```

Required CP007 gates before any permanent ID is allocated:

1. source fixture reconstruction for every candidate;
2. independent arithmetic/order solver agreement;
3. exact boundary against CP001/CP002/CP004/CP005 and Quant;
4. merge/split audit;
5. non-trivial distractor generation;
6. difficulty based on derivation burden, not clue count;
7. English editorial review;
8. no lifecycle enablement.

`RNK-QL-042` remains available throughout discovery.

## 9. Self-audit finding — historical object pools are too small for Question Studio scale

The mathematical freeze is strong, but several historical checkpoints use small local presentation arrays. CP006, for example, was frozen from a 14-name English pool.

Changing those arrays now would invalidate reviewed projections. Therefore:

```text
frozen local pools: KEEP IMMUTABLE
future shared pool: EXPAND SIGNIFICANTLY
```

## 10. Object Pool V2 — expanded presentation infrastructure

The new future-facing foundation now separates ordinary ranking presentation objects from derived/compositional ranking objects.

### Person/context layer

```text
person objects:          96
male/female:             48 / 48
locales/person:          English / Hindi / Punjabi
localized person labels: 288
group objects:           20
setting objects:         18
ranking semantic domains: 6
relation template sets:   6 x 3 locales
deterministic selectors: yes
Math.random():           no
```

### Derived/compositional layer

```text
symbolic rankable objects: 52
derived quantity domains:   8
partition schemes:          12
derived operation kinds:     8
locales:                    EN / HI / PA
```

Derived quantity domains include:

```text
WEIGHT
MONEY_BALANCE
AGE
POPULATION_COUNT
SCORE
TIME_TAKEN
HEIGHT
INCOME
```

Operation surfaces include:

```text
TRANSFER
MULTIPLIER
FRACTION_OF
EXACT_DIFFERENCE
SUM_COMPARISON
CATEGORY_RATIO
CATEGORY_AHEAD_COUNT
BOUNDED_CONSECUTIVE_VALUES
```

The symbolic-object pool supports source-authentic objects such as `F, G, H, J, K, L` without forcing human names onto a weight/equation problem.

Partition schemes include the source-backed boys/girls form plus neutral variants such as Section A/B, morning/evening batch, Group X/Y and first/second shift.

## 11. Object-pool safety

Executable gates require:

- stable unique IDs;
- unique visible person names per locale;
- NFC-normalized EN/HI/PA labels;
- deterministic seeded draws;
- no repeated person/object inside one draw;
- balanced-gender person-selection mode;
- setting-to-group compatibility;
- complete relation templates across all three locales;
- no Seating Arrangement vocabulary leakage;
- no name-based inference of ability, rank, score, seniority, wealth or performance;
- derived quantity/category attributes must be explicitly stated by the question, never inferred from identity.

## 12. Frozen compatibility rule

The new pools are **not imported into frozen projection paths**.

The following hashes remain protected:

```text
CP004
39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f

CP005
f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717

CP006
7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

Each frozen runtime is re-run in audit CI after the object-pool tests.

## 13. Corrected roadmap

```text
CP001  one-person rank arithmetic
CP002  two-person positions/separation
CP003  movement/interchange/membership changes
CP004  unique strict total order
CP005  partial order / uncertainty
CP006  explicit equality / total preorder
CP007  source-backed derived/compositional ranking discovery — OPEN, UNALLOCATED
CP008  reserved; shared-caselet assembly remains infrastructure
```

## 14. Final audit decision

Do **not** allocate `RNK-QL-042` yet.

Do **not** reopen or modify frozen `RNK-QL-001..041`.

Do proceed with CP007 discovery for the newly confirmed source-backed families. Its first job is ownership/consolidation—not bulk generation or permanent runtime construction.

## 15. Lifecycle

```text
frozen range:                 RNK-QL-001..041
next available:               RNK-QL-042
CP007 discovery:              AUTHORIZED
CP007 permanent runtime:      NOT AUTHORIZED
CP007 English freeze:         NOT AUTHORIZED
Question Studio:              DISABLED
persistence:                  DISABLED
Question Bank:                NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
Hindi/Punjabi:                NOT_STARTED
```

This audit and object-pool expansion do not authorize merge, deployment, publication, persistence or Question Studio activation.
