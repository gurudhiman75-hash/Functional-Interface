# Permutation & Combination — End-to-End Quant V4 Design

> **Status:** Frozen implementation blueprint.
> **Family:** `PermutationAndCombination`
> **Packages:** `PNC-001`, `PNC-002`
> **Topic path:** `Arithmetic → Permutation & Combination`
> **Target exams:** SSC, Banking, Railways, Punjab State and comparable aptitude examinations.
> **Design date:** 2026-07-24
> **Implementation rule:** Do not begin package expansion until this document is committed. Any later scope change must be recorded in a dated design-amendment section rather than silently changing CP ownership.

---

## 1. Executive Summary

This document defines the complete Permutation & Combination family for ExamTree Quant V4. It follows the mature package conventions already used by Percentage, Ratio & Proportion and Average:

- canonical-problem-first chapter design;
- human-owned question and explanation libraries;
- typed task registry and solve modes;
- deterministic parameter generation;
- one authoritative solver;
- reasoning evidence consumed by customized explanations;
- chapter-specific validators;
- coverage, duplicate, placeholder, runtime and maturity audits;
- English-first implementation followed by controlled Hindi/Punjabi localization;
- checkpointed feature branches and freeze records.

The family is intentionally split into only two packages. This avoids ten shallow folders while keeping foundational and advanced counting logic independently testable.

| Package | Title | CPs | English QLs | Primary role |
|---|---|---:|---:|---|
| `PNC-001` | Counting Foundations, Basic Permutations & Basic Combinations | `PNC-CP-001`–`006` | 360 | Core counting authority and unrestricted forms |
| `PNC-002` | Restricted Arrangements, Grouping & Advanced Selection | `PNC-CP-007`–`012` | 360 | Constraint casework, circular counting, grouping and mixed systems |
| **Family total** |  | **12** | **720** | Complete exam-oriented P&C coverage |

Probability is not part of this family. Probability may consume P&C counting utilities later, but it must not own or duplicate factorial, permutation, combination, multiset, circular or grouping logic.

---

## 2. Family Placement and Naming

### 2.1 Repository path

```text
artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/
├── pnc-family-end-to-end-design.md
├── PNC-001/
└── PNC-002/
```

The runtime topic remains `Arithmetic` for consistency with the current Quant V4 generation engine and admin taxonomy. The product-facing subtopic label is `Permutation & Combination`.

### 2.2 ID conventions

- Package IDs: `PNC-001`, `PNC-002`
- Canonical problem IDs: `PNC-CP-001` through `PNC-CP-012`
- Question-language IDs: `PNC-QL-001` through `PNC-QL-720`
- Explanation-family IDs: `PNC-EXP-001` onward
- Question IDs: generated per runtime instance; never hard-coded into human libraries

IDs are continuous across the family. `PNC-002` must not restart CP or QL numbering.

---

## 3. Scope Boundary

### 3.1 Included

The P&C family includes:

- addition and multiplication counting principles;
- mutually exclusive case partitioning and complementary counting;
- factorials, `nPr`, `nCr` and their exact integer identities;
- unrestricted linear arrangements;
- basic and conditional selections;
- fixed-position and role-assignment problems;
- digit/number formation with repetition, leading-zero, parity, divisibility and threshold constraints;
- word arrangements with distinct and repeated letters;
- word rank for small manually validated profiles;
- together/apart/block restrictions;
- fixed position, relative order, alternation and gap methods;
- circular-table arrangements;
- limited necklace/garland reflection equivalence as a hard tagged sub-family;
- committee and team constraints;
- handshake, lines, triangles and diagonals as direct `nCr` applications;
- grouping people or objects into labeled/unlabeled groups;
- distribution of distinct or identical objects under small exam-safe constraints;
- grid/path counting where it is a pure counting problem;
- small derangement problems using explicit inclusion–exclusion;
- mixed selection-then-arrangement casework.

### 3.2 Excluded

These do not belong in PNC-001 or PNC-002:

- probability, conditional probability, Bayes theorem or expected value;
- binomial expansion as an algebra chapter;
- generating functions;
- Stirling numbers, Bell numbers or unrestricted set-partition theory;
- graph-theory counting beyond direct lines/triangles/diagonals;
- recurrence-heavy olympiad combinatorics;
- pigeonhole principle as a standalone chapter;
- combinations with repetition when it becomes an unbounded algebraic partition problem outside exam scope;
- unrestricted integer partitions;
- advanced inclusion–exclusion with many intersecting sets.

### 3.3 Deferred/low-weight material

The following may exist only in tagged Hard QLs and must not dominate the package:

- necklace/garland reflection equivalence;
- dictionary rank with repeated letters;
- derangements;
- restricted grid paths;
- identical-object distribution with positivity constraints.

