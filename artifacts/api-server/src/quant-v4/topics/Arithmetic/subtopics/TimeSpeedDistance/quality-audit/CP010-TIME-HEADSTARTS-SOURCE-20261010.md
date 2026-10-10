# CP010 two time-headstart observations — 2026-10-10

Status: unapproved source-gap review candidate. No registration or release permission changes.

## Source evidence and scope

Arun Sharma, *How to Prepare for Quantitative Aptitude for CAT* (2018), Library file `libfile_0b45506ca710819189265002240ed2e7`, PDF page 416, printed III.172, Applications Q16. This pass read extracted text from PDF pages 413–416. It did not visually inspect those pages or authenticate an original exam paper.

The source gives a 2,000 m race: the slower runner receives a 60-second head start and loses by 200 m; with an 80-second head start, the race is a dead heat. The speeds stay constant. The faster runner's exact speed is 50/3 m/s, corresponding to the book's rounded 16.66 m/s option. The candidate retains the exact fraction.

## Executable gap

The current CP010 `deadHeatHandicapState` takes both known speeds and calculates a handicap. `runnerStateFromTwoRaceOutcomes` takes an ordinary first-race distance lead and a second-race finish-time lead, with no headstart fields. `multiOutcomeRaceComparison` takes a **distance** start in the second race and assumes an ordinary first race. None accepts both time starts and the observed first-race distance margin. Putting the 60-second-start race into the ordinary first-race contract would yield a wrong speed ratio.

The separate `time-headstarts-source-review-v1.ts` adds this inverse observation form for review. It does not extend the canonical input union or allocate a permanent QL.

Let L be the race length, h1/h2 the slower runner's time starts, g the first-race distance margin, and T the faster runner's own running time. The two observations give vB(T+h1)=L−g and vB(T+h2)=L. Therefore vB=g/(h2−h1), T=L/vB−h2 and vA=L/T. The source case gives vB=10 m/s, T=120 s and vA=50/3 m/s.

Validation independently reconstructs finish positions in both races; it does not call the inverse solver to compute expected positions. It checks four distinct answer options, correct-index binding, misconception identities, five worked explanation lines, invalid observations and every release lock. Six numerical states produce 18 English/Hindi/Punjabi rows. Only the first is source-derived; five are explicitly authored parameter variants. This is one observation form, not six models.

## Other source triage from this scoped read

| Location | Source form | Audit disposition |
| --- | --- | --- |
| PDF415 Q1–5, Q7–8 | Circular-track encounters, lap timing and meeting positions | CP006 is the owner. Existing input supports track length, directions, phase, delay and event index; individual source-form executions remain to be verified. Presence of fields alone is not a completeness proof. |
| PDF415 Q6 | Straight-line separation on two externally tangent tracks with different radii | CP006 has one track-length state and no pair of radii or geometric separation target. The specific 240 m maximum question is now proven impossible by exact lap phases; see TANGENT-TRACKS-SOURCE-20261010.md. General geometric separation and integration ownership remain unresolved. |
| PDF415 Q9–10; PDF416 Q11–15, Q17–20 | Clock hand movement and faulty clock readings | Ordinary hand arithmetic belongs to CLK-001 under its cross-chapter ownership amendment. Faulty-clock ownership needs a separate check; these book questions do not automatically require new TSD QLs. |
| PDF416 Q21 | Reversal after a speed reduction | Extracted source wording calls the bike faster but gives the bike:auto ratio as 1:5. Treat as contradictory evidence until resolved against page/solution; do not copy it into a learner stem. |
| PDF416 Q22 | Delayed departure with an unsigned separation observation | Both signed position states are now independently verified; 50 and 10 km/h are feasible, so the speed is not unique. See DELAYED-DEPARTURE-SOURCE-20261010.md. |

## Promotion and closure limits

The frozen 3,846-row V4 export is unchanged. Supplementary source-review rows now total 72: two-walker, signed-cycle, slowdown-observation and time-headstart batches of 18 each. Counts describe review rows, not approved distinct model coverage. Human wording approval, canonical promotion, wider source mapping, foundation provenance and actual UI/MathJax evidence remain open. CP010–CP012 remain unregistered and locked for persistence, Bank, test/mock and public use.
