# INT-CP-002 — Simple-Interest Comparisons, Interval Ledgers and Multiple Sums

Status: **executable discovery authority; no permanent QL allocation**  
Chapter: `INT-001 — Simple & Compound Interest`  
Checkpoint hypothesis: `INT-CP-002`  
Permanent QLs: **0**  
Frozen solve contracts: **0**  
Runtime activation: **disabled**  
Question Studio registration: **disabled**

This document starts executable discovery for simple-interest questions whose decisive state contains more than one contribution, interval, principal, scheme or outstanding-balance segment. It does not predetermine QL count, solve-mode count, difficulty quotas or final checkpoint boundaries. Permanent identities may be allocated only after source saturation, executable gap audits, merge/split review and human approval.

---

## 1. Ownership decision

`INT-CP-002` provisionally owns linear simple-interest systems that cannot be represented faithfully as the single-principal, single-rate, single-duration state already owned by `INT-CP-001`.

The checkpoint is about a **ledger of simple-interest contributions**:

```text
Total interest = Σ(principal exposed during segment × rate × duration)
```

The learner may be asked to calculate the ledger total, compare two ledgers, or recover a missing component from a known total or difference.

A new story, person, bank or currency does not create a new mathematical authority. A distinct learner contract is justified only when at least one of these changes materially:

- contribution topology;
- unknown position;
- interval/event ordering;
- equality or comparison relation;
- answer semantic;
- required representation;
- misconception profile;
- independent verification route.

---

## 2. Included state families

The provisional ownership includes:

- one principal exposed to different simple rates over successive intervals;
- one principal under counterfactual rate or duration changes;
- multiple independent principals, rates and durations;
- two or more people or deposits contributing to one total interest;
- split-principal allocation between different rates or durations;
- equal-interest relations across different simple-interest states;
- common-rate recovery from a weighted principal-time ledger;
- unknown principal, rate or duration inside a multi-contribution ledger;
- comparison of two simple-interest schemes by interest or amount difference;
- declared calendar-day simple interest using an explicit day-count basis;
- explicit principal reduction or partial discharge where each remaining balance earns simple interest only for its own segment;
- borrowing at one simple rate and lending at another when the question asks only for the interest spread;
- table, timeline and caselet representations of the same mathematical contracts;
- exact MCQ and numeric-answer outputs after the ordinary mathematical contract is stable.

---

## 3. Excluded or delegated state families

### 3.1 `INT-CP-001`

Keep in CP-001 when the state has one principal, one constant rate and one duration, including direct/inverse formula questions, amount multiples and two observations on the same unchanged simple-interest line.

### 3.2 `INT-CP-003` and later compound checkpoints

Any multiplicative accumulation, interest-on-interest, conversion frequency or variable compound rate is outside CP-002.

### 3.3 `INT-CP-008` and `INT-CP-009`

- equal recurring instalment systems belong provisionally to CP-008;
- heterogeneous dated cash flows evaluated at a common date belong provisionally to CP-009;
- CP-002 may retain only explicit simple outstanding-balance ledgers whose contribution segments remain linear and fully stated.

### 3.4 Profit & Loss

A trader's commercial margin remains in PNL even when borrowed capital appears. CP-002 may own only the pure borrowing/lending interest spread when no sale, markup, discount or profit-margin reasoning is required.

### 3.5 Partnership

Capital-time profit sharing remains outside Interest. Similar algebra is not sufficient for ownership.

### 3.6 Average and Mixture

- Average owns pure weighted means;
- Mixture owns physical/component blending;
- CP-002 owns a weighted rate only when it is derived from an explicit simple-interest ledger and the time-value semantics are decisive.

### 3.7 True discount and banker's discount

These remain deferred to a separate commercial-discount authority.

---

## 4. Legacy and source recovery inputs

The chapter-level legacy audit already assigns these prior-art families to CP-002 discovery:

- `int_si_difference_two_cases`;
- `int_si_partial_discharge_timeline`;
- `int_different_rates_different_years_si`;
- `int_part_principal_two_rates_si`;
- `int_si_alligation_mixture` as a renamed linear split candidate, not as alligation authority;
- `int_two_sums_same_interest`;
- `int_weighted_average_rate` as a boundary prototype;
- `int_interest_more_by_rate_change`;
- `int_interest_more_by_time_change`;
- `int_two_people_invest_same_rate`;
- `int_same_interest_different_sums_rates_times`;
- `int_divide_total_interest_between_investments`;
- `int_investment_ratio_from_interest`;
- `int_weighted_interest_income`.

