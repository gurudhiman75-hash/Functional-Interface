# INT-CP-001 — Simple-Interest Fundamentals
## Executable Discovery Plan

Status: **non-QL prototype planning**  
Parent chapter: `INT-001`  
Permanent QLs: **0**  
Reserved permanent range: **none**  
Question Studio exposure: **disabled**

This plan turns the CP-001 ownership hypothesis into executable evidence. Prototype identities must use temporary `INT-CP001-PROT-*` names. No `INT-QL-*` ID may be allocated until the retain/merge/split and gap audits pass.

---

## 1. Ownership hypothesis

CP-001 owns a single principal under one simple rate for one uninterrupted duration.

The hidden state contains:

```text
principal P
simple rate r per declared unit
time t in compatible units
interest I = Prt
amount A = P + I
```

A candidate leaves CP-001 when it introduces:

- more than one principal contribution;
- more than one rate interval;
- an intervening repayment or deposit;
- compound accumulation;
- multiple scheme comparison;
- a cash-flow timeline.

Unit conversion alone does not move a question out of CP-001.

---

## 2. Discovery questions

Executable discovery must answer:

1. Which missing-variable directions are materially distinct QLs?
2. Does recovering principal from interest differ enough from recovering principal from amount to remain separate?
3. Should months, days and mixed durations be variants or separate contracts?
4. Do doubling/tripling questions form one amount-multiple contract or several distinct inverses?
5. Are “interest equals a fraction of principal” questions equivalent to amount-multiple questions?
6. Does annual-interest reconstruction deserve a separate task contract?
7. Which answer semantics require different distractor and explanation architectures?
8. Which states generate natural integer answers without tiny parameter pools?
9. Which inverse tasks have unique exact solutions over the declared admissible domain?
10. Which context families cause wording or unit ambiguities?

---

## 3. Temporary prototype hypotheses

These are executable candidates, not QLs and not a fixed terminal list.

```text
INT-CP001-PROT-001  find simple interest from P, r, t
INT-CP001-PROT-002  find amount from P, r, t
INT-CP001-PROT-003  recover principal from I, r, t
INT-CP001-PROT-004  recover principal from A, r, t
INT-CP001-PROT-005  recover rate from P, I, t
INT-CP001-PROT-006  recover rate from P, A, t
INT-CP001-PROT-007  recover time from P, I, r
INT-CP001-PROT-008  recover time from P, A, r
INT-CP001-PROT-009  find interest/amount with duration given in months
INT-CP001-PROT-010  find interest/amount with an explicit day-count basis
INT-CP001-PROT-011  recover annual interest from total interest and duration
INT-CP001-PROT-012  find interest or amount for a fraction of a known duration
INT-CP001-PROT-013  recover rate from a simple-interest amount multiple
INT-CP001-PROT-014  recover time from a simple-interest amount multiple
INT-CP001-PROT-015  find when interest equals a stated fraction/multiple of principal
INT-CP001-PROT-016  reconstruct one state from an interest-to-principal or amount-to-principal ratio
```

The first implementation may add prototypes when a gap is discovered. It may also merge candidates that differ only by presentation.

---

## 4. Exact state model

```ts
interface SimpleInterestPrototypeState {
  principalMinor: bigint;
  rate: Rational;
  rateUnit: "YEAR" | "HALF_YEAR" | "MONTH" | "DAY";
  elapsed: Rational;
  elapsedUnit: "YEAR" | "MONTH" | "DAY";
  dayCountBasis?: 365 | 360 | "EXPLICIT";
  interestMinor: Rational;
  amountMinor: Rational;
  requestedSemantic:
    | "SIMPLE_INTEREST"
    | "TOTAL_AMOUNT"
    | "PRINCIPAL"
    | "ANNUAL_RATE_PERCENT"
    | "TIME_DURATION"
    | "ANNUAL_INTEREST"
    | "AMOUNT_MULTIPLE";
}
```

Canonical construction:

```text
normalised time = convert elapsed to the rate unit exactly
interest = principal × rate × normalised time
amount = principal + interest
```

No derived field may be independently sampled.

---

## 5. Parameter construction

### 5.1 Valid-state-first strategy

Prefer constructing from the answer-bearing hidden state:

- direct tasks: choose `P`, `r`, `t`, derive `I` and `A`;
- principal inverses: choose `P`, `r`, `t`, derive the displayed `I` or `A`, then hide `P`;
- rate inverses: choose an approved exact `r`, derive the evidence, then hide `r`;
- time inverses: choose an approved exact `t`, derive the evidence, then hide `t`;
- amount-multiple tasks: choose exact `r` and `t`, derive `A/P = 1 + rt`.

### 5.2 Initial pools

Pools are provisional and must be measured for diversity rather than frozen.

