# INE-CP-003 — Definite, Possible, and Impossible Conclusions

INE-CP-003 is the discovery checkpoint for conclusion certainty in inequality questions. It extends the CP-001 graph foundation without allocating permanent QLs or exposing questions in Question Studio.

## Provisional authorities

| Authority                             | Learner task                                                        | Delivery profile      |
| ------------------------------------- | ------------------------------------------------------------------- | --------------------- |
| `CLASSIFY_SINGLE_CONCLUSION_TRUTH`    | Classify one conclusion as definite, possible, or impossible        | Guided concept        |
| `IDENTIFY_DEFINITELY_TRUE_CONCLUSION` | Select the only conclusion that must hold                           | Diagnostic practice   |
| `IDENTIFY_POSSIBLY_TRUE_CONCLUSION`   | Select the only conclusion that can hold but is not guaranteed      | Diagnostic practice   |
| `IDENTIFY_IMPOSSIBLE_CONCLUSION`      | Select the only conclusion that cannot hold                         | Diagnostic practice   |
| `IDENTIFY_ALL_POSSIBLE_RELATIONS`     | Select the complete set of possible atomic relations for a pair     | Guided concept        |
| `EVALUATE_INCLUSIVE_CONCLUSION_TRUTH` | Evaluate a `≥` or `≤` conclusion without treating it as strict      | Guided concept        |
| `EVALUATE_TWO_CONCLUSIONS`            | Decide whether only I, only II, neither, or both conclusions follow | Mock-format prototype |

Single-conclusion classification uses three options because it has exactly three mutually exclusive outcomes. Two-conclusion evaluation uses four source-shaped response masks. Complementary `Either I or II` proof remains owned by CP-004.

## Runtime guarantees

- Each generated question is deterministic for a prototype and seed.
- A graph solver and an independent finite-model enumerator must agree.
- Every option has a distinct semantic meaning, and exactly one answer is correct.
- A possibly true conclusion includes both a supporting witness and a rejecting witness in the learning solution.
- Possible-relation questions include a witness for every allowed atomic relation.
- Correct answer positions are balanced separately for three-choice and four-choice tasks.
- Twelve normalized graph structures cover short and long chains, equality placement, branches, independent chains, and controlled irrelevant statements.
- Mock explanations lead with the decisive chain; equality links used by the solver must also be shown to the learner.
- Every authority records the exact supplied-book ledger entries that support it.
- Learner-facing text cannot expose internal entity IDs, placeholder values, or damaged encoding.

## Review material

The `review` directory contains 84 revised English questions: 12 for each provisional authority. Markdown and JSON versions are generated from the same deterministic records.

The revised pack was manually accepted and has been revalidated by the chapter-closure audit. Permanent QL allocation and production release remain separate decisions.
