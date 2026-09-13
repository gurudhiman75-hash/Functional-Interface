# ExamTree Reasoning V1 — OPS-001 End-to-End Design

Document status: active discovery blueprint. Checkpoint partitions, QL counts, solve-mode counts and QL ranges are not frozen.

This document governs the design of `OPS-001 — Mathematical Operations and Symbol Substitution`. It must be read with:

- `REASONING-V1-MASTER-BLUEPRINT.md`
- `REASONING-V1-ARCHITECTURE.md`
- `ops-001-source-audit.md`

## 1. Product objective

OPS-001 must generate authentic competitive-exam questions in which the student reconstructs a transformed operation system and then evaluates or validates the resulting expression.

A valid OPS-001 instance contains the following logical stages:

```text
transformation contract
  -> displayed expression or equation
  -> transformed token stream
  -> exact parsed expression
  -> exact evaluation or truth test
  -> unique answer proof
```

The transformation contract is authoritative. The displayed stem, options, answer, explanation and metadata are derived from it.

The chapter must not degrade into a bank of manually authored arithmetic strings with stored answers. Every instance must be generated from structured state and independently re-solved.

## 2. Chapter boundary

OPS-001 owns:

- supplied operator-meaning substitution;
- arbitrary operation-token substitution;
- arithmetic plus comparison-token substitution;
- filling missing operator positions;
- inserting an equality or comparison token;
- identifying or applying operator interchanges;
- identifying or applying numeric-value interchanges;
- identifying or applying digit interchanges where explicitly defined;
- combined sign-and-value interchange;
- inferring a hidden operator mapping from example equations;
- evaluating the transformed target;
- identifying the uniquely true transformed equation or statement.

OPS-001 excludes:

- ordinary arithmetic evaluation without a symbolic transformation;
- number analogy and missing-number patterns;
- code systems that encode language rather than operations;
- family-relation symbols;
- inequality conclusion inference;
- broad input-output transformation machines;
- arithmetic word problems whose challenge is mathematical modelling rather than operator reconstruction.

## 3. Core domain model

The implementation should expose concepts equivalent to the following.

```ts
type OpsLocaleMode =
  | "TRANSLATABLE"
  | "LANGUAGE_ADAPTED"
  | "LANGUAGE_SPECIFIC";

type ArithmeticOperator = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE";

type RelationOperator = "EQUAL" | "LESS_THAN" | "GREATER_THAN";

type SemanticOperator = ArithmeticOperator | RelationOperator;

type DisplayToken =
  | { kind: "ARITHMETIC_SIGN"; value: "+" | "−" | "×" | "÷" }
  | { kind: "RELATION_SIGN"; value: "=" | "<" | ">" }
  | { kind: "LETTER_TOKEN"; value: string }
  | { kind: "SYMBOL_TOKEN"; value: string }
  | { kind: "WORD_TOKEN"; value: string };

type NumericValue =
  | { kind: "INTEGER"; value: bigint }
  | { kind: "RATIONAL"; numerator: bigint; denominator: bigint };

type OpsAnswerType =
  | "INTEGER"
  | "RATIONAL"
  | "OPERATOR"
  | "RELATION_OPERATOR"
  | "OPERATOR_SEQUENCE"
  | "OPERATOR_PAIR"
  | "TWO_OPERATOR_PAIRS"
  | "NUMBER_PAIR"
  | "DIGIT_PAIR"
  | "OPERATOR_AND_VALUE_SWAP"
  | "EQUATION_OPTION"
  | "STATEMENT_OPTION"
  | "BOOLEAN";

interface OpsQuestionLogic {
  qlId: string;
  checkpointId: string;
  ruleId: string;
  taskKind: string;
  solveMode: string;
  presentationMode: string;
  answerType: OpsAnswerType;
  renderer: string;
  localeMode: OpsLocaleMode;
  difficultyProfile: string;
  eligibleTransformationIds: readonly string[];
  status: "DRAFT" | "IMPLEMENTED" | "REVIEWED" | "FROZEN";
}

interface OperatorMapping {
  entries: readonly {
    displayToken: DisplayToken;
    semanticOperator: SemanticOperator;
  }[];
  fingerprint: string;
}

interface OperatorFillProblem {
  operands: readonly NumericValue[];
  placeholderPositions: readonly number[];
  allowedOperators: readonly SemanticOperator[];
  relationPositionPolicy: "FIXED" | "INSERTABLE";
  targetRelation?: RelationOperator;
}

interface InterchangeTransformation {
  operatorPairs?: readonly [DisplayToken, DisplayToken][];
  numberPairs?: readonly [NumericValue, NumericValue][];
  digitPairs?: readonly [number, number][];
  scope: "GLOBAL_TOKEN" | "SPECIFIED_OCCURRENCES";
}
```

