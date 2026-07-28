# INT-001 / CP-001 — Gap Wave 02 Classification and Coverage Audit

Status: **first executable classification complete; source closure and product-owner English approval pending**  
Authority: exact executable wave-02 evidence plus comparison with the proven foundation wave  
Permanent QLs allocated by this audit: **0**

---

## 1. Classification policy

A temporary prototype is not retained merely because it generates correct questions. It must introduce a materially distinct student task contract through at least one of:

- different given/unknown topology;
- different invariant or state reconstruction;
- different answer semantic that changes distractors and explanation obligations;
- different inverse admissibility proof;
- different exam-recognised representation whose convention materially changes the task.

A prototype is merged when its only difference is:

- month/day/annual display of the same exact time state;
- interest evidence versus amount evidence already represented by an existing semantic branch;
- requested answer unit that can be safely parameterised;
- context or wording;
- a shortcut that does not change the mathematical contract.

---

## 2. Wave-02 disposition ledger

| # | Temporary prototype | Disposition | Provisional owner | Reason |
|---:|---|---|---|---|
| 1 | `INT-CP001-W2-PROT-AMOUNT-FOR-MONTHS` | `MERGE_AS_TIME_REPRESENTATION` | Foundation direct-amount contract | Month duration changes normalisation, not the answer topology. |
| 2 | `INT-CP001-W2-PROT-AMOUNT-FOR-DAYS` | `MERGE_AS_TIME_REPRESENTATION` | Foundation direct-amount contract | A stated 365-day convention is a representation parameter with a mandatory convention field. |
| 3 | `INT-CP001-W2-PROT-PRINCIPAL-FROM-INTEREST-MONTHS` | `MERGE_AS_TIME_REPRESENTATION` | Foundation principal-from-interest inverse | Same inverse equation and principal-domain proof after exact month conversion. |
| 4 | `INT-CP001-W2-PROT-PRINCIPAL-FROM-AMOUNT-MONTHS` | `MERGE_AS_TIME_REPRESENTATION` | Foundation principal-from-amount inverse | Same amount-factor inverse with month representation. |
| 5 | `INT-CP001-W2-PROT-RATE-FROM-INTEREST-MONTHS` | `MERGE_AS_TIME_REPRESENTATION` | Foundation rate-from-interest inverse | Same rate inverse and admissibility domain after exact month conversion. |
| 6 | `INT-CP001-W2-PROT-RATE-FROM-AMOUNT-MONTHS` | `MERGE_AS_TIME_REPRESENTATION` | Foundation rate-from-amount inverse | Same amount-minus-principal rate inverse after exact month conversion. |
| 7 | `INT-CP001-W2-PROT-TIME-MONTHS-FROM-INTEREST` | `MERGE_AS_OUTPUT_UNIT_VARIANT` | Foundation time-from-interest inverse | The recovered duration state is the same; the answer renderer and distractor obligations require a month output parameter. |
| 8 | `INT-CP001-W2-PROT-TIME-MONTHS-FROM-AMOUNT` | `MERGE_AS_OUTPUT_UNIT_VARIANT` | Foundation time-from-amount inverse | Same inverse state with explicit month answer semantics. |
| 9 | `INT-CP001-W2-PROT-ANNUAL-INTEREST-FROM-TWO-AMOUNTS` | `PROVISIONALLY_RETAIN` | CP-001 two-time amount timeline | New two-observation linear-increment reconstruction. |
| 10 | `INT-CP001-W2-PROT-PRINCIPAL-FROM-TWO-AMOUNTS` | `PROVISIONALLY_RETAIN` | CP-001 two-time amount timeline | Requires first recovering annual increment and then removing earlier accumulated interest. |
| 11 | `INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNTS` | `PROVISIONALLY_RETAIN` | CP-001 two-time amount timeline | Requires annual increment plus principal reconstruction before rate recovery. |
| 12 | `INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNT-RATIO` | `PROVISIONALLY_RETAIN` | CP-001 two-time amount-ratio inverse | Principal cancels through a distinct ratio equation and bounded rate proof. |
| 13 | `INT-CP001-W2-PROT-AMOUNT-MULTIPLE-FROM-RATE-TIME` | `PROVISIONALLY_RETAIN` | CP-001 direct ratio semantics | The requested semantic is `A/P`, including the original principal once. |
| 14 | `INT-CP001-W2-PROT-INTEREST-RATIO-FROM-RATE-TIME` | `PROVISIONALLY_RETAIN` | CP-001 direct ratio semantics | The requested semantic is `I/P`; distractors and conclusion differ materially from `A/P`. |

---

## 3. Wave-02 totals

```text
PROVISIONALLY_RETAIN:          6
MERGE_AS_TIME_REPRESENTATION:  6
MERGE_AS_OUTPUT_UNIT_VARIANT:  2
REJECT:                        0
DEFER:                         0
Permanent QLs:                 0
```

The six retained prototypes are candidate task contracts, not approved QLs. The eight merged prototypes remain useful executable fixtures for proving parameterised representation behaviour.

---

## 4. Resolution of the foundation representation boundary

The first foundation audit left month and day forms open. Wave 02 now supplies exact executable evidence across:

- direct interest and amount;
- principal inverse;
- rate inverse;
- time inverse with month output;
- explicit 365-day convention;
- integral-money and distractor safety.

The resulting rule is:

