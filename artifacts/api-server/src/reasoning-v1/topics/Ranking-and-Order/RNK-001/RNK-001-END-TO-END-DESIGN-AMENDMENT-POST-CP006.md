# RNK-001 End-to-End Design — Post-CP006 Amendment

Status: **authoritative amendment to the provisional checkpoint map in `RNK-001-END-TO-END-DESIGN.md`**.

The original design correctly stated that checkpoint boundaries were provisional and had to be audited after executable prototypes. Implementation evidence now supersedes its original CP005–CP008 mapping.

## Implemented checkpoint map

```text
RNK-CP-001  one-person rank arithmetic and inverse side counts
RNK-CP-002  two-person positions, separation and mixed-end totals
RNK-CP-003  interchange, movement and membership transformations
RNK-CP-004  unique strict multi-entity total-order reasoning
RNK-CP-005  partial-order / multiple-valid-order uncertainty
RNK-CP-006  explicit equality / one unique total preorder
RNK-CP-007  CLOSED / UNALLOCATED after post-CP006 gap audit
RNK-CP-008  RESERVED for infrastructure boundary; shared caselets are not QLs
```

## Why presentation-led and attribute-led checkpoints were not retained

The original design tentatively separated row/queue/merit/finish presentations and height/age/marks/performance presentations.

Executable ownership audits showed that these are **surface/context dimensions**, not independent reasoning authorities. A merit list and a race finish can share the same ranking solver. Height, scores, seniority and performance likewise do not create new QLs when the underlying order contract is unchanged.

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

## CP007 decision

The 2026-08-12 post-CP006 gap audit found no remaining source-backed solve contract that is non-overlapping with CP001..CP006.

Therefore:

```text
RNK-QL-042: available
CP007 generation: closed
new QL allocation: not justified
```

Numeric post-tie rank conventions, multiple independent tie groups and larger tie classes remain held until explicit source evidence supports a safe contract.

## Shared-set policy

Shared passages and linked-question sets are delivery infrastructure. They can combine existing QLs but do not receive a QL solely because several questions share one scenario.

## Object-pool architecture amendment

The original design's deterministic-generation requirement is strengthened as follows:

- frozen checkpoint-local pools remain immutable to preserve pinned projections;
- future Ranking generation should use the versioned shared `foundation/rnk-object-pool-v2.ts` registry;
- object selection must be seeded and deterministic;
- English/Hindi/Punjabi display identities must remain unique inside a question;
- context/group vocabulary must remain independent of QL ownership;
- expanding a presentation pool must never silently change frozen mathematics.

See `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md` for the full decision record.
