# ExamTree Reasoning V1 — OPS-001 Candidate QL Consolidation Audit

Status: pre-runtime candidate inventory. Permanent QL IDs and ranges are not assigned.

## 1. Purpose

This audit consolidates the provisional coverage manifest after:

- textbook and SSC source saturation;
- Banking/Punjab structural review;
- second-pass edge-case audit;
- exact foundation design;
- Hindi/Punjabi localisation design;
- checkpoint split/merge decision.

The output is a bounded set of candidate QL contracts to test through runtime pilots.

A candidate count is reported for planning, but it is not the final chapter QL count. A candidate may still merge, split or be rejected when runtime evidence exposes:

- identical solver topology;
- unacceptable rejection rates;
- option-collision problems;
- renderer duplication;
- localisation defects;
- a new ambiguity family.

## 2. Consolidation rules

### Retain separately when

- the answer semantic differs;
- the student performs a materially different inverse action;
- the transformation family differs;
- relation-boundary discovery changes;
- the ambiguity enumerator differs;
- the explanation must prove a different fact;
- localisation mode differs materially;
- source-backed exam selection needs an independently addressable pattern.

### Merge when

- only operand size changes;
- only brackets or token count change;
- correct/incorrect polarity changes;
- relation target changes from `=` to `<` or `>` but the same fill solver applies;
- operator pair count can safely be an instance parameter without changing answer semantic—unless source selection and distractors justify separate identity;
- missing result is merely a visual blank with no equation-level contract change.

### Defer when

- the topology is plausible but unsupported by the reviewed corpus;
- multiple hidden mappings are intentionally allowed;
- occurrence-specific digit swapping is required;
- language-specific word-token behaviour has not passed pilot review.

## 3. Consolidated candidate summary

| Checkpoint | Retained candidate contracts | Pilot-sensitive |
|---|---:|---:|
| `OPS-CP-001` | 3 | 0 |
| `OPS-CP-002` | 4 | 1 |
| `OPS-CP-003` | 2 | 0 |
| `OPS-CP-004` | 4 | 0 |
| `OPS-CP-005` | 6 | 1 |
| `OPS-CP-006` | 3 | 1 |
| `OPS-CP-007` | 3 | 2 |
| `OPS-CP-008` | 4 | 2 |
| `OPS-CP-009` | 5 | 2 |
| **Total** | **34** | **9** |

Interpretation:

```text
34 = current retained candidate contracts for runtime proof
34 != frozen final QL count
```

## 4. `OPS-CP-001` candidate contracts

### `OPS-CAND-001` — Evaluate after supplied arithmetic-sign mapping

```text
taskKind: EVALUATE_AFTER_GIVEN_MAPPING
solveMode: evaluateAfterGivenArithmeticSignMapping
answerType: INTEGER | RATIONAL
```

Parameters:

- complete, partial or many-to-one supplied mapping;
- integer or finite-decimal literals;
- bracket topology;
- repeated operators;
- expression length;
- positive or negative result.

Retain because it is the canonical forward transformation task.

### `OPS-CAND-002` — Recover a missing result after supplied arithmetic mapping

```text
taskKind: RECOVER_MISSING_RESULT_AFTER_MAPPING
solveMode: recoverMissingResultAfterGivenArithmeticMapping
answerType: INTEGER | RATIONAL
```

Retain because the target is an equation/result slot and the explanation must preserve the transformed equation structure.

Pilot merge question:

- if renderer and explanation differ only cosmetically from `OPS-CAND-001`, merge after proof.

Current verdict: `RETAIN_FOR_PILOT`.

### `OPS-CAND-003` — Select the true/false equation after supplied mapping

```text
taskKind: IDENTIFY_EQUATION_AFTER_MAPPING
solveMode: selectEquationByTruthAfterGivenArithmeticMapping
answerType: EQUATION_OPTION
```

Polarity is metadata:

```text
queryPolarity: TRUE | FALSE
```

Every option is transformed and evaluated independently.

## 5. `OPS-CP-002` candidate contracts

### `OPS-CAND-004` — Evaluate language-neutral arbitrary operation tokens

```text
solveMode: evaluateAfterGivenArbitraryTokenMapping
answerType: INTEGER | RATIONAL
localeMode: TRANSLATABLE
```

Token families:

```text
LETTER_TOKEN
PUNCTUATION_TOKEN
FONT_SAFE_SHAPE_TOKEN
```

These remain parameters under one contract.

### `OPS-CAND-005` — Evaluate language-adapted word operation tokens

