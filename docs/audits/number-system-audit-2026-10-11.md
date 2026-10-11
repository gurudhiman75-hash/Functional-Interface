# Number System audit — corrected baseline and source inventory

Base: `New-main@320807d0`. Scope: audit instrumentation and complete numbered inventory of the supplied SSC Number System collection. This record does not certify a fresh complete chapter source audit or freeze.

## Findings and corrections

The existing systematic audit flattened only selected explanation fields. When `coreConcept`, `concept` or `finalAnswer` existed, it discarded other sections including `stepByStep` and `solution`. This created 92 explanation-length warnings at eight seeds. The corrected traversal includes all explanation sections; no explanation-length warnings remain at 32 seeds.

Numeric diversity previously examined only stems. This understated variation for classification questions whose numbers appear in options. The audit now separately reports stem numeric signatures, stem-plus-option numeric signatures and mathematical states. It retains the original diagnostic fields rather than silently lowering thresholds.

Validation: 253 QLs, 14 checkpoints, 32 seeds per QL, 8,096 generated English permanent-runtime questions, 7,552 explicit verifier-answer comparisons, 253 deterministic replay checks. All mathematical, option, lifecycle, placeholder and MathJax assertions passed. All 21 existing focused runtime, source-saturation and merge/split proof files selected for this pass passed.

No QL has fewer than four mathematical states across 32 seeds. `NUM-QL-130` has only two numeric signatures in the learner surface but eight mathematical states: it is a parity truth-classification contract, so numerical breadth alone is not an appropriate defect criterion. Repeated direct-question structures and repeated answer categories remain review signals, not automatic mathematical failures. Explanation length is a screening metric, not certification of semantic teaching quality.

## Source inventory

Original source: `SSC Mathematics Previous Year Solved Paper Number System [sscstudy.com].pdf`, 47 pages. Library identity: `libfile_b3a8f925527c8191aac2968306e2dff1`.

The initial extraction placed some section headings after their questions because of the three-column layout. PDF layout inspection and column-aware extraction recovered the correct numbered inventory:

| Section | Numbered questions |
|---|---:|
| I — Smallest and Largest Fraction | 21 |
| II — Division, Multiplication, Addition and Subtraction | 126 |
| III — Fractions of Numbers | 77 |
| IV — Ascending and Descending Order | 4 |
| V — Unit Place | 21 |
| VI — Consecutive Numbers | 26 |
| VII — Miscellaneous | 104 |
| Total | 379 |

The CSV records every numbered item exactly once. Opening excerpts locate items; they are not reliable substitutes for the PDF's mathematical typography. Every row explicitly remains `PENDING_ITEM_ADJUDICATION`. No source-to-QL coverage is claimed from merely counting or extracting questions.

Printed source answers cannot be used as verifier authority. Examples already requiring independent adjudication include Section I Q9, Q16 and Q19. Column extraction and printed inconsistencies must be separated before recording corrections.

## Closure boundaries and next work

PR #3319 completed Number System, Interest and Algebra unified review routing. It did not establish a fresh deep-source/content closure for those chapters. Existing TSD and PNC closures remain preserved. Partnership's October post-remediation chapter closure also remains preserved. Older design-stage records such as Algebra's first-pass source authority are superseded by later permanent/freeze records and must not be treated as present-day missing implementation.

Number System was formally closed on 2026-10-02 with 14/14 checkpoints and 253 QLs. That closure is preserved; this instrumentation correction and supplemental source inventory do not reopen it. The new 379-row inventory has not been item-adjudicated in this pass, and must not be cited as a new full-source approval. Previous closures for Interest, Average, Profit & Loss, Algebra, Geometry, Trigonometry and Mixture & Alligation are also not reopened simply because a fresh audit certificate was absent from the routing reconciliation.

The next verified unfinished chapter is Banking Number Series (`BNS-001`): its current runtime has five grammar families and two task kinds, is English/Banking Prelims only, has no permanent QL allocation, and explicitly retains `reviewStatus: UNREVIEWED`. A Banking Mains number-series profile is not frozen, as recorded by the current exam simulator. Quantity Comparison (`QCP-001`) is a separate unfinished representation audit at `PHASE0_REVIEW_ONLY`; it must not be counted as a Number System chapter defect. User-run live verification is deferred and does not block either audit.

Evidence: `number-system-source-review/NUMBER-SYSTEM-TECHNICAL-BASELINE-20261011.json`, `CHECKPOINT-PROOFS-20261011.json`, and `SSC-379-SOURCE-INVENTORY-20261011.csv`.
