# INT-CP-001 — Prototype Disposition and Gap Audit 01

Status: **first executable-discovery classification; not a QL freeze**  
Prototype wave: **16 temporary contracts**  
Permanent QLs: **0**  
Evidence head: `65dc52d0727c262c83a7578c959fcc90fa8f4897`

This audit classifies the first executable wave after exact proof and internal English review. A provisional retain decision means “mathematically and editorially distinct enough to remain under investigation.” It does not allocate a QL ID.

---

## 1. Disposition criteria

A prototype is provisionally retained when it has a distinct combination of:

- displayed evidence;
- unknown variable;
- required transformation;
- answer semantic;
- misconception profile;
- explanation topology.

A prototype is marked as a representation boundary when the mathematics may belong to an existing contract but the displayed unit conversion could still justify separate ownership.

A merge means the narrower prototype is currently best treated as a presentation or parameter case of a more general contract. Merge decisions remain reversible until the source and edge audit closes.

---

## 2. Prototype-by-prototype disposition

| Prototype | First disposition | Rationale | Next evidence needed |
|---|---|---|---|
| `SI-FROM-PRT` | `PROVISIONALLY_RETAIN` | Direct interest has a different answer semantic and primary amount-versus-interest trap from direct amount. | Test broader duration representations. |
| `AMOUNT-FROM-PRT` | `PROVISIONALLY_RETAIN` | Requires interest calculation followed by adding principal exactly once. | Add month/day parameter variants before freeze. |
| `PRINCIPAL-FROM-INTEREST` | `PROVISIONALLY_RETAIN` | Direct inverse of `I = Prt`; the displayed value is interest. | Recover representative legacy fixture and PYQ-style wording. |
| `PRINCIPAL-FROM-AMOUNT` | `PROVISIONALLY_RETAIN` | Must recognise amount and use `P = A/(1+rt)`, creating a different misconception profile. | Audit equivalent solve routes using `A-P`. |
| `RATE-FROM-INTEREST` | `PROVISIONALLY_RETAIN` | Direct rate inverse from an interest value. | Add month-based time evidence. |
| `RATE-FROM-AMOUNT` | `PROVISIONALLY_RETAIN` | Must isolate interest from amount before solving rate. | Add mixed-duration and amount-gap comparisons. |
| `TIME-FROM-INTEREST` | `PROVISIONALLY_RETAIN` | Duration inverse from total interest versus yearly interest. | Recover month-answer and day-answer forms. |
| `TIME-FROM-AMOUNT` | `PROVISIONALLY_RETAIN` | Requires amount-to-interest separation before duration inversion. | Audit whether answer-unit variation is presentation only. |
| `INTEREST-FOR-MONTHS` | `OPEN_REPRESENTATION_BOUNDARY` | Same core formula as direct SI, but month conversion creates distinct evidence and distractors. | Compare source frequency and learner-error profile with year-form direct SI. |
| `INTEREST-FOR-DAYS` | `OPEN_REPRESENTATION_BOUNDARY` | Explicit day-count basis is additional evidence and cannot be guessed. | Test 365/366 conventions and actual-date ownership. |
| `ANNUAL-INTEREST-FROM-TOTAL` | `PROVISIONAL_MERGE` | It is the target-duration-equals-one-year case of general proportional subduration interest. | Confirm no source-specific answer semantic requires separation. |
| `INTEREST-FOR-SUBDURATION` | `PROVISIONALLY_RETAIN` | General time-proportional reconstruction from known interest and known duration. | Add target durations above and below one year. |
| `RATE-FROM-AMOUNT-MULTIPLE` | `PROVISIONALLY_RETAIN` | Must subtract the principal unit from the amount multiple before finding rate. | Compare with two-time amount-ratio inverse. |
| `TIME-FROM-AMOUNT-MULTIPLE` | `PROVISIONALLY_RETAIN` | Same amount-multiple translation but a distinct unknown and inverse domain. | Test mixed-year exact answers and source wording. |
| `TIME-FROM-INTEREST-MULTIPLE` | `PROVISIONALLY_RETAIN` | Interest ratio is already `I/P`; subtracting one would be wrong. | Audit consolidation with generic interest-ratio inverse. |
| `RATE-FROM-INTEREST-PRINCIPAL-RATIO` | `PROVISIONALLY_RETAIN` | Rate is reconstructed from `I/P = rt`; distinct from an amount multiple. | Recover fraction-of-principal and percentage-of-principal variants. |

### First-pass totals

```text
PROVISIONALLY_RETAIN:          13
PROVISIONAL_MERGE:              1
OPEN_REPRESENTATION_BOUNDARY:   2
Permanent QLs:                  0
```

