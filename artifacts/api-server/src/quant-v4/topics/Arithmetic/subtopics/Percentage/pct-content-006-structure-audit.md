# PCT-CONTENT-006 - Structure Audit

## Overall Structure Findings

- Direct statement and generic word-problem structures still dominate the audited set.
- `PCT-001` remains overwhelmingly direct or formula-only, with almost no real document-led presentation.
- `PCT-005` has the best structure diversity, but several of its newer shells are still thin wrappers around the same underlying math form.
- Multiplier chapters in `PCT-003` and `PCT-004` are the weakest from an exam-feel perspective because they rely heavily on bare formula language.

## Structure Distribution By File

| File | Dominant structures | Editorial verdict |
| --- | --- | --- |
| `PCT-001/question-language.en.json` | Direct statement, formula-only prompt, generic word problem | Structurally weakest file; enrichment did not meaningfully diversify delivery |
| `PCT-002/question-language.en.json` | Direct statement with a few report/register wrappers | Improved, but still structurally conservative |
| `PCT-003/question-language.en.json` | Direct statement, formula-only prompt, generic word problem | Contexts improved more than structures |
| `PCT-004/question-language.en.json` | Direct statement, generic word problem, a few record/register wrappers | Mirrors `PCT-003` too closely |
| `PCT-005/question-language.en.json` | Report, note, register, audit, comparison statement, generic word problem | Best structural range, but several shells need more natural English |

## Structure Distribution By PCT Chapter

### `PCT-001/question-language.en.json`

| CP ID | Dominant structure types | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Direct statement, formula-only prompt | Mostly one-line drills, even when a context noun is present |
| `PCT-CP-002` | Direct statement, formula-only prompt | Almost entirely abstract percentage mechanics |
| `PCT-CP-003` | Direct statement, comparison statement, formula-only prompt | Too many clone shells around successive change |
| `PCT-CP-004` | Direct statement, formula-only prompt | Same-expenditure and geometry shells repeat without structural variation |
| `PCT-CP-005` | Generic word problem, comparison statement | Harder problems exist, but all in the same old narrative form |
| `PCT-CP-006` | Generic word problem | Nearly all mixture problems use the same sentence architecture |

### `PCT-002/question-language.en.json`

| CP ID | Dominant structure types | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Direct statement | Functional, but plain |
| `PCT-CP-002` | Branch/bank statement, note, direct statement | One of the better chapters structurally |
| `PCT-CP-003` | Direct statement, attendance record | Could use more roster or register style |
| `PCT-CP-004` | Direct statement | Repetitive in ask form |
| `PCT-CP-005` | Direct statement, comparison statement | Ratio chapter still reads too uniformly |
| `PCT-CP-006` | Direct statement | Complement shells are mathematically varied but structurally similar |
| `PCT-CP-007` | Report, survey summary, direct statement | Strongest structure range in the file |
| `PCT-CP-008` | Generic word problem | Three-category questions need tables or lists |
| `PCT-CP-009` | Budget summary, election report, result summary | Good direction; should be extended |
| `PCT-CP-010` | Generic word problem | Too plain for a closing chapter |

### `PCT-003/question-language.en.json`

| CP ID | Dominant structure types | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Report, note, direct statement | Good start for the file |
| `PCT-CP-002` | Direct statement | Still mostly plain shells |
| `PCT-CP-003` | Direct statement | Heavy "after increase" shell repetition |
| `PCT-CP-004` | Formula-only prompt | Weakest structure in the file |
| `PCT-CP-005` | Generic word problem | Needs year-wise or record-wise presentation |
| `PCT-CP-006` | Generic word problem | Same net-increase idea repeated |
| `PCT-CP-007` | Comparison statement | Better, but still same compare-two-values frame |
| `PCT-CP-008` | Generic word problem | Strong candidate for survey table or passenger chart format |
| `PCT-CP-009` | Target/revision note | Useful direction, but too repetitive |
| `PCT-CP-010` | Generic word problem | Acceptable but not distinctive |

### `PCT-004/question-language.en.json`

