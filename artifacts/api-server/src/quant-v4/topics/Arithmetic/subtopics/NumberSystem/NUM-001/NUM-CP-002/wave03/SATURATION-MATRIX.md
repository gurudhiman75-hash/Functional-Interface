# NUM-CP-002 — Design-to-Discovery Saturation Matrix

This matrix maps the current complete CP-002 solve-mode baseline to executable discovery or an explicit ownership/adapter disposition. It is evidence for the later saturation decision; it does not itself allocate permanent QLs.

| Design baseline | Executable/disposition | Current decision |
|---|---|---|
| `reduceFractionToLowestTerms` | P001 | Covered; foundation/adapter pressure |
| `convertImproperAndMixedFraction` | P002, P003 | Covered bidirectionally; merge pressure |
| `compareTwoFractionsByCrossMultiplication` | P009 | Covered |
| `orderMultipleFractions` | P010 | Covered |
| `compareFractionDecimalAndRecurringDecimal` | P010 | Covered mixed-representation ordering |
| `findLargestOrSmallestExactRational` | P024 | Covered as ordering adapter candidate |
| `findFractionBetweenTwoFractions` | P023 | Covered; distinct insertion target |
| `convertTerminatingDecimalToFraction` | P004 | Covered; adapter pressure |
| `convertPureRecurringDecimalToFraction` | P005 | Covered |
| `convertMixedRecurringDecimalToFraction` | P006 | Covered; parameter-merge candidate with P005 |
| `convertFractionToTerminatingDecimal` | P007 | Covered; reverse representation |
| fraction → recurring decimal | P008 | Covered reverse recurring representation |
| `identifyTerminatingVersusRecurringDecimal` | P011 | Covered after reduction |
| `findRequiredPowerOfTenForTermination` | P016 | Covered |
| `findNumberOfTerminatingDecimalPlaces` | P012 | Covered |
| `findMissingDenominatorFactorForTermination` | P015, P030 | Covered through exponent/factor reconstruction |
| `findLeastMultiplierForTerminatingDecimal` | P013 | Covered |
| `findLeastDivisorForTerminatingDecimal` | P014 | Covered |
| `reconstructFractionFromRecurringBlock` | P005, P006 | Covered pure/mixed recurring reconstruction |
| `findRecurringBlockLengthByBoundedRemainderCycle` | P021 | Covered; core-vs-enrichment review pending |
| `findReciprocalOrComplementUnderExactConstraint` | P027 | Covered; ownership review if generic algebra dominates |
| `findUnknownFractionFromSumDifferenceOrRatioEvidence` | P028 for exact sum/difference | Sum/difference represented; **generic ratio-only inference is delegated to Ratio/Proportion or Algebra and must not create a Number System QL** |

## Additional source-backed inverse / answer-shape coverage

The design baseline is supplemented by executable families required by source/edge audits:

- P017 — bounded denominator count under reduction-aware termination;
- P018 — complete bounded denominator set;
- P019 — numerator cancellation condition;
- P020 — recurring-block missing digit;
- P022 — recurring-nines exact-equivalence edge;
- P025 — unknown numerator from terminating-decimal representation;
- P026 — unknown denominator from recurring-decimal representation;
- P029 — repeated minimal recurring-block equivalence adapter;
- P031 — statement combination after ordinary authority;
- P032 — Data Sufficiency after ordinary inverse authority.

## Explicit non-ownership

The following do not justify CP-002 authorities:

- long mixed fraction/decimal expression evaluation → Simplification and Approximation;
- HCF/LCM of fractions as final target → NUM-CP-006;
- generic proportion solving from ratio evidence → Ratio/Proportion or Algebra;
- generic linear equations whose rational values are incidental → Algebra;
- presentation-only largest/smallest wording when it is the same exact ordering inference → adapter, not a new QL;
- repeated recurring block notation when it does not change the rational reconstruction inference → adapter/edge state.

## Saturation decision still pending

The matrix supports a source-saturation audit after Wave03 executable proof and human review. Until then:

- `sourceSaturated = false`;
- permanent QL count remains open;
- no permanent IDs are allocated;
- all delivery surfaces remain closed.
