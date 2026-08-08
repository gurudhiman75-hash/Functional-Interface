# CAL-001 Final Source, Gap, Merge/Split and Inverse Audit

Status: **CLOSED FOR ENGLISH IDENTITY FREEZE**

Audit date: `2026-08-08`

This audit closes the governance work that remained after approval of the corrected 220-question English review pack. It freezes solve identities only. It does not enable Question Studio, Question Bank writes, mock tests, Hindi/Punjabi use or public publication.

## 1. Evidence reviewed

The final pass used pattern-level evidence only; no source question is copied into the runtime.

| Source class | Evidence disposition |
|---|---|
| Established competitive-exam books uploaded to the project | Direct Calendar patterns, including odd days, day/date relations, calendar repetition, same-date recurrence, named-weekday dates and leap-date validity |
| SSC | Official-paper-labelled previous-question repositories confirm absolute-date, calendar-match and year-movement forms |
| RRB | Official-paper-labelled Group D/ALP repositories confirm day/date and same-calendar forms |
| Punjab state | PSSSB examples and the official-paper archive confirm conditional date relations and 1-January year movement |
| Recent memory/practice sets | Corroborate current wording and bilingual exam form; no additional solve authority |
| Banking | Boundary review completed: Calendar is a general aptitude concept but not a dominant current bank-reasoning family; no bank-only authority is created |

The executable ledger is `final-source-audit-gate.ts`. All six required source classes are represented and every retained source gap has an executable closure.

## 2. Source gaps closed

### `CAL-GAP-PROT-001` — Same date returns to the same weekday

This is not identical-full-year calendar matching. The task concerns one specified date or birthday only, so leap status of the whole target year need not match the source year.

Permanent identity: `CAL-QL-016`.

### `CAL-GAP-PROT-002` — Enumerate all named-weekday dates in a month

The existing frequency authorities count occurrences or return weekday sets. This task returns a set of date numbers, so it has a distinct answer semantic.

Permanent identity: `CAL-QL-036`.

### `CAL-GAP-PROT-003` — Count 29 February across an inclusive year range

This is a date-validity count. It uses the leap-year rule and century exception, but its student task and fixed-date interpretation differ from merely counting a requested year class.

Permanent identity: `CAL-QL-020`.

## 3. Merge and inverse decisions

The approved 44 discovery prototypes compress to 33 permanent identities. The three source-gap closures bring the final English chapter total to 36.

| Discovery prototypes | Final decision |
|---|---|
| `001, 002, 003` | Merge as one signed weekday-shift/recovery authority |
| `005, 006, 007` | Merge as one explicit dated weekday-relation authority |
| `018, 020` | Merge as forward/inverse forms of one multi-year dated movement authority |
| `023, 024, 028` | Merge as one requested-year-class count authority with class and century-exposure parameters |
| `029, 030, 031` | Merge as one identical-full-year search/selection authority |
| `035, 036` | Merge as one year-boundary inverse authority |
| `037, 038` | Merge as one month-boundary inverse authority |
| `021` and `022` | Keep separate: classification and option-year selection have different answer semantics |
| All other approved prototypes | Retain separate permanent identities |

Direction, known boundary, ordinary/leap state, century exposure, dates, named weekday, renderer and difficulty are instance properties rather than QL identities.

## 4. Final identity result

```text
Approved discovery prototypes:    44
New source-gap prototypes:          3
Frozen source prototypes:          47
Permanent English QLs:             36
Permanent range:          CAL-QL-001..036
Next available ID:        CAL-QL-037
```

The complete mapping is executable in `permanent-contracts.ts`.

## 5. Release boundary

The following remain closed:

- Hindi human freeze;
- Punjabi human freeze;
- multilingual parity freeze;
- Question Studio discovery/activation;
- Question Bank storage and writes;
- mock-test eligibility;
- public publication.

The result is an English discovery and identity freeze, not a public content release.
