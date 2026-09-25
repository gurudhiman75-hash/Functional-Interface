# DIR-001 Final Audit — Wave 04

## Scope

Close the remaining generic localized-explanation gap through `DIR-QL-035`.

This wave covers:

- Punjabi `DIR-QL-004..010` path / distance explanations;
- Hindi and Punjabi `DIR-QL-023..029` coded-direction explanations;
- Hindi and Punjabi `DIR-QL-030..035` sun / shadow explanations.

## Findings

1. Punjabi `DIR-QL-004..010` still used generic method prose even after the Hindi path had been upgraded in Wave 02.
2. Both localized CP006 paths explained coded-direction questions with generic instructions rather than the actual code map, decoded relations, evidence chains, missing operator state or movement distances.
3. Both localized CP007 paths repeated the general sun/shadow method without replaying the question's actual period, facing, shadow side, turns or mutual-orientation relation.
4. These explanations were semantically safe, but materially weaker than the solved English evidence and below the chapter-wide beginner explanation standard.

## Remediation

### Punjabi QL004..010

- replay the actual movement distances and directions from the solved English evidence;
- show the actual final displacement from the start;
- expose the straight-line calculation where the source uses Pythagorean distance;
- keep travelled distance distinct from displacement for QL008;
- state the solved missing distance for QL009.

### Hindi / Punjabi QL023..029

- print the actual symbol-to-direction map;
- decode every supplied coded relation;
- replay code-recovery evidence for QL025;
- state the exact target relation for equivalent-statement and missing-operator questions;
- replay every coded movement with its actual distance for QL029;
- show the solved endpoint / conclusion rather than a generic decoding instruction.

### Hindi / Punjabi QL030..035

- state the question's actual morning/evening sun and shadow directions;
- connect the actual shadow side to the person's facing;
- show the actual facing/time inference;
- replay every supplied turn for QL034;
- show the actual same/opposite-facing relation for QL035.

## Regression

Hindi and Punjabi chapter tests now reject the old generic CP006 / CP007 explanation text.

Punjabi tests additionally reject the old generic QL004..010 method explanation and require question-specific movement distances. Pythagorean source questions must expose the square-root calculation.

CP006 tests require the actual code symbols to appear in the solved explanation; QL029 must expose its generated movement distance.

CP007 tests require the localized solved answer to appear inside the reasoning steps, not only in the final conclusion.

## Safety boundary

This wave changes learner explanation text and explanation-quality tests only.

It does **not** change:

- structured prompts;
- stems;
- option values or labels;
- correct option index;
- correct answer;
- seed behavior;
- difficulty;
- solver authority;
- diagrams;
- permanent QL ownership;
- Question Bank, mock or public-release state.

## Still open after Wave 04

- CP008 explanation-depth audit against its actual solved state;
- chapter-wide stem / distractor and generated-instance difficulty calibration;
- diagram policy and readability review;
- current Question Studio integration;
- explicit Hindi / Punjabi freeze authority;
- final Question Bank / test / mock / public-release boundary proof.
