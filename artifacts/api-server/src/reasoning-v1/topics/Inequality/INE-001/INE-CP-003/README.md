# INE-CP-003 — Definite, Possible, and Impossible Conclusions

INE-CP-003 is the discovery checkpoint for conclusion certainty in inequality questions. It extends the CP-001 graph foundation without allocating permanent QLs or exposing questions in Question Studio.

## Provisional authorities

| Authority                             | Learner task                                                    |
| ------------------------------------- | --------------------------------------------------------------- |
| `CLASSIFY_SINGLE_CONCLUSION_TRUTH`    | Classify one conclusion as definite, possible, or impossible    |
| `IDENTIFY_DEFINITELY_TRUE_CONCLUSION` | Select the only conclusion that must hold                       |
| `IDENTIFY_POSSIBLY_TRUE_CONCLUSION`   | Select the only conclusion that can hold but is not guaranteed  |
| `IDENTIFY_IMPOSSIBLE_CONCLUSION`      | Select the only conclusion that cannot hold                     |
| `IDENTIFY_ALL_POSSIBLE_RELATIONS`     | Select the complete set of possible atomic relations for a pair |
| `EVALUATE_INCLUSIVE_CONCLUSION_TRUTH` | Evaluate a `≥` or `≤` conclusion without treating it as strict  |

## Runtime guarantees

- Each generated question is deterministic for a prototype and seed.
- A graph solver and an independent finite-model enumerator must agree.
- Every question has four unique options and one independently verified answer.
- A possibly true conclusion includes both a supporting witness and a rejecting witness in the learning solution.
- Possible-relation questions include a witness for every allowed atomic relation.
- Correct answer positions are balanced equally across blocks of seeds.
- Learner-facing text cannot expose internal entity IDs or missing-value placeholders.

## Review material

The `review` directory contains 72 English questions: 12 for each provisional authority. Both Markdown and JSON versions are generated from the same deterministic records.

Manual review is still required before any permanent QL allocation or production release.
