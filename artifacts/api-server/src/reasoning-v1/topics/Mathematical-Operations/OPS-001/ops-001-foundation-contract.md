# ExamTree Reasoning V1 — OPS-001 Foundation Contract

Status: implementation-design contract. This document defines the shared foundation required by all provisional OPS-001 partitions. It does not author QLs or freeze chapter counts.

## 1. Purpose

OPS-001 must not be implemented through chained string replacement and JavaScript `Number` evaluation. The foundation must provide:

- exact numeric literals and rational arithmetic;
- source-aware tokenisation;
- simultaneous typed transformations;
- relation-boundary discovery after transformation;
- deterministic parsing and AST fingerprints;
- independent evaluation and verification routes;
- semantic option canonicalisation;
- structured rejection diagnostics.

## 2. Design invariants

```text
OPS-INV-001  transformation occurs before semantic parsing
OPS-INV-002  every swap is simultaneous within its identity domain
OPS-INV-003  arithmetic uses exact values
OPS-INV-004  every completed equation has a validated relation structure
OPS-INV-005  generator state is not proof of correctness
OPS-INV-006  semantic duplicate options are rejected
OPS-INV-007  whole-number and digit swaps are never conflated
OPS-INV-008  unary negative and subtraction remain distinct
OPS-INV-009  display aliases never alter canonical semantics
OPS-INV-010  every accepted instance has a stable fingerprint
```

## 3. Exact numeric foundation

### 3.1 Canonical rational value

```ts
interface ExactRational {
  numerator: bigint;
  denominator: bigint;
}
```

Invariants:

```text
denominator > 0
gcd(abs(numerator), denominator) = 1
zero is represented as 0/1
```

Required functions:

```ts
function makeRational(numerator: bigint, denominator: bigint): ExactRational;
function fromInteger(value: bigint): ExactRational;
function fromFiniteDecimal(source: string): ExactRational;
function negateExact(value: ExactRational): ExactRational;
function addExact(a: ExactRational, b: ExactRational): ExactRational;
function subtractExact(a: ExactRational, b: ExactRational): ExactRational;
function multiplyExact(a: ExactRational, b: ExactRational): ExactRational;
function divideExact(a: ExactRational, b: ExactRational): ExactRational;
function compareExact(a: ExactRational, b: ExactRational): -1 | 0 | 1;
function equalExact(a: ExactRational, b: ExactRational): boolean;
function isIntegerExact(value: ExactRational): boolean;
function canonicalExactKey(value: ExactRational): string;
```

### 3.2 Literal model

```ts
type NumericLiteral =
  | {
      kind: "INTEGER_LITERAL";
      source: string;
      value: ExactRational;
    }
  | {
      kind: "FINITE_DECIMAL_LITERAL";
      source: string;
      value: ExactRational;
      scale: number;
    };
```

Unary negativity belongs to syntax, not the literal value token, unless the source adapter deliberately emits one signed literal under a strict contract.

Preferred canonical path:

```text
−4
  -> UNARY_MINUS token
  -> INTEGER_LITERAL(4)
  -> UNARY_NEGATE AST
```

### 3.3 Finite-decimal parsing

Algorithm:

```text
validate ^[0-9]+\.[0-9]+$
  -> remove decimal point
  -> numerator = joined digits
  -> denominator = 10^(fractional digit count)
  -> reduce exactly
```

Reject:

- scientific notation in V1;
- recurring decimals;
- locale comma decimals;
- malformed leading or trailing decimal points;
- values outside configured digit-length bounds.

### 3.4 Exact presentation

```ts
type ExactNumberPresentation =
  | "INTEGER"
  | "REDUCED_FRACTION"
  | "MIXED_FRACTION"
  | "TERMINATING_DECIMAL";
```

Presentation never changes semantic identity.

Required canonical duplicate rule:

```text
3/2
1 1/2
1.5
```

all share one exact option key.

## 4. Token model

### 4.1 Canonical source tokens

```ts
type OpsSourceToken =
  | { kind: "NUMERIC_LITERAL"; literal: NumericLiteral }
  | { kind: "UNARY_MINUS"; source: string }
  | { kind: "ARITHMETIC_DISPLAY_TOKEN"; tokenId: string; source: string }
  | { kind: "RELATION_DISPLAY_TOKEN"; tokenId: string; source: string }
  | { kind: "ARBITRARY_OPERATION_TOKEN"; tokenId: string; source: string }
  | { kind: "LEFT_BRACKET"; bracket: "(" | "[" | "{" }
  | { kind: "RIGHT_BRACKET"; bracket: ")" | "]" | "}" }
  | { kind: "PLACEHOLDER"; placeholderId: string; source: string }
  | { kind: "SEPARATOR"; source: string };
```

