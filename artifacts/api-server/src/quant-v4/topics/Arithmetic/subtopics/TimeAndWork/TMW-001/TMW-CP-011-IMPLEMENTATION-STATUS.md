# TMW-CP-011 Implementation Status

**Branch:** `feat/tmw-cp011`  
**Base:** approved CP-010 merge `b6f79c28f54bacc3e0b24b87fec45395b679540b`  
**Maturity:** English runtime-proof candidate  
**Publication:** disabled

## Implemented

- 19 need-based English QLs (`TMW-QL-193` through `TMW-QL-211`);
- arithmetic and geometric variable-rate totals, completion and inverses;
- threshold-switch total, completion, change-point, post-rate and rate-change tasks;
- varying-crew total and completion;
- combined variable-agent output;
- signed positive/negative variable output;
- explicit daily-rate table completion;
- deadline adjustment for a variable schedule;
- exact rational sequence and terminal-partial-day engine;
- independent explicit accumulation and bounded inverse verification;
- misconception-labelled four-option construction;
- simplified teacher-style English presentation;
- 57-row distinct-state review export;
- focused proof and strengthened editorial audit.

## Mathematical validation baseline

- 19 QLs × 50 seeds = 950 deterministic runtime cases — PASS;
- 412 distinct stems;
- all four answer positions for every QL;
- six context families;
- geometric multipliers `1/2`, `3/2` and `2`;
- arithmetic increase and decrease states;
- threshold learning and fatigue states;
- positive and negative recovered threshold changes;
- 19 QLs × 12 seeds = 228 structural/editorial cases — PASS;
- 57 review rows with three distinct mathematical states per QL — PASS;
- fractional discrete targets/options: 0;
- answer/unknown leakage into givens: 0;
- invalid packages, option failures, MathJax failures, internal-ID leaks and cross-QL stem collisions: 0.

## Hosted-review fraction correction

The first hosted review artefact exposed three fractional `TMW-QL-196` distractor labels whose `\frac` expressions were outside canonical inline MathJax. The source now formats every fractional rate-change value through `\(...\)` and rejects raw `\frac` outside valid MathJax in both runtime and corpus validation.

## Teacher-language refinement

Following the 9.5/10 editorial audit, the learner package was revised without changing any numerical state, answer key, solve mode or QL ownership.

- all concept openings use a supportive “Let’s …” teacher voice;
- academic phrases such as “arithmetic progression”, “geometric progression”, “sum identity” and “inverse relation” are rejected;
- direct AP and multiplier questions display daily outputs and the final sum;
- inverse questions show each doubled total, change product, difference, denominator and final division separately;
- completion questions show complete-day output, remaining work, finishing-day output, final-day fraction and total time;
- threshold, crew, combined and signed-output questions show every phase or daily product explicitly;
- every standard solution contains at least four purposeful lines;
- every trap begins with “Don’t fall for Option X (…)!” and gives plain-English diagnostic advice;
- misconception IDs remain reviewer-only metadata.

Permanent runtime and corpus guards enforce teacher voice, expanded working, direct trap advice, valid MathJax and absence of the removed jargon.

## Evidence policy

The immutable exact tested head, workflow run, artefact ID and digest are recorded in PR #302 after CI completes. They are intentionally not embedded here because updating this file would create a new branch head and immediately make an embedded self-SHA stale.

## Current gate

All temporary staging and patch workflows have been removed. Question Studio routing, Question Bank writes, localisation, test assembly and public delivery remain disabled. PR #302 remains draft and unmerged pending exact-head evidence, hosted-artifact review and user approval of the simplified 57-question pack.
