# Notes Studio NS-003 — Evidence Map and Coverage Gate

Status: stacked checkpoint on `feature/notes-studio-ns003-evidence-map` above NS-002.

## Purpose

NS-003 converts an included, rights-retainable Notes Studio source pack into an auditable evidence map before any learner-facing synthesis is allowed.

The checkpoint does **not** generate note prose and does **not** publish a learning resource.

## Immutable evidence runs

Each extraction creates `content.note_evidence_runs` using an input fingerprint over:

- authoring job id;
- authoring brief;
- included retained source ids/content hashes;
- extractor policy version.

Evidence claims and coverage mappings belong to that immutable run. Source-pack or brief changes therefore create a new evidence snapshot rather than silently mutating old evidence.

## Candidate claim extraction

The deterministic `notes-evidence-v1` extractor:

1. reads only included source documents whose retention mode is `extracted_text` and extraction status is `processed`;
2. segments retained text into bounded sentence-like evidence units;
3. rejects obvious navigation/subscription boilerplate;
4. classifies units as definition, constitutional/legal provision, statistic, date fact or general fact;
5. creates a normalized SHA-256 claim key;
6. deduplicates identical normalized claims within the run;
7. stores bounded provenance excerpts and paragraph/sentence/character location metadata.

The extractor is intentionally not an LLM fact verifier. Extracted claims remain evidence candidates unless review policy accepts them.

## Evidence provenance

`content.note_evidence_support` links every claim to the exact source document and stores:

- support/contradict relation field (NS-003 automatically creates support links only);
- bounded excerpt, maximum 600 characters;
- excerpt SHA-256 hash;
- source-location metadata.

Because NS-002 exposes extracted text only for rights-retainable material, NS-003 cannot create evidence excerpts from `reference_only` sources.

## Cross-source deduplication

When the same normalized assertion appears in more than one included source, NS-003 stores one evidence claim with multiple source-support links instead of duplicating the claim.

The UI exposes source count so reviewers can distinguish single-source assertions from repeated/corroborating source text. Cross-source support is evidence strength, not a guarantee of factual truth.

## Coverage targets

`content.note_coverage_targets` stores the syllabus requirements for the authoring job.

Initial targets are deterministically seeded from:

- canonical/topic label in the job brief;
- syllabus/PYQ emphasis entered by the editor.

Editors may add manual targets and mark targets required or optional.

## Claim-to-coverage mapping

`content.note_claim_coverage` stores mappings from the current evidence run to coverage targets.

Automatic mapping uses normalized token overlap with special protection for numeric/article identifiers so evidence about Article 19 does not satisfy a target for Article 14 simply because both contain the word “Article”.

Editors can manually map a claim to a coverage target when deterministic lexical mapping misses a semantically valid relationship.

## Evidence review

The admin workspace adds `Evidence & coverage` with:

- immutable run summary;
- coverage gap matrix;
- accepted/candidate/rejected evidence counts;
- source count per claim;
- bounded provenance excerpts;
- accept/reject/reset review actions;
- manual claim-to-coverage mapping;
- manual coverage-target creation and required/optional control.

Review mutations are audited.

## Evidence gate

A job can advance from `sources_ready` to `evidence_ready` only when:

- a completed evidence run exists;
- at least one claim is accepted;
- at least one required coverage target exists;
- every required coverage target has at least one accepted mapped claim.

If accepted evidence or required coverage changes and the gate no longer passes, the early-stage job returns to `sources_ready`.

This is deliberately separate from learner publication and from the canonical `content.learning_resources` lifecycle.

## Audit events

NS-003 records:

- `notes_studio.evidence.extracted`
- `notes_studio.evidence.reviewed`
- `notes_studio.coverage.required.changed`
- `notes_studio.coverage.claim.mapped`

## Safety boundaries

- no reference-only extracted text is consumed;
- no evidence endpoint creates learner Markdown;
- no evidence endpoint invokes learning-resource publish APIs;
- excerpts are bounded;
- all automatic evidence remains provenance-linked;
- coverage matching does not change claim review state;
- synthesis remains blocked until the evidence gate is satisfied.

## Next checkpoint — NS-004 Section Synthesis

NS-004 should consume **accepted claims only**, generate a deterministic coverage/outline plan, then introduce a provider-agnostic model runner that produces one section at a time with generation provenance and immutable versions. The model should never receive excluded/reference-only source text and should not be allowed to publish learner content directly.
