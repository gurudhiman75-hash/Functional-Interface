# DSF-001 Manifest Amendment — CP-001 Production Wave 2

Amendment: `DSF_001_MANIFEST_AMENDMENT_CP001_WAVE2_V1`  
Applies to: `DSF-CP-001 — Production Generation for DSF-QL-001`  
Permanent QL: `DSF-QL-001 / TWO_STATEMENT_TARGET_DETERMINACY`

## Wave 2 scope

Second production-generation adapter: `RAP-001 / Ratio & Proportion`.

Implemented solve modes:

- `DSF-SM-RAP-RATIO-AB`
- `DSF-SM-RAP-GREATER-QUANTITY`

These are not new Question Logics. They use the same learner task as Wave 1: independently test Statement I, Statement II and their conjunction to determine whether the asked target answer is unique.

## Source ownership

Ratio simplification is not reimplemented by DSF. The adapter consumes source-owned `RAP-001/math::formatRatio` for canonical ratio truth.

DSF owns only:

- the bounded valid-world construction declared in the question;
- statement-subset isolation;
- target projection;
- sufficiency classification;
- answer-contract rendering;
- DS explanation and proof metadata.

The learner-facing base condition is explicit: A and B are distinct positive integers between 2 and 18.

## Statement families

Wave 2 synthesizes source-compatible constraints across:

- sum;
- signed difference;
- ratio;
- exact component value;
- comparison;
- parity;
- integer bounds;
- product.

Pairs are independently re-solved and accepted only when the actual five-class sufficiency result matches the deterministic target class.

## Target semantics

### Ratio target

`What is the ratio A:B in its simplest form?`

This wave explicitly exercises the governing DSF rule that full-world uniqueness is unnecessary. A statement may leave several valid pairs `(A,B)` while all surviving pairs have the same simplified ratio.

### Comparison target

`Which is greater, A or B?`

A statement is sufficient whenever every surviving valid pair gives the same comparison answer, even if the exact values remain unknown.

## Production proof

The dedicated Wave 2 gate generates 300 deterministic English questions and requires:

- all five canonical sufficiency classes;
- both Ratio & Proportion solve modes;
- exactly one correct `DS_STANDARD_5` option;
- non-empty I, II and conjunction worlds;
- normalized simplest-form ratio answers;
- multi-world / unique-ratio target-projection cases;
- statement-rule diversity;
- deterministic repeated generation;
- unique generation identities;
- source ancestry to `RAP-001`;
- lifecycle locks;
- no internal DSF/RAP identifiers in learner-facing text;
- polished canonical English insufficiency wording.

Expected status: `PASS_DSF_CP_001_RATIO_PRODUCTION`.

## Human review export

CI generates a 50-question HTML + JSON review pack with:

- full question and options;
- marked correct option;
- naturalized explanation;
- class/target summary;
- collapsible world-count, target-answer and example-world proof diagnostics.

Artifact name: `dsf-cp001-ratio-review`.

## Product lifecycle

```text
Question Studio discoverable: false
Question Bank writable:       false
test eligible:                 false
publicly publishable:          false
```

Wave 2 remains review-only until its semantic and editorial gates pass.