---

## 4. Package Map and Exact QL Allocation

### 4.1 `PNC-001` — Counting Foundations, Basic Permutations & Basic Combinations

| CP | Name | QL range | Count |
|---|---|---:|---:|
| `PNC-CP-001` | Fundamental Counting Principle & Case Partition | `PNC-QL-001`–`048` | 48 |
| `PNC-CP-002` | Distinct Linear Permutations & Positional Assignments | `PNC-QL-049`–`102` | 54 |
| `PNC-CP-003` | Basic Combinations & Direct Selection Applications | `PNC-QL-103`–`156` | 54 |
| `PNC-CP-004` | Digit, Number, Code & Password Formation | `PNC-QL-157`–`234` | 78 |
| `PNC-CP-005` | Word, Letter & Multiset Arrangements | `PNC-QL-235`–`300` | 66 |
| `PNC-CP-006` | Selection-Then-Arrangement & Role Assignment | `PNC-QL-301`–`360` | 60 |
| **Total** |  |  | **360** |

Target difficulty distribution:

| CP | Easy | Medium | Hard | Total |
|---|---:|---:|---:|---:|
| CP-001 | 22 | 18 | 8 | 48 |
| CP-002 | 19 | 19 | 16 | 54 |
| CP-003 | 18 | 20 | 16 | 54 |
| CP-004 | 25 | 28 | 25 | 78 |
| CP-005 | 18 | 22 | 26 | 66 |
| CP-006 | 14 | 15 | 31 | 60 |
| **Total** | **116** | **122** | **122** | **360** |

### 4.2 `PNC-002` — Restricted Arrangements, Grouping & Advanced Selection

| CP | Name | QL range | Count |
|---|---|---:|---:|
| `PNC-CP-007` | Together, Apart & Block Restrictions | `PNC-QL-361`–`432` | 72 |
| `PNC-CP-008` | Position, Relative Order, Alternation & Gap Constraints | `PNC-QL-433`–`504` | 72 |
| `PNC-CP-009` | Conditional Selection from Categories | `PNC-QL-505`–`570` | 66 |
| `PNC-CP-010` | Circular Arrangements & Rotational Symmetry | `PNC-QL-571`–`618` | 48 |
| `PNC-CP-011` | Grouping & Distribution | `PNC-QL-619`–`666` | 48 |
| `PNC-CP-012` | Mixed Advanced Counting Systems | `PNC-QL-667`–`720` | 54 |
| **Total** |  |  | **360** |

Target difficulty distribution:

| CP | Easy | Medium | Hard | Total |
|---|---:|---:|---:|---:|
| CP-007 | 16 | 30 | 26 | 72 |
| CP-008 | 12 | 30 | 30 | 72 |
| CP-009 | 16 | 28 | 22 | 66 |
| CP-010 | 12 | 20 | 16 | 48 |
| CP-011 | 10 | 18 | 20 | 48 |
| CP-012 | 6 | 18 | 30 | 54 |
| **Total** | **72** | **144** | **144** | **360** |

PNC-002 intentionally skews toward Medium/Hard because every CP contains at least one structural constraint.

---

## 5. Canonical Problems

## `PNC-CP-001 — Fundamental Counting Principle & Case Partition`

**Mission:** Establish the counting model before formulas are introduced.

Include:

- multiplication principle for sequential independent stages;
- addition principle for mutually exclusive alternatives;
- case partition where different first choices create different later counts;
- complementary counting for one simple forbidden condition;
- reverse tasks where total outcomes and all but one stage count are given;
- route, outfit, menu, code, transport, subject-choice and task-allocation contexts.

Core invariants:

- multiply only when every outcome requires one choice from each stage;
- add only across disjoint cases;
- case totals must not overlap;
- complementary count is `total − invalid`.

## `PNC-CP-002 — Distinct Linear Permutations & Positional Assignments`

Include:

- arranging all `n` distinct objects: `n!`;
- arranging `r` of `n` distinct objects: `nPr`;
- filling ordered positions;
- fixed named object in a position;
- one or more pre-filled positions;
- recovering small `n` or `r` from a permutation value;
- shelf, queue, race-rank, seat, flag and ordered-code contexts.

Exclude together/apart and alternation restrictions; those belong to PNC-002.

## `PNC-CP-003 — Basic Combinations & Direct Selection Applications`

Include:

- choosing `r` from `n` where order does not matter;
- `nCr = nC(n-r)` symmetry;
- direct compulsory inclusion/exclusion with one named member;
- handshake counts;
- line segments from points;
- triangles from non-collinear points;
- diagonals of a polygon;
- recovering small `n` from a combination value;
- direct team/committee selection without category constraints.

Conditional category counts belong to CP-009.

