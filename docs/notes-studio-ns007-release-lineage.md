# Notes Studio NS-007 — Release, replacement lineage and publish handoff

NS-007 closes the lifecycle after immutable approval/localization without creating a second publication system.

## Replacement rule

An approved/materialized Notes Studio learner version is never edited in place. A replacement starts as one explicit successor authoring job linked to its immutable predecessor approved-version ID and lineage-root ID.

The successor copies only:

- the approved brief snapshot,
- source language,
- governed source-pack membership/inclusion/relevance/position references.

It does **not** copy accepted claims, evidence decisions, coverage mappings, generated sections, QA runs or approval state. The replacement must rebuild evidence and pass the full Notes Studio pipeline again.

The successor job receives the next lineage revision number. A database trigger applies that number to the immutable `note_approved_versions.version_number` row when the successor is eventually approved.

## Materialized learner-copy freeze

Once an approved source-language version or version-bound Hindi/Punjabi localization materializes into `content.learning_resources`, the learner-content fields are database-frozen. Exam-target mappings are frozen as well.

Allowed lifecycle changes remain the canonical Learning Resources status transitions such as draft → published → archived. A substantive learner-content or targeting change requires a Notes Studio successor revision.

## Learner preview

The Release & Revisions admin workspace shows source/Hindi/Punjabi learner variants and recomputes integrity against the frozen approved/localization hash.

A variant cannot be handed off when:

- it is not materialized,
- the canonical resource is not a draft,
- its current learner copy does not match the frozen version hash.

This also detects any pre-NS-007 legacy drift before release.

## Publish handoff

`content.note_publish_handoffs` records the exact approved-version ID, optional localization ID, resource ID, variant, language, frozen content hash and resource snapshot sent to the publication workflow.

The handoff endpoint requires `content.questions.publish`, but it **does not publish** the resource. Editors are sent to the existing Learning Resources surface for the explicit publish action. Existing Learning Resources audit events remain the authority for the actual publish/archive transition.

## Safety invariants

- no Notes Studio auto-publication,
- no duplicate Notes Studio publish endpoint,
- no mutation of approved versions,
- no mutation of materialized learner copy or exam targets,
- one direct successor per approved version,
- successor evidence/sections/QA are rebuilt,
- localized release remains bound to the exact immutable source content hash.
