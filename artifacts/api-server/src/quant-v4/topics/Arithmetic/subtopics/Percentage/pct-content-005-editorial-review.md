# PCT-CONTENT-005 Editorial Review

## Files modified

- PCT-001/question-language.en.json
- PCT-002/question-language.en.json
- PCT-003/question-language.en.json
- PCT-004/question-language.en.json
- PCT-005/question-language.en.json

## Examples of improved wording

- "In a competitive exam setup, A is 40% of B..." -> "If B = {baseValue} and A is {percentageRate}% of B, find A."
- "A hospital report says 25% of the whole are part..." -> "In a school, {knownRate}% of the {wholeLabel} are {partLabel}. If their number is {knownValue}, find the total number of {wholeLabel}."
- "A committee report says the wholeLabel rose..." -> "A {wholeLabel} first increased by {rate1}% and then by {rate2}%. Find the net percentage change."
- "A spreadsheet needs one multiplier..." -> "What multiplier should be used for a {increaseRate}% increase?"

## Removed awkward wording

- Removed all leading meta wrappers such as:
  - "In a competitive exam setup,"
  - "If the following conditions hold:"
  - "Based on given parameters,"
- Replaced report / memo / note phrasing where it sounded editorial rather than exam-like.
- Simplified fraction-conversion prompts in PCT-001 to short, direct exam language.

## Repeated sentence patterns eliminated

- Meta-prefixed duplicates that differed only by boilerplate.
- Overuse of "Determine..." in places where "Find..." or "What is..." reads more naturally.
- Artificial corporate wrappers such as "committee report", "allocation memo", "spreadsheet needs", and similar phrases.

## Remaining weak areas

- PCT-001 still has high raw family count and legacy duplication pressure, even after the language cleanup.
- Some advanced PCT-001 contexts are now cleaner, but the chapter still needs a later structural enrichment pass if we want strong diversity rather than cleaner repetition.
- PCT-005 still depends heavily on successive-change structures by design; wording is improved, but content diversity will still be limited until a later expansion pass.

## Recommendations before freezing Percentage

1. Re-run the English human-review CSV generation after this editorial pass.
2. Re-run duplicate and coverage audits to measure whether cleaner wording also improves perceived diversity.
3. Prioritise a later structural enrichment pass for PCT-001 and PCT-005, since editorial cleanup alone cannot solve all duplication pressure.
4. Keep future English additions anchored to familiar SSC / Banking contexts such as students, salary, marks, population, price, attendance, production, sales, stock, passengers, rainfall, voters, milk, and water.