## `PNC-CP-004 — Digit, Number, Code & Password Formation`

Include:

- fixed-length numbers with and without repetition;
- leading-zero restrictions;
- even/odd last-digit casework;
- divisibility by 5, 4 or other small exam-safe rules;
- numbers greater/less than a threshold with controlled first-digit cases;
- repetition required, prohibited or exactly once;
- codes/passwords where leading zero is allowed;
- alphanumeric codes with separate letter/digit stages;
- reverse tasks asking for available symbols or code length only when the answer is uniquely recoverable.

Every task must state whether repetition is allowed. Number and code semantics must not be mixed: a code may start with zero; a fixed-length number may not.

## `PNC-CP-005 — Word, Letter & Multiset Arrangements`

Include:

- distinct-letter arrangements;
- repeated-letter multinomial arrangements;
- fixed initial/final letter;
- simple vowels-together or consonants-together forms;
- selecting and arranging a subset of letters;
- manually curated dictionary-rank tasks for small words;
- words with one or two repeated-letter groups;
- book/category analogues only when they are truly multiset arrangements.

All word profiles must be human-curated with verified letter counts. The generator must never infer multiplicities from an uncontrolled natural-language word at runtime.

## `PNC-CP-006 — Selection-Then-Arrangement & Role Assignment`

Include:

- choose a team, then choose captain/vice-captain;
- choose a committee, then assign distinct offices;
- select candidates for ordered prizes or ranks;
- choose objects and place them into ordered slots;
- allocate distinct roles across simple categories;
- multi-stage codes that require selecting a symbol set before ordering it;
- compare `nCr × r!` with `nPr` through actual scenarios.

This CP is the bridge from PNC-001 to PNC-002. Restrictions involving together/apart, category minimums or circular seating remain in PNC-002.

## `PNC-CP-007 — Together, Apart & Block Restrictions`

Include:

- two or more named entities together;
- named entities never together via complement;
- two disjoint blocks;
- all members of a category together;
- books of the same subject together;
- internal order of each block;
- exactly one adjacent named pair only when cases are disjoint and validator-backed.

The explanation must explicitly count the external units and internal block orders.

## `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`

Include:

- fixed end or middle positions;
- named entities with a stated number between them;
- relative order preserved among selected entities;
- men/women or category alternation;
- no two of a category adjacent using gaps;
- end-position restrictions;
- one category occupying odd/even positions;
- small seat patterns with non-overlapping constraints.

Do not use generic subtraction when a gap construction is the cleaner counting model.

## `PNC-CP-009 — Conditional Selection from Categories`

Include:

- exactly `k` from a category;
- at least/at most category counts;
- one or more compulsory members;
- named members who cannot serve together;
- minimum representation from each category;
- majority/minority composition;
- case sums and simple complement methods;
- committees/teams drawn from two or three small categories.

Each case must be explicitly disjoint and the reasoning evidence must list every included case count.

## `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`

Include:

- ordinary round-table arrangements: `(n−1)!`;
- fixing one reference person;
- named persons together/not together around a circle;
- alternation around a circle;
- fixed relative neighbor constraints;
- clockwise/anticlockwise positional statements;
- low-weight necklace/garland reflection equivalence with an explicit `reflectionEquivalent` profile.

Table seating and necklace/garland counting must use different solve modes. Reflection must never be divided by two unless the profile says mirror images are identical and no exceptional symmetry invalidates the shortcut.

## `PNC-CP-011 — Grouping & Distribution`

Include:

- dividing distinct people into labeled groups;
- dividing into equal unlabeled groups with identical-group correction;
- forming pairs;
- sequentially selecting disjoint subgroups;
- distributing distinct objects to distinct recipients;
- small surjective/nonempty distributions using inclusion–exclusion;
- limited identical-object distributions using stars-and-bars where target-exam appropriate;
- positive versus nonnegative allocation distinctions.

The solver must preserve the difference between labeled and unlabeled groups.

## `PNC-CP-012 — Mixed Advanced Counting Systems`

Include:

- selection followed by restricted arrangement;
- multi-condition number formation;
- multi-condition word arrangement;
- committee with posts and category restrictions;
- restricted grid/path counting;
- small derangements through inclusion–exclusion;
- hybrid complement plus case partition;
- problems where two valid methods are compared and proven equivalent.

Every QL in this CP must have a bounded case topology and a brute-force oracle for small generated parameters.

---

## 6. Type System

Each package has its own exported types but shares a family math module after PNC-001 is stable.

### 6.1 Core types

