# Notes Studio architecture — V1 foundation

## Goal

Notes Studio is the authoring system for Examtree's static and exam-oriented learning notes. It should turn a syllabus target plus a multi-source research pack into an original, source-grounded, exam-ready note that can be reviewed, localized and published without manual re-entry.

The studio must not create a second publishing model. The canonical learner-facing output remains `content.learning_resources` with `category = 'notes'`, using the existing draft -> publish -> archive lifecycle, exam targeting, language catalogue and audit trail.

## Product principles

1. **Syllabus-first, not source-first.** The note brief is anchored to a canonical subject/topic or exam requirement. Sources exist to support coverage, not define the structure.
2. **Multi-source synthesis.** A note should be authored from a source pack, not rewritten from one article, book or PDF.
3. **Provenance before generation.** Extracted claims retain source references and hashes so factual QA can prove what supports each section.
4. **Original Examtree expression.** Generation should synthesize, compress and reorganize concepts in Examtree's style rather than reproduce source wording.
5. **Exam relevance is a gate.** A fact can be true and still not belong in an exam note. Coverage, PYQ relevance and recall value are explicit checks.
6. **English/source-language freeze before localization.** The canonical source note is reviewed first; translated variants should be generated only from the frozen source version.
7. **Immutable publication.** Published notes remain frozen. Corrections create replacement drafts or new versions instead of mutating learner history.

## End-to-end workflow

### 1. Brief

Inputs:
- canonical subject/topic/taxonomy node
- exam targets
- language
- desired depth: quick revision / standard / comprehensive
- learner level
- optional PYQ or syllabus emphasis
- authoring policy version

Output: `NoteAuthoringBrief`.

### 2. Source pack

Supported source classes:
- official syllabus / notification / government source
- textbook or reference PDF
- uploaded document
- approved website/article
- newspaper/current-affairs source when a static note needs an update
- existing Examtree content

Each source is normalized into a shared source-document contract so the current-affairs architecture and Notes Studio can reuse the same ingestion layer.

Required source metadata:
- source type
- canonical URI or object-storage key
- title and publisher
- capture timestamp
- content hash
- extraction status
- rights / usage classification where applicable
- extracted text or structured blocks

### 3. Evidence map

The pipeline should extract atomic claims and map them to sources before prose generation.

For every candidate claim retain:
- normalized claim text
- source document ids
- source locations/pages where available
- confidence / extraction quality
- duplicate cluster
- contradiction flag
- recency / supersession flag for time-sensitive facts

This layer is what allows a generated note to be factual without exposing source prose to learners.

### 4. Coverage plan

Before drafting, create an outline against the canonical topic and expected exam coverage.

Checks:
- syllabus concepts covered
- prerequisite concepts present
- PYQ/high-frequency subtopics represented
- low-value tangents excluded
- appropriate note depth
- tables / examples / memory aids identified where useful

Output: ordered section plan with section goals and evidence ids.

### 5. Synthesis

Generate section-by-section rather than one giant prompt.

The synthesis runner receives:
- brief
- section goal
- approved evidence claims only
- Examtree style policy
- terminology policy
- already-generated neighboring sections to avoid repetition

The runner returns structured section output, not just free text:
- heading
- markdown body
- key facts
- examples / tables
- common traps
- memory aids
- evidence claim ids used

### 6. Quality gates

A note is not review-ready until the automated gate set passes.

Minimum gates:
- **Evidence support:** meaningful factual claims are traceable to evidence.
- **Contradiction:** no unresolved conflicting claims.
- **Coverage:** required syllabus/outline nodes are represented.
- **Exam relevance:** excessive low-value content is flagged.
- **Internal consistency:** terminology, dates, numbers and definitions agree across sections.
- **Originality/overlap:** detect suspiciously close source phrasing and close overlap with existing Examtree notes.
- **Readability:** section density, heading hierarchy and revision usability.
- **Duplication:** repeated facts/sections collapsed.
- **Formatting:** valid Markdown/table structures and safe links/media.

Quality checks should produce findings and scores; they should not silently mutate the draft.

