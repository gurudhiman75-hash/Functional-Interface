# Notes Studio NS-002 — Source Pack

Status: implementation checkpoint on `feature/notes-studio-v1` / PR #1187.

## Purpose

NS-002 creates the research boundary that future Notes Studio evidence extraction and synthesis must use. It deliberately does not generate learner notes and does not publish anything to students.

## Canonical separation

- `content.note_authoring_jobs` owns pre-publication authoring workflow state.
- `content.source_documents` owns reusable source provenance and extraction metadata.
- `content.note_authoring_sources` owns auditable source-pack membership and inclusion state.
- `content.learning_resources(category='notes')` remains the only learner-facing notes publication model.

An authoring job may exist without a learner resource. A learner resource is created only by a later materialization checkpoint after evidence, coverage, synthesis and QA gates pass.

## Source rights policy

Supported rights bases:

- `user_supplied`
- `licensed`
- `public_domain`
- `publisher_authorized`
- `reference_only`

The first four may retain normalized extracted text. `reference_only` sources are metadata-only: source provenance, hash and extraction metadata may be stored, but extracted source text is discarded before persistence.

A source counts as generation-ready only when it is included, its retention mode is `extracted_text`, extraction succeeded, and at least 100 characters of usable text are available.

## URL ingestion

URL sources are:

- HTTPS only;
- rejected for localhost, common private-network ranges and metadata-service hosts;
- fetched with a 15-second timeout;
- capped at 4 MB;
- limited to HTML/XHTML/plain text;
- fetched without following redirects in NS-002;
- normalized to readable text in memory;
- stored according to rights policy;
- deduplicated within one authoring job by SHA-256 of normalized extracted text.

Raw HTML is never persisted.

## PDF ingestion

PDF sources reuse the repository's existing knowledge PDF ingestion path, including text-layer extraction and OCR fallback.

- uploaded bytes are processed transiently;
- the raw PDF file is not persisted by NS-002;
- an optional original HTTPS URL may be recorded;
- extraction metadata is retained;
- retained extracted text follows the same rights policy as URL sources;
- duplicates within one authoring job are detected by SHA-256 of the uploaded binary.

## Admin workflow

`Content → Notes Studio → Authoring & sources` supports:

1. Create an authoring job with topic/syllabus target, source language, depth, learner level, syllabus/PYQ emphasis and canonical exam targets.
2. Attach URL sources.
3. Upload and extract PDF sources.
4. Inspect source provenance and bounded extracted-text previews.
5. Include or exclude a source without deleting its audit history.
6. See whether the source pack has at least one generation-ready source.

The `Canonical notes` tab retains the V1 draft/publish/archive learner-resource workspace.

## Audit events

NS-002 records:

- `notes_studio.job.created`
- `notes_studio.source.attached`
- `notes_studio.source.inclusion.changed`

## Publication boundary

The API capability contract explicitly reports:

- `automaticGenerationEnabled: false`
- `automaticPublicationEnabled: false`
- `rawPdfPersisted: false`

No NS-002 endpoint creates learner content from a source pack.

## Validation

Focused contracts cover:

- rights-to-retention mapping;
- public HTTPS validation;
- HTML readable-text extraction;
- deterministic SHA-256 hashing;
- bounded source preview;
- generation-source eligibility;
- migration retention integrity;
- route mounting and publication locks;
- API production build;
- admin TypeScript validation.

## Next checkpoint — NS-003 Evidence Map

NS-003 should add immutable evidence claims/chunks derived only from included generation-ready source material, claim-to-source support links, cross-source corroboration/conflict state, and an evidence review surface. Synthesis remains disabled until the evidence graph is complete enough for the requested syllabus coverage.
