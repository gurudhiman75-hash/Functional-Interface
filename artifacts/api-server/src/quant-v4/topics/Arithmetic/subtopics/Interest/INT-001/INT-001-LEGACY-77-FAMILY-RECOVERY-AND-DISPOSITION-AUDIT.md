# INT-001 — Legacy 77-Family Recovery and Disposition Audit

Status: **complete first-pass legacy accounting; executable fixture inspection remains open**  
Legacy registry inspected: `quant-v2/canonical/interest-types.ts` and `interest-motif-factories.ts`  
Legacy family IDs accounted for: **77 of 77**  
Permanent Quant V4 QLs created by this audit: **0**

This document prevents two equally unsafe outcomes:

1. ignoring a substantial body of existing Interest work; or
2. copying the legacy motif-factory system into Quant V4 and treating its family count as a new QL plan.

The 77 legacy IDs are prior art and source leads. They are not permanent Question Languages, CP allocations or implementation authority.

---

## 1. Legacy architecture findings

The existing repository contains useful prior work across:

- direct and inverse simple interest;
- annual and sub-annual compound interest;
- SI–CI difference identities;
- growth and depreciation;
- instalments and repayments;
- split-investment systems;
- nominal/effective rates;
- true discount and banker’s discount;
- multilingual contexts and misconception labels;
- generated review corpora and large-audit tooling.

However, the current Quant V2 implementation is not suitable as the Quant V4 runtime authority because it relies on several patterns that the new chapter explicitly forbids:

- JavaScript `number` arithmetic for money, rates and powers;
- routine rounding through `toFixed(2)`;
- tolerance-based agreement (`closeEnough`) rather than exact equality;
- floating roots and powers for inverse rate questions;
- several “independent” branches that return a precomputed variable such as `diff`, `finalValue`, `installment` or `nthInterest`;
- a default verifier branch that returns the stored canonical answer;
- explanation validation by extracting the last visible number;
- narrow hard-coded principal/rate/year pools;
- legacy family IDs representing traps or contexts rather than materially distinct task contracts;
- banker’s-discount and true-discount families mixed into the same chapter without a fresh ownership decision.

Quant V4 must recover the good ideas while replacing these proof weaknesses with exact state construction, exact arithmetic and materially separate verification.

---

## 2. Recovery policy

### Recover

The new chapter may recover:

- representative source fixtures;
- task directions and inverse forms;
- useful context domains;
- misconception labels;
- explanation ideas;
- review/export structures;
- corpus and diversity audit ideas;
- previous-year-style evidence.

### Do not inherit

The new chapter must not inherit:

- the number 77 as a target QL count;
- legacy family identities as permanent QL identities;
- floating-point answer authority;
- tolerance-based validation;
- generic factory prose;
- trap-only families as student-facing QLs;
- legacy difficulty labels without instance evidence;
- banker’s/true-discount ownership without a dedicated design;
- any family merely because code already exists.

### Required treatment for every legacy family

Every family below receives exactly one first-pass disposition. During executable discovery it may be refined, but it may not disappear from the ledger.

---

## 3. Exact 77-family disposition ledger

