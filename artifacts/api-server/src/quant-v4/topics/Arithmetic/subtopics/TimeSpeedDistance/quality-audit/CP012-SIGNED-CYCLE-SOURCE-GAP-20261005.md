# CP012 signed periodic-motion source gap — 2026-10-05

Source: Arun Sharma, How to Prepare for Quantitative Aptitude for CAT (McGraw Hill Education, 2018), PDF395, printed III.151, Level of Difficulty 2 Q17. Library identity libfile_0b45506ca710819189265002240ed2e7; same PDF hash recorded in CP011-SOURCE-GAP-20261005.md. The source page was visually inspected. This is preparation-book evidence, not authenticated original exam-paper provenance.

The source has alternating ascent and backward slipping. Its target is reached inside the final ascent; subsequent slipping must not be counted. The reference fixture has ascent 12, slip 5 and target 63, with one hour per stage; independent exact calculation gives 199/12 hours, or 16 hours 35 minutes, matching the printed option. Candidate snail scenarios use centimetres to improve physical plausibility; this preserves the ratios and completion time.

## Why existing coverage does not implement this form

executable-solver.ts timedDistance rejects nonpositive speed. source-executable-extensions.ts repeating-cycle helper also requires positive speed. periodicTravelRestProgramState permits stationary rest stages, but a slip changes displacement and cannot be encoded as rest. None of these contracts accepts backward stages. This source form is an expansion of the motion inventory, rather than a missing target that the existing CP012 source ledger explicitly claims.

## Separate candidate

signed-cycle-source-review-v1.ts adds one signed periodic observation model in 6 numeric states and 18 English/Hindi/Punjabi rows. These are supplementary to V4's unchanged 3,846 rows and CP011's separate 18-row supplement. No new permanent QL or canonical frozen family is allocated.

If ascent a exceeds slip b, completed cycles before the terminal climb are max(0, ceil((target − a)/(a − b))). Each complete cycle includes both stage durations; the final climb includes only its necessary fraction. A target reachable in the first ascent completes even when cycle net gain is zero/negative; higher unreachable targets are rejected.

The independent verifier simulates ascent/slip stages and checks 63 parameter combinations, including exact peak boundaries, zero slip and unequal durations, plus all 18 candidate rows. It verifies answer uniqueness and all release locks.

## Remaining scope

This does not establish complete source coverage, source saturation or UI readiness. The generic closed-form candidate is not yet part of the frozen input union or Question Studio. The authorityKey names an existing review owner; it does not assert canonical runtime support. Human review and explicit promotion remain outstanding. Frozen content and all release gates remain intact.
