# TMW-CP-009 Editorial Review

**Sample:** 18 QLs × 3 mathematically distinct states = 54 candidate questions  
**Language:** English  
**Publication:** disabled

## Learner contract

Every question contains:

1. a realistic municipal, school, hospital, dairy or irrigation tank setting;
2. an explicit initial state or physical capacity/flow state;
3. an explicit target: fill, empty, changed fraction, final level, direction or feasibility;
4. a plain-English signed-flow rule;
5. a literal inline MathJax formula;
6. at least three complete standard-working lines;
7. a solve-mode-specific 10-second shortcut;
8. an actual-option diagnostic trap without internal misconception IDs;
9. a contextual conclusion.

## Editorial decisions

- pipe labels are capitalised consistently in learner prose;
- inlets are positive and outlets/leaks negative only after the target state is declared;
- mixed-pipe stems state that all pipes remain open continuously;
- no delayed opening, closing, repair or periodic wording is admitted into CP-009;
- missing-pipe algebra uses clean signed substitution and avoids expressions such as `−a − −b`;
- partial-level solutions show the exact required level change rather than assuming a whole tank;
- physical-flow options use plausible unit and relation errors rather than extreme arbitrary numbers;
- litres-per-minute/hour conversions use Indian comma grouping where needed;
- reduced-efficiency and blockage explanations explicitly distinguish efficiency remaining from efficiency lost;
- feasibility questions calculate the boundary time before comparing it with the available window;
- diagnostic trap prose states how the wrong option arises and never commands the learner not to select it;
- integer time answers remain plain text for readability;
- every non-integer time is rendered through the Quant V4 canonical inline MathJax contract, for example `\(18\frac{1}{3}\;\text{hours}\)`;
- raw ASCII fractional-time forms such as `18 1/3 hours` and `55/3 hours` are rejected across stems, options, answers, explanations and conclusions;
- the generator retains literal `\(...\)` source delimiters because renderer transformation belongs to the presentation application, not to QL identity or solver output.

## Review corrections after the first green proof

The first passing implementation was not accepted unchanged. Manual and adversarial inspection corrected:

- lowercase pipe labels after sentence boundaries;
- an unnatural “opened with them” pronoun in missing-inlet stems;
- duplicated combined-rate equalities;
- double-negative display in missing-pipe equations;
- redundant partial-level equalities;
- oversized physical-time distractors;
- a blockage state in which several common misconceptions collapsed onto the correct 50% answer;
- trap labels that did not precisely describe the selected shuffled option;
- ASCII mixed-fraction time output in options and answers.

## Pedagogical method decision

The standard solution uses exact reciprocal rates because that method generalises safely to signed inlet–outlet systems. Positive-inlet questions additionally retain the `10-Second LCM Rate Method`, so learners receive both the canonical algebra and the familiar exam shortcut without duplicating the same derivation.

## Current verdict

The English generator is mathematically and editorially ready for final exact-head review. It remains a candidate generator only.
