# Notes Studio NS-012 — Source-pack diagnostics

NS-012 adds deterministic source-health diagnostics alongside the existing NS-011 Source Policy gate.

## Why this is separate from Source Policy

Source Policy answers: **does the pack contain the research roles required by the selected template?**

NS-012 answers a different question: **is that source mix healthy enough to trust as a research pack?**

The diagnostics inspect:
- depth-aware included-source sufficiency;
- depth-aware generation-ready retained evidence sufficiency;
- identifiable publisher/domain diversity;
- source-type concentration;
- reference-only load;
- extraction failures.

## Status model

Every authoring job is classified as:
- `ready` — depth minimums met and no diagnostic warnings;
- `usable_with_warnings` — depth minimums met but the pack has concentration/extraction warnings;
- `needs_sources` — depth-aware included or generation-ready minimums are missing.

Depth targets:
- quick revision: 1 included, 1 generation-ready;
- standard: 2 included, 2 generation-ready;
- comprehensive: 3 included, 3 generation-ready.

Publisher/domain and source-type diversity are diagnostics, not hard blockers in NS-012.

## Boundary with the existing hard gate

The existing NS-011 Source Policy remains the server-enforced evidence rebuild gate. NS-012 is advisory and cannot override it.

NS-012 deliberately does not:
- discover the web;
- fetch or refetch a URL;
- attach a source;
- copy retained source text;
- change rights or retention policy;
- accept evidence;
- generate sections;
- approve, localize, materialize or publish learner content.

The diagnostics endpoint returns source counts and findings only. It never returns raw retained source bodies.

## Admin flow

Notes Studio exposes **Source diagnostics** next to Source Policy. Editors select an authoring job and see:
- included vs depth target;
- generation-ready vs depth target;
- independent publishers/domains;
- source types;
- concrete findings;
- recommended source classes needed next.

The recommendation labels are categories of missing research input, not automatic source suggestions or attachments.

## Schema

No migration is required. NS-012 reads the existing governed `content.source_documents`, `content.note_authoring_sources`, and `content.note_authoring_jobs` records.
