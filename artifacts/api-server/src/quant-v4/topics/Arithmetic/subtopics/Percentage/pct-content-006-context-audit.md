# PCT-CONTENT-006 - Context Audit

## Overall Context Findings

### Overused contexts

- Generic or no-context percentage drills are still the dominant editorial mode, especially in `PCT-001`, `PCT-003`, and `PCT-004`.
- Salary/income, school/students, population/voters, price/discount, and stock/inventory recur most often across the five files.
- Mixture/alloy/science contexts dominate `PCT-001/PCT-CP-006` almost completely.

### Missing or underused contexts

- Banking and insurance are still underused relative to the stated goal of stronger exam-bank readiness.
- Government department / public-record contexts exist, but are still thin and often only cosmetic wrappers.
- Hospital/clinic, utilities, museum/library, wildlife, and transport are present mostly as one-off stems rather than real families.
- Modern technology/app/internet contexts appear, but not in enough structurally distinct forms.

## Context Distribution By PCT Chapter

### `PCT-001/question-language.en.json`

| CP ID | Dominant context families | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Election, exam/marks, population, shop discount, factory, school, mixture, books, personal money, utility | Surface diversity is decent, but most stems are still one-line direct shells with light noun swapping |
| `PCT-CP-002` | Generic number, salary, school, stock, marked price, profit, population, tax, journey | The chapter is heavily generic; salary and number shells are overused |
| `PCT-CP-003` | Generic number, price, population, machine value, geometry | Context diversity is weak; geometry and abstract-number shells dominate |
| `PCT-CP-004` | Consumer price, petrol, rectangle, car speed, tax, factory wage, circle | Feels like old aptitude-book context selection rather than current exam-bank spread |
| `PCT-CP-005` | Salary/income, election/votes, school/students, village population, family money split, alloy | Too many classic SSC cliches are stacked into one CP |
| `PCT-CP-006` | Acid, salt, alcohol, grapes, sugar solution, alloy | Essentially a single science-mixture family with minor substance swaps |

### `PCT-002/question-language.en.json`

| CP ID | Dominant context families | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Generic whole/part, school, election | Needs more non-school, non-election contexts |
| `PCT-CP-002` | Bank statement, telecom usage, school, yearly total | Good start, but only one real banking shell and one telecom shell |
| `PCT-CP-003` | Generic count, money, attendance, booked seats | Functional, but still mostly plain direct phrasing |
| `PCT-CP-004` | Generic total, votes | Context spread is narrow |
| `PCT-CP-005` | Wildlife, museum, students, land, votes | One of the more diverse CPs in this file |
| `PCT-CP-006` | Class, income, students, battery, shop stock | Useful spread, but still direct-statement heavy |
| `PCT-CP-007` | Students, monthly budget, poll, hospital beds, crop area | Strongest context spread in the file |
| `PCT-CP-008` | Generic categories, spending, company staff, survey, passengers | Needs stronger distinction between company, survey, and transport shells |
| `PCT-CP-009` | Budget, survey, election report, result summary | Good public-record direction, but still mathematically repetitive |
| `PCT-CP-010` | Generic count, spending | Too generic for the closing chapter; needs stronger contextual variety |

### `PCT-003/question-language.en.json`

| CP ID | Dominant context families | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Clinic, library, electricity, internet, crop | Best-balanced opening chapter in the increase file |
| `PCT-CP-002` | Generic whole, salary, seating, milk production | Still leans generic despite some useful concrete nouns |
| `PCT-CP-003` | Generic whole, price, stock, internet users | Context swaps exist, but the shell is too repetitive |
| `PCT-CP-004` | Generic multiplier, price, production | Very weak contextual richness |
| `PCT-CP-005` | Generic whole, students, production, mobile users | Needs more institutional/public-record flavor |
| `PCT-CP-006` | Generic whole, sales, visitors | Thin spread; same conceptual setting repeated |
| `PCT-CP-007` | Generic labels, branch sales, town populations, product prices | Better range, but still same comparison shell |
| `PCT-CP-008` | Generic group split, company staff, survey, passengers | Good candidate for stronger tables/registers |
| `PCT-CP-009` | Generic current-vs-target, sales, production, internet users | Overuses target-based business and growth shells |
| `PCT-CP-010` | Generic growth, mobile users, cattle, machine output | Acceptable spread, but could use one civic/public-record context |

