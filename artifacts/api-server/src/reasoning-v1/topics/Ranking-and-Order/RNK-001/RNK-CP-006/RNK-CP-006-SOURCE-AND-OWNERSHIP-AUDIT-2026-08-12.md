# RNK-CP-006 — Equality-Aware Ranking Source and Ownership Audit

Date: 2026-08-12  
Status: **SOURCE-BACKED DISCOVERY AUTHORIZED — permanent QL allocation prohibited**

## 1. Question being audited

After freezing `RNK-QL-001..038`, the next candidate gap is whether ordinary Ranking and Order needs an equality-aware state contract in which two or more named entities explicitly share the same comparison level.

This audit does **not** assume that every numerical tied-rank convention belongs here. It asks a narrower question first:

> Do the ranking sources contain explicit equality classes that materially change the ordering solver compared with the strict-total-order and incomplete-strict-order contracts already frozen?

Answer: **yes**.

## 2. Primary source evidence

Primary reference:

- Preeti Aggarwal and Tanvy Aggarwal, *A New Approach to Reasoning for Competitions*, Radian Book Company, first edition 2022.
- The table of contents places `Ranking` as a separate chapter from `Seating Arrangement`, `Puzzles`, `Data Sufficiency` and `Inequalities`.

The Ranking chapter itself contains solved ranking tables with explicit equality notation:

- one height comparison has two people at the same height level;
- one score comparison has two people with equal scores;
- one running-speed comparison has two people equally fast.

The same Ranking chapter also separately marks some pairs as **uncomparable**. This is decisive ownership evidence: an equality class is not the same state as an incomparable pair.

Source-backed semantic distinction:

```text
EQUALITY
  A = B
  A and B occupy one comparison level
  both inherit the same strict relation to levels above and below

INCOMPARABILITY
  A ? B
  A and B do not have a fixed mutual order from the displayed evidence
  several strict total orders may remain valid
```

Therefore equality-aware ranking is a genuine Ranking solve contract rather than a presentation synonym for CP-005 uncertainty.

## 3. Boundary with frozen CP-004

`RNK-CP-004` owns comparison evidence that resolves to **one unique strict total order**. Every entity occupies its own level.

Example state contract:

```text
A > B > C > D > E
```

CP-006 changes the state space:

```text
A > B = C > D > E
```

The equality group is not removable without changing valid answers. Questions may ask which pair is equal, the relation of a named pair including equality, a strict endpoint despite an internal tie, or the complete weak order.

Decision:

```text
DO_NOT_WIDEN_CP004_STRICT_TOTAL_ORDER
```

## 4. Boundary with frozen CP-005

`RNK-CP-005` owns partial strict orders with **two or more valid complete strict rankings**. Missing comparison information creates uncertainty.

CP-006 discovery instead requires a **single uniquely determined total preorder** (weak order):

```text
CP-005
  several strict total orders remain possible
  equality is not inferred from missing comparison
  solver quantifies over valid total orders

CP-006
  one ordered sequence of equivalence classes is determined
  equality is explicitly entailed
  solver compares equivalence-class indices
```

A pair may be equal only when equality is given or logically forced by an equality contract. Failure to compare two entities is never interpreted as a tie.

Decision:

```text
KEEP_EQUALITY_DISTINCT_FROM_INCOMPARABILITY
```

## 5. Boundary with Inequalities

The book also has a separate Inequalities chapter. CP-006 must not absorb symbolic inequality systems merely because equality can appear in them.

Included here:

- natural-language ranking comparisons;
- height, marks, speed, seniority and performance contexts where rank/order is the entire reasoning burden;
- explicit equality embedded inside those ranking comparisons.

Excluded:

- coded `>`, `<`, `>=`, `<=`, `=` inference exercises whose tested skill is inequality-symbol reasoning;
- arithmetic comparison where ranking is incidental.

## 6. Numeric tied-rank convention — deliberately not assumed

The source evidence proves equality classes. It does **not** by itself specify a universal rule for assigning numerical ranks after a tie.

Common real-world conventions differ, for example:

```text
competition ranking: 1, 2, 3, 3, 5

dense ranking:       1, 2, 3, 3, 4

other systems may use different conventions
```

Consequently CP-006 V1 discovery must not generate questions such as:

> Three people share 5th rank. What rank follows?

unless the question explicitly states the convention or a later source audit establishes one exam-standard rule for that family.

Decision:

```text
NUMERIC_TIE_SUCCESSOR_RANK = OUT_OF_SCOPE_FOR_V1_DISCOVERY
```

## 7. Discovery state contract

V1 uses a total preorder represented as ordered equivalence classes:

```ts
orderedGroups = [
  ["A"],
  ["B", "C"],
  ["D"],
  ["E"],
]
```

Semantics:

```text
A > B
A > C
B = C
B > D
C > D
D > E
```

Required invariants:

1. every entity occurs exactly once;
2. exactly one explicit two-person equality class in V1 raw discovery;
3. the equality class is internal so endpoint questions retain one unambiguous highest and lowest entity;
4. strict class order is acyclic and complete;
5. equality is transitive inside the class and shares all external comparisons;
6. displayed clues uniquely determine the class order;
7. no absent comparison is converted into equality.

The one-pair limit is a discovery simplification, not a claim that larger equality classes are impossible. Expansion to larger/multiple equality groups requires review evidence first.

## 8. Provisional discovery forms

Four raw forms are authorized:

```text
EQUAL_PAIR_IDENTIFICATION
  identify the two entities sharing one comparison level

PAIR_RELATION_WITH_EQUALITY
  first higher / second higher / equal

ENDPOINT_ENTITY_WITH_INTERNAL_TIE
  highest or lowest remains unique while an internal equality class exists

COMPLETE_WEAK_ORDER
  choose the complete ordered equality-class representation
```

These are **source forms**, not four guaranteed permanent QLs.

A later merge/split audit must compare their proof contracts and answer semantics before any `RNK-QL-039+` allocation.

## 9. Protected exclusions

CP-006 V1 must reject:

- Seating Arrangement left/right/facing/adjacency geometry;
- CP-005 incomparability presented as equality;
- numeric successor-rank questions whose tie convention is unstated;
- multi-attribute assignment puzzles;
- designation ladders with unrelated attributes;
- arithmetic-heavy marks/age/speed calculation;
- Data Sufficiency labels;
- shared-set presentation as a standalone QL.

## 10. Lifecycle decision

```text
frozen RNK range before CP-006: RNK-QL-001..038
next available identity:        RNK-QL-039
CP-006 permanent QLs:           0
CP-006 state:                   DISCOVERY_ONLY
Question Studio:                DISABLED
persistence:                    DISABLED
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
public publication:             false
Hindi/Punjabi:                  NOT_STARTED
```

No permanent identity may be allocated until:

```text
raw executable discovery
-> human editorial review
-> merge/split audit
-> production-scale candidate
-> explicit freeze approval
```