```text
solveMode: evaluateAfterGivenWordTokenMapping
answerType: INTEGER | RATIONAL
localeMode: LANGUAGE_ADAPTED
```

Retain separately because localisation mode, token boundaries and rendering differ.

Status: `PILOT_SENSITIVE`.

It may be deferred from V1 publication without removing the contract from the design inventory.

### `OPS-CAND-006` — Recover a missing result with arbitrary tokens

```text
solveMode: recoverMissingResultAfterArbitraryTokenMapping
answerType: INTEGER | RATIONAL
```

Current verdict: `RETAIN_FOR_PILOT`.

Merge with candidate 004 only if the result-slot renderer does not create a materially separate contract.

### `OPS-CAND-007` — Select the equation by truth after arbitrary-token mapping

```text
solveMode: selectEquationByTruthAfterArbitraryTokenMapping
answerType: EQUATION_OPTION
```

Retain because all options require independent token mapping and evaluation.

## 6. `OPS-CP-003` candidate contracts

### `OPS-CAND-008` — Select a true/false statement after mixed arithmetic/relation mapping

```text
solveMode: selectStatementByTruthAfterMixedMapping
answerType: STATEMENT_OPTION | EQUATION_OPTION
```

Equation-option and statement-option rendering are parameters of one truth-selection contract.

This merges provisional candidates C1 and C3.

### `OPS-CAND-009` — Recover the missing relation token after mapping

```text
solveMode: recoverMissingRelationTokenAfterMixedMapping
answerType: RELATION_OPERATOR
```

Retain because the answer is the relation itself and the solver compares exact side values.

## 7. `OPS-CP-004` candidate contracts

### `OPS-CAND-010` — Recover one missing arithmetic operator

```text
solveMode: recoverSingleMissingArithmeticOperator
answerType: OPERATOR
```

### `OPS-CAND-011` — Recover one missing relation operator

```text
solveMode: recoverSingleMissingRelationOperator
answerType: RELATION_OPERATOR
```

This is a newly recorded material gap from the provisional manifest.

It belongs to CP-004 rather than CP-003 because no supplied token mapping exists; the student directly fills a relation position.

### `OPS-CAND-012` — Fill an ordered operator sequence with relation fixed

```text
solveMode: fillOrderedOperatorsWithFixedRelation
answerType: OPERATOR_SEQUENCE
```

Target relation is typed:

```text
EQUAL | LESS_THAN | GREATER_THAN
```

This merges provisional D2 and D4. Relation kind alone does not define a new QL.

### `OPS-CAND-013` — Fill an ordered sequence including relation position

```text
solveMode: fillOrderedOperatorsIncludingRelationPosition
answerType: OPERATOR_SEQUENCE
```

Retain because candidate sequences can move the relation boundary and every completion requires structural revalidation.

## 8. `OPS-CP-005` candidate contracts

### `OPS-CAND-014` — Evaluate after a prescribed single operator-pair interchange

```text
solveMode: evaluateAfterSpecifiedSingleOperatorPairSwap
answerType: INTEGER | RATIONAL
```

### `OPS-CAND-015` — Evaluate after prescribed double-pair interchange

```text
solveMode: evaluateAfterSpecifiedDoubleOperatorPairSwap
answerType: INTEGER | RATIONAL
```

Status: `PILOT_SENSITIVE`.

Single and double interchange share a helper, but double-pair questions have:

- source-backed exam identity;
- a distinct `ONLY_FIRST_SWAP_APPLIED` distractor;
- a different transformation trace;
- a higher ambiguity surface.

Retain unless pilot evidence proves one parameterised QL is cleaner without losing selection control.

### `OPS-CAND-016` — Identify one operator pair that repairs an equation

```text
solveMode: identifySingleOperatorPairSwapForEquation
answerType: OPERATOR_PAIR
```

### `OPS-CAND-017` — Identify two disjoint operator pairs that repair an equation

```text
solveMode: identifyTwoOperatorPairSwapsForEquation
answerType: TWO_OPERATOR_PAIRS
```

Retain because the answer and ambiguity pool must exclude all simpler one-pair repairs.

### `OPS-CAND-018` — Identify an arithmetic/relation-token pair interchange

```text
solveMode: identifyArithmeticRelationPairSwapForEquation
answerType: OPERATOR_PAIR
```

Retain because `=` can move and relation structure must be rediscovered.

### `OPS-CAND-019` — Select the equation by truth after a prescribed operator interchange

