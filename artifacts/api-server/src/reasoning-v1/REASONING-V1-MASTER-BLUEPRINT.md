# ExamTree Reasoning V1 — Master Blueprint

Status: authoritative product-level blueprint.

This document restores and formalizes the original Reasoning architecture agreed before implementation began. It defines the product taxonomy, implementation families, chapter boundaries, shared engines, renderer strategy, multilingual policy, rollout order, and the relationship between student-facing chapters and internal runtimes.

It sits above `REASONING-V1-ARCHITECTURE.md`:

- this file defines **what Reasoning V1 contains and how the subject is partitioned**;
- `REASONING-V1-ARCHITECTURE.md` defines **how each chapter and checkpoint must be implemented, validated, localized, reviewed, and frozen**.

Both documents are authoritative. Where they appear to overlap, this master blueprint governs product taxonomy and chapter boundaries, while the implementation architecture governs runtime contracts.

---

## 1. Product intent

ExamTree is a question-first mock-test platform for:

- SSC examinations;
- Banking examinations;
- Punjab state examinations.

Reasoning must not be implemented as one uniform generator. The subject contains distinct cognitive and technical families: symbolic transformation, relational graphs, formal logic, constraint satisfaction, and geometry-based non-verbal reasoning.

A chapter should feel like a real competitive-exam chapter, but internally it may be composed of several separate runtimes.

Primary runtime languages:

- English (`en-IN`);
- Hindi (`hi-IN`);
- Punjabi (`pa-IN`).

---

## 2. Governing design decisions

1. Reasoning is divided into five implementation families.
2. Student-facing chapters and internal runtimes are not always one-to-one.
3. Figure-based reasoning remains separate from text and symbol reasoning.
4. Constraint-heavy puzzles are delayed until simpler engines are stable.
5. Every generated question has an explicit rule and an independent solver.
6. Semantic datasets are curated; random runtime word generation is not trusted.
7. Visual questions are generated from reusable SVG primitives and transformations.
8. Multilingual behavior is classified as `TRANSLATABLE`, `LANGUAGE_ADAPTED`, or `LANGUAGE_SPECIFIC`.
9. Difficulty is computed from generated instance properties, not only from the QL identity.
10. Question Studio must receive structured runtime metadata, not merely rendered text.

---

# 3. Product-level organization

## Family A — Symbolic and sequence reasoning

These chapters mainly use letters, numbers, symbols, and deterministic transformations.

| Code | Chapter |
|---|---|
| `REAS-ANA` | Analogy |
| `REAS-CLS` | Classification / Odd One Out |
| `REAS-SER` | Series |
| `REAS-COD` | Coding-Decoding |
| `REAS-ALP` | Alphabet Test |
| `REAS-MIS` | Missing Number |
| `REAS-OPS` | Mathematical Operations and Symbol Substitution |
| `REAS-MAT` | Number and Figure Matrix |

These chapters can share a broad symbolic-rule foundation, but each chapter still owns its own QL registry, generators, solvers, ambiguity checks, distractors, explanations, and tests.

### Shared Family A capabilities

- alphabet positions and reverse positions;
- cyclic shifts;
- letter-cluster transforms;
- number-pair and number-triple transforms;
- finite sequence grammars;
- operator substitution;
- symbolic matrix evaluation;
- rule transfer from source to target;
- whole-number-only metadata;
- deterministic option construction.

---

## Family B — Relational and positional reasoning

These chapters require entities, relationships, positions, paths, or ordering.

| Code | Chapter |
|---|---|
| `REAS-BLR` | Blood Relations |
| `REAS-DIR` | Direction and Distance |
| `REAS-RNK` | Ranking and Order |
| `REAS-WOR` | Word and Dictionary Order |
| `REAS-INE` | Inequality |
| `REAS-DSF` | Data Sufficiency |

These should not be forced into arithmetic template systems.

### Required engines

