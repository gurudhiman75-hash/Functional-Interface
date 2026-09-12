# ENG-001-CP001 — Human Approval & Question Studio Integration V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__MERGE_PENDING`

## Approved authority

The final V4 review batch was explicitly approved after the plain-language remediation pass.

- Chapter: `ENG-001 — Error Spotting`
- Checkpoint: `ENG-001-CP001 — Subject–Verb Agreement`
- Approval authority: `ENG-001-CP001-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved review artifact: `ENG-001-CP001-REVIEW-V4.md`
- Approved review blob: `6e05c314555b047b6bbc05a7bdf0d0c99123b193`
- Approved generator head: `5e3777abac96c2e486fc0de04a76fdac2c8d9406`
- Approval date: `2026-09-10`

The approved review artifact is deliberately left byte-for-byte unchanged. Its `NOT_QUESTION_STUDIO_REGISTERED` status records the state at the moment of human approval; this integration record is the superseding lifecycle authority.

## Question Studio registration

CP001 is registered through the shared multi-engine Question Studio as:

- engine: `language-v1`
- package: `ENG-001`
- CP: `ENG-001-CP001`
- subject: `English`
- topic: `Error Spotting`
- subtopic: `Subject–Verb Agreement`
- languages: English only
- difficulties: Easy / Medium / Hard
- permanent QLs: `ENG-001-QL001`, `ENG-001-QL002`, `ENG-001-QL007`
- grammar rules: `GR-SVA-001` through `GR-SVA-010`
- runtime: `review-only`
- revision policy: `SOURCE_GENERATOR_ONLY`

The adapter keeps deterministic generation, exposes the question's sentence parts as learner-facing options, preserves the corrected sentence and simple explanation, and prevents duplicate candidates inside a requested batch.

## Lifecycle boundary

Registration opens only the Question Studio generation/review surface. It does **not** authorize downstream learner delivery.

- review-run persistence: allowed
- manual editorial review: required
- Question Bank storage: blocked
- Question Bank writable: false
- test eligibility: false
- mock-test eligibility: false
- public publication: false
- automatic student publication: false
- production release: false
- inline editing: disabled by policy; fix the source generator and regenerate

Approving an item in the English review panel must resolve as `review_only` and must produce zero Question Bank conversions.

## Admin review surface

`QuestionStudioEnglishReviewPanel` provides:

- exam selection;
- QL selection or all approved QLs;
- SVA rule selection or all approved rules;
- Easy / Medium / Hard filtering;
- deterministic seed control;
- batch size up to 50;
- direct display of sentence parts, keyed answer, explanation, and corrected sentence;
- Approve review / Needs fix / Reject actions;
- an explicit guard that review approval cannot silently convert an ENG-001 item into Question Bank.

## Integration validation

The post-registration checkpoint proves:

- English V4 diversity diagnostics pass;
- the production-scale grammar/stress suite passes;
- the approved 60-question review still matches the deterministic exporter byte-for-byte;
- the `language-v1` ENG-001 adapter contract and deterministic replay pass;
- the admin application typechecks and the complete integrated admin build/test workflow passes;
- Render production build passes;
- the shared Question Studio engine-registry test now admits `language-v1` while re-proving the existing Quant and Knowledge engines;
- Computer Content Engine Question Studio lifecycle/registry regression checks remain green after the third engine is registered.

Some independently triggered legacy chapter workflows can remain red for their own stale chapter-specific contracts (for example, a route/mount or lifecycle assertion unrelated to English). Those are not treated as ENG-001 evidence and are not modified by this checkpoint.

## Reopening rule

Reopen CP001 content only for a demonstrated grammar, ambiguity, wording, explanation, difficulty, determinism, or exam-realness defect. Do not patch an individual stored review item. Correct the source grammar/pattern/plain-language layer, rerun the full V4 stress suite, and generate a fresh review batch.

CP002 remains out of scope for this integration checkpoint. Merge remains a separate explicit action.
