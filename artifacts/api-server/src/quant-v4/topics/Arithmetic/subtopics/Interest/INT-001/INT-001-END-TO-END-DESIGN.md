# INT-001 — Simple & Compound Interest

Status: **end-to-end design hypothesis under executable discovery**  
Subtopic: **Arithmetic → Interest**  
Student-facing title: **Simple & Compound Interest**  
Permanent QLs: **0**  
Frozen CPs: **0**  
Frozen solve modes: **0**  
Runtime languages: English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)

This document defines the intended chapter architecture from exact mathematical state through Question Studio review. It does not freeze QL counts, solve-mode counts, difficulty quotas, CP ranges or permanent identities. Every count remains open until source, inverse, representation, edge, merge/split and executable gap audits stop finding meaningful uncovered task contracts.

---

## 1. Executive decision

`INT-001` should be one student-facing chapter backed by several related engines:

1. simple-interest linear accumulation;
2. compound-interest periodic accumulation;
3. variable-rate and variable-period ledgers;
4. periodic growth and decay;
5. simple-versus-compound comparison identities;
6. effective-rate and scheme comparison;
7. dated cash-flow and instalment equivalence;
8. bounded inverse reconstruction.

A QL represents a materially distinct exam task contract. A new story, name, currency amount or surface wording does not create a QL unless it changes at least one of:

- the given/unknown structure;
- the accumulation law;
- the period topology;
- the cash-flow timing;
- the answer semantic;
- the governing inverse;
- the misconception profile;
- the representation needed by the learner.

The chapter is suitable for parallel implementation because it has a self-contained state model and solver family. It may reuse exact rational and percentage helpers, but it must not alter Percentage, Ratio, Profit & Loss, Mixture, Average, Time & Work, Mensuration or P&C ownership.

---

## 2. Source and product basis

The design is based on the uploaded SSC, Banking and quantitative-aptitude references, which collectively expose:

- direct and inverse simple-interest relations;
- principal, rate, time, interest and amount tasks;
- fractional years, months and actual-day questions;
- different rates over different intervals;
- multiple sums invested for different durations;
- annual, half-yearly, quarterly and monthly compounding;
- broken-period compound-interest conventions;
- variable annual rates;
- population growth, depreciation and salary escalation;
- doubling, tripling and amount-multiple tasks;
- differences between simple and compound interest;
- successive-year interest relations;
- effective annual rate and scheme comparison;
- equal instalments, recurring deposits and dated repayments;
- equal future-value and inheritance-allocation questions;
- exam-oriented inverse questions where principal, rate, time or instalment is recovered.

The product target is not a formula worksheet. Generated questions must resemble real SSC, Banking, Railway and Punjab-state exam questions, with exact answers, plausible distractors, natural wording and learner-facing explanations that expose the decisive reasoning.

---

## 3. Scope and ownership boundaries

### 3.1 Included

The chapter owns questions whose decisive inference is the time value of a principal, balance or periodically changing value under simple or compound accumulation:

- simple interest and simple amount;
- compound interest and compound amount;
- direct and inverse recovery of principal, rate, time, interest or amount;
- amount multiples such as double, triple or eight times;
- different simple rates over explicit time intervals;
- different compound rates over explicit conversion periods;
- annual, half-yearly, quarterly and monthly compounding;
- explicit broken-period conventions;
- comparison of compounding frequencies;
- effective annual rate;
- repeated percentage growth or depreciation when the tested structure is periodic accumulation;
- population, salary, value and production-capacity growth/decay when modelled period by period;
- simple-versus-compound differences and successive-year interest;
- equal and unequal dated deposits or repayments;
- equal instalments and outstanding-balance reconstruction;
- present/future equivalence at a common due date;
- division of a sum so future amounts become equal;
- bounded mixed systems combining two or more mature interest authorities;
- MCQ and numeric-answer presentation;
- data-sufficiency presentation only after the ordinary mathematical QL is independently proven.

### 3.2 Excluded or delegated

The chapter does not own:

- pure percentage increase/decrease with no periodic accumulation or time-value inference;
- profit, loss, markup, discount, commission, false weight or commercial margin;
- partnership profit sharing by capital and time;
- mixture or alligation;
- wage distribution based on work contribution;
- arithmetic or geometric progressions with no interest/growth interpretation;
- banker's discount, true discount and bill discounting unless a later dedicated ownership decision explicitly admits them;
- taxation, insurance premium calculation, regulatory banking charges or legal loan terms;
- continuous compounding, calculus-based finance or unrestricted real-number logarithmic inversion;
- real-world EMI products involving fees, floating benchmarks or daily reducing balances unless the full convention is explicitly supplied;
- investment advice, product recommendation or claims about current bank rates;
- questions whose answer depends on an unstated compounding or repayment convention.