Principal candidates should favour:

- realistic Indian exam amounts;
- values divisible by denominators introduced by rates and durations;
- varied digit lengths;
- no dependence on currency rounding.

Rate candidates may include:

- common integer annual rates;
- selected terminating decimal rates;
- selected mixed fractions that appear naturally in competitive exams;
- no near-zero or implausibly extreme rates without source evidence.

Time candidates may include:

- integer years;
- exact month fractions;
- mixed years and months;
- selected day intervals with a declared denominator;
- no ambiguous inclusive/exclusive date counting in the first prototype wave.

### 5.3 Diversity requirements

Across a multi-seed audit, each prototype should demonstrate:

- several principal magnitudes;
- several rates;
- several durations;
- more than one context family;
- varied answer positions;
- varied sentence openings;
- no dominant mathematical fingerprint caused by over-rejection.

Do not set arbitrary final numeric thresholds before the first audit. Measure the generated corpus, identify collapse, then establish evidence-based regression floors.

---

## 6. Canonical solver

The canonical solver may use direct algebra:

```text
I = Prt
A = P(1 + rt)
P = I/(rt)
P = A/(1 + rt)
r = I/(Pt)
r = (A/P − 1)/t
t = I/(Pr)
t = (A/P − 1)/r
```

Every variable must be normalised to exact compatible units before solving.

The solver returns:

```text
exact rational answer
answer semantic
unit/display instruction
reasoning graph
intermediate values
```

---

## 7. Independent verifier

The verifier must not call the canonical solve function.

Suggested independent routes:

### Direct interest and amount

- compute interest per one rate unit;
- scale by exact elapsed units;
- add principal only when amount is requested.

### Principal inverse

- reconstruct candidate principal;
- simulate per-period simple interest;
- confirm the displayed interest/amount exactly.

### Rate inverse

- enumerate the finite approved rate domain or reconstruct the exact fraction from evidence;
- simulate each candidate;
- require exactly one match.

### Time inverse

- enumerate the finite approved duration domain or reconstruct exact time;
- simulate each candidate;
- require exactly one match.

### Amount multiple

- independently compare `interest/principal` with `rt`;
- verify `amount = principal × multiple`.

The verifier must prove uniqueness over the declared admissible domain for every inverse prototype.

---

## 8. Answer formatting

### Money

- store exact minor units or rationals;
- default Indian exam display to `₹`;
- prefer integral rupee outputs in the first wave;
- use two decimal places only when intentionally admitted;
- do not display repeating decimals.

### Rate

- display as an exact percentage;
- permit integer, terminating decimal or source-backed mixed-fraction forms;
- always state the period, normally “per annum”.

### Time

- display in the unit asked;
- reduce exact fractions;
- convert to years/months only when the answer contract requires it;
- avoid decimal years when a natural mixed-year/month form exists.

---

## 9. Stem architecture

Stems must be task-owned rather than assembled from one universal shell.

Context families may include:

- bank deposit;
- educational loan;
- agricultural loan;
- personal lending;
- cooperative society deposit;
- equipment finance;
- savings certificate represented generically;
- business working-capital loan.

Examples of structural variation:

```text
A sum of ₹{P} is invested at {r}% simple interest for {t}. Find the interest earned.

At {r}% simple interest per annum, a deposit grows to ₹{A} in {t}. Find the original deposit.

The simple interest on ₹{P} for {t} is ₹{I}. Determine the annual rate.

A sum becomes {multiple} times itself in {t} under simple interest. Find the annual rate.
```

These are pattern illustrations, not final authored QLs. The library must create natural variation in evidence order, question sentence and context without changing the contract.

Editorial rules:

- use “principal” or “original sum” naturally;
- distinguish “interest earned” from “amount received”;
- avoid the misspelling “principle” for principal;
- avoid “Find ...?” fragments;
- do not imply a real institution currently offers the stated rate;
- do not bury the method or period convention.

---

## 10. Explanation strategies

Each prototype requires a dedicated explanation strategy.

### Direct interest

1. identify principal, annual rate and time;
2. normalise time;
3. state `I = Prt` in the displayed percentage form;
4. substitute values;
5. compute interest;
6. check it is interest, not amount;
7. conclude with currency.

### Direct amount

1. compute simple interest;
2. add principal once;
3. verify `A − P = I`;
4. conclude with total amount.

### Principal inverse

1. identify whether the displayed value is interest or amount;
2. choose `I = Prt` or `A = P(1 + rt)`;
3. isolate `P`;
4. substitute exact values;
5. reconstruct interest/amount as a check;
6. state the original sum.

### Rate inverse

1. isolate rate as a fraction;
2. normalise time;
3. calculate the decimal/fractional rate;
4. convert to percent;
5. attach the annual period;
6. substitute back to verify.