```ts
export type PncPackageId = "PNC-001" | "PNC-002";
export type PncLanguage = "en" | "hi" | "pa";
export type PncDifficultyBand = "Easy" | "Medium" | "Hard";

export type PncAnswerType =
  | "COUNT"
  | "PERMUTATION_COUNT"
  | "COMBINATION_COUNT"
  | "NUMBER_FORMATION_COUNT"
  | "WORD_ARRANGEMENT_COUNT"
  | "CIRCULAR_COUNT"
  | "GROUPING_COUNT"
  | "UNKNOWN_PARAMETER"
  | "RANK";
```

### 6.2 Task-registry entry

```ts
export interface PncTaskRegistryEntry {
  cpId: PncCanonicalProblemId;
  taskKind: PncTaskKind;
  solveMode: PncSolveMode;
  answerType: PncAnswerType;
  explanationId: string;
  requiredVariables: string[];
  scenarioFamily: string;
  contextTag: string;
  constraintProfile?: string;
  distractorProfile: string;
  difficulty: PncDifficultyBand;
}
```

### 6.3 Solve modes

#### CP-001

- `countSequentialIndependentChoices`
- `countMutuallyExclusiveAlternatives`
- `countDisjointCasePartition`
- `countUsingSimpleComplement`
- `recoverMissingStageChoiceCount`

#### CP-002

- `arrangeAllDistinctObjects`
- `arrangeRFromNDistinctObjects`
- `fillOrderedPositions`
- `arrangeWithFixedNamedPosition`
- `recoverParameterFromPermutationCount`

#### CP-003

- `chooseRFromNDistinctObjects`
- `chooseUsingCombinationSymmetry`
- `chooseWithSingleCompulsoryMember`
- `chooseWithSingleExcludedMember`
- `countHandshakesOrPairs`
- `countGeometricSelections`
- `recoverParameterFromCombinationCount`

#### CP-004

- `formFixedLengthNumbersNoRepetition`
- `formFixedLengthNumbersWithRepetition`
- `formNumbersWithLeadingZeroRestriction`
- `formEvenOrOddNumbers`
- `formNumbersDivisibleBySmallBase`
- `formNumbersAboveOrBelowThreshold`
- `formCodesOrPasswords`
- `formAlphanumericCodes`
- `formWithExactRepetitionCondition`

#### CP-005

- `arrangeDistinctLetters`
- `arrangeRepeatedLetters`
- `arrangeWithFixedInitialOrFinalLetter`
- `arrangeVowelsOrConsonantsTogetherBasic`
- `selectAndArrangeLetters`
- `findDictionaryRankDistinctLetters`
- `findDictionaryRankRepeatedLetters`

#### CP-006

- `chooseCommitteeThenAssignPosts`
- `chooseTeamThenCaptain`
- `selectThenFillOrderedSlots`
- `assignDistinctPrizesOrRanks`
- `allocateRolesAcrossSimpleCategories`
- `showPermutationCombinationEquivalence`

#### CP-007

- `arrangeNamedEntitiesTogether`
- `arrangeNamedEntitiesNotTogether`
- `arrangeMultipleBlocks`
- `arrangeCategoryTogether`
- `arrangeBooksGroupedBySubject`
- `countExactlyOneAdjacentNamedPair`

#### CP-008

- `arrangeWithFixedEndOrMiddlePositions`
- `arrangeWithSpecifiedEntitiesBetween`
- `arrangePreservingRelativeOrder`
- `arrangeAlternatingCategories`
- `arrangeNoTwoCategoryMembersAdjacent`
- `arrangeCategoryInOddOrEvenPositions`
- `arrangeWithCombinedPositionConstraints`

#### CP-009

- `chooseExactCategoryComposition`
- `chooseAtLeastCategoryCount`
- `chooseAtMostCategoryCount`
- `chooseWithCompulsoryNamedMembers`
- `chooseWithMutuallyExclusiveNamedMembers`
- `chooseWithMinimumRepresentation`
- `chooseUsingComplementAcrossCategories`

#### CP-010

- `arrangeAroundRoundTable`
- `arrangeTogetherAroundCircle`
- `arrangeNotTogetherAroundCircle`
- `arrangeAlternatingAroundCircle`
- `arrangeWithCircularNeighborConstraint`
- `arrangeNecklaceOrGarland`

#### CP-011

- `divideIntoLabeledGroups`
- `divideIntoEqualUnlabeledGroups`
- `formDisjointPairs`
- `selectSequentialDisjointSubgroups`
- `distributeDistinctObjectsToRecipients`
- `distributeDistinctObjectsNonempty`
- `distributeIdenticalObjectsNonnegative`
- `distributeIdenticalObjectsPositive`

#### CP-012

- `selectThenArrangeWithRestrictions`
- `mixedNumberFormationCasework`
- `mixedWordArrangementCasework`
- `committeeWithPostsAndRestrictions`
- `countRestrictedGridPaths`
- `countSmallDerangements`
- `countUsingMultiConditionComplement`
- `proveEquivalentCountingMethods`