### 3.3 Boundary rules

1. **Time-value semantics decide ownership.** Merely seeing a percentage does not move a question into INT.
2. **Periodic state is explicit.** Every compound question must declare the conversion period or use a validated exam convention.
3. **Cash-flow timing is first-class.** A payment at the beginning of a period is not interchangeable with one at the end.
4. **Broken periods are never guessed.** The generator must encode the exact convention used after complete conversion periods.
5. **Growth applications share an engine, not necessarily wording.** Population, salary and depreciation contexts may share mathematics while retaining context-appropriate language.
6. **Presentation is not a new CP.** Tables, caselets and data sufficiency are representations unless they change the mathematical contract.
7. **No floating-log dependency.** Inverse time/rate questions must be constructed from exact admissible states or solved by bounded exact search.

---

## 4. Canonical mathematical model

### 4.1 Exact primitives

```ts
type Rational = {
  numerator: bigint;
  denominator: bigint;
};

type InterestMethod = "SIMPLE" | "COMPOUND";

type PeriodUnit =
  | "DAY"
  | "MONTH"
  | "QUARTER"
  | "HALF_YEAR"
  | "YEAR";

type CompoundingFrequency =
  | "ANNUAL"
  | "HALF_YEARLY"
  | "QUARTERLY"
  | "MONTHLY"
  | "EXPLICIT_PERIOD";

type CashFlowDirection = "DEPOSIT" | "REPAYMENT" | "WITHDRAWAL";

interface PeriodRate {
  periodIndex: number;
  rate: Rational;
  periodUnit: PeriodUnit;
}

interface CashFlow {
  atPeriod: Rational;
  amount: Rational;
  direction: CashFlowDirection;
}

interface InterestState {
  principal: Rational;
  method: InterestMethod;
  annualNominalRate?: Rational;
  periodicRates: PeriodRate[];
  frequency?: CompoundingFrequency;
  elapsedPeriods: Rational;
  cashFlows: CashFlow[];
  brokenPeriodConvention?:
    | "NONE"
    | "SIMPLE_ON_ACCUMULATED_AMOUNT"
    | "EXPLICIT_PERIODIC_COMPOUNDING";
}
```

All rates are stored as exact fractions, not binary floating-point percentages. Money is stored in exact minor units or exact rational units until display.

### 4.2 Simple interest

For principal `P`, rate per time unit `r` and time `t`:

```text
I = P × r × t
A = P + I = P(1 + rt)
```

Inverse forms:

```text
P = I/(rt)
r = I/(Pt)
t = I/(Pr)
```

When rates vary over disjoint simple-interest intervals:

```text
I = P × Σ(r_k t_k)
```

For multiple independent sums:

```text
Total simple interest = Σ(P_i r_i t_i)
```

### 4.3 Compound interest

For constant periodic rate `r` over `n` complete periods:

```text
A = P(1 + r)^n
CI = A − P
```

For variable periodic rates:

```text
A = P × Π(1 + r_k)
```

For depreciation or periodic decay:

```text
V_n = V_0 × Π(1 − d_k)
```

The period-by-period recurrence is always valid:

```text
B_0 = P
B_k = B_(k−1)(1 + r_k)
```

### 4.4 Nominal annual rate with conversion frequency

If nominal annual rate is `j` and there are `m` equal conversion periods per year:

```text
periodic rate = j/m
number of periods = m × years
A = P(1 + j/m)^(m×years)
```

This is used only when the wording explicitly states that the annual rate is compounded `m` times per year.

### 4.5 Broken periods

For annual compounding with `n` whole years and an explicitly stated simple-interest treatment for a remaining fraction `f` of a year:

```text
A = P(1 + r)^n(1 + rf)
```

This convention must never be silently applied to half-yearly, quarterly or monthly questions when the remaining duration already forms complete conversion periods.

### 4.6 Effective annual rate

For nominal annual rate `j`, compounded `m` times per year:

```text
effective annual rate = (1 + j/m)^m − 1
```

### 4.7 Simple-versus-compound relations

