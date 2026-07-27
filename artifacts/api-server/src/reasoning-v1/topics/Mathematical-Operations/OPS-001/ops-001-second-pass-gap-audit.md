# ExamTree Reasoning V1 — OPS-001 Second-Pass Coverage and Gap Audit

Document status: active design audit. This document does not freeze checkpoint counts, QL counts, solve-mode counts, or QL ranges.

## 1. Purpose

This audit expands the initial `OPS-001` design using a second source pass across:

- `reasoning_aggarwal.pdf`, Chapter 5 — Symbols and Notations;
- the separate uploaded `reasoning book.pdf` miscellaneous SSC question bank;
- `30 Yearwise SSC CGL Solved Paper (English) 2024.pdf`;
- the ExamTree Reasoning master blueprint and implementation architecture.

The audit asks five questions:

1. Which source-backed task topologies were absent or under-specified?
2. Which existing provisional checkpoints need a split, merge, or stronger boundary?
3. Which runtime types are currently too weak for the observed corpus?
4. Which apparent source questions actually belong to another chapter?
5. Which evidence gaps remain before a chapter manifest can be frozen?

## 2. Second-pass source findings

### 2.1 Exact finite-decimal operands are source-backed

The source corpus contains mapped-operation expressions using values such as:

```text
0.02
0.0625
```

This means an OPS tokenizer cannot be integer-only even when the final answer is normally integral.

Required runtime decision:

```ts
type NumericLiteral =
  | { kind: "INTEGER_LITERAL"; source: string; value: bigint }
  | {
      kind: "FINITE_DECIMAL_LITERAL";
      source: string;
      numerator: bigint;
      denominator: bigint;
    };
```

Finite decimals must be converted exactly to reduced rational values. Binary floating-point evaluation is prohibited.

Examples:

```text
0.02   -> 2/100 -> 1/50
0.0625 -> 625/10000 -> 1/16
```

This is a foundation requirement, not a new QL by itself.

### 2.2 An arithmetic sign may be interchanged with the equality sign

A source-backed equation-repair pattern offers a pair such as:

```text
÷ and =
```

The transformation changes the location at which the expression is split into left and right sides. This is materially different from swapping two arithmetic operators while keeping the relation fixed.

Required solve-mode addition:

```text
identifyArithmeticRelationPairSwapForEquation
```

Required solver behaviour:

```text
apply the pair swap simultaneously to the original typed token stream
  -> locate the resulting top-level relation token
  -> reject if zero or more than one relation remains
  -> parse both arithmetic sides from scratch
  -> evaluate both sides exactly
  -> accept only if the target relation is true
```

This remains an interchange task, not a direct relation-mapping task.

### 2.3 Supplied mappings may be many-to-one

The source corpus includes supplied mappings where more than one displayed sign may denote the same semantic arithmetic operation. Therefore, direct supplied mappings must not assume a permutation or bijection.

Required metadata:

```ts
type MappingCardinality =
  | "BIJECTIVE_ACTIVE_DOMAIN"
  | "INJECTIVE_ACTIVE_DOMAIN"
  | "MANY_TO_ONE_ALLOWED";
```

Policy:

- given mappings may be many-to-one when stated explicitly;
- hidden-mapping inference normally uses bijective or injective active mappings in the first implementation phase;
- a hidden many-to-one mapping requires stronger evidence and a separate ambiguity policy;
- a QL may not silently infer bijection merely because four familiar arithmetic signs are displayed.

### 2.4 Negative equation results are source-backed

Equation-repair items may have a negative target, for example a right side such as `−4`.

Required consequences:

- unary minus must be a first-class token and AST node;
- the renderer must keep the minus attached to the value;
- negative literals must not be confused with subtraction;
- distractors must include sign-loss errors only when they remain unique;
- equation construction must support negative left- or right-side values inside safe bounds.

Required error labels:

```text
NEGATIVE_TARGET_SIGN_DROPPED
UNARY_MINUS_TREATED_AS_SUBTRACTION
```

### 2.5 Prescribed combined operator-and-digit interchange is source-backed

One source pattern prescribes both:

```text
one operator pair interchange
one digit pair interchange
```

and asks which complete equation becomes correct.

Required solve modes:

```text
evaluateAfterSpecifiedOperatorAndDigitSwap
selectCorrectEquationAfterSpecifiedOperatorAndDigitSwap
```

This differs from asking the student to identify the compound transformation.

### 2.6 Whole-number and digit interchange require global identity semantics

The second pass reinforces that these are separate transformations.

#### Whole-number token interchange

```text
24 <-> 36
```

Every numeric token canonically equal to 24 becomes 36 and every numeric token canonically equal to 36 becomes 24 under a global-token contract.

#### Digit identity interchange

```text
3 <-> 6
```

Every in-scope decimal digit `3` becomes `6` and every in-scope decimal digit `6` becomes `3` simultaneously.

Mandatory digit policies:

```ts
type DigitSwapScope =
  | "ALL_NUMERIC_LITERALS"
  | "DECLARED_EXPRESSION_SIDE"
  | "DECLARED_TOKEN_POSITIONS";
```

Production V1 default:

```text
ALL_NUMERIC_LITERALS
```

Occurrence-specific digit swaps remain deferred unless further source evidence shows that they are common and unambiguous.

### 2.7 Relation-chain inference found in a miscellaneous bank is not OPS ownership

A source bank places a question involving statements resembling an inequality chain near mathematical-operator questions. Its task is to infer a definite conclusion from relational statements.

Boundary decision:

```text
symbol replacement + arithmetic truth test -> OPS-001
comparison chain + conclusion inference     -> Inequality
```

Physical adjacency in a book or miscellaneous question bank does not determine ExamTree chapter ownership.

### 2.8 Exact rational and exact-decimal option rendering are both needed

Source options may display:

- integers;
- common fractions or mixed fractions;
- terminating decimals.

The answer semantic remains exact rational. Presentation is separate.

Required representation type:

```ts
type ExactNumberPresentation =
  | "INTEGER"
  | "REDUCED_FRACTION"
  | "MIXED_FRACTION"
  | "TERMINATING_DECIMAL";
```

Canonical equivalence examples:

```text
3/2 = 1 1/2 = 1.5
```

Semantic duplicate options must be rejected even when their rendered forms differ.

### 2.9 Mapping statements may contain unused supplied entries

A real examination may state meanings for all four common arithmetic signs while the target expression uses only two or three.

Refined rule:

- every active target token must have a supplied meaning;
- unused supplied mapping entries are allowed;
- an unused mapping entry does not create a new reasoning step;
- difficulty must be based on active mapping size, not merely stated mapping size;
- explanations should normally mention only mappings used by the target unless the question asks for a full mapping analysis.

### 2.10 Operator-fill questions need an operator-multiset policy

The source corpus contains options where:

- every supplied sign is used exactly once;
- signs may repeat;
- `=` may be one member of the inserted sequence;
- options themselves define the permissible sequence rather than a free operator pool.

Required metadata:

```ts
type FillOperatorPolicy =
  | "USE_EACH_ALLOWED_TOKEN_ONCE"
  | "REUSE_ALLOWED"
  | "OPTIONS_DEFINE_CANDIDATES";
```

The solver must not assume one policy from another.

### 2.11 Display glyph normalisation needs an explicit layer

Observed or likely source forms include:

```text
×
x
X
*
÷
/
−
-
```

Required distinction:

- canonical semantic operators;
- accepted input/source aliases;
- rendered examination glyphs;
- placeholders that may visually resemble multiplication.

A source `*` is often a blank placeholder, not multiplication. Normalisation must be QL-aware.

## 3. Expanded solve-mode discovery ledger

The following ledger extends, but does not freeze, the first-pass inventory.

