# INE-CP-006 — Coded Inequality: Fixed Maps

INE-CP-006 supplies a complete five-symbol code key, decodes every coded statement into canonical inequality constraints, and delegates all inference to the shared formal solver. It never guesses a missing mapping.

## Provisional authorities

| Authority                              | Learner task                             | Profile                 |
| -------------------------------------- | ---------------------------------------- | ----------------------- |
| `DECODE_FIXED_MAP_RELATION`            | Decode one coded relation                | Guided concept          |
| `SOLVE_FIXED_MAP_CODED_CHAIN`          | Decode and solve a coded chain           | Exam-practice prototype |
| `EVALUATE_FIXED_MAP_CODED_CONCLUSIONS` | Decode and test two coded conclusions    | Exam-practice prototype |
| `ENCODE_FIXED_MAP_RELATION`            | Select the code for an ordinary relation | Guided concept          |

## Discovery safeguards

- every question supplies all five mappings for `>`, `<`, `=`, `≥`, and `≤`;
- every map is bijective and uses five distinct symbols;
- coded text is reproduced from structured relations rather than parsed as arbitrary text;
- direct, reversed, strict, inclusive, equality, branch, disconnected, and long-chain cases are covered;
- every question has exactly four unique options;
- conclusion questions exclude unlabelled either-or pairs;
- graph and model-enumeration solvers must agree;
- explanations decode before reasoning and give option-specific feedback;
- map recovery and missing-operator tasks remain in CP-007;
- permanent QLs and Question Studio visibility remain disabled.