For the same `P`, periodic rate `r` and annual compounding:

```text
SI_n = Pnr
CI_n = P[(1 + r)^n − 1]
Difference_n = P[(1 + r)^n − 1 − nr]
```

For two years:

```text
CI_2 − SI_2 = Pr^2
```

For three years:

```text
CI_3 − SI_3 = P(3r^2 + r^3)
```

Interest earned during the `k`th compound period:

```text
J_k = Pr(1 + r)^(k−1)
```

Hence successive yearly interests form a geometric progression under a constant periodic rate. The chapter may use this identity directly, but the independent verifier must rebuild the balance period by period.

### 4.8 Amount multiples

Under simple interest:

```text
A/P = 1 + rt
```

Under compound interest:

```text
A/P = (1 + r)^n
```

Questions such as “doubles in `x` years” must preserve the stated method. A simple-interest doubling relation cannot be reused as a compound-interest relation.

### 4.9 Dated cash-flow equivalence

Choose an explicit comparison date `T`. For compound accumulation:

```text
Equivalent value at T = Σ C_k(1 + r)^(T − t_k)
```

For present-value comparison:

```text
Present value = Σ C_k/(1 + r)^(t_k)
```

The implementation should prefer exact forward accumulation to a common due date when it avoids rational denominators.

### 4.10 Instalment recursion

For an opening balance `B_0`, periodic rate `r` and end-of-period payment `X`:

```text
B_k = B_(k−1)(1 + r) − X
```

A loan is cleared after `n` instalments when `B_n = 0` exactly. Beginning-of-period payments use a different event order and must have a separate topology flag.

---

## 5. Provisional canonical-problem architecture

The CP boundaries below are hypotheses. Executable discovery may merge, split, defer or reassign them. No CP receives a QL quota.

### INT-CP-001 hypothesis — Simple-interest fundamentals and direct inverses

Owns one principal under one simple rate with one uninterrupted duration.

Candidate task directions:

- find simple interest;
- find amount;
- recover principal from interest;
- recover principal from amount;
- recover rate;
- recover time;
- convert months, days or mixed years to the stated rate unit;
- find annual interest from total interest and duration;
- find interest for a specified fraction of the original duration;
- recover a missing value from amount-to-principal or interest-to-principal ratio;
- doubling, tripling or general amount-multiple under simple interest;
- compare principal and interest at a given time;
- determine when interest equals a stated fraction or multiple of principal.

Collision tests:

- variable rates belong to CP-002;
- multiple principals belong to CP-002;
- compound accumulation belongs to CP-003;
- pure percentage without time-value semantics belongs to Percentage.

### INT-CP-002 hypothesis — Simple-interest comparisons, interval ledgers and multiple sums

Owns simple accumulation where the state contains multiple rate intervals, multiple principals, multiple lenders or explicit repayments that preserve simple-interest reasoning.

Candidate task directions:

- different simple rates in successive intervals;
- one rate for the first period and another afterwards;
- same principal in two schemes;
- different principals at the same or different rates;
- total interest from several deposits;
- recover a common rate from multiple principal-time contributions;
- recover one principal from a total principal and total interest;
- divide a sum between two rates for a target total interest;
- compare two banks' simple rates from interest difference;
- early repayment or principal reduction under an explicit simple outstanding-balance convention;
- reconstruct a missing duration from a principal-time ledger;
- calendar-day simple interest using a declared day-count basis;
- equal interest under different principal-rate-time combinations;
- simple-interest gain from borrowing at one rate and lending at another.

Collision tests:

- compound cash flows belong to CP-008 or CP-009;
- profit margin belongs to PNL even when a trader borrowed money;
- partnership allocation remains outside INT.

### INT-CP-003 hypothesis — Annual compound-interest fundamentals and inverses

Owns one principal, constant annual compounding and complete annual periods, without intervening cash flows.

Candidate task directions:

- find amount or compound interest;
- recover principal from amount or compound interest;
- recover exact exam-friendly rate;
- recover an integer number of years;
- amount multiples under compound interest;
- use successive-year balances or interests;
- find a previous year's amount;
- compare first-year and later-year interest;
- determine the additional interest earned because of compounding;
- derive one missing state from two consecutive amounts;
- compare amounts for different durations at the same rate;
- reconstruct rate from an exact growth factor.

Inverse generation must begin from an exact admissible state. Runtime solving must use factor matching or bounded exact search, never an unrestricted floating logarithm.

