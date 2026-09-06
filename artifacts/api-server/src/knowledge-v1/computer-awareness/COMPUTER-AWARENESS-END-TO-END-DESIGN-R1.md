# Computer Awareness — End-to-End Design R1

Status: DESIGN COMPLETE / KNOWLEDGE-V1 PILOT TARGET

## 1. Authority and intent

Computer Awareness is the first production pilot for `knowledge-v1`.

It is deliberately used before broad Static GK because the subject has clearer ontologies, better semantic distractor neighborhoods and fewer mutable facts.

Current external syllabus anchor checked during design:
- Staff Selection Commission CGL 2026 notice, Section III Computer Knowledge Test
- scope explicitly covers computer basics/organization/CPU/I-O/memory/backup devices/ports/Windows Explorer/keyboard shortcuts; Windows and Microsoft Office; Internet/e-mail/e-banking; networking devices/protocols; security threats and preventive measures

Legacy repository evidence:
- the old `generators/knowledge` repository contains only a tiny illustrative Computer set (ALU, RAM, router, Trojan)
- those records are reference-only and are not automatically migrated into generation eligibility
- every migrated fact must pass the new provenance, review, freshness and validity contract

## 2. Subject ownership

`Computer Awareness` owns factual and conceptual computer-knowledge questions normally expected in SSC, banking and Punjab-state objective examinations.

It does not own:
- practical typing-speed tests
- live spreadsheet execution tasks
- programming/coding assessments requiring executable code
- deep CS degree-level algorithms unless a target exam explicitly requires them
- current technology/news questions whose correctness is date-dependent; those belong to dated knowledge/current-affairs ingestion

## 3. Proposed chapter map

The chapter map is an ownership scaffold, not a permanent QL allocation.

### COM-001 — Computer Fundamentals & Architecture
Candidate CP families:
- computer organization and functional units
- CPU and processor components
- input devices
- output devices
- memory hierarchy and memory characteristics
- storage and backup devices
- ports/interfaces/connectors
- basic data/unit terminology where supported by target syllabi/PYQs

### COM-002 — Operating Systems, Files & Windows
Candidate CP families:
- OS purpose/functions
- common OS classifications
- files/folders/extensions
- Windows interface and Windows Explorer
- basic system utilities
- keyboard/OS shortcuts where the learner task is operational rather than Office-specific

### COM-003 — Office & Productivity Software
Candidate CP families:
- MS Word
- MS Excel
- PowerPoint
- common Office concepts
- file formats/extensions
- common commands and shortcuts
- spreadsheet terminology/functions at awareness-exam depth

### COM-004 — Internet, Web, E-mail & Digital Services
Candidate CP families:
- internet/web concepts
- browsers/search/download/upload
- URLs/domains/web terminology
- e-mail fields/protocol-level awareness where exam relevant
- e-banking/digital-service safety basics

### COM-005 — Networking
Candidate CP families:
- network types/topologies where exam relevant
- networking devices
- basic protocols
- addressing/basic networking terminology
- transmission/media concepts at awareness depth

### COM-006 — Cyber Security
Candidate CP families:
- malware families
- hacking/phishing/social-engineering concepts
- authentication/password/security practices
- firewall/antivirus/preventive controls
- information-security terminology

### COM-007 — Software, Languages & Database Basics
Candidate CP families:
- system vs application software
- utilities/drivers/firmware
- language-generation/classification facts where exam relevant
- compiler/interpreter/assembler concepts
- database/DBMS fundamentals at awareness depth

## 4. First production discovery target

First target: `COM-001 / Memory & Storage`.

Reason:
- explicit SSC syllabus ownership
- high exam frequency across general competitive-exam materials
- rich but controlled ontology
- excellent semantic distractor neighborhoods
- supports forward recall, reverse recall, classification, statement identification and comparison without requiring current-affairs freshness
- allows proof of object/fact diversity before broadening the engine

No permanent QLs are allocated at this design checkpoint.

## 5. Discovery method for COM-001 Memory & Storage

Discovery must collect and merge learner tasks from:
- official syllabus language
- PYQ/sample-question evidence available to the project
- trusted reference material
- existing legacy fact inventory only as gap hints

Candidate solve-mode inventory should explore, without pre-freezing QLs:
- identify volatile/non-volatile memory
- classify primary/secondary/cache/register/storage forms
- identify characteristic from device/type
- identify device/type from characteristic
- hierarchy/speed/capacity ordering where the ordering is unambiguous at exam depth
- purpose/function mapping
- access-method facts where syllabus/PYQ supported
- storage-medium classification
- units/capacity relationships where owned here rather than Quant/Number System
- statement correctness / incorrect statement
- odd-one-out/classification
- pair/match forms
- full-form/abbreviation only when the learner task materially differs from ordinary classification

Discovery must merge surface variants. Example: `Which memory is volatile?` and `Which memory loses data when power is removed?` are usually the same learner task, not separate QLs.

## 6. Canonical fact model

Every production fact must use `knowledge-v1/types.ts` and carry:
- factId
- entityId
- subject
- chapterId
- cpId
- relation
- canonical/localized entity labels
- typed value
- semantic context group
- distractor group(s)
- difficulty
- exam tags
- source/provenance
- editorial review status/confidence/timestamp
- freshness class and validity metadata

A fact is not generation-ready merely because text exists in the repository.

## 7. Freshness rules for Computer

Most foundational Computer facts are `IMMUTABLE` or `SLOW_MUTABLE`.

Examples:
- RAM being volatile: IMMUTABLE for exam purposes
- meaning of ALU: IMMUTABLE
- currently supported Windows/Office-version-specific feature: SLOW_MUTABLE or CURRENT depending on wording
- latest protocol/version/product-market fact: CURRENT and generally avoid unless target exam requires it

