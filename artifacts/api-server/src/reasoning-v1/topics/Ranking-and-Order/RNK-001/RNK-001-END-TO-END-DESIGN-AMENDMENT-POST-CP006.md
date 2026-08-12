# RNK-001 End-to-End Design — Post-CP006 Amendment

Status: **authoritative amendment to the provisional checkpoint map in `RNK-001-END-TO-END-DESIGN.md`**.

The original design correctly stated that checkpoint boundaries were provisional and had to be audited after executable prototypes. Implementation and page-level source evidence now supersede its original CP005–CP008 mapping.

## Implemented / audited checkpoint map

```text
RNK-CP-001  one-person rank arithmetic and inverse side counts
RNK-CP-002  two-person positions, separation and mixed-end totals
RNK-CP-003  interchange, movement and membership transformations
RNK-CP-004  unique strict multi-entity total-order reasoning
RNK-CP-005  partial-order / multiple-valid-order uncertainty
RNK-CP-006  explicit equality / one unique total preorder
RNK-CP-007  derived/compositional ranking discovery — OPEN / UNALLOCATED
RNK-CP-008  RESERVED; shared-caselet assembly remains infrastructure
```

## Why presentation-led and attribute-led checkpoints were not retained as QL families

The original design tentatively separated row/queue/merit/finish presentations and height/age/marks/performance presentations.

Executable ownership audits showed that these are usually **surface/context dimensions**, not independent reasoning authorities. A merit list and a race finish can share one ranking solver. Height, scores, seniority and performance likewise do not create new QLs when the underlying order contract is unchanged.

## Why partial order moved to CP005

The book-to-QL ownership reset found partial-order uncertainty to be the first genuine unresolved Ranking state after CP004. It therefore became CP005 and froze as `RNK-QL-036..038`.

## Why equality became CP006

The primary Ranking source explicitly distinguishes incomparable relations from equal-score/equally-fast relations. That evidence supports a third multi-entity state contract:

```text
strict unique order       -> CP004
multiple strict orders    -> CP005
unique weak order / ties  -> CP006
```

CP006 froze as `RNK-QL-039..041`.

## Corrected CP007 decision

The first post-CP006 pass incorrectly closed CP007. A deeper page-level source audit found additional source-backed forms:

```text
Q65 / Q67
  subgroup composition + target rank + subgroup-ahead count
  -> subgroup count after target

Q35 [CSAT 2015]
  money transfers -> derived balances -> comparative ranking

Q68 [SSC MTS 2021]
  weight equations/ratios -> derived order -> rank query

Q27-Q28 [CSAT 2015]
  bounded numeric age domain + exact offsets + ordering constraints

Q66
  relational equations between front/behind side counts
```

These forms are not enough to allocate `RNK-QL-042`, but they are enough to require CP007 discovery.

Corrected state:

```text
RNK-QL-042:                  available / unallocated
CP007 discovery:             open
CP007 permanent runtime:     not authorized
CP007 English freeze:        not authorized
```

### CP007 provisional discovery candidates

```text
CATEGORY_COMPOSITION_AROUND_RANK
  -> discover as provisional authority

DERIVED_QUANTITY_ORDER
  -> discover as provisional authority

NUMERIC_VALUE_CONSTRAINED_ORDER
  -> audit merge with DERIVED_QUANTITY_ORDER

RELATIONAL_SIDE_COUNT_EQUATION
  -> audit extension of CP001
```

The four source forms must not be treated as four QLs before merge/split review.

## Quant boundary for CP007

Arithmetic evidence does not automatically make a question Quant, nor does a final ranking word automatically make it Ranking.

Working boundary to validate during CP007 discovery:

- Ranking ownership is plausible when arithmetic is a compact derivation layer and the final assessed skill is comparative order/rank;
- Quant owns the item when substantial arithmetic/calculation is itself the main learner burden.

This boundary must be enforced by source fixtures and solver contracts before permanent ownership is decided.

## Held equality extensions

Numeric post-tie rank conventions, multiple independent tie groups and equality classes larger than two remain held. CP007 source evidence does not change that CP006 policy.

## Shared-set policy

Shared passages and linked-question sets are delivery infrastructure. They can combine existing QLs but do not receive a QL solely because several questions share one scenario.

## Object-pool architecture amendment

The deterministic-generation requirement is strengthened as follows:

- frozen checkpoint-local pools remain immutable to preserve pinned projections;
- future Ranking generation should use versioned shared foundation pools;
- person selection must support a broad deterministic EN/HI/PA pool;
- derived/compositional questions need symbolic objects, quantity domains and subgroup partition schemes rather than forcing every problem into human-name contexts;
- object selection must be seeded and deterministic;
- English/Hindi/Punjabi display identities must remain unique inside a question;
- context/group/quantity vocabulary must remain independent of QL ownership;
- expanding a presentation pool must never silently change frozen mathematics.

Current future-facing files:

```text
foundation/rnk-object-pool-v2.ts
foundation/rnk-presentation-object-pool-v2.ts
foundation/rnk-derived-object-pool-v2.ts
```

See `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md` for the full corrected decision record.