### INT-CP-004 hypothesis — Conversion frequency and broken periods

Owns questions where annual, half-yearly, quarterly, monthly or explicit conversion-period semantics are decisive.

Candidate task directions:

- amount or CI under half-yearly compounding;
- amount or CI under quarterly compounding;
- amount or CI under monthly compounding;
- recover principal, rate or number of conversion periods;
- compare annual and more frequent compounding;
- find the excess earned from a higher compounding frequency;
- effective annual rate;
- mixed frequency across successive intervals;
- annual compounding followed by an explicit fractional-year simple segment;
- durations such as 18 months, 9 months or 2 years 73 days under a declared convention;
- recover a frequency or convention from amount evidence where uniquely determined.

Ambiguous textbook conventions must be rejected rather than guessed.

### INT-CP-005 hypothesis — Variable compound rates and periodic growth/decay applications

Owns repeated multiplicative change with explicit period rates, including non-money applications when periodic accumulation is the tested structure.

Candidate task directions:

- different rates in successive years;
- alternating growth and decline;
- population after or before several years;
- salary after repeated annual increments;
- machine, vehicle or asset value after depreciation;
- recover original value from current value;
- recover one missing annual rate from the final value;
- find the period in which a threshold is crossed;
- combined growth and migration/withdrawal when event order is explicit;
- compare two periodic growth plans;
- piecewise compounding method or frequency;
- repeated appreciation followed by depreciation;
- restore a value after a fall and compare with the original.

Boundary with Percentage: one-off or generic successive percentage questions remain in Percentage. INT owns the question when period-by-period accumulation, historical/future value or compound-style inverse reasoning is central.

### INT-CP-006 hypothesis — Simple-versus-compound differences and successive-interest relations

Owns questions whose decisive information is a relationship between SI and CI or between compound interest earned in different periods.

Candidate task directions:

- difference between SI and CI for two years;
- difference for three years;
- recover principal from a known difference and rate;
- recover rate from SI, CI or their difference;
- recover two-year or three-year difference from another difference;
- derive three-year difference from two-year SI/CI data;
- compare annual and half-yearly differences;
- use the ratio of differences for two durations;
- recover first-year interest from the second-year excess;
- recover principal/rate from consecutive yearly interests;
- find the `k`th-year interest;
- compare cumulative CI with SI under changed principal or duration;
- determine when CI exceeds SI by a target amount.

The shortcut identity is not sufficient proof. Every candidate must also pass direct SI and period-ledger CI reconstruction.

### INT-CP-007 hypothesis — Effective rates, scheme comparison and equal future values

Owns comparison and allocation tasks where two or more complete interest schemes are evaluated at a common date.

Candidate task directions:

- choose the higher final amount between schemes;
- find the difference between scheme returns;
- recover one scheme's rate from equal maturity amounts;
- simple borrowing versus compound lending gain;
- nominal versus effective annual rate;
- find an equivalent simple rate for a stated duration;
- find an equivalent compound rate from a simple return;
- divide a total sum so two future amounts are equal;
- allocate inheritance so beneficiaries receive equal amounts at different future ages;
- equal present values for different maturity dates;
- compare equal principal or equal interest across schemes;
- find the break-even duration between two bounded exam-friendly schemes.

This CP does not recommend real financial products. All schemes are closed mathematical states.

### INT-CP-008 hypothesis — Equal instalments and reducing-balance repayment

Owns a single opening balance with an explicitly ordered sequence of equal repayments or withdrawals.

Candidate task directions:

- find an equal annual instalment;
- find an equal half-yearly instalment;
- find the opening loan from instalment and rate;
- find the outstanding balance after a given payment;
- find the final balancing instalment;
- compare instalment values under two rates;
- end-of-period versus beginning-of-period instalments;
- partial down payment followed by equal instalments;
- one missed or changed instalment where the event order is explicit;
- recover the rate from a bounded exact instalment schedule;
- savings deposited at the end of each period;
- withdrawals from an accumulated fund.

The canonical solver may use a closed finite geometric sum. The independent verifier must use the balance recurrence.

### INT-CP-009 hypothesis — Multiple dated cash flows and equated due dates

Owns unequal deposits, repayments or allocations whose timing must be carried to a common date.

Candidate task directions:

