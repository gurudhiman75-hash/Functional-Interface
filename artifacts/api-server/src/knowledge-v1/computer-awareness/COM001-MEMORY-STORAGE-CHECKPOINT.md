# COM-001 / CP-001 Memory & Storage — Implementation Checkpoint

Status: V2 CONTENT/LOCALIZATION FROZEN / QUESTION STUDIO STANDARD LIFECYCLE WIRED / BANK_ONLY / TEST-PUBLICATION CLOSED

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

## Editorial authority

The 77 raw candidate facts were resolved as:

- 73 approved
- 3 held
- 1 rejected (`com001-sram-layer`)

Held/rejected facts cannot leak into permanent synthesis.

V2 learner-facing changes were human reviewed and include:
- grammar-safe QL-002/003 explanations
- forward/inverse or matched-pair surfaces across QL-001..005
- exam-style QL-007 weighting with RDX removed from learner-facing options
- traditional competitive-exam 1024 capacity convention separated from strict SI/IEC mode in QL-009

## Frozen learner-facing authority

English V2:
- 9 QLs × 40 seeds = 360 audited questions
- deterministic replay
- unique answers
- answer-position spread
- stem/object diversity
- source/fact integrity

Hindi/Punjabi V2:
- 9 QLs × 40 seeds × 2 languages = 720 parity-audited questions
- semantic state, source facts, option order and correct index remain invariant from English

Historical V1 authorities remain preserved for audit history.

## Difficulty

Difficulty is derived after canonical V2 generation from cognitive topology rather than authored independently.

Audited 360-question English V2 distribution:
- Easy: 146
- Medium: 134
- Hard: 80

Difficulty remains provenance/review metadata and does not itself authorize test or production delivery.

## Question Studio integration

COM-001 uses `knowledge-v1` for generation/validation and the **existing shared Question Studio lifecycle** for review and persistence.

There is no COM-specific approval/persistence lifecycle.

Flow:

`knowledge-v1 -> validated COM-001 payload -> Question Studio run -> existing review states -> existing approval route -> existing Question Bank converter`

The current standard lifecycle is:

`QUESTION-STUDIO-STANDARD-BANK-ONLY-V1`

It allows a manually approved Question Studio item to be stored in Question Bank while downstream delivery remains locked.

Current lifecycle state:
- review surface required: yes
- manual approval required: yes
- Question Bank status: `READY_FOR_STORAGE`
- Question Bank writable: yes
- acceptance mode: `BANK_ONLY`
- test eligibility: no
- mock-test eligibility: no
- public/student publication: no
- automatic publication: no
- production release: no

The Computer review panel uses the generic generation and bulk-review APIs. `Approve to Question Bank` is therefore the existing Question Studio approval/conversion path, not a Computer-specific route.

## Question Bank normalization/provenance audit

A 270-question audit (9 QLs × 3 languages × 10 seeds) sends real COM-001 output through the shared Question Bank normalizer and requires:

- unchanged stem/options/correct answer/explanation/difficulty
- standard lifecycle identity preserved
- all downstream locks preserved
- zero loss of required COM provenance

COM provenance currently checked includes:
- source IDs
- source fact IDs
- solver authority
- content authority version
- English freeze authority/fingerprint
- localization freeze authority/fingerprint
- difficulty classifier version/topology/rationale
- relational surface mode
- capacity convention

The shared normalizer also stores generic lifecycle metadata such as lifecycle ID/stage, approval requirement and persistence/release flags.

## Composite backup authority

`COM-001-QL-007` solves over source-backed device profiles rather than encoding brittle claims such as `tape = best backup`.

The V2 learner-facing realizer emphasizes exam-familiar magnetic-tape backup/archive questions while retaining canonical profile validation.

## Multi-statement authority

`COM-001-QL-008` uses the independent `knowledge-v1/composition-verifier.ts`:

`canonical facts -> statement claims -> truth vector -> combination options -> unique answer verification`

The realizer is not trusted to supply truth labels.

## Lifecycle vs content authority

COM-specific freezes and audits qualify the **content**.

Question Studio's standard lifecycle controls:
- review states
- manual approval
- Question Bank persistence
- later test/mock eligibility
- later publication

Do not create a new COM-specific lifecycle authority for future Computer chapters. COM-002 onward should reuse the same engine seam and standard lifecycle contracts.

## Current safety boundary

Open:
- deterministic V2 generation in Question Studio
- EN/HI/PA review
- topology difficulty filtering for review
- manual Question Bank acceptance through standard `BANK_ONLY`

Still closed:
- scored-test eligibility
- mock-test eligibility
- public/student publication
- automatic publication
- production release

Source-controlled regeneration remains disabled; issues are corrected in canonical fact/generator/localization source and a fresh review batch is generated.