### 3.1 Given arithmetic-sign mapping

```text
evaluateBasicExpressionAfterOperatorPermutation
evaluateLongExpressionAfterOperatorPermutation
evaluateBracketedExpressionAfterOperatorPermutation
evaluateExpressionAfterPartialOperatorRemapping
evaluateExpressionAfterManyToOneOperatorMapping
evaluateExpressionWithRepeatedMappedOperators
evaluateExpressionWithFiniteDecimalOperands
recoverMissingResultAfterGivenMapping
selectTrueEquationAfterGivenMapping
selectFalseEquationAfterGivenMapping
selectTrueEquationAfterManyToOneMapping
```

### 3.2 Arbitrary supplied operation tokens

```text
evaluateExpressionWithLetterOperatorTokens
evaluateExpressionWithPunctuationOperatorTokens
evaluateExpressionWithArrowOrShapeTokens
evaluateExpressionWithWordOperatorTokens
evaluateBracketedArbitraryTokenExpression
evaluateArbitraryTokenExpressionWithFiniteDecimals
recoverMissingResultWithArbitraryTokens
selectTrueEquationWithArbitraryTokens
```

### 3.3 Mixed arithmetic and relation mapping

```text
selectTrueRelationAfterMixedMapping
selectFalseRelationAfterMixedMapping
recoverMissingRelationTokenAfterMapping
identifyCorrectEquationAfterArithmeticRelationMapping
evaluateBothSidesThenSelectRelation
selectTrueStatementWithFiniteDecimalSides
```

### 3.4 Filling operator and relation positions

```text
fillOperatorsWithEqualityFixed
fillOperatorsIncludingEqualityPosition
fillOperatorsForLessThanRelation
fillOperatorsForGreaterThanRelation
fillOperatorsAcrossBracketedGroups
fillRepeatedPlaceholderSequentially
fillUsingEachAllowedTokenOnce
fillWithOperatorReuseAllowed
fillFromOptionDefinedCandidateSequences
recoverSingleMissingOperator
recoverMissingRelationToken
selectUniqueBalancingOperatorSequence
```

### 3.5 Operator interchange

```text
evaluateAfterSpecifiedSingleOperatorPairSwap
evaluateAfterSpecifiedDoubleOperatorPairSwap
identifySingleOperatorPairSwapForEquation
identifyTwoOperatorPairSwapsForEquation
identifyArithmeticRelationPairSwapForEquation
selectCorrectEquationAfterSpecifiedSwap
selectCorrectEquationAfterArithmeticRelationSwap
verifyEquationAfterGlobalOperatorSwap
```

### 3.6 Whole-number interchange

```text
identifyWholeNumberPairSwapForEquation
identifyCrossSideNumberPairSwapForEquation
identifySameSideNumberPairSwapForEquation
evaluateAfterSpecifiedNumberSwap
selectCorrectEquationAfterSpecifiedNumberSwap
```

### 3.7 Digit interchange

```text
identifyDigitPairSwapForEquation
evaluateAfterSpecifiedDigitSwap
selectCorrectEquationAfterSpecifiedDigitSwap
identifyDigitPairSwapWithRepeatedOccurrences
```

### 3.8 Combined transformations

```text
identifyOperatorAndNumberPairSwap
identifyOperatorAndDigitPairSwap
identifyTwoSignsAndTwoValuesSwap
evaluateAfterSpecifiedOperatorAndValueSwap
evaluateAfterSpecifiedOperatorAndDigitSwap
selectCorrectEquationAfterSpecifiedOperatorAndValueSwap
selectCorrectEquationAfterSpecifiedOperatorAndDigitSwap
selectCorrectCompoundSwapForEquation
```

### 3.9 Hidden mapping and equation puzzles

