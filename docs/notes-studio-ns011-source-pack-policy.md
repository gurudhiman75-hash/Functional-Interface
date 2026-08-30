# Notes Studio NS-011 — Source-pack templates and research-role gate

## Goal

NS-011 turns source-pack quality from an editor convention into a server-enforced pre-evidence contract.

A note now has a **source-pack template** and every attached source has a **job-specific research role**. The evidence rebuild request is rejected until the selected template is satisfied.

## Research roles

Roles live on `content.note_authoring_sources` because the same governed source can serve different purposes in different notes.

- `primary_authority` — official/primary authority for the factual domain.
- `core_reference` — standard textbook, reference work, authorized reference or other core factual source.
- `exam_context` — syllabus, notification, PYQ or exam-context material used to scope relevance.
- `supplemental` — useful context that is not counted as core research coverage.

The role does not change `content.source_documents.rights_basis`, retention mode or extraction status.

## Templates

### Balanced static note
Requires two included, generation-ready sources across `primary_authority` / `core_reference`.

### Official-first
Requires:
- one generation-ready `primary_authority`;
- one generation-ready `core_reference`.

### Reference-led
Requires two generation-ready `core_reference` sources. This is intended for stable domains where no single official primary authority is natural.

### Exam-focused
Requires:
- one included `exam_context` source; this may be provenance-only;
- one generation-ready `primary_authority` or `core_reference`.

### Quick revision
Requires one generation-ready `primary_authority` or `core_reference` for deliberately narrow revision notes.

## Generation-ready definition

A source counts toward a generation-ready requirement only when:

- it is included in the job;
- `retention_mode = 'extracted_text'`;
- `extraction_status = 'processed'`; and
- at least 100 retained characters are available.

Reference-only sources therefore cannot satisfy factual generation requirements, but can satisfy an `exam_context` provenance requirement where the template explicitly allows it.

## Evidence guard

`POST /admin/notes-studio/jobs/:jobId/evidence/rebuild` is intercepted by the source-policy router **before** the existing evidence router.

If the policy is incomplete the API returns `409 SOURCE_PACK_POLICY_INCOMPLETE` with the missing requirement counts. No evidence blocks are created.

The existing evidence implementation remains unchanged after the guard passes.

## Lifecycle freeze

Template and role changes are allowed only while the authoring job is in:

- `brief`
- `sources_ready`

Once evidence work begins, the research recipe is frozen. Later corrections use the existing successor-revision flow instead of silently relabeling the evidence basis.

Changing an inclusion state or source role fires the existing source-pack invalidation trigger.

## Backward compatibility

The migration assigns existing source memberships the neutral `core_reference` role.

For jobs that had already progressed beyond source collection before NS-011, the migration freezes `quick_revision` as their legacy-compatible source template. Existing `brief` / `sources_ready` jobs receive `balanced` and can still change template before evidence work begins.

This prevents NS-011 from retroactively trapping an already-reviewed legacy job behind a stronger requirement it never agreed to.

## Admin workflow

A new **Source policy** tab shows:

- authoring job selector;
- source-pack template selector;
- live READY/BLOCKED evidence gate;
- requirement-by-requirement counts;
- every attached source with its research-role selector;
- generation-ready/provenance-only status;
- visible lifecycle freeze notice.

## Safety boundaries

NS-011 does not:

- fetch or discover sources;
- alter source rights or retention policy;
- accept claims or evidence automatically;
- generate note prose;
- approve, localize, materialize or publish learner content.

It only determines whether the explicitly assembled governed source pack is strong enough to enter evidence extraction.
