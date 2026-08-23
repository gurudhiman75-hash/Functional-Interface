# DSF-001 Manifest Amendment — CP-004 Question Bank Acceptance

Status: `IMPLEMENTED / CI_PENDING`

Authority: `DSF_CP004_QUESTION_BANK_ACCEPTANCE_V1`

Checkpoint: `DSF-CP-004`

## Scope

CP-004 enables **Question Bank acceptance only** for reviewed Data Sufficiency questions. It does not reopen DSF semantic truth, change answer-profile meaning, allocate a new permanent QL, or activate scored tests, mocks, or student/public publication.

The canonical semantic authority remains `DSF-CP-001 / DSF-QL-001`. Question Studio generation remains owned by `DSF-CP-002`, and answer-profile rendering remains owned by `DSF-CP-003`.

## Approved Question Bank profiles

The following reviewed English profiles may enter Question Bank after manual Question Studio approval:

- `GENERIC_DS_STANDARD_5_EN` — approved through the CP-002 English review authority;
- `BANKING_STANDARD_5_EN`;
- `BANKING_BOB_2015_5_EN`;
- `SSC_CGL_TIER2_2023_4_EN`;
- `SSC_CGL_TIER2_2024_4_EN`.

SSC four-option profiles continue to exclude `EACH_STATEMENT_ALONE`. CP-004 does not remap an unrepresentable canonical semantic class.

Punjab-specific rendering remains disabled. Hindi and Punjabi delivery remain outside this checkpoint.

## Canonical acceptance path

CP-004 deliberately does **not** add a DSF-specific Question Bank endpoint.

New CP-004 review runs persist items with:

```text
questionBankStatus:              READY_FOR_STORAGE
questionBankWritable:            true
questionBankAcceptanceMode:      BANK_ONLY
manualApprovalRequired:          true
testEligibility:                 INELIGIBLE
testEligible:                    false
mockTestEligible:                false
publiclyPublishable:             false
automaticStudentPublication:     false
```

When an administrator approves one of these generated items through the existing Question Studio bulk review action, the established `convertApprovedGenerationItem` path creates the canonical records in:

- `content.questions`;
- `content.question_versions`;
- `content.question_options`.

The generated item stores `accepted_question_id` and `accepted_question_version_id`, so conversion remains idempotent by generation item.

## Legacy review-item immutability

Items generated before CP-004 keep their original immutable payload:

```text
questionBankStatus: NOT_STORED
questionBankWritable: false
```

Approving those historical items therefore remains review-only. CP-004 does not rewrite old provenance or retroactively make old review items bank-writable.

## BANK_ONLY lifecycle contract

The shared generated-question converter now recognizes the explicit `BANK_ONLY` acceptance mode. This mode permits Question Bank storage even while downstream release flags remain false.

The conversion copies the downstream lifecycle contract and DSF provenance into `question_versions.answer_model.generation`, including:

- permanent QL;
- source chapter and solve mode;
- canonical sufficiency class;
- answer profile and exam family;
- CP-002/CP-003/CP-004 authorities;
- `testEligible`;
- `mockTestEligible`;
- `publiclyPublishable`;
- Question Bank acceptance mode/authority.

Legacy/full-release generated content keeps the previous eligibility behavior; only an explicit `BANK_ONLY` payload receives the staged acceptance treatment.

## Publication and scored-test guard

Question Bank storage is not publication.

The hardened Question Bank publish route reads preserved generation lifecycle flags from the approved question version. A generated question with either:

```text
generation.testEligible = false
generation.publiclyPublishable = false
```

is rejected by the publication gate.

The canonical test-builder and blueprint-assembly paths already require a **published** question version. Consequently a CP-004 bank-only question cannot enter scored tests or mock assembly while publication remains blocked.

Legacy manually-authored Question Bank records without generation lifecycle metadata retain the existing publication behavior.

## Lifecycle after CP-004

```text
Question Studio generation:      enabled
manual review approval:          required
Question Bank acceptance:        enabled
Question Bank record status:     approved
scored-test eligibility:         false
mock-test eligibility:           false
public/student publication:      false
automatic student publication:   false
```

## Permanent QL boundary

```text
permanent QL:        DSF-QL-001
next available ID:   DSF-QL-002
new QL allocated:    false
```

## Next gate

`TEST_AND_PUBLICATION_LIFECYCLE_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT`

Any future activation of scored tests, mocks, or public/student publication must be a separate explicitly reviewed checkpoint. CP-004 must not be interpreted as that approval.
