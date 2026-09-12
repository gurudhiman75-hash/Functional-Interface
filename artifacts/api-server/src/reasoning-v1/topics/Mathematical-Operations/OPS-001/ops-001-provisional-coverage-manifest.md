# ExamTree Reasoning V1 — OPS-001 Provisional Coverage Manifest

Status: discovery manifest. This file is not the final chapter manifest and does not freeze CP counts, QL counts, QL IDs, solve-mode counts, or QL ranges.

## 1. Manifest purpose

This document maps the currently discovered OPS-001 task contracts to:

- transformation family;
- student action;
- answer semantic;
- independent solver route;
- ambiguity pool;
- explanation plan;
- representation dimensions;
- source support;
- provisional ownership partition.

A row in this document is a **candidate QL contract**, not a guaranteed final QL. Candidate contracts may be merged when differences are only presentation parameters, or split when runtime proof reveals materially different ambiguity or explanation behaviour.

## 2. Candidate-retention test

A candidate contract survives only when it differs materially in one or more of:

```text
transformation rule
student solve action
inverse topology
answer semantic
presentation contract
ambiguity pool
localisation mode
explanation strategy
distractor architecture
```

The following do not independently justify a new QL:

```text
larger operands
longer wording
changed names
one extra repeated operator
integer versus clean finite decimal
no brackets versus one simple bracket
correct versus incorrect polarity by itself
same-side versus cross-side number positions by itself
```

## 3. Shared manifest fields

Every eventual QL should expose concepts equivalent to:

```ts
interface OpsQlManifestEntry {
  qlId: string;
  checkpointId: string;
  ruleId: string;
  taskKind: string;
  solveMode: string;
  transformationFamily: string;
  answerType: string;
  presentationModes: readonly string[];
  numericLiteralPolicy: string;
  mappingCardinalityPolicy?: string;
  fillOperatorPolicy?: string;
  swapScopePolicy?: string;
  relationPolicy: string;
  localeMode: string;
  ambiguityPoolId: string;
  explanationStrategyId: string;
  sourceFamilyIds: readonly string[];
  status: "CANDIDATE" | "RETAINED" | "MERGED" | "SPLIT" | "REJECTED";
}
```

## 4. Source-family identifiers

```text
OPS-SRC-FAM-01  supplied arithmetic-sign replacement
OPS-SRC-FAM-02  supplied arbitrary operation tokens
OPS-SRC-FAM-03  arithmetic plus relation-token mapping
OPS-SRC-FAM-04  filling signs with fixed relation
OPS-SRC-FAM-05  filling signs including relation position
OPS-SRC-FAM-06  prescribed operator interchange and evaluation
OPS-SRC-FAM-07  infer operator interchange to repair equation
OPS-SRC-FAM-08  arithmetic-relation sign interchange
OPS-SRC-FAM-09  whole-number interchange
OPS-SRC-FAM-10  digit-identity interchange
OPS-SRC-FAM-11  combined sign-and-number interchange
OPS-SRC-FAM-12  combined sign-and-digit interchange
OPS-SRC-FAM-13  hidden operator mapping from example equations
OPS-SRC-FAM-14  correct/incorrect transformed equation selection
OPS-SRC-FAM-15  recent SSC double-pair operator interchange
OPS-SRC-FAM-16  finite-decimal operands under supplied mapping
OPS-SRC-FAM-17  negative target equation repair
```

## 5. Provisional partition A — supplied arithmetic-sign mappings

### Candidate A1 — evaluate a transformed expression

```text
taskKind: EVALUATE_AFTER_GIVEN_MAPPING
solveMode: evaluateAfterGivenArithmeticSignMapping
answerType: INTEGER | RATIONAL
ruleFamily: GIVEN_ARITHMETIC_SIGN_MAPPING
```

Owns:

- complete permutations;
- partial supplied mappings;
- many-to-one mappings;
- repeated operators;
- integer and finite-decimal operands;
- simple and bracketed expressions;
- short and long token streams.

These are parameters of one core task unless runtime proof demonstrates a material explanation or ambiguity split.

Independent solver:

