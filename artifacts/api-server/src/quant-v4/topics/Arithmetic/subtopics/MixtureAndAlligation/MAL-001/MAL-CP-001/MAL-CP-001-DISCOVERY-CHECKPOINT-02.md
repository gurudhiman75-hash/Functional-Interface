# MAL-CP-001 Discovery Checkpoint 02

Status: **classification and first gap audit complete; validated runtime CI passed**  
Branch: `feat/mal-001-cp001-prototype-foundation`  
Validated runtime head: `0ca8ea76fce149ff86881870cd70f22ae7d9cf83`  
Permanent QLs: **0**  
Question Studio exposure: **disabled**  
Public routing: **disabled**

## Completed in this checkpoint

- manually inspected the generated 36-question English review pack;
- converted review-found semantic and grammar defects into runtime guards;
- classified all nine executable prototypes exactly once;
- merged representation, component-count and temporal-framing duplicates;
- reduced nine prototypes to five candidate learner contracts;
- documented AVG and neighbouring-CP ownership boundaries;
- completed the first source-format, inverse and representation gap audit;
- kept all identities non-permanent and non-publishable.

## Prototype classification

```text
RETAIN: 5
MERGE:  4
SPLIT:  0
DEFER:  0
REASSIGN: 0
```

The five current candidate contracts are:

```text
MAL-CP001-CAND-TARGET-RATIO
MAL-CP001-CAND-FINAL-MEAN
MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE
MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY
MAL-CP001-CAND-TWO-QUANTITIES-FROM-TOTAL
```

These remain discovery labels. They are not permanent QLs or frozen solve modes.

## Manual-review defects closed

The first review pack exposed defects that mathematical proof alone could not detect:

- a cheaper source could inherit a `premium` or `high-grade` label when addition direction reversed;
- a stem could begin with a lower-case commodity label;
- a numeric mass subject could be paired with singular `is blended`;
- mass nouns such as `tea leaves` could be used in an unnatural `How much ... was added?` construction;
- three-component lists could omit the final conjunction;
- a broad case-insensitive regression pattern could falsely reject a correct lower-case `what` after a comma.

The final pipeline now:

- attaches lower/middle/higher labels to actual value order;
- applies only narrow, defect-backed English corrections;
- preserves unit casing;
- validates learner-facing grammar and context-role coherence;
- includes the exact failing stem in future grammar diagnostics.

## Validated runtime evidence

GitHub Actions workflow run:

```text
30289575808 — PASS
```

Evidence artifact:

```text
8662221782
sha256:f141c66ad7f5bce0557ad4e215ceab9c954b4878f4318c72681c00f0baf5d397
```

Deterministic proof:

```text
9 prototypes × 120 seeds = 1,080 generated cases
```

Structural/editorial audit:

```text
9 prototypes × 80 seeds = 720 generated cases
candidate contracts = 5
RETAIN = 5
MERGE = 4
permanent QLs = 0
fractional displayed answers/options = 0
```

The final 36-question review artifact was additionally checked for:

- lower-case sentence starts;
- `Kg`/`Litres` casing regressions;
- comma followed by incorrectly capitalised `What`;
- mass-noun `How much ... was added?` forms;
- numeric-subject `is blended` forms;
- missing final conjunctions;
- lower/middle/higher label-value inversions.

No such defects remained in the final artifact.

## Allocation remains blocked

The first nine prototypes do not close CP-001. The following temporary executable gaps remain:

```text
MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO
MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

Each is still subject to executable merge/split and ownership review. The list does not imply six future QLs.

## Next checkpoint

Implement the six open prototypes on the same exact rational, valid-state-first foundation. Then rerun:

- canonical versus independent verification;
- answer-semantic audit;
- source-format and representation audit;
- uniqueness and determinacy checks;
- AVG/CP-002/CP-004/CP-006 ownership audit;
- English review export;
- final merge/split classification.

Permanent `MAL-QL-*` allocation remains prohibited until those gates pass.
