# INT-CP-004 — Frequency and Broken-Period Completion

Status: **English implementation editorially remediated; fresh review required**  
QL range: **INT-QL-067..INT-QL-085**  
QL count: **19**  
Lifecycle: **inactive, unapproved, unstaged and unregistered**

## 1. Owned domain

INT-CP-004 owns compound-interest questions in which the conversion period or an explicitly stated broken-period convention changes the calculation. Its production boundary includes:

- annual, half-yearly, quarterly and monthly compounding;
- nominal annual rate converted to the rate used in each compounding period;
- a rate stated directly for each half-year, quarter or month;
- complete smaller periods such as 18 months or 9 months;
- principal, nominal-rate and duration inverses under a stated frequency;
- comparison of two compounding frequencies at the same annual rate;
- effective annual rate and its inverse;
- recovery of the compounding frequency from exact amount evidence;
- annual compounding for complete years followed by simple interest for an explicitly stated fractional-year tail;
- a stated change in compounding frequency between successive intervals.

The runtime rejects questions that depend on an unstated broken-period convention. Variable annual rates, population, depreciation, SI–CI comparison, instalments and dated cash flows belong to other CPs.

## 2. Executable discovery result

Frequencies are parameters rather than separate QLs. Half-yearly, quarterly and monthly direct amount questions use one task contract because changing the frequency does not change the unknown or reasoning topology.

Amount and compound-interest outputs remain separate QLs because the answer semantic and useful misconception options are materially different. This distinction also applies to mixed-frequency intervals.

| QL | Owned task contract |
|---|---|
| INT-QL-067 | Amount from nominal annual rate, frequency and complete periods |
| INT-QL-068 | Compound interest from nominal annual rate, frequency and complete periods |
| INT-QL-069 | Principal from final amount under a stated frequency |
| INT-QL-070 | Principal from compound interest under a stated frequency |
| INT-QL-071 | Nominal annual rate from principal, amount, frequency and duration |
| INT-QL-072 | Duration from principal, amount, annual rate and frequency |
| INT-QL-073 | Amount when the rate for each compounding period is stated directly |
| INT-QL-074 | Compound interest when the rate for each period is stated directly |
| INT-QL-075 | Excess caused by the more frequent compounding schedule |
| INT-QL-076 | Effective annual rate |
| INT-QL-077 | Nominal annual rate from effective annual rate |
| INT-QL-078 | Compounding frequency from exact amount evidence |
| INT-QL-079 | Amount after complete annual years plus an explicit simple-interest tail |
| INT-QL-080 | Compound interest after complete annual years plus an explicit simple-interest tail |
| INT-QL-081 | Principal from a broken-period amount |
| INT-QL-082 | Annual rate from a broken-period amount |
| INT-QL-083 | Number of complete years from a broken-period amount |
| INT-QL-084 | Amount when frequency changes between successive intervals |
| INT-QL-085 | Compound interest when frequency changes between successive intervals |

## 3. Editorial remediation V2

The fresh review candidate corrects the weaknesses identified in the first CP-004 review:

- principal inverses use exact rational amount or interest ratios instead of rounded decimal divisors;
- rate and duration inverses show the actual period-by-period balances that establish the selected answer;
- broken-period inverses show the complete annual stage and the simple-interest tail separately;
- the generic `NEARBY_RATE` distractor is removed and replaced by the authentic error of reporting the final tail-period percentage as the annual rate;
- compound-interest-from-interest inverse options now model copying the given interest, applying the simple-interest inverse and treating interest as a maturity amount;
- effective-rate inverse questions cover both half-yearly and quarterly crediting;
- changing-frequency questions cover annual, half-yearly, quarterly and monthly intervals across the audit corpus;
- high nominal rates are kept in neutral illustrative investment or growth contexts rather than ordinary banking-product language;
- the four editorial frames are now materially distinct: terms table, standard prose, balance record and schedule/timeline comparison.

## 4. Mathematical and editorial rules

- Money and rates use exact rational arithmetic.
- Inverse questions are constructed from exact admissible states and checked independently; floating logarithms and unrestricted roots are not used.
- Principal values remain in realistic exam ranges and inverse observations are exact to paise.
- Stems state the frequency or broken-period rule explicitly without revealing the solving method.
- Wrong options must have three distinct misconception owners; arbitrary nearby values and generic arithmetic fallbacks are prohibited by audit.
- Explanations begin by stating what must be found, use the exact values in the question, show at least four teaching steps and include explicit intermediate calculations.
- Exact-ratio principal inverses must display the exact fraction used in the reverse calculation.
- Structured representation labels must correspond to actual Markdown tables.

## 5. Validation contract

The completion audit generates 100 deterministic questions for each of the 19 QLs, for a total of 1,900 questions. It checks:

- canonical answer and independent relation agreement;
- deterministic replay;
- four unique options with exactly one correct answer;
- three distinct, non-generic misconception owners for wrong options;
- explanation length, explicit arithmetic and inverse pedagogy;
- exact-fraction arithmetic for principal inverse families;
- CP-domain containment and absence of method hints;
- answer leakage in inverse questions;
- genuine table structure for terms, record and comparison representations;
- high-rate context safety;
- half-yearly and quarterly effective-rate inverse coverage;
- all four frequencies in mixed-frequency intervals;
- all answer semantics, all difficulty levels, deep immutability and closed lifecycle state.

The review exporter produces 76 questions: four materially different editorial frames per QL with balanced answer positions.

## 6. Versions

```text
authority:             INT-CP-004-MATH-AUTHORITY-v1
generator:             INT-CP-004-EXAM-GENERATOR-v1
solver:                INT-CP-004-CANONICAL-SOLVER-v1
verifier:              INT-CP-004-RELATION-VERIFIER-v1
editorial remediation: INT-CP-004-EDITORIAL-REMEDIATION-v2
```

The mathematical authority and solver remain unchanged. V2 changes learner-facing generation, distractor ownership, representation and explanation pedagogy only.

## 7. Lifecycle boundary

```text
editorialStatus:             ENGLISH_REVIEW_CANDIDATE
approvalStatus:              NOT_APPROVED
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

Editorial remediation does not approve, freeze, merge, stage, register or publish the CP. A fresh human exam-readiness review remains mandatory.