```text
read supplied typed mapping
  -> transform every active display token
  -> parse transformed expression
  -> evaluate exactly
  -> canonicalise answer
```

Ambiguity pool:

```text
OPS-AMB-GIVEN-MAPPING-EVAL
```

Primary distractors:

```text
SUBSTITUTION_NOT_APPLIED
PARTIAL_MAPPING_APPLIED
MAPPING_DIRECTION_REVERSED
PERMUTATION_ASSUMED_FOR_MANY_TO_ONE
LEFT_TO_RIGHT_ONLY
DISPLAYED_PRECEDENCE_USED_BEFORE_MAPPING
BRACKETS_IGNORED
```

Explanation:

```text
OPS-EXP-MAP-THEN-EVALUATE
```

Source support:

```text
OPS-SRC-FAM-01
OPS-SRC-FAM-16
```

Status: `RETAINED_CANDIDATE`.

### Candidate A2 — recover a missing result

```text
taskKind: RECOVER_MISSING_RESULT_AFTER_MAPPING
solveMode: recoverMissingResultAfterGivenArithmeticMapping
answerType: INTEGER | RATIONAL
```

Material difference from A1:

- the target is presented as a missing result in an equation or statement;
- the renderer and explanation must preserve equation structure;
- options may be result values rather than ordinary expression values.

Independent solver: same evaluator route, with equation-result extraction.

Status: `RETAINED_CANDIDATE`, pending merge audit with A1 after renderer proof.

### Candidate A3 — choose the correct transformed equation

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_MAPPING
solveMode: selectTrueEquationAfterGivenArithmeticMapping
answerType: EQUATION_OPTION
```

Independent solver:

```text
evaluate every option independently under the same mapping
  -> retain options whose top-level relation is true
  -> require exactly one
```

Ambiguity pool includes semantic duplicate equation options.

Correct/incorrect polarity should remain a parameter unless source and review proof justify separate QLs.

Source support:

```text
OPS-SRC-FAM-01
OPS-SRC-FAM-14
```

Status: `RETAINED_CANDIDATE`.

## 6. Provisional partition B — supplied arbitrary operation tokens

### Candidate B1 — evaluate an arbitrary-token expression

```text
taskKind: EVALUATE_AFTER_GIVEN_MAPPING
solveMode: evaluateAfterGivenArbitraryTokenMapping
answerType: INTEGER | RATIONAL
ruleFamily: GIVEN_ARBITRARY_TOKEN_MAPPING
```

Token families are parameters:

```text
LETTER_TOKEN
PUNCTUATION_TOKEN
FONT_SAFE_SHAPE_TOKEN
WORD_TOKEN
```

Word tokens use `LANGUAGE_ADAPTED`; the other early proof forms use `TRANSLATABLE`.

Status: `RETAINED_CANDIDATE`.

### Candidate B2 — recover a missing result using arbitrary tokens

```text
taskKind: RECOVER_MISSING_RESULT_AFTER_MAPPING
solveMode: recoverMissingResultAfterArbitraryTokenMapping
answerType: INTEGER | RATIONAL
```

Status: `MERGE_CANDIDATE_WITH_B1`, pending renderer and explanation audit.

### Candidate B3 — select the true arbitrary-token equation

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_MAPPING
solveMode: selectTrueEquationAfterArbitraryTokenMapping
answerType: EQUATION_OPTION
```

Materially distinct because every equation option must be transformed and solved independently.

Status: `RETAINED_CANDIDATE`.

## 7. Provisional partition C — mixed arithmetic and relation mappings

### Candidate C1 — select the true relation or statement

```text
taskKind: IDENTIFY_TRUE_STATEMENT_AFTER_MAPPING
solveMode: selectTrueStatementAfterArithmeticRelationMapping
answerType: STATEMENT_OPTION | RELATION_OPERATOR
ruleFamily: GIVEN_ARITHMETIC_RELATION_MAPPING
```

Independent solver:

```text
transform option token stream
  -> discover resulting top-level relation
  -> evaluate both sides exactly
  -> test truth
  -> require one true option
```

Boundary: no conclusion inference from an inequality chain.

Status: `RETAINED_CANDIDATE`.

