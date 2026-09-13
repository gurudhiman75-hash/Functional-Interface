# ExamTree Reasoning V1 — OPS-001 Checkpoint Split/Merge Audit

Status: checkpoint-structure decision. This document freezes logical checkpoint ownership only. It does not freeze QL counts, solve-mode counts, QL IDs or QL ranges.

## 1. Purpose

The discovery design began with eight provisional partitions. Source expansion and runtime analysis exposed one required split and several apparent splits that should be rejected.

This audit decides checkpoint boundaries using the Reasoning architecture rule:

> A checkpoint groups QLs that share one runtime architecture, solver route, ambiguity model and QA boundary. Checkpoints must not be created merely to distribute files evenly.

## 2. Decision criteria

A provisional family should be split when two groups differ materially in several of:

- token domain;
- transformation stage;
- parsing contract;
- independent solver;
- ambiguity enumeration;
- rejection risks;
- answer semantic;
- explanation strategy;
- localisation risk;
- test architecture.

A provisional family should remain merged when differences are parameter or presentation variations handled safely by one runtime.

## 3. Final checkpoint ownership structure

The chapter will use nine logical checkpoints:

```text
OPS-CP-001  Given arithmetic-sign mapping
OPS-CP-002  Given arbitrary operation-token mapping
OPS-CP-003  Mixed arithmetic and relation mapping
OPS-CP-004  Filling operator and relation positions
OPS-CP-005  Operator and relation-token interchange
OPS-CP-006  Whole-number token interchange
OPS-CP-007  Digit-identity interchange
OPS-CP-008  Combined operator and numeric interchange
OPS-CP-009  Hidden operator mapping and equation puzzles
```

These checkpoint IDs are stable ownership IDs after this decision. QL ranges remain unallocated.

## 4. `OPS-CP-001` — Given arithmetic-sign mapping

### Ownership

- displayed ordinary signs such as `+`, `−`, `×`, `÷` are assigned supplied arithmetic meanings;
- mapping may be complete, partial, bijective or many-to-one;
- student evaluates a target, recovers a result, or chooses a valid equation.

### Why separate from CP-002

Although both use supplied mappings, ordinary arithmetic signs create a special collision pool:

- identity interpretation;
- displayed precedence before transformation;
- direct versus reverse mapping language;
- familiar-sign cognitive interference.

Arbitrary tokens do not create the same interference and require different renderer/font audits.

### Runtime boundary

```text
ordinary arithmetic display token
  -> supplied semantic arithmetic mapping
  -> transformed arithmetic parse
  -> exact evaluation
```

### Candidate solve-mode families

```text
evaluateAfterCompleteArithmeticMapping
evaluateAfterPartialArithmeticMapping
evaluateAfterManyToOneArithmeticMapping
recoverMissingResultAfterArithmeticMapping
selectCorrectEquationAfterArithmeticMapping
selectIncorrectEquationAfterArithmeticMapping
```

Bracket depth, expression length, repeated operators and decimal literals are instance dimensions unless they change ambiguity or renderer behaviour materially.

## 5. `OPS-CP-002` — Given arbitrary operation-token mapping

### Ownership

- letters, punctuation, shapes or reviewed words denote arithmetic operators;
- mapping is supplied directly;
- answer depends on exact expression evaluation or equation truth.

### Why separate from CP-001

Distinct requirements:

- symbol-pool governance;
- font and script safety;
- collision with punctuation and option labels;
- language-adapted word-token mode;
- arbitrary-token normalisation;
- token alias rejection.

### Runtime boundary

```text
arbitrary display token
  -> supplied semantic mapping
  -> token normalisation
  -> exact arithmetic parse
```

### Candidate solve-mode families

```text
evaluateWithLetterOperationTokens
evaluateWithSymbolOperationTokens
evaluateWithLanguageAdaptedWordTokens
recoverResultWithArbitraryTokens
selectCorrectEquationWithArbitraryTokens
```

Letter tokens and punctuation tokens may remain presentation parameters when the same token grammar and error model apply. Word tokens may require a separate retained QL because localisation mode and renderer contract differ.

## 6. `OPS-CP-003` — Mixed arithmetic and relation mapping

### Ownership

- supplied display tokens map to arithmetic operators and one or more of `=`, `<`, `>`;
- student selects the true/false statement or recovers a relation token;
- completed statement must contain a valid relation structure.

### Why separate from CP-001/002

The solver must:

- transform first;
- locate relation boundaries;
- parse two arithmetic sides;
- compare exact values;
- reject malformed or multi-relation results.

This is not a parameter on arithmetic evaluation; it changes the AST root and answer semantic.

### Candidate solve-mode families

```text
selectTrueStatementAfterMixedMapping
selectFalseStatementAfterMixedMapping
recoverRelationTokenAfterMapping
selectCorrectEquationAfterMixedMapping
compareBothSidesAfterMixedMapping
```

Correct/incorrect polarity alone may be one parameter when option construction and explanation remain symmetric. Runtime proof will decide whether polarity needs separate QLs.

