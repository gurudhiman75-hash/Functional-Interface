# INE-CP-006 — Coded Inequality: Fixed Maps

INE-CP-006 supplies a complete five-symbol code key, decodes every coded statement into canonical inequality constraints, and delegates all inference to the shared formal solver. It never guesses a missing mapping.

## Provisional authorities

| Authority                              | Learner task                             | Profile                 |
| -------------------------------------- | ---------------------------------------- | ----------------------- |
| `DECODE_FIXED_MAP_RELATION`            | Decode one coded relation                | Guided concept          |
| `SOLVE_FIXED_MAP_CODED_CHAIN`          | Decode and solve a coded chain           | Exam-practice prototype |
| `EVALUATE_FIXED_MAP_CODED_CONCLUSIONS` | Decode and test two coded conclusions    | Exam-practice prototype |
| `ENCODE_FIXED_MAP_RELATION`            | Select the code for an ordinary relation | Guided concept          |

## Delivery profiles

- `ASCII_EXAM_PROFILE` is mandatory for chain-solving and conclusion-evaluation records. It uses punctuation-style symbols that resemble current Banking practice and are safe for ordinary web, mobile, and PDF rendering.
- `UNICODE_GUIDED_PROFILE` contains geometric and circled symbols. It is deliberately restricted to guided decoding and encoding so it can test symbol recognition without weakening exam realism.
- exam-practice metadata is limited to `BANKING_REGULATORY_PRACTICE_ONLY`;
- SSC, Railways, PSSSB, PPSC, Punjab-post, Hindi, and Punjabi release labels are not assigned by CP-006.

The 48-question review export is weighted toward exam-shaped work: 17 chain-solving questions, 17 conclusion-evaluation questions, 7 guided decoding questions, and 7 guided encoding questions.

## Discovery safeguards

- every question supplies all five mappings for `>`, `<`, `=`, `≥`, and `≤`;
- every map is bijective and uses five distinct symbols;
- coded text is reproduced from structured relations rather than parsed as arbitrary text;
- direct, reversed, strict, inclusive, equality, branch, disconnected, and five-to-eight-statement cases are covered;
- every question has exactly four unique options;
- conclusion questions include two-conclusion and selected hard three-conclusion forms;
- conclusion options are generated from formally evaluated truth subsets and always remain exactly four;
- conclusions use distinct entity pairs, excluding unlabelled either-or leakage;
- graph and model-enumeration solvers must agree;
- explanations decode before reasoning and give option-specific feedback;
- map recovery and missing-operator tasks remain in CP-007;
- permanent QLs and Question Studio visibility remain disabled.