```text
inferBinaryOperatorMappingFromExamples
inferMultipleOperatorMappingFromExamples
inferMappingThenEvaluateTarget
inferMappingThenRecoverMissingResult
inferMappingThenSelectCorrectEquation
inferMappingWithArithmeticAndRelationOperators
recoverOneUnknownOperatorMeaning
selectPossibleMappingFromExamples
inferMappingWithFiniteDecimalEvidence
```

## 4. Forward, inverse and polarity audit

A surface question is not automatically a separate QL. The following dimensions must be tested against the QL-justification rules.

| Dimension | Forms to audit | Default design treatment |
|---|---|---|
| Query direction | evaluate, repair, infer, fill, verify | often distinct solve modes |
| Mapping visibility | supplied, partially supplied, hidden | distinct runtime topology |
| Equation polarity | correct, incorrect | usually presentation polarity unless distractor and explanation plans differ materially |
| Relation target | `=`, `<`, `>` | typed relation parameter unless insertion changes topology |
| Transformation count | one pair, two pairs, compound | instance difficulty or distinct solve mode depending answer contract |
| Token family | arithmetic glyph, letter, punctuation, word | presentation/locale dimension unless token semantics change |
| Numeric representation | integer, finite decimal, fraction | representation dimension unless parsing/answer contract changes |
| Brackets | none, one layer, nested | difficulty/representation dimension unless target topology changes |
| Placeholder count | one, several | instance property unless answer semantic changes |
| Placeholder policy | use once, reuse, option-defined | distinct solver contract |
| Swap scope | global token, declared positions | distinct transformation contract |
| Value granularity | number token, digit identity | distinct solve mode and likely distinct checkpoint |

## 5. Provisional checkpoint split/merge audit

The checkpoint names below remain provisional.

### 5.1 CP-001 and CP-002 should remain separate

Although both use the same evaluator, they differ in:

- token validation;
- renderer and font risks;
- arbitrary-token datasets;
- locale behaviour for word tokens;
- distractor appearance;
- source ambiguity involving placeholder glyphs.

Decision: retain separate design partitions.

### 5.2 CP-003 should remain separate

Mixed arithmetic/relation mapping requires:

- typed top-level relation ASTs;
- exact comparison;
- a hard boundary with Inequality;
- relation-specific answer types and distractors.

Decision: retain separate design partition.

### 5.3 CP-004 should remain separate

Filling signs is a finite constraint-search problem. It is not a direct mapping or swap problem.

Decision: retain separate design partition.

### 5.4 CP-005 needs an internal relation-swap subfamily

Arithmetic-to-arithmetic interchange and arithmetic-to-relation interchange share simultaneous token swapping, but the latter can relocate the equation boundary.

Decision:

- keep one provisional interchange checkpoint for now;
- define separate rule families and solve modes;
- split later only if runtime, review, or QL volume proves materially different.

### 5.5 CP-006 should be split before manifest freeze

Whole-number interchange and digit interchange differ in:

- transformation granularity;
- token versus character processing;
- leading-zero risk;
- repeated-occurrence semantics;
- option interpretation;
- ambiguity pools;
- explanation wording.

Recommended future partitions:

```text
Whole-number interchange
Digit-identity interchange
```

Do not assign final CP numbers until the chapter-wide split/merge audit is complete.

### 5.6 CP-007 can remain one compound-transformation partition initially

Operator-plus-number and operator-plus-digit tasks share a compound answer and independent full-option verification. Their subtypes must remain typed.

Decision: retain one provisional partition, with separate transformation schemas.

### 5.7 CP-008 should remain separate and last

Hidden mapping inference needs evidence construction and mapping enumeration. It depends on the earlier direct evaluator but has a different ambiguity proof.

Decision: retain separate design partition and implement last.

## 6. Transformation type amendments

Recommended conceptual replacement:

```ts
type OpsTransformation =
  | {
      kind: "GIVEN_OPERATOR_MAPPING";
      mapping: OperatorMapping;
      cardinality: MappingCardinality;
    }
  | {
      kind: "OPERATOR_PAIR_INTERCHANGE";
      pairs: readonly [DisplayToken, DisplayToken][];
      scope: "GLOBAL_TOKEN";
    }
  | {
      kind: "WHOLE_NUMBER_INTERCHANGE";
      pair: readonly [NumericValue, NumericValue];
      scope: "GLOBAL_TOKEN" | "DECLARED_TOKEN_POSITIONS";
    }
  | {
      kind: "DIGIT_IDENTITY_INTERCHANGE";
      pair: readonly [number, number];
      scope: DigitSwapScope;
    }
  | {
      kind: "COMPOUND_INTERCHANGE";
      operatorInterchange?: OpsTransformation;
      numberInterchange?: OpsTransformation;
      digitInterchange?: OpsTransformation;
    }
  | {
      kind: "INSERT_OPERATOR_SEQUENCE";
      operatorPolicy: FillOperatorPolicy;
      sequence: readonly SemanticOperator[];
    }
  | {
      kind: "INFERRED_OPERATOR_MAPPING";
      eligibleMappingFamilyId: string;
    };
```

Each transformation must apply simultaneously within its own identity domain.

## 7. Parser and relation-position amendment

A transformed token stream may relocate its relation token after an arithmetic-relation interchange. Therefore, the parser pipeline must be:

```text
source tokenisation
  -> simultaneous transformation
  -> transformed token validation
  -> relation-boundary discovery
  -> arithmetic parsing of each side
  -> exact evaluation
  -> relation truth test
```

The original displayed relation position must not be cached as authoritative.

Validation after transformation:

- exactly one top-level relation for ordinary equation QLs;
- non-empty left side;
- non-empty right side;
- no relation inside an arithmetic bracket group unless explicitly supported;
- no malformed adjacent values or operators;
- no division by zero;
- no leading-zero integer after a digit swap.

## 8. Ambiguity-pool amendments

### 8.1 Direct supplied mappings

Eligible mistakes and competitors:

```text
identity evaluation
partial mapping
direction-reversed mapping
permutation assumption applied to a many-to-one mapping
left-to-right evaluation
pre-transform precedence
```

### 8.2 Arithmetic-relation interchange

Eligible transformations must include:

- every permitted arithmetic-arithmetic pair;
- every permitted arithmetic-relation pair;
- any simpler one-pair repair when the intended task asks for two pairs;
- canonical duplicate pairs under reversed naming.

### 8.3 Digit interchange

Eligible competitors must include every in-domain digit pair that appears in the expression, not merely the four answer options, for ambiguity auditing.

### 8.4 Compound interchange

A compound instance must be rejected when:

- an operator-only transformation repairs the equation;
- a number-only or digit-only transformation repairs it;
- a different compound transformation repairs it;
- one displayed transformation component is inert;
- two answer options are semantically equivalent.

## 9. Source-quality and malformed-item policy

Books and OCR-derived PDFs may contain:

- corrupted glyphs;
- missing equality signs;
- duplicated option labels;
- an option referring to a value not clearly present;
- ambiguous `x`, `X`, `*`, slash or hyphen characters;
- incorrect worked solutions.

Policy:

1. Source questions are evidence of a task pattern, not unquestioned truth data.
2. Every adopted pattern must be reconstructed and independently solved.
3. Corrupted individual items must not be copied into production datasets.
4. A pattern supported only by a malformed item remains provisional until corroborated.
5. Source provenance should be stored at family level, not exposed in student content.

## 10. Decisions on previous open questions

### 10.1 Powers and roots

Decision: defer from OPS-001 V1 unless a clean, repeated source family explicitly maps symbols to exponentiation or roots.

Reason:

- the current strong corpus is overwhelmingly based on `+`, `−`, `×`, `÷`, and relations;
- adding powers changes arity, precedence and safe-domain constraints;
- ordinary power/root simplification belongs to Quant when no symbolic transformation is tested.