### Time inverse

1. isolate time;
2. solve in the rate unit;
3. convert to the requested time form;
4. substitute back;
5. state the duration.

### Amount multiple

1. translate the multiple into interest relative to principal;
2. use `A/P = 1 + rt`;
3. solve the requested rate or time;
4. verify the multiple exactly;
5. warn against using compound growth.

Explanations must remain value-specific and may not merely replace placeholders in identical prose across all prototypes.

---

## 11. Distractor strategies

Candidate misconception labels:

```text
USED_AMOUNT_AS_INTEREST
RETURNED_INTEREST_INSTEAD_OF_AMOUNT
RETURNED_AMOUNT_INSTEAD_OF_INTEREST
OMITTED_TIME_FACTOR
OMITTED_RATE_DIVISION_BY_100
MONTHS_TREATED_AS_YEARS
DAYS_TREATED_AS_MONTHS
USED_AMOUNT_AS_PRINCIPAL
SUBTRACTED_PRINCIPAL_TWICE
INVERTED_PRINCIPAL_FORMULA
INVERTED_RATE_FORMULA
INVERTED_TIME_FORMULA
USED_COMPOUND_FACTOR
MULTIPLE_CONFUSED_WITH_INTEREST_MULTIPLE
RATE_REPORTED_WITHOUT_PERCENT_CONVERSION
```

A distractor function must:

- accept the exact hidden state;
- produce an in-domain semantic value;
- document the learner misconception;
- remain distinct from the correct answer and other options;
- be independently checked as wrong.

No arbitrary numerical offsets.

---

## 12. Difficulty evidence

Potential Easy evidence:

- direct `I` or `A`;
- integer years;
- integer rate;
- integral answer;
- no unit conversion.

Potential Medium evidence:

- one inverse;
- months or mixed duration;
- amount rather than interest evidence;
- decimal/mixed-fraction rate;
- close misconception options.

Potential Hard evidence:

- day-count conversion;
- inverse amount-multiple relation;
- exact mixed duration and rate;
- two-step semantic reversal;
- bounded uniqueness proof over a nontrivial domain.

Difficulty is assigned from generated evidence, not from prototype name or quota.

---

## 13. Prototype review export

Produce deterministic JSON and Markdown review packs containing, for each sample:

```text
prototype ID
seed
candidate CP owner
solve direction
answer semantic
context family
difficulty and evidence
stem
options
correct answer
misconception labels
explanation
canonical trace
independent verification trace
lifecycle metadata
```

Generate several mathematically distinct samples per prototype. The exact review-pack size should be chosen after the initial implementation based on useful editorial coverage, not treated as a permanent runtime count.

---

## 14. Automated proof

The focused proof must check:

- deterministic regeneration;
- exact solver/verifier agreement;
- unique admissible inverse solution;
- four unique options;
- exactly one correct option;
- misconception labels align with option values;
- all answer positions occur across seeds;
- all intended contexts and difficulty bands are reachable where mathematically valid;
- unit conversion is exact;
- `amount = principal + interest` always holds;
- no floating-point tolerance is used;
- no malformed currency or TeX;
- no unresolved placeholders;
- no permanent QLs or central registry changes;
- every candidate remains non-public and Question-Bank-ineligible.

---

## 15. Gap audits

After the first executable wave, run:

1. missing-variable audit;
2. interest-versus-amount semantic audit;
3. principal inverse merge/split audit;
4. rate inverse merge/split audit;
5. time inverse merge/split audit;
6. month/day representation audit;
7. amount-multiple relation audit;
8. fraction-of-principal relation audit;
9. context and wording audit;
10. parameter diversity audit;
11. distractor collision audit;
12. explanation duplicate audit;
13. ownership leakage audit against CP-002 and CP-003;
14. source-pattern gap audit.

Every prototype receives one disposition:

```text
RETAIN_AS_DISTINCT
MERGE_AS_PRESENTATION_VARIANT
SPLIT_BY_TOPOLOGY_OR_SEMANTIC
DEFER_TO_LATER_CP
REASSIGN_TO_OTHER_CHAPTER
REJECT_AS_ARTIFICIAL_OR_AMBIGUOUS
```

---

## 16. Exit gate

CP-001 may propose permanent QL allocation only when:

- all prototype dispositions are recorded;
- no unresolved missing-variable or representation gap remains;
- ownership with CP-002/003 is stable;
- exact generation is diverse and reliable;
- every retained contract has a separate verifier;
- distractors are misconception-driven;
- English review approves stems and explanations;
- the CP-level QL count emerges from retained contracts rather than a target.

Until then:

```text
permanent QLs:            0
publiclyPublishable:      false
questionBankStatus:       NOT_STORED
testEligibility:          INELIGIBLE
central registration:     none
```