No prototype was rejected, reassigned or split in this first wave. Those outcomes remain possible after the missing modes are executable.

---

## 3. Mathematical-equivalence findings

### 3.1 Interest versus amount is not presentation-only

Direct interest and direct amount share an intermediate calculation, but differ in:

- requested answer semantic;
- final operation;
- principal-inclusion misconception;
- conclusion and option domain.

They remain separate candidates.

### 3.2 Interest-evidence and amount-evidence inverses remain separate

For principal, rate and time, amount evidence adds a mandatory recognition step:

```text
I = A − P
```

or the direct amount multiplier:

```text
A = P(1 + rt)
```

The generated distractors and explanation topology confirm a meaningful distinction.

### 3.3 Annual interest is a special target duration

The annual-interest prototype currently adds no governing inference beyond:

```text
I_target = I_known × t_target/t_known
```

with `t_target = 1 year`. It is therefore marked for presentation merge into the general subduration contract unless source review finds a materially different exam task.

### 3.4 Amount multiple and interest ratio are not equivalent evidence

For amount multiple:

```text
A/P = 1 + rt
```

The learner must subtract one.

For interest ratio:

```text
I/P = rt
```

No subtraction is required. The opposite treatment is a genuine high-value misconception, so the two evidence structures remain distinct candidates.

---

## 4. Gaps discovered by the first executable wave

### GAP-001 — Direct amount with fractional duration

The amount prototype currently proves complete-year states. Month and day duration should be exercised as parameter variants before deciding whether unit-sensitive ownership belongs only to the direct-interest contract.

### GAP-002 — Inverses with non-year evidence

Principal, rate and time inverses need explicit month-based and bounded day-based fixtures. The task may remain one QL per unknown/evidence semantic, but representation coverage cannot be assumed.

### GAP-003 — Two-time amount difference

Legacy families indicate questions where the difference between amounts at two times reveals yearly interest, principal or rate. This topology is not covered by the first wave.

Candidate relation:

```text
A(t_2) − A(t_1) = Pr(t_2 − t_1)
```

### GAP-004 — Amount ratio at two times

Questions using two observed simple-interest amounts and a time gap may require a distinct two-equation inverse rather than the current single amount-multiple model.

### GAP-005 — Find the amount or interest multiple

The first wave reconstructs rate or time from a supplied multiple. It does not ask for `A/P` or `I/P` from rate and time. Source review must decide whether the ratio answer semantic is a distinct contract or merely a direct derived value.

### GAP-006 — Counterfactual rate/time change

“Had the rate been higher…” and “had the money remained longer…” belong provisionally to CP-002 because they compare two simple-interest states. They must not leak into CP-001 merely because one principal is used.

### GAP-007 — Day-count and calendar boundaries

The current day prototype uses an explicit 365-day basis. Still open:

- explicit 366-day year;
- actual dates;
- inclusive versus exclusive day counting;
- whether calendar-date arithmetic belongs in CP-001 or CP-002.

### GAP-008 — Answer-semantic-only arithmetic

Questions giving principal and interest directly and asking for amount require only `A=P+I`. They should not automatically become an Interest QL unless source evidence shows a meaningful competitive-exam contract beyond elementary addition.

### GAP-009 — Data-sufficiency and table wrappers

These remain cross-cutting representations and must be added only after the ordinary mathematical contracts freeze.

---

## 5. Relevant legacy-family recovery still required

The following legacy leads require representative fixture inspection before CP-001 freeze:

```text
int_si_from_prt
int_si_amount_from_prt
int_si_principal_from_si_rt
int_si_rate_from_si_pt
int_si_time_from_si_pr
int_si_sum_doubles
int_si_sum_triples
int_si_amount_ratio_time_gap
int_si_temporal_amount_gap
int_amount_ratio_find_rate_si
int_amount_ratio_find_time_si
int_interest_included_excluded_amount
```

The legacy family names are not QL identities. Fixture recovery must determine whether each row is retained, merged, reassigned or rejected under the exact Quant V4 model.

---

## 6. Next executable wave

The next CP-001 discovery wave should implement temporary prototypes for:

1. amount difference at two time points;
2. amount ratio at two time points;
3. direct amount with month/day duration;
4. rate and principal inverses with month evidence;
5. time answer expressed in months;
6. direct amount-multiple or interest-ratio answer, if source-backed.

Each new prototype must use the existing exact foundation, remain non-QL and non-public, and pass the same solver/verifier, option, explanation and review gates.

---

## 7. Current decision

`INT-CP-001` is **not saturated** and **not QL-frozen**.

The first foundation is strong enough to continue discovery, but permanent QL allocation would be premature while the two-time amount topologies and representation cross-products remain unproven.