| CP ID | Dominant structure types | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Record, register, direct statement | Better than pure abstraction, but still thinly developed |
| `PCT-CP-002` | Direct statement | Decrease-amount chapter remains plain |
| `PCT-CP-003` | Direct statement | Includes an exact duplicate pair; structure variation is weak |
| `PCT-CP-004` | Formula-only prompt, note, register | Better wrappers, but still multiplier-first instead of exam-first |
| `PCT-CP-005` | Generic word problem | Same successive-decrease shell repeats |
| `PCT-CP-006` | Generic word problem | Net-decrease chapter needs stronger formatting variety |
| `PCT-CP-007` | Comparison statement | Usable, but repetitive |
| `PCT-CP-008` | Generic word problem | Good place for inventory table or department record structures |
| `PCT-CP-009` | Target/revision note | Useful but same ask form across five stems |
| `PCT-CP-010` | Generic word problem | Plain closing chapter |

### `PCT-005/question-language.en.json`

| CP ID | Dominant structure types | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Survey/report/note structures | Strong opening chapter structurally |
| `PCT-CP-002` | Audit/report/generic word problem | Good variety, but one generic duplicate remains |
| `PCT-CP-003` | Generic word problem with light record shells | Better than earlier files, still repetitive |
| `PCT-CP-004` | Generic word problem, bill-style prompt | Needs one more true document-based shell |
| `PCT-CP-005` | Record/note/generic comparison | Strong raw variety, weaker wording |
| `PCT-CP-006` | Sheet/table/formula-replacement prompts | Good direction, but notation is too internal |
| `PCT-CP-007` | Record/note/bill/comparison statement | One of the strongest CPs structurally |
| `PCT-CP-008` | Comparison statement | Same structure repeated with different nouns |
| `PCT-CP-009` | Register plus generic successive-change prompts | Needs more structure variation |
| `PCT-CP-010` | Generic word problem | Acceptable, but not distinct |

## Direct-Statement Dominance

- `PCT-001` is the clearest example of direct-statement dominance and should not move to final approval in its current form.
- `PCT-003` and `PCT-004` also rely too heavily on direct or generic sentence shells for increase/decrease mechanics.
- `PCT-005` shows that richer structures are possible, but the richer structures need cleaner language and more distinct ask patterns.

## Formula-Only Prompts To Watch

| File | CP ID | QL ID | Why weak |
| --- | --- | --- | --- |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | Fraction family including `PCT-QL-003`, `103`, `203`, `303`, `403`, `503`, `603`, `703`, `803`, `903`, `1003`, `1103`, `1203`, `1303`, `1403`, `1503`, `1603`, `1703`, `1803`, `1903` | Too many conversion drills for one bankable family |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | Families `PCT-QL-005` to `PCT-QL-019` and clones | Abstract percentage mechanics without editorial differentiation |
| `PCT-003/question-language.en.json` | `PCT-CP-004` | `PCT-QL-007, 008, 030, 031, 032` | Multiplier prompts read like worksheet lines |
| `PCT-004/question-language.en.json` | `PCT-CP-004` | `PCT-QL-007, 008, 030, 031, 032` | Same problem on the decrease side |
| `PCT-005/question-language.en.json` | `PCT-CP-006` | `PCT-QL-011, 012, 036, 037, 038` | Better wrappers, but still essentially formula-replacement prompts |

## Repeated Structure Shells

1. `After a {rate}% increase/decrease, the {wholeLabel} became... find the original/starting...`
2. `The current {wholeLabel} is ... and the target is ...`
3. `A {wholeLabel} first increased/decreased by ... and then by ...`
4. `What multiplier should be used...`
5. `Out of total, x% are A, y% are B... find the number/share of A`

## Recommendations For Structure Enrichment

1. Use tables, registers, result summaries, sanctioned-strength notes, stock cards, and utility revision memos instead of repeating sentence-shell clones.
2. Reserve formula-only prompts for a small number of deliberate drill items, not whole clone families.
3. When enriching a context, change the delivery form too. A noun swap without a structure change does not materially improve bank quality.
4. Use `PCT-005` as the model for structure variety, but normalize its wording into cleaner exam English.
