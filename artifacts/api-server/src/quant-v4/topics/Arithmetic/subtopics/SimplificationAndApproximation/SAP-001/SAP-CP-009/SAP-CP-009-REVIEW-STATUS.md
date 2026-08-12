# SAP-CP-009 — Review Status

**Checkpoint:** `SAP-CP-009 — Approximate Products, Quotients, Ratios and Percentages`  
**Current state:** `INACTIVE_HUMAN_REVIEW_CANDIDATE`  
**Candidate coordinates:** `SAP-QL-147..165`  
**Identity count:** `19`  
**Base:** product-owner freeze of SAP-CP-004..008 (`SAP-QL-053..146`)  
**Next lifecycle gate:** human semantic / exam-readiness review  

## 1. Frozen learner boundary

CP-009 owns multiplicative approximation where product, quotient, ratio or pure numeric percentage scaling is the decisive skill.

Included in the current candidate:

1. rounded product;
2. decimal product;
3. compatible quotient;
4. approximate percentage of a quantity;
5. approximate one quantity as a percentage of another;
6. percentage-factor product;
7. product-quotient chain;
8. coordinated ratio scaling;
9. exact cancellation before approximation;
10. reciprocal-then-multiply route;
11. missing approximate factor;
12. missing approximate divisor;
13. nearest option for a product or quotient;
14. comparison of approximate ratios;
15. positive product bounds;
16. positive quotient bounds;
17. decimal-scale diagnosis;
18. unsafe ratio-substitution diagnosis;
19. product overestimate / underestimate classification.

Excluded or rejected:

- applied percentage stories;
- roots or powers as the main approximation challenge;
- denominator states that can round to zero or cross sign;
- unsafe ratio substitutions that materially distort scale;
- options that are closer than the approved approximation can separate.

## 2. Editorial contract

The final review-facing runtime is `final-runtime.ts`.

Student-facing rules are explicit:

- use competitive-exam style stems rather than implementation language;
- state the rounding/compatible-number instruction when different approximation routes could change the answer;
- keep explanations to two or three short calculation/reasoning steps;
- avoid unnecessary large exact calculations when a quicker exam argument proves the answer;
- reject internal terms such as `oracle`, `runtime`, `prototype`, `canonical`, `learner route`, `transformed expression`, `internal` and `guard` from learner content.

## 3. Deterministic proof

The reusable independent authority proves 100 seeds for each of the 19 identities:

- **1,900 independently verified cases**;
- **100 unique visible stems per identity**;
- **1,900 unique payloads**;
- **1,900 unique generation identities**;
- exact answer-position balance **475 / 475 / 475 / 475**;
- all three approximate-ratio comparison outcomes `<`, `=` and `>`;
- both `Overestimate` and `Underestimate` classes;
- independent inverse checks for missing factor/divisor;
- independent positive product/quotient bound reconstruction;
- safe non-zero denominator checks;
- safe ratio-substitution checks;
- inactive lifecycle checks.

Final editorial authority evidence before this status-only commit:

- workflow: `Validate SAP-CP-009 multiplicative approximation`;
- run: `31602107410`;
- result: `SUCCESS`;
- reviewed implementation head: `372dfe862adfe7c15195fcbb319fc1e016ea1632`.

## 4. 300-question human review

The final review corpus contains:

- **300 unique questions**;
- all **19 identities**;
- `SAP-QL-147..165` candidate coordinates;
- exact answer positions **75 A / 75 B / 75 C / 75 D**;
- no three-position answer streak;
- both product and quotient nearest-option forms;
- all three ratio-comparison relations;
- both overestimate/underestimate outcomes;
- both product and quotient bound families;
- scale and ratio-diagnosis families;
- 2–3 step explanations;
- zero internal-engine vocabulary under the final language scan.

Final review evidence before this status-only commit:

- workflow: `Validate SAP-CP-009 300-question full review`;
- run: `31602107537`;
- result: `SUCCESS`;
- artifact: `sap-cp009-300-question-full-review`;
- artifact ID: `9143547416`;
- digest: `sha256:3897f1ca29835b967516ba09df28b66e98ff161ca020330facd9f24aa27d1234`;
- reviewed implementation head: `372dfe862adfe7c15195fcbb319fc1e016ea1632`.

## 5. Manual exam-readiness remediation

Manual inspection was performed after the first green 300-question export. The following issues were corrected rather than accepted merely because CI passed:

- large product nearest-option states were changed from awkward nearest-ten multiplication to exam-calculable nearest-hundred products;
- ratio-scaling and ratio-comparison states were moved to larger, safer benchmarks so rounding does not distort the ratio sharply;
- percentage stems were rewritten from generator-like `Use X for Y` wording into normal approximation instructions;
- cancellation wording was simplified to a standard exam instruction;
- the reciprocal family was remodelled as a genuine reciprocal-product task rather than another direct quotient question;
- ratio-distortion diagnosis was made subtler and its difficulty recalibrated;
- over/under explanations now use the direction in which both positive factors round, avoiding unnecessary large exact products;
- the final ratio-diagnosis wording now correctly teaches `nearest-hundred values` rather than the imprecise phrase `same rounding place`.

The final artifact was re-inspected after these changes. Representative families have short exam-like stems and direct student working.

## 6. Lifecycle lock

Every CP-009 candidate remains:

```text
permanentQlId:             null
contentStatus:             ENGLISH_REVIEW_CANDIDATE
active:                    false
questionStudioDiscoverable:false
questionBankWritable:      false
testEligible:              false
publiclyPublishable:       false
```

CP-009 is **not frozen, merged, activated or published** by this implementation checkpoint.

## 7. Next gate

Human/product review of the 300-question English artifact. After explicit approval, CP-009 may receive its own inactive permanent freeze. Activation remains a separate later decision.
