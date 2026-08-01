# SER-001 Simple Explanation Blueprint — V3

This rule applies to every existing and future checkpoint in `SER-001 — Series`.
It changes only how a solution is shown to the learner. It must not change the series, options, answer, correct option, mathematical identity, ownership or lifecycle locks.

The executable implementation is `ser-v3-natural-authority.ts`.

## Required learner format

Every review question must show exactly these four sections:

1. `📌 Rule`
2. `📝 Solution`
3. `⚡ Quick Method`
4. `⚠️ Common Mistake`

These names are intentionally simple. Do not use headings such as `Core Pattern`, `Step-by-Step Derivation` or `Common Student Trap`.

## Option labels

- Always show the four choices as `1`, `2`, `3`, `4`.
- Show the answer with the same numeric label, for example `Answer: 3. K`.
- Never use `A`, `B`, `C`, `D` as option labels in Series reviews. In alphabet questions they can be confused with the answer letters themselves.

## Plain-language rule

Write as a teacher speaking to a student preparing for an exam.
Prefer ordinary words:

- `rule` instead of `governing pattern`;
- `move backward` instead of `use the inverse`;
- `wrong term` instead of `anomaly`;
- `odd-position row` and `even-position row` instead of `lanes`;
- `shorter vowel/consonant list` instead of `subset`;
- `wrap after Z` or `wrap before A` instead of `cyclic normalisation`.

Unnecessary learner-facing words such as `authority`, `canonical`, `cyclic`, `derivation`, `governing`, `inverse`, `lane`, `normalisation`, `phase`, `recurrence` and `subset` are blocked by the chapter-wide audit.

Standard mathematical names such as prime number, factorial, square, cube and second difference may be used when they are the actual concept being taught, but the surrounding sentence must remain simple.

## Task rules

### Previous-term questions

- Find the forward rule only from the known terms.
- Explain that an earlier term needs the rule to be reversed.
- Work out the answer only after this is clear.
- Check the found term by moving forward once.

### Wrong-term questions

- First write the correct series.
- Then compare it with the displayed series.
- Clearly state which displayed term is wrong and what should replace it.

## Letter-series rules

- Show useful alphabet positions such as `A(1)`, `Q(17)` and `Z(26)`.
- When a jump crosses Z, say `Wrap after Z` and show the subtraction from 26.
- When a backward jump crosses A, say `Wrap before A` and show the addition of 26.
- For vowels or consonants, write the shorter allowed list and count only inside that list.
- For alternating questions, put odd-position terms in one row and even-position terms in another. Compare terms only inside the same row.

## Applicability

This contract is mandatory for `SER-CP-001` through `SER-CP-006` and every later `SER-CP-*` checkpoint.

## Review gate

A checkpoint review pack must use the shared V3 authority renderer. CP-007 remains blocked until the refreshed CP-006 review pack is explicitly approved.
