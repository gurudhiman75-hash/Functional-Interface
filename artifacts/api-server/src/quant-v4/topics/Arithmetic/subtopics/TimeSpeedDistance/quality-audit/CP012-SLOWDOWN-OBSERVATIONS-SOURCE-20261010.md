# CP012 paired slowdown observations — 2026-10-10

## Source and verified contract

Read PDF423, printed III.179, Review Test 2 Q1 in Arun Sharma, How to Prepare for Quantitative Aptitude for CAT (McGraw Hill Education, 2018), Library identity `libfile_0b45506ca710819189265002240ed2e7`. This pass used extracted page text; it does not claim visual inspection or authenticated original exam-paper provenance.

The source provides two alternative slowdown points (18 km and 30 km), the same reduced-speed fraction (4/5), and delays of 45 and 36 minutes. Independently reconstructing both complete journeys gives normal speed 20 km/h and distance 78 km. Neither of the source's three explicit speed/distance pairs matches; its fourth option is None of these. No answer is forced to one of the explicit pairs.

## Executable mapping

CP003 speedChangePointDistance requires the total distance and both speeds; it cannot receive this source's two unknowns directly. CP012 motionReconstructionProgramState likewise exposes one missing-stage quantity. However, the existing CP012 twoEngineInverseState already solves the required coupled equations. This is a missing authored scenario adapter, not a new mathematical authority or a new solver gap.

Let k be the reduced-speed fraction and f = 1/k - 1. With x = D/v and y = 1/v, the two observations are f*x - f*a*y = t1 and f*x - f*b*y = t2. The adapter reuses the existing coupled solver for x and y, then returns v = 1/y and D = x/y. It rejects nonpositive delays, reversed observation points, equal/increasing delays, invalid speed fractions and slowdown points outside the inferred route.

## Review candidates and evidence

`slowdown-observations-source-review-v1.ts` supplies six numeric states with car/bus/van contexts and 18 English/Hindi/Punjabi review rows. Only the first state is the scoped source observation; the remaining five are labelled authored parameter variants. These are one observation structure, not six distinct mathematical models.

Each row has four distinct answer pairs and four substituted calculation steps. Distractors confuse reduced speed with normal speed, remaining distance with total distance, or first delay with the delay difference. The proof reconstructs the complete normal/slowed journeys independently for both observations, checks answer binding and all release locks, and verifies invalid inputs are rejected.

The 3,846-row V4 export is unchanged. Earlier two-walker and signed-cycle supplements remain 36 rows; this separate supplement brings the supplementary count to 54. Nothing is automatically promoted or registered. The current test is included in the editorial candidate proof suite.

## Closure limits

No QL allocation, frozen-content replacement, bank write, test/mock eligibility or publication activation. Source provenance for foundations, broad scenario/model coverage, rendering and human review remain open.
