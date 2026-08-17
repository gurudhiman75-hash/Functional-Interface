# TMW-CP-006 Editorial Review

**Sample:** 22 QLs × 3 seeds = 66 generated candidate questions  
**Language:** English  
**Publication:** disabled

## Review outcome

The user review approved the mathematical, exam-style and distractor quality of `TMW-QL-106` through `TMW-QL-127`, while identifying that the learner-facing explanations needed a richer competitive-exam structure.

The generator now produces four explicit learning blocks for every candidate:

1. **Key Rule & Formula** — states the governing concept and formula before calculation;
2. **Step-by-Step Solution** — lists the generated givens and the complete standard method;
3. **Exam Speed Shortcut** — provides a solve-mode-specific fast method;
4. **Common Trap** — identifies an actual shuffled wrong option and explains its misconception contract.

A task-specific conclusion remains after the four blocks.

## Explanation upgrades applied

1. Added the familiar MDH/W coaching rule, generalised as `NDHE/W`, and defined `N`, `D`, `H`, `E` and `W` before substitution.
2. Added generated-data lines so students can see exactly which values belong to the original and revised arrangements.
3. Preserved the full formal solution before presenting any shortcut.
4. Added direct-ratio shortcuts for resource count, days, hours and efficiency.
5. Added worker-day shortcuts for added, removed and reconstructed workforce questions.
6. Added observed-progress and remaining-worker-day shortcuts for planned-versus-actual problems.
7. Added resource-hour percentage, inverse-workforce delay and overtime shortcuts.
8. Added area/volume-product shortcuts for dimensional work questions.
9. Added the remaining person-days method for food-stock questions.
10. Added the active-percentage shortcut for absenteeism.
11. Added a generated day-by-day AP workforce grid with running totals for batch-addition questions.
12. Added direct worker-day or machine-hour multiplication for equivalent resource-time questions.
13. Integrated misconception metadata into learner-facing trap explanations.
14. Made trap option labels dynamic, so `Option A/B/C/D` always matches the actual shuffled option rather than a fixed template.
15. Replaced the AP common-difference symbol `b` with the defined symbol `d`.
16. Replaced generic `resource-days` wording with the generated context unit such as `clerk-days` or `worker-days`.

## Shortcut policy

Shortcuts are included after the complete standard method. They may not replace conceptual derivation.

Each shortcut must be materially useful for its solve mode. A shortcut that merely repeats the formal equation without reducing cognitive or calculation load is not acceptable.

## Distractor policy

The common-trap block must:

- point to one distractor that exists in the current option array;
- use the option's actual shuffled letter and text;
- carry the same misconception ID as the option contract;
- never identify the correct option as a trap;
- prefer a solve-mode-specific misconception over a generic nearby-number error.

## MathJax delimiter decision

The project retains literal inline MathJax delimiters `\(...\)`.

The proposed `$...$` / `$$...$$` change was not adopted because the existing Quant V4 runtime, renderer and validators use `\(...\)` consistently. Introducing a second delimiter convention inside CP-006 would create cross-chapter inconsistency and weaken validation.

## Editorial contract

Every generated package must contain:

- one complete competitive-exam-style stem;
- four unique options with exactly one correct answer;
- a learner-facing governing rule;
- one governing formula in inline MathJax;
- explicit generated givens;
- visible numerical substitution and at least two standard worked steps;
- a meaningful exam-speed shortcut;
- an actual-option common-trap explanation;
- a contextual conclusion;
- no internal runtime or solver terminology.

## Final verdict

The English generator and upgraded 66-row review pack are approved at runtime-proof maturity. Question Studio routing, Question Bank ingestion, localisation, test assembly and public delivery remain separate future gates.
