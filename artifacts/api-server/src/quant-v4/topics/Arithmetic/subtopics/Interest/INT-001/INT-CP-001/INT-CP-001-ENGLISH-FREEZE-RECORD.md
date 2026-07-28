# INT-001 / INT-CP-001 English Freeze Record

Release ID: `INT-CP-001-EN-v1`  
Status: **FROZEN_ENGLISH_CONTRACT**  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Frozen count: **21**

## Frozen QL inventory

| QL | Solve contract | Direction | Answer semantic | Baseline |
|---|---|---|---|---|
| `INT-QL-001` | Find simple interest from principal, rate and time | Forward | Simple interest | Easy |
| `INT-QL-002` | Find amount from principal, rate and time | Forward | Total amount | Easy |
| `INT-QL-003` | Find principal from interest evidence | Inverse | Principal | Medium |
| `INT-QL-004` | Find principal from amount evidence | Inverse | Principal | Medium |
| `INT-QL-005` | Find annual rate from interest evidence | Inverse | Annual rate | Medium |
| `INT-QL-006` | Find annual rate from amount evidence | Inverse | Annual rate | Medium |
| `INT-QL-007` | Find time from interest evidence | Inverse | Time | Medium |
| `INT-QL-008` | Find time from amount evidence | Inverse | Time | Medium |
| `INT-QL-009` | Find interest for a target duration from known-duration interest | Reconstruction | Simple interest | Medium |
| `INT-QL-010` | Find annual rate from amount-to-principal multiple | Inverse | Annual rate | Hard |
| `INT-QL-011` | Find time from amount-to-principal multiple | Inverse | Time | Hard |
| `INT-QL-012` | Find time from interest-to-principal ratio | Inverse | Time | Hard |
| `INT-QL-013` | Find annual rate from interest-to-principal ratio | Inverse | Annual rate | Hard |
| `INT-QL-014` | Find annual interest from amounts at two times | Reconstruction | Annual interest | Medium |
| `INT-QL-015` | Find principal from amounts at two times | Inverse | Principal | Hard |
| `INT-QL-016` | Find annual rate from amounts at two times | Inverse | Annual rate | Hard |
| `INT-QL-017` | Find annual rate from a ratio of amounts at two times | Inverse | Annual rate | Hard |
| `INT-QL-018` | Find amount-to-principal multiple from rate and time | Forward | Amount multiple | Medium |
| `INT-QL-019` | Find interest-to-principal ratio from rate and time | Forward | Interest ratio | Medium |
| `INT-QL-020` | Find amount at another time from a known amount | Reconstruction | Total amount | Medium |
| `INT-QL-021` | Find later time from a ratio of two-time amounts | Inverse | Time | Hard |

## Frozen representation rules

The following are parameters, not separate QLs:

- time shown in years, months or explicit days;
- a stated 365-day basis;
- time answer displayed in years, mixed years/months or months;
- annual-interest wording as the one-year target-duration case;
- neutral Indian competitive-exam contexts;
- currency/context wording that does not change the equation topology;
- direct verbal forms such as doubling/tripling when they are amount-multiple special cases.

## Frozen mathematical invariants

Every QL must preserve:

```text
I = P × r × t
A = P + I
A(t) = P(1 + r × t)
```

For two-time amounts:

```text
A₂ − A₁ = Pr(t₂ − t₁)
A₂/A₁ = (1 + rt₂)/(1 + rt₁)
```

The runtime must use exact rational arithmetic. Floating-point tolerance, rounded equality and precomputed answer authority are prohibited.

## Frozen runtime guarantees

- deterministic generation from QL and seed;
- valid-state-first parameter construction;
- exact canonical solver;
- independent reconstruction or bounded inverse enumeration;
- exactly one admissible answer;
- four unique misconception-labelled options;
- QL-owned answer-position balance;
- value-specific explanation and verification;
- no CP, QL or prototype identity in learner-facing text;
- no Question Studio, Question Bank, test or public leakage before downstream approval.

## Ownership exclusions

The following do not belong to CP-001:

- annual, half-yearly, quarterly or monthly compound interest;
- variable rates and growth/decay products;
- SI–CI difference identities;
- effective annual rates and scheme comparison;
- instalments and reducing-balance repayment;
- multiple dated cash flows;
- true discount, banker’s discount or bill discount;
- mixed SI/CI systems;
- profit, markup, margin or discount ownership;
- partnership and investment-share ownership.

## Change control

The 21-QL inventory may be changed only when all of the following hold:

1. a reliable source or exam pattern demonstrates a distinct CP-001 topology;
2. the topology cannot be represented by an existing QL parameter;
3. a canonical exact solver and materially independent verifier are implemented;
4. forward, reverse, inverse, representation, ownership and edge audits are rerun;
5. the freeze record and release ID are deliberately revised.

A new context, wording style, time unit, answer unit or numerical difficulty does not by itself justify a new QL.

## Release boundary

This freeze establishes the English mathematical and generation contract only.

```text
reviewStatus:                FROZEN_ENGLISH_CONTRACT
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

Hindi and Punjabi human adaptation, multilingual parity, publication approval and Question Studio routing are separate downstream checkpoints.
