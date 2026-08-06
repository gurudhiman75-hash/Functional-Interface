# PNL-001 Canonical Production Release

**Scope:** approved canonical Question Studio output only.  
**Languages:** English, Hindi and Punjabi.  
**Coverage:** 186 QLs across PNL-CP-001 through PNL-CP-006.  
**Approval:** explicit production-release approval received on August 2, 2026.

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

## Release gates

The exact release head must pass all of the following before merge:

- all 558 multilingual canonical review surfaces;
- the 13,392-package multilingual dynamic regression;
- canonical conversion and normalization in English, Hindi and Punjabi;
- dynamic conversion rejection, including tampered positive lifecycle flags;
- chapter freeze, stems, native prompts and editorial regressions;
- API production build;
- complete admin and student application tests and builds;
- single-site hosting assembly;
- freshness against `New-main`.
