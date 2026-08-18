# WOR-001 — Word & Dictionary Order

WOR-001 is a deterministic, multilingual Reasoning chapter covering classic SSC/Punjab dictionary ordering and recurring Banking five-cluster composite patterns.

## Technical chapter status

The chapter is **technically complete and review-locked**.

- 5 checkpoints;
- 24 executable prototypes / 20 task kinds;
- 8 permanent QL roots allocated as stable inactive IDs (`WOR-QL-001` … `WOR-QL-008`);
- 15 prototypes mapped to those permanent roots;
- 9 source-deferred/research prototypes remain executable but intentionally have no permanent QL;
- 60 real-word families / 720 globally unique words;
- 60 Banking cluster families / 720 globally unique three-letter clusters;
- English, Hindi and Punjabi generation;
- classic 4-option and Banking 5-option contracts;
- independent classic and Banking verification;
- shared Question Studio integration only — no WOR-specific Studio panel/API/lifecycle route.

Permanent QL allocation is **identity freeze only**. The QLs are inactive and do not imply content approval or release approval.

## Permanent QL roots

1. `WOR-QL-001` — complete dictionary order;
2. `WOR-QL-002` — endpoint after ordering;
3. `WOR-QL-003` — word/cluster at a specified position;
4. `WOR-QL-004` — position of a specified word;
5. `WOR-QL-005` — sort → concatenate → global character;
6. `WOR-QL-006` — sort → ranked cluster → local character/alphabet offset;
7. `WOR-QL-007` — transform each cluster → sort → positional word query;
8. `WOR-QL-008` — transform each cluster → sort → local character query.

`WOR-PROT-020` is mapped to `WOR-QL-003`; its Banking letter-cluster representation does not create a ninth root.

The permanent registry is `permanent-ql-registry.ts`.

## Source-deferred contracts

The following remain available for research/review but are not permanently allocated because recurring source support is insufficient:

- immediate predecessor / successor;
- insertion position and rank-after-insertion variants;
- predecessor after insertion;
- misplaced-word / incorrect-pair correction;
- partial-order completion;
- the hard insertion instance variant.

They remain deliberately outside canonical release until source evidence changes.

## Object pools

### Real words

- 60 families / 720 globally unique words;
- Easy: 18 families;
- Medium: 20 families;
- Hard: 22 families;
- structural common-prefix and prefix-containment coverage retained.

### Banking letter clusters

- 60 families / 720 globally unique three-letter clusters;
- Easy/Medium/Hard: 20 families each;
- five-cluster Question Studio generation with Banking-style transformation/sort pipelines.

## Runtime guarantees

- explicit case-insensitive A–Z comparator;
- deterministic seeded generation;
- independent classic lexical solver;
- separate independent Banking transformation/sort/answer solver;
- state-derived difficulty;
- exactly one marked answer and unique options;
- misconception-labelled distractors;
- multilingual logic parity;
- source-controlled regeneration (`SOURCE_GENERATOR_ONLY`).

## Shared Question Studio lifecycle

WOR-001 uses the normal shared Question Studio path:

`Question Studio Cockpit → shared capabilities/runs → shared package dispatcher → native WOR generator → shared persistence/review lifecycle`

The Studio payload carries the frozen permanent QL ID for supported prototypes while preserving prototype identity for source-level regeneration.

Current release locks remain:

- lifecycle: `REVIEW_ONLY`;
- permanent QL activation: inactive;
- Question Bank write: OFF;
- test/mock eligibility: OFF;
- public/student publication: OFF;
- automatic publication: OFF;
- human content review: pending;
- native Hindi/Punjabi sign-off: pending;
- release freeze: `PENDING_HUMAN_CONTENT_REVIEW_AND_NATIVE_SIGNOFF`.

## What remains for the user review stage

No further taxonomy, pool-expansion, generator, QL-allocation or Question Studio plumbing work is required.

After human review is completed, the remaining action is a separate explicit release checkpoint that may activate approved QLs and enable downstream Question Bank/test/public use. Until then the current technical freeze must remain intact.