---

## 7. Package File Shape

Each package follows the mature Quant V4 package pattern.

```text
PNC-00X/
├── archetype.md
├── canonical-problems.md
├── difficulty-framework.md
├── reasoning-patterns.md
├── implementation-plan.md
├── library-authority-map.md
├── task-registry.library.json
├── variable-ranges.library.json
├── constraint-profiles.library.json
├── word-profiles.library.json           # required when package owns word tasks
├── coverage-targets.library.json
├── distribution-targets.library.json
├── question-language.en.json
├── question-language.hi.json
├── question-language.pa.json
├── explanation.en.json
├── explanation.hi.json
├── explanation.pa.json
├── index.ts
├── types.ts                             # thin re-export
├── math.ts                              # thin re-export or family re-export
├── parameter-generator.ts              # thin re-export
├── solver.ts                            # thin re-export
├── reasoning-graph.ts                   # thin re-export
├── explanation-renderer.ts              # thin re-export
├── validator.ts                         # thin re-export
├── pipeline.ts                          # thin re-export
├── coverage-auditor.ts                  # thin re-export
├── pnc-00x.test.ts
├── pnc-00x-content-audit.ts
├── pnc-00x-multilingual-audit.ts
└── foundation/
    ├── types.ts
    ├── library.ts
    ├── math.ts
    ├── parameter-generator.ts
    ├── solver.ts
    ├── reasoning-graph.ts
    ├── explanation-renderer.ts
    ├── validator.ts
    ├── pipeline.ts
    └── coverage-auditor.ts
```

A family-shared math module may be introduced after PNC-001 stabilizes:

```text
PermutationAndCombination/shared/
├── exact-counting.ts
├── brute-force-oracles.ts
├── constraint-types.ts
└── index.ts
```

PNC-002 may consume this module. It must not copy factorial or combination implementations.

---

## 8. Human-Owned Libraries

### 8.1 `task-registry.library.json`

Authoritative mapping from every QL to:

- CP;
- task kind;
- solve mode;
- answer type;
- explanation family;
- required placeholders;
- scenario/context family;
- restriction profile;
- distractor profile;
- difficulty.

No runtime code may silently infer a different solve mode from stem wording.

### 8.2 `variable-ranges.library.json`

Curated pools must include:

- `n` values generally from 3 to 12;
- `r` values satisfying `0 ≤ r ≤ n`;
- stage-choice vectors;
- category counts;
- digit sets including profiles with and without zero;
- code lengths;
- group sizes;
- circle sizes;
- grid dimensions;
- answer ceilings;
- difficulty-specific parameter caps.

All pools must be chosen so answers remain exact positive integers and safe for the option-generation pipeline.

### 8.3 `constraint-profiles.library.json`

Human-owned named profiles such as:

- `NO_REPETITION`
- `REPETITION_ALLOWED`
- `LEADING_ZERO_FORBIDDEN`
- `EVEN_LAST_DIGIT`
- `NAMED_PAIR_TOGETHER`
- `NAMED_PAIR_APART`
- `ALTERNATING_CATEGORIES`
- `NO_ADJACENT_CATEGORY`
- `ROTATION_EQUIVALENT`
- `REFLECTION_EQUIVALENT`
- `LABELED_GROUPS`
- `UNLABELED_EQUAL_GROUPS`
- `NONEMPTY_RECIPIENTS`

Profiles contain semantic flags only. They do not contain precomputed answers.

### 8.4 `word-profiles.library.json`

Each entry records:

```jsonc
{
  "word": "BANANA",
  "letters": ["B", "A", "N", "A", "N", "A"],
  "multiplicities": { "A": 3, "N": 2, "B": 1 },
  "vowels": ["A"],
  "consonants": ["B", "N"],
  "dictionaryOrder": ["A", "B", "N"],
  "allowedSolveModes": ["arrangeRepeatedLetters"]
}
```

The audit must recompute multiplicities from `letters` and reject metadata drift.

### 8.5 Coverage and distribution targets

`coverage-targets.library.json` records exact CP, QL, explanation-family and language counts.

`distribution-targets.library.json` records:

- exact per-CP QL count;
- exact package difficulty counts;
- minimum solve-mode representation;
- scenario-family caps;
- maximum repeated context share;
- low-weight advanced-family ceilings.

---

## 9. Exact Counting Math Contract

### 9.1 Internal arithmetic

All core combinatorial calculations must use exact integer arithmetic. Implement with `bigint` internally, then convert to `number` only after proving the result is within `Number.MAX_SAFE_INTEGER` and within the configured product ceiling.

Required helpers:

- `factorialBigInt(n)`
- `permutationBigInt(n, r)`
- `combinationBigInt(n, r)` using multiplicative cancellation
- `multinomialBigInt(total, multiplicities)`
- `circularPermutationBigInt(n)`
- `fallingProductBigInt(start, length)`
- `productBigInt(values)`
- `sumBigInt(values)`
- `starsAndBarsNonnegativeBigInt(objects, boxes)`
- `starsAndBarsPositiveBigInt(objects, boxes)`
- `derangementBigInt(n)` for small `n`
- `assertSafeCount(value, context)`

### 9.2 Mathematical invariants

- `nPr = nCr × r!`
- `nCr = nC(n-r)`
- all factorial inputs are non-negative integers;
- all combination/permutation inputs satisfy `0 ≤ r ≤ n`;
- multinomial multiplicities sum to the total;
- ordinary circular arrangements divide linear arrangements by `n`, not by `2n`;
- unlabeled equal groups divide by the factorial of the number of identical groups;
- nonempty distribution counts exclude empty-recipient assignments;
- leading zero is excluded only for numbers, not codes;
- every final answer is a non-negative integer; product-facing generated questions should normally have a positive answer.

### 9.3 Answer ceiling

Default runtime ceiling: `9_000_000_000_000_000` is technically safe, but product QLs should target substantially smaller counts. The package validator should enforce a configurable chapter ceiling, initially `1_000_000_000`, unless a reviewed QL explicitly allows a larger safe integer.

---

## 10. Parameter Generation Contract

The parameter generator selects a QL first, then generates values compatible with that registry entry. It must not generate a random topology and later search for a matching sentence.

Generation order:

1. validate package and CP;
2. select eligible QLs by CP, difficulty and language;
3. select one deterministic QL using the seed;
4. load its solve mode, constraint profile and required variables;
5. generate candidate parameters from curated pools;
6. compute derived evidence with the solver;
7. reject candidates violating semantic, answer-ceiling, uniqueness or display constraints;
8. render stem and explanation;
9. validate the complete package.

Rejection must be bounded. Every QL family should have constructive parameter generation where possible rather than unbounded retry loops.

---

## 11. Solver and Reasoning Evidence

The solver is the sole mathematical answer authority. Explanations and options consume solver evidence; they must not independently recalculate the answer using duplicate formulas.

Suggested solver result:

```ts
export interface PncSolverResult {
  answer: number;
  exactAnswer: string;
  formula: string;
  mathJax: string;
  method: PncCountingMethod;
  evidence: {
    ordered: boolean;
    totalCount?: number;
    validCount?: number;
    invalidCount?: number;
    caseCounts?: Array<{ label: string; count: number }>;
    stageCounts?: number[];
    blockCount?: number;
    internalOrders?: number[];
    gapCount?: number;
    multiplicities?: number[];
    symmetryDivisor?: number;
    groupDivisor?: number;
    numeratorFactors?: number[];
    denominatorFactors?: number[];
    selectedFormula?: string;
  };
}
```

Every solve mode defines required evidence fields. Validators reject a package whose explanation family requires evidence the solver did not produce.

---

## 12. Customized Explanation Architecture

P&C must not use one generic explanation per CP. The explanation authority is **solve-mode/family based**, with optional task-specific variants.

Each explanation should establish:

1. what one outcome consists of;
2. whether order matters;
3. whether cases are sequential or mutually exclusive;
4. which restrictions apply;
5. the valid units, blocks, gaps, cases, groups or symmetry divisor;
6. the exact count for every case or stage;
7. why counts are multiplied, added, divided or subtracted;
8. the final answer.

Example evidence-driven structure for `arrangeNamedEntitiesTogether`:

```text
Treat the named entities as one block.
The block and the remaining entities form {{externalUnitCount}} units.
They can be arranged in {{externalArrangementCount}} ways.
The named entities can be ordered inside the block in {{internalArrangementCount}} ways.
Therefore, total arrangements = {{externalArrangementCount}} × {{internalArrangementCount}} = {{answer}}.
```

For casework, explanations must enumerate cases from `solver.evidence.caseCounts`; prose may not mention a case absent from the evidence.

---

## 13. Distractor Architecture

Distractors must correspond to identifiable counting mistakes. The initial taxonomy is:

- `PERMUTATION_COMBINATION_SWAP`
- `USED_N_FACTORIAL_INSTEAD_OF_NPR`
- `IGNORED_INTERNAL_BLOCK_ORDER`
- `SUBTRACTED_FROM_WRONG_TOTAL`
- `FORGOT_REPEATED_FACTORIAL_DIVISOR`
- `LEADING_ZERO_ALLOWED_IN_NUMBER`
- `LEADING_ZERO_FORBIDDEN_IN_CODE`
- `REPETITION_RULE_REVERSED`
- `PARITY_CASE_OMITTED`
- `CASE_OVERLAP_DOUBLE_COUNT`
- `CASE_OMITTED`
- `COMPLEMENT_INVALID_COUNT_ERROR`
- `GAP_COUNT_OFF_BY_ONE`
- `CIRCULAR_TREATED_AS_LINEAR`
- `NECKLACE_REFLECTION_DIVISOR_OMITTED`
- `NECKLACE_DIVIDED_BY_TWO_WHEN_NOT_ALLOWED`
- `HANDSHAKE_DOUBLE_COUNT`
- `DIAGONAL_FORMULA_USED_WITHOUT_REMOVING_SIDES`
- `ROLE_ASSIGNMENT_FACTORIAL_OMITTED`
- `LABELED_UNLABELED_GROUPS_CONFUSED`
- `EMPTY_RECIPIENT_CASES_INCLUDED`
- `POSITIVE_NONNEGATIVE_DISTRIBUTION_CONFUSED`
- `DICTIONARY_RANK_OFF_BY_ONE`
- `FACTORIAL_ARITHMETIC_SLIP`

At least two distractors per QL should be structurally derived from its solve mode. Generic `answer ± k` is only a final fallback and should be reported by the audit.

---

## 14. Difficulty Framework

Difficulty is determined by three dimensions:

- **SC — Structural Complexity:** number of stages, cases, blocks, categories or constraints;
- **CE — Computational Effort:** factorial size, number of products/sums and simplification burden;
- **RD — Reasoning Depth:** direct formula, model choice, complement, case partition, symmetry correction or hybrid proof.

### Easy

- one direct rule;
- small values;
- explicit statement of repetition/order;
- one factorial, `nPr`, `nCr` or multiplication/addition operation;
- no more than one simple constraint.

### Medium

- one meaningful restriction;
- two or three cases;
- leading-zero plus parity;
- repeated letters;
- simple together/apart;
- category selection with exact composition;
- direct circular table counting.

### Hard

- multiple interacting constraints;
- complement plus casework;
- gap method;
- circular restrictions;
- unlabeled grouping;
- nonempty distributions;
- dictionary rank;
- derangement;
- restricted paths;
- selection followed by restricted arrangement.

A large factorial alone does not make a question Hard.

---

## 15. Validation and Test Strategy

### 15.1 Static library audits

- all JSON files parse;
- QL IDs are unique and exactly cover their planned ranges;
- registry and language files have exact key parity;
- every CP receives its exact target count;
- every solve mode reaches its minimum representation;
- required placeholders equal rendered-template placeholders;
- no unregistered placeholders;
- no unresolved placeholders after generation;
- exact duplicate English templates = 0;
- near-clone families reviewed and bounded;
- word multiplicities and vowel/consonant metadata verified;
- all constraint-profile references exist;
- explanation IDs exist and match their solve modes.

### 15.2 Mathematical property tests

- factorial recurrence;
- `nPr = nCr × r!`;
- combination symmetry;
- Pascal identity for safe ranges;
- multinomial total consistency;
- circular count equals `n!/n`;
- block method equals brute-force count for small `n`;
- not-together complement equals brute-force count;
- gap-method counts equal enumeration;
- number-formation counts equal enumeration for small digit sets;
- repeated-letter counts equal unique-string enumeration for small words;
- category case sums equal subset enumeration;
- labeled/unlabeled grouping counts equal partition enumeration for small sizes;
- nonempty distribution equals surjection enumeration;
- derangement count equals permutation enumeration for small `n`;
- restricted path count equals dynamic-programming oracle.

### 15.3 Runtime sampling

For every QL:

- generate deterministic samples across Easy/Medium/Hard where eligible;
- answer is integer, non-negative and safe;
- correct option appears exactly once;
- all options are unique;
- no option is negative for count answers;
- stem is natural and unambiguous;
- order/repetition/circular/reflection semantics are explicit;
- explanation reaches the solver answer without arithmetic drift;
- traceability fields match the registry;
- same seed is deterministic;
- different seeds provide bounded parameter diversity.

### 15.4 Editorial audit

Reject:

- classroom wrappers repeated at scale;
- shallow noun swaps;
- missing statement of whether repetition is allowed;
- ambiguous committee roles;
- unclear circular equivalence;
- words whose repeated-letter counts are wrong;
- case explanations that skip or overlap cases;
- stems that rely on unstated assumptions;
- artificial contexts where a direct mathematical question would be more natural.

---

## 16. Multilingual Strategy

Implementation is English-first.

### Stage A

- English runtime complete and reviewed.
- Hindi/Punjabi structural companion files may exist only for key parity checks.
- Non-English product exposure remains off.

### Stage B

