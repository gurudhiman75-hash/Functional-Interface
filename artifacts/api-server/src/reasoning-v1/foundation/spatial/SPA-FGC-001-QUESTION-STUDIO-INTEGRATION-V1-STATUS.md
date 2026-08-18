# SPA FGC-001 Question Studio Integration V1 - Status

## Integrated scope

FGC-001 is connected to the shared SPA-001 Question Studio lifecycle as SPA-QL-031..034. The existing 30 frozen P0 QLs remain unchanged, giving SPA-001 a combined 34 permanent QLs.

FGC uses the existing Spatial API route, review persistence, cockpit, approval converter and Question Bank handoff. No FGC-specific downstream store or approval path was introduced. Manual generated-item approval remains required and automatic student publication remains disabled.

## Frozen source authorities

- English: FGC-001-ENGLISH-FREEZE-V1
- Hindi/Punjabi: FGC_001_HI_PA_LOCALIZATION_APPROVED_V1
- Combined allocation: SPA-FND-001-PERMANENT-QL-ALLOCATION-V2

FGC canonical IDs, geometry, option order, answer authority and fingerprints remain frozen through integration.

## Question Studio presentation

- Recommended FGC stimulus review size: 384 px
- Mobile option floor: 104 px
- Languages: English, Hindi, Punjabi

## Reviewed integration and learner-review evidence

The reviewed 34-QL surface passed CI on 315ba2ef26e4615bd891a75374d85557150345c8.

- Workflow: Validate SPA-FND-001 Question Studio Integration V1
- Run: 32040861339 - SUCCESS
- Artifact: 9291930499
- Digest: sha256:42e691a9ef459385c7fa786dc03c6326facc54589c0df782b3c149bb2605b893
- Integration marker: PASS_SPA_FGC_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1
- Operator-review marker: PASS_SPA_FGC_001_OPERATOR_QUESTION_STUDIO_REVIEW_V1

Pinned learner-review artifacts:

- English: 9281170371; sha256:9e2acb8f13355afc59f9ecd01276e7086855e410186bb456e8e4eed340f77135
- Hindi/Punjabi: 9281720797; sha256:388a4fd770bea9eab0c31538a112a31fbdcaf075a9770d84fbdbd174f2b1f9b5

## Product-owner approval

Repository authority: SPA-FGC-001-QUESTION-STUDIO-PRODUCT-OWNER-APPROVAL-V1

On 2026-08-18 the product owner explicitly approved the reviewed FGC-001 Question Studio learner surface in project chat after viewing the supplied review files.

Approval covers:

- FGC-001 Question Studio integration for SPA-QL-031..034;
- reviewed English, Hindi and Punjabi learner surface;
- the reviewed visual sizing and question-specific explanations represented by the pinned evidence.

Approval does not cover automatic approval of questions generated later in Question Studio, automatic student publication, or deployment. Manual review/approval of future generated items remains required.

The approval-record head c242ed4a3d72a475ea5984893a88eb3aebbd26ad passed the dedicated workflow in run 32092183996 with artifact 9308766621 and digest sha256:490ad63fe0e04f57b0117e2f878f00a82e9e602d9a9f3234bf20848e77c0f4fc.

## Authorized stacked merge sequence

On 2026-08-18 the product owner explicitly authorized proceeding with the previously stated stacked PR merge sequence.

- PR #847 was validated at head 7665570ea0a3ff72536c2d68de051969018aca94.
- PR #847 was merged first into New-main with merge commit 33614a087c22776f7b99cd26ec0b9b7e55137056.
- PR #861 was then retargeted from feat/spa-fgc-001-discovery-v1 to New-main.
- PR #861 remains subject to a fresh post-retarget CI pass before final merge.

This merge authorization does not authorize deployment or automatic publication.

## Current boundary

Source/freeze PR #847 is merged. Product-owner learner-surface approval and merge authorization are recorded. PR #861 is retargeted to New-main and awaiting fresh post-retarget validation before final merge.

## Next gate

POST_RETARGET_CI_THEN_MERGE_PR_861