Question wording should prefer durable conceptual truth over version-sensitive trivia unless PYQ evidence justifies the latter.

## 8. QL contract

A permanent Computer QL must represent a materially different learner task.

Each QL eventually defines:
- CP ownership
- relation(s) accepted
- solve/recall mode
- fact eligibility predicate
- canonical answer renderer
- stem families
- explanation families
- distractor semantics
- difficulty controls
- localization policy
- validator expectations

A different sentence template is not a new QL.

## 9. Distractor policy

No arbitrary random wrong options.

Distractors must be selected from strong semantic neighborhoods such as:
- same memory/storage class
- same CPU/component class
- same device family
- common confusion pair
- same protocol/device category
- explicitly curated misconception group

`knowledge-v1/distractors.ts` fails generation if it cannot find enough strong, distinct distractors.

## 10. Answer-position policy

Correct answer position is deterministically shuffled from the seed.

It must never be permanently option A or any other fixed index.

Replay with the same:
- package
- QL/CP selection
- seed
- asOf
- corpus version
must produce the same question structure.

## 11. Verification

Generation is rejected unless:
- target fact is generation-eligible
- distractor facts are generation-eligible
- options are non-empty and unique after normalization
- exactly one option equals the canonical answer
- correctIndex points to that answer
- explanation is present
- provenance is attached

For higher-complexity modes such as matching/chronology, mode-specific independent verifiers must be added before those modes become production eligible.

## 12. Explanation policy

Computer explanations should be concise and educational, not merely repeat the answer.

Preferred structure:
1. identify the tested object/concept
2. state the defining property/function
3. connect that property to the correct option
4. optionally distinguish the most tempting misconception when useful

Avoid generic boilerplate such as `Option B is correct because it is the correct answer`.

## 13. Localization

Knowledge localization is not blind question translation.

Canonical facts may carry localized labels/aliases. Realizers build the question in the target language using the same underlying fact.

For technical terms:
- preserve standard English acronyms where exams commonly use them
- localized explanatory wording may accompany them
- do not invent Hindi/Punjabi translations that make the technical term less recognizable than the exam-standard form

Language coverage is declared per package/QL and must be audited before activation.

## 14. Difficulty

Difficulty is driven by learner demand, not obscure trivia.

Possible controls:
- direct vs reverse retrieval
- closeness of distractors
- number of simultaneously tested attributes
- statement-set reasoning
- hierarchy/comparison depth
- less familiar but syllabus-relevant entities

Do not create Hard questions simply by using obsolete hardware facts, obscure acronyms or awkward wording.

## 15. Corpus/object-pool requirements

Before a Memory & Storage QL is frozen, its fact pool must prove:
- sufficient distinct entities
- sufficient distinct canonical answer values
- at least three strong distractors for every admissible target
- no answer ambiguity
- no dominance by RAM/ROM-only examples
- no repeated stem shell masquerading as diversity

Batch audits must measure:
- entity repetition
- answer repetition
- correct-index distribution
- stem-family distribution
- semantic-neighborhood reuse
- content fingerprints/collisions

## 16. Legacy migration rule

The old Computer facts are not trusted wholesale.

Migration flow:
legacy fact -> ownership mapping -> source re-check -> canonical typed relation/value -> freshness classification -> editorial approval -> eligibility gate -> production repository

AI extraction is not an approval mechanism.

## 17. Question Studio lifecycle

Computer packages will register through a `knowledge-v1` adapter only after the first pilot passes its gates.

Initial lifecycle:
- runtime: Question Studio review
- manual approval required
- no automatic student publication
- Question Bank/test eligibility determined by explicit package lifecycle state

The multi-engine route facade already preserves the existing Quant path while reserving non-Quant packages for their registered engine.

## 18. Implementation checkpoints

### CP0 — knowledge-v1 foundation
- canonical fact types
- provenance/review/freshness eligibility
- deterministic selection/shuffle
- semantic distractor selection
- unique-answer validator
- generic knowledge engine
- CI

### CP1 — COM-001 Memory & Storage discovery
- source inventory
- candidate learner tasks
- solve-mode/recall-mode inventory
- merge/split audit
- provisional QL discovery only

### CP2 — canonical Memory & Storage corpus
- source-verified fact records
- semantic groups
- misconception groups
- exam tags
- localization labels where available

### CP3 — first executable QLs
- realizers
- independent validators
- explanation families
- difficulty model
- deterministic replay

### CP4 — diversity and exam-readiness audit
- large-batch audit
- stem/object/distractor diversity
- PYQ coverage audit
- duplicate/collision audit

### CP5 — localization
- Hindi/Punjabi semantic parity where package policy requires
- technical-term editorial review

### CP6 — Question Studio registration
- `knowledge-v1` adapter registration
- review lifecycle
- Question Bank locks
- production package remains manually reviewed

## 19. Freeze gate

`COM-001 Memory & Storage` cannot freeze until it proves:
- exhaustive learner-task discovery for target exams
- source-backed canonical corpus
- freshness/provenance eligibility
- unique answers
- strong semantic distractors
- deterministic replay
- non-fixed answer position
- adequate object and stem diversity
- difficulty integrity
- explanation quality
- localization parity for enabled languages
- Question Studio review-path compatibility
- batch collision and exam-readiness audits

## 20. Immediate next work

Do not allocate permanent QLs yet.

Next executable task: build `COM-001 Memory & Storage` discovery inventory and corpus requirements, then review merge/split boundaries before naming permanent QLs.
