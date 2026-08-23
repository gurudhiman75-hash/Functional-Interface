# COM-001 / CP-001 Memory & Storage — Implementation Checkpoint

Status: PERMANENT QL TAXONOMY ALLOCATED / EDITORIAL SYNTHESIS IMPLEMENTED / RUNTIME CLOSED

## Permanent ownership

- Chapter: `COM-001` — Computer Fundamentals & Architecture
- CP: `COM-001-CP-001` — Memory & Storage
- Permanent QLs: `COM-001-QL-001..009`

### Allocated learner tasks

1. `COM-001-QL-001` — Memory Volatility & Data Retention
2. `COM-001-QL-002` — Memory & Storage Layer Classification
3. `COM-001-QL-003` — Memory & Storage Function Mapping
4. `COM-001-QL-004` — Memory & Storage Subtype Discrimination
5. `COM-001-QL-005` — Storage Medium & Technology Classification
6. `COM-001-QL-006` — Broad Memory Hierarchy Ordering
7. `COM-001-QL-007` — Backup Device Constraint Selection
8. `COM-001-QL-008` — Memory & Storage Multi-Statement Evaluation
9. `COM-001-QL-009` — Computer Data Capacity Units

These IDs were allocated only after executable discovery, PYQ evidence mapping, merge/split audit, corpus breadth gates, a composite backup solver and an independent multi-statement verifier.

## Explicitly not allocated

The following discovery surfaces remain outside the permanent QL taxonomy:

- standalone access-method QL — held for stronger target-exam evidence
- abbreviation expansion — retained as corpus/support data, held as a standalone learner task
- matching — held pending target-exam evidence and a dedicated matching verifier
- virtual memory — held pending stronger target-exam evidence
- pairwise technology comparison split product — held for evidence
- simple correct/incorrect statement wording — realizer surface, not a separate QL

## Corpus checkpoint

Current review-only candidate fact corpus: 77 canonical fact candidates.

The facts are source-backed and structurally audited but remain `REVIEW_REQUIRED`; none is production generation-eligible.

Hypothetical-approval breadth audit passes these simple relation families:

- volatility
- memory-layer classification
- function/purpose
- subtype membership
- storage medium
- broad memory hierarchy
- abbreviation expansion support pool
- capacity-unit relationships

The remaining raw corpus requirement failures are intentional:

- access method — held learner task
- virtual memory — held learner task
- backup role — replaced for the allocated backup QL by the richer storage-device profile solver

## Composite backup authority

`COM-001-QL-007` does not encode brittle facts such as `tape = best backup`.

It solves over source-backed device profiles with properties such as:

- storage medium
- access pattern
- removability
- persistence
- backup/archive/recovery roles

The canonical magnetic-tape constraint set is independently required to resolve to exactly one profile.

All composite-profile sources must exist in the COM-001 source-authority registry.

## Multi-statement authority

`COM-001-QL-008` uses the generic `knowledge-v1/composition-verifier.ts`.

Flow:

canonical facts -> statement claims -> independent truth vector -> candidate combination options -> unique combination-answer verification

The question author/realizer is not trusted to supply the truth labels or correct combination.

## Editorial synthesis

All nine QLs have deterministic review-only synthesis.

Review outputs are explicitly marked:

- `reviewOnly: true`
- `runtimeRegistered: false`

The aggregate audit generates 40 seeded questions per QL (360 total) and checks:

- deterministic replay
- exactly four unique options
- canonical answer at the declared correct index
- non-fixed correct-answer position
- stem diversity
- answer/object diversity
- source provenance
- held virtual-memory facts cannot leak into QL-003
- ambiguous universal `KB = 1024` wording is not generated

## Source-quality safeguards

Source authority is scoped per relation family rather than granted to an entire publisher.

One IBM primary-vs-secondary-storage page remains explicitly rejected because a reviewed indexed version exposed an incorrect DRAM-volatility statement. A separate IBM primary-storage page may be used only for the exact claims independently reviewed there.

Capacity facts distinguish SI decimal prefixes from IEC binary prefixes. Universal ambiguous `KB = 1024 bytes` truth is not part of the canonical corpus.

## Gates still closed

This checkpoint does NOT mean production release.

Still closed:

- editorial fact approval
- Question Studio `knowledge-v1` package registration for COM-001
- Hindi localization
- Punjabi localization
- Question Bank persistence from COM-001
- scored-test eligibility
- public/student publication

## Next production sequence

1. dedicated CI green on the complete foundation + 360-question review audit
2. editorial review of source-backed candidate facts and review-question samples
3. promote approved canonical facts to permanent `COM-001-CP-001` ownership
4. implement/freeze English realizers and explanation families
5. localization to Hindi/Punjabi where product policy supports it
6. register the disabled/review-only Question Studio package
7. Question Studio batch audit
8. only then open Question Bank/test/publication gates through explicit lifecycle approval
