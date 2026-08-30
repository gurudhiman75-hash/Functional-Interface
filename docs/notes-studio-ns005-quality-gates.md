# Notes Studio NS-005 — Quality Gates

NS-005 is the automated gate between section drafting and human review. It does not approve, materialize, or publish learner content.

## State boundary

A section can move from `draft` / `needs_editorial` to `qa_passed` only after the current section output passes the current QA policy. A job can move from `qa_required` to `review_ready` only when:

- required/high coverage targets have drafted sections;
- every existing section is currently `qa_passed`; and
- there are no active evidence conflicts.

`review_ready` is not editorial approval. `approved`, `materialized`, and the canonical learning-resource publish endpoint remain downstream gates.

## Fingerprint binding

Every QA run persists:

- exact section output fingerprint;
- evidence fingerprint derived from claim text/state, coverage linkage and active supporting-evidence hashes;
- quality policy version;
- semantic verifier provider/model/prompt version and bounded metadata;
- per-check pass/warning/fail findings.

The section and evidence graph are re-read after semantic verification. If either fingerprint changed while QA was running, no green result is committed.

## Deterministic checks

Blocking checks:

1. **Evidence support** — each section claim remains accepted, linked to the section's coverage target, and backed by active supporting evidence.
2. **Contradiction state** — active evidence conflicts block review.
3. **Source overlap** — bounded evidence excerpts are compared with the learner draft for suspicious exact/source-near phrasing.
4. **Duplication** — exact repeated paragraphs and severe cross-section similarity are blocked.
5. **Readability** — extreme sentence/paragraph density is blocked; moderate density warns.
6. **Formatting** — unsafe markup, empty content and invalid heading depth are blocked.

Advisory check:

- **Planned depth** — warns when the section is substantially shorter than its brief/deep/standard planning heuristic.

## Semantic re-grounding

Deterministic provenance proves which claims were authorized, but a manual edit can add a new factual statement while leaving old claim links intact. NS-005 therefore adds a claim-only semantic verifier.

The verifier receives only:

- current section Markdown;
- source language; and
- accepted section claim IDs/text.

It does **not** receive raw source documents or evidence excerpts and is explicitly instructed not to use outside knowledge. Structured output identifies unsupported factual statements and the authorized claim IDs actually used. Any out-of-set claim ID is rejected.

The semantic check is blocking. If evidence support or contradiction prerequisites are already red, the semantic gate fails without making a model call.

Model configuration:

- `NOTES_STUDIO_QA_MODEL`, falling back to `NOTES_STUDIO_MODEL`;
- `NOTES_STUDIO_OPENAI_API_KEY`, falling back to `OPENAI_API_KEY`.

No model name is hard-coded.

## Invalidation

A previously green section becomes stale and must be rechecked when relevant upstream state changes, including:

- section output edits;
- source-pack inclusion changes;
- used claim text/state changes;
- used claim-to-evidence changes;
- coverage target definition changes; or
- claim-to-coverage mapping changes.

These invalidations also regress a `review_ready` job to the appropriate pre-review state. `materialized` content is never silently reopened by this checkpoint.

## Publication boundary

The NS-005 API contains no write path to `content.learning_resources`. QA only updates Notes Studio authoring state and records audit events. Learner publication remains controlled by the existing canonical learning-resource lifecycle.