- relation graph engine;
- coordinate and direction engine;
- total and partial order engine;
- lexical sorting engine;
- inequality graph engine;
- information-sufficiency evaluator.

### Examples

- Blood Relations: build a valid family graph first, then derive the asked relationship.
- Direction Sense: build a path in coordinates, then compute final direction and displacement.
- Ranking: construct a consistent order, then derive rank-based queries.
- Inequality: construct a directed comparison graph and test conclusions.
- Data Sufficiency: solve each statement independently and in combination.

---

## Family C — Logic and deduction

These chapters operate on propositions, set relations, assumptions, arguments, and conclusions.

| Code | Chapter |
|---|---|
| `REAS-SYL` | Syllogism |
| `REAS-VEN` | Logical Venn Diagrams |
| `REAS-STC` | Statement and Conclusion |
| `REAS-STA` | Statement and Assumption |
| `REAS-ARG` | Statement and Argument |
| `REAS-COA` | Course of Action |
| `REAS-CAE` | Cause and Effect |
| `REAS-ASM` | Assertion and Reason |
| `REAS-DCS` | Decision Making / Eligibility |

This family needs truth validation and semantic-content governance. It cannot rely only on variable substitution.

### Required engines

- formal set-relation solver;
- proposition normalizer;
- conclusion validator;
- assumption plausibility framework;
- argument-strength rubric;
- cause-effect direction validator;
- eligibility rule evaluator;
- controlled natural-language dataset architecture.

### Governance requirement

For natural-language logic, generation must be based on curated scenario structures and reviewed content libraries. Free-form runtime generation is not acceptable for production.

---

## Family D — Arrangement and puzzle reasoning

| Code | Chapter |
|---|---|
| `REAS-LAR` | Linear Seating Arrangement |
| `REAS-CAR` | Circular Seating Arrangement |
| `REAS-SQR` | Square / Rectangular Arrangement |
| `REAS-FLR` | Floor and Flat Arrangement |
| `REAS-PUZ` | Logic Puzzles |
| `REAS-INP` | Input-Output |
| `REAS-GAM` | Games and Tournament |

This family requires a constraint solver that constructs a valid hidden state first and derives clues from it.

### Mandatory construction model

```text
construct valid hidden arrangement
  -> derive clue set
  -> remove redundant clues
  -> verify uniqueness
  -> generate questions from the solved state
  -> independently re-solve from clues
  -> reject if multiple solutions remain
```

This family should not be implemented until the simpler symbolic, relational, and formal-logic foundations are stable.

### Chapter separation

Seating arrangements remain separate from general puzzles:

- linear and circular arrangements have stable formal models;
- general puzzles may combine days, professions, cities, colours, floors, boxes, schedules, and multiple attributes;
- floor/flat arrangements require special vertical and horizontal constraints;
- input-output needs a sequence-of-states transformation engine;
- games/tournament questions need graph and scoring logic.

---

## Family E — Spatial and non-verbal reasoning

| Code | Chapter |
|---|---|
| `REAS-FAN` | Figure Analogy |
| `REAS-FCL` | Figure Classification |
| `REAS-FSR` | Figure Series |
| `REAS-FMX` | Figure Matrix |
| `REAS-MIR` | Mirror and Water Images |
| `REAS-PFC` | Paper Folding and Cutting |
| `REAS-EMB` | Embedded Figures |
| `REAS-FCT` | Figure Counting |
| `REAS-FCP` | Figure Completion |
| `REAS-FFM` | Figure Formation |
| `REAS-DOT` | Dot Situation |
| `REAS-CUB` | Cubes and Dice |

This family requires SVG-based rendering and geometry-aware answer generation.

Non-verbal reasoning is a first-class architecture family, not an optional extension.

### Required engines

- reusable SVG primitive library;
- geometric transformation engine;
- rotation and reflection engine;
- shape-composition engine;
- grid and matrix renderer;
- line-intersection and figure-counting validator;
- cube and dice orientation engine;
- paper-fold simulation;
- embedded-shape matcher.

