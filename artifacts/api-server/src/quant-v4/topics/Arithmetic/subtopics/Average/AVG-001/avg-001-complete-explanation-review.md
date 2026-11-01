# Average: complete learner explanations

Date: 2026-11-01

## Problem and correction

The Question Studio adapter returned historical editorial explanations that sometimes replaced actual working with solver summaries such as `New average = 32` or a general group-average formula. Some earlier cleanup passes also removed supporting lines. English output exposed distractor strategy identifiers; localized output could misdescribe a child joining after several years as a newborn.

Question Studio now applies a complete, directly authored explanation after those historical release passes. All 45 solution types have explicit working in English, Hindi and Punjabi. The explanation shows the preparation, arithmetic and result without option analysis, artificial shortcut sections or discarded intermediate calculations. The existing four-string transport is retained; the working string can contain as many paragraphs as the solution needs.

The explanation derives its result from the parameters using exact rational arithmetic and rejects a disagreement with either the solver or independent verifier. Superseded explanation-schema validations are retired rather than carried forward as claims about the rewritten text.

This patch preserves stems, options, answer keys, mathematical fingerprints and release state. It affects newly generated Question Studio previews; it does not rewrite questions already saved in the bank. Older direct editorial/review exports retain their historical presentation.

## Representative repairs

| Family | Working now included |
| --- | --- |
| Adding a number | Original total, added value, increased count, final division |
| Age after elapsed years | Increase the original group's average age before changing membership |
| Replacement | Original total, replacement change, unchanged count |
| Required innings score | Existing runs, target runs, difference needed in the next innings |
| Combined groups | Every group total, combined total, combined count, final division |
| Missing group size | Equation from the known totals, rearrangement, final division |
| Equal-distance speed | Individual times and total distance divided by total time |
| Multiple recording errors | Each signed correction, net total correction, effect on average |

## Verification

`avg-001-complete-explanation-audit.ts` passed 3,825 generated cases: 425 QLs × 3 languages × 3 deterministic seeds, covering all 45 solution types. It compares the entire non-editorial package to the previous runtime output, checks native-language prose, balanced math delimiters, deterministic/idempotent rewriting and removal of internal distractor/shortcut text. Targeted regressions cover missing arithmetic, a ten-year-old child incorrectly called a newborn, group aggregation, missing counts, unitless numbers and cricket runs. Deliberately corrupted solver and independent-verifier answers are both rejected.

The audit was executed locally with Node 24's TypeScript stripping and extension/JSON import hooks against the downloaded Average sources. A full repository build and live browser verification were not run in this focused checkout.
