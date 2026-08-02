# BLR-CP-007 — Final English Discovery Freeze

Checkpoint: **Coded Relation Construction**  
Permanent QL range: **BLR-QL-031 through BLR-QL-035**  
Next available chapter identity: **BLR-QL-036**

## Permanent solve authorities

| QL | Authority | Answer contract |
|---|---|---|
| BLR-QL-031 | SELECT_CODED_EXPRESSION | Complete coded expression |
| BLR-QL-032 | COMPLETE_MISSING_CODE_TOKEN | One code token |
| BLR-QL-033 | COMPLETE_ORDERED_CODE_TOKEN_PAIR | Ordered token pair |
| BLR-QL-034 | COMPLETE_MISSING_PERSON | Person label |
| BLR-QL-035 | SELECT_CODED_STATEMENT_BY_VALIDITY | Coded statement and interpretation |

## Frozen evidence

```text
English review questions                 168
source prototypes                         21
source topologies                         21
permanent solve authorities                5
permanent QLs                               5
completed coded assertions               296
diagnostic option analyses               672
independently verified questions     168 / 168
displayed-expression parity          168 / 168
unique learner signatures            168 / 168
answer positions                42 / 42 / 42 / 42
name-based gender assumptions               0
```

## Consolidation decisions

1. Direct, reverse, two-link, three-link and affinal complete-expression tasks are parameters of one expression-selection authority.
2. A single missing token remains separate because the answer and misconception space are token-local.
3. Two missing tokens remain separate because order is part of the answer contract.
4. Missing-person completion remains separate because the unknown occupies an operand position.
5. Correct/incorrect coded statement selection remains separate because every option combines an expression with a semantic claim.

## Quality rules

- All code meanings are explicit in the prompt.
- Every coded pair is interpreted left to right.
- Symbols are never treated as arithmetic operators.
- Exact direct-link wording is used whenever a blank could otherwise admit more than one semantically equivalent completion.
- The independent verifier reconstructs each option without calling the CP-007 production solver.
- Gender is derived only from father, mother, son, daughter, brother, sister, husband or wife relations.
- Every displayed blank or complete expression is tied to the structured statement used by the runtime.

## Ownership boundary

- CP-006 owns decoding a supplied expression into relation, person, gender or pair answers.
- CP-007 owns constructing, completing and validating coded expressions.
- Open-ended code induction, statement sufficiency and puzzle-wide code discovery are excluded.
- Hindi/Punjabi localisation, Question Studio, Question Bank, mock tests, publication, staging and merge remain locked.