The production types may differ syntactically, but the distinctions above must remain explicit.

## 4. Expression architecture

## 4.1 Tokenizer

The tokenizer must produce typed tokens for:

- integers;
- unary negative values;
- arithmetic display tokens;
- relation display tokens;
- arbitrary operation tokens;
- left and right brackets;
- placeholders;
- separators used only for rendering.

It must reject:

- malformed adjacent operands;
- unbalanced brackets;
- unknown tokens;
- ambiguous use of the ordinary hyphen as both subtraction and negative sign;
- multiple top-level relations unless a QL explicitly supports a relation chain;
- empty bracket groups;
- implicit multiplication unless explicitly supported by the QL.

## 4.2 Transformation layer

Transformations act on typed tokens before arithmetic parsing.

Required transformation classes:

```text
MAP_DISPLAY_TOKEN_TO_SEMANTIC_OPERATOR
GLOBAL_OPERATOR_PAIR_SWAP
GLOBAL_TWO_OPERATOR_PAIR_SWAP
POSITIONAL_OPERATOR_REPLACEMENT
WHOLE_NUMBER_TOKEN_SWAP
DIGIT_MAPPING_SWAP
COMBINED_OPERATOR_AND_VALUE_SWAP
INSERT_OPERATOR_SEQUENCE
INFERRED_OPERATOR_MAPPING
```

Every transformation must expose:

- a stable transformation ID;
- typed parameters;
- an invertibility classification;
- a canonical fingerprint;
- a human-readable trace;
- validation of whether the transformation is applicable to the displayed token stream.

## 4.3 Parser and AST

After transformation, the runtime parses an exact AST with ordinary precedence:

1. bracketed subexpressions;
2. multiplication and division, left associative;
3. addition and subtraction, left associative;
4. one top-level relation where required.

The runtime must not implement “BODMAS” as ad hoc string replacement.

Conceptual AST:

```ts
type ArithmeticAst =
  | { kind: "VALUE"; value: NumericValue }
  | { kind: "UNARY_NEGATE"; child: ArithmeticAst }
  | {
      kind: "BINARY";
      operator: ArithmeticOperator;
      left: ArithmeticAst;
      right: ArithmeticAst;
    };

interface RelationAst {
  kind: "RELATION";
  operator: RelationOperator;
  left: ArithmeticAst;
  right: ArithmeticAst;
}
```

## 4.4 Exact evaluator

All evaluation must use exact integers or reduced rational numbers.

Required helpers:

```text
makeInteger
makeRational
reduceRational
addExact
subtractExact
multiplyExact
divideExact
compareExact
isInteger
formatExactValue
```

Division by zero is always rejected.

Production preference:

- prefer integer final answers;
- prefer integer intermediate values for Easy and most Medium instances;
- permit exact rational intermediates when the final result is clean and the expression remains exam-realistic;
- never use binary floating-point equality to validate an equation.

## 5. Standard generation pipeline

```text
QL lookup
  -> seeded PRNG
  -> construct transformation contract
  -> construct canonical solved AST or target truth condition
  -> derive displayed token stream by inverse transformation
  -> render mapping, equation or placeholders
  -> independently reapply transformation
  -> independently tokenize and parse
  -> exact evaluation or relation test
  -> eligible-transformation ambiguity audit
  -> distractor construction from error models
  -> independent option validation
  -> deterministic option shuffle
  -> explanation trace
  -> localization
  -> final contract validation
```

For inverse-generated questions, the generator should begin from a valid transformed expression and encode it into the displayed form. This is safer than randomly assembling a displayed expression and hoping that the transformation produces a usable result.

