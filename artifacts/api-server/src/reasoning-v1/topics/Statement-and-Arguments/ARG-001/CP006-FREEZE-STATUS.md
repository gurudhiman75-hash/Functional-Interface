# ARG-001 CP006 — Immutable Freeze / Certification

Status: **FROZEN / CERTIFIED**

Freeze authority: `ARG_CP006_IMMUTABLE_FREEZE_V1`
Checkpoint: `ARG-CP-006`
Chapter: `ARG-001` — Statement & Arguments
Question Studio: **REVIEW CONNECTED**
Learner release: **LOCKED**

## Frozen chapter contract

- 6 permanent QLs: `ARG-QL-001` through `ARG-QL-006`.
- 48 source semantic templates: exactly 8 per QL.
- 8 distinct semantic archetypes per QL.
- All four answer classes represented by exactly two source authorities per QL.
- Easy / Medium / Hard authority coverage in every QL.
- Frozen source difficulty distribution: **13 Easy / 15 Medium / 20 Hard**.
- 256 semantic variants per template.
- 2,048 unique semantic surfaces per QL.
- 12,288 certified English semantic surfaces.
- 36,864 certified EN/HI/PA semantic surfaces.
- 48 Hindi overlays and 48 Punjabi overlays mapped one-to-one to the English source templates.
- Answer-class balancing and anti-gaming scheduler preserved.
- Maximum identical answer run: 2.
- Exactly 128 reversed argument presentations per source template in the certified cycle.

## Byte-level immutability

`cp006-freeze-manifest.ts` pins the exact Git blob SHA of **29 authority files** covering:

- taxonomy/types;
- CP001/CP002 English semantic authority inputs;
- CP003 saturation types, helpers, all six template banks, registry and generator;
- CP004 localization types, helpers, all six localized banks, registry and generator;
- CP005 Question Studio review adapter;
- ARG-specific shared-generation wrapper;
- ARG-specific admin Question Studio route.

`cp006-byte-freeze-proof.test.ts` recomputes Git's own blob hash for every frozen authority file. A one-byte change to any frozen authority fails CP006 unless the freeze authority/version and manifest are intentionally revised.

Documentation and proof files are not byte-pinned because they may be expanded without changing learner semantics or runtime behavior.

## Behavioral certification

The CP006 freeze proof locks:

- chapter/Ql identity;
- template identity and ordering;
- archetype uniqueness;
- answer-class distribution;
- difficulty calibration and per-QL coverage;
- semantic-surface capacity;
- Hindi/Punjabi overlay identity and parity;
- Question Studio package identity and supported languages/difficulties;
- review-only lifecycle contract;
- all downstream learner-release locks.

## Exact certification chain

The dedicated `Validate ARG-001 CP006 Immutable Freeze` workflow passed with:

1. exact frozen Git blob proof — PASS;
2. CP006 behavioral freeze contract — PASS;
3. CP005 Question Studio certification — PASS;
4. CP004 exhaustive trilingual parity — PASS;
5. CP003 saturation and anti-gaming — PASS;
6. CP002 English editorial authority — PASS;
7. production API build — PASS;
8. production admin build — PASS;
9. freeze lifecycle boundary — PASS.

The same head/merge context also passed the repository workflow-hygiene guard, branch-topology guard, Question Studio route-registry validation and Render production build.

## Lifecycle boundary after CP006

CP006 certifies the chapter and its review runtime. It **does not** grant learner delivery.

The following remain closed:

- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner publication.

Manual editorial review remains required inside Question Studio.

Any later learner release must be a separate, explicit release checkpoint/approval. Any later semantic, localization, difficulty, answer-authority, scheduler or ARG-specific review-runtime change must intentionally supersede `ARG_CP006_IMMUTABLE_FREEZE_V1`; it must not mutate this frozen authority silently.
