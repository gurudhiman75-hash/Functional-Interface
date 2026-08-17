# TMW-CP-007 Implementation Status

**Branch:** `feat/tmw-cp007`  
**Base:** approved CP-006 merge `0dd90420c48ef4ca9c62ce9a0f70b54780b75eff`  
**Maturity:** English runtime-proof candidate  
**Publication:** disabled

## Implemented

- 16 current English-owned QLs (`TMW-QL-128`–`TMW-QL-143`);
- exact weighted-rate engine `r = Σ n_k e_k`;
- worker and machine category contexts;
- two- and three-category efficiency equivalence;
- mixed-group time, rate and output;
- equivalent and replacement category counts;
- unknown category count for a target time;
- two-equation crew-composition reconstruction;
- exact three-equation category-rate reconstruction;
- completion after category replacement;
- mixed contribution expressed as standard resource-time;
- minimum positive-integer composition search;
- unknown category solo-time recovery;
- weighted contribution fraction;
- heterogeneous group comparison;
- fixed-total integer composition;
- canonical solver plus independent verification;
- misconception-labelled four-option packages;
- modular explanations with key rule, givens, standard method, shortcut and actual-option trap;
- 48-row structured review export.

## Local proof completed

- deterministic runtime proof: 16 QLs × 50 seeds = 800 cases — PASS;
- structural/editorial audit: 16 QLs × 12 seeds = 192 cases — PASS;
- generated review export: 48 rows — PASS;
- distinct rendered stems: 223;
- all four correct-answer positions represented;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed or unwrapped MathJax: 0;
- option failures: 0;
- non-integral discrete answers: 0;
- missing givens or shortcuts: 0;
- trap-option mapping failures: 0;
- generic fallback traps: 0;
- collapsed LaTeX: 0;
- output-unit mismatches: 0;
- zero-coefficient equation terms: 0;
- person-only terminology in machine contexts: 0;
- machine learner-prose “crew” hits: 0;
- cross-QL exact or normalised stem collisions: 0.

## Next gate

Open a draft PR, run the repository's exact-head workflow, inspect the generated 48-question evidence pack and keep the PR unmerged pending user approval.

## Workflow boundary

No Question Studio route, Question Bank write, test assembly, localisation or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.
