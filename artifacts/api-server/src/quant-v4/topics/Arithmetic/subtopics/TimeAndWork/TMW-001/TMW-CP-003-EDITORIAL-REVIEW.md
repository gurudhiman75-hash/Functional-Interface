# TMW-CP-003 Editorial Review

**Review stage:** user review correction cycle  
**Sample:** 23 QLs × 3 seeds = 69 generated candidate questions

## Corrections made during initial review

1. Corrected future-tense output wording such as “will A processes/marks” to natural base-verb forms.
2. Prevented fractional distractors for countable physical outputs.
3. Replaced generic percentage conclusions with comparison-specific conclusions naming the correct workers and base.
4. Separated explanations for percentages derived from times from explanations that begin with a stated efficiency percentage.
5. Simplified repeated ratio expressions such as `4:5=4:5`.
6. Rewrote the successive-ratio trace to show the actual multiplicative bridge from A:B and B:C to A:C.
7. Added a control-character audit after detecting and removing a malformed LaTeX escape in a provisional trace.
8. Preserved explicit percentage bases for “more efficient,” “less efficient,” “less time,” and “more time.”
9. Kept direct uniform-rate changes in CP-001, simultaneous rate aggregation in CP-002, staged participation in CP-004, and workforce/category equivalence in CP-006/007.

## User feedback correction

The first review pack overused the word and context pattern “assignment”. The mathematical content and explanations were accepted, but the context language needed greater variety.

Corrections:

- expanded the context pool from 5 to 12 coherent exam-style settings;
- replaced repeated assignment contexts with customer-record batches, equipment overhauls, loan-application sets, printing orders, road-marking projects, packaging orders, inspection batches, manuscript typing, school painting, inventory counts, field surveys and electronics assembly;
- replaced generic “same assignment” wording with “same work”, “equal workloads” or a direct job reference;
- preserved all QL ownership, parameters, formulas, correct answers and explanation mathematics;
- added a structural audit requiring at least 10 distinct context phrases and 10 distinct actor types across the focused audit batch;
- added a zero-tolerance audit for the word `assignment` in rendered CP-003 stems.

## Validation after correction

- runtime head: `e44a6bd867435a6b290a09a0e27eaad2745f7afa`;
- workflow run: `30193806374` — PASS;
- evidence artifact: `8629457236`;
- 23 QLs × 50 proof seeds = 1,150 cases;
- 23 QLs × 12 audit seeds = 276 cases;
- assignment-word hits: 0;
- context diversity threshold: PASS.

## Review verdict

The revised 69-row export is ready for user confirmation. It is not approved for Question Bank storage or student delivery until the revised generated-question pack is accepted.
