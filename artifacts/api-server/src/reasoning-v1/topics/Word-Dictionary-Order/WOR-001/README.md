# WOR-001 — Word & Dictionary Order

WOR-001 is a deterministic, multilingual, review-only Reasoning chapter for English A–Z dictionary ordering.

## Implemented scope

- `WOR-CP-001` — complete ascending/descending order and first/last word;
- `WOR-CP-002` — kth position, rank, predecessor, successor and middle word;
- `WOR-CP-003` — insertion, new rank, inserted-word predecessor, misplaced word, incorrect adjacent pair and partial order;
- `WOR-CP-004` — hard common-prefix versions of ordering, position, rank and insertion.

The runtime supports `en-IN`, `hi-IN` and `pa-IN`. English words remain unchanged logic tokens in all three locales. Only instructions and explanations are localized.

## Runtime guarantees

- explicit case-insensitive ASCII comparator; no `localeCompare()` dependency;
- separate selection-sort verifier that does not call the generator comparator;
- deterministic seeded word-set construction from 12 curated families;
- exactly four unique options and one answer;
- misconception ownership for every distractor;
- prefix-contained and late-first-difference coverage;
- simple question-specific explanations;
- review exports in Markdown and JSON.

## Lifecycle

- permanent QLs: unallocated;
- lifecycle: `REVIEW_ONLY`;
- Question Studio adapter: implemented but not discoverable;
- Question Studio visibility: disabled;
- public release: disabled;
- native Hindi/Punjabi dictionary collation: not implemented.

Human editorial approval of all three review packs and an external source-pattern audit are still required before permanent QL allocation or release.

## Verification

Run the bundled `wor-001.test.ts` audit. It validates comparator properties, independent-solver parity, all prototypes, all locales, answer balance, ambiguity controls, corpus diversity and review export integrity.
