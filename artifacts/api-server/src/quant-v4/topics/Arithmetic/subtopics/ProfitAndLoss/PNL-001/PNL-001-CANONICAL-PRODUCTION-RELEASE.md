# PNL-001 Canonical Production Release

**Scope:** approved canonical Question Studio output only.  
**Languages:** English, Hindi and Punjabi.  
**Coverage:** 186 QLs across PNL-CP-001 through PNL-CP-006.

## Canonical release policy

```text
runtimeMode: CANONICAL_REVIEW
reviewStatus: APPROVED_EDITORIAL_CANONICAL
questionBankStatus: WRITABLE
testEligibility: ELIGIBLE
publiclyPublishable: true
```

`CANONICAL_REVIEW` remains the runtime name for API compatibility. Approved canonical output can pass the normal administrator approval conversion into Question Bank records and can subsequently be used in tests and publication workflows.

## Dynamic boundary

```text
runtimeMode: DYNAMIC_CANDIDATE
reviewStatus: UNREVIEWED_DYNAMIC_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

The conversion gate rejects dynamic candidates by runtime mode even if positive lifecycle flags are supplied accidentally.

## Source integrity

The compressed canonical review library is unchanged. Its original review-only metadata remains frozen provenance; production eligibility is applied separately at runtime.