These names are discovery inputs only. They are not permanent QLs and do not imply one-to-one retention.

---

## 5. Exact canonical state

The runtime must reuse the chapter's exact rational foundation. No binary floating-point arithmetic, tolerance comparison or routine rounding may determine correctness.

```ts
type Rational = {
  numerator: bigint;
  denominator: bigint;
};

type IntCp002TimeUnit = "DAY" | "MONTH" | "YEAR";

type IntCp002DayCountBasis =
  | "NOT_APPLICABLE"
  | "ACTUAL_365"
  | "COMMERCIAL_360"
  | "EXPLICIT_DENOMINATOR";

interface IntCp002Contribution {
  contributionId: string;
  principal: Rational;
  annualRatePercent: Rational;
  durationYears: Rational;
  startsAtYears: Rational;
  endsAtYears: Rational;
  sourceKind:
    | "INDEPENDENT_DEPOSIT"
    | "RATE_INTERVAL"
    | "OUTSTANDING_BALANCE_SEGMENT"
    | "COUNTERFACTUAL_STATE";
}

interface IntCp002LedgerState {
  contributions: IntCp002Contribution[];
  totalPrincipal?: Rational;
  totalInterest?: Rational;
  interestDifference?: Rational;
  amountDifference?: Rational;
  commonRatePercent?: Rational;
  dayCountBasis: IntCp002DayCountBasis;
  comparisonOperator?: "EQUAL" | "GREATER_BY" | "LESS_BY" | "RATIO";
  eventOrder?: Array<{
    atYears: Rational;
    kind: "INVEST" | "RATE_CHANGE" | "PARTIAL_REPAYMENT" | "WITHDRAWAL";
    amount?: Rational;
    ratePercent?: Rational;
  }>;
}
```

### 5.1 Contribution law

For contribution `i`:

```text
I_i = P_i × R_i × T_i / 100
```

For the complete ledger:

```text
I_total = Σ I_i
```

The canonical solver may transform this into a weighted equation. The independent verifier must rebuild every contribution separately and sum exact results.

### 5.2 Piecewise rates on one unchanged principal

```text
I = P/100 × (R_1T_1 + R_2T_2 + ... + R_nT_n)
```

The generator must not collapse adjacent intervals when the question tests interval interpretation, but mathematically equivalent representations may merge at QL level after audit.

### 5.3 Split principal

For total principal `S`, unknown split `x` and `S-x`:

```text
I = xR_1T_1/100 + (S-x)R_2T_2/100
```

Valid-state-first generation should begin from an admissible exact `x`, construct `I`, and then ask the inverse.

### 5.4 Common rate from multiple contributions

If all contributions share unknown rate `R`:

```text
R = 100I_total / Σ(P_iT_i)
```

The explanation must still show the actual weighted sum rather than only presenting the compact formula.

### 5.5 Partial discharge / principal reduction

When a principal changes at declared event times, each balance segment contributes only over its own duration:

```text
I_total = Σ(B_k × R_k × ΔT_k / 100)
```

The event order must be explicit. A payment at the start of a segment and a payment at its end are not interchangeable.

### 5.6 Equal-interest relation

For two states with equal simple interest:

```text
P_1R_1T_1 = P_2R_2T_2
```

This may support recovery of a principal, rate, duration or ratio. Merge/split review must determine whether answer-semantic variants share one authority.

### 5.7 Counterfactual comparisons

For the same principal under a rate change:

```text
ΔI = PT(R_2-R_1)/100
```

For the same principal and rate under a duration change:

```text
ΔI = PR(T_2-T_1)/100
```

A shortcut identity does not replace the independent reconstruction of both complete interest states.

### 5.8 Calendar-day basis

Day-based questions are valid only when the denominator is explicit or unambiguous in the source state:

```text
T = days / basis
```

No runtime may silently choose 360 or 365.

---

## 6. Provisional contract families for executable discovery

These are prototype ancestries, not frozen solve modes or QLs.

### Family A — Piecewise rate ledger

Candidate tasks:

- find total interest over successive rate intervals;
- find amount after the complete ledger;
- recover one missing interval rate;
- recover one missing interval duration;
- recover principal from total interest and the interval ledger;
- compare the piecewise scheme with one constant-rate scheme.

### Family B — Multiple independent deposits

Candidate tasks:

- total interest from two or more deposits;
- recover one missing deposit;
- recover one missing duration or rate;
- recover a common rate;
- find the contribution of one deposit to total interest;
- compare two people's total interest.

### Family C — Split-principal allocation

Candidate tasks:

- divide total principal between two rates for target interest;
- recover the principal ratio;
- recover one part from total principal and total interest;
- equal-interest allocation;
- allocation under different durations;
- three-part allocation only if it yields a materially distinct bounded exam contract.

### Family D — Equality and ratio relations

Candidate tasks:

- equal interest from different principal-rate-time states;
- recover principal/rate/time ratio;
- compare interests by a stated ratio;
- recover one state from another state and an interest difference;
- determine which scheme produces more interest and by how much.

### Family E — Counterfactual change

Candidate tasks:

- extra interest due to a higher rate;
- interest saved by a shorter duration;
- simultaneous stated changes in rate and duration;
- recover original rate or duration from the change in interest;
- compare original and revised amounts.

### Family F — Outstanding-balance segments

Candidate tasks:

- total interest after one partial repayment;
- recover the repayment amount;
- recover the repayment time;
- compare early and late repayment interest;
- two reductions only after event-order ambiguity and QL distinctness are proven;
- reject any state requiring an unstated banking convention.

### Family G — Borrow/lend spread

Candidate tasks:

- net simple-interest gain from borrowing at one rate and lending at another;
- recover lending rate from the net gain;
- recover principal or duration;
- different durations only when all dates and balances are explicit.

Reject or reassign when a commercial sale or profit-margin step becomes decisive.

### Family H — Declared day-count ledger

Candidate tasks:

- interest over exact days;
- compare 360-day and 365-day declared contracts;
- recover days from interest;
- combine day and month intervals only with exact, declared conversion rules.

### Family I — Representation-only variants

- table of deposits;
- rate timeline;
- two-bank comparison card;
- caselet with common data;
- data-sufficiency shell.

These remain representations unless they change the mathematical contract.

---

## 7. Candidate disposition protocol

Every executable prototype receives exactly one disposition:

```text
RETAIN_AS_DISTINCT_AUTHORITY
MERGE_WITH_AUTHORITY
SPLIT_INTO_AUTHORITIES
REASSIGN_TO_OTHER_CP
RETAIN_AS_REPRESENTATION_ONLY
RETAIN_AS_DISTRACTOR_ONLY
REJECT_AS_AMBIGUOUS
REJECT_AS_REDUNDANT
```

A prototype may become a permanent QL only after:

- its given/unknown structure is materially distinct;
- its independent verifier is complete;
- it has a stable misconception profile;
- it is not merely a wording, context or numeric variant;
- it survives cross-family merge/split review;
- no uncovered inverse or representation invalidates the proposed freeze.

---

## 8. Solver and verifier separation

### 8.1 Canonical solver

The solver may use exact weighted equations, symbolic rearrangement and exact rational reduction.

### 8.2 Independent verifier

The verifier must:

1. rebuild every contribution or balance segment from source state;
2. compute each interest contribution independently;
3. apply event order explicitly;
4. sum the ledger exactly;
5. compare the candidate answer with the reconstructed target;
6. reject a deliberately tampered answer.

The verifier must not trust:

- a stored target;
- a precomputed weighted coefficient;
- the canonical solver's intermediate result;
- floating tolerance;
- displayed answer text.

### 8.3 Inverse verification

For an unknown principal, rate or duration, the verifier substitutes the candidate back into the full ledger and confirms all stated totals, differences, equalities and bounds.

---

## 9. Valid-state-first generation

All inverse questions begin from an admissible exact hidden state and derive the givens.

Mandatory generation rules:

- every principal and balance is positive;
- every duration is positive unless a zero-length boundary test is explicitly internal-only;
- rates are non-negative and exam-realistic;
- split parts are positive and sum exactly to the declared total;
- event times are ordered and remain within the declared horizon;
- partial repayment never produces a negative outstanding principal;
- target answers are exact and displayable under the chosen answer semantic;
- all four options are distinct after formatting;
- one and only one option verifies;
- no hidden convention is required;
- explicit day-count basis is retained in state and wording;
- deterministic seed replay produces byte-stable learner content and trace metadata.

