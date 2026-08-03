# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `EDITORIAL_REMEDIATION_CANDIDATE — STAGING_LOCKED`

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

Canonical generation continues to use exact rational powers:

```text
A_n = P(1 + r/100)^n
CI_n = A_n - P
J_k = P(r/100)(1 + r/100)^(k-1)
```

The materially separate verifier rebuilds balances year by year. Rate and time inverses use bounded exact substitution; floating roots and logarithms are prohibited. Every option is independently checked against the complete state, and exactly one option may satisfy the verifier.

## Editorial rejection and remediation

The first combined review document was rejected for production after a senior editorial audit. Mathematical ownership and permanent QL identities remain unchanged, but its learner-facing corpus is not an approved authority.

The remediated editorial layer now requires:

- SSC/Banking/RRB/PSSSB/PPSC-style question wording;
- MathJax-ready inline and display notation;
- decimal-first growth-factor presentation, with fractions retained only when they improve exact cancellation;
- explicit intermediate cancellation and arithmetic rather than black-box power jumps;
- the four-tier explanation schema:
  - `📌 Core Concept`;
  - `📝 Step-by-Step Solution`;
  - `⚡ Exam Speed Shortcut`;
  - `⚠️ Common Student Traps & Option Analysis`;
- one aligned analysis row for every displayed option;
- bracketed diagnostic trap codes for every wrong option;
- no generic verification boilerplate;
- no raw fractional money or complete-year answers.

A dedicated editorial audit validates 1,400 regenerated packages. The review exporter additionally enforces all 224 option-to-analysis alignments and all 168 wrong-option trap tags across the 56-row review corpus.

## Remediated review candidate

```text
Review questions:                    56
Questions per QL:                     4
Distinct review stems:               56 / 56
Answer positions:              14 / 14 / 14 / 14
Option-analysis alignment checks:   224
Tagged wrong-option analyses:       168
Editorial status:   REMEDIATED_REVIEW_CANDIDATE
```

The combined Markdown and DOCX review artifacts place each question, answer, full derivation, shortcut and aligned option analysis together. They remain subject to fresh product-owner re-audit.

## Lifecycle locks

```text
releaseCandidateId:          INT-CP-003-EN-v1-candidate
editorialStatus:             REMEDIATED_REVIEW_CANDIDATE
approvalStatus:              WITHDRAWN_PENDING_REAUDIT
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No immutable English freeze may be created until the remediated corpus receives explicit product-owner approval.
