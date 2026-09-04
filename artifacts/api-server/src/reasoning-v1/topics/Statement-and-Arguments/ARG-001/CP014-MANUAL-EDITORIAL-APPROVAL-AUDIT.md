# ARG-001 CP014 — Manual Editorial Approval Audit

## Status

**TECHNICALLY CERTIFIED / MANUAL EDITORIAL APPROVAL RECORDED / INTERNAL QUESTION BANK + TEST + MOCK ELIGIBILITY ENABLED / PUBLIC & AUTOMATIC LEARNER RELEASE BLOCKED**

## Approval provenance

The product owner explicitly approved the reviewed ARG-001 learner-facing packet in project chat with the statement **“Approved”** on 2026-09-04 at 08:37 IST (03:07 UTC).

Approval authority: `EXPLICIT_USER_EDITORIAL_SIGN_OFF_IN_PROJECT_CHAT`.

The approved learner-facing surface is CP013. CP014 is additive and lifecycle-only; it does not rewrite CP013 content.

Approved packet:

- Path: `docs/review/ARG-001-CP013-RUNTIME-REVIEW-SAMPLES.md`
- Blob SHA: `f3259f9a727844118d63c13bbb3b1d2d1d212e03`
- CP013 packet workflow: `33772065384`

Approved CP013 technical certification:

- Workflow: `Validate ARG-001 CP013 Final Editorial Surface`
- Run: `33772042174`
- Certified head: `ac8850c42dd9ff0b23f5048dffda621dcc5455ce`

## CP014 certification

Dedicated workflow `Validate ARG-001 CP014 Manual Editorial Approval` passed end-to-end:

- Run: `33835033307`
- Certified head: `ee8f57860781b4ef169b84758af712dd240c881e`
- Job: `100905676956`

Green gates:

- strict TypeScript for CP014-owned approval runtime and proofs;
- explicit approval provenance proof;
- CP013-to-CP014 learner-facing content identity proof;
- deterministic CP014 replay;
- current Question Studio route precedence proof;
- internal lifecycle boundary proof;
- approved CP013 learner-facing editorial regression proof;
- CP013 historical routing proof;
- certified CP012 editorial/cardinality preservation;
- exact CP006 historical core byte freeze;
- exact CP008 historical real-paper byte freeze;
- production API build;
- production admin build.

## Content identity guarantee

CP014 changes lifecycle/approval metadata only. The approved CP013 learner-facing fields remain identical, including:

- `questionId`;
- `contentFingerprint`;
- statement/stem/text;
- arguments and argument-strength state;
- options;
- answer/canonical answer/correct index;
- explanation;
- QL/template/scenario/profile/locale/difficulty identity.

The CP014 proof compares these fields directly against deterministic CP013 source output. CP013 itself remains historically locked rather than being rewritten in place.

## Current lifecycle boundary

CP014 authorizes internal use after manual editorial approval:

- `manualApprovalRequired = false`
- `persistenceAllowed = true`
- `questionBankStatus = WRITABLE`
- `questionBankWritable = true`
- `testEligibility = ELIGIBLE`
- `testEligible = true`
- `mockTestEligible = true`
- `learnerRelease = INTERNAL_ELIGIBLE`

The following remain blocked deliberately:

- `publiclyPublishable = false`
- `publicReleaseAuthorized = false`
- `studentDeliveryAuthorized = false`
- `automaticStudentPublication = false`

Therefore this checkpoint does **not** constitute public deployment or automatic delivery to learners.

## Historical preservation

CP014 is additive. It preserves the checkpoint lineage and does not mutate historical frozen evidence. In particular, CP006 and CP008 exact byte-freeze proofs remain green in the CP014 certification run. CP009 remains the core semantic source, CP012 remains the source real-paper semantic remediation, and CP013 remains the manually approved learner-facing editorial content surface.

## Question Studio authority

Current ARG-001 approval/runtime authority:

- checkpoint: `ARG-CP-014`
- approval authority: `ARG_CP014_MANUAL_EDITORIAL_APPROVAL_V1`
- Question Studio authority: `ARG_CP014_QUESTION_STUDIO_INTERNAL_ELIGIBILITY_V1`
- source final editorial checkpoint: `ARG-CP-013`
- source final editorial authority: `ARG_CP013_FINAL_EDITORIAL_SURFACE_V1`

The CP014 router is mounted before CP013/CP012/CP010/CP007/legacy ARG fallbacks.

## PR boundary

PR #1408 remains draft intentionally. No merge and no public/student deployment are authorized by this approval checkpoint.
