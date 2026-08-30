# Notes Studio NS-010 — Governed Source Library and Recommendations

## Purpose

NS-010 removes repeated source-upload/refetch work without weakening Notes Studio's provenance, rights, evidence or publication boundaries.

`content.source_documents` already acts as the canonical governed source registry. NS-010 reuses that registry directly instead of introducing another source table or copying retained source bodies.

## Source library

The admin Source Library provides metadata-first search across governed sources by title, publisher and source URI.

Returned library rows contain source metadata, rights/retention state, extraction status and prior Notes Studio usage counts. Raw retained source bodies are not returned by the library endpoint.

Editors can explicitly request the existing bounded source preview endpoint when they need to inspect retained text.

## Recommendations

Recommendations are derived only from sources that were previously **included** in another Notes Studio authoring job.

Ranking is deterministic:

1. prior use on the same canonical taxonomy node;
2. prior use with the same canonical taxonomy code;
3. prior use with the same Notes Studio topic label;
4. bonus weight for approved/materialized prior use;
5. a small bonus when the governed source is already generation-ready.

Unrelated sources receive no recommendation score. Sources already attached to the target job are excluded.

At most 25 recommendations are returned for one authoring job.

## Rights and generation readiness

A source is generation-ready only when:

- `retention_mode = 'extracted_text'`;
- `extraction_status = 'processed'`; and
- at least 100 retained characters are available.

Reference-only / metadata-only sources remain reusable as provenance but are never presented as generation-ready evidence sources.

## Reuse action

Reusing a source creates only a new `content.note_authoring_sources` membership row pointing to the existing governed `content.source_documents` row.

It does **not**:

- copy the source body;
- refetch a URL;
- re-upload a PDF;
- mutate the source's rights basis or retention mode;
- accept evidence;
- start evidence extraction;
- generate note sections;
- approve learner wording;
- materialize or publish a learner resource.

The action is audited as `notes_studio.source.reused` and is idempotent for an already-attached source.

Approved/materialized authoring jobs remain frozen and reject source reuse; editors must create a successor revision first.

## Admin workflow

The Notes Studio hub adds **Source library** beside Syllabus planning and Brief & sources.

Editors can:

1. choose a target authoring job;
2. inspect ranked recommendations;
3. search the global governed source library;
4. preview retained text explicitly when available;
5. reuse a source into the selected job.

## Data model

NS-010 adds no migration and no new persistence model. It intentionally reuses:

- `content.source_documents`;
- `content.note_authoring_sources`;
- `content.note_authoring_jobs`;
- `content.note_approved_versions`;
- `platform.audit_events`.

## Safety invariants

- Raw source bodies are never returned from library or recommendation endpoints.
- No network fetch occurs in NS-010 reuse/recommendation routes.
- Reuse never inserts a new `content.source_documents` record.
- Rights/retention metadata remains attached to the original governed source record.
- Evidence acceptance and section generation remain separate explicit Notes Studio stages.
- Canonical Learning Resources publication remains unchanged.
