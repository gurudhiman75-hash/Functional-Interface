# NUM-CP-003 Wave 02 — Provisional Merge, Split and Ownership Disposition

**Status:** post-proof provisional classification  
**Permanent QLs:** 0  
**Authority frozen:** no

This record classifies the nine Wave 02 contracts after executable and hosted-artifact review. The decisions remain provisional until source saturation and cross-CP audits close.

| Temporary contract | Provisional decision | Reason |
|---|---|---|
| complete valid-digit set | `PROVISIONALLY_RETAIN_BY_ANSWER_SEMANTIC` | A set answer requires exact membership and has different distractors from a unique digit or count. |
| leading missing digit | `PROVISIONAL_MERGE_AS_DOMAIN_EDGE` | The solver is ordinary single-digit reconstruction; the leading position changes the admissible digit domain to 1–9. |
| two missing digits without sum | `PROVISIONALLY_RETAIN` | The visible evidence lacks the Wave 1 sum constraint and requires intersection over the full ordered-pair domain. |
| missing digit in an addition result | `PROVISIONAL_REPRESENTATION_OR_SPLIT` | Arithmetic reconstruction supplies independent evidence; source saturation must decide whether this is a digit-equation representation or a separate task authority. |
| least repunit length | `PROVISIONAL_REASSIGN_NUM_CP008` | Efficient reasoning is a modular remainder recurrence; the divisibility wording alone does not settle ownership. |
| power-expression divisibility | `PROVISIONAL_REASSIGN_NUM_CP008` | Modular exponentiation is the governing engine. Direct algebraic-factor forms may remain in CP-003 only when factorisation is the tested shortcut. |
| count multiples in range | `PROVISIONALLY_RETAIN` | Range-count answer, inclusive endpoint logic and floor-count misconceptions differ materially from direct divisibility. |
| count divisible by one but not another | `PROVISIONAL_SPLIT_OR_PARAMETERISE_RANGE_COUNT` | Adds LCM-overlap exclusion; later inclusion–exclusion discovery must determine whether it is one parameterised range-count authority or a separate solve contract. |
| greatest n-digit multiple | `PROVISIONAL_MERGE_WITH_BOUNDARY_OPTIMISATION` | Shares the nearest-multiple boundary engine with the least n-digit form while reversing direction and trap polarity. |

## Current classification totals

```text
PROVISIONALLY_RETAIN:                         2
PROVISIONALLY_RETAIN_BY_ANSWER_SEMANTIC:      1
PROVISIONAL_MERGE_AS_DOMAIN_EDGE:              1
PROVISIONAL_MERGE_WITH_BOUNDARY_OPTIMISATION:  1
PROVISIONAL_REPRESENTATION_OR_SPLIT:            1
PROVISIONAL_SPLIT_OR_PARAMETERISE_RANGE_COUNT:  1
PROVISIONAL_REASSIGN_NUM_CP008:                 2
TOTAL:                                          9
```

## Required follow-up evidence

Before any final disposition:

- compare set, count and unique-digit forms across uploaded source frequency and misconception structure;
- recover source examples with a leading unknown digit;
- audit addition, subtraction and multiplication result-digit forms together;
- implement broader range inclusion–exclusion tasks;
- compare repunit and power-expression states against NUM-CP-008 modular arithmetic prototypes;
- test whether least/greatest boundary optimisation can share one parameterised solver and explanation contract without obscuring pedagogy;
- confirm every reassigned fixture appears exactly once in the chapter-wide ledger.

No permanent identity follows from this provisional classification.
