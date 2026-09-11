# ENG-001-CP002 — Human Approval & Question Studio Integration V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__CI_GREEN__MERGE_PENDING`

## Approved authority

The frozen CP002 V1 review batch was explicitly approved by the human reviewer on 2026-09-11.

- Chapter: `ENG-001 — Error Spotting`
- Checkpoint: `ENG-001-CP002 — Tenses and Sequence of Tenses`
- Approval authority: `ENG-001-CP002-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved review artifact: `ENG-001-CP002-REVIEW-V1.md`
- Approved review blob: `2bab0f00ffdd423e6b7d9522b01462217a7e1b64`
- Approved generator head: `5a5d8fcc72ef9f986626a8e49215a73c9471250c`
- Approval date: `2026-09-11`

The frozen review file remains byte-for-byte unchanged. Its historical `HUMAN_REVIEW_PENDING` / `NOT_QUESTION_STUDIO_REGISTERED` status records the state when the review artifact was frozen. This document and the approval authority supersede that lifecycle state after explicit approval without rewriting the reviewed bytes.

## Existing Question Studio integration

CP002 is added to the same existing English Question Studio package already used by CP001. No separate English studio, route, or parallel review workflow is created.

- engine: `language-v1`
- package: `ENG-001`
- CP: `ENG-001-CP002`
- subject: `English`
- topic: `Error Spotting`
- subtopic: `Tenses and Sequence of Tenses`
- languages: English only
- difficulties: Easy / Medium / Hard
- permanent QLs: `ENG-001-QL001`, `ENG-001-QL002`, `ENG-001-QL007`
- grammar rules: `GR-TNS-001` through `GR-TNS-010`
- runtime: `review-only`
- revision policy: `SOURCE_GENERATOR_ONLY`

The `ENG-001` package now advertises both approved checkpoints: `ENG-001-CP001` and `ENG-001-CP002`. Package-only legacy requests continue to resolve to CP001 for backward compatibility. CP002 is selected explicitly by its checkpoint id, a `GR-TNS-*` rule selector, or the Tenses subtopic.

## Lifecycle boundary

Registration opens only Question Studio generation and editorial review. It does not authorize learner-facing publication.

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

Approving a generated CP002 item in Question Studio resolves as `review_only` and cannot create a Question Bank conversion.

## Admin review surface

The existing `QuestionStudioEnglishReviewPanel` now provides one checkpoint selector for the two approved ENG-001 CPs:

- CP001 — Subject–Verb Agreement
- CP002 — Tenses and Sequence of Tenses

The grammar-rule selector switches between SVA and tense inventories according to the selected checkpoint. QL, difficulty, exam, batch size, deterministic seed, generated question display, keyed answer, explanation, corrected sentence, and review actions remain on the same shared panel.

## Integration validation

The post-approval integration head passed the required gates before this status record was written:

- CP002 deterministic generation/stress matrix;
- byte-for-byte CP002 60-question review freeze;
- approved CP001 V4 regression;
- deterministic CP001 + CP002 `language-v1` adapter tests;
- CP-family/rule conflict rejection;
- CP002 approval authority and reviewed blob/head provenance checks;
- review-only approval-policy checks;
- English Question Studio admin typecheck;
- API build and Render production build;
- complete integrated admin application typecheck, tests, admin build and student build;
- workflow-hygiene and branch-topology checks;
- shared Computer Content Engine Question Studio registry/lifecycle regression after updating its stale ENG-001 CP-list assertion.

The shared registry initially exposed the expected stale assertion that still required `ENG-001` to contain only CP001. That regression test was updated to admit the explicitly approved CP002 checkpoint and to smoke-test CP002 generation; its rerun passed without changing Computer content or lifecycle behavior.

## Reopening rule

Reopen CP002 content only for a demonstrated grammar, ambiguity, wording, explanation, difficulty, determinism, or exam-realness defect. Do not patch an individual stored review item. Correct the source rule/pattern/semantic layer, rerun the CP002 validation suite, and generate a fresh human-review batch.

Merge remains a separate explicit action.