---

# 4. Chapters that remain separate

## 4.1 Student-facing Analogy with multiple internal runtimes

The student sees one Analogy chapter, but implementation is divided internally into:

- word analogy;
- number analogy;
- letter analogy;
- letter-cluster analogy;
- mixed and advanced analogy;
- figure analogy.

Word, numeric, alphabetic, and figure analogy share the concept of rule transfer but require different data, solvers, ambiguity checks, renderers, and localization behavior.

## 4.2 Verbal and figure-based forms remain separate

Examples:

- Analogy and Figure Analogy;
- Classification and Figure Classification;
- Series and Figure Series;
- Matrix and Figure Matrix.

They test related student skills, but their runtime and validation systems are fundamentally different.

## 4.3 Mathematical Operations remains separate from Coding-Decoding

Operator interchange, sign substitution, and equation balancing use explicit mathematical evaluation. Coding-Decoding uses symbol, letter, word, position, substitution, or mapping systems. They should share selected symbolic utilities but remain separate chapters.

## 4.4 Seating remains separate from general puzzles

Linear, circular, square, and floor arrangements have reusable formal constraint models. General puzzles may combine multiple dimensions and need a more flexible schema.

## 4.5 Cubes and Dice stay together initially

They share:

- face adjacency;
- opposite faces;
- cube nets;
- rotations;
- orientation equivalence;
- visible-face constraints.

They may later be split in the product UI if content volume justifies it.

---

# 5. Shared Reasoning runtime architecture

Reasoning uses a layered architecture.

## Layer 1 — Question Language

Each QL defines:

- stem structure;
- displayed objects;
- requested inference;
- answer format;
- distractor intent;
- explanation strategy;
- supported languages;
- renderer type;
- difficulty behavior;
- rule and solver bindings.

A QL describes an exam pattern, not merely one sentence template.

## Layer 2 — Rule Registry

Every generated question points to an explicit reasoning rule.

Examples:

```text
ALPHA_SHIFT_UNIFORM
ALPHA_SHIFT_ALTERNATING
WORD_RELATION_TOOL_PURPOSE
NUMBER_PAIR_ADD_CONSTANT
NUMBER_PAIR_LINEAR_TRANSFORM
SERIES_SECOND_DIFFERENCE
BLOOD_GRAPH_RELATION
DIRECTION_COORDINATE_PATH
SYLLOGISM_SET_INCLUSION
DICE_FACE_OPPOSITION
```

The rule registry is the authoritative logic layer.

## Layer 3 — Instance Generator

The generator:

1. selects the QL and rule;
2. chooses or constructs a valid underlying instance;
3. calculates the intended answer;
4. generates plausible wrong answers;
5. verifies option uniqueness;
6. renders the stem;
7. creates a question-specific explanation;
8. emits structured metadata.

The answer is never inferred from a loosely written template after generation.

## Layer 4 — Independent Solver and Validator

Every generated question has an independent solver.

Examples:

- series solver;
- alphabet transformation solver;
- relation-graph solver;
- coordinate solver;
- inequality solver;
- syllogism set solver;
- arrangement constraint solver;
- dice rotation solver;
- SVG geometry validator.

The generator proposes the question; the solver confirms it.

## Layer 5 — Renderer

Required renderer classes:

```text
TEXT
STRUCTURED_TEXT
TABLE_OR_GRID
SVG_FIGURE
```

Future renderers may include:

```text
MULTI_PANEL_SVG
INTERACTIVE_ARRANGEMENT
```

Question logic and visual presentation remain separate.

---

# 6. Required shared libraries

## 6.1 Alphabet library

Must support:

- A–Z positions;
- reverse positions;
- opposite letters;
- cyclic shifts;
- vowel and consonant filters;
- alternating positions;
- sorting;
- repeated-letter handling;
- cluster transformations;
- forward and reverse traversal;
- position arithmetic;
- wraparound validation.

## 6.2 Number-relation library

