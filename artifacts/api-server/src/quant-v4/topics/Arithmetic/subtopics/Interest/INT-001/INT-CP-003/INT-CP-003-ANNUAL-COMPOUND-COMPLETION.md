# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `FINAL_ENGLISH_REVIEW_CANDIDATE`

## Ownership boundary

This checkpoint owns one principal under one constant annual compound rate for complete annual periods, with no intervening cash flow and no sub-annual conversion.

It does not own:

- half-yearly, quarterly, monthly or broken-period compounding (`INT-CP-004`);
- variable rates, population growth or depreciation (`INT-CP-005`);
- explicit SI-versus-CI differences (`INT-CP-006`);
- instalments or dated cash flows (`INT-CP-008/009`).

## Source saturation result

The 14 CP-003 legacy families and all end-to-end design directions were classified through direct, inverse, specified-year, consecutive-balance, representation and ownership audits.

```text
Legacy families owned:        14 / 14
Permanent English QLs:        14
QL range:                     INT-QL-053..INT-QL-066
Open meaningful owned gaps:   0
```

Two-year and three-year shortcuts are parameters of the annual amount/interest authorities. Doubling and general amount-multiple wording are representations of the exact rate/time inverse. Specific-year and nth-year wording merge into the same yearly-interest authority.

## Permanent English inventory

| QL | Solve contract | Student task |
|---|---|---|
| `INT-QL-053` | `FIND_ANNUAL_COMPOUND_AMOUNT` | Find maturity amount |
| `INT-QL-054` | `FIND_ANNUAL_COMPOUND_INTEREST` | Find compound interest |
| `INT-QL-055` | `FIND_PRINCIPAL_FROM_COMPOUND_AMOUNT` | Recover principal from amount |
| `INT-QL-056` | `FIND_PRINCIPAL_FROM_COMPOUND_INTEREST` | Recover principal from compound interest |
| `INT-QL-057` | `FIND_ANNUAL_RATE_FROM_AMOUNT_OR_FACTOR` | Recover annual rate from amount or growth factor |
| `INT-QL-058` | `FIND_COMPLETE_YEARS_FROM_AMOUNT_OR_FACTOR` | Recover complete years from amount or factor |
| `INT-QL-059` | `FIND_SPECIFIED_YEAR_INTEREST` | Find interest earned during a specified year |
| `INT-QL-060` | `FIND_PRINCIPAL_FROM_SPECIFIED_YEAR_INTEREST` | Recover principal from specified-year interest |
| `INT-QL-061` | `FIND_RATE_FROM_SPECIFIED_YEAR_INTEREST` | Recover rate from specified-year interest |
| `INT-QL-062` | `FIND_PREVIOUS_YEAR_AMOUNT` | Reverse one annual balance transition |
| `INT-QL-063` | `FIND_RATE_FROM_CONSECUTIVE_AMOUNTS` | Recover rate from consecutive annual balances |
| `INT-QL-064` | `FIND_PRINCIPAL_FROM_CONSECUTIVE_AMOUNTS` | Recover original principal from consecutive balances |
| `INT-QL-065` | `FIND_AMOUNT_DIFFERENCE_BETWEEN_DURATIONS` | Compare amounts at two complete durations |
| `INT-QL-066` | `FIND_LATER_YEAR_INTEREST_FROM_EARLIER_YEAR` | Reconstruct a later yearly interest |

Next available Interest identity: `INT-QL-067`.

## Exact mathematics

Canonical generation uses exact rational powers:

```text
A_n = P(1 + r/100)^n
CI_n = A_n - P
J_k = P(r/100)(1 + r/100)^(k-1)
```

The materially separate verifier rebuilds balances year by year. Rate and time inverses use bounded exact substitution; floating roots and logarithms are prohibited.

Every option is independently checked against the complete state. Exactly one option may satisfy the verifier.

## English review candidate

The review exporter produces four distinct questions per permanent QL, covering each correct answer position exactly once.

```text
Review questions:       56
Questions per QL:        4
Distinct stems:         56 / 56
Answer positions:       14 / 14 / 14 / 14
Review status:          AWAITING_PRODUCT_OWNER_REVIEW
```

Representation metadata covers narrative, table, annual balance ledger and growth-factor card projections. They remain presentation variants rather than duplicate QLs.

## Lifecycle locks

```text
releaseCandidateId:          INT-CP-003-EN-v1-candidate
maturity:                    FINAL_ENGLISH_REVIEW_CANDIDATE
reviewStatus:                FINAL_ENGLISH_REVIEW_CANDIDATE
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

Explicit product-owner review is required before an immutable English freeze may be created.
