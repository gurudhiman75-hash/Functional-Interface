# INE-CP-005 — Linguistic Inequalities

INE-CP-005 renders structured English comparison phrases and normalizes them into the language-neutral inequality solver. It never infers relations by parsing arbitrary prose.

## Provisional authorities

| Authority                                    | Learner task                                 | Profile                 |
| -------------------------------------------- | -------------------------------------------- | ----------------------- |
| `INTERPRET_LINGUISTIC_RELATION`              | Translate one verbal comparison into symbols | Guided concept          |
| `SOLVE_LINGUISTIC_CHAIN`                     | Solve a completely verbal comparison chain   | Exam-practice prototype |
| `SOLVE_MIXED_LINGUISTIC_SYMBOLIC_CHAIN`      | Combine verbal and symbolic statements       | Exam-practice prototype |
| `EVALUATE_CONTEXTUAL_LINGUISTIC_CONCLUSIONS` | Evaluate two contextual verbal conclusions   | Exam-practice prototype |

## Phrase contract

The renderer owns eight semantic phrase keys covering greater than, less than, inclusive negative forms, equality, and the three “neither” constructions. Every rendered phrase is checked against its canonical relation.

## Discovery safeguards

- exactly four unique options per question;
- all eight phrase keys and all five canonical relations are covered;
- generic, marks, salary, height, weight, score, price, and production contexts are covered;
- mixed questions contain at least one linguistic and one symbolic statement;
- graph and model-enumeration solvers must agree;
- explanations translate the verbal statements before solving;
- displayed options are re-derived from their stored relation semantics so label orientation cannot drift from the answer;
- coded symbols and arbitrary natural-language parsing remain outside CP-005;
- permanent QLs and Question Studio visibility remain disabled.
