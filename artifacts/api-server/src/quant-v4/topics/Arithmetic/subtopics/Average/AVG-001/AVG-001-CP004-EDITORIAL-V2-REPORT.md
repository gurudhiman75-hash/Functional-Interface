# AVG-001 CP-004 Editorial V2 Candidate

## Status

**IMPLEMENTED AS A REVIEW CANDIDATE — NOT YET WIRED INTO THE FROZEN ENGLISH RELEASE**

This wave upgrades all 85 `AVG-CP-004` question-language units while preserving the current `AVG-001-EN-v1` runtime until the complete chapter-wide v2 review is finished.

## Scope

- original CP-004 range: `AVG-QL-209` through `AVG-QL-273` — 65 QLs;
- gap-expansion CP-004 range: `AVG-QL-406` through `AVG-QL-425` — 20 QLs;
- nine solve modes;
- natural English competitive-exam stems;
- explicit semantic units on all applicable options;
- Indian currency grouping;
- exact four-tier explanations;
- all three wrong options named in distractor analysis;
- unchanged solver state, exact answer and mathematical fingerprint.

## Shared presentation layer

`foundation/presentation-quality-v2.ts` provides:

- semantic answer-unit detection;
- consistent option qualification;
- Indian-number and currency formatting;
- context-aware count labels;
- option-consistency checks.

This layer is intentionally chapter-generic so later CP waves can reuse it.

## CP-004 editorial layer

`foundation/cp004-editorial-v2.ts` provides:

- scenario-aware stem authorship for group averages, reverse counts, missing averages and speed families;
- explicit target wording;
- four-tier explanation rendering:
  1. key rule;
  2. substituted working;
  3. exam-speed shortcut;
  4. complete distractor analysis and final answer;
- release-candidate traceability for `AVG-001-EN-v2`;
- candidate-specific validation without altering the v1 mathematical package.

## Validation

The dedicated audit generates five deterministic instances for each of the 85 QLs, for 425 candidate packages. It checks:

- exact-answer and fingerprint preservation;
- natural and resolved stems;
- semantic units and four unique options;
- correct-index stability;
- exact four-tier explanations;
- analysis of every wrong option;
- removal of known generic filler;
- cross-QL rendered-stem uniqueness.

## Release boundary

The candidate is deliberately applied by the new audit/export path rather than the default `runAvg001Pipeline`. The existing `AVG-001-EN-v1` freeze therefore remains reproducible while CP-004 v2 undergoes human and Gemini review. Production wiring and a new release ID must occur only after the remaining CP waves pass the same editorial process.