| # | Legacy family | Provisional owner | First-pass disposition | Quant V4 treatment |
|---:|---|---|---|---|
| 1 | `int_si_from_prt` | CP-001 | `RECOVER_AS_PROTOTYPE` | Direct SI; exact rational rewrite. |
| 2 | `int_si_amount_from_prt` | CP-001 | `RECOVER_AS_PROTOTYPE` | Direct amount; retain distinct answer-semantic audit. |
| 3 | `int_si_principal_from_si_rt` | CP-001 | `RECOVER_AS_PROTOTYPE` | Principal inverse from interest. |
| 4 | `int_si_rate_from_si_pt` | CP-001 | `RECOVER_AS_PROTOTYPE` | Rate inverse; bounded exact rate domain. |
| 5 | `int_si_time_from_si_pr` | CP-001 | `RECOVER_AS_PROTOTYPE` | Time inverse; exact unit normalisation. |
| 6 | `int_si_difference_two_cases` | CP-002 | `RECOVER_AS_PROTOTYPE` | Two simple-interest states; comparison ledger. |
| 7 | `int_si_sum_doubles` | CP-001 | `MERGE_CANDIDATE` | Merge into generic SI amount-multiple contract. |
| 8 | `int_si_sum_triples` | CP-001 | `MERGE_CANDIDATE` | Merge into generic SI amount-multiple contract. |
| 9 | `int_si_amount_ratio_time_gap` | CP-001 | `RECOVER_AS_PROTOTYPE` | Same principal/rate; inverse from amount ratio and time gap. |
| 10 | `int_si_temporal_amount_gap` | CP-001 | `RECOVER_AS_PROTOTYPE` | Same SI line observed at two times; recover hidden state. |
| 11 | `int_ci_amount_annual` | CP-003 | `RECOVER_AS_PROTOTYPE` | Annual compound amount. |
| 12 | `int_ci_from_amount` | CP-003 | `RECOVER_AS_PROTOTYPE` | Compound interest rather than amount; semantic split to audit. |
| 13 | `int_ci_principal_from_amount` | CP-003 | `RECOVER_AS_PROTOTYPE` | Exact principal inverse. |
| 14 | `int_ci_rate_from_amount` | CP-003 | `RECOVER_AS_PROTOTYPE` | Replace floating roots with exact factor or bounded search. |
| 15 | `int_ci_time_from_amount` | CP-003 | `RECOVER_AS_PROTOTYPE` | Replace floating logs with exact factor or bounded search. |
| 16 | `int_ci_two_year_formula` | CP-003 | `MERGE_CANDIDATE` | Duration-specific shortcut, not automatically a QL. |
| 17 | `int_ci_three_year_formula` | CP-003 | `MERGE_CANDIDATE` | Duration-specific shortcut, not automatically a QL. |
| 18 | `int_ci_sum_doubles` | CP-003 | `MERGE_CANDIDATE` | Merge into generic compound amount-multiple contract. |
| 19 | `int_ci_amount_multiplier_gap` | CP-003 | `RECOVER_AS_PROTOTYPE` | Recover rate/time from two amount observations. |
| 20 | `int_ci_si_difference_2_years` | CP-006 | `RECOVER_AS_PROTOTYPE` | Two-year SI–CI delta. |
| 21 | `int_ci_si_difference_3_years` | CP-006 | `RECOVER_AS_PROTOTYPE` | Three-year SI–CI delta; merge/split audit required. |
| 22 | `int_rate_from_ci_si_diff_2y` | CP-006 | `RECOVER_AS_PROTOTYPE` | Rate inverse from exact delta. |
| 23 | `int_principal_from_ci_si_diff_2y` | CP-006 | `RECOVER_AS_PROTOTYPE` | Principal inverse from exact delta. |
| 24 | `int_hybrid_si_ci_crossover` | CP-010 | `DEFER_TO_MIXED_DISCOVERY` | Admit only after component authorities mature. |
| 25 | `int_si_ci_amount_difference` | CP-006 | `RECOVER_AS_PROTOTYPE` | Direct method comparison at a common date. |
| 26 | `int_ci_half_yearly` | CP-004 | `MERGE_CANDIDATE` | Frequency is a parameter unless topology differs. |
| 27 | `int_ci_quarterly` | CP-004 | `MERGE_CANDIDATE` | Frequency is a parameter unless topology differs. |
| 28 | `int_ci_monthly` | CP-004 | `MERGE_CANDIDATE` | Frequency is a parameter unless topology differs. |
| 29 | `int_ci_annual_vs_half_yearly` | CP-004 | `RECOVER_AS_PROTOTYPE` | Compounding-frequency comparison. |
| 30 | `int_ci_fractional_time_boundary` | CP-004 | `RECOVER_WITH_CONVENTION_AUDIT` | Broken-period rule must be explicit. |
| 31 | `int_ci_specific_year_isolation` | CP-003 | `MERGE_CANDIDATE` | Merge into generic specified/nth-period interest. |
| 32 | `int_ci_nth_year_interest_from_principal` | CP-003 | `RECOVER_AS_PROTOTYPE` | Generic nth-period interest. |
| 33 | `int_population_growth_ci` | CP-005 | `RECOVER_AS_CONTEXT_VARIANT` | Periodic growth engine; context is not a QL. |
| 34 | `int_depreciation_ci` | CP-005 | `RECOVER_AS_PROTOTYPE` | Periodic decay inverse/forward. |
| 35 | `int_price_appreciation` | CP-005 | `RECOVER_AS_CONTEXT_VARIANT` | Growth context; merge by topology. |
| 36 | `int_machine_car_depreciation` | CP-005 | `RECOVER_AS_CONTEXT_VARIANT` | Depreciation context; merge by topology. |
| 37 | `int_successive_growth` | CP-005 | `RECOVER_AS_PROTOTYPE` | General variable/constant growth factors. |
| 38 | `int_successive_reduction` | CP-005 | `RECOVER_AS_PROTOTYPE` | General decay factors. |
| 39 | `int_equal_annual_installments_ci` | CP-008 | `MERGE_CANDIDATE` | Equal-instalment topology with frequency parameter. |
| 40 | `int_equal_half_yearly_installments_ci` | CP-008 | `MERGE_CANDIDATE` | Equal-instalment topology with frequency parameter. |
| 41 | `int_loan_repayment_si` | CP-008 | `RECOVER_AS_PROTOTYPE` | Explicit simple-interest repayment event order. |
| 42 | `int_loan_repayment_ci` | CP-008 | `RECOVER_AS_PROTOTYPE` | Compound reducing-balance repayment. |
| 43 | `int_find_installment_amount` | CP-008 | `RECOVER_AS_PROTOTYPE` | Unknown equal payment. |
| 44 | `int_find_principal_from_installments` | CP-008 | `RECOVER_AS_PROTOTYPE` | Opening-balance inverse. |
| 45 | `int_si_partial_discharge_timeline` | CP-002 | `RECOVER_AS_PROTOTYPE` | Simple-interest principal-reduction timeline. |
| 46 | `int_different_rates_different_years_si` | CP-002 | `RECOVER_AS_PROTOTYPE` | Piecewise simple-rate ledger. |
| 47 | `int_different_rates_different_years_ci` | CP-005 | `RECOVER_AS_PROTOTYPE` | Variable compound-rate ledger. |
| 48 | `int_part_principal_two_rates_si` | CP-002 | `RECOVER_AS_PROTOTYPE` | Split principal under two simple rates. |
| 49 | `int_si_alligation_mixture` | CP-002 | `RENAME_AND_RECLASSIFY` | Linear split equation; do not preserve alligation identity. |
| 50 | `int_two_sums_same_interest` | CP-002 | `RECOVER_AS_PROTOTYPE` | Equal-interest allocation. |
| 51 | `int_weighted_average_rate` | CP-002 | `BOUNDARY_PROTOTYPE` | Audit against Average; retain only when SI ledger is decisive. |
| 52 | `int_true_discount` | Deferred | `DEFER_TO_DISCOUNT_CHAPTER` | Commercial-mathematics domain needs separate authority. |
| 53 | `int_present_worth` | Deferred | `DEFER_TO_DISCOUNT_CHAPTER` | Legacy simple-discount semantics; not generic CP-009 present value. |
| 54 | `int_bankers_discount` | Deferred | `DEFER_TO_DISCOUNT_CHAPTER` | Dedicated banker’s-discount ownership. |
| 55 | `int_bankers_gain` | Deferred | `DEFER_TO_DISCOUNT_CHAPTER` | Dedicated banker’s-discount ownership. |
| 56 | `int_bd_td_difference` | Deferred | `DEFER_TO_DISCOUNT_CHAPTER` | Dedicated banker’s/true-discount ownership. |
| 57 | `int_bill_due_after_time` | Deferred | `DEFER_TO_DISCOUNT_CHAPTER` | Bill-discount convention domain. |
| 58 | `int_amount_ratio_find_rate_si` | CP-001 | `MERGE_CANDIDATE` | Generic SI amount-multiple/ratio inverse. |
| 59 | `int_amount_ratio_find_time_si` | CP-001 | `MERGE_CANDIDATE` | Generic SI amount-multiple/ratio inverse. |
| 60 | `int_amount_ratio_find_rate_ci` | CP-003 | `MERGE_CANDIDATE` | Generic compound factor inverse. |
| 61 | `int_amount_ratio_find_time_ci` | CP-003 | `MERGE_CANDIDATE` | Generic compound factor inverse. |
| 62 | `int_interest_more_by_rate_change` | CP-002 | `RECOVER_AS_PROTOTYPE` | Counterfactual SI rate comparison. |
| 63 | `int_interest_more_by_time_change` | CP-002 | `RECOVER_AS_PROTOTYPE` | Counterfactual SI duration comparison. |
| 64 | `int_si_calculated_on_amount_trap` | Cross-cutting | `RECOVER_AS_DISTRACTOR_ONLY` | Misconception, not a QL. |
| 65 | `int_ci_simple_addition_trap` | Cross-cutting | `RECOVER_AS_DISTRACTOR_ONLY` | Misconception, not a QL. |
| 66 | `int_wrong_period_conversion_trap` | Cross-cutting | `RECOVER_AS_DISTRACTOR_ONLY` | Misconception, not a QL. |
| 67 | `int_nominal_vs_effective_rate` | CP-004 | `RECOVER_AS_PROTOTYPE` | Effective annual rate and nominal-period distinction. |
| 68 | `int_interest_included_excluded_amount` | Cross-cutting | `MERGE_AS_ANSWER_SEMANTIC_AUDIT` | Interest-versus-amount distinction across CPs. |
| 69 | `int_compound_depreciation_repair_sale` | Boundary | `SPLIT_OR_REASSIGN` | Depreciation to CP-005; repair/sale commercial tail may belong to PNL. |
| 70 | `int_partial_payment_before_final_amount` | CP-009 | `BOUNDARY_PROTOTYPE` | Inspect method and event order; heterogeneous cash-flow candidate. |
| 71 | `int_two_people_invest_same_rate` | CP-002 | `RECOVER_AS_PROTOTYPE` | Multiple principal-time contributions. |
| 72 | `int_same_interest_different_sums_rates_times` | CP-002 | `RECOVER_AS_PROTOTYPE` | Equal-interest relation across states. |
| 73 | `int_divide_total_interest_between_investments` | CP-002 | `RECOVER_AS_PROTOTYPE` | Split/allocation under SI ledger. |
| 74 | `int_investment_ratio_from_interest` | CP-002 | `RECOVER_AS_PROTOTYPE` | Recover principal ratio from interest evidence. |
| 75 | `int_weighted_interest_income` | CP-002 | `RECOVER_AS_PROTOTYPE` | Sum of principal-rate-time contributions. |
| 76 | `int_ci_specific_year_rate_principal` | CP-003 | `RECOVER_AS_PROTOTYPE` | Inverse from specified-period compound interest. |
| 77 | `int_si_ci_mixed_condition_inverse` | CP-010 | `DEFER_TO_MIXED_DISCOVERY` | Admit only with exact source-backed composed authority. |

