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

Number System is the next active audit. Remaining work is item-level disposition of the 379 source questions against exact permanent contracts, independent adjudication of contradictory/ambiguous source items, full learner-content review including the native-language delivery authorities, and a chapter closure decision supported by those results. The technical baseline and source inventory are completed here; that remaining source/content work is explicitly open. User-run live verification is deferred and does not block this work.

Evidence: `number-system-source-review/NUMBER-SYSTEM-TECHNICAL-BASELINE-20261011.json`, `CHECKPOINT-PROOFS-20261011.json`, and `SSC-379-SOURCE-INVENTORY-20261011.csv`.
