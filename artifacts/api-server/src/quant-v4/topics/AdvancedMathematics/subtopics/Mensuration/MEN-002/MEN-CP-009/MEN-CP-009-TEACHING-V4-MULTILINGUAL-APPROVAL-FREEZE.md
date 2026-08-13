# MEN-CP-009 Teaching V4 Multilingual Approval Freeze

## Status

`PRODUCT_OWNER_APPROVED__CONTENT_FROZEN__INACTIVE`

## Approval record

The product owner explicitly approved the corrected MEN-CP-009 teaching review on 2026-08-13 after reviewing the generated English + Hindi + Punjabi learner artifact with the Punjabi surface orthography correction (`ਸਤ੍ਹਾ`, not `ਸਤਹ`).

```text
Freeze ID:                    MEN-CP009-TEACHING-V4-MULTILINGUAL-v1-frozen
Package:                      MEN-002
Checkpoint:                   MEN-CP-009 — Spheres & Hemispheres
Permanent QLs:                MEN-002-QL-096..MEN-002-QL-123
Permanent QL count:           28
Approved English authority:   MEN-CP009-STUDENT-VIEW-V4-TEACHING
Approved native authority:    MEN-CP009-MULTILINGUAL-TEACHING-V2
English review cards:         110
Hindi review cards:           110
Punjabi review cards:         110
Total reviewed cards:         330
Approved source branch:       fix/men-cp009-teaching-explanations-v4
Approved source head:         26b6d2b8fb4effa33f1e89ba7b555817e5132888
Validation workflow run:      31660721576
Review artifact:              men-cp009-teaching-review-v2
Artifact ID:                  9166092324
Artifact digest:              sha256:599164b47c282aa99218822d3685f8d4cf316b11b258f655b8e057f58febedfc
Approval time:                2026-08-13T08:14:00+05:30
```

## Approved learner surface

Approval covers the reviewed teaching-first presentation only:

- English V4 learner wording and 4–5 connected teaching steps;
- Hindi V2 learner wording and teaching explanations;
- Punjabi V2 learner wording and teaching explanations;
- the corrected Punjabi learner spelling `ਸਤ੍ਹਾ` across surface-area terminology;
- the existing four-option answer ownership and permanent QL identities;
- the reviewed no-diagram policy for these direct sphere/hemisphere learner forms;
- the exact mathematical state, options, correct index and verification inherited from the approved CP-009 runtime.

The approved Punjabi terminology is:

```text
Surface area:         ਸਤ੍ਹਾ ਦਾ ਖੇਤਰਫਲ
Curved surface area:  ਵਕਰ ਸਤ੍ਹਾ ਦਾ ਖੇਤਰਫਲ
Total surface area:   ਕੁੱਲ ਸਤ੍ਹਾ ਦਾ ਖੇਤਰਫਲ
```

The incorrect learner spelling `ਸਤਹ` is not part of the approved surface.

## Validation evidence

GitHub Actions run `31660721576` passed on the exact reviewed head. The workflow completed:

- teaching-first English V4 and native V2 proof;
- native teaching-quality proof;
- tri-language review export;
- regression of the previously approved English V3 runtime;
- production API build;
- evidence upload.

The generated artifact is pinned by artifact ID and SHA-256 digest above.

## Lifecycle boundary

This approval is a content/freeze decision only. It does not authorize merge, deployment, Question Studio registration, persistence, scored mocks, or public publication.

```text
Question Studio discovery:    disabled
Question Bank writes:         disabled
Question Bank status:         NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
merge authorization:          false
```

Any later activation must be an explicit, separate product decision.