```text
solveMode: selectEquationByTruthAfterSpecifiedOperatorSwap
answerType: EQUATION_OPTION
```

## 9. `OPS-CP-006` candidate contracts

### `OPS-CAND-020` — Identify a whole-number pair that repairs an equation

```text
solveMode: identifyWholeNumberPairSwapForEquation
answerType: NUMBER_PAIR
```

### `OPS-CAND-021` — Evaluate after a prescribed whole-number swap

```text
solveMode: evaluateAfterSpecifiedWholeNumberSwap
answerType: INTEGER | RATIONAL
```

### `OPS-CAND-022` — Select the equation by truth after a prescribed whole-number swap

```text
solveMode: selectEquationByTruthAfterSpecifiedWholeNumberSwap
answerType: EQUATION_OPTION
```

Status: `PILOT_SENSITIVE`.

Retain for representation completeness, but require source ledger or runtime value before permanent allocation.

## 10. `OPS-CP-007` candidate contracts

### `OPS-CAND-023` — Identify a global digit pair that repairs an equation

```text
solveMode: identifyGlobalDigitPairSwapForEquation
answerType: DIGIT_PAIR
```

### `OPS-CAND-024` — Evaluate after a prescribed global digit swap

```text
solveMode: evaluateAfterSpecifiedGlobalDigitSwap
answerType: INTEGER | RATIONAL
```

Status: `PILOT_SENSITIVE` because source frequency is lower than identify-pair questions.

### `OPS-CAND-025` — Select the equation by truth after a prescribed global digit swap

```text
solveMode: selectEquationByTruthAfterSpecifiedGlobalDigitSwap
answerType: EQUATION_OPTION
```

Status: `PILOT_SENSITIVE`.

Occurrence-specific digit swaps remain deferred and are not represented by these candidates.

## 11. `OPS-CP-008` candidate contracts

### `OPS-CAND-026` — Identify an operator pair and whole-number pair

```text
solveMode: identifyOperatorAndWholeNumberPairSwap
answerType: OPERATOR_AND_VALUE_SWAP
```

### `OPS-CAND-027` — Identify an operator pair and digit pair

```text
solveMode: identifyOperatorAndDigitPairSwap
answerType: OPERATOR_AND_VALUE_SWAP
```

Retain separately because digit transformation rebuilds literals and adds leading-zero validation.

### `OPS-CAND-028` — Evaluate after a prescribed compound transformation

```text
solveMode: evaluateAfterSpecifiedCompoundSwap
answerType: INTEGER | RATIONAL
```

Compound subtypes are parameters:

```text
OPERATOR_AND_WHOLE_NUMBER
OPERATOR_AND_DIGIT
TWO_OPERATOR_PAIRS_AND_NUMBER
```

Status: `PILOT_SENSITIVE` for multi-component subtype coverage.

### `OPS-CAND-029` — Select the equation by truth after a prescribed compound transformation

```text
solveMode: selectEquationByTruthAfterSpecifiedCompoundSwap
answerType: EQUATION_OPTION
```

Status: `PILOT_SENSITIVE` pending source-frequency and option-collision proof.

### Merge decision for provisional H3

`identifyTwoSignsAndTwoValuesSwap` is not retained as a standalone contract.

Reason:

- source wording normally describes one operator pair and one value pair;
- component count is metadata under candidate 026 unless two independent operator pairs are actually required;
- a true higher-component instance can be represented by candidate 028 when prescribed or may trigger a later split after source/runtime proof.

## 12. `OPS-CP-009` candidate contracts

### `OPS-CAND-030` — Infer an arithmetic mapping and evaluate a target

```text
solveMode: inferArithmeticOperatorMappingThenEvaluateTarget
answerType: INTEGER | RATIONAL
```

### `OPS-CAND-031` — Infer a mapping and recover a missing result

```text
solveMode: inferOperatorMappingThenRecoverMissingResult
answerType: INTEGER | RATIONAL
```

Retain for pilot because evidence block plus missing-result target may require a separate renderer and explanation topology.

### `OPS-CAND-032` — Infer a mapping and select the equation by truth

```text
solveMode: inferOperatorMappingThenSelectEquationByTruth
answerType: EQUATION_OPTION
```

### `OPS-CAND-033` — Recover one unknown operator meaning

```text
solveMode: recoverOneUnknownOperatorMeaning
answerType: OPERATOR | RELATION_OPERATOR
```

### `OPS-CAND-034` — Infer a mixed arithmetic/relation mapping and select the true statement

