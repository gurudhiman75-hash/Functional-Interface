# INT-CP-001 Calculation-Rich V6 Approval Record

Date: 2026-07-31

Human approval was explicitly granted for the calculation-rich V6 corpus covering all 21 permanent QLs in English, Hindi and Punjabi.

## Approved releases

```text
English:  INT-CP-001-EN-v6
Hindi:    INT-CP-001-HI-v6
Punjabi:  INT-CP-001-PA-v6
```

## Approval scope

The approved learner explanations retain:

1. known numerical values and time-unit conversion;
2. the governing formula;
3. actual numerical substitution;
4. intermediate arithmetic or algebra;
5. a final numerical answer check.

Approval is applied through a separate wrapper. The reviewed candidate remains immutable. Approval changes only lifecycle fields and adds an approval trace.

## Active Staging disposition

The corpus is approved to advance to `ACTIVE_STAGING` through a separate provider checkpoint. This approval does not itself register the package in Question Studio or enable any student delivery surface.

## Pre-record proof

```text
Head:       be97be5e0618b1e2d730508f3c94de62fc9cde80
Workflow:   Validate INT-CP-001 calculation-rich V6 approval
Run:        30599033535
Conclusion: PASS
Artifact:   8781204983
Digest:     sha256:7ffac64cd8c0d2b41a238972f7a6bb159b357c72b4e233362e823ad196053a86
```

```text
Questions:                               5,040
Candidate-to-approved identity checks:   5,040
Deterministic approved checks:           5,040
Lifecycle checks:                        5,040
Calculation-contract checks:             5,040
Cross-language parity checks:            3,360
```

## Safety locks

```text
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable: false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

The approval PR remains draft and unmerged. The exact record-inclusive proof is supplied by the workflow run on this record commit.