## 7. `OPS-CP-004` — Filling operator and relation positions

### Ownership

- one or more operator positions are unknown;
- options provide ordered sequences or a missing token;
- equality may be fixed or insertable;
- target may be `=`, `<` or `>`.

### Why one checkpoint rather than separate arithmetic-fill and relation-fill checkpoints

Both use the same core architecture:

```text
completed valid relation AST
  -> remove selected operators/relation token
  -> enumerate allowed ordered replacements
  -> parse every completion
  -> prove unique satisfying sequence
```

Differences in whether `=` is fixed or insertable are explicit QL contracts but do not require a separate foundation.

### Candidate solve-mode families

```text
fillArithmeticOperatorsWithFixedEquality
fillOperatorsIncludingEquality
fillOperatorsForLessThan
fillOperatorsForGreaterThan
recoverSingleMissingArithmeticOperator
recoverSingleMissingRelationOperator
fillBracketedOperatorSequence
```

### Mandatory policy dimensions

```text
operatorReusePolicy = ALLOWED | FORBIDDEN | OPTION_DEFINED
relationPositionPolicy = FIXED | INSERTABLE
placeholderOrder = LEFT_TO_RIGHT
```

## 8. `OPS-CP-005` — Operator and relation-token interchange

### Ownership

- identify or apply one global operator-token pair swap;
- identify or apply two disjoint global pairs;
- one token may be `=` where source-backed;
- evaluate a transformed expression or repair/select an equation.

### Decision: keep arithmetic-sign/`=` swaps here

An interchange such as `÷` with `=` moves the relation boundary, but the transformation mechanism remains:

```text
simultaneous global token identity swap
```

The additional relation-boundary validation is a transformation outcome, not a different transformation family.

Splitting it into CP-003 would be incorrect because CP-003 receives a supplied meaning mapping rather than interchanging token identities.

### Candidate solve-mode families

```text
evaluateAfterSpecifiedSingleOperatorSwap
evaluateAfterSpecifiedDoubleOperatorSwap
identifySingleOperatorPairForEquation
identifyTwoOperatorPairsForEquation
identifyArithmeticRelationPairForEquation
selectCorrectEquationAfterSpecifiedOperatorSwap
```

### Rejected split

Do not create separate checkpoints for:

- prescribed swap versus inferred swap;
- one pair versus two pairs;
- evaluation versus equation repair.

They share token domain, simultaneous-swap helper and ambiguity enumerator. They may justify separate QLs, not separate checkpoints.

## 9. `OPS-CP-006` — Whole-number token interchange

### Ownership

- complete numeric tokens are interchanged as indivisible values;
- identify the pair or evaluate after a supplied pair swap;
- tokens may occur on the same side or different sides of a relation.

### Required split from digit interchange

Whole-number interchange operates over parsed numeric-token identity:

```text
24 <-> 36
```

It does not inspect or replace internal digits.

### Solver route

```text
enumerate eligible numeric-token pairs
  -> swap complete token identities simultaneously
  -> parse transformed relation
  -> evaluate exactly
  -> prove unique pair/result
```

### Candidate solve-mode families

```text
identifyWholeNumberPairForEquation
evaluateAfterSpecifiedWholeNumberSwap
selectCorrectEquationAfterWholeNumberSwap
```

Same-side versus cross-side occurrence is an instance dimension unless runtime proof shows a distinct misconception profile requiring a retained QL.

## 10. `OPS-CP-007` — Digit-identity interchange

### Ownership

- digit identities are swapped inside one or more numeric literals;
- scope is explicitly global or otherwise tightly specified;
- leading-zero and literal-validity rules apply.

### Why it cannot remain merged with CP-006

Digit interchange differs in every critical layer:

| Layer | Whole-number swap | Digit swap |
|---|---|---|
| Unit transformed | numeric token | character/digit identity |
| Internal literal changes | no | yes |
| Leading-zero risk | no | yes |
| Repeated occurrence handling | token identity | every digit occurrence |
| Canonicalisation | exact numeric token pair | digit permutation plus scope |
| Explanation | swap two values | rewrite affected literals |
| Ambiguity pool | numeric-token pairs | digit pairs |

This is a mandatory checkpoint split.

### Candidate solve-mode families

```text
identifyGlobalDigitPairForEquation
evaluateAfterSpecifiedGlobalDigitSwap
selectCorrectEquationAfterDigitSwap
```

Occurrence-specific digit swaps are deferred unless authentic source evidence justifies them. Global identity swap is the V1 default.

## 11. `OPS-CP-008` — Combined operator and numeric interchange

### Ownership

- one option or instruction requires both an operator-token transformation and a numeric transformation;
- numeric component may be whole-number or digit identity;
- all components apply to the original expression under canonical simultaneous composition.

### Why separate from CP-005/006/007

Compound transformation changes:

- answer semantic;
- candidate enumeration product;
- distractor architecture;
- explanation trace;
- difficulty computation;
- rejection rate.

