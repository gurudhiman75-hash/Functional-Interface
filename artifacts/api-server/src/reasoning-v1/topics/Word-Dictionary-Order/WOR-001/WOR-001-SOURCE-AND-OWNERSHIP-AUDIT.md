# WOR-001 Source and Ownership Audit

## Ownership decision

WOR-001 owns explicit A–Z dictionary ordering of multiple words or letter clusters and consequences derived from that sorted state. This includes Banking composite questions where an **explicitly instructed** per-object letter operation is performed before the mandatory multi-object dictionary sort.

WOR-001 does not own:

- single-word rearrangement/letter operations when no multi-object dictionary sort follows (`ALP-001`);
- hidden transformation-rule inference (`COD-001`);
- semantic/chronological word ordering;
- Input-Output machines whose rule must be inferred;
- native Devanagari/Gurmukhi collation.

ALP-001 itself excludes dictionary ordering of multiple words, so CP-005's explicit transform → multi-object sort pipelines remain clean WOR ownership even though they share low-level letter-operation concepts with Alphabet Test.

## Evidence vocabulary

Prototype contracts use:

- `PYQ_SUPPORTED` — solve contract directly represented in sampled previous/actual-paper or paper-reproduction evidence;
- `PLATFORM_SUPPORTED` — established competitive-exam preparation pattern without equivalent pinned direct-paper evidence;
- `EXPLORATORY_SOURCE_GAP` — mechanically valid, but insufficient recurring exam evidence for permanent allocation.

Allocation is independent:

- supported `RETAIN` → permanent-root candidate after editorial review;
- source-gap `RETAIN` → `DEFER_SOURCE_GAP`;
- `MERGE_AS_INSTANCE_VARIANT` → no separate QL.

## Classic evidence summary

Sampled SSC/Punjab evidence supports:

- complete dictionary ordering;
- first/last endpoint selection;
- kth-position selection;
- middle-word selection;
- rank/position style queries;
- reverse-order presentation as the same comparator in the opposite direction;
- deep common-prefix and prefix-sensitive instances.

The classic source-deferred contracts remain:

- immediate predecessor;
- immediate successor;
- insertion position;
- rank after insertion;
- predecessor after insertion;
- unique misplaced word;
- unique incorrect adjacent pair;
- partial-order completion.

These remain executable research/review contracts but do not reserve permanent QLs.

## Banking evidence summary

The full chapter audit sampled recurring IBPS/RBI/RRB-style five-word/three-letter-group patterns including:

- plain five-cluster dictionary sorting followed by a positional query;
- sorting five groups, concatenating them without gaps and asking a global nth character;
- normal/reverse sorting, selecting a ranked group and querying a local character or alphabet offset;
- explicitly swapping letters in every group before dictionary sorting and then asking a positional question;
- explicitly alphabetizing letters inside every group before dictionary sorting and then asking a local-character question;
- replacing first letters with preceding/following alphabet letters before dictionary sorting.

These patterns are implemented in `WOR-CP-005` as `WOR-PROT-020` through `WOR-PROT-024`, all tagged `PYQ_SUPPORTED` in the registry.

## Final recommended permanent-root architecture

### Classic roots

1. `WOR-PROT-001` — Complete dictionary order.
   - variants: reverse (`002`), hard/deep-prefix (`016`).
2. `WOR-PROT-003` — Endpoint after ordering.
   - variant: last (`004`).
3. `WOR-PROT-005` — Word/cluster at a specified position.
   - variants: middle (`009`), hard kth (`017`), Banking plain clusters (`020`).
4. `WOR-PROT-006` — Position of a specified word.
   - variant: hard rank (`018`).

### Banking composite roots

5. `WOR-PROT-021` — Sort → concatenate → global character.
6. `WOR-PROT-022` — Sort → ranked cluster → local character/alphabet offset.
7. `WOR-PROT-023` — Transform each → sort → positional word query.
8. `WOR-PROT-024` — Transform each → sort → local character query.

`WOR-PROT-020` does not reserve a ninth root because the learner solves the same kth-position contract as classic root 3; only the object representation changes.

## Current chapter posture

```text
recommended permanent roots: 8
classic source-deferred retained contracts: 8
instance variants without separate QLs: 8
permanent IDs allocated: 0
lifecycle: REVIEW_ONLY
```

The content-model audit did not identify another major recurring SSC/Punjab/Banking solve family after CP-005 implementation. The remaining major work is pool breadth, repetition control and human/native-language editorial review.

## Source locator note

The detailed paper/platform examples and URLs used to justify CP-005 are retained in `WOR-001-CONTENT-GAP-AUDIT-V1.md`. That audit remains the evidence inventory; this file records the resulting ownership and allocation decision.