### Candidate C2 — recover a missing relation token

```text
taskKind: RECOVER_MISSING_RELATION_AFTER_MAPPING
solveMode: recoverMissingRelationTokenAfterMapping
answerType: RELATION_OPERATOR
```

Material difference:

- answer semantic is the relation token itself;
- the solver compares exact evaluated sides rather than selecting a full statement.

Status: `RETAINED_CANDIDATE`.

### Candidate C3 — identify the correct completed equation

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_MAPPING
solveMode: identifyCorrectEquationAfterArithmeticRelationMapping
answerType: EQUATION_OPTION
```

Merge audit: compare with C1 after review exports. Retain separately only if option topology and distractor architecture are materially different.

Status: `MERGE_AUDIT_REQUIRED`.

## 8. Provisional partition D — filling operator and relation positions

### Candidate D1 — recover one missing arithmetic operator

```text
taskKind: RECOVER_SINGLE_MISSING_OPERATOR
solveMode: recoverSingleMissingArithmeticOperator
answerType: OPERATOR
ruleFamily: FILL_OPERATOR_CONSTRAINT
```

Independent solver enumerates every allowed operator in the one missing position.

Status: `RETAINED_CANDIDATE`.

### Candidate D2 — fill an ordered operator sequence with equality fixed

```text
taskKind: FILL_OPERATOR_SEQUENCE_FOR_EQUALITY
solveMode: fillOrderedOperatorsWithEqualityFixed
answerType: OPERATOR_SEQUENCE
```

Operator policies:

```text
USE_EACH_ALLOWED_TOKEN_ONCE
REUSE_ALLOWED
OPTIONS_DEFINE_CANDIDATES
```

Each policy is typed metadata. It does not automatically create a separate QL.

Status: `RETAINED_CANDIDATE`.

### Candidate D3 — fill operators including the relation position

```text
taskKind: INSERT_EQUALITY_WITH_OPERATORS
solveMode: fillOrderedOperatorsIncludingRelationPosition
answerType: OPERATOR_SEQUENCE
```

Material difference from D2:

- the relation boundary is not fixed;
- every candidate sequence can split the operands differently;
- parser validation follows insertion.

Status: `RETAINED_CANDIDATE`.

### Candidate D4 — fill operators to satisfy `<` or `>`

```text
taskKind: FILL_OPERATOR_SEQUENCE_FOR_RELATION
solveMode: fillOrderedOperatorsForTargetRelation
answerType: OPERATOR_SEQUENCE
```

Merge audit with D2:

- relation kind may be a parameter;
- retain separately only if source frequency, explanation or distractor behaviour differs materially.

Status: `MERGE_AUDIT_REQUIRED`.

## 9. Provisional partition E — operator interchange

### Candidate E1 — evaluate after a prescribed single pair interchange

```text
taskKind: EVALUATE_AFTER_GIVEN_INTERCHANGE
solveMode: evaluateAfterSpecifiedSingleOperatorPairSwap
answerType: INTEGER | RATIONAL
ruleFamily: GLOBAL_OPERATOR_PAIR_SWAP
```

Status: `RETAINED_CANDIDATE`.

### Candidate E2 — evaluate after prescribed two-pair interchange

```text
taskKind: EVALUATE_AFTER_GIVEN_INTERCHANGE
solveMode: evaluateAfterSpecifiedDoubleOperatorPairSwap
answerType: INTEGER | RATIONAL
ruleFamily: GLOBAL_TWO_OPERATOR_PAIR_SWAP
```

Potential merge with E1:

- transformation pair count may be a difficulty parameter;
- retain separately only if QL identity is needed for exam-pattern selection and explanation structure.

The recent SSC 2024 pattern provides strong product value for explicit two-pair sampling.

Status: `MERGE_AUDIT_REQUIRED_BUT_SOURCE_IMPORTANT`.

### Candidate E3 — identify one arithmetic pair that repairs an equation

```text
taskKind: IDENTIFY_OPERATOR_PAIR_TO_SWAP
solveMode: identifySingleOperatorPairSwapForEquation
answerType: OPERATOR_PAIR
```

Independent solver enumerates all eligible pairs from the original expression.

Status: `RETAINED_CANDIDATE`.

### Candidate E4 — identify two disjoint pairs that repair an equation

```text
taskKind: IDENTIFY_TWO_OPERATOR_PAIRS_TO_SWAP
solveMode: identifyTwoOperatorPairSwapsForEquation
answerType: TWO_OPERATOR_PAIRS
```

Material difference:

- answer semantic contains two simultaneous pairs;
- ambiguity pool includes all simpler single-pair repairs;
- compound pair canonicalisation is required.

Status: `RETAINED_CANDIDATE`.

### Candidate E5 — identify an arithmetic/relation pair interchange

```text
taskKind: IDENTIFY_OPERATOR_PAIR_TO_SWAP
solveMode: identifyArithmeticRelationPairSwapForEquation
answerType: OPERATOR_PAIR
ruleFamily: GLOBAL_OPERATOR_RELATION_PAIR_SWAP
```

Material difference:

- relation position can move;
- transformed stream must rediscover the equation boundary.

Status: `RETAINED_CANDIDATE`.

### Candidate E6 — select the correct equation after a prescribed interchange

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE
solveMode: selectCorrectEquationAfterSpecifiedOperatorSwap
answerType: EQUATION_OPTION
```

