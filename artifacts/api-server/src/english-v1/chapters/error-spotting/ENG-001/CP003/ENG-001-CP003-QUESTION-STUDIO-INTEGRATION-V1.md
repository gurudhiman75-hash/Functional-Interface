# ENG-001-CP003 — Human Approval & Question Studio Integration V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__CI_PENDING__MERGE_PENDING`

## Human approval

The user explicitly approved the human-review batch for `ENG-001-CP003` on 2026-09-11 after the explanation system was revised to:

- keep rules simple and connected to the actual sentence cue;
- vary explanation wording deterministically so it reads more naturally;
- preserve the correction and corrected sentence;
- keep the content generator-driven rather than patching individual review questions.

The reviewed artifact is pinned by SHA-256 in `eng-001-cp003-human-approval-v1.ts`.

## Question Studio registration

`ENG-001-CP003` is registered inside the existing `language-v1` / `ENG-001` Question Studio package alongside CP001 and CP002.

Registration includes:

- CP selector: `ENG-001-CP003`;
- subtopic: `Articles and Determiners`;
- QLs: `ENG-001-QL001`, `ENG-001-QL002`, `ENG-001-QL007`;
- grammar rules: `GR-ART-001` through `GR-ART-010`;
- Easy / Medium / Hard difficulty filtering subject to per-rule availability;
- deterministic seed and batch generation;
- existing English review UI support.

## Lifecycle locks

This registration is review-only. The following remain locked:

- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner delivery;
- production release authorization.

Any defect discovered after registration must be fixed in the source generator/catalog/validator and regenerated. Question Studio must not become a hidden content-authoring layer.
