# DIR-001 Final Audit — Wave 05

## Scope

Deep explanation audit for the advanced synthesis checkpoint:

- `DIR-QL-036..044`
- English, Hindi and Punjabi
- no solve-contract or release-state changes

## Findings

CP008 already had correct structured state and independent solvers, but learner explanations were uneven.

The recurring weakness was that the explanation often described *what method to use* without replaying enough of the actual generated instance. This was most visible in:

- missing graph relation reconstruction;
- contradiction checking;
- missing movement and missing turn reconstruction;
- initial-facing inverse questions;
- graph + later movement synthesis;
- shared path caselet direction/distance;
- diagram + text hybrid synthesis.

Hindi and Punjabi were materially more generic than the English source. A few English families also still stopped at method-level narration instead of exposing the generated route or relations.

## Remediation

### QL036 — missing graph relation

- replay every visible relation with the actual distance;
- show the resulting missing relation with its actual distance and direction.

### QL037 — inconsistent statement

- replay both anchor relations;
- list every numbered candidate statement with its actual relation;
- identify the statement that conflicts with the solved layout.

### QL038 — missing movement direction

- replay every known movement with its generated distance and direction;
- show the partial position from known movements;
- show the supplied target position;
- restore the missing vector and prove that it reaches the target.

### QL039 — missing turn

- show the actual first movement;
- apply the solved missing turn;
- show the resulting second movement direction and distance;
- apply the known turn and final movement;
- verify the final point against the supplied target.

### QL040 — initial facing from endpoint

- replay the full actual route from the solved initial facing;
- show each turn, movement direction and running position;
- verify that the final point matches the supplied endpoint.

### QL041 — graph plus movement

- replay both static spatial relations;
- replay the later movement from the correct start entity;
- show horizontal and vertical separation from the reference entity;
- show the Pythagorean calculation and direction-distance result.

### QL042 / QL043 — shared path caselet

- replay the shared route from the actual initial facing;
- show every turn and movement with running position;
- QL042: distinguish endpoint direction from final facing;
- QL043: show endpoint components and the full Pythagorean shortest-distance calculation;
- retain the same shared hidden state and caselet identity.

### QL044 — diagram + text hybrid

- replay both diagram relations explicitly;
- replay the written relation;
- combine all three vectors;
- show the resulting relative displacement and direction.

## Regression

The CP008 English test now requires question-specific solved evidence in every advanced family.

Hindi and Punjabi chapter tests require:

- the solved localized answer inside the reasoning steps;
- actual generated relation or movement distances;
- numbered statement evidence for QL037;
- both second and third movement distances for QL039;
- actual route distances for QL040 / QL042 / QL043;
- square-root calculation for QL041 / QL043;
- both diagram and text relation distances for QL044.

The old generic CP008 explanation patterns are explicitly rejected.

## Safety boundary

This wave does not change:

- QL IDs or ownership;
- structured prompts;
- question stems;
- option values or correct indexes;
- correct answers;
- seeds;
- difficulty;
- independent solvers;
- question diagrams;
- Question Bank / test / mock / public-release state.

## Still open after Wave 05

- chapter-wide stem realism and distractor audit;
- generated-instance difficulty calibration;
- diagram policy / readability review;
- current Question Studio integration;
- explicit multilingual freeze authority;
- final downstream release-boundary proof.