Typical distractors intentionally apply only one component. That misconception cannot be represented naturally in a single-family checkpoint.

### Candidate solve-mode families

```text
identifyOperatorAndWholeNumberSwap
identifyOperatorAndDigitSwap
identifyTwoOperatorsAndTwoValuesSwap
evaluateAfterSpecifiedOperatorAndNumericSwap
selectCorrectCompoundSwap
```

Whole-number and digit compound forms remain in one checkpoint because the defining architecture is composition across token domains. The numeric subtype is explicit metadata and calls CP-006/007-compatible helpers.

## 12. `OPS-CP-009` — Hidden operator mapping and equation puzzles

### Ownership

- operation meanings are not supplied directly;
- examples constrain one hidden mapping or operation rule;
- student infers the mapping and applies it to a target.

### Why separate from supplied mapping

The solver must enumerate candidate mappings and prove evidence sufficiency. The generator must construct examples from hidden state and reject collisions.

```text
choose hidden mapping
  -> derive examples
  -> enumerate eligible mappings independently
  -> require unique surviving mapping
  -> solve target
```

### Candidate solve-mode families

```text
inferTwoTokenMappingFromExamples
inferMultiTokenMappingFromExamples
inferMappingAndEvaluateTarget
inferMappingAndRecoverResult
inferMappingAndSelectEquation
recoverOneUnknownOperationMeaning
selectMappingConsistentWithExamples
```

### Boundary with number analogy

Only fixed symbol/operator semantics belong here.

A puzzle such as `5 + 7 = 47` that uses an arbitrary numeric formula rather than redefining the displayed operator may belong to Number Analogy or Missing Number unless the chapter contract explicitly defines a bounded equation-rule grammar. This boundary must be enforced in the candidate audit.

## 13. Rejected checkpoint proposals

## 13.1 Separate bracketed-expression checkpoint

Rejected. Brackets alter expression complexity but use the same parser and solver.

## 13.2 Separate decimal checkpoint

Rejected. Finite decimals are exact numeric literals, not a new reasoning topology.

## 13.3 Separate negative-result checkpoint

Rejected. Negative outcomes are exact-value domain coverage.

## 13.4 Separate correct-versus-incorrect checkpoint

Rejected. Polarity is normally a query parameter.

## 13.5 Separate Banking/Punjab checkpoints

Rejected. Exam family and locale do not define reasoning topology.

## 13.6 Separate prescribed and inferred operator-swap checkpoints

Rejected. One applies a known candidate; the other enumerates candidates, but they share the same transformation foundation and ambiguity pool. They may remain separate QLs within CP-005.

## 13.7 Merge supplied and hidden mappings

Rejected. Evidence inference and ambiguity enumeration make CP-009 materially different.

## 14. Dependency order

Recommended implementation order after manifest freeze:

```text
Foundation exact parser/evaluator
  -> OPS-CP-001 given arithmetic-sign mapping
  -> OPS-CP-005 operator interchange
  -> OPS-CP-004 fill solver
  -> OPS-CP-002 arbitrary tokens
  -> OPS-CP-003 relation mapping
  -> OPS-CP-006 whole-number interchange
  -> OPS-CP-007 digit interchange
  -> OPS-CP-008 compound interchange
  -> OPS-CP-009 hidden mapping
```

Rationale:

- CP-001 proves mapping, parsing, exact evaluation and explanation traces;
- CP-005 proves simultaneous transformation and candidate enumeration;
- CP-004 proves constraint search and uniqueness;
- later checkpoints reuse these stable capabilities.

## 15. Shared helper extraction policy

Checkpoint code may share OPS-local foundation modules immediately.

Cross-chapter extraction into a Reasoning-wide symbolic library should occur only after another chapter demonstrates the same stable contract.

Initial OPS-local modules may include:

```text
exact-rational.ts
numeric-literal.ts
token-types.ts
tokenizer.ts
transformations.ts
parser.ts
evaluator.ts
relation-validator.ts
option-canonicalizer.ts
ambiguity-enumerator.ts
explanation-trace.ts
localization-keys.ts
```

## 16. QL allocation policy after this decision

Checkpoint ownership is frozen, but QL counts are still discovered.

For each checkpoint:

1. enumerate candidate contracts from the provisional coverage manifest;
2. merge parameter-only variants;
3. split candidates with distinct ambiguity or answer semantics;
4. assign a provisional retained count;
5. run forward/inverse gap audit;
6. run representation and locale audit;
7. freeze QL IDs and ranges only after zero material gaps remain.

No checkpoint receives a quota in advance.

## 17. Checkpoint freeze verdict

```text
CHECKPOINT_STRUCTURE = PASS
CHECKPOINT_COUNT = 9
QL_COUNT = UNFROZEN
SOLVE_MODE_COUNT = UNFROZEN
QL_RANGES = UNALLOCATED
```

The nine checkpoints now provide stable ownership boundaries for the final candidate-Ql consolidation stage.