### `PCT-004/question-language.en.json`

| CP ID | Dominant context families | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | Generic record/register, stock, rainfall, depreciation | Better than pure formula drills, but still thinly contextualized |
| `PCT-CP-002` | Generic whole, shop discount, attendance, crop yield | Strongly skewed toward stock/discount/attendance style |
| `PCT-CP-003` | Generic whole, discount, stock, depreciation | Same shell repeated with only context labels changed |
| `PCT-CP-004` | Fee table, budget note, marked price, inventory register | One of the better context sets, but still too multiplier-heavy |
| `PCT-CP-005` | Generic whole, employees, stock, users | Needs more public-record, utility, or transport angles |
| `PCT-CP-006` | Generic whole, sales, users | Narrow spread |
| `PCT-CP-007` | Generic labels, branch stock, machine value, attendance | Fair spread, but structure repetition reduces contextual payoff |
| `PCT-CP-008` | Generic group split, company staff, passengers, inventory | Good raw context options; they need clearer differentiation |
| `PCT-CP-009` | Generic current-vs-target, expenses, stock, electricity use | Useful utility/business mix, but still very template-like |
| `PCT-CP-010` | Generic decrease-over-time, machine value, subscribers, stock | Acceptable spread, but no public-record angle |

### `PCT-005/question-language.en.json`

| CP ID | Dominant context families | Editorial note |
| --- | --- | --- |
| `PCT-CP-001` | District survey, bank branch, stock, internet users, sales | Strong file opening; best multi-context structure among the five files |
| `PCT-CP-002` | Warehouse audit, generic whole, stock, machine value, active users | Good spread, but one stem is still a plain generic duplicate shell |
| `PCT-CP-003` | Generic whole, store price, production, admissions | Useful variety, though still shell-based |
| `PCT-CP-004` | Generic whole, marked price, stock, attendance | Needs one more public or civic context |
| `PCT-CP-005` | Passenger record, festival sale, passengers, sales, wildlife census | Good spread; wording quality is the bigger issue here |
| `PCT-CP-006` | Lab calibration, fee table, technology index, price, revenue | Good editorial direction, but sign-coded wording weakens the contexts |
| `PCT-CP-007` | School record, railway passenger note, final bill, stock, admissions | Strong public-record and comparison potential |
| `PCT-CP-008` | Generic labels, branch stock, product price, school strength | Good raw spread, but still reads like the same comparison template |
| `PCT-CP-009` | Generic whole, sales register, stock, market price | Too many "changed successively by" shells despite decent contexts |
| `PCT-CP-010` | Generic whole, turnout, stock, revenue | Acceptable, but could use one additional civic or department record context |

## CPs That Need More Context Diversity

### Highest priority

- `PCT-001/PCT-CP-002`
- `PCT-001/PCT-CP-003`
- `PCT-001/PCT-CP-004`
- `PCT-001/PCT-CP-005`
- `PCT-001/PCT-CP-006`
- `PCT-003/PCT-CP-004`
- `PCT-004/PCT-CP-003`
- `PCT-004/PCT-CP-006`

### Secondary priority

- `PCT-002/PCT-CP-010`
- `PCT-003/PCT-CP-005`
- `PCT-003/PCT-CP-009`
- `PCT-004/PCT-CP-005`
- `PCT-005/PCT-CP-009`

## Recommended Context Enrichment Directions

1. Add more banking-style and branch-style records in `PCT-002` to `PCT-004`.
2. Add more Punjab-style public records: district office summaries, department notes, sanctioned strength lists, utility revision memos, and ward-level reports.
3. Reduce overreliance on salary, school, generic number, and old consumer-price shells.
4. Keep technology, transport, museum, wildlife, and utility contexts, but use them in more than one isolated stem each.