Candidate rejection must be deterministic and bounded. Each checkpoint will define a maximum-attempt policy and return structured rejection diagnostics.

## 6. Discovery checkpoint partitions

These are provisional ownership partitions for design and source auditing. They may be split or merged before manifest freeze. No QL ranges are allocated.

## 6.1 `OPS-CP-001` — Given arithmetic-sign mapping

Ownership:

- ordinary displayed arithmetic signs are assigned different arithmetic meanings;
- the mapping is supplied directly;
- the student evaluates a target or selects a true equation.

Discovery solve modes:

```text
evaluateBasicExpressionAfterOperatorPermutation
evaluateLongExpressionAfterOperatorPermutation
evaluateBracketedExpressionAfterOperatorPermutation
evaluateExpressionAfterPartialOperatorRemapping
evaluateExpressionWithRepeatedMappedOperators
recoverMissingResultAfterGivenMapping
selectTrueEquationAfterGivenMapping
selectFalseEquationAfterGivenMapping
```

Key audits:

- every displayed mapped sign must occur where the QL claims full mapping coverage;
- mapping must not be identity unless identity is an intentional trap;
- direct and inverse mapping wording must not be confused;
- precedence must be applied after replacement;
- exactly one option must match the exact result.

## 6.2 `OPS-CP-002` — Arbitrary operation tokens

Ownership:

- letters, punctuation, shapes or words stand for arithmetic operators;
- the mapping is supplied;
- the target is arithmetic evaluation or equation truth.

Discovery solve modes:

```text
evaluateExpressionWithLetterOperatorTokens
evaluateExpressionWithPunctuationOperatorTokens
evaluateExpressionWithArrowOrShapeTokens
evaluateExpressionWithWordOperatorTokens
evaluateBracketedArbitraryTokenExpression
recoverMissingResultWithArbitraryTokens
selectTrueEquationWithArbitraryTokens
```

Token-policy requirements:

- active tokens must be visually distinct;
- no token may be confused with a decimal point, negative sign, option label or renderer control;
- word tokens require locale adaptation and may be excluded from early runtime proof;
- symbol pools must be reviewed for Hindi and Punjabi font support.

## 6.3 `OPS-CP-003` — Mixed arithmetic and relation mapping

Ownership:

- display tokens map to arithmetic operations and to `=`, `<` or `>`;
- the answer is the true statement, relation or missing relation token.

Discovery solve modes:

```text
selectTrueRelationAfterMixedMapping
selectFalseRelationAfterMixedMapping
recoverMissingRelationTokenAfterMapping
identifyCorrectEquationAfterArithmeticRelationMapping
evaluateBothSidesThenSelectRelation
```

Structural restrictions:

- a completed option normally has exactly one top-level relation;
- chained relations require a separate explicit QL contract;
- options must not differ only through typographic ambiguity;
- equality and inequality must be evaluated exactly.

## 6.4 `OPS-CP-004` — Filling operator and relation positions

Ownership:

- one or more positions are blank;
- options supply ordered operators;
- the completed expression must satisfy equality or a stated relation.

Discovery solve modes:

```text
fillOperatorsWithEqualityFixed
fillOperatorsIncludingEqualityPosition
fillOperatorsForLessThanRelation
fillOperatorsForGreaterThanRelation
fillOperatorsAcrossBracketedGroups
fillRepeatedPlaceholderSequentially
recoverSingleMissingOperator
recoverMissingRelationToken
selectUniqueBalancingOperatorSequence
```

Construction model:

```text
choose a valid completed relation AST
  -> remove selected operator tokens
  -> generate or validate competing operator sequences
  -> retain only if exactly one allowed sequence satisfies the target
```

The generator must not simply choose a correct option and create random incorrect sequences. All option sequences must be evaluated independently.

## 6.5 `OPS-CP-005` — Operator interchange

Ownership:

- one or two operator pairs are interchanged globally;
- the interchange may be prescribed or inferred;
- the target is evaluation, equation repair or correct-option selection.

Discovery solve modes:

```text
evaluateAfterSpecifiedSingleOperatorPairSwap
evaluateAfterSpecifiedDoubleOperatorPairSwap
identifySingleOperatorPairSwapForEquation
identifyTwoOperatorPairSwapsForEquation
selectCorrectEquationAfterSpecifiedSwap
verifyEquationAfterGlobalOperatorSwap
```

Mandatory semantics:

- pair interchange is simultaneous;
- it applies to every occurrence of each token unless occurrence-level scope is explicitly stated;
- a two-pair interchange must use disjoint token pairs;
- applying pair A then pair B must not cause cascading remapping.

The runtime should implement pair swaps through one simultaneous lookup table, never sequential string replacement.

## 6.6 `OPS-CP-006` — Value and digit interchange

Ownership:

- complete numeric values or digit identities are interchanged;
- the equation becomes correct or the target is evaluated.

Discovery solve modes:

```text
identifyWholeNumberPairSwapForEquation
identifyCrossSideNumberPairSwapForEquation
identifySameSideNumberPairSwapForEquation
evaluateAfterSpecifiedNumberSwap
identifyDigitPairSwapForEquation
evaluateAfterSpecifiedDigitSwap
```

Mandatory distinction:

```text
whole-number swap: 24 <-> 36 swaps complete numeric tokens

digit swap: 2 <-> 6 transforms digit occurrences under an explicit scope policy
```

Digit-swapping QLs must state whether every occurrence is transformed and must reject leading-zero results unless the QL explicitly permits fixed-width codes. Ordinary arithmetic numbers may not acquire a leading zero.

## 6.7 `OPS-CP-007` — Combined sign-and-value interchange

Ownership:

- one question requires both operator and value transformations;
- options provide a compound transformation answer or a transformed value.

Discovery solve modes:

```text
identifyOperatorAndNumberPairSwap
identifyOperatorAndDigitPairSwap
identifyTwoSignsAndTwoValuesSwap
evaluateAfterSpecifiedOperatorAndValueSwap
selectCorrectCompoundSwapForEquation
```

Difficulty is driven by transformation composition and distractor proximity, not merely by larger operands.

The independent solver must verify every compound option from the original displayed expression. It may not reuse partially transformed state between options.

## 6.8 `OPS-CP-008` — Hidden operator mapping and equation puzzles

Ownership:

- the mapping is not supplied;
- two or more example equations constrain the mapping;
- the student infers the mapping and applies it to a target.

Discovery solve modes:

```text
inferBinaryOperatorMappingFromExamples
inferMultipleOperatorMappingFromExamples
inferMappingThenEvaluateTarget
inferMappingThenRecoverMissingResult
inferMappingThenSelectCorrectEquation
inferMappingWithArithmeticAndRelationOperators
recoverOneUnknownOperatorMeaning
selectPossibleMappingFromExamples
```

Mandatory construction model:

```text
choose hidden mapping
  -> construct valid example equations from solved ASTs
  -> enumerate all eligible mappings
  -> reject if more than one mapping survives
  -> construct target
  -> independently infer mapping from displayed examples
  -> solve target
```

Examples must activate every operator meaning needed for the target. A target may not depend on a token whose meaning remains unproved by the visible evidence.

## 7. Task kinds versus solve modes

Task kinds represent broad student actions. Solve modes capture the precise inverse and presentation topology.

Provisional task kinds:

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

The final solve-mode inventory must be discovered exhaustively across:

- forward tasks;
- inverse tasks;
- missing-token tasks;
- identify-rule tasks;
- choose-valid-statement tasks;
- equation-repair tasks;
- evaluation tasks;
- relation tasks;
- bracket and no-bracket forms;
- single and composed transformations;
- supported answer types;
- all three locales.

## 8. Ambiguity and uniqueness architecture

Every generated question must prove uniqueness at the level relevant to its task.

### 8.1 Mapping uniqueness

For hidden mappings:

- enumerate all eligible one-to-one or permitted many-to-one mappings;
- evaluate every example exactly;
- retain mappings satisfying all evidence;
- reject unless the task’s required answer is unique;
- normally require one surviving mapping, not merely one surviving target answer;
- if multiple mappings are intentionally allowed but all imply the same target, classify this explicitly and do not use it in the first implementation phase.

### 8.2 Fill-sequence uniqueness