### 7. Human review

Reviewer sees:
- learner preview
- outline/coverage map
- evidence support panel
- QA findings
- source overlap findings
- generation history

Reviewer can edit the canonical draft, rerun a section, or reject a source/claim.

### 8. Canonical draft + publish

When approved, the assembled Markdown is saved to the existing learning-resource API as:
- `category = 'notes'`
- `format = 'article'` (or document/PDF where deliberately used)
- canonical language
- exam ids
- learner-facing title and summary
- body Markdown

The existing publication endpoint remains the final learner-release gate.

### 9. Localization

After source-language freeze:
- create translation jobs from the frozen note version
- apply terminology glossary and script policy
- preserve tables, numbers, formulas and named entities
- run semantic parity QA
- review and publish localized resource versions

The long-term model should link localized resources to a stable note family/version instead of treating them as unrelated documents.

## Proposed shared authoring data model

Do not add these tables until the shared current-affairs ingestion contract is reconciled. The important boundary is that source ingestion should be reusable across content pipelines.

### Shared source layer

`content.source_documents`
- `id`
- `source_type`
- `source_uri`
- `title`
- `publisher`
- `captured_at`
- `content_hash`
- `extraction_status`
- `extracted_text`
- `metadata jsonb`

`content.source_claims`
- `id`
- `normalized_claim`
- `claim_type`
- `time_sensitivity`
- `metadata jsonb`

`content.source_claim_evidence`
- claim/source mapping
- page/block/location metadata
- support/contradiction relation

### Notes authoring layer

`content.note_authoring_jobs`
- stable job id
- brief json
- source language
- state
- target learning-resource id when materialized
- created/updated actor and timestamps

`content.note_authoring_sources`
- job/source mapping
- inclusion state
- relevance score

`content.note_sections`
- job id
- ordered section key
- outline goal
- generated Markdown
- state
- generation version/hash

`content.note_section_claims`
- section/claim mapping

`content.note_quality_checks`
- job or section id
- check key
- state
- score
- structured findings
- checker version

`content.note_generation_events`
- job/section id
- provider/model identifier
- prompt-policy version
- input/output hashes
- token/latency/cost metadata where available
- success/failure state

## State machine

Recommended authoring states:

`brief` -> `sources_ready` -> `evidence_ready` -> `outline_ready` -> `drafting` -> `qa_required` -> `review_ready` -> `approved` -> `materialized`

Failure/rework states are represented by findings and stage retries rather than destructive rewinds.

The canonical learner resource maintains its separate existing lifecycle:

`draft` -> `published` -> `archived`

## V1 implementation in this branch

This branch deliberately starts at the canonical boundary:
- first-class `/content/notes-studio` admin route
- Notes Studio navigation entry
- Notes-only inventory
- create/edit canonical note drafts
- language and exam targeting from canonical catalogues
- publish/archive through existing audited resource endpoints
- visible pipeline stages showing which automation layers are next

This gives the automated pipeline a stable output contract before source ingestion and model execution are introduced.

## Next implementation slices

### NS-002 — Source pack contract
- reconcile with current-affairs ingestion design
- define shared source-document types and API
- allow URL/PDF/upload attachment to a note authoring job
- extraction status and source preview

### NS-003 — Evidence + coverage
- claim extraction/deduplication
- topic/taxonomy brief
- outline generation
- coverage matrix

### NS-004 — Section synthesis
- provider-agnostic model runner
- versioned prompt/style policies
- section-by-section generation and regeneration
- deterministic assembly into canonical Markdown draft

### NS-005 — QA gates
- evidence support
- contradiction/recency
- source overlap/originality
- exam relevance
- coverage and duplication
- reviewer findings workflow

### NS-006 — Localization + versioning
- stable note family/version model
- localization jobs
- terminology policy
- parity QA
- learner-facing language variants

## Non-goals for V1

- no fake AI generation in the browser
- no source material stored in learner-facing Markdown
- no duplicated notes publishing table
- no automatic publication
- no silent rewriting of published notes
