# INT-001 — Source and Ownership Audit

Status: **open discovery ledger**  
Permanent QLs: **0**  
Frozen CPs: **0**

This ledger records why Simple & Compound Interest deserves its own Quant V4 chapter, what source patterns must be recovered, and where ownership stops. It is not a QL catalogue and must not be converted into a fixed-count plan.

---

## 1. Source groups reviewed

The uploaded quantitative-aptitude collection contains overlapping but materially useful source groups:

1. SSC-oriented mathematics guides with direct and inverse interest questions;
2. Banking-oriented aptitude notes with scheme comparisons and SI/CI relations;
3. broader quantitative-aptitude references with instalments, repayment ledgers and exam-smart methods;
4. mixed previous-year-style collections containing growth, depreciation and equal-value allocation;
5. existing ExamTree Percentage, Ratio, Profit & Loss, Average, Mixture, Time & Work and Mensuration designs, which define neighbouring ownership.

The source corpus confirms that an exhaustive interest chapter cannot stop at the four variables `P`, `R`, `T` and `I`. It must discover tasks across period conversion, compounding frequency, variable rates, SI/CI differences, growth/decay, scheme equivalence and cash-flow timing.

---

## 2. Source-pattern recovery matrix

### 2.1 Simple-interest core

Observed source structures:

- interest from principal, rate and time;
- amount from principal and interest;
- principal from interest or amount;
- rate from interest/amount evidence;
- duration from interest/amount evidence;
- mixed years and months;
- actual-day intervals with stated annual basis;
- annual interest from total interest;
- interest as a fraction or multiple of principal;
- doubling/tripling/general amount multiple;
- equal interest under different principal-rate-time states.

Required discovery axes:

```text
unknown = I | A | P | r | t
rate unit = annual | half-yearly | monthly | explicit
period form = integer years | months | days | mixed duration
answer form = money | rate | duration | multiple | relation
```

### 2.2 Multiple simple-interest contributions

Observed source structures:

- several deposits with different durations;
- one total divided between two rates;
- same sum lent at two rates;
- total interest used to recover a common rate;
- rate difference inferred from interest difference;
- borrowing at one rate and lending at another;
- principal reduction or repayment under an explicit simple convention.

Required discovery axes:

```text
principal topology = one | two | many
rate topology = common | distinct | piecewise
period topology = common | distinct | calendar
unknown = component principal | common rate | duration | total interest | gain
```

### 2.3 Annual compound-interest core

Observed source structures:

- amount and CI for complete years;
- principal from amount or CI;
- rate from exact growth factor;
- duration from exact amount multiple;
- double/eight-times relations;
- previous or next year's amount;
- first-year and later-year interest;
- amount ratios across durations.

Required discovery axes:

```text
unknown = A | CI | P | r | n | prior balance | period interest
state evidence = direct values | amount factor | consecutive balances | interest relation
inverse method = exact factor | bounded rate search | bounded year search
```

### 2.4 Compounding-frequency patterns

Observed source structures:

- annual, half-yearly, quarterly and monthly compounding;
- nominal rate converted to periodic rate;
- 18 months and 9 months;
- difference between annual and half-yearly amount;
- effective annual rate;
- mixed frequency across years;
- full conversion periods plus a broken remainder.

Required discovery axes:

```text
frequency = annual | 2 | 4 | 12 | explicit
rate evidence = nominal annual | periodic
remainder = none | complete smaller periods | explicit simple tail
unknown = amount | CI | principal | rate | periods | excess | effective rate
```

### 2.5 Variable rates and periodic growth/decay

Observed source structures:

- different rates in successive years;
- salary increments;
- population growth;
- asset depreciation;
- growth followed by decline;
- original value from current value;
- missing rate from final value;
- threshold-crossing year;
- growth and migration/withdrawal with explicit order.

Required discovery axes:

```text
factor sign = growth | decay
rate sequence = constant | piecewise | alternating | explicit list
unknown = final | original | one rate | duration | threshold period
context = money | population | salary | asset | generic capacity
```

### 2.6 SI/CI relation patterns

Observed source structures:

- two-year SI/CI difference;
- three-year SI/CI difference;
- principal from difference and rate;
- rate from SI and CI;
- three-year difference from two-year evidence;
- ratio of differences;
- consecutive yearly compound interests;
- annual versus half-yearly difference.

Required discovery axes:

```text
duration = 2 | 3 | bounded k
known = SI | CI | difference | ratio | yearly interest
unknown = P | r | another difference | yearly interest | amount
frequency = annual | compared frequencies
```

### 2.7 Scheme comparison and equal-value allocation

Observed source structures:

- equal principal in two schemes;
- equal maturity amount under different methods/rates;
- simple borrowing and compound lending;
- effective return comparison;
- division of a present sum for equal future amounts;
- inheritance shares maturing at different ages;
- equal amount at different dates.

Required discovery axes:

```text
comparison date = present | future common date
methods = SI/SI | CI/CI | SI/CI
unknown = better scheme | difference | rate | allocation | component principal
```

### 2.8 Instalments and dated cash flows

