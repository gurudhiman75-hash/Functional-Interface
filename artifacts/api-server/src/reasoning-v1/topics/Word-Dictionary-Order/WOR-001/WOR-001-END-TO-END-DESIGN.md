# WOR-001 — Word & Dictionary Order: Implemented End-to-End Design

This file records the implemented post-audit design for classic dictionary ordering and Banking word/cluster composites.

## Chapter pipeline

### Classic path

```text
curated real-word family
→ deterministic word-set builder
→ explicit A–Z comparator
→ canonical lexical order
→ task derivation
→ state-derived difficulty
→ 4-option misconception set
→ independent lexical verification
→ EN/HI/PA explanation
```

### Banking composite path

```text
five × three-letter LETTER_CLUSTER state
→ optional explicit per-cluster transformation
→ preserve original ↔ transformed mapping
→ normal/reverse dictionary sort
→ optional concatenate or ranked-cluster selection
→ word / local-character / global-character query
→ state-derived difficulty
→ 5-option misconception set
→ independent transformation + sort + answer verification
→ EN/HI/PA explanation
```

Both paths remain review-only and feed commit-fresh CI review artifacts.

## Lexical contract

Tokens are compared case-insensitively from left to right. The first differing A–Z character decides order; when one token is a complete prefix of another, the shorter token comes first. Production correctness does not depend on `localeCompare()`.

Classic generator and verifier use separate lexical implementations. CP-005 additionally uses a separate composite verifier that independently reconstructs the stated transformation, sorting and final query answer.

## Object contracts

### `REAL_WORD`

- 30 structural families;
- 360 globally unique provisional English words;
- 8 Easy / 10 Medium / 12 Hard families;
- human corpus approval and later expansion pending.

### `LETTER_CLUSTER`

- CP-005 currently generates five unique three-letter A–Z clusters deterministically;
- Easy uses mostly early lexical differences;
- Medium introduces shared first-letter groups;
- Hard introduces deeper first/second-letter ties;
- a large curated/reviewed Banking cluster pool is the next content-expansion stage.

## Checkpoint architecture

- `WOR-CP-001` — Complete Dictionary Ordering;
- `WOR-CP-002` — Position and Neighbour Queries;
- `WOR-CP-003` — Insertion, Correction and Partial Order (`DEFER_SOURCE_GAP` for permanent QLs);
- `WOR-CP-004` — Advanced Lexicographic Discrimination (instance variants);
- `WOR-CP-005` — Banking Word/Cluster Sequence Composites.

## Permanent-root compression

Recommended full chapter architecture: **8 QL roots**.

Classic roots:

1. complete dictionary order;
2. endpoint after ordering;
3. word/cluster at specified position;
4. position of specified word.

Banking roots:

5. sort → concatenate → global character;
6. sort → ranked cluster → local character / alphabet offset;
7. transform each → sort → positional word query;
8. transform each → sort → local character query.

Plain Banking cluster-position questions merge into root 3; reverse direction, hard prefix depth, middle position and endpoint mirror forms remain instance variants rather than new QLs.

## CP-005 transformation contract

The first implemented transformation set is deliberately explicit and source-shaped:

- swap first and second letters;
- swap first and last letters;
- alphabetically sort letters inside every cluster;
- replace each first letter with the immediately preceding alphabet letter;
- replace each first letter with the immediately following alphabet letter.

No hidden transformation inference is allowed; hidden-rule questions remain Coding-Decoding. A single-word rearrangement without multi-object dictionary sorting remains Alphabet Test.

The runtime rejects transformation collisions that would make two transformed clusters identical and resamples deterministically.

## Difficulty contract

Classic difficulty is derived from word count, common-prefix depth, late comparisons, prefix containment, direction and inference burden.

Banking difficulty additionally reflects composite burden: concatenate/index, ranked local-character extraction, explicit transformation, local alphabet offset and deeper cluster prefix ties. Requested difficulty is accepted only when the resulting state classifies into that band; otherwise deterministic resampling continues.

## Option contract

- classic CP-001–004: 4 options;
- Banking CP-005: 5 options.

Option count is a presentation/exam-profile dimension, not a QL identity. Both profiles require unique choices and exactly one marked answer.

## Explanation contract

Classic explanations prove the canonical adjacent lexical chain and give a task-specific conclusion.

Banking explanations show, as applicable:

1. stated transformation mapping;
2. sorted transformed/unchanged cluster sequence;
3. concatenated string or selected ranked cluster;
4. local/global character indexing;
5. alphabet offset when present;
6. final answer.

Logic tokens remain identical across EN/HI/PA; only natural-language instructions/explanations change.

## Source/ownership contract

WOR owns explicit dictionary ordering of multiple words/clusters even when an explicitly stated per-object letter operation precedes the sort. ALP owns single-word/row letter operations when no multi-object dictionary sort is required. Coding-Decoding owns hidden transformation inference. Input-Output owns inferred machine sequences.

Source status remains independent of mechanical validity. The eight classic predecessor/insertion/correction contracts stay source-deferred despite being executable.

## Validation evidence

Branch-head CI separately proves:

- classic deterministic/multilingual generation;
- CP-005 Banking deterministic/multilingual generation;
- independent classic and Banking solver agreement;
- source governance;
- real-word corpus uniqueness/diversity;
- classic + Banking review-pack generation;
- API production build.

CP-005's first full audit generated 1,980 localized questions across all five Banking task kinds and all transformation modes with coverage across all five answer positions.

## Lifecycle contract

Content architecture is now `ARCHITECTURE_COMPLETE_POOL_EXPANSION_PENDING`. Permanent IDs remain unallocated; Question Studio/public release remain disabled until pool expansion, English/native editorial review and explicit freeze approval are complete.
