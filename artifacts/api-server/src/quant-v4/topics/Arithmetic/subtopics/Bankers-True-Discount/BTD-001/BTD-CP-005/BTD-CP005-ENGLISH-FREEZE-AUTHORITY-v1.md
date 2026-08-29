# BTD-001 CP005 — English Freeze Authority v1

## Scope

This checkpoint freezes the reviewed English learner surface for permanent `BTD-QL-001..020`.

The freeze does **not** change mathematical authority, semantic ownership, stems, options, correct answers or explanations. It adds immutable freeze metadata and a regression manifest around the learner-visible output approved through CP004.

## Upstream authority

- production authority head: `942af7a90bae59870b2d42b4a2d98f6df6780498`
- reviewed English authority head: `905e7a20d553d8b72ed331d8f4ed1b2cc032a550`
- permanent QLs: `BTD-QL-001..020`

## Immutable learner-surface manifest

The freeze manifest is derived from a deterministic canonical corpus of 200 seeds per QL.

- QLs: 20
- canonical questions: 4,000
- chapter fingerprint: `63e9ea9e1199cf5f0f987482649bb8264e35607fb7701e0a4dc3b2f030480659`
- CP004 review questions: 60
- CP004 review fingerprint: `adda57919034a675af3d10da255040bc0a3f33ab820626180ff5f850e9c14910`

The executable manifest also stores one independent SHA-256 fingerprint for each permanent QL over its 200-question canonical slice. The CP005 audit must reproduce all 20 QL hashes, the combined chapter hash and the CP004 review hash exactly.

## Freeze semantics

`buildBtdFrozenEnglishQuestionV1()` is allowed to change only freeze metadata and lifecycle metadata. The learner-visible payload is required to remain deeply equal to `buildBtdPermanentQuestionV1()` for the same QL and seed.

Frozen lifecycle:

```text
permanentQlAllocated: true
productionAuthorityFrozen: true
contentFreezeStatus: FROZEN_EN
contentFrozen: true
frozenLanguage: en
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
mockTestEligible: false
publiclyPublishable: false
```

## Validation requirement

CP005 is not considered frozen merely because the wrapper exists. The exact branch head must pass `BTD-001-CP005-ENGLISH-FREEZE-AUDIT-v1`, including:

- 4,000 learner-payload equality checks against reviewed CP003 output;
- 4,000 deterministic frozen replays;
- per-question content fingerprints;
- all 20 stored per-QL fingerprints;
- stored chapter fingerprint;
- stored 60-question CP004 review fingerprint;
- frozen lifecycle locks;
- native JSON stability;
- API server build;
- exact-head assertion.

Question Studio integration and every learner-delivery surface remain separate later checkpoints.
