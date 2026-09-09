# Quant V4 Explanation Quality Policy V2

Status: **P1 audit authority**

This policy supersedes any interpretation that a good Quant explanation must contain a fixed number of sections, steps, mathematical lines, shortcuts, alternate methods, or trap callouts.

## Learner-facing rule

A Quant explanation must read as **one simple, coherent solution to the actual question**.

The explanation should contain only what helps the learner understand the solution:

1. state the key relation or idea when it is not already obvious;
2. show the actual working using the values or conditions from the question;
3. end with the required result in the correct unit or answer form.

A direct question may therefore need only a short working and conclusion. A harder question may need more lines. Difficulty does not create an artificial explanation-length quota.

## What is not mandatory

The following are **optional**, not compulsory sections:

- formula heading;
- substitution heading;
- shortcut / fast method;
- alternate method;
- trap / common mistake;
- a fixed four-step, five-step, or seven-step structure.

A shortcut is shown only when it is materially faster or clearer than the standard working. A trap is shown only when it explains a real misconception or an actual distractor. Empty pedagogical padding is a defect.

## Quality requirements

Every explanation must be:

- mathematically correct and consistent with the canonical state;
- question-specific rather than generic wrapper prose;
- concise enough for exam preparation;
- complete enough that the learner can follow the calculation or inference;
- consistent with the stem's entities, values, units, and requested quantity;
- free from internal IDs, task names, generator terminology, and editorial metadata;
- free from fabricated numbers or intermediate facts;
- naturally worded in the learner's language.

Visual or tabular working should be used when it communicates the reasoning more clearly than prose, for example in alligation, work-rate tables, changing-rate interest ledgers, geometry, mensuration, and DI.

## Semantic-duplication audit

Exact-string uniqueness is not accepted as proof of explanation diversity.

The P1 audit measures four different things:

1. **Exact duplication** — identical learner explanations.
2. **Semantic skeleton duplication** — explanations that become the same after values and superficial formatting are normalised.
3. **Structural duplication** — repeated prose/math/conclusion layouts. Structural repetition alone is diagnostic, not automatically a failure; some mathematical families naturally share a compact structure.
4. **Question-specific evidence** — the explanation must visibly depend on the actual stem/answer through values, entities, conditions, or family-specific relations.

The audit is intended to catch cases such as three generic wrappers that differ only by phrases like `Substitute the values`, `Insert the numbers`, or `Using the figures above`.

## Cross-chapter acceptance rule

A chapter does not pass explanation quality merely because every generated string is technically unique. Review must ask whether a learner sees genuinely question-specific reasoning and whether a large mixed Quant batch becomes repetitive or padded.

This policy applies to new Quant V4 work immediately. Legacy chapters are remediated through explicit checkpoints so mathematical/runtime lineage is preserved.