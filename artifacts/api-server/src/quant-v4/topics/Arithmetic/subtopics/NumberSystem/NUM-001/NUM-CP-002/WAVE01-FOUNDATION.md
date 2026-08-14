# NUM-CP-002 — Wave 01 Executable Foundation

**Checkpoint:** Fractions, Decimals and Recurring Representations  
**Status:** executable discovery proof; source saturation **not** claimed  
**Permanent QLs:** 0  
**Question Studio:** OFF  
**Question Bank / tests / public:** OFF

## Authority used

Wave 01 consumes the current `NUM-001` complete checkpoint design plus the existing human-owned Quant V3 `NS-FRACDEC-001` authority as discovery evidence.

The legacy topology map is not copied as a permanent-Ql map. It is dispositioned by the new CP boundary:

- keep fraction reduction/equivalent forms;
- keep improper/mixed conversion;
- keep exact compare/order;
- keep fraction ↔ decimal representation conversion;
- keep recurring-decimal reconstruction;
- keep terminating/recurring structure;
- reassign long fraction/decimal expression evaluation to Simplification;
- reassign HCF/LCM of fractions as final target to NUM-CP-006.

## Wave 01 temporary executable prototypes

1. reducible fraction → lowest terms;
2. improper fraction → mixed fraction;
3. mixed fraction → improper fraction;
4. terminating decimal → reduced fraction;
5. pure recurring decimal → reduced fraction;
6. mixed recurring decimal → reduced fraction;
7. fraction → exact terminating decimal;
8. fraction → exact recurring decimal;
9. exact comparison of two fractions;
10. ordering mixed fraction/terminating/recurring representations;
11. terminating versus recurring after reduction;
12. exact number of terminating decimal places.

All 12 remain temporary `NUM-CP002-PROT-*` discovery identities. `permanentQlId` is null.

## Mathematical rules

- rational answers are reduced exactly;
- comparison uses integer cross-products, never rounded decimals;
- termination checks occur only after fraction reduction;
- reduced denominator must contain only prime factors 2 and 5 to terminate;
- exact terminating places equal the larger exponent of 2 or 5 in the reduced denominator;
- recurring reconstruction uses exact shift/subtract algebra;
- recurring output comes from an exact bounded remainder cycle;
- `0.\overline{9}=1` is an explicit edge-state proof.

## Learner-surface rules from CP001 review

Wave 01 adopts the editorial lessons already approved for CP001:

- concise **Concept → Solution → Answer** only;
- no automatic strategy/speed/trap clutter;
- formulas and rational/recurring notation use Examtree LaTeX wrappers;
- no floating-point authority for correct answers;
- options must be unique and misconception-owned;
- no internal prototype/solver terminology in learner prose.

## Wave 02 discovery queue

Wave 02 must target the missing inverse and structure-heavy families before any merge/split proposal:

- least multiplier for termination;
- least divisor for termination;
- missing denominator factor;
- recover denominator structure from decimal-place count;
- bounded denominator set/count producing terminating decimals;
- unknown numerator/denominator from exact representation evidence;
- recurring-block digit recovery;
- bounded repeat-block length;
- equivalent recurring notation and repeating-nines variants;
- claim verification only after direct/inverse authorities exist;
- data sufficiency only after ordinary inverse proof.

No source-saturation, permanent allocation, localization, Question Studio registration or downstream release is authorized by Wave 01.
