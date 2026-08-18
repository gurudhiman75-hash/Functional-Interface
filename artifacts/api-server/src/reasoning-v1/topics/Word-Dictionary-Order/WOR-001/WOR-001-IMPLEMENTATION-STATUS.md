# WOR-001 Implementation Status — Technical Chapter Freeze

Date: 2026-08-18

## Current maturity

`TECHNICALLY_COMPLETE_PERMANENT_QLS_ALLOCATED_INACTIVE_HUMAN_REVIEW_PENDING`

WOR-001 has completed its chapter-design, source-governance, content-pool, generator, multilingual automation, verification and shared Question Studio implementation work.

The only remaining gates are human editorial/release gates. They are intentionally not represented as completed.

## Frozen technical authority

- 5 checkpoints;
- 24 executable prototypes / 20 task kinds;
- 8 permanent QL roots allocated as stable inactive IDs;
- 15 prototypes mapped to those roots;
- 9 source-deferred/research prototypes remain executable but unallocated;
- 60 real-word families / 720 globally unique words;
- real-word split: 18 Easy / 20 Medium / 22 Hard;
- 60 Banking cluster families / 720 globally unique clusters;
- Banking split: 20 Easy / 20 Medium / 20 Hard;
- classic four-option and Banking five-option profiles;
- EN/HI/PA student-facing generation;
- independent classic and Banking verification;
- editorial remediation retained;
- shared Question Studio path connected.

## Permanent QL allocation

The source/ownership audit's eight-root recommendation is now frozen as:

1. `WOR-QL-001` — Complete dictionary order — root `WOR-PROT-001`;
2. `WOR-QL-002` — Endpoint after ordering — root `WOR-PROT-003`;
3. `WOR-QL-003` — Word/cluster at a specified position — root `WOR-PROT-005`;
4. `WOR-QL-004` — Position of a specified word — root `WOR-PROT-006`;
5. `WOR-QL-005` — Sort → concatenate → global character — root `WOR-PROT-021`;
6. `WOR-QL-006` — Sort → ranked cluster → local character/alphabet offset — root `WOR-PROT-022`;
7. `WOR-QL-007` — Transform each → sort → positional word query — root `WOR-PROT-023`;
8. `WOR-QL-008` — Transform each → sort → local character query — root `WOR-PROT-024`.

Allocation is **inactive identity allocation**, not release approval. Every registry entry explicitly remains:

- `PERMANENT_ID_ALLOCATED_INACTIVE`;
- human content review pending;
- native human sign-off pending;
- Question Bank write false;
- test/mock eligibility false;
- public publication false.

`WOR-PROT-020` maps to `WOR-QL-003` because Banking plain-cluster position is the same learner solve contract as classic kth-position selection.

## Source-deferred posture

The chapter keeps nine executable prototype instances without permanent QL identity:

- `WOR-PROT-007` / `008` — predecessor/successor;
- `WOR-PROT-010` … `015` — insertion/correction/partial-order research contracts;
- `WOR-PROT-019` — hard insertion instance variant.

These all descend from eight source-deferred solve contracts identified by the source audit. They stay review/research-only unless stronger recurring exam evidence is added later.

## Shared Question Studio integration

WOR-001 now uses only the existing shared Question Studio architecture:

`Question Studio Cockpit → shared capabilities + /runs → shared package dispatcher → native WOR generator → shared persistence/review queue`

There is no WOR-specific Question Studio panel, admin client, generation route or lifecycle router.

Shared behavior includes:

- package discovery/capabilities;
- run creation and persistence;
- immutable item versions;
- quality and duplicate analysis;
- review decisions;
- generic regeneration routed back to the native WOR generator;
- generic `SOURCE_GENERATOR_ONLY` revision enforcement.

Supported prototypes carry their frozen QL ID in Question Studio review/persistence payloads. Prototype identity is retained separately for source-level regeneration traceability.

## Release locks

The technical freeze deliberately keeps the chapter non-releasable:

- lifecycle: `REVIEW_ONLY`;
- Question Bank: `NOT_STORED`;
- Question Bank writable: false;
- test eligibility: `INELIGIBLE`;
- test eligible: false;
- mock test eligible: false;
- publicly publishable: false;
- automatic student publication: false;
- manual approval required: true;
- human content review: pending;
- native Hindi/Punjabi human sign-off: pending;
- release freeze: `PENDING_HUMAN_CONTENT_REVIEW_AND_NATIVE_SIGNOFF`.

Question Studio visibility and permanent QL identity therefore do not mean release eligibility.

## Automated evidence retained

### Classic runtime

- 6,840 localized generations;
- balanced four answer positions;
- all 60 real-word families reached;
- independent solver parity passed.

### Real-word saturation

- 60 families / 720 words;
- all family/token/ID uniqueness gates passed;
- Easy shared-prefix realism remediation retained.

### Banking runtime and reservoir

- 1,980 localized Banking generations in the full audit;
- all five Banking task kinds exercised;
- all explicit transform operators covered;
- five answer positions covered;
- 60 families / 720 clusters;
- independent transform/sort/answer parity passed.

### Question Studio

- all 24 prototypes exercised through the review authority;
- EN/HI/PA supported;
- source-generator-only correction policy enforced;
- shared package dispatch validated;
- release locks asserted in persisted payload contracts.

## Remaining human/release gates

1. User/human English content sampling and approval.
2. Native Hindi and Punjabi human editorial sign-off.
3. Explicit release checkpoint after those reviews.
4. Only at that checkpoint may approved QLs be activated for Question Bank/test/mock/public use.

No further chapter taxonomy, generator, pool expansion, permanent QL allocation or Question Studio plumbing is required before the user's later review.