---

## 4. Disposition totals

```text
RECOVER_AS_PROTOTYPE:                 42
MERGE_CANDIDATE:                      15
DEFER_TO_DISCOUNT_CHAPTER:             6
RECOVER_AS_CONTEXT_VARIANT:            3
RECOVER_AS_DISTRACTOR_ONLY:             3
DEFER_TO_MIXED_DISCOVERY:               2
BOUNDARY_PROTOTYPE:                     2
RECOVER_WITH_CONVENTION_AUDIT:          1
RENAME_AND_RECLASSIFY:                  1
MERGE_AS_ANSWER_SEMANTIC_AUDIT:         1
SPLIT_OR_REASSIGN:                      1
                                      ---
TOTAL:                                 77
```

These totals are dispositions of legacy IDs, not forecast QL counts. A single legacy ID may produce no permanent QL; several IDs may merge into one QL; one ID may reveal multiple materially distinct contracts after fixture inspection.

---

## 5. High-risk legacy clusters

### 5.1 Floating inverse cluster

The old rate/time inverse families use roots or stored values. Quant V4 must construct exact factors first and verify by bounded enumeration:

- `int_ci_rate_from_amount`;
- `int_ci_time_from_amount`;
- `int_ci_amount_multiplier_gap`;
- `int_amount_ratio_find_rate_ci`;
- `int_amount_ratio_find_time_ci`.