```text
MONTH, DAY AND YEAR ARE REPRESENTATION PARAMETERS,
NOT AUTOMATICALLY SEPARATE QUESTION LANGUAGES.
```

A separate permanent QL is justified only when a source-backed convention changes the underlying contract—for example, a distinct commercial day-count convention, a broken-period compounding rule or another domain-owned exception. CP-001 simple-interest month/day display does not meet that threshold.

Required permanent runtime fields, if these contracts survive final freeze:

```text
timeValueExact
inputTimeUnit
outputTimeUnit
annualisationBasis
statedDayCountBasis
```

The day-count basis may never be silently assumed when days are displayed.

---

## 5. Two-time amount ownership decision

The two-time amount family is materially different from a single-state direct or inverse formula because it treats the amount as a line in time:

```text
A(t) = P + Jt
where J is annual simple interest
```

From two observations:

```text
J = (A₂ − A₁)/(t₂ − t₁)
P = A₁ − Jt₁
R = 100J/P
```

The annual-interest, principal and rate tasks are provisionally separate because they have different stopping points, answer semantics and misconception sets. They may share one solve engine and state model without collapsing into one student-facing task contract.

The amount-ratio inverse is retained separately because it uses:

```text
k = A₂/A₁ = (1 + rt₂)/(1 + rt₁)
r = (k − 1)/(t₂ − kt₁)
```

This is not merely a numeric restatement of the amount-difference path. It cancels principal and introduces ratio-specific translation and traps.

---

## 6. Direct ratio ownership decision

`A/P` and `I/P` share the same rate-time factor but cannot be silently merged at the presentation layer:

```text
I/P = rt
A/P = 1 + rt
```

They are provisionally retained as semantic siblings because:

- one answer includes the original principal and one does not;
- the most important distractor in each is the other semantic;
- the conclusion wording differs;
- amount-multiple and interest-ratio inverse families already depend on this distinction;
- source questions frequently use “becomes x times” and “interest equals a fraction of the sum” as different prompts.

They may ultimately share one parameterised ratio solve mode while retaining separate QL-level answer semantics. That merge/split decision belongs to the final CP registry audit, not this wave.

---

## 7. Combined CP-001 discovery inventory

Across the foundation and wave 02:

```text
Temporary prototypes executed:  30
Permanent QLs:                   0
```

First-pass combined disposition after resolving wave-02 representation evidence:

```text
Foundation provisionally retained:                 13
Foundation annual-interest merge candidate:         1
Foundation month/day boundary now representation:   2
Wave-02 provisionally retained:                     6
Wave-02 time-representation merges:                 6
Wave-02 output-unit merges:                         2
```

These numbers count temporary prototypes and decisions, not future QLs. Several retained prototypes may still merge after source comparison; one prototype may still split if materially different source contracts are recovered.

---

## 8. Coverage now demonstrated

### Direct and semantic coverage

- simple interest from principal, rate and time;
- amount from principal, rate and time;
- interest versus amount distinction;
- annual interest;
- interest for a proportional subduration;
- amount-to-principal multiple;
- interest-to-principal ratio.

### Inverse coverage

- principal from interest evidence;
- principal from amount evidence;
- rate from interest evidence;
- rate from amount evidence;
- time from interest evidence;
- time from amount evidence;
- rate/time from amount multiple;
- rate/time from interest ratio;
- rate from two-time amount ratio.

### Representation coverage

- years;
- mixed year-month durations;
- input months;
- output months;
- stated 365-day basis;
- integral rupee displays;
- exact terminating and rational factors;
- integer amount ratios.

### Two-observation coverage

- annual increment from two amounts;
- principal from two amounts;
- rate from two amounts;
- rate from the ratio of two amounts.

---

## 9. Remaining CP-001 discovery questions

The following must be closed before permanent QL allocation:

1. **Amount transfer across time:** given an amount at one time plus rate evidence, recover the amount at another time without directly displaying principal.
2. **Two-time ratio time inverse:** given rate, one time and the ratio of two amounts, recover the other time where source-backed and uniquely bounded.
3. **Source frequency:** determine whether two-time amount difference, two-time amount ratio and direct ratio answers occur often enough in SSC, banking and Punjab-state exams to remain student-facing contracts.
4. **Legacy fixture recovery:** recover representative executable fixtures for legacy families 9, 10, 58, 59, 62 and 63 and compare them with the current candidates.
5. **Boundary with CP-002:** move counterfactual rate/time changes, multiple sums and piecewise simple-interest ledgers out of CP-001 unless the final ownership audit shows otherwise.
6. **Answer-format policy:** decide whether ratio answers may use fraction, decimal or integer-ratio form by source convention; no approximate rendering may become correctness authority.
7. **Difficulty evidence:** replace provisional topology labels with empirical instance-level evidence after source-backed fixture review.
8. **Human English approval:** approve stems, options and explanations before assigning any permanent registry IDs.

---

## 10. Next executable milestone

The next work should not create permanent QLs. It should implement a small final CP-001 closure wave containing only source- or gap-justified contracts:

```text
amount-at-t1 → amount-at-t2 reconstruction
other-time from two-amount ratio and known rate/time
legacy temporal-amount fixture recovery
source-backed retain/merge evidence export
```

After that wave:

1. perform a full CP-001 source, inverse, representation and edge audit;
2. compare every surviving contract pair for merge/split;
3. freeze the CP only if no meaningful task or inverse gap remains;
4. propose permanent QL IDs and solve modes without using temporary prototype counts as quotas.
