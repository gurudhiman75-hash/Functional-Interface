# DIR-CP-008 Implementation Report

Status: English runtime implemented on a feature branch; manual product approval pending.

## Ownership

`DIR-CP-008` is the final Direction and Distance checkpoint. It owns advanced inverse reconstruction, contradiction detection, mixed graph-and-movement states, shared path caselets and question evidence split between a diagram and text.

It does not create duplicate QLs merely because a path is longer. Longer forward paths remain runtime variation inside CP-002 and CP-003. Missing movement distance remains owned by `DIR-QL-009`, while orientation-only initial-facing and missing-turn reconstruction remain owned by `DIR-QL-002` and `DIR-QL-003`.

## Exhaustive gap audit

The final audit justified nine materially distinct contracts:

| QL | Answer demand | Material distinction |
|---|---|---|
| `DIR-QL-036` | missing graph relation direction | candidate edge completion must preserve a connected contradiction-free cycle |
| `DIR-QL-037` | inconsistent statement | each numbered premise is removed and the redundant graph is independently re-solved |
| `DIR-QL-038` | missing movement direction | CP-003 reconstructs distance; this contract reconstructs the unknown heading |
| `DIR-QL-039` | missing path instruction | the hidden turn changes all later coordinates and is recovered from the endpoint |
| `DIR-QL-040` | initial facing from endpoint | initial frame is recovered from a movement endpoint rather than a stated final facing |
| `DIR-QL-041` | direction plus distance after graph and movement | a mover starts at a graph-derived position and is compared with another static entity |
| `DIR-QL-042` | shared-caselet endpoint direction | owns the direction question attached to a deterministic reusable path stimulus |
| `DIR-QL-043` | shared-caselet shortest distance | owns the independent distance question for the identical caselet state |
| `DIR-QL-044` | diagram-text relation | the full graph is split between visible diagram premises and one textual premise |

No additional QL was allocated for:

- longer forward paths;
- different names, places or distances;
- missing movement distance;
- orientation-only inverse questions;
- data-sufficiency statement logic;
- speed-time synchronization;
- general puzzles or arrangements.

## Runtime contract

- chapter-wide continuous IDs `DIR-QL-036` through `DIR-QL-044`;
- deterministic hidden-state-first generation;
- bounded candidate enumeration for all inverse forms;
- independent graph, path, turn, initial-frame, mixed-state and caselet solvers;
- exactly four unique misconception-labelled options;
- one correct answer per item;
- caselet identity parity between QL-042 and QL-043;
- structured SVG diagrams for graph, graph-plus-path and diagram-text hybrid questions;
- metadata `solveMode: null` under the open optional policy.

## Local proof scope

- 9 QLs × 120 seeds = 1,080 deterministic cases;
- 80 to 120 distinct stems per QL across the 120-seed audit;
- 80 to 120 distinct complete explanations per QL, with five editorial phrasing variants in the repeated reasoning shells;
- all four contradiction answer positions;
- all four missing-turn candidates, including no turn;
- at least four required direction classes for every direction-valued QL;
- exact mixed-state distances from 3-4-5, 5-12-13, 8-15-17 and 7-24-25 component families;
- exact caselet distances from 5-12-13, 8-15-17, 7-24-25, 12-35-37 and 9-40-41 component families;
- shared caselet state parity for all 120 paired seeds;
- question-diagram and explanation-diagram role checks;
- explicit distance and direction labels on diagram premises;
- explicit distance in every diagram-text premise so the hybrid query is uniquely determined;
- four unique options and exactly one correct answer;
- balanced answer positions below the 1.35 max/min threshold;
- natural wording guards against placeholders, coordinate jargon and stems that reveal a turn necessarily occurred;
- 45-question HTML/JSONL review export.

## Review state

- English local TypeScript check: passed;
- English local runtime proof: passed;
- English local editorial audit: passed, including correction of an initially under-specified diagram-text premise;
- English diagram contact-sheet audit: passed;
- exact-head GitHub Actions: pending;
- English manual product approval: pending;
- Hindi: not started;
- Punjabi: not started;
- Question Studio exposure: not enabled;
- chapter freeze: not claimed.