Must support rule trees rather than unrestricted arbitrary equations:

- addition and subtraction;
- multiplication and division;
- powers and roots;
- consecutive numbers;
- difference sequences;
- pair and triple relationships;
- composite transforms;
- digit operations only where explicitly allowed;
- whole-number-only operations where exam instructions prohibit digit splitting;
- safe integer and bounded-output validation.

Whole-number restrictions must be machine-readable metadata, not merely prose.

## 6.3 Semantic relationship library

Required for word analogy and classification.

Curated tagged relationships include:

```text
object -> function
worker -> workplace
instrument -> measurement
animal -> young one
country -> capital
part -> whole
product -> raw material
disease -> affected organ
author -> work
sport -> equipment
institution -> collection
shape -> number of sides
```

The semantic dataset must be curated, versioned, reviewed, and independently auditable.

## 6.4 Entity and relationship library

Required for:

- blood relations;
- seating;
- ranking;
- puzzles;
- scheduling;
- professions;
- cities;
- colours;
- days and months.

It must control:

- gender;
- uniqueness;
- linguistic clarity;
- culturally natural names;
- role compatibility;
- locale adaptation;
- accidental duplicate entities.

## 6.5 Visual primitive library

Reusable SVG components:

- lines;
- arrows;
- polygons;
- circles;
- dots;
- shaded regions;
- rotations;
- reflections;
- grids;
- cubes;
- dice faces;
- fold lines;
- cut marks;
- panels;
- labels and anchors.

Visual questions should be built from primitives and transformations rather than stored as thousands of manual images.

---

# 7. Distractor architecture by family

Distractors must represent likely mistakes and carry machine-readable error labels.

## Alphabet questions

- wrong shift direction;
- off-by-one shift;
- apply only part of the rule;
- ignore cyclic wrapping;
- use ordinary position instead of reverse position;
- transform the wrong letter position.

## Number analogy

- correct operation with wrong constant;
- omit final addition or subtraction;
- reverse operation order;
- use the wrong operand;
- use digit-wise reasoning when whole-number reasoning is required;
- apply a nearby competing rule.

## Blood relations

- maternal/paternal confusion;
- reverse the asked relationship;
- sibling/cousin confusion;
- ignore gender;
- stop one generation too early;
- treat spouse relation as blood relation.

## Direction sense

- total distance instead of displacement;
- reverse left and right;
- opposite direction;
- omit final movement;
- confuse northeast with northwest;
- report coordinate sign incorrectly.

## Syllogism

- converse error;
- illicit existential assumption;
- treat `some` as `all`;
- infer overlap without evidence;
- deny a valid possibility;
- accept a conclusion contradicted by exclusion.

## Arrangement and puzzles

- answer from a near-valid alternative arrangement;
- swap adjacent entities;
- reverse clockwise and anticlockwise;
- confuse immediate and non-immediate neighbours;
- satisfy all but one clue;
- use a solution from an underconstrained clue subset.

## Non-verbal reasoning

- wrong rotation angle;
- reflection instead of rotation;
- preserve a feature that should change;
- change a feature that should remain invariant;
- choose a near-embedded but non-identical figure;
- count overlapping shapes incorrectly.

---

# 8. Difficulty model

ExamTree uses generated-instance difficulty, not only QL-level difficulty.

Five primary factors:

```text
rule complexity
number of transformations
information density
distractor proximity
required inference depth
```

Suggested public levels:

| Internal score | Student level |
|---|---|
| 1–2 | Easy |
| 3 | Moderate |
| 4–5 | Difficult |

The current broader implementation target may still use chapter-level percentages such as approximately 35% easy, 45% medium, and 20% hard. The five-factor score provides the underlying basis.

Difficulty levers include:

- number of reasoning steps;
- obscurity of semantic relation;
- number of clues;
- distractor closeness;
- direction reversal;
- missing position;
- operation composition;
- vocabulary complexity;
- renderer complexity;
- symmetry or near-symmetry;
- whether more than one example is needed to establish the rule.