```text
solveMode: inferMixedArithmeticRelationMappingThenSelectStatement
answerType: STATEMENT_OPTION | EQUATION_OPTION
```

This is the second newly recorded material gap.

Retain because hidden inference involving a relation token changes:

- mapping candidate domain;
- relation-boundary proof;
- answer validation;
- ambiguity enumeration.

### Deferred hidden-mapping candidate

```text
selectPossibleOperatorMappingFromExamples
```

Deferred because V1 requires a unique full mapping. Questions intentionally allowing several mappings need a separate possibility contract and stronger source evidence.

## 13. Explicit merge decisions

| Provisional candidate | Decision | Consolidated destination |
|---|---|---|
| C3 correct completed equation | Merge | Candidate 008 |
| D4 fill for `<`/`>` | Merge | Candidate 012 with target relation |
| H3 two signs/two values | Merge | Candidate 026/028 by actual component topology |
| I5 possible mapping | Defer | No V1 contract |
| Correct/incorrect polarity variants | Merge | `queryPolarity` metadata |
| Bracketed/no-bracket variants | Merge | expression topology metadata |
| Integer/finite-decimal variants | Merge | numeric-literal metadata |
| Same-side/cross-side number positions | Merge | generation topology metadata |

## 14. Gap audit against student actions

| Student action | Covered by |
|---|---|
| Apply supplied mapping | 001, 004, 005, 008 |
| Evaluate transformed target | 001, 004, 005, 014, 015, 021, 024, 028, 030 |
| Recover missing result | 002, 006, 031 |
| Choose true/false equation | 003, 007, 008, 019, 022, 025, 029, 032, 034 |
| Recover arithmetic operator | 010 |
| Recover relation operator | 009, 011 |
| Fill ordered operators | 012, 013 |
| Identify one swap pair | 016, 018, 020, 023 |
| Identify two operator pairs | 017 |
| Identify compound swap | 026, 027 |
| Infer hidden mapping | 030–034 |
| Recover mapping component | 033 |

No major forward or inverse student action remains uncovered in the admitted V1 boundary.

## 15. Representation coverage obligations

The 34 candidates must collectively sample, without multiplying identity automatically:

- complete, partial and many-to-one supplied mappings;
- ordinary arithmetic signs;
- letters, punctuation and font-safe shapes;
- language-adapted word tokens;
- arithmetic and relation tokens;
- fixed and movable equality;
- integer and finite-decimal literals;
- zero where safe;
- negative results;
- single and multiple bracket groups;
- repeated mapped tokens;
- single and double operator interchange;
- whole-number and digit semantics;
- global swap scope;
- compound transformations;
- short and long evidence blocks;
- correct and incorrect polarity.

## 16. Runtime-pilot matrix

The first runtime pilot need not implement all 34 candidates.

Required pilot representatives:

```text
OPS-CAND-001  supplied mapping evaluation
OPS-CAND-003  equation-option truth selection
OPS-CAND-010  single missing operator
OPS-CAND-012  ordered fill sequence
OPS-CAND-014  prescribed operator swap
OPS-CAND-016  identify operator swap
OPS-CAND-018  arithmetic/relation swap
OPS-CAND-020  whole-number swap
OPS-CAND-023  digit swap
OPS-CAND-026  compound operator-number swap
OPS-CAND-030  hidden mapping inference
OPS-CAND-034  hidden mixed relation inference
```

These twelve pilots exercise every shared foundation and ambiguity family.

## 17. Candidate freeze gates

Permanent QL allocation remains blocked until:

```text
FOUNDATION_COMPILES                    = PASS
EXACT_EVALUATOR_REFERENCE_PARITY      = PASS
TRANSFORMATION_FINGERPRINT_TESTS      = PASS
12_REPRESENTATIVE_PILOTS              = PASS
OPTION_COLLISION_AUDIT                = PASS
CANDIDATE_MERGE_DECISIONS             = FINAL
HI_PA_RENDERING_PILOT                 = PASS
MOBILE_WIDTH_PILOT                    = PASS
ZERO_MATERIAL_GAPS                    = PASS
```

## 18. Current verdict

```text
CHECKPOINT_STRUCTURE             = FROZEN
RETAINED_CANDIDATE_CONTRACTS     = 34
PERMANENT_QL_COUNT               = UNFROZEN
PERMANENT_QL_IDS                 = UNASSIGNED
QL_RANGES                        = UNALLOCATED
NEXT_STAGE                       = FOUNDATION_AND_12-CANDIDATE_RUNTIME_PILOT
```
