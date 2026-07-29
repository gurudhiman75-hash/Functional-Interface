# ExamTree Mock-Test Content Quality & Editorial Production Authority

## Status

```text
Authority:          APPROVED
Applies to:         Quantitative Aptitude and Logical Reasoning
Languages:          English, Hindi, Punjabi
Target exams:       SSC, Banking, PSSSB, PPSC, Punjab Police
Effective from:     MEN-002 CP-007 editorial hardening
Publication effect: mandatory production gate
```

This document is the project-wide authority for mock-test question quality, editorial standards, localisation, review exports and production-release approval.

It supplements chapter-specific mathematical blueprints. A mathematically correct package must still fail production approval when it violates this authority.

## 1. Four-tier teacher pedagogy

Every reviewed explanation must contain four student-facing tiers:

1. **Core Concept & Formula**
2. **Step-by-Step Solution**
3. **Exam Speed Shortcut**
4. **Common Traps & Distractor Analysis**

### Explanation quality rules

- Explain why the governing relation applies to the generated state.
- Show all material intermediate working.
- Keep formula, substitution and simplification visually distinct.
- End the worked solution with the contextual answer and correct unit.
- Explain all three displayed wrong options after deterministic shuffling.
- Name the displayed option letter and value.
- State the actual wrong calculation that produces each wrong value.
- State the correct operation that should replace it.

### Boilerplate prohibition

The following are production failures:

- generic advice repeated across unrelated questions;
- shortcuts that only restate the standard solution;
- warnings such as “do not choose Option B” without a worked misconception;
- taxonomy names or internal strategy identifiers in learner text;
- copy-pasted sentences whose numbers do not match the current state;
- compressed single-line formula dumps where the reasoning requires intermediate work.

Every shortcut and trap warning must be state-specific and numerically grounded.

## 2. Authentic question stems

Question stems must sound like competitive-exam content written by a human editor.

Required:

- concise, realistic Indian examination or everyday context;
- complete grammatical sentences;
- active narrative phrasing;
- shape/object assumptions consistent with the mathematics;
- no duplicated instruction phrases;
- no telegraphic generator language;
- no internal metadata or template vocabulary.

Contexts must not introduce irrelevant narrative or imply a different open, closed, hollow, exposed or orientation state.

## 3. Options and distractors

Every multiple-choice package must contain:

- exactly four options;
- four unique exact values after simplification and unit conversion;
- exactly one correct option;
- a deterministic answer-position rotation;
- matching answer semantics and units on every option;
- positive and physically admissible values unless signed change is explicitly requested;
- whole-number options for object counts such as cubes, blocks, bricks, cuts and revolutions;
- misconception-derived distractors only.

Generic numerical offsets and fallback distractors are prohibited.

## 4. Mathematical and solver authority

Every generated package requires:

- one canonical mathematical state;
- an exact canonical solver;
- a materially independent verifier;
- option/correct-index agreement;
- exact dimensional-unit validation;
- no floating-point equality as answer authority;
- explicit approximation policy where approximation is requested;
- deterministic regeneration from package identity and seed.

A package must fail production when the correct option value, correct index, displayed answer and verifier result do not all agree.

## 5. MathJax and typography

### Inline and display mathematics

- Use inline MathJax for variables and compact expressions.
- Use centred display MathJax for worked equations.
- Use `\\frac{a}{b}` for fractions in display mathematics.
- Do not emit raw division forms such as `22/7` inside display equations.
- Do not emit Unicode fraction glyphs such as `½` or `¼`.
- Do not emit Unicode squared/cubed glyphs such as `²` or `³` in learner-facing output.
- Use `\\text{...}` for units inside MathJax.
- Reject malformed commands, bare `sqrt{`, control characters and hidden escape artefacts.

### Indian currency

All Indian mock-test content must use the rupee symbol.

Required examples:

```text
₹12,000
₹2,400
₹4,32,000
₹25 per square metre
₹180 per cubic metre
```

Rules:

- Reject foreign currency symbols such as `£`, `$` as currency, `€` and `¥` in learner-facing Indian exam content.
- Apply Indian number-system grouping to integral rupee values.
- Place `₹` before the amount.
- Use natural prose for rates or correctly rendered MathJax units.
- Do not confuse MathJax `$...$` delimiters with US-dollar currency leakage during automated audits.

## 6. Hindi localisation

Hindi output must:

- read as natural competitive-exam Hindi rather than literal machine translation;
- preserve mathematical meaning and answer parity with English;
- use active narrative verbs;
- contain no untranslated English explanation blocks;
- use grammatically correct gender and number agreement;
- standardise ordinal agreement, for example `24वाँ` where masculine singular is required;
- preserve MathJax, units, option values and correct index exactly.

