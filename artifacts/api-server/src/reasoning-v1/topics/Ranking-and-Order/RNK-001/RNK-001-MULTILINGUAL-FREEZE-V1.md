# RNK-001 Multilingual Freeze V1

## Decision

Hindi and Punjabi learner content for RNK-001 is formally frozen against the seven exact approved checkpoint heads and the successful controlled combined-tree proof.

- English: FROZEN
- Hindi: FROZEN
- Punjabi: FROZEN
- Permanent QLs: RNK-QL-001..042
- RNK-QL-043: intentionally unallocated

## Human approval

Formal product/native approval was recorded in PR #934 after review of the decluttered native learner surface. The approved native presentation head is `d905d72a71d36794984e67d30fd7581eb5c3f60d`; PR #921 later reached exact-head green at `26136894f074945ae7d7d9d3729f5bc778dd8aeb` without changing the approved native review files.

## Combined-tree proof

PR #938 exact head `07ed844d248411ddd385ec0d620d56cb2692571f` passed `Validate RNK-001 Approved Multilingual Integration V1`, run `32327889203`.

Retained combined-tree evidence:
- artifact ID: `9392687777`
- artifact: `rnk-001-approved-multilingual-combined-tree-v1`
- digest: `sha256:6c08bbbcf39dc1c2d61f587623cc653c6bb25e3724e24761c891deaf8dfd0c8e`
- exact approved locale overlay: 68 checkpoint-local files

The successful run validated all seven approved native checkpoint authorities together, then re-proved declutter/frozen-English authority, shared Question Studio review generation, API build, and admin build.

## Frozen source pins

- CP001 / RNK-QL-001..009 / `d62bb7ea6bf8312a360318cf4939bd15bce057f0`
- CP002 / RNK-QL-010..017 / `0e29a4760f80c638c5e318cdc5dcff621fe3b9a4`
- CP003 / RNK-QL-018..026 / `618a5a8ebdc33eaad395a10297719cae030d8cc9`
- CP004 / RNK-QL-027..035 / `7ac8eeeb76cd2c259957baa67d30c1acb329f36e`
- CP005 / RNK-QL-036..038 / `7d28290d061329153935853cba28d5c3ffe63a43`
- CP006 / RNK-QL-039..041 / `361cf571f138572caebfd0ecb0fa145e9afdfda3`
- CP007 / RNK-QL-042 / `60d1fcca93efd27340f969ff8589b95195c2771e`

## Freeze is not activation

This transition freezes multilingual content authority only. It does not activate product delivery.

Still locked:
- Hindi/Punjabi Question Studio generation
- Question Bank writes
- test/mock eligibility
- public publication
- automatic student publication

Those require a separate explicit activation checkpoint after the frozen multilingual authority is wired into the shared Question Studio lifecycle.