- localize by solve-mode family, not by machine-translating 720 templates blindly;
- retain Latin mathematical notation where standard;
- preserve exact placeholder sets;
- localize context nouns and grammar together;
- use Punjabi names/contexts naturally, without forcing every question into Punjab-specific wording;
- audit mathematical operators, units, digit references and circular-direction terms.

A language is not publication-ready until its stems, explanations, placeholders and runtime sampling all pass.

---

## 17. Generation-Engine Integration

Integration occurs only after a package passes its internal runtime proof.

Required changes:

- add package ID to `QuantV4PackageId`;
- import package pipeline and CP type;
- register package label, topic, subtopic and active CP IDs;
- keep supported languages English-only until localization freeze;
- verify admin Question Studio discovery;
- verify direct package request, CP request and random package sampling;
- avoid editing shared routing concurrently from multiple chapter branches.

Suggested labels:

- `PNC-001`: `Counting Foundations, Permutations & Combinations`
- `PNC-002`: `Restricted Arrangements & Advanced Selection`

---

## 18. Phased Implementation Plan

### Phase 0 — Design freeze

- commit this document;
- create implementation branch from the design commit;
- add PNC-001 package planning documents.

### Phase 1 — PNC-001 CP-001 runtime proof

Implement the complete CP-001 target (`PNC-QL-001`–`048`), not a five-question toy scaffold.

Required files:

- Phase A markdown documents;
- task registry entries for QL 001–048;
- English question library;
- English explanation families;
- curated variable and constraint profiles;
- foundation types, exact math, generator, solver, reasoning graph, renderer, validator and pipeline;
- CP-001 tests and content audit.

Do not wire the generation engine in this checkpoint.

### Phase 2 — PNC-001 CP-002

Add QL 049–102, permutation math/property tests, positional assignment families and distractors.

### Phase 3 — PNC-001 CP-003

Add QL 103–156, combination applications and geometric-selection validators.

### Phase 4 — PNC-001 CP-004

Add QL 157–234 with dedicated digit/code enumerator oracles and explicit leading-zero semantics.

### Phase 5 — PNC-001 CP-005

Add QL 235–300 and curated word profiles. Dictionary-rank families remain low-weight until manual review.

### Phase 6 — PNC-001 CP-006

Add QL 301–360, role assignments and mixed select/arrange bridge logic.

### Phase 7 — PNC-001 chapter audit and integration

- full duplicate, placeholder, render, option, oracle and runtime audit;
- generation-engine registration;
- English freeze record;
- no public HI/PA exposure.

### Phase 8 — PNC-002 CP-by-CP implementation

Implement CP-007 through CP-012 in separate checkpoints, consuming the frozen PNC shared counting authority.

### Phase 9 — Family audit

- cross-package solve-mode ownership;
- no duplicated QL shell families;
- no duplicated math implementations;
- PNC-001/PNC-002 routing and sampling;
- final English family freeze;
- multilingual work tracked separately.

---

## 19. Branch and Parallel-Work Safety

Recommended branches:

```text
feat/pnc-family-end-to-end-design
feat/pnc-001-cp001-runtime-proof
feat/pnc-001-cp002
...
feat/pnc-002-cp007
```

Rules:

- PNC work stays inside `PermutationAndCombination/` until a package is integration-ready;
- shared `generation-engine.ts` edits happen in one controlled integration checkpoint;
- Mensuration and Average branches must not be used as the PNC base;
- each checkpoint records its base commit and final commit;
- package branches merge into a stable PNC feature base before any merge to `New-main`;
- never merge incomplete QL ranges that leave registry/language parity broken.

---

## 20. Freeze Criteria

A package is freeze-ready only when:

- planned English QL count is exact;
- every CP and solve mode meets coverage targets;
- JSON parse errors = 0;
- exact duplicate templates = 0;
- unresolved placeholders = 0;
- missing required placeholders = 0;
- unregistered placeholders = 0;
- solver/property/oracle tests pass;
- every sampled answer is an exact safe integer;
- correct option appears exactly once;
- generic distractor fallback usage is below the documented ceiling;
- explanation evidence and final answer agree;
- generation-engine smoke passes after integration;
- editorial review finds no critical ambiguity;
- Hindi/Punjabi are either genuinely localized and audited or explicitly marked structural/non-product.

---

## 21. Immediate Next Checkpoint

Proceed with:

```text
PNC-001 → PNC-CP-001
Fundamental Counting Principle & Case Partition
PNC-QL-001 through PNC-QL-048
```

The first runtime proof must establish:

- exact counting utilities;
- task-registry and placeholder contracts;
- evidence-driven explanation rendering;
- semantic distractors;
- brute-force/property verification for small cases;
- deterministic seed behavior;
- chapter-local tests without shared generation-engine edits.

This checkpoint becomes the architectural foundation for the remaining eleven CPs.