Larger numbers alone do not define higher difficulty.

---

# 9. Multilingual strategy

## 9.1 Language-neutral logic

Suitable for:

- numbers;
- letters;
- symbols;
- figures;
- direction paths;
- dice;
- matrices.

Only instructions, labels, and explanations normally require translation.

## 9.2 Language-sensitive logic

Suitable for:

- word analogy;
- word classification;
- lexical series;
- statement-based reasoning;
- assumptions;
- arguments;
- courses of action;
- semantic coding.

These may require separate English, Hindi, and Punjabi datasets and sometimes separate QLs.

## 9.3 Locale classification

Every QL is classified as one of:

```text
TRANSLATABLE
LANGUAGE_ADAPTED
LANGUAGE_SPECIFIC
```

### `TRANSLATABLE`

The underlying logic and values remain identical. Only instructions and explanations change.

### `LANGUAGE_ADAPTED`

The QL pattern remains equivalent, but words, statements, or facts use separate locale datasets.

### `LANGUAGE_SPECIFIC`

The pattern depends on a language-specific feature and may not have a direct equivalent in every locale.

Localization must preserve answer parity, difficulty parity, and natural exam wording.

---

# 10. Recommended implementation order

## Phase 1 — Foundation chapters

1. Analogy
2. Classification
3. Alphabet Test
4. Series
5. Coding-Decoding
6. Mathematical Operations

Purpose: establish symbolic runtimes and obtain immediate SSC-relevant coverage.

## Phase 2 — Relational chapters

7. Direction and Distance
8. Blood Relations
9. Ranking and Order
10. Word / Dictionary Order
11. Inequality

Purpose: establish graphs, coordinates, ordering, and relation engines.

## Phase 3 — Formal logic

12. Syllogism
13. Logical Venn Diagram
14. Statement and Conclusion
15. Statement and Assumption
16. Statement and Argument
17. Course of Action

Purpose: establish formal truth validation and governed natural-language reasoning.

## Phase 4 — Non-verbal foundation

18. Figure Analogy
19. Figure Classification
20. Figure Series
21. Mirror and Water Images
22. Embedded Figures
23. Figure Counting
24. Cubes and Dice

Purpose: establish SVG, geometry, transformation, and spatial validation.

## Phase 5 — Constraint-based chapters

25. Linear Arrangement
26. Circular Arrangement
27. Floor Arrangement
28. General Puzzles
29. Input-Output
30. Games and Tournament

Purpose: establish hidden-state construction, clue derivation, uniqueness proof, and independent re-solving.

---

# 11. Analogy as the first implementation family

The original product decomposition was:

```text
ANA-001  Word Analogy
ANA-002  Number Analogy
ANA-003  Letter Analogy
ANA-004  Letter-Cluster Analogy
ANA-005  Mixed and Advanced Analogy
ANA-006  Figure Analogy
```

During implementation, ExamTree consolidated the non-figure analogy forms into one chapter package, `ANA-001`, with multiple checkpoints and one continuous QL sequence. This is an accepted implementation adjustment, provided the student-facing and architectural distinctions remain visible.

Figure Analogy remains separate from the first implementation package because it depends on SVG infrastructure.

## Current accepted ANA-001 checkpoint allocation

| Checkpoint | QL range | Count | Scope |
|---|---:|---:|---|
| `ANA-CP-001` | `ANA-QL-001`–`036` | 36 | semantic / direct word relationships |
| `ANA-CP-002` | `ANA-QL-037`–`060` | 24 | lexical and conceptual relationships |
| `ANA-CP-003` | `ANA-QL-061`–`108` | 48 | number analogy |
| `ANA-CP-004` | `ANA-QL-109`–`140` | 32 | number-set analogy |
| `ANA-CP-005` | `ANA-QL-141`–`160` | 20 | alphabet analogy |
| `ANA-CP-006` | `ANA-QL-161`–`200` | 40 | letter-cluster analogy |
| `ANA-CP-007` | `ANA-QL-201`–`220` | 20 | mixed-symbol analogy |
| `ANA-CP-008` | `ANA-QL-221`–`236` | 16 | advanced transfer and reverse analogy |
| `ANA-CP-009` | `ANA-QL-237`–`260` | 24 | mixed and exam-style synthesis |

