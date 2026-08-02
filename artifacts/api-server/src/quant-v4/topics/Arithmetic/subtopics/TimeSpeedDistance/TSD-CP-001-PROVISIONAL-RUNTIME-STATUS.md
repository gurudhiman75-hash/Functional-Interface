# TSD-CP-001 Provisional Runtime — Implementation Status

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Maturity:** `PROVISIONAL_ANSWER_UNIT_EDGE_AUDITED_ENGLISH_REVIEW_READY`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Publication eligibility:** disabled

## Current authority result

The original 32 design candidates remain dispositioned into 25 provisional mathematical authorities. No permanent `TSD-QL-*` ID has been allocated.

Current learner boundary:

- provisional mathematical authorities: 25;
- learner-facing exam modes: 23;
- internal QA authorities: 2;
- learner-facing review questions: 69, three distinct states per learner mode.

The only non-learner modes are:

- `classifyUniformMotionState`;
- `verifyUniformMotionClaim`.

They remain useful for solver and verifier QA but are not presented as SSC, banking or Punjab-state exam questions.

## Source-saturation result

The source and previous-exam-pattern pass confirmed and implemented:

- direct distance, speed and time in ordinary SI units;
- speed supplied in km/h before a metre/second calculation;
- decimal and fractional speed, distance and time states;
- minutes-plus-seconds and hours-plus-minutes durations;
- metres and compound time with the answer requested in km/h;
- kilometres and compound time with the answer requested in m/min;
- mixed-unit answers in km/h, m/s and m/min;
- same-speed distance/time proportionality;
- same-distance speed/time inverse proportionality;
- equal-time, equal-distance and component-ratio comparisons;
- pace and deadline forms;
- seconds/km pace converted to m/s;
- m/s speed converted to seconds/km pace;
- pace-derived distance requested in metres;
- millimetre-scale distance conversion;
- day-scale time conversion.

The three proportionality modes were restored after replacing their earlier redundant-given generators with genuine exam forms:

- `distanceByProportion` — known distance and time, new time, same speed;
- `timeByProportion` — known distance and time, new distance, same speed;
- `speedByProportion` — known speed and time, new time, same distance.

## Four-tier editorial upgrade

The senior editorial audit reviewed an earlier 60-question / 20-mode artifact. Its mathematical verdict remained valid, while the current runtime had already expanded to 69 questions / 23 learner modes. The applicable editorial findings were implemented across the current corpus.

Every learner question now carries canonical production fields for:

1. `keyRule` — `📌 Main Rule`;
2. `stepByStepSolution` — `📝 Step-by-Step Solution`;
3. `examSpeedShortcut` — `⚡ Exam Speed Trick`;
4. `optionAnalysis` — `⚠️ Common Traps & Option Analysis` for A, B, C and D.

Additional corrections:

- MathJax-ready `stemMathJax` is stored alongside the plain stem;
- equations and quantity-unit pairs are emitted with balanced MathJax delimiters;
- internal misconception IDs remain machine-readable but are not shown in learner reasons;
- direct-formula distractors explain the actual mistaken speed, time or distance;
- deadline distractors reproduce exact one-hour-longer and one-hour-shorter calculations;
- deadline state pairs are curated so all displayed answers remain exam-friendly exact values;
- direct and deadline stems use deterministic, restrained variation rather than one repeated template;
- legacy compact explanation fields remain temporarily available for backward compatibility.

## Human-explanation and trivial-question remediation

Learner-facing distance questions no longer contain plain matching-unit multiplication such as `12 m/s × 75 seconds`. Each exported distance state requires a genuine unit decision before multiplication.

The three proportionality authorities now reconstruct the original journey explicitly:

- original speed before solving new distance or time;
- original distance before solving new speed.

The review contract requires:

- at least six learner-facing solution lines per row;
- at least nine lines for proportionality and clock-boundary rows;
- three distinct teaching openings per learner authority;
- value-specific explanations for all four options;
- no concise or generic engine-written explanation.

## Clock-boundary saturation

No new solve mode was added. Noon, midnight and next-day cases remain representation states inside:

- `arrivalClockTime`;
- `departureClockTime`;
- `elapsedClockTime`.

Each authority now exports exactly three boundary states:

1. exact noon — `10:45 AM + 75 minutes = 12:00 PM`;
2. exact midnight — `10:30 PM + 90 minutes = 12:00 AM next day`;
3. later next day — `11:20 PM + 185 minutes = 2:25 AM next day`.

The nine clock rows teach:

- moving forward for arrival and backward for departure;
- splitting durations into complete hours and remaining minutes;
- the difference between `12:00 PM` noon and `12:00 AM` midnight;
- crossing midnight and preserving the `next day` label;
- splitting elapsed time at midnight;
- zero additional time after midnight when arrival is exactly `12:00 AM`.

Clock options now use boundary-faithful mistakes:

- correct-looking clock digits with the wrong AM/PM;
- correct-looking clock digits assigned to the wrong calendar day;
- one hour omitted or added in an elapsed interval;
- an invented extra 30 minutes that do not occur in the journey.

## Equivalent-speed representation saturation

