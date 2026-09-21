# DIR-001 Final Audit — Wave 02

## Scope

Hindi explanation quality for DIR-CP-001..003 (DIR-QL-001..010).

## Finding

The Hindi localization preserved answers and structure but often replaced the actual solved reasoning with generic instructions such as “apply each turn in order” or “combine east-west and north-south movement”. This was materially weaker than both the English solved evidence and the Punjabi explanation.

## Remediation

- DIR-QL-001 now shows the starting angle and every turn calculation step.
- DIR-QL-002 now reconstructs the initial facing by undoing turns in reverse order with degree arithmetic.
- DIR-QL-003 now shows the initial and final direction angles before identifying the required turn.
- DIR-QL-004..010 now reuse the already-solved English movement evidence:
  - each actual movement leg is shown in Hindi;
  - the final coordinate difference is stated;
  - net movement and straight-line calculation are included when present;
  - total travelled distance is separated from displacement for DIR-QL-008.

## Safety

Only learner explanation text changes. Structured prompts, options, correct index, correct answer, seed, difficulty and solver authority remain unchanged.

## Regression

Hindi chapter tests now require numeric/degree reasoning for DIR-QL-001..003 and actual movement distances/calculation evidence for DIR-QL-004..010. Generic CP001–003 explanation boilerplate is rejected.