Every option is transformed independently from its own original token stream.

Status: `RETAINED_CANDIDATE`.

## 10. Provisional partition F — whole-number interchange

### Candidate F1 — identify the whole-number pair that repairs an equation

```text
taskKind: IDENTIFY_VALUE_PAIR_TO_SWAP
solveMode: identifyWholeNumberPairSwapForEquation
answerType: NUMBER_PAIR
ruleFamily: WHOLE_NUMBER_TOKEN_SWAP
```

Same-side and cross-side placements are generation dimensions, not separate QLs by default.

Status: `RETAINED_CANDIDATE`.

### Candidate F2 — evaluate after a prescribed whole-number swap

```text
taskKind: EVALUATE_AFTER_GIVEN_INTERCHANGE
solveMode: evaluateAfterSpecifiedWholeNumberSwap
answerType: INTEGER | RATIONAL
```

Status: `RETAINED_CANDIDATE`, pending source-frequency review.

### Candidate F3 — select the correct equation after a prescribed whole-number swap

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE
solveMode: selectCorrectEquationAfterSpecifiedWholeNumberSwap
answerType: EQUATION_OPTION
```

Status: `RETAINED_CANDIDATE`, pending source-frequency review.

## 11. Provisional partition G — digit-identity interchange

### Candidate G1 — identify the digit pair that repairs an equation

```text
taskKind: IDENTIFY_DIGIT_PAIR_TO_SWAP
solveMode: identifyDigitPairSwapForEquation
answerType: DIGIT_PAIR
ruleFamily: DIGIT_IDENTITY_SWAP
```

Independent solver:

```text
enumerate eligible digit pairs appearing in the source
  -> apply global simultaneous digit substitution
  -> reject leading-zero literals
  -> parse and evaluate from scratch
  -> require one valid pair
```

Status: `RETAINED_CANDIDATE`.

### Candidate G2 — evaluate after a prescribed digit swap

```text
taskKind: EVALUATE_AFTER_GIVEN_INTERCHANGE
solveMode: evaluateAfterSpecifiedDigitSwap
answerType: INTEGER | RATIONAL
```

Status: `RETAINED_CANDIDATE`, pending source-frequency review.

### Candidate G3 — select the correct equation after a prescribed digit swap

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE
solveMode: selectCorrectEquationAfterSpecifiedDigitSwap
answerType: EQUATION_OPTION
```

Status: `RETAINED_CANDIDATE`.

## 12. Provisional partition H — combined transformations

### Candidate H1 — identify an operator pair and whole-number pair

```text
taskKind: IDENTIFY_OPERATOR_AND_VALUE_SWAP
solveMode: identifyOperatorAndWholeNumberPairSwap
answerType: OPERATOR_AND_VALUE_SWAP
ruleFamily: COMPOUND_OPERATOR_NUMBER_SWAP
```

Independent solver verifies every compound option from the original expression.

Status: `RETAINED_CANDIDATE`.

### Candidate H2 — identify an operator pair and digit pair

```text
taskKind: IDENTIFY_OPERATOR_AND_VALUE_SWAP
solveMode: identifyOperatorAndDigitPairSwap
answerType: OPERATOR_AND_VALUE_SWAP
ruleFamily: COMPOUND_OPERATOR_DIGIT_SWAP
```

Materially distinct from H1 because digit processing and leading-zero validation differ.

Status: `RETAINED_CANDIDATE`.

### Candidate H3 — identify two signs and two values

```text
taskKind: IDENTIFY_COMPOUND_MULTI_PAIR_SWAP
solveMode: identifyTwoSignsAndTwoValuesSwap
answerType: COMPOUND_SWAP
```

Retention rule:

- keep only if the answer truly contains more transformation components than H1;
- reject a wording-only duplicate of one operator pair plus one number pair.

Status: `SPLIT_OR_MERGE_AUDIT_REQUIRED`.

### Candidate H4 — evaluate after a prescribed compound transformation

```text
taskKind: EVALUATE_AFTER_GIVEN_INTERCHANGE
solveMode: evaluateAfterSpecifiedCompoundSwap
answerType: INTEGER | RATIONAL
```

Compound subtype is typed:

```text
operator + whole number
operator + digit
two operator pairs + value pair
```

Status: `RETAINED_CANDIDATE`.

### Candidate H5 — select the correct equation after a prescribed compound transformation

```text
taskKind: IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE
solveMode: selectCorrectEquationAfterSpecifiedCompoundSwap
answerType: EQUATION_OPTION
```

Status: `RETAINED_CANDIDATE`.

## 13. Provisional partition I — hidden operator mappings and equation puzzles

### Candidate I1 — infer mapping and evaluate a target

```text
taskKind: INFER_MAPPING_AND_EVALUATE_TARGET
solveMode: inferOperatorMappingThenEvaluateTarget
answerType: INTEGER | RATIONAL
ruleFamily: HIDDEN_OPERATOR_MAPPING
```

Independent solver:

```text
enumerate eligible mappings
  -> retain mappings satisfying all examples
  -> require unique mapping under V1 policy
  -> transform and solve target
```

Status: `RETAINED_CANDIDATE`.

### Candidate I2 — infer mapping and recover a missing result

```text
taskKind: INFER_MAPPING_AND_RECOVER_RESULT
solveMode: inferOperatorMappingThenRecoverMissingResult
answerType: INTEGER | RATIONAL
```

Merge audit with I1 after renderer proof.

Status: `MERGE_AUDIT_REQUIRED`.

### Candidate I3 — infer mapping and select the correct equation

```text
taskKind: INFER_MAPPING_AND_IDENTIFY_TRUE_STATEMENT
solveMode: inferOperatorMappingThenSelectCorrectEquation
answerType: EQUATION_OPTION
```

Materially distinct because all target options require evaluation.

Status: `RETAINED_CANDIDATE`.

### Candidate I4 — recover one unknown operator meaning

```text
taskKind: INFER_HIDDEN_OPERATOR_MAPPING
solveMode: recoverOneUnknownOperatorMeaning
answerType: OPERATOR | RELATION_OPERATOR
```

Material difference:

- answer is a mapping component rather than a target result;
- evidence uniqueness is assessed for one token meaning.

Status: `RETAINED_CANDIDATE`.

### Candidate I5 — select a mapping consistent with examples

```text
taskKind: INFER_HIDDEN_OPERATOR_MAPPING
solveMode: selectPossibleOperatorMappingFromExamples
answerType: MAPPING_OPTION
```

Retention concern:

- “possible” may intentionally allow several globally valid mappings;
- V1 normally requires a unique full mapping;
- retain only with a precise answer contract and source support.

Status: `DEFERRED_CANDIDATE`.

## 14. Cross-cutting representation dimensions

These dimensions must be sampled across retained QLs without automatically multiplying QL count.

### Numeric literals

```text
positive integer
zero where safe
negative literal where source-backed
finite decimal
exact fraction display
```

### Expression topology

```text
three operands
four operands
long expression
repeated operators
one bracket group
multiple non-nested bracket groups
nested groups where mobile rendering remains clear
```

### Equation topology

```text
fixed equality
insertable equality
less-than target
greater-than target
negative side result
relation relocated by interchange
```

### Mapping topology

```text
complete bijection
partial active mapping
many-to-one supplied mapping
arbitrary letter tokens
font-safe punctuation tokens
word tokens after locale proof
```

### Swap topology

```text
single pair
two disjoint pairs
arithmetic-relation pair
whole-number pair
digit pair
compound operator-number
compound operator-digit
```

### Query polarity

```text
correct
incorrect
true
false
```

Polarity should be treated as a controlled presentation dimension unless it changes the contract materially.

## 15. Ambiguity pool registry

```text
OPS-AMB-GIVEN-MAPPING-EVAL
OPS-AMB-GIVEN-MAPPING-EQUATION
OPS-AMB-ARBITRARY-TOKEN-EVAL
OPS-AMB-MIXED-RELATION
OPS-AMB-FILL-SINGLE
OPS-AMB-FILL-SEQUENCE
OPS-AMB-OPERATOR-SWAP
OPS-AMB-OPERATOR-RELATION-SWAP
OPS-AMB-NUMBER-SWAP
OPS-AMB-DIGIT-SWAP
OPS-AMB-COMPOUND-SWAP
OPS-AMB-HIDDEN-MAPPING
```

Every eventual QL must bind one primary ambiguity pool and may add eligible neighbouring pools.

## 16. Explanation strategy registry

```text
OPS-EXP-MAP-THEN-EVALUATE
OPS-EXP-MAP-ALL-OPTIONS
OPS-EXP-COMPARE-TRANSFORMED-SIDES
OPS-EXP-INSERT-SEQUENCE-AND-VERIFY
OPS-EXP-SIMULTANEOUS-SWAP-AND-EVALUATE
OPS-EXP-ENUMERATE-SWAP-PAIR
OPS-EXP-DIGIT-SWAP-WITH-LITERAL-REBUILD
OPS-EXP-COMPOUND-SWAP
OPS-EXP-INFER-MAPPING-FROM-EVIDENCE
OPS-EXP-RECOVER-MAPPING-COMPONENT
```

Explanations must be generated from solver traces but should not all use identical prose shells.

## 17. Provisional candidate summary

The current retained and audit-required contracts span:

- supplied mapping evaluation and equation selection;
- arbitrary-token mapping;
- mixed arithmetic/relation mapping;
- single and sequence operator filling;
- arithmetic and relation-aware operator interchange;
- whole-number interchange;
- digit-identity interchange;
- compound transformations;
- hidden operator mapping.

No numeric total is frozen. The apparent candidate count in this document must not be treated as a quota or final chapter size.

## 18. Manifest freeze blockers

```text
BANKING_SOURCE_EVIDENCE           = INCOMPLETE
PUNJAB_SOURCE_EVIDENCE            = INCOMPLETE
HI_TERMINOLOGY_REVIEW             = INCOMPLETE
PA_TERMINOLOGY_REVIEW             = INCOMPLETE
CP_SPLIT_MERGE_RUNTIME_PROOF       = NOT_STARTED
CANDIDATE_MERGE_AUDIT             = NOT_STARTED
CANDIDATE_GAP_AUDIT               = PARTIAL
MOBILE_RENDER_WIDTH_PROOF         = NOT_STARTED
FINAL_QL_IDS_AND_RANGES           = BLOCKED
```

## 19. Next gate

The next gate is a small foundation and runtime-proof design, not broad QL implementation:

1. specify exact numeric, token and AST contracts;
2. specify transformation fingerprints and canonicalisation;
3. prototype supplied mapping evaluation;
4. prototype arithmetic/relation pair interchange;
5. prototype whole-number and digit swaps independently;
6. run candidate merge audits using generated examples;
7. continue Banking and Punjab source saturation;
8. perform Hindi and Punjabi terminology review;
9. only then prepare the final chapter manifest.