Observed source structures:

- equal annual instalments;
- equal half-yearly instalments;
- loan cleared after two or three payments;
- end-of-year recurring deposits;
- deposits on different dates;
- down payment plus instalments;
- unequal repayments;
- missing payment or original debt;
- outstanding balance after a payment.

Required discovery axes:

```text
cash-flow count = 1 | equal series | heterogeneous series
cash-flow timing = beginning | end | explicit date
unknown = instalment | principal | rate | balance | missing flow
comparison route = recurrence | common-date equivalence
```

---

## 3. Cross-chapter ownership decisions

### Percentage

Percentage owns:

- one-off percentage increase/decrease;
- generic successive percentage change when no time-value or historical/future-value reasoning is central;
- pure percentage reverse calculations.

INT owns:

- periodic accumulation over time;
- principal/amount semantics;
- compounding frequency;
- original/future value under repeated growth or decay;
- rate/time inverse based on periodic factors.

### Ratio & Proportion

Ratio owns pure proportional reconstruction. INT owns amount/principal, interest/principal and scheme ratios when the interest law or period structure is decisive.

### Profit & Loss

PNL owns commercial cost/selling/markup/discount/profit structures, including interest treated merely as an expense inside an effective-cost calculation.

INT owns borrowing/lending accumulation when the asked result is interest, amount, rate, duration, balance or scheme gain caused by the interest method.

### Partnership

Partnership owns profit sharing by capital and time. INT must not treat partnership contribution-time products as interest.

### Average

Average owns weighted mean. INT owns effective rate only when derived from compounding factors or exact return equivalence, not as a plain weighted average of rates.

### Mixture & Alligation

MAL owns physical/component blending. Combining investments or rates is not alligation unless the source question genuinely asks a linear weighted simple-interest rate and the ownership audit assigns it to INT-CP-002.

### Time & Work

TMW owns work-rate-time. INT may share linear algebraic shape but not workers, efficiency or completion semantics.

### Sequence & Series

A future sequence chapter owns abstract AP/GP questions. INT owns finite geometric balances and instalments when the learner must reason about interest or timed cash flows.

### Banker's discount / true discount

Current decision: excluded from INT-001 pending a dedicated source and ownership study. Do not silently admit these modes through “present value” wording.

---

## 4. Conventions requiring explicit metadata

The following must never be inferred from vague wording:

- simple versus compound method;
- annual nominal rate versus periodic rate;
- compounding frequency;
- whether interest is added before or after a payment;
- beginning versus end-of-period instalment;
- treatment of a broken year;
- actual-day denominator;
- rounding point and number of decimal places;
- whether a stated return is interest or total amount;
- whether growth/decline occurs before or after migration, withdrawal or payment.

A candidate with an unstated decisive convention is invalid, even when a textbook answer assumes one.

---

## 5. Open ownership questions for executable discovery

1. Should multiple-sum simple interest remain in CP-002 or split into a separate allocation CP?
2. Should calendar-day SI be a representation within CP-001/002 or a distinct contract due to day-count evidence?
3. Should population/salary/depreciation remain one CP-005 engine with adapted language or split by growth versus decay?
4. Where is the clean boundary between CP-007 equal-future-value allocation and CP-009 dated cash flows?
5. Should recurring deposits live in CP-008 equal series or CP-009 dated heterogeneous flows?
6. Are broken annual periods materially distinct from complete half-yearly/quarterly periods inside CP-004?
7. Which SI/CI difference identities are true QLs rather than shortcuts for a more general direct comparison QL?
8. Which inverse rate/time questions remain exam-realistic without numerical roots?
9. Which mixed systems deserve CP-010 and which are artificial combinations to reject?
10. Is a dedicated true-discount/banker's-discount chapter required later?

These questions must be answered with executable prototypes and source evidence, not intuition alone.

---

## 6. Source-saturation checklist

Before chapter freeze, the coverage ledger must demonstrate inspection of:

- direct formulas;
- every missing-variable direction;
- principal/interest/amount distinctions;
- rate and time unit conversions;
- months and days;
- multiple principal-time contributions;
- variable simple rates;
- annual CI;
- frequency changes;
- broken periods;
- variable compound rates;
- growth and decay;
- amount multiples;
- SI/CI differences for two and three years;
- successive-year interest;
- effective annual rate;
- scheme comparison;
- equal future value;
- equal instalments;
- unequal dated cash flows;
- forward and reverse cash-flow questions;
- impossible or insufficient evidence patterns;
- table, timeline, numeric and data-sufficiency representations;
- English, Hindi and Punjabi language risks.

A checked box means a documented disposition exists: retain, merge, split, defer, reassign or reject.

---

## 7. Freeze prohibition

Do not publish a fixed QL total, solve-mode total or difficulty distribution from this source audit.

The source inventory is a discovery surface. Permanent counts may be reported only after:

- prototypes exist;
- equivalence collisions are measured;
- inverse and edge gaps are audited;
- ownership questions are resolved;
- manual English review is complete;
- no meaningful source-backed contract remains unclassified.
