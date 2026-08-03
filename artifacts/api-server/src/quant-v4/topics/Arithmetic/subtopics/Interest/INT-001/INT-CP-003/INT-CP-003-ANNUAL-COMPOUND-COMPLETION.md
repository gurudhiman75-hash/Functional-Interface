# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `SECOND_REMEDIATION_REVIEW_CANDIDATE — STAGING_LOCKED`

## Ownership boundary

This checkpoint owns one principal under one constant annual compound rate for complete annual periods, with no intervening cash flow and no sub-annual conversion.

It does not own half-yearly or broken-period compounding, variable rates, SI-versus-CI differences, instalments or dated cash flows. Those remain assigned to later Interest checkpoints.

## Permanent mathematical inventory

```text
Legacy families owned:        14 / 14
Permanent English QLs:        14
QL range:                     INT-QL-053..INT-QL-066
Open mathematical gaps:       0
Next available identity:      INT-QL-067
```

The mathematical inventory remains unchanged after the second editorial rejection.

## Second rejection and replacement architecture

The first remediation corrected formatting and option-analysis alignment but did not remove deeper generation coupling. The second remediation replaces the learner-facing architecture with independent exact state, presentation, misconception-option, difficulty and explanation layers.

The exact weighted rate authority contains 16 rational rates:

```text
4%, 5%, 6.25%, 8%, 8⅓%, 10%, 12.5%, 15%, 16⅔%,
20%, 25%, 30%, 33⅓%, 40%, 50%, 14 2/7%
```

Visible learner representations are:

```text
STANDARD_PROSE
ACCOUNT_TABLE
BALANCE_LEDGER
GROWTH_RATIO
BANK_STATEMENT
MISSING_ENTRY
```

Every solve mode has a contract-specific mathematical state and relevant-field-only fingerprint. Non-prose representations contain actual tables or ledgers. Every wrong option stores its exact wrong calculation, misconception code and student feedback. Options are deterministically shuffled. Difficulty is instance-derived. Explanations store exam, student and foundation depths, with optional shortcuts and actual verifications.

QL-065 supplies principal, rate and durations rather than both derived amounts. Amount-ratio rate recovery uses two complete years; nth-year rate recovery is restricted to the second or third year. Learner-facing engineering terminology and malformed MathJax delimiter patterns are runtime-blocked.

## Exact-head evidence

The latest exact-head evidence is recorded in PR #480. The branch remains draft, unmerged and staging-locked until fresh explicit approval.

## Lifecycle locks

```text
releaseCandidateId:          INT-CP-003-EN-v1-candidate
editorialStatus:             SECOND_REMEDIATION_REVIEW_CANDIDATE
approvalStatus:              WITHDRAWN_PENDING_REAUDIT
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No immutable English freeze may be created until this second-remediation corpus receives fresh explicit approval.
