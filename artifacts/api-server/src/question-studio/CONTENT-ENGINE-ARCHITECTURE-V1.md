# Question Studio Content Engine Architecture V1

Status: FOUNDATION / IMPLEMENTATION STARTED

## Goal

Keep one Question Studio review, approval, persistence and analytics workflow while allowing subject families to use different truth/validation engines.

The UI contract stays common. The generation engine is selected behind it.

## Engine families

### quant-v4

Owns deterministic mathematical and structured-reasoning generation already in production development.

Truth authority:
- structured mathematical/logical state
- canonical solver
- independent verifier
- admissibility rules

### language-v1

Owns English and future language-skill question generation.

Truth authority:
- curated linguistic objects/corpora
- grammar/usage rules
- lexical relations
- linguistic validators

No question may rely on an LLM as the sole authority for grammatical correctness, synonymy, antonymy, spelling or answer uniqueness.

### knowledge-v1

Owns Computer Awareness, Static GK, Punjab GK and other factual-awareness domains.

Truth authority:
- curated canonical fact records
- explicit provenance
- validity windows/freshness class
- relation-aware distractor pools
- deterministic answer verification

Current Affairs will share the knowledge representation but must use a separate dated ingestion/verification pipeline before facts become generation-eligible.

## Shared Question Studio outer contract

All engines must expose:

1. packages/capabilities
2. generation request handling
3. generated questions in the common single-choice payload shape
4. generation context and lifecycle locks
5. deterministic replay when a seed is supplied where the engine supports generation
6. validation metadata

The existing `content.generation_runs`, `content.generation_run_items`, `content.generation_item_versions`, review states and Question Bank conversion workflow remain the shared outer shell.

## Shared hierarchy

Subject -> Chapter -> CP -> QL -> object/fact/corpus pool -> generator -> validator -> distractor builder -> realizer -> explanation -> localization -> audit -> Question Studio

QLs represent materially different learner tasks. Surface wording changes are not separate QLs.

## Knowledge V1 canonical fact contract

The old `generators/knowledge` implementation is reference-only. AI extraction endpoints remain disabled.

A new generation-eligible fact must eventually carry at least:

- factId
- subject
- chapter/topic
- CP ownership
- entity/relation/value representation
- localized labels/aliases where available
- source/provenance
- review status
- confidence
- freshnessClass: IMMUTABLE | SLOW_MUTABLE | CURRENT | EVENT
- validFrom
- validUntil
- lastVerifiedAt
- exam tags
- distractor neighborhood/group

Generation must reject facts that are unreviewed, expired, outside their validity window, missing required provenance, or ambiguous for the selected QL.

## Knowledge question construction

Do not author a permanent MCQ bank as the source of truth.

Store canonical facts/relations, then realize supported QLs such as:

- forward recall
- reverse recall
- statement identification
- true/false statement set
- pair matching
- chronology/order where a real ordered relation exists
- classification
- exception/not-belonging

Every mode requires an independent validity check and uniqueness check.

Correct-answer position must be shuffled deterministically from the seed. It must never be fixed at option 0.

Distractors must come from semantic/confusion neighborhoods or explicitly curated misconception pools, not arbitrary nearby strings.

## Computer Awareness pilot

Computer Awareness will be the first `knowledge-v1` production pilot because it is predominantly factual but has clearer ontologies than broad GK.

Initial canonical entity families:

- hardware components
- memory/storage
- input/output devices
- operating systems
- software categories
- MS Office concepts
- networking
- internet protocols
- cyber security
- databases
- programming/language basics
- computer abbreviations and standards

The first chapter should be `Computer Fundamentals / Memory & Storage`, after the shared knowledge contracts are implemented.

## Static GK and Punjab GK

These use the same `knowledge-v1` engine but separate taxonomies and curated repositories.

Punjab GK must be a first-class subject package rather than a tag layered over India GK.

Facts that appear static but can change (district counts, protected areas, office holders, scheme status, rankings, GI tags, Ramsar/UNESCO lists, etc.) must use SLOW_MUTABLE or CURRENT freshness rather than IMMUTABLE.

## Current Affairs

Current Affairs is not generated from unrestricted web/LLM text at runtime.

Pipeline:

trusted source -> event candidate -> entity resolution -> structured fact extraction -> editorial verification -> canonical event/fact record -> generation eligibility -> expiry/archive

Only verified canonical event facts reach Question Studio generation.

## Language V1 foundation

Language V1 uses typed linguistic objects rather than variable-substitution stems.

Core object families:

- token/lemma
- part of speech
- grammatical features (person/number/tense/aspect/etc.)
- clause/sentence structure
- dependency/role information where needed
- lexical sense
- synonym/antonym relation
- collocation
- confusable/error class
- curated sentence/context corpus

English implementation order:

1. grammar foundation
2. subject-verb agreement pilot
3. tense/verb-form families
4. articles/determiners/prepositions/modifiers
5. sentence correction/error detection
6. vocabulary engine
7. cloze/comprehension/ordering families

For every generated question, the validator must establish exactly one correct option for the intended reading. Ambiguous corpus items are rejected.

## Localization

Localization is semantic reconstruction, not blind translation.

- Quant/Reasoning may localize the same mathematical/logical object.
- Knowledge facts need localized entity labels and localized realizers.
- English-language skill questions normally remain English as the tested object; instructions/explanations may be localized where product design permits.
- Punjab/Hindi language subjects, when added, use their own language-engine corpora and rules rather than translations of English questions.

## Phase plan

### Phase 0 - shared engine seam (started)

- shared engine types
- engine registry
- Quant V4 compatibility adapter
- registry contract tests
- no route behavior change yet

Exit gate: existing Quant packages can be represented through the shared adapter without losing lifecycle/capability metadata.

### Phase 1 - route integration

- make Question Studio capabilities engine-aware
- keep legacy `generationSystem: quant-v4` compatibility during UI migration
- route generation through registry
- persist engineId in request snapshot/generation context
- preserve existing review and conversion behavior

### Phase 2 - knowledge-v1 core

- canonical fact schema
- freshness/validity model
- provenance/review gates
- deterministic selector
- semantic distractor contract
- answer-position shuffle
- uniqueness validator
- lifecycle policy

### Phase 3 - Computer Awareness pilot

- exhaustive chapter/CP/QL discovery for first computer chapter
- curated fact seed set
- generator + validator + distractor + realizer
- Question Studio package registration
- review audit

### Phase 4 - Static GK/Punjab GK expansion

Only after the Computer pilot proves the knowledge engine.

### Phase 5 - language-v1 core and English pilot

- linguistic types and corpus contract
- grammar rule/verifier layer
- Subject-Verb Agreement end-to-end pilot
- Question Studio package registration

### Phase 6 - Current Affairs ingestion

Build dated editorial ingestion after static knowledge generation is stable. Do not reactivate the old AI-intake route as the production source of truth.

## Freeze rules

An engine cannot be considered production-ready until it proves:

- answer correctness
- unique answer
- deterministic replay where applicable
- object/fact/corpus diversity
- stem diversity
- misconception-backed distractors
- difficulty integrity
- explanation quality
- localization parity where supported
- lifecycle locks
- batch audit and collision checks
- Question Studio review-path compatibility

## Current branch checkpoint

Branch: `feature/content-engine-foundation-v1`

Implemented in Phase 0:

- `engine-types.ts`
- `engine-registry.ts`
- `engines/quant-v4-adapter.ts`
- `engine-registry.test.ts`

Next code checkpoint: integrate `/admin/question-studio/capabilities` and `/admin/question-studio/runs` with the registry while preserving exact Quant V4 behavior.
