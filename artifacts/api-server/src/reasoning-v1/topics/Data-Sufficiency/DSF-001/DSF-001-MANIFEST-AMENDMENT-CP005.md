# DSF-001 Manifest Amendment — CP-005 Manual Test Release

Status: `IMPLEMENTED / CI_PENDING`

Authority: `DSF_CP005_MANUAL_TEST_RELEASE_V1`

## Scope

CP-005 advances only newly generated DSF review items beyond CP-004 `BANK_ONLY` storage. After manual Question Studio approval, a CP-005 item may enter Question Bank. After the canonical exam-version/taxonomy requirements are satisfied, an administrator may manually publish that Question Bank version, making it selectable by the existing scored-test builder.

No DSF-specific Question Bank, publication, or test endpoint is introduced.

## Lifecycle

```text
Question Studio review:             enabled
manual generation approval:         required
Question Bank writable:             true
Question Bank acceptance mode:      FULL_RELEASE
manual Question Bank publication:   required
scored-test eligible:               true
Question-version publishable:       true
mock-test eligible:                 false
automatic student publication:      false
```

`publiclyPublishable=true` here is the existing question-version publication prerequisite used by the canonical Question Bank lifecycle. It does not automatically create, publish, or assign a test/mock to students.

## Compatibility boundary

Existing CP-004 review payloads are immutable and remain `BANK_ONLY`, `testEligible=false`, and `publiclyPublishable=false`. CP-005 does not retroactively upgrade them.

CP-001 frozen semantics, CP-002 Question Studio integration, and CP-003 approved answer-profile rendering remain unchanged. SSC four-option profiles still do not represent `EACH_STATEMENT_ALONE`. Punjab-specific rendering and Hindi/Punjabi delivery remain disabled. `DSF-QL-002` remains unallocated.

## Next gate

Mock-test eligibility and automatic student delivery require a separate checkpoint.