- deposits made on different dates;
- unequal repayments at different times;
- find a missing dated payment;
- replace several payments with one equivalent payment;
- find an equated due date from exact bounded choices;
- compare payment plans at a common settlement date;
- recurring deposit with a short bounded sequence;
- split a sum today to produce stated future shares;
- find present value of a small number of future amounts;
- combine a down payment and later instalments;
- recover original debt from a dated payment ledger.

Collision test with CP-008: equal periodic instalments with one recurring topology belong to CP-008. Heterogeneous cash-flow timing belongs here.

### INT-CP-010 hypothesis — Mixed advanced interest systems

Owns only source-backed questions that combine at least two mature INT authorities and cannot be assigned cleanly to CP-001 through CP-009.

Candidate task directions:

- method changes from simple to compound or compound to simple;
- rate and frequency changes with intervening cash flows;
- borrowing under one method and staged lending under another;
- variable-rate instalments;
- comparison involving SI/CI difference plus a cash-flow condition;
- growth/decay followed by equal-value allocation;
- bounded systems of two unknowns supported by independent verification;
- possible/impossible or sufficient/insufficient predicates where the evidence is explicit.

This CP must not become a dumping ground. Each candidate must document:

- which two or more mature authorities it combines;
- why no earlier CP can own it;
- why the combination is source-backed and exam-realistic;
- why the answer is uniquely determined;
- how an independent verifier proves it.

---

## 6. Answer semantics

Every prototype and future QL must declare an exact answer semantic. Candidate semantics include:

```text
principal amount
simple interest
compound interest
total amount
annual nominal rate
periodic rate
effective annual rate
time duration
number of conversion periods
amount multiple
interest difference
interest for a specified period
future value
present value
depreciated value
population or salary value
instalment amount
outstanding balance
missing cash flow
equated settlement amount
scheme gain or difference
allocation ratio or component amount
possible/impossible predicate
```

The semantic controls normalisation, unit, display, option domain, explanation conclusion and verifier comparison.

---

## 7. Exact arithmetic and display policy

### 7.1 Internal arithmetic

Use reduced rational arithmetic or safe integers for:

- money;
- rates;
- time fractions;
- growth factors;
- powers of rational factors;
- present and future values;
- instalment recurrences;
- differences and comparisons.

Do not use floating-point equality or tolerance-based correctness.

### 7.2 Inverse policy

Inverse rate/time questions must use one of:

1. construction from an exact hidden state;
2. factorisation over an approved finite rate pool;
3. bounded integer/rational candidate enumeration;
4. exact polynomial identity for a small fixed number of periods.

Do not introduce numerical root finding merely to manufacture difficult-looking questions.

### 7.3 Money display

- Indian exam contexts default to `INR` and `₹`.
- Currency must remain metadata-driven rather than hard-coded into solver logic.
- Prefer integral rupee answers when the task does not teach paise/decimal handling.
- Permit terminating decimals only when source-like and intentionally formatted.
- Avoid ugly repeating currency values by valid-state construction, not by hiding precision.
- Never round an intermediate balance and then continue calculation unless the question explicitly states a rounding rule.

### 7.4 Rate and time display

- rates may be integers, terminating decimals or exact mixed fractions when exam-realistic;
- time may be years, months, days or exact mixed durations;
- every conversion must state or encode the unit basis;
- actual-day questions must declare a 365-day or other explicit convention;
- percentages must not silently switch between annual and periodic rates.

---

## 8. Valid-state-first parameter generation

Every generator should follow:

```text
construct a valid hidden financial state
→ derive all dependent values exactly
→ select the requested unknown
→ hide only the required evidence
→ independently prove uniqueness
→ build misconception-driven options
→ render the student-facing question
```

Universal guards:

- principal and balances are positive unless an intentional cleared-balance state is reached;
- rates are within approved exam-realistic bounds;
- period count is positive and bounded;
- compounding frequency matches duration;
- every cash-flow time is explicit and ordered;
- withdrawals or repayments do not create an unintended negative balance;
- broken-period convention is explicit;
- answer display is exact or has an explicit rounding instruction;
- no accidental equality between correct answer and a distractor;
- inverse questions have exactly one admissible solution;
- generated context remains plausible;
- deterministic regeneration from the same seed;
- parameter pools do not collapse to a tiny set after rejection.

---

## 9. Runtime architecture

Proposed shared foundation:

```text
foundation/types.ts
foundation/rational.ts
foundation/rate-period.ts
foundation/interest-state.ts
foundation/cash-flow-ledger.ts
foundation/parameter-generator.ts
foundation/simple-interest-solver.ts
foundation/compound-interest-solver.ts
foundation/independent-verifier.ts
foundation/reasoning-graph.ts
foundation/explanation-renderer.ts
foundation/distractor-engine.ts
foundation/validator.ts
foundation/coverage-auditor.ts
foundation/pipeline.ts
index.ts
```

Checkpoint-local prototype directories may own task topology, fixtures and audits. Shared arithmetic, balance recurrence and lifecycle rules must not be copied between CPs.

---

## 10. Human-owned libraries and future registry contract

Proposed libraries:

```text
task-registry.library.json
question-language.en.json
question-language.hi.json
question-language.pa.json
rate-and-period-pools.library.json
money-state-pools.library.json
scenario-domains.library.json
distractor-strategy.library.json
explanation-strategy.library.json
source-coverage-ledger.md
ownership-collision-ledger.md
```

Every future permanent QL row must include:

```text
QL ID
CP owner
task direction
unknown variable
answer semantic
interest method
rate topology
period topology
cash-flow topology
required evidence
context domains
difficulty evidence
explanation strategy
distractor strategies
unit/display policy
canonical solver
independent verifier
structural uniqueness rationale
source or audit rationale
review status
```

---

## 11. Canonical solver and independent verifier

The canonical solver may use exam-smart identities. The independent verifier must reconstruct the answer through a materially different route.

Examples:

```text
CP-001 solver: direct SI algebra
CP-001 verifier: explicit per-period linear interest ledger

CP-002 solver: weighted principal-rate-time equation
CP-002 verifier: independent contribution summation by interval and principal

CP-003 solver: rational power formula
CP-003 verifier: period-by-period balance recurrence

CP-004 solver: frequency-normalised exponent
CP-004 verifier: explicit conversion-period simulation

CP-005 solver: product of growth/decay factors
CP-005 verifier: chronological state transition ledger

CP-006 solver: SI/CI difference identities
CP-006 verifier: full SI computation plus independent CI recurrence

CP-007 solver: common-date factor equation
CP-007 verifier: independently accumulate each scheme to the comparison date

CP-008 solver: finite geometric-sum instalment identity
CP-008 verifier: outstanding-balance recurrence

CP-009 solver: present/future value equation
CP-009 verifier: forward all cash flows to a second explicit common date

CP-010 solver: composed authority
CP-010 verifier: independent full event simulation plus bounded solution search
```

Neither solver may trust option order, explanation text or a stored canonical answer.

---

## 12. Reasoning graph

Each generated candidate should emit a structured reasoning graph with nodes for:

- given principal, amount, rate and duration;
- rate-unit normalisation;
- period-count normalisation;
- conversion-period events;
- cash-flow events;
- accumulated balances;
- selected identity or equation;
- inverse search evidence;
- independent verification;
- final semantic answer.

The graph supports explanation rendering, review diagnostics, future step UI and detection of disagreements between mathematics and prose.

---

## 13. Explanation design

Explanations must be QL-specific, value-specific and context-aware. They must not be generic formula shells.

### 13.1 Four-tier competitive explanation

1. **What to notice** — identify simple/compound method, rate period, duration and event timing.
2. **Build the relation** — state the exact formula, factor or balance equation suited to this topology.
3. **Work through the values** — substitute displayed values and show meaningful intermediate balances or contributions.
4. **Check and conclude** — verify using a second relation, an amount decomposition or a quick exam check, then state the semantic answer.

### 13.2 Depth

- Easy explanations should normally contain 5–6 meaningful reasoning moves.
- Medium and Hard explanations should normally contain 7–8 meaningful moves.
- Do not pad a short solution with repeated prose.
- Do not compress a staged cash-flow problem into one unexplained formula.

### 13.3 Required explanation behaviour

- distinguish principal, interest and amount;
- distinguish annual nominal rate from periodic rate;
- name the number of compounding periods;
- show event order for deposits and repayments;
- explain why an inverse is unique;
- state the unit and method in the conclusion;
- include an exam-smart shortcut only when it remains valid for the exact topology;
- name one genuine common trap when useful.

Forbidden:

- “use the formula” without variable mapping;
- treating compound interest as simple interest over all periods;
- halving a rate without doubling the period count;
- using amount when principal is required;
- silently applying a broken-year convention;
- ending with an option letter instead of the answer;
- copying one explanation structure across unrelated task families;
- inserting unsupported financial advice.