## 7. Punjabi localisation

Punjabi output must:

- use natural Gurmukhi suitable for PSSSB, PPSC and Punjab Police examinations;
- use active narrative phrases such as `ਉਹ ਸੱਜੇ ਪਾਸੇ 90° ਮੁੜਦੀ ਹੈ` rather than robotic infinitive lists;
- avoid machine terms such as `ਹੁਕਮ` where an instruction, move or action is intended;
- contain no untranslated English explanation blocks;
- use grammatically correct gender and number agreement;
- standardise ordinal agreement, for example `24ਵਾਂ` where masculine singular is required;
- preserve mathematical meaning, values, units, option order and correct-index parity.

## 8. Language-leak detection

Hindi and Punjabi builds must fail when learner-facing blocks contain unexpected English prose outside approved mathematical symbols, proper nouns and standard abbreviations.

Audits must inspect:

- question stem;
- every option;
- all four explanation tiers;
- diagram labels;
- table/grid labels;
- captions and accessibility descriptions.

Raw JSON, unescaped template output and internal IDs are production failures in all languages.

## 9. Visual and diagram standards

Reasoning diagrams and grids must be deterministic and derived from the same canonical state as the solver.

Required where the visual materially improves reasoning:

- Direction Sense paths and turns;
- Blood Relation family structures;
- Coding–Decoding grids or mappings;
- spatial Mensuration states;
- open/closed/hollow solids;
- exposed-face and cutting arrangements.

Use clean SVG or stable Markdown/ASCII structures appropriate to the delivery surface. Hindi and Punjabi diagrams must use matching localised labels. Decorative visuals must not imply false equality, orientation or hidden dimensions.

## 10. Production release gates

A chapter or checkpoint is not production-approved until all relevant gates pass.

### Critical

- canonical solver and independent verifier agreement;
- correct option and index agreement;
- four unique options and one correct option;
- deterministic regeneration;
- lifecycle/publication lock correctness.

### High

- authentic stem quality;
- unit and answer-semantic parity;
- state-specific distractor explanations;
- Indian currency formatting;
- no language leaks;
- natural Hindi and Punjabi phrasing;
- diagram/state parity.

### Medium

- complete four-tier explanations;
- sufficient intermediate working;
- state-specific shortcut quality;
- typography and MathJax cleanliness;
- review-export readability.

## 11. Review-pack contract

Human-review exports must contain:

- package/QL identity and seed;
- language;
- difficulty;
- stem;
- diagram where required;
- four shuffled options;
- reviewer-only correct answer;
- four-tier explanation;
- exact state or reproducibility evidence;
- independent-verifier result;
- lifecycle/publication flags;
- provisional retain/merge/split/reassign status during discovery.

HTML review files must load MathJax correctly and preserve explanation whitespace. CSV/JSON/Markdown exports must remain UTF-8 clean.

## 12. Approval checklist

| Domain | Required state | Production failure |
|---|---|---|
| Mathematical engine | exact solver and independent verifier agree | mismatch in answer, index or reconstruction |
| Question stem | authentic and grammatically complete | robotic, telegraphic or duplicated wording |
| Options | four exact, unique, unit-complete choices | raw integers, collisions or generic fallback values |
| Explanation | complete four-tier teacher pedagogy | boilerplate or formula-only answer |
| MathJax | fractions, powers, roots and units render cleanly | raw slash fractions, Unicode glyphs or malformed escapes |
| Currency | rupee with Indian grouping | foreign currency symbol or Western grouping |
| Hindi | natural, complete and parity-locked | English leak or agreement error |
| Punjabi | natural Gurmukhi and parity-locked | machine phrasing, `ਹੁਕਮ` misuse or English leak |
| Visuals | canonical-state parity | inconsistent values, labels or orientation |
| Lifecycle | explicit review and publication state | accidental Question Bank, test or public eligibility |

## 13. Enforcement sequence

For every chapter:

1. prove mathematical validity;
2. generate deterministic review evidence;
3. run structural and MathJax audits;
4. run state-specific explanation and distractor audits;
5. run Indian currency audit;
6. run English authenticity audit;
7. localise only after English ownership freezes;
8. run Hindi and Punjabi language-leak and naturalness audits;
9. conduct human review;
10. publish only through a separate explicit approval.

## 14. Immediate adoption

This authority applies immediately to:

- MEN-CP-007 review regeneration and editorial hardening;
- MEN-CP-008 and all later MEN-002 discovery;
- all active Quant V4 chapter pipelines;
- all Reasoning V1 chapter pipelines;
- future Question Studio review and publication operations.