Equivalent-speed option sets are implemented as a representation variant of:

- provisional authority: `TSD-CP001-DISC-004`;
- solve mode: `convertSpeedUnit`;
- governing rule: `UNIT_CONVERSION`.

No new mathematical authority was created.

The complete review keeps three speed-conversion rows:

- two ordinary scalar conversion questions;
- one equivalent-speed equality question.

The equality row deliberately includes:

`25 m/s = 90 km/h = 1500 m/min`

Its solution must show:

- conversion to m/s;
- `m/s × 18/5 = km/h`;
- `m/s × 60 = m/min`;
- the final three-unit equality.

Its distractors diagnose:

- a wrong km/h factor;
- multiplying the km/h number by `60` as though it were already m/s;
- copying one numeric value into every unit without conversion.

## Answer-unit and edge audit

Natural answer-unit edges are implemented as representation states inside existing authorities. No new mathematical authority was created.

The 69-row review now deterministically includes:

- `speedFromMixedUnits`: one km/h row, one m/s row and one m/min row;
- `speedFromPace`: two km/h rows and one seconds/km-to-m/s row;
- `paceFromSpeed`: two minutes/km rows and one m/s-to-seconds/km row;
- `distanceFromPaceAndTime`: two kilometre rows and one metre row;
- `convertDistanceUnit`: kilometre, metre-centimetre and millimetre scales;
- `convertTimeUnit`: hour-minute, second-hour and minute-day scales.

The unit-specific teaching routes are explicit:

- `m/s = 1000 metres ÷ seconds per kilometre`;
- `seconds/km = 1000 metres ÷ speed in m/s`;
- pace-derived kilometres are multiplied by `1000` when metres are requested.

A dedicated pace option package prevents minute-based or kilometre-based generic traps from leaking into seconds/km, m/s or metre-output questions. The final option-refinement layer preserves these unit-aware misconceptions.

Canonical direct-formula answer surfaces remain deliberately stable:

- direct distance → metres;
- direct speed → m/s;
- direct time → seconds;
- clock deadline speed → km/h.

This avoids duplicating the dedicated conversion authorities with artificial unit variants.

## Runtime and editorial quality

Implemented and guarded:

- deterministic valid-state-first generation;
- exact canonical solver and independent verifier coverage for all 25 authorities;
- four unique options with exactly one correct answer;
- deterministic answer-position rotation;
- plausible exam distractors instead of reciprocal or copied-value giveaways;
- short exam-style stems;
- visible unit conversion before the main calculation;
- the standard `m/s × 18/5` route for metres-and-seconds questions asking for km/h;
- decimals where the exact value terminates;
- ordinary fractions instead of mixed-number notation for other exact values;
- no repeated conversion or working lines;
- developer IDs and fingerprints hidden from the normal review surface;
- lifecycle locks: `UNREVIEWED`, `NOT_STORED`, `INELIGIBLE`, `publiclyPublishable: false`.

## Executable proof boundary

The workflow proves:

- 31 shared-foundation assertions;
- 32 source candidates dispositioned exactly once;
- 25 canonical solver routes;
- 25 materially separate verifier routes;
- deliberate tampered-answer rejection;
- 25 authorities × 60 seeds = 1,500 deterministic candidates;
- 23 learner-facing modes and two internal QA modes;
- 69 learner-review rows;
- complete four-tier explanation fields for all review rows;
- four option-analysis records with one correct choice per row;
- MathJax quantity coverage and balanced delimiters;
- zero malformed `\\times` or nested `\\text{}` tokens;
- zero internal misconception-code leaks;
- direct-option reasons tied to the actual mistaken values;
- six exact semantic checks for deadline one-hour distractors;
- three noon, three midnight and three later-next-day clock rows;
- six boundary-faithful arrival/departure traps;
- three explicit extra-30-minute elapsed traps;
- one equivalent-speed review row and two scalar speed-conversion rows;
- 200 equivalent-set and 400 scalar candidates across the dedicated 600-seed proof;
- the exact `25 m/s = 90 km/h = 1500 m/min` equality;
- a precise learner diagnosis for the km/h-number-times-60 trap;
- exact answer-unit quotas across six audited mode families;
- unit-aware pace working and option diagnoses;
- explicit omitted km-to-m conversion trap and explanation;
- day-scale and millimetre-scale review edges;
- zero duplicated unit nouns such as `km/h kilometres`;
- zero awkward fractional deadline options;
- compound duration, fraction, mixed-unit and proportionality coverage;
- zero duplicate-option, answer-key or publication-lock failures.

The workflow uses `set -o pipefail`; a Node proof failure cannot be hidden by a successful `tee` process.

## Review export

The exporter creates:

- `tsd-cp001-review.html`;
- `tsd-cp001-review.json`;
- `tsd-cp001-review.jsonl`.

The HTML renders the four learner tiers, MathJax quantities and complete option analysis. Developer metadata remains collapsed. The corpus remains review-only and cannot enter Question Studio, Question Bank, tests or public delivery.

## Remaining before permanent IDs

1. complete the final merge/split review of the 23 learner modes;
2. complete manual English approval;
3. assign permanent IDs only after explicit approval.