The runtime may use bounded deterministic retries for recoverable option collisions, but requested seed, effective seed and attempt count must remain traceable.

---

## 10. Difficulty must emerge from state

Difficulty is not assigned by QL label alone.

Potential state-derived factors:

- number of contributions or intervals;
- whether the unknown appears inside one or several terms;
- unit conversion burden;
- event-order burden;
- split-principal algebra;
- equality or comparison relation;
- number of inverse steps;
- representation density;
- closeness and realism of distractors;
- whether a shortcut exists without obscuring the full method.

Every retained authority must be audited across the difficulty states it can genuinely support. Unsupported `QL + difficulty` combinations must fail closed rather than fabricate complexity.

---

## 11. Misconception and distractor inventory

Distractors must come from exact misconception transformations, not arbitrary offsets.

Provisional misconception IDs:

- `CP002_SUM_PRINCIPALS_BEFORE_WEIGHTING`;
- `CP002_AVERAGE_RATES_UNWEIGHTED`;
- `CP002_AVERAGE_DURATIONS_UNWEIGHTED`;
- `CP002_APPLY_LATEST_RATE_TO_ALL_INTERVALS`;
- `CP002_APPLY_FIRST_RATE_TO_ALL_INTERVALS`;
- `CP002_IGNORE_ONE_CONTRIBUTION`;
- `CP002_DOUBLE_COUNT_OVERLAP`;
- `CP002_USE_TOTAL_DURATION_FOR_EACH_DEPOSIT`;
- `CP002_USE_TOTAL_PRINCIPAL_FOR_EACH_RATE`;
- `CP002_FORGET_COMPLEMENT_S_MINUS_X`;
- `CP002_SUBTRACT_INSTEAD_OF_ADD_CONTRIBUTIONS`;
- `CP002_COMPARE_AMOUNT_WHEN_INTEREST_ASKED`;
- `CP002_COMPARE_INTEREST_WHEN_AMOUNT_ASKED`;
- `CP002_REPAYMENT_APPLIED_AT_WRONG_BOUNDARY`;
- `CP002_INTEREST_ON_REPAID_PRINCIPAL`;
- `CP002_WRONG_DAY_COUNT_BASIS`;
- `CP002_MONTHS_NOT_CONVERTED_TO_YEARS`;
- `CP002_PERCENT_USED_AS_DECIMAL_WITH_EXTRA_DIVIDE_100`;
- `CP002_BORROW_LEND_RATES_ADDED`;
- `CP002_EQUAL_INTEREST_ASSUMED_EQUAL_PRINCIPAL`.

Each displayed wrong option must include:

- misconception ID;
- exact transformed computation;
- why the result is plausible;
- why it fails the stated ledger;
- distance/proximity evidence where applicable.

---

## 12. Learner explanation contract

Every retained English explanation must follow the established four-tier teacher voice:

1. `📌 Core Concept / Main Rule`;
2. `📝 Step-by-Step Solution`;
3. `⚡ Exam Speed Shortcut`;
4. `⚠️ Common Traps & Option Analysis`.

Every worked solution must:

1. identify each principal/rate/time segment;
2. convert time units explicitly;
3. write the governing ledger equation;
4. substitute the actual generated values;
5. show intermediate contribution arithmetic or algebra;
6. sum or compare the contributions visibly;
7. state and numerically verify the final answer;
8. analyse all three displayed wrong options.

A symbolic formula followed immediately by the final answer is invalid.

Advanced split or partial-discharge questions must show the actual equation and isolation of the unknown. Shortcuts may compress arithmetic but may not replace the full pedagogical solution.

Internal QL IDs, seeds, solve-contract names and developer traces must never appear in learner-facing output.

---

## 13. Representation contract

The same mathematical authority may support:

- natural prose;
- compact bank/deposit table;
- horizontal rate timeline;
- outstanding-balance timeline;
- two-person or two-bank comparison;
- common-data caselet;
- numeric-answer representation.

A representation adapter must preserve:

- hidden mathematical state;
- option values and order;
- correct index;
- mathematical fingerprint;
- misconception ownership;
- difficulty state;
- explanation result.

