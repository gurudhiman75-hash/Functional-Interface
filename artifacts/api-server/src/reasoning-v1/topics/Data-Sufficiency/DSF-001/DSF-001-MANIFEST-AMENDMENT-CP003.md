# DSF-001 Manifest Amendment — CP-003 Exam Answer Profiles

Status: `IMPLEMENTED / CI_PENDING`

## Authority

- Profile checkpoint: `DSF-CP-003`
- Profile delivery authority: `DSF_CP003_EXAM_ANSWER_PROFILE_DELIVERY_V1`
- Frozen semantic source: `DSF-CP-001 / DSF_CP001_PRODUCTION_GENERATION_FREEZE_V1`
- Question Studio integration source: `DSF-CP-002 / DSF_CP002_QUESTION_STUDIO_INTEGRATION_V1`
- Permanent QL: `DSF-QL-001`
- Next available permanent QL: `DSF-QL-002`
- New QL allocation: **none**

CP-003 is a rendering/delivery-profile layer only. It does not alter the canonical sufficiency class proved by CP-001 and does not move option position into semantic truth.

## Enabled English review profiles

| Profile | Family | Options | Represented semantics | Evidence basis |
| --- | --- | ---: | --- | --- |
| `GENERIC_DS_STANDARD_5_EN` | Generic | 5 | all five canonical classes | approved ExamTree CP-002 English review |
| `BANKING_STANDARD_5_EN` | Banking | 5 | all five canonical classes | curated SATHEE memory-based Indian Bank PO pattern |
| `BANKING_BOB_2015_5_EN` | Banking | 5 | all five canonical classes, reordered | curated SATHEE memory-based BOB 2015 pattern |
| `SSC_CGL_TIER2_2023_4_EN` | SSC | 4 | I-only, II-only, both-together-only, insufficient | curated SSC PYQ-platform pattern |
| `SSC_CGL_TIER2_2024_4_EN` | SSC | 4 | I-only, II-only, both-together-only, insufficient | curated SSC PYQ-platform pattern |

The source-pattern authority remains `discovery/source-pattern-registry.ts`.

## SSC eligibility rule

Both enabled SSC four-option profiles omit:

`EACH_STATEMENT_ALONE`

Therefore CP-003 must never squeeze that semantic result into another option. If an SSC profile is selected:

- explicit generation of `EACH_STATEMENT_ALONE` is rejected;
- unfiltered batches skip source questions with that semantic class and deterministically continue until the requested count is satisfied;
- the underlying CP-001 canonical answer is never changed.

## Punjab boundary

`PUNJAB_STATE` remains explicitly disabled for exam-specific answer rendering.

Current PSSSB-specific material is a preparation signal, not strong enough official-paper provenance to freeze an answer-position contract. No `PUNJAB_*` profile is enabled by CP-003.

## Question Studio behavior

The existing Data Sufficiency Question Studio surface now exposes an Answer profile selector while preserving:

- all 4 production source domains;
- all 8 frozen solve modes;
- deterministic seed generation;
- semantic-class and difficulty filters;
- preview and review-run persistence.

For SSC profiles, the semantic-class filter shows only classes representable by the chosen four-option contract.

## Lifecycle locks

```text
Question Studio discoverable: true
review-run persistence:       true
Question Bank writable:       false
scored-test eligible:         false
mock-test eligible:           false
publicly publishable:         false
student publication:          false
```

CP-003 profile implementation is a review capability, not student-publication approval.

## Required proof gate

Dedicated CI must prove on the exact PR head:

1. API server build;
2. Admin app build;
3. all five enabled profile identities;
4. exact Banking standard and reordered semantic option orders;
5. exact SSC 2023 and 2024 four-option semantic orders;
6. SSC exclusion/rejection of `EACH_STATEMENT_ALONE`;
7. profile determinism;
8. all four source domains can render through every enabled profile;
9. Punjab-specific profile remains disabled;
10. route/client/admin-panel contract;
11. CP-002 Question Studio regression;
12. CP-001 frozen semantic authority regression.

Only after this gate passes may CP-003 be treated as merged exam-profile review authority.