### 10.2 Chained comparisons

Decision: defer.

Ordinary OPS equation QLs require exactly one top-level relation after transformation. Comparison-chain conclusion tasks belong to Inequality.

### 10.3 Occurrence-specific swaps

Decision: defer as a production family.

Global token identity is the default source-backed semantics. Position-specific transformations may be added later only with clear wording and repeated evidence.

### 10.4 Word-token operators

Decision: retain in design but defer from the first multilingual runtime proof.

Early proof should use arithmetic glyphs, letters and font-safe symbols. Word-token operators require locale-adapted infix grammar.

### 10.5 Rational final answers

Decision: permit exact rational semantics, but production sampling should prefer integers and clean terminating decimals or familiar fractions.

### 10.6 “Which equation is incorrect?”

Decision: treat as presentation polarity by default, not automatically a new task kind. Create a distinct QL only if the option construction, ambiguity pool or explanation strategy is materially different.

## 11. Remaining evidence gaps

### 11.1 Banking-specific corpus

Current uploaded searches did not expose a clean, dedicated Banking reasoning corpus for operator substitution. Ordinary Banking simplification questions are not OPS evidence because no symbolic transformation occurs.

Status:

```text
BANKING_DEDICATED_SOURCE_SATURATION = INCOMPLETE
```

### 11.2 Punjab state corpus

Current uploaded searches did not expose a clean, dedicated Punjab state previous-paper set containing OPS questions.

Status:

```text
PUNJAB_DEDICATED_SOURCE_SATURATION = INCOMPLETE
```

The chapter may still target Punjab exams because the logic is language-neutral and common across competitive examinations, but freeze-readiness requires either:

- direct Punjab-paper evidence;
- a documented decision that SSC-style OPS coverage is the adopted Punjab product baseline;
- or both.

### 11.3 Hindi and Punjabi editorial wording

The runtime logic is translatable, but the following phrases require human review:

```text
interchange mutually
replace one-way
replace sequentially
balance the equation
which equation becomes correct
which signs and numbers should be interchanged
```

Status:

```text
HI_PA_TERMINOLOGY_REVIEW = INCOMPLETE
```

## 12. Gap-audit outcome

### Closed or materially resolved

- finite-decimal exactness;
- unary-negative support;
- many-to-one supplied mapping;
- equality-sign interchange;
- fill-operator multiset policy;
- whole-number versus digit semantics;
- prescribed operator-plus-digit transformation;
- relation-chain boundary with Inequality;
- rational presentation equivalence;
- powers/roots V1 decision;
- occurrence-specific swap decision.

### Still open

- dedicated Banking source coverage;
- dedicated Punjab source coverage;
- Hindi and Punjabi terminology review;
- mobile expression-width caps;
- empirical split/merge confirmation through runtime prototypes;
- final QL inventory and ranges.

## 13. Gate decision

```text
SOURCE_SATURATION_GATE        = PARTIAL_PASS
TASK_KIND_DISCOVERY_GATE      = PASS_FOR_CURRENT_CORPUS
SOLVE_MODE_DISCOVERY_GATE     = PARTIAL_PASS
EDGE_CASE_EXPANSION_GATE      = PASS_FOR_CURRENT_CORPUS
REPRESENTATION_GATE           = PASS_FOR_CURRENT_CORPUS
MULTILINGUAL_GATE             = NOT_STARTED
CHECKPOINT_SPLIT_MERGE_GATE   = PARTIAL_PASS
MANIFEST_FREEZE_GATE          = BLOCKED
IMPLEMENTATION_GATE           = BLOCKED EXCEPT ISOLATED FOUNDATION PROTOTYPES
```

The correct next design step is to create a provisional coverage manifest that maps every retained solve-mode candidate to its transformation, answer semantic, ambiguity pool, explanation plan and source evidence. Counts and IDs must remain unfrozen until the remaining source and multilingual gaps are closed.