---

## 14. Distractor architecture

Every wrong option must correspond to a declared misconception and be independently verified as wrong.

Chapter-wide misconception families include:

- using `A` instead of `P` in the interest base;
- returning amount when interest is asked, or vice versa;
- forgetting to convert months/days to the rate unit;
- using `P(1 + nr)` for compound interest;
- using `P(1 + r)^n` for simple interest;
- using annual rate unchanged for half-yearly/quarterly periods;
- changing periodic rate but not period count;
- subtracting principal twice;
- applying the final-year rate to every year;
- adding successive percentage rates instead of multiplying factors;
- reversing growth and depreciation factors;
- using the two-year SI/CI difference identity for three years;
- treating cumulative CI as the interest of the final year;
- placing a payment before interest when the wording places it after interest;
- omitting one instalment's accumulation period;
- comparing schemes at different dates;
- rounding an intermediate balance;
- choosing a second mathematically possible inverse outside the declared admissible domain.

Arbitrary `±1`, `±10`, `±100` or percentage offsets are forbidden unless they arise from a documented misconception.

---

## 15. Context and editorial policy

Approved context domains include:

- bank deposits and loans;
- personal lending in neutral exam language;
- savings schemes represented as closed mathematical plans;
- fixed deposits without current product claims;
- agricultural or business loans without regulatory detail;
- machinery, vehicle and equipment depreciation;
- population, salary and production-capacity growth;
- education funds and inheritance allocations;
- instalment purchases with all mathematical terms stated;
- recurring deposits and staged repayments.

Editorial guards:

- avoid implausibly tiny or enormous values unless source-backed;
- do not imply that a named real bank currently offers a rate;
- use fictional or generic institutions;
- avoid moralising descriptions of borrower or lender;
- use natural Indian competitive-exam English;
- vary stems by task and context, not by synonym substitution alone;
- keep every question determinate without hidden banking conventions.

---

## 16. Localisation design

Language implementation order:

1. English executable discovery;
2. English automated QA;
3. English manual editorial review;
4. English ownership freeze;
5. Hindi human-authored/adapted review;
6. Punjabi human-authored/adapted review;
7. multilingual parity and rendering proof;
8. publication decision.

Every QL is classified as:

```text
TRANSLATABLE
LANGUAGE_ADAPTED
LANGUAGE_SPECIFIC
```

Preferred learner-facing terminology:

```text
English: principal / original sum, interest, total amount, annual interest rate
Hindi: मूलधन / मूल राशि, ब्याज, कुल राशि, वार्षिक ब्याज दर
Punjabi: ਮੂਲਧਨ / ਮੂਲ ਰਕਮ, ਵਿਆਜ, ਕੁੱਲ ਰਕਮ, ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ
```

Avoid overly technical or literal translations where ordinary exam language is clearer. Hindi and Punjabi must preserve mathematical evidence, option parity, answer semantics and event order without copying English syntax unnaturally.

---

## 17. Representation policy

Supported representations after core QL proof:

- ordinary MCQ;
- compact table of rates/years/amounts;
- timeline for cash flows;
- year-by-year balance table;
- caselet containing several linked questions only when each item remains independently identified;
- numeric answer;
- data sufficiency as a cross-cutting wrapper.

Diagrams should be instructional, not decorative:

- period timeline for variable rates;
- balance ladder for compound growth;
- cash-flow timeline for instalments and dated payments;
- comparison-date marker for equivalent-value tasks.

The text explanation must remain complete without the visual.

---

## 18. Difficulty policy

Difficulty is evidence-based and instance-sensitive, not assigned to meet a quota.

Signals include:

- number of independent facts;
- direct versus inverse direction;
- rate/time unit conversions;
- number of conversion periods;
- variable rates or method changes;
- number and timing of cash flows;
- need for factor reconstruction;
- ambiguity traps that must be resolved;
- algebraic depth;
- option closeness;
- whether an exam-smart identity is visible or must be derived.

The same QL may generate different difficulty instances only when the reasoning burden genuinely changes and validation confirms the label.

---

## 19. Review and validation

Every generated candidate must satisfy:

- deterministic regeneration;
- canonical solver and independent verifier agreement;
- exact answer equals the declared answer semantic;
- four unique options for MCQ;
- exactly one correct option;
- every distractor is in-domain and demonstrably wrong;
- answer position coverage across seeds;
- valid units and rate-period alignment;
- explicit cash-flow event order;
- no malformed TeX or currency formatting;
- no unresolved placeholders;
- no generic explanation shell;
- no option-letter-only conclusion;
- lifecycle safety metadata;
- `publiclyPublishable: false` during discovery and review.

Required audits:

1. concept and formula audit;
2. forward/reverse/inverse audit;
3. answer-semantic audit;
4. period and frequency audit;
5. cash-flow event-order audit;
6. broken-period convention audit;
7. edge and boundary audit;
8. representation audit;
9. source-pattern saturation audit;
10. cross-CP ownership audit;
11. cross-chapter collision audit;
12. mathematical-equivalence duplicate audit;
13. wording and explanation duplicate audit;
14. distractor misconception audit;
15. exact arithmetic and display audit;
16. localisation and glyph audit;
17. device/render audit;
18. Question Studio and Question Bank lifecycle audit.

---

## 20. QL discovery and freeze rules

Permanent `INT-QL-*` IDs remain at zero until executable discovery is complete enough to support stable ownership.

A candidate becomes a permanent QL only when:

- its task contract is materially distinct;
- it is source-backed or closes a documented structural gap;
- its CP owner is stable;
- its answer semantic is explicit;
- exact valid-state generation is reliable;
- canonical and independent solving agree;
- misconception-driven options are safe;
- its explanation strategy is naturally distinct;
- it survives merge/split review;
- it is not a wording-only duplicate;
- English manual review approves it.

Counts freeze only after chapter-wide audits find no meaningful missing mode and no unresolved ownership collision. A later discovery may add a QL only through an explicit amendment with source or structural evidence.

---

## 21. Safe lifecycle

During design and prototype discovery:

```text
permanent QL IDs:       none
reviewStatus:           UNREVIEWED
questionBankStatus:     NOT_STORED
testEligibility:        INELIGIBLE
publiclyPublishable:    false
Question Studio mode:   review-only prototype or canonical review
public student routing: disabled
```

No prototype may become a Question Bank question, test item or public student question merely because its mathematics passes.

---

## 22. Implementation sequence

Sequence is dependency-based, not quota-based:

1. chapter-wide source and ownership ledger;
2. shared exact rate/period/cash-flow foundation;
3. `INT-CP-001` non-QL executable discovery;
4. `INT-CP-003` annual compound foundation;
5. `INT-CP-004` frequency and broken-period proof;
6. `INT-CP-006` SI/CI relation proof;
7. `INT-CP-002` multi-sum simple ledgers;
8. `INT-CP-005` variable growth/decay;
9. `INT-CP-007` scheme comparison;
10. `INT-CP-008` equal instalments;
11. `INT-CP-009` heterogeneous dated cash flows;
12. `INT-CP-010` bounded mixed systems;
13. chapter-wide merge/split and gap audit;
14. permanent QL allocation only after the relevant freeze gate;
15. English editorial freeze;
16. Hindi and Punjabi adaptation;
17. internal Question Studio integration;
18. separate publication decision.

Parallel safety:

- work only under `Arithmetic/subtopics/Interest/INT-001` until shared helper reuse is explicitly reviewed;
- do not modify central generation registries during design discovery;
- do not allocate permanent IDs speculatively;
- do not merge stacked runtime work out of order;
- keep review and public routes disabled.

---

## 23. First executable-discovery target

Begin with `INT-CP-001` because it establishes:

- rate/time unit normalisation;
- exact simple-interest state;
- direct and inverse answer semantics;
- valid money/rate/time pools;
- explanation and distractor conventions;
- non-QL prototype lifecycle;
- reviewer export format.

The first prototype wave must not reserve a QL count. It should implement candidate contracts, generate multi-seed review evidence, then classify each candidate as:

```text
retain
merge
split
defer
reassign
reject
```

Only after the CP-001 gap audit and manual review may permanent `INT-QL-*` allocation be proposed.

---

## 24. Current verdict

`INT-001` is approved as the next parallel mathematics design stream in principle.

Current state:

```text
chapter architecture:        proposed
CP boundaries:               provisional
permanent QLs:               0
frozen solve modes:          0
runtime code:                not started
English review:              not started
Hindi/Punjabi:               not started
Question Studio exposure:    disabled
public publication:          disabled
```

The next concrete deliverable is the `INT-CP-001` executable-discovery plan and non-QL prototype foundation.