- evaluate every allowed operator sequence or every provided option;
- reject if zero or multiple sequences satisfy the relation;
- reject duplicated semantic sequences disguised by glyph aliases;
- reject when an option becomes undefined through division by zero unless undefined options are intentionally permitted and clearly handled.

### 8.3 Swap uniqueness

- enumerate eligible operator pairs, value pairs or compound swaps;
- apply each transformation simultaneously to the original token stream;
- parse and evaluate from scratch;
- reject if more than one eligible swap repairs the equation;
- reject when an equal or simpler transformation outside the intended answer also repairs it.

### 8.4 Option uniqueness

- canonicalize exact numeric values;
- canonicalize operator sequences and unordered swap pairs;
- reject semantic duplicate options;
- require exactly one correct option after deterministic shuffle.

## 9. Distractor architecture

Distractors must represent specific mistakes and carry machine-readable error labels.

### Mapping and evaluation errors

```text
SUBSTITUTION_NOT_APPLIED
PARTIAL_MAPPING_APPLIED
MAPPING_DIRECTION_REVERSED
ONE_TOKEN_LEFT_UNMAPPED
DISPLAYED_PRECEDENCE_USED_BEFORE_MAPPING
LEFT_TO_RIGHT_ONLY
MULTIPLICATION_DIVISION_ORDER_REVERSED
ADDITION_SUBTRACTION_ORDER_REVERSED
BRACKETS_IGNORED
UNARY_MINUS_MISREAD
DIVISION_INVERTED
```

### Filling errors

```text
OPERATOR_SEQUENCE_REVERSED
EQUALITY_INSERTED_AT_WRONG_POSITION
ONE_OPERATOR_MISPLACED
NEAR_VALID_RELATION
LEFT_SIDE_ONLY_BALANCED
RIGHT_SIDE_ONLY_BALANCED
DUPLICATE_OPERATOR_ASSUMPTION
```

### Interchange errors

```text
ONLY_FIRST_SWAP_APPLIED
SWAPS_APPLIED_SEQUENTIALLY
SINGLE_OCCURRENCE_SWAPPED
WRONG_OPERATOR_PAIR
CORRECT_PAIR_WRONG_SCOPE
VALUE_PAIR_REVERSED_SEMANTICS
WHOLE_NUMBER_TREATED_AS_DIGITS
DIGITS_TREATED_AS_WHOLE_NUMBERS
ONLY_OPERATOR_SWAP_APPLIED
ONLY_VALUE_SWAP_APPLIED
```

### Hidden mapping errors

```text
MAPPING_FITS_ONLY_FIRST_EXAMPLE
MAPPING_FITS_SUBSET_OF_EVIDENCE
TARGET_TOKEN_MEANING_GUESSED
COMPETING_MAPPING_SELECTED
MAPPING_APPLIED_TO_WRONG_POSITION
```

A distractor must be generated by actually applying its error model when possible. Arbitrary nearby numbers are not acceptable unless no semantically meaningful error model yields a unique option.

## 10. Explanation architecture

Each explanation must be question-specific and solver-grounded.

### 10.1 Direct mapping explanation

```text
1. State the mapping in semantic form.
2. Rewrite the displayed expression after replacement.
3. Evaluate brackets and precedence in meaningful stages.
4. Give the exact result.
5. Reject the closest trap when useful.
```

### 10.2 Filling explanation

```text
1. Insert the selected ordered sequence.
2. Show the completed left and right expressions.
3. Evaluate both sides exactly.
4. Confirm the relation.
5. Briefly state why the nearest competing sequence fails.
```

### 10.3 Interchange explanation

```text
1. State the pair or pairs being interchanged.
2. Rewrite the full expression after simultaneous interchange.
3. Evaluate from the transformed expression.
4. Confirm equality or report the requested value.
```

### 10.4 Hidden mapping explanation

```text
1. Use the examples to establish each required token meaning.
2. Show that the mapping satisfies all examples.
3. Rewrite the target using the inferred meanings.
4. Evaluate the target exactly.
5. Conclude with the requested answer.
```

Reject explanations that:

- evaluate before showing the transformation;
- say “using BODMAS” without showing the transformed expression;
- expose internal rule IDs;
- skip one of two required swaps;
- silently treat a whole-number swap as digit replacement;
- use decimal approximations where exact rational arithmetic is available;
- repeat one generic explanation across materially different QLs;
- contain unresolved placeholders;
- produce a correct final number from an incorrect intermediate trace.

## 11. Localization architecture

Most OPS-001 QLs are `TRANSLATABLE` because the arithmetic tokens and logic remain unchanged.

Translate or adapt:

- instructions;
- verbs such as replace, interchange, insert, balance, evaluate and infer;
- relation descriptions;
- explanation prose;
- option-introduction wording.

Preserve unchanged unless a renderer policy says otherwise:

- numerals;
- arithmetic signs;
- arbitrary symbol tokens;
- expression layout;
- deterministic seed;
- correct option index before locale-specific option shuffling policy;
- exact arithmetic trace.

Word-token questions are `LANGUAGE_ADAPTED` because English infix words cannot simply be inserted into Hindi or Punjabi stems. Early runtime proof should prioritise language-neutral letter and symbol tokens.

Required glossary concepts:

```text
means / denotes
is interchanged with
replace sequentially
fill the blanks
balance the equation
which statement is correct
less than
greater than
equal to
```

Hindi and Punjabi review must specifically check that “interchange” means mutual replacement, not one-directional substitution.

## 12. Difficulty model

Difficulty must be computed from generated-instance properties.

Primary factors:

- transformation count;
- mapping size;
- whether mapping is supplied or inferred;
- expression token count;
- bracket depth;
- number of repeated mapped operators;
- whether `=` must be inserted;
- number of eligible competing mappings or swaps;
- closeness of distractors;
- whether values and signs are transformed together;
- rational versus integral intermediate arithmetic;
- relation complexity.

Typical Easy characteristics:

- supplied mapping;
- three or four operands;
- no brackets or one simple bracket;
- integer intermediates;
- one transformation;
- clearly separated distractors.

Typical Medium characteristics:

- longer expression or one bracket layer;
- repeated operators;
- equality insertion or one inferred swap;
- close precedence traps;
- exact rational intermediate with integer final result.

Typical Hard characteristics:

- hidden mapping from multiple examples;
- combined sign-and-value transformation;
- double-pair interchange;
- deeper brackets;
- several eligible competing transformations;
- relation-token inference;
- very close error-model distractors.

Large operands alone do not make a question hard.

## 13. Generation safety policies

- never permit division by zero;
- reject values outside configured safe bounds;
- reject expression strings that overflow renderer width targets;
- reject mappings with duplicate active display tokens;
- reject hidden mappings that are not identifiable from evidence;
- reject options with duplicate canonical meaning;
- reject ambiguous unary-minus rendering;
- reject leading-zero numbers created by digit swaps;
- reject a filler question when more than one operator sequence works;
- reject a swap question when an unintended simpler swap also works;
- reject relation questions whose truth depends on floating-point rounding;
- reject any question whose explanation trace disagrees with the independent solver.

## 14. Renderer plan

Required renderer classes:

```text
STRUCTURED_TEXT
TABLE_OR_GRID
```

OPS-specific presentation modes:

```text
MAPPING_PLUS_EXPRESSION
MAPPING_TABLE
INLINE_EXPRESSION
BRACKETED_EXPRESSION
TWO_SIDED_EQUATION
EQUATION_OPTIONS
RELATION_STATEMENT_OPTIONS
OPERATOR_SEQUENCE_OPTIONS
SWAP_PAIR_OPTIONS
COMPOUND_SWAP_OPTIONS
EXAMPLE_EQUATIONS_PLUS_TARGET
```

Renderer rules:

- use typographically distinct `−`, `×` and `÷` where supported;
- preserve a fallback ASCII representation for tests and serialization;
- never allow line wrapping to separate a unary minus from its value;
- clearly distinguish placeholder glyphs from multiplication signs;
- mapping tables must align display tokens with meanings;
- option renderers must preserve operator order exactly.

## 15. Metadata for Question Studio

Every generated OPS-001 question should expose:

```text
packageId
checkpointId
qlId
ruleId
taskKind
solveMode
presentationMode
renderer
localeMode
seed
difficulty
answerType
transformationFingerprint
mappingFingerprint
originalTokenStream
transformedTokenStream
canonicalAstFingerprint
exactAnswer
eligibleTransformationCount
survivingTransformationCount
ambiguityAccepted
optionErrorLabels
solverTrace
editorialStatus
runtimeVersion
```

Question Studio should allow reviewers to inspect the expression before and after transformation and compare the independent solver trace with the rendered explanation.

## 16. Test architecture

### Unit tests

- tokenizer tests;
- bracket and unary-minus tests;
- exact rational arithmetic tests;
- precedence tests;
- simultaneous operator-swap tests;
- whole-number versus digit-swap tests;
- mapping inference tests;
- canonical fingerprint tests;
- option-equivalence tests.

### Property tests

- transformed expression re-parses deterministically;
- generator answer equals independent solver answer;
- exact evaluator agrees with a second reference evaluator over safe domains;
- applying an interchange twice restores the original token stream;
- inferred hidden mapping is unique for accepted instances;
- every accepted fill question has exactly one valid sequence;
- every accepted swap question has exactly one valid transformation;
- option shuffling preserves correctness;
- all seeds are deterministic.

### Batch audits

For every QL and required locale:

- generate a broad seed range;
- require zero runtime exceptions;
- require zero unresolved placeholders;
- require zero duplicate semantic options;
- require zero incorrect answers;
- require zero ambiguous accepted instances;
- require zero explanation-solver mismatches;
- audit difficulty distribution;
- audit renderer width and token clarity;
- audit stem and explanation diversity.

## 17. Discovery and freeze workflow

The chapter must not freeze counts at the start.

Required sequence:

```text
source saturation
  -> task-kind discovery
  -> solve-mode discovery
  -> inverse-mode expansion
  -> representation expansion
  -> edge-case expansion
  -> multilingual expansion
  -> overlap audit
  -> ambiguity-pool audit
  -> checkpoint split/merge audit
  -> QL allocation
  -> manifest freeze
```

A candidate QL is justified only when it differs meaningfully in at least one of:

- underlying transformation rule;
- student solve action;
- inverse topology;
- answer semantic;
- presentation contract;
- ambiguity pool;
- localization mode;
- explanation strategy;
- distractor architecture.

Surface wording alone never creates a new QL.

## 18. Implementation order after design freeze

Provisional dependency order:

1. exact numeric and AST foundation;
2. CP-001 given arithmetic-sign mapping runtime proof;
3. CP-005 operator-interchange runtime proof;
4. CP-004 fill-sequence constraint solver;
5. CP-002 arbitrary-token rendering;
6. CP-003 relation-token support;
7. CP-006 value and digit swaps;
8. CP-007 combined transformations;
9. CP-008 hidden mapping inference;
10. multilingual runtime and review exports;
11. chapter-wide collision, ambiguity and freeze audit.

This order is not a QL allocation and may change after the final source audit.

## 19. Current open questions

- Should powers or roots be admitted when authentic papers support them, or excluded from V1 for visual simplicity?
- Should chained comparisons be supported or deferred?
- Are occurrence-specific swaps common enough to deserve production support?
- Should word-token operators be implemented in all locales or retained only as an English language-specific form?
- What exact expression-length caps best match mobile mock-test rendering?
- Should rational final answers be included in production or only in runtime tests?
- Does the digit-swap corpus consistently mean global digit replacement?
- Should “which equation is incorrect” be an independent task kind or a presentation polarity of the true-equation task?
- Which CP boundaries should split after the full SSC, Banking and Punjab source audit?

## 20. Design definition of done

OPS-001 design is ready to freeze only when:

- source coverage includes textbook, SSC, Banking and Punjab patterns;
- included and excluded boundaries are explicit;
- every discovered task topology has a solver plan;
- every QL candidate has an ambiguity pool;
- forward and inverse variants have been audited;
- whole-number and digit semantics are unambiguous;
- relation operators are typed and validated;
- Hindi and Punjabi wording policies are reviewed;
- checkpoint partitions survive split/merge review;
- no meaningful uncovered solve mode remains;
- only then are CP counts, QL counts and QL ranges frozen in the chapter manifest.
