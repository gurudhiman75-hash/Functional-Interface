# Question Studio Content Engine Architecture V1

Status: MULTI-ENGINE FOUNDATION IMPLEMENTED / STANDARD LIFECYCLE WIRED

## Goal

Examtree has one Question Studio workflow. Subject families may use different generation and truth engines, but they do **not** own separate review, Question Bank, test or publication lifecycles.

The boundary is:

`subject engine -> validated generated payload -> Question Studio -> review -> Question Bank -> later test/publication gates`

## Engine families

### `quant-v4`

Deterministic mathematical and structured-reasoning generation.

Truth authority:
- structured mathematical/logical state
- canonical solver
- independent verifier
- admissibility rules

### `language-v1`

English and future language-skill generation.

Truth authority:
- curated linguistic objects/corpora
- grammar/usage rules
- lexical relations
- linguistic validators

No question may rely on an LLM as the sole authority for grammatical correctness, synonymy, antonymy, spelling or answer uniqueness.

### `knowledge-v1`

Computer Awareness, Static GK, Punjab GK and other factual-awareness domains.

Truth authority:
- curated canonical fact records
- explicit provenance
- validity windows/freshness class
- relation-aware distractor pools
- deterministic answer verification

Current Affairs may reuse the knowledge representation only after a separate dated ingestion and editorial-verification pipeline.

## Shared Question Studio outer contract

All engines expose the same outer contract:

1. packages/capabilities
2. generation request handling
3. common generated-question payload shape
4. generation context and provenance
5. deterministic replay where supported
6. engine-specific validation metadata
7. a standard Question Studio lifecycle declaration

The existing tables and routes remain the shared shell:

- `content.generation_runs`
- `content.generation_run_items`
- `content.generation_item_versions`
- existing review states
- existing bulk approval route
- existing Question Bank normalizer/converter
- existing downstream test/publication gates

## Standard lifecycle

The lifecycle is engine-agnostic and lives in `question-studio/standard-lifecycle.ts`.

### `QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1`

Use while a package is eligible for Question Studio review but not canonical Question Bank persistence.

Key state:
- `questionBankStatus = NOT_STORED`
- `questionBankWritable = false`
- manual review required
- test/mock/publication disabled

### `QUESTION-STUDIO-STANDARD-BANK-ONLY-V1`

Use when manually approved Question Studio items may enter Question Bank while downstream delivery remains locked.

Key state:
- `questionBankStatus = READY_FOR_STORAGE`
- `questionBankWritable = true`
- `questionBankAcceptanceMode = BANK_ONLY`
- manual approval required
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`
- `productionReleaseAuthorized = false`

The shared approval policy decides whether an approved generated item is review-only or Question-Bank-bound. The shared Question Bank converter performs normalization and persistence. Subject engines must not implement parallel approval or persistence routes.

## Lifecycle metadata persistence

A generated item and its stored Question Bank version preserve the standard lifecycle identity and important lifecycle flags, including:

- `lifecycleId`
- `lifecycleStage`
- review-surface requirement
- review-run persistence policy
- canonical-question persistence policy
- manual-approval requirement
- Question Bank status/writability/acceptance mode
- test/mock/publication locks
- production-release authorization

Engine-specific provenance remains additive. For `knowledge-v1`, this can include source IDs, fact IDs, solver authority, freeze fingerprints, difficulty topology and representation/convention metadata.

## Shared hierarchy

`Subject -> Chapter -> CP -> QL -> object/fact/corpus pool -> generator -> validator -> distractor builder -> realizer -> explanation -> localization -> audit -> Question Studio`

QLs represent materially different learner tasks. Surface wording changes are not separate QLs.

## Knowledge V1 canonical fact contract

A generation-eligible fact carries, as applicable:

- fact ID
- subject/chapter/CP ownership
- entity/relation/value representation
- localized labels/aliases
- source/provenance
- review status
- confidence
- freshness class: `IMMUTABLE | SLOW_MUTABLE | CURRENT | EVENT`
- validity dates
- last verification date
- exam tags
- distractor neighborhood/group

Generation rejects facts that are unreviewed, expired, outside validity bounds, missing required provenance or ambiguous for the selected QL.

## Knowledge question construction

Canonical facts/relations are the source of truth; a permanent hand-authored MCQ bank is not.

Supported learner-task surfaces may include:
- forward recall
- reverse recall
- statement identification
- multi-statement evaluation
- matching
- chronology/order
- classification
- exception/not-belonging

Every surface requires unique-answer validation. Correct-answer position is seeded/deterministic. Distractors come from semantic/confusion neighborhoods or curated misconception pools.

## Computer Awareness pilot

`COM-001 / Memory & Storage` is the first `knowledge-v1` pilot.

Current permanent scope:
- `COM-001-CP-001`
- `COM-001-QL-001..009`
- English/Hindi/Punjabi
- frozen V2 learner-facing authority
- topology-based review difficulty classifier
- standard Question Studio package registration
- standard `BANK_ONLY` lifecycle for manual Question Bank acceptance

COM-001-specific authorities validate content, localization and difficulty. They do **not** define a parallel Question Studio lifecycle.

## Static GK / Punjab GK

These should use the same `knowledge-v1` engine and standard Question Studio lifecycle, with separate taxonomies and curated knowledge repositories.

Punjab GK is a first-class subject package rather than a tag over India GK.

Facts that can change use `SLOW_MUTABLE` or `CURRENT`, not `IMMUTABLE`.

## Current Affairs

Current Affairs is not generated from unrestricted web/LLM text at runtime.

Pipeline:

`trusted source -> event candidate -> entity resolution -> structured extraction -> editorial verification -> canonical event/fact -> generation eligibility -> Question Studio`

After validation, Current Affairs enters the same standard Question Studio lifecycle as other engines.

## Language V1

Language V1 uses typed linguistic objects rather than variable-substitution stems.

Core object families include:
- token/lemma
- part of speech
- grammatical features
- clause/sentence structure
- lexical sense
- synonym/antonym relation
- collocation
- confusable/error class
- curated sentence/context corpus

After linguistic validation, language questions enter the same standard Question Studio lifecycle.

## Localization

Localization is semantic reconstruction, not blind translation.

- Quant/Reasoning localize the same mathematical/logical state.
- Knowledge facts use localized entity labels and localized realizers.
- English-language-skill questions normally preserve English as the tested object.
- Hindi/Punjabi language subjects use their own corpora/rules rather than translated English questions.

## Engine qualification vs lifecycle

These are deliberately separate concepts.

**Engine/content qualification** proves:
- answer correctness
- unique answer
- deterministic replay where applicable
- object/fact/corpus diversity
- stem diversity
- distractor integrity
- explanation quality
- localization parity
- source/provenance quality
- difficulty integrity where claimed

**Question Studio lifecycle** controls:
- review state
- manual approval
- Question Bank persistence
- test/mock eligibility
- publication

A subject-specific audit may qualify a payload to enter a lifecycle stage, but it does not create a new lifecycle state.

## Current implementation checkpoint

Branch: `feature/content-engine-foundation-v1`

Implemented:
- shared engine types and registry
- Quant V4 compatibility adapter
- `knowledge-v1` core
- engine-aware capabilities and run routing
- standard lifecycle contracts
- generic lifecycle capabilities exposure
- generic lifecycle persistence in Question Bank generation metadata
- shared approval/conversion path
- COM-001 V2 content/localization/difficulty qualification
- COM-001 standard Question Studio registration

Current downstream boundary for COM-001:
- manual Question Bank acceptance: enabled through standard `BANK_ONLY`
- test eligibility: closed
- mock-test eligibility: closed
- public/student publication: closed
- automatic publication: closed
- production release: closed

Future engines should plug into the engine seam and then declare one of the standard lifecycle stages instead of creating subject-specific lifecycle machinery.
