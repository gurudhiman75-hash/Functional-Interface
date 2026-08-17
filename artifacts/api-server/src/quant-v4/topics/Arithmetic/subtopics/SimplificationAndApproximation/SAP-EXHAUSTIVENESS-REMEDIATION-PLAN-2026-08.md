# SAP Exhaustiveness Audit — Remediation Plan

**Status:** design/remediation authority only. No freeze/activation/publication.

## E1 — implemented checkpoint remediation

### CP004

1. Add one provisional learner identity for **nested additive exact radical chains**.
2. Expand existing exact-root/root-mixed families to terminating-decimal perfect roots.
3. Replace raw Unicode radicals with scoped LaTeX in stems, options and explanations.
4. Keep symbolic surd decomposition/rationalisation outside SAP.

### CP005

1. Register verified bounded numeric telescoping fixtures.
2. Add a provisional **adjacent reciprocal-product telescoping** identity only after fixture registration.
3. Prove decomposition and endpoint survival independently.

### CP007

1. Add provisional **round to N significant figures** identity.
2. Test values above/below one, zeros, carry, ties and integers/decimals.
3. Keep measurement-science-only significant-figure theory outside SAP unless Quant ownership is independently proven.

### CP010

1. Retain V6 root-depth/scoped-radical runtime.
2. Add provisional **supplied-root scaling** identity.
3. Merge the ROOT branch of QL180 into QL169.
4. Re-evaluate whether the remaining POWER branch of QL180 merits its own identity.
5. Keep generic unsupplied interpolation held.

## E2 — checkpoint completion

### CP011

Implement only generic accuracy/safety contracts:

- absolute error;
- relative error;
- percentage error;
- compare two estimates by error;
- tightest certified interval;
- required precision for option separation;
- unique-vs-ambiguous nearest option.

Anti-duplication rule:

- additive estimate nearest option -> CP008 when addition is decisive;
- multiplicative estimate nearest option -> CP009 when multiplication is decisive;
- nearest integer root -> CP010;
- generic error/safety proof -> CP011.

### CP012

Implement reverse and genuine synthesis contracts:

- missing rounded term;
- original-value range from a rounded result;
- missing percentage/ratio/root/power under an approximate contract;
- tolerance equality and all/none/multiple candidate classification;
- exact cancellation followed by approximation;
- reverse composite/nested root-power missing-value expressions;
- multi-authority synthesis only when no primary CP owns the decisive inference.

## Merge/split checks required before final freeze

1. QL169 vs ROOT branch QL180 — expected MERGE.
2. CP004 simple nested perfect root vs additive nested radical — expected SPLIT/SIBLING.
3. CP011 nearest-option candidates vs CP008/009/010 family-specific nearest options — reject duplicates.
4. CP012 missing-value candidates vs CP006 and primary approximate CPs — keep only genuine approximation-aware synthesis.

## Final saturation gate

After E1 and E2:

1. run a new SSC/Banking/Railway/Punjab/state source wave;
2. disposition every fixture;
3. run topology/representation matrix audit;
4. run all-math-rendering audit;
5. generate fresh review artifacts for every affected CP;
6. manually inspect actual questions and explanations;
7. require exact-head deterministic proof;
8. only then propose final permanent allocation/freeze.

Until then:

```text
SOURCE_SATURATED = false
FINAL_FREEZE_READY = false
ALL_DELIVERY_SURFACES = off
```
