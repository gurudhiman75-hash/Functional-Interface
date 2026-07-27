# ExamTree Reasoning V1 — OPS-001 Source Audit

Document status: active source-saturation record. This document does not freeze checkpoint counts, QL counts, solve-mode counts, or QL ranges.

## 1. Chapter identity

- Product chapter: Mathematical Operations and Symbol Substitution
- Chapter ID: `OPS-001`
- Master-blueprint family: Family A — Symbolic and sequence reasoning
- Primary examinations: SSC, Banking and Punjab state examinations
- Primary renderer family: structured text and equation-option layouts
- Runtime logic: language-neutral arithmetic and relation evaluation

OPS-001 owns questions in which the displayed arithmetic signs, arbitrary tokens, values, or operator positions must be transformed, inferred, inserted, or interchanged before the expression can be evaluated or validated.

The chapter is not ordinary arithmetic simplification. The tested skill is correctly reconstructing the intended operation system before applying exact arithmetic precedence.

## 2. Sources reviewed in the first pass

### 2.1 `reasoning_aggarwal.pdf`

Relevant section:

- Chapter 5 — Symbols and Notations
- Book section range: 5-1 through 5-16

The source explicitly separates four broad textbook types:

1. Replacing Arithmetical Signs
2. Filling Arithmetical Signs
3. Interchanging Arithmetical Signs and Values
4. Equation Puzzles

The exercise corpus also contains modern examination-labelled questions from SSC CGL, SSC CPO, SSC CHSL, SSC MTS, SSC GD, Delhi Police and RRB examinations.

### 2.2 `30 Yearwise SSC CGL Solved Paper (English) 2024.pdf`

The 9 September 2024 Shift 1 paper contains a direct double-pair operator-interchange evaluation question. This confirms that the chapter remains current in recent SSC papers and that multi-pair interchange is not merely an older textbook format.

### 2.3 ExamTree Reasoning master architecture notes

The source-review notes classify Mathematical Operations as a separate Family A chapter and warn against merging it with Coding-Decoding. That separation is retained here.

## 3. Confirmed source families

## 3.1 Direct replacement of displayed arithmetic signs

Canonical pattern:

```text
If + means ÷, − means +, × means − and ÷ means ×,
find the value of a displayed expression.
```

Observed variants:

- all four basic arithmetic signs are remapped;
- only two or three displayed signs are remapped;
- mapping forms a complete permutation of `+`, `−`, `×`, `÷`;
- mapping may contain brackets;
- expression may contain repeated operators;
- answer is a number;
- options may instead contain complete equations and ask which statement is true.

Runtime implication:

The mapping must be applied to tokens before parsing precedence. A runtime must never evaluate the displayed expression first and then modify the result.

## 3.2 Arbitrary symbols, letters or words representing operations

Observed token forms:

- letters such as `M`, `N`, `P`, `Q`;
- punctuation such as `$`, `#`, `@`, `%`;
- arrows and comparison-like glyphs;
- ordinary words used as infix tokens.

Observed tasks:

- evaluate one expression after a supplied mapping;
- identify the true equation among options;
- identify a missing result;
- evaluate a bracketed expression.

Boundary rule:

This remains OPS-001 when the mapped tokens represent arithmetic or relation operators and the answer depends on expression evaluation. It belongs to Coding-Decoding when the mapped tokens encode letters, words, messages or semantic labels rather than operations.

## 3.3 Relation-sign substitution

The source includes mappings involving:

- `=`
- `<`
- `>`
- less than
- greater than

Observed task:

- replace every displayed token by its mapped arithmetic or relation meaning and identify the true statement.

Runtime implication:

OPS-001 needs a typed operator system. Arithmetic operators and comparison operators cannot be stored as undifferentiated strings. A valid final expression must have exactly one well-formed top-level relation unless the QL explicitly supports chained comparisons.

## 3.4 Filling missing arithmetic signs

Canonical pattern:

```text
Select the sequence of signs that replaces the blanks or repeated placeholder
symbols and balances the equation.
```

Observed variants:

- the equality sign is already displayed;
- `=` is one of the signs to insert;
- one repeated placeholder such as `*`, `Y`, `A` or `_` marks several positions;
- every placeholder receives a different sequential sign;
- the two sides of the equation may contain brackets;
- options provide complete ordered sign sequences;
- the task may require arithmetic signs plus `<`, `>` or `=`;
- the result may be a relation rather than equality.

Runtime implication:

This is a constraint-search task, not a template-answer task. The solver must enumerate the allowed ordered operator sequences, parse each completed expression, and prove that exactly one option satisfies the target relation.

## 3.5 Interchanging two arithmetic signs

Canonical pattern:

```text
Which two signs should be interchanged to make the equation correct?
```

Observed variants:

- identify the pair from four options;
- a specified pair is given and the transformed expression must be evaluated;
- one pair is interchanged globally across the expression;
- two pairs are interchanged simultaneously;
- identify which resulting equation is correct after the prescribed interchange.

Important semantic rule:

“Interchange `+` and `×`” means every occurrence of `+` becomes `×` and every occurrence of `×` becomes `+`. It does not mean swapping only one selected occurrence unless the stem explicitly says positions or occurrences.

## 3.6 Interchanging values, numbers or digits

Observed variants:

- identify two whole numbers to interchange;
- identify two digits to interchange;
- values may be on the same side or opposite sides of `=`;
- the expression becomes true only after the swap;
- a prescribed value swap may be followed by evaluation.

Runtime implication:

The parser must distinguish a numeric token from its textual digit sequence. “Interchange the numbers 24 and 36” swaps complete numeric tokens. “Interchange the digits 3 and 6” may alter every digit occurrence according to an explicit digit-level policy. These are separate solve modes and cannot share an ambiguous transformation helper.

## 3.7 Combined interchange of signs and values

Observed variants:

- interchange one sign pair and one number pair;
- interchange two signs and two values;
- both transformations may affect both sides of an equation;
- options provide a compound answer such as `× and ÷; 4 and 12`.

Runtime implication:

Transformation order must be explicit but normally commutes because operator tokens and numeric tokens are disjoint. The validator should nevertheless apply transformations in a canonical order and fingerprint the final transformed AST.

## 3.8 Hidden equation puzzles

Canonical pattern:

```text
Several example equations use displayed signs with unknown meanings.
Infer the operation represented by each sign and apply the same mapping to a target.
```

Observed example family:

```text
A ÷ B × C is discovered from examples to mean (A + B) ÷ C.
```

Observed tasks:

- infer a fixed symbol-to-operator mapping from two or more examples;
- apply it to a new expression;
- recover a missing result;
- identify the correct mapping or correct option;
- reject competing mappings that also fit a subset of examples.

Runtime implication:

The hidden mapping is the authoritative state. The generator must first choose a mapping and construct examples that uniquely identify it. The independent solver must re-enumerate eligible mappings from displayed evidence rather than reading the generator’s hidden answer.

## 4. Provisional task-kind inventory

Counts remain deliberately unfrozen.

```text
EVALUATE_AFTER_GIVEN_MAPPING
EVALUATE_AFTER_GIVEN_INTERCHANGE
IDENTIFY_TRUE_STATEMENT_AFTER_MAPPING
IDENTIFY_CORRECT_EQUATION_AFTER_MAPPING
RECOVER_MISSING_RESULT_AFTER_MAPPING
FILL_OPERATOR_SEQUENCE_FOR_EQUALITY
FILL_OPERATOR_SEQUENCE_FOR_RELATION
INSERT_EQUALITY_WITH_OPERATORS
IDENTIFY_OPERATOR_PAIR_TO_SWAP
IDENTIFY_TWO_OPERATOR_PAIRS_TO_SWAP
IDENTIFY_VALUE_PAIR_TO_SWAP
IDENTIFY_DIGIT_PAIR_TO_SWAP
IDENTIFY_OPERATOR_AND_VALUE_SWAP
INFER_HIDDEN_OPERATOR_MAPPING
INFER_MAPPING_AND_EVALUATE_TARGET
INFER_MAPPING_AND_IDENTIFY_TRUE_STATEMENT
VERIFY_WHETHER_TRANSFORMATION_BALANCES
```

This inventory is a discovery baseline, not a final registry.

## 5. Provisional solve-mode discovery ledger

### Given mapping and direct evaluation

```text
evaluateBasicExpressionAfterOperatorPermutation
evaluateBracketedExpressionAfterOperatorPermutation
evaluateExpressionAfterPartialOperatorRemapping
evaluateExpressionWithRepeatedMappedOperators
evaluateExpressionWithLetterOperatorTokens
evaluateExpressionWithSymbolOperatorTokens
evaluateExpressionWithWordOperatorTokens
recoverMissingResultAfterGivenMapping
selectTrueEquationAfterGivenMapping
selectTrueRelationAfterMixedArithmeticComparisonMapping
```

### Filling operators

```text
fillOperatorsWithEqualityFixed
fillOperatorsIncludingEqualityPosition
fillOperatorsForLessThanRelation
fillOperatorsForGreaterThanRelation
fillOperatorsAcrossBracketedGroups
fillRepeatedPlaceholderSequentially
selectUniqueBalancingOperatorSequence
recoverSingleMissingOperator
recoverMissingRelationToken
```

### Operator interchange

```text
evaluateAfterSpecifiedSingleOperatorPairSwap
evaluateAfterSpecifiedDoubleOperatorPairSwap
identifySingleOperatorPairSwapForEquation
identifyTwoOperatorPairSwapsForEquation
selectCorrectEquationAfterSpecifiedSwap
verifyEquationAfterGlobalOperatorSwap
```