Separators exist for rendering/source reconstruction and are removed before semantic parsing.

### 4.2 Semantic tokens after transformation

```ts
type ArithmeticOperator =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE";

type RelationOperator =
  | "EQUAL"
  | "LESS_THAN"
  | "GREATER_THAN";

type OpsSemanticToken =
  | { kind: "VALUE"; value: ExactRational; sourceLiteral?: string }
  | { kind: "UNARY_NEGATE" }
  | { kind: "ARITHMETIC_OPERATOR"; operator: ArithmeticOperator }
  | { kind: "RELATION_OPERATOR"; operator: RelationOperator }
  | { kind: "LEFT_BRACKET"; bracket: "(" | "[" | "{" }
  | { kind: "RIGHT_BRACKET"; bracket: ")" | "]" | "}" };
```

No unresolved display or placeholder token may reach the parser.

## 5. Glyph and alias policy

### 5.1 Canonical rendered glyphs

```text
ADD       +
SUBTRACT  −
MULTIPLY  ×
DIVIDE    ÷
EQUAL     =
LESS      <
GREATER   >
```

### 5.2 Accepted source aliases

Aliases are source-adapter data, not global assumptions.

Examples:

```text
×  may accept x or X only when the source schema declares multiplication
÷  may accept / only when the source schema declares division
−  may accept - only after unary/subtraction disambiguation
*  may mean multiplication or placeholder; the QL/source schema must decide
```

### 5.3 Font-safe arbitrary tokens

The arbitrary-token registry must record:

```ts
interface ArbitraryTokenDefinition {
  tokenId: string;
  display: string;
  asciiFallback: string;
  tokenFamily: "LETTER" | "PUNCTUATION" | "SHAPE" | "WORD";
  supportedLocales: readonly ("en-IN" | "hi-IN" | "pa-IN")[];
  confusableWith: readonly string[];
  editorialStatus: "DRAFT" | "APPROVED" | "REJECTED";
}
```

Reject token sets with visual collisions inside one question.

## 6. Tokeniser contract

### 6.1 Input

The tokenizer receives either:

- structured generator tokens; or
- a controlled source string plus a declared lexical profile.

Production generation should prefer structured tokens and render strings afterwards.

### 6.2 Tokenisation states

```text
EXPECT_VALUE_OR_UNARY
EXPECT_OPERATOR_OR_RELATION_OR_CLOSE
EXPECT_VALUE_AFTER_OPERATOR
EXPECT_END_AFTER_RELATION_SIDE
```

A full implementation may use a lexer plus parser rather than these literal state names, but equivalent validation must exist.

### 6.3 Required rejections

```text
UNKNOWN_GLYPH
MALFORMED_NUMERIC_LITERAL
ADJACENT_VALUES
TRAILING_OPERATOR
LEADING_BINARY_OPERATOR
UNBALANCED_BRACKETS
MISMATCHED_BRACKET_TYPES
EMPTY_BRACKET_GROUP
AMBIGUOUS_HYPHEN
IMPLICIT_MULTIPLICATION_UNSUPPORTED
MULTIPLE_DECIMAL_POINTS
NUMERIC_LITERAL_TOO_LONG
```

## 7. Transformation contracts

### 7.1 Supplied operator mapping

```ts
interface GivenOperatorMappingTransformation {
  kind: "GIVEN_OPERATOR_MAPPING";
  mappingEntries: readonly {
    displayTokenId: string;
    semanticOperator: ArithmeticOperator | RelationOperator;
  }[];
  cardinality:
    | "BIJECTIVE_ACTIVE_DOMAIN"
    | "INJECTIVE_ACTIVE_DOMAIN"
    | "MANY_TO_ONE_ALLOWED";
}
```

Validation:

- one meaning per active display token;
- every active target token is mapped;
- duplicate semantic meanings are allowed only by cardinality policy;
- relation-token count after transformation is validated later.

### 7.2 Operator pair interchange

```ts
interface OperatorPairInterchangeTransformation {
  kind: "OPERATOR_PAIR_INTERCHANGE";
  pairs: readonly [string, string][];
  scope: "GLOBAL_TOKEN";
}
```

Rules:

- pairs are simultaneous;
- pairs must be disjoint in ordinary two-pair QLs;
- pair order is semantically irrelevant;
- `[A,B]` and `[B,A]` have one canonical key;
- relation display tokens may participate only in relation-aware QLs.

### 7.3 Whole-number interchange

```ts
interface WholeNumberInterchangeTransformation {
  kind: "WHOLE_NUMBER_INTERCHANGE";
  pair: readonly [ExactRational, ExactRational];
  scope: "GLOBAL_TOKEN" | "DECLARED_TOKEN_POSITIONS";
}
```

V1 production preference: integer-valued tokens only.

Global token semantics use exact value equality, not source-string equality.

### 7.4 Digit identity interchange

```ts
interface DigitIdentityInterchangeTransformation {
  kind: "DIGIT_IDENTITY_INTERCHANGE";
  pair: readonly [number, number];
  scope:
    | "ALL_NUMERIC_LITERALS"
    | "DECLARED_EXPRESSION_SIDE"
    | "DECLARED_TOKEN_POSITIONS";
}
```

V1 production default:

```text
ALL_NUMERIC_LITERALS
```

Algorithm for each in-scope source literal:

```text
read canonical unsigned digit string and decimal point
  -> replace both digit identities simultaneously
  -> preserve decimal-point location
  -> reject illegal leading zero for ordinary integer forms
  -> parse rebuilt literal exactly
```

Negative sign is not a digit and remains outside the swap.

### 7.5 Operator-sequence insertion

```ts
interface OperatorSequenceInsertionTransformation {
  kind: "INSERT_OPERATOR_SEQUENCE";
  placeholderIds: readonly string[];
  insertedOperators: readonly (ArithmeticOperator | RelationOperator)[];
  policy:
    | "USE_EACH_ALLOWED_TOKEN_ONCE"
    | "REUSE_ALLOWED"
    | "OPTIONS_DEFINE_CANDIDATES";
}
```

Placeholder order is reading order unless a structured renderer declares another explicit sequence.

### 7.6 Compound transformation

```ts
interface CompoundTransformation {
  kind: "COMPOUND_INTERCHANGE";
  operatorTransformation?: OperatorPairInterchangeTransformation;
  numberTransformation?: WholeNumberInterchangeTransformation;
  digitTransformation?: DigitIdentityInterchangeTransformation;
}
```

Canonical application order:

```text
operator identity transformation
  -> whole-number identity transformation
  -> digit identity transformation
```

Because identity domains are typed, a valid compound definition should commute. The verifier should test commutation where applicable and reject overlapping malformed definitions.

## 8. Transformation output validation

After transformation, reject:

```text
UNRESOLVED_DISPLAY_TOKEN
UNRESOLVED_PLACEHOLDER
ZERO_TOP_LEVEL_RELATIONS
MULTIPLE_TOP_LEVEL_RELATIONS
EMPTY_LEFT_RELATION_SIDE
EMPTY_RIGHT_RELATION_SIDE
RELATION_INSIDE_ARITHMETIC_GROUP_UNSUPPORTED
ADJACENT_SEMANTIC_VALUES
ADJACENT_BINARY_OPERATORS
DIVISION_BY_ZERO_STATIC
LEADING_ZERO_LITERAL_AFTER_DIGIT_SWAP
OUT_OF_RANGE_TRANSFORMED_LITERAL
```

For expression-only evaluation QLs, zero top-level relations is required rather than rejected.

## 9. AST contract

```ts
type ArithmeticAst =
  | { kind: "VALUE"; value: ExactRational }
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

Precedence:

```text
brackets
unary negation
multiplication/division, left associative
addition/subtraction, left associative
one top-level relation
```

## 10. Parser independence policy

The primary runtime parser and independent verifier must not share all high-level code.

Allowed shared components:

- exact rational primitives;
- immutable token type definitions;
- canonical low-level glyph registry.

Must be independent:

- transformation application route;
- expression parse route or evaluator route;
- answer derivation;
- option correctness decision.

Recommended verifier approach:

```text
primary: AST parser + recursive evaluator
verifier: shunting-yard conversion + exact stack evaluator
```

Agreement between two routes is required for accepted instances.

## 11. AST and transformation fingerprints

### 11.1 Exact value key

```text
R:numerator/denominator
```

Examples:

```text
R:3/1
R:-4/1
R:1/16
```

### 11.2 AST fingerprint

```text
V(R:3/1)
NEG(V(R:4/1))
ADD(V(R:2/1),MUL(V(R:3/1),V(R:5/1)))
EQ(ADD(...),V(...))
```

Fingerprints are semantic and ignore source whitespace or glyph aliases.

### 11.3 Mapping fingerprint

Sort by canonical display-token ID:

```text
MAP:{tokenA->ADD,tokenB->DIVIDE,tokenC->ADD}
```

Many-to-one entries remain visible.

### 11.4 Swap fingerprint

```text
OPSWAP:{ADD_DISPLAY<->MULTIPLY_DISPLAY}
OPSWAP2:{ADD_DISPLAY<->MULTIPLY_DISPLAY|SUBTRACT_DISPLAY<->DIVIDE_DISPLAY}
NUMSWAP:{R:4/1<->R:12/1}
DIGITSWAP:{3<->6|scope=ALL_NUMERIC_LITERALS}
```

Compound fingerprints sort typed components in canonical order.

## 12. Option canonicalisation

```ts
type OpsOptionSemantic =
  | { kind: "EXACT_VALUE"; value: ExactRational }
  | { kind: "OPERATOR"; operator: ArithmeticOperator }
  | { kind: "RELATION"; operator: RelationOperator }
  | { kind: "OPERATOR_SEQUENCE"; operators: readonly string[] }
  | { kind: "SWAP_PAIR"; pair: readonly string[] }
  | { kind: "COMPOUND_SWAP"; fingerprint: string }
  | { kind: "EQUATION"; astFingerprint: string }
  | { kind: "BOOLEAN"; value: boolean };
```

Duplicate detection uses semantic keys, not rendered strings.

Examples of duplicates:

```text
+ and ×
× and +
```

for an interchange pair.

```text
1.5
3/2
```

for exact numeric options.

## 13. Solver traces

### 13.1 Direct mapping trace

```ts
interface MappingEvaluationTrace {
  originalTokens: readonly OpsSourceToken[];
  mappingFingerprint: string;
  transformedTokens: readonly OpsSemanticToken[];
  astFingerprint: string;
  evaluationSteps: readonly ExactEvaluationStep[];
  exactResult: ExactRational;
}
```

### 13.2 Relation trace

```ts
interface RelationEvaluationTrace {
  transformedRelationAstFingerprint: string;
  leftValue: ExactRational;
  relation: RelationOperator;
  rightValue: ExactRational;
  truth: boolean;
}
```

### 13.3 Swap-search trace

```ts
interface SwapSearchTrace {
  eligibleTransformationFingerprints: readonly string[];
  tested: readonly {
    transformationFingerprint: string;
    validSyntax: boolean;
    relationTruth?: boolean;
    rejectionReason?: string;
  }[];
  survivingTransformationFingerprints: readonly string[];
}
```

Question Studio may expose these to administrators, not students.

## 14. Rejection diagnostic registry

### Lexical and structural

```text
OPS_REJECT_UNKNOWN_GLYPH
OPS_REJECT_MALFORMED_LITERAL
OPS_REJECT_AMBIGUOUS_MINUS
OPS_REJECT_UNBALANCED_BRACKETS
OPS_REJECT_UNRESOLVED_TOKEN
OPS_REJECT_INVALID_RELATION_COUNT
OPS_REJECT_EMPTY_RELATION_SIDE
```

### Arithmetic

```text
OPS_REJECT_DIVISION_BY_ZERO
OPS_REJECT_OUT_OF_BOUNDS_VALUE
OPS_REJECT_NONFINITE_DECIMAL_SOURCE
OPS_REJECT_UNSUPPORTED_RESULT_PRESENTATION
```

### Transformation

```text
OPS_REJECT_INACTIVE_INTENDED_MAPPING
OPS_REJECT_OVERLAPPING_SWAP_PAIRS
OPS_REJECT_INVALID_DIGIT_SCOPE
OPS_REJECT_LEADING_ZERO_AFTER_DIGIT_SWAP
OPS_REJECT_INERT_COMPOUND_COMPONENT
OPS_REJECT_NONCOMMUTING_TYPED_COMPOUND
```

### Ambiguity and options

```text
OPS_REJECT_ZERO_VALID_TRANSFORMATIONS
OPS_REJECT_MULTIPLE_VALID_TRANSFORMATIONS
OPS_REJECT_SIMPLER_COMPETING_TRANSFORMATION
OPS_REJECT_DUPLICATE_SEMANTIC_OPTIONS
OPS_REJECT_ZERO_CORRECT_OPTIONS
OPS_REJECT_MULTIPLE_CORRECT_OPTIONS
```

### Verification

```text
OPS_REJECT_PRIMARY_VERIFIER_MISMATCH
OPS_REJECT_EXPLANATION_TRACE_MISMATCH
OPS_REJECT_NONDETERMINISTIC_REGENERATION
```

## 15. Deterministic construction principles

### 15.1 Direct evaluation

Prefer inverse construction:

```text
choose a clean semantic AST
  -> choose mapping
  -> derive displayed token stream using inverse map
  -> independently transform and solve
```

For many-to-one mappings, inverse construction may have several display choices. The seeded generator must select deterministically and retain a display-choice trace.

### 15.2 Equation repair

```text
choose a true canonical relation AST
  -> choose intended swap
  -> apply inverse swap to derive false displayed equation
  -> enumerate every eligible swap
  -> accept only when intended swap is uniquely valid
```

### 15.3 Operator filling

```text
choose a true canonical relation AST
  -> remove selected operators
  -> build candidate sequences from policy
  -> evaluate all candidates
  -> require exactly one valid sequence
```

### 15.4 Hidden mapping

```text
choose eligible hidden mapping
  -> generate solved semantic examples
  -> encode display examples
  -> enumerate mapping pool from visible evidence
  -> require unique mapping
  -> generate and solve target
```

## 16. Safe-domain configuration

Conceptual configuration:

```ts
interface OpsSafeDomain {
  maxIntegerDigits: number;
  maxDecimalScale: number;
  maxExpressionTokens: number;
  maxBracketDepth: number;
  maxAbsoluteNumeratorDigits: number;
  maxDenominatorDigits: number;
  allowNegativeIntermediate: boolean;
  allowNegativeFinal: boolean;
  allowRationalIntermediate: boolean;
  allowedFinalPresentations: readonly ExactNumberPresentation[];
}
```

Difficulty profiles may narrow the domain but may not bypass correctness rules.

## 17. Property-test contract

### Exact arithmetic

```text
normalisation is idempotent
addition/subtraction inverse property
multiplication commutativity
non-zero division inverse property
comparison agrees with cross multiplication
finite-decimal parsing is exact
```

### Transformations

```text
applying one interchange twice restores original source tokens
pair order does not change swap fingerprint
compound typed transformations commute where declared
whole-number swap never changes partial digits
Digit swap rebuilds every in-scope literal simultaneously
```

### Parsing and verification

```text
primary evaluator equals independent verifier
AST fingerprint is stable across glyph aliases
whitespace does not change semantics
relation boundary is rediscovered after relation-aware swap
```

### Questions and options

```text
accepted fill question has exactly one valid sequence
accepted repair question has exactly one valid transformation
accepted hidden mapping has exactly one surviving mapping
accepted MCQ has exactly one correct semantic option
seed regeneration is byte-stable for structured output
```

## 18. Foundation completion gate

The OPS foundation is implementation-ready only when the design has tests for:

- integers, zero, finite decimals and unary negatives;
- all four arithmetic operators;
- all three V1 relations;
- nested and mismatched brackets;
- many-to-one supplied mappings;
- arithmetic-arithmetic and arithmetic-relation swaps;
- whole-number and digit swaps;
- leading-zero rejection;
- exact option equivalence;
- primary/verifier independence;
- deterministic fingerprints and diagnostics.

## 19. Non-goals for V1 foundation

```text
powers and roots
implicit multiplication
scientific notation
recurring-decimal input
chained comparisons
free-form user-entered expressions
occurrence-specific swaps as a general production family
complex numbers
floating-point tolerance equality
```

These may be introduced later only through an explicit architecture amendment and source-backed QL need.

## 20. Next action after this contract

Do not implement broad checkpoint content yet.

The next permitted technical action is an isolated foundation prototype proving:

1. exact integer and finite-decimal evaluation;
2. supplied many-to-one operator mapping;
3. simultaneous arithmetic/relation token interchange;
4. whole-number versus digit-swap separation;
5. independent evaluator agreement;
6. semantic option canonicalisation.

The prototype should remain non-publishable and must not allocate permanent QL IDs.
