# Banking Number Series — source and frequency evidence review

Status: evidence review completed; empirical calibration remains blocked by the
retrieved evidence. No production or simulator weights were changed. Live
verification remains deferred to the user.

## Current content authority

The implemented V3 technical freeze remains authoritative: 19 grammars,
EN/HI/PA, next/missing/wrong tasks, and a bounded twelve-grammar Mains selector.
The October 17 numeric-surface fix is merged in PR #3413. The older October 11
Phase-0 backlog describes history, not the current implementation.

The existing practice ledger has 20 unique source locators: 19 supported,
independently adjudicated numeric fixtures and one unresolved excluded item.
Neither practice counts nor source-locator counts measure actual exam frequency.
BankersAdda item 8 remains excluded; a new arbitrary rule is not inferred to
force source closure.

## Official evidence boundary

The public SBI 2026 PO Prelims, Junior Associates Prelims and PO Mains handouts
were inspected for exam structure and sample-question context. They are
illustrative handouts, not administered shift papers. They support section
structure, not Number Series grammar weights or shift occurrence rates.

IBPS's official FAQ indexed excerpt states that it does not provide question
papers or answer keys. Direct FAQ retrieval returned 502. Consequently,
"obtain complete official IBPS PYQs" must not be a perpetual implementation
gate. Attributed, independently checked memory-based papers can support a
separate reported-evidence calibration; they must retain that provenance.

Official references and exact URLs are recorded in the JSON companion. This
review does not claim that all official archives or every uploaded file were
exhaustively searched.

## Reported-frequency findings

| Exam/date/shift | Publisher report | Adjudication |
|---|---|---|
| IBPS PO Prelims, 2024-10-19, Shift 1 | Oliveboard: 5 wrong-series questions; PracticeMock: 6 | Same shift, conflicting counts; not two independent exam observations |
| IBPS PO Prelims, 2024-10-19, Shift 2 | PracticeMock: no series row; other listed topics sum to 35 | Unreported, not an explicitly reported zero |
| IBPS PO Prelims, 2024-10-19, Shift 3 | PracticeMock lower table: 5 wrong-series questions | The page also embeds Shift 4 tables; retain section locator and identity hold |
| RRB PO Prelims, 2024-08-04, Shift 3 | Oliveboard: 6 missing-series questions | Title/headings say Shift 3; introductory prose also says Shift 2; identity hold |

Five publisher observations describe four nominal shifts. The small sample is
from one year, contains conflicts/identity holds, has no adjudicated complete
question-level sections and supplies no grammar-level question mappings.
No empirical mean, confidence interval or production weighting is justified.
Source text is not copied into the repository; the ledger stores locators,
counts, provenance and adjudication notes.

## Simulator reconciliation

Current `quant-v4-real-exam-simulation-p2.ts` allocations are:

| Simulator profile | Current BNS slots | Evidence status |
|---|---:|---|
| IBPS_PO_PRELIMS | 5 | Provisional |
| IBPS_CLERK | 5 | Provisional |
| SBI_PO | 4 | Provisional |
| IBPS_RRB_BANKING | 5 | Provisional |
| IBPS_PO_MAINS | 0 | Provisional; a working Mains chapter generator does not establish a Mains section distribution |

The generic simulator correctly retains `PROVISIONAL_PYQ_WEIGHTING_REQUIRED`
and its `PYQ_FREQUENCY_WEIGHTING_PENDING` blocker. Neither uniform random
grammar selection nor the fixed slot counts are described as calibrated.
Do not replace these with an average from the conflicting reports above.

## Required evidence for the next calibration

Use complete, dated, shift-specific, attributed memory-based sections across
multiple years and preserve their nonofficial status. Record all section
questions, including non-series questions, so the denominator and absent-topic
sections are represented. Deduplicate the same shift across publishers; resolve
count/identity discrepancies before admitting a section. Independently solve
each admitted series and map task and grammar before deriving weights. Keep
Prelims, Mains and each examination separate. Use the existing whole-section
frequency governance for promotion; do not lower its policy to admit this sample.

## Validation

The evidence inventory was checked against the current practice ledger: 20
unique locators, 19 supported fixtures, one quarantine. Same-shift grouping
reproduces the 5-versus-6 conflict. Simulator slot counts and provisional status
were checked against the current source. JSON parsing and patch hygiene pass.
This documentation change does not require rerunning the mathematical generator.

Machine-readable evidence:
`bns-source-review/source-frequency-evidence-20261017.json`.