### Value and digit interchange

```text
identifyWholeNumberPairSwapForEquation
identifyCrossSideNumberPairSwapForEquation
identifySameSideNumberPairSwapForEquation
identifyDigitPairSwapForEquation
evaluateAfterSpecifiedNumberSwap
```

### Combined transformations

```text
identifyOperatorAndNumberPairSwap
identifyOperatorAndDigitPairSwap
identifyTwoSignsAndTwoValuesSwap
evaluateAfterSpecifiedOperatorAndValueSwap
```

### Hidden mapping and equation puzzles

```text
inferBinaryOperatorMappingFromExamples
inferMultipleOperatorMappingFromExamples
inferMappingThenEvaluateTarget
inferMappingThenRecoverMissingResult
inferMappingThenSelectCorrectEquation
inferMappingWithArithmeticAndRelationOperators
```

## 6. Presentation modes observed or required

```text
INLINE_EXPRESSION
MAPPING_PLUS_EXPRESSION
MAPPING_TABLE
EQUATION_OPTIONS
OPERATOR_SEQUENCE_OPTIONS
SWAP_PAIR_OPTIONS
COMPOUND_SWAP_OPTIONS
EXAMPLE_EQUATIONS_PLUS_TARGET
BRACKETED_EXPRESSION
TWO_SIDED_EQUATION
RELATION_STATEMENT_OPTIONS
```

## 7. Answer types observed or required

```text
INTEGER
RATIONAL
OPERATOR
RELATION_OPERATOR
OPERATOR_SEQUENCE
OPERATOR_PAIR
TWO_OPERATOR_PAIRS
NUMBER_PAIR
DIGIT_PAIR
OPERATOR_AND_VALUE_SWAP
EQUATION_OPTION
STATEMENT_OPTION
BOOLEAN
```

Production should prefer exact integers. Rational answers are allowed only when the stem and options present them clearly and the chapter validator confirms exact equivalence.

## 8. Boundary and overlap audit

### Included in OPS-001

- replacing arithmetic signs before evaluation;
- arbitrary tokens representing arithmetic or relation operators;
- filling operator positions to satisfy an equation or relation;
- swapping operator meanings globally;
- swapping numeric values or digits to repair an equation;
- combined sign-and-value swaps;
- inferring operator meanings from example equations;
- validating which transformed equation or statement is true.

### Excluded from OPS-001

- ordinary BODMAS simplification with no transformation — Quantitative Aptitude;
- number analogy and number-pair rules — Analogy;
- missing-number grids, triangles or matrices — Missing Number / Matrix;
- symbols denoting family relationships — Blood Relations;
- inequality chains from which conclusions are inferred — Inequality;
- letters or symbols encoding words and messages — Coding-Decoding;
- arithmetic word problems where operations are not symbolically transformed — Quantitative Aptitude;
- input-output machines with multiple transformation stages — Input-Output.

### Collision rule with Inequality

A one-expression question that remaps symbols and asks which completed arithmetic comparison is true belongs to OPS-001. A question that supplies relational statements such as `A > B ≥ C` and asks which conclusion follows belongs to Inequality.

### Collision rule with Coding-Decoding

The decisive test is the target semantic:

- if tokens map to operators and the target is an arithmetic/relation result, use OPS-001;
- if tokens map to letters, words, codes or semantic messages, use COD-001.

## 9. Initial source conclusions

1. The chapter is broader than direct sign replacement.
2. Operator filling, operator swapping, value swapping and hidden mapping need different solvers.
3. `=` must sometimes be treated as an insertable token rather than fixed punctuation.
4. Arithmetic and relation operators need typed AST nodes.
5. Whole-number swaps and digit swaps require separate semantics.
6. Global token interchange must be distinguished from occurrence-level positional swapping.
7. Recent SSC papers continue to use double-pair operator interchange.
8. All accepted instances require uniqueness proof across the eligible transformation pool.
9. QL counts and checkpoint counts must remain open until source and edge-case saturation are complete.

## 10. Remaining source-saturation work

- scan all uploaded SSC papers for operator and value-interchange questions;
- sample banking and Punjab state paper patterns separately;
- measure the frequency of comparison-sign variants;
- identify whether unary minus, powers, roots or percentages appear in authentic chapter questions;
- identify whether digit-level swaps are globally or occurrence-wise defined in source stems;
- record bracket depth and expression length distributions;
- audit Hindi and Punjabi examination wording for “means”, “interchanged”, “sequentially”, “balance” and relation terms;
- run a final chapter-overlap audit against Coding-Decoding and Inequality;
- freeze CP ownership only after no meaningful uncovered task topology remains.