Data sufficiency remains locked until the ordinary mathematical authority is frozen and independently verifiable.

---

## 14. Multilingual policy

English executable discovery comes first.

Hindi and Punjabi may start only after:

- English ownership is stable;
- permanent QLs are frozen;
- mathematical fingerprints are immutable;
- option values and indices are stable;
- learner explanations meet the full numerical-substitution contract.

Localisation must preserve exact mathematical state and adapt language naturally. It must not mechanically translate internal terminology or produce overly formal/legal Punjabi and Sanskritised Hindi.

Cross-language proof must verify identical:

- hidden state;
- QL and solve-contract identity;
- option values and order;
- correct index;
- mathematical fingerprint;
- misconception IDs;
- release and seed trace.

---

## 15. Executable discovery waves

Counts below are not quotas. They describe work sequence only.

### Wave 0 — Shared ledger foundation

Implement:

- exact contribution and event types;
- contribution normalisation;
- day-count conversion;
- exact ledger summation;
- independent segment verifier;
- stable fingerprinting;
- deterministic state and trace utilities.

### Wave 1 — Architecture-establishing prototypes

Implement at least one serious prototype from each currently justified ancestry:

- piecewise rates;
- multiple independent deposits;
- split principal;
- equal-interest relation;
- counterfactual rate/time change;
- partial discharge;
- borrow/lend spread;
- declared day-count basis.

This wave establishes architecture. It does not freeze QLs or cap future discovery.

### Wave 2 — Direct and inverse saturation

For every surviving ancestry, audit all meaningful unknown positions:

- interest;
- amount;
- principal;
- one rate;
- common rate;
- one duration;
- one split;
- repayment amount/time;
- comparison difference or ratio.

### Wave 3 — Representation and edge saturation

Cover:

- table and timeline representations;
- months, days and fractional years;
- equal and unequal durations;
- two and three contribution boundaries;
- close distractors;
- answer-semantic distinction;
- event-order boundaries;
- valid and rejected day-count conventions.

### Wave 4 — Gap and ownership audit

Perform chapter-wide:

- missing-variable audit;
- inverse audit;
- contribution-topology audit;
- event-order audit;
- representation audit;
- answer-semantic audit;
- misconception audit;
- duplicate-authority audit;
- explanation repetition audit;
- source-pattern audit;
- ownership collision audit against CP-001, CP-008, CP-009, PNL, Average, Mixture and Partnership.

### Wave 5 — Permanent QL proposal

Only after no meaningful gap remains:

- propose QL merges/splits;
- allocate permanent IDs;
- freeze solve contracts;
- create exhaustive regression;
- export human-review corpus;
- seek explicit English approval.

---

## 16. Mandatory audits before English freeze

The eventual runtime must prove:

- exact rational arithmetic across every generated state;
- deterministic replay;
- canonical solver correctness;
- independent verifier agreement;
- deliberate tampered-answer rejection;
- all retained prototype ancestries;
- every permanent QL and supported difficulty band;
- all four answer positions;
- no duplicate formatted options;
- exact answer-key alignment;
- valid-state constraints;
- bounded retry behaviour;
- contribution and event-order traceability;
- source and legacy disposition completeness;
- misconception-owned close distractors;
- full four-tier explanations;
- actual values substituted in every formula;
- no internal metadata leakage;
- no central Question Studio registration;
- no Question Bank write, test eligibility or public publication.

QL counts and solve-mode counts remain open until these audits stop finding meaningful uncovered contracts.

---

## 17. Lifecycle and safety locks

Throughout design and executable discovery:

```text
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No CP-002 file may mutate the central Quant V4 package registry or shared Question Studio route during discovery.

---

## 18. Immediate implementation sequence

1. create the exact contribution-ledger foundation on a dedicated branch;
2. add materially separate solver and verifier routes;
3. recover and disposition every CP-002 legacy family;
4. implement architecture-establishing English prototypes without permanent QL IDs;
5. export a review corpus organised by prototype ancestry;
6. run direct/inverse/edge/representation/source gap audits;
7. merge, split, reassign or reject prototypes;
8. allocate permanent QLs only after exhaustive closure;
9. seek human English approval;
10. localise to Hindi and Punjabi only after the English freeze.

The next coding checkpoint is **Wave 0 — exact multi-contribution simple-interest ledger foundation**.
