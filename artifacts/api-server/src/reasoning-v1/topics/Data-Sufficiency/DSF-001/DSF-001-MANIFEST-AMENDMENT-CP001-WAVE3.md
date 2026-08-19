# DSF-001 Manifest Amendment — CP-001 Production Wave 3

Amendment: `DSF_001_MANIFEST_AMENDMENT_CP001_WAVE3_V1`  
Applies to: `DSF-CP-001 — Production Generation for DSF-QL-001`  
Permanent QL: `DSF-QL-001 / TWO_STATEMENT_TARGET_DETERMINACY`

## Wave 3 scope

Third production-generation adapter: `PCT-001 / Percentage`.

Implemented solve modes:

- `DSF-SM-PCT-NET-SUCCESSIVE-CHANGE`
- `DSF-SM-PCT-FINAL-DIRECTION`

This wave is intentionally based on **successive percentage change**, not on a cosmetic ratio-to-percentage restatement. It therefore broadens the source-domain target function while preserving the same learner-facing Data Sufficiency task contract.

No new permanent QL is created.

## Source ownership

Percentage arithmetic is source-owned by `PCT-001`. DSF reuses:

- `percentOf`;
- `roundTo`;
- `formatPercent`;
- `formatRatio`.

DSF owns only:

- the finite rate universe explicitly declared in the question;
- statement-subset isolation;
- target projection;
- sufficiency classification;
- DS answer rendering;
- question-specific explanation and proof metadata.

## Base problem

`P` and `Q` are percentage rates, each a multiple of 5 from 5% to 50%.

A value is:

1. increased by `P%`; and
2. then decreased by `Q%` from the increased value.

The resulting 100 ordered `(P,Q)` rate worlds form the complete base universe for the question.

## Target semantics

### Exact net percentage change

Prompt:

`What is the net percentage change from the original value?`

Target truth is computed from source-owned percentage primitives. This mode tests exact target determinacy after two multiplicative percentage operations.

### Final direction

Prompt:

`Is the final value above, below or equal to the original value?`

This deliberately exercises target projection: many different `(P,Q)` pairs may remain, yet every survivor can still produce the same categorical target (`ABOVE`, `BELOW` or `SAME`).

## Statement families

Wave 3 synthesizes constraints across:

- exact rate;
- sum;
- signed percentage-point difference;
- ratio;
- product;
- comparison;
- individual rate bounds;
- sum bounds.

Pairs with identical survivor sets are rejected. Empty/inconsistent intersections are rejected. Every accepted pair is independently re-solved through the frozen DSF evaluator and must match its deterministic target sufficiency class.

## Production proof

The dedicated Wave 3 gate generates 300 deterministic English questions and requires:

- all five canonical sufficiency classes;
- both successive-percentage target modes;
- exactly one correct `DS_STANDARD_5` option;
- 100-world base-universe agreement;
- non-empty I, II and conjunction survivors;
- percentage-format exact target answers;
- categorical direction targets restricted to `ABOVE / BELOW / SAME`;
- multi-world / unique-target projection cases;
- statement-rule diversity;
- deterministic repeated generation;
- unique generation identities;
- source ancestry to `PCT-001`;
- publication lifecycle locks;
- no internal IDs or solver jargon in learner-facing text;
- canonical polished English answer wording.

Expected status: `PASS_DSF_CP_001_PERCENTAGE_PRODUCTION`.

## Editorial realization

Student-facing explanation is separated from semantic solving.

The explanation sequence is:

```text
What is asked
→ Statement I alone
→ Statement II alone
→ both together only when required
→ exclusive sufficiency conclusion
```

For exact targets, explanations discuss whether the net percentage change is fixed. For direction targets, explanations discuss whether every valid case ends above, below or equal to the original value.

## Human review export

CI generates a 50-question HTML + JSON review pack containing:

- full question and statements;
- five DS options with the correct option marked;
- naturalized explanation;
- class/target distribution summary;
- collapsible survivor counts, target-answer sets and example rate worlds.

Artifact name: `dsf-cp001-percentage-review`.

## Product lifecycle

```text
Question Studio discoverable: false
Question Bank writable:       false
test eligible:                 false
publicly publishable:          false
```

Wave 3 remains review-only until its exact-head semantic and editorial gates pass.
