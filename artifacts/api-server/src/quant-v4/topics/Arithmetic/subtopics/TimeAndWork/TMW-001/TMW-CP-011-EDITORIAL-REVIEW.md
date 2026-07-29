# TMW-CP-011 Editorial Review

**Sample:** 19 QLs × 3 mathematically distinct states = 57 candidate questions  
**Language:** English  
**Publication:** disabled

## Learner contract

Every question provides:

1. a realistic Indian competitive-exam workplace context;
2. an explicit productivity rule or day-wise schedule;
3. a precise output, time, inverse value or adjustment target;
4. the governing sequence or phase formula in inline MathJax;
5. at least four purposeful standard-working lines;
6. a solve-specific 10-second shortcut;
7. direct, option-specific trap advice;
8. a contextual conclusion.

## Editorial decisions

- discrete files, cartons, components, booklets, crates and sections remain integral in stems and options;
- non-integer completion times use canonical MathJax mixed fractions;
- arithmetic daily change is worded as an increase/decrease **each day**;
- one-time threshold rate change is worded as an increase/decrease **per day**;
- zero change is rendered as “remains unchanged”;
- first-day output is displayed as output, not incorrectly as a per-day answer;
- inverse unknowns never appear inside the “Given data” block;
- direct-output answers never leak into the givens;
- two-person and signed-output stems identify both changing schedules naturally;
- crew completion explicitly multiplies each day’s crew by per-worker output before accumulating;
- threshold totals weight each rate by its own duration;
- wrong options are tied to exact misconceptions, not nearby-number filler;
- learner prose never exposes misconception IDs or internal QL metadata.

## Corrections after the first green prototype

The first 16-QL implementation passed mathematically but was not accepted unchanged. Manual review corrected:

- missing direct threshold-output, varying-crew completion and threshold rate-change contracts;
- fractional targets such as partial files or crates;
- fractional distractors for discrete output answers;
- first-day output incorrectly formatted as a rate;
- inverse answers leaked into the givens;
- “increases by 0” and mechanical “starts at … changes by” wording;
- generic or inaccurate misconception labels;
- arithmetic-series distractor language incorrectly applied to phase totals;
- full-schedule average-rate wording in early-completion questions;
- ambiguity between a new rate and the change in that rate.

## Explanation-simplification audit

The mathematically approved 57-question corpus received a second editorial pass for SSC, Banking and Punjab-exam readability.

- learner openings now begin with a supportive “Let’s …” instruction;
- textbook-heavy phrases such as “arithmetic progression”, “geometric progression”, “sum identity” and “inverse relation” are rejected from learner text;
- arithmetic questions show the daily changes, later-day output and total calculation explicitly;
- short multiplier schedules display each day’s output before adding the total;
- completion questions separate complete-day work, remaining work, the next day’s rate, the required part of that day and total time;
- threshold and crew questions show each phase or worker-day product separately;
- inverse questions say “work backward from the total” and expose every intermediate product or division;
- every diagnostic warning begins with “Don’t fall for Option X (…)!” and then explains the exact mistake in plain English;
- misconception IDs remain reviewer-only metadata.

Permanent runtime and corpus checks require teacher voice, at least four standard-working lines, direct trap advice, complete day/phase working and absence of the removed jargon.

## Current verdict

The revised English generator is ready for exact-head CI and hosted 57-question review. It remains a candidate generator only.