Figure analogy is excluded from this 260-QL allocation and belongs to the non-verbal family.

## Important interpretation

The product concept remains:

```text
one student-facing Analogy family
  -> multiple internal runtimes
  -> figure analogy implemented separately
```

The current repository arrangement does not invalidate the original blueprint; it is a packaging refinement.

---

# 12. Question Studio implications

Question Studio must expose structured Reasoning metadata.

Required dimensions include:

- family;
- chapter;
- checkpoint;
- QL;
- rule;
- presentation mode;
- renderer;
- locale mode;
- difficulty;
- seed;
- answer type;
- error labels;
- ambiguity status;
- independent-solver status;
- dataset version;
- editorial status.

Question Studio should allow reviewers to:

- generate by QL and seed;
- regenerate deterministically;
- compare English, Hindi, and Punjabi;
- inspect the underlying rule and solver trace;
- inspect distractor error labels;
- view structured and rendered forms;
- reject a runtime instance;
- flag ambiguity;
- export review batches;
- track chapter freeze readiness.

Internal rule names may be visible to administrators but must never appear in the student-facing question.

---

# 13. Relationship to the implementation architecture

`REASONING-V1-ARCHITECTURE.md` remains the detailed implementation contract for:

- QL identity and permanence;
- deterministic seeded generation;
- independent solving;
- ambiguity rejection;
- option validation;
- explanation traces;
- localization parity;
- test coverage;
- review exports;
- freeze criteria;
- branch and checkpoint workflow.

This master blueprint adds the missing governing context:

- five implementation families;
- complete chapter taxonomy;
- chapter separation decisions;
- shared subject libraries;
- renderer strategy;
- phased implementation order;
- original multi-runtime Analogy model;
- product-level Question Studio requirements.

Future design work must consult both files before allocating new chapter IDs, QL ranges, or shared engines.

---

# 14. Controlled adjustments from the original blueprint

The following adjustments are accepted:

1. Non-figure Analogy runtimes may live under one chapter package with separate checkpoints and one continuous QL sequence.
2. Figure Analogy remains outside the first Analogy implementation.
3. Public difficulty may use Easy / Medium / Hard while retaining a five-factor internal score.
4. Shared libraries should be extracted only after at least two chapters demonstrate the same stable need; premature abstraction is discouraged.
5. Arrangement and puzzle chapters must include formal uniqueness proof before production.
6. Rule-collision audits are mandatory after the ANA-CP-004 collision exposed mathematically duplicate registered rules.
7. All displayed operands or entities should contribute to the intended rule unless irrelevant-information filtering is explicitly the tested skill.

---

# 15. Master blueprint definition of done

Reasoning V1 reaches architectural maturity when:

- the five implementation families exist as explicit repository and product concepts;
- all planned chapters have stable IDs and manifests;
- shared symbolic, relational, logical, constraint, and visual foundations are implemented;
- student-facing chapters can use multiple internal runtimes without leaking implementation complexity;
- figure-based chapters use deterministic SVG generation and geometry validation;
- multilingual policy is enforced per QL;
- every generated question has an independent solver;
- ambiguity and rule collisions are automatically audited;
- Question Studio exposes structured reasoning metadata and review workflows;
- chapter freeze decisions no longer depend on undocumented chat history.

---

## Canonical files

```text
artifacts/api-server/src/reasoning-v1/REASONING-V1-MASTER-BLUEPRINT.md
artifacts/api-server/src/reasoning-v1/REASONING-V1-ARCHITECTURE.md
```

The first governs product structure. The second governs implementation quality.