### 5.2 Trap-as-family cluster

The following are misconceptions, not task contracts:

- `int_si_calculated_on_amount_trap`;
- `int_ci_simple_addition_trap`;
- `int_wrong_period_conversion_trap`.

They move into the distractor library and may be attached to several QLs.

### 5.3 Context-as-family cluster

Population, price appreciation, machine/car depreciation and generic growth/decay must be consolidated by mathematical topology. Context-specific language may remain human-authored without multiplying QLs.

### 5.4 Discount cluster

True discount, banker’s discount, banker’s gain, bill due and their differences form a coherent commercial-mathematics domain. They are excluded from INT-001 until a separate end-to-end ownership design decides whether to create a dedicated chapter.

### 5.5 Commercial boundary cluster

`int_compound_depreciation_repair_sale` mixes periodic value decay with repair expense and sale outcome. The state must be split: depreciation may belong to INT-CP-005, while cost/sale/profit reasoning may belong to PNL.

---

## 6. Fixture-recovery workflow

For every row marked as a prototype, merge candidate, boundary or convention audit:

1. recover at least one representative generated legacy fixture;
2. recover any associated source/PYQ evidence;
3. identify the real given/unknown contract;
4. replace floating state with exact rational construction;
5. write a materially separate verifier;
6. compare it with neighbouring candidate contracts;
7. classify it as retain, merge, split, defer, reassign or reject;
8. record the final decision in the CP coverage ledger.

A family cannot be retained merely because its old generator produces valid-looking questions.

---

## 7. Quant V4 authority decision

The new authority order is:

```text
current source and ownership audits
→ exact executable discovery
→ CP-level merge/split and gap audit
→ permanent QL registry after English review
→ localisation and integration
```

The legacy registry remains a reference source only. It cannot allocate permanent IDs, set counts, define difficulty quotas or establish publication readiness.
