# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `SECOND_REMEDIATION_REVIEW_CANDIDATE — STAGING_LOCKED`

## Ownership boundary

This checkpoint owns one principal under one constant annual compound rate for complete annual periods, with no intervening cash flow and no sub-annual conversion.

It does not own:

- half-yearly, quarterly, monthly or broken-period compounding (`INT-CP-004`);
- variable rates, population growth or depreciation (`INT-CP-005`);
- explicit SI-versus-CI differences (`INT-CP-006`);
- instalments or dated cash flows (`INT-CP-008/009`).

## Permanent mathematical inventory

The mathematical ownership remains unchanged after the second editorial rejection.

```text
Legacy families owned:        14 / 14
Permanent English QLs:        14
QL range:                     INT-QL-053..INT-QL-066
Open mathematical gaps:       0
Next available identity:      INT-QL-067
```

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
| `INT-QL-065` | `FIND_AMOUNT_DIFFERENCE_BETWEEN_DURATIONS` | Calculate an amount difference from the investment terms |
| `INT-QL-066` | `FIND_LATER_YEAR_INTEREST_FROM_EARLIER_YEAR` | Reconstruct a later yearly interest |

## Second rejection

The first remediation improved formatting and option-analysis alignment but did not solve the underlying generation architecture. A second senior review blocked English freeze because the corpus still had:

- only four rates;
- metadata-only representations;
- an obvious answer-position cycle;
- irrelevant fields inflating fingerprints;
- repeated numerical families;
- unreliable difficulty labels;
- QL-065 variants reducible to subtraction;
- generic explanation and shortcut reuse;
- arbitrary nearby distractors.

The first remediated learner corpus is therefore not an approval authority.

## Replacement architecture

The second remediation separates five independent layers:

```text
QL authority
    ↓
contract-specific exact mathematical state
    ↓
independent visible presentation selector
    ↓
misconception-calculated options + deterministic shuffle
    ↓
feature-derived difficulty
    ↓
method-aware explanation composer
```

### Contract-specific state and fingerprints

Each solve mode has a discriminated mathematical-state type containing only fields that affect that contract. For example:

```text
INT-QL-053: principal + rate + years
INT-QL-059: principal + rate + target year
INT-QL-063: opening balance + closing balance + year number
```

The mathematical fingerprint is constructed only from those relevant fields and the exact answer. Unused timing fields cannot inflate state diversity.

### Exact weighted rate library

The new authority contains 16 exact rational rates, weighted by exam usefulness and computational suitability:

```text
4%, 5%, 6.25%, 8%, 8⅓%, 10%, 12.5%, 15%, 16⅔%,
20%, 25%, 30%, 33⅓%, 40%, 50%, 14 2/7%
```

Principals are constructed to be compatible with the denominator of the annual factor and the required power. Exact arithmetic remains authoritative; floating roots and logarithms remain prohibited.

### Visible representations

Representation changes the rendered learner input. The supported forms are:

```text
STANDARD_PROSE
ACCOUNT_TABLE
BALANCE_LEDGER
GROWTH_RATIO
BANK_STATEMENT
MISSING_ENTRY
```

Non-prose questions must contain a real table or ledger with observable and missing entries. Rate, representation, stem family and difficulty are selected independently.

### Options and ordering

Every wrong option stores:

- the exact wrong calculation;
- a diagnostic misconception identifier;
- student-facing feedback.

Options are shuffled deterministically after generation. Aggregate balancing is a soft review/test-assembly constraint. Audits reject fixed cycles, excessive runs and correlations between position, rate, representation or QL.

### Instance-derived difficulty

Difficulty is calculated from:

- conceptual transformations;
- direct, inverse or multi-stage direction;
- arithmetic burden;
- year gap or exponent;
- representation-reading burden;
- shortcut availability.

A QL no longer has a permanently assigned difficulty.

### QL-065 correction

The learner is given principal, rate and the two required durations. The two year-end amounts are not supplied. For consecutive durations, the explanation uses the later-year interest relationship; for wider gaps, both amounts must be calculated. The contract can no longer collapse into irrelevant subtraction.

### Method-aware explanations

The explanation composer selects a method suited to the solve mode and numerical structure. It stores three depths:

```text
exam solution
student solution
foundation solution
```

The default student explanation contains a natural-language key idea, instance-specific calculation and final answer. A shortcut or verification section is included only when it adds real instructional value. Generic engineering terms and universal boilerplate are prohibited.

## Second-remediation approval gates

Before English freeze, exact-head evidence must show:

- all 14 QLs and 14 legacy families remain mathematically owned;
- all 16 rate profiles are reached;
- all 6 representations are visibly rendered;
- each representation reaches broad independent rate coverage;
- every QL has multiple normalized editorial templates;
- contract state and fingerprint contain no irrelevant fields;
- mathematical-state and numerical-family diversity are measured separately;
- deterministic option shuffling has no fixed sequence or repeated cycle;
- Easy, Medium and Hard instances are all produced by feature scoring;
- QL-065 never supplies both derived amounts;
- all options have exact misconception calculations and one accepted answer;
- Indian currency grouping is used throughout;
- shortcut and verification blocks are optional rather than universal;
- Question Studio, Question Bank, tests and publication remain locked.

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

No immutable English freeze may be created until the second-remediation review corpus receives fresh explicit approval.
