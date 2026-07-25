# ExamTree Reasoning V1 Architecture

Status: canonical architecture blueprint for implementation and review.

This document is the authoritative design reference for ExamTree Reasoning V1. It consolidates the reasoning-system blueprint agreed during design discussions, the architecture already implemented in ANA-001, and the corrective lessons learned while building ANA-CP-001 through ANA-CP-004.

The purpose is to ensure that future reasoning chapters are designed consistently, implemented independently, tested exhaustively, localized safely, and integrated into Question Studio without relying on chat history.

---

## 1. Product context

ExamTree is a question-first mock-test platform for:

- SSC examinations
- Banking examinations
- Punjab state examinations

The target product quality is comparable to Testbook, PracticeMock, Oliveboard and similar competitive-exam platforms, while retaining ExamTree's own deterministic question-generation and multilingual architecture.

Reasoning questions must feel like actual competitive-exam questions rather than classroom exercises or synthetic demonstrations.

Primary runtime languages:

- English (`en-IN`)
- Hindi (`hi-IN`)
- Punjabi (`pa-IN`)

---

## 2. Core design principles

### 2.1 Question Logic is the atomic content unit

A Question Logic, abbreviated as QL, is not one static question. It is a stable generation contract describing:

- the reasoning relationship or operation;
- the presentation mode;
- the generator and parameter domain;
- the answer type;
- distractor construction;
- the independent solver;
- ambiguity rules;
- explanation requirements;
- localization requirements;
- difficulty behavior.

A QL may generate many deterministic runtime instances through seeds.

QL IDs must be permanent once merged. Existing IDs must not be silently reassigned to unrelated content.

### 2.2 A checkpoint is an implementation and QA boundary

A checkpoint, abbreviated as CP, groups closely related QLs that share one runtime architecture.

Each checkpoint should be independently:

- discoverable;
- generatable;
- testable;
- reviewable;
- localizable;
- mergeable;
- freezeable.

Checkpoint boundaries should reflect meaningful differences in solving strategy or data architecture, not arbitrary file size.

### 2.3 Every generated question must be solved independently

The generator must not be treated as proof of correctness.

A separate solver or validator must recompute the answer from the generated data. The final question is accepted only when the independent solver agrees.

For factual analogies, the authoritative fact registry acts as the independent truth source. For numeric and symbolic questions, an explicit solver must recompute the operation.

### 2.4 Ambiguity rejection is mandatory

A generated question is invalid when an equal-or-simpler alternative rule also explains the displayed evidence.

The ambiguity checker must compare the intended rule against the complete eligible rule pool for that checkpoint or reasoning family.

A question may be accepted only when:

- the intended rule explains all displayed examples;
- no simpler competing rule explains all displayed examples;
- no equal-priority competing rule creates a second reasonable answer;
- exactly one option satisfies the intended relationship.

### 2.5 All displayed elements should have a reasoning role

Dummy numbers, unused words, irrelevant symbols and decorative operands should not be introduced unless the examination format explicitly tests irrelevant-information filtering.

For standard analogy and number-set questions, every displayed member should contribute to the intended relationship.

This rule was reinforced after the ANA-CP-004 review identified numeric rules that ignored one member.

### 2.6 Localization is language adaptation, not word replacement

Hindi and Punjabi content must preserve:

- mathematical equivalence;
- answer parity;
- difficulty parity;
- natural examination wording;
- locale-appropriate vocabulary;
- script integrity.

Translations must not expose internal rule identifiers or produce literal, unnatural phrasing.

---

## 3. Repository structure

The canonical Reasoning V1 root is:

```text
artifacts/api-server/src/reasoning-v1/
```

Recommended hierarchy:

```text
reasoning-v1/
  REASONING-V1-ARCHITECTURE.md
  generation-engine.ts
  foundation/
  localization/
  topics/
    Analogy/
      ANA-001/
        foundation/
        localization/
        ANA-CP-001/
        ANA-CP-002/
        ...
    Classification/
    Series/
    Coding-Decoding/
    Blood-Relations/
    Direction-Sense/
    Ranking-Order/
    Syllogism/
    Inequality/
    Statement-Based-Reasoning/
    Puzzle-Seating/
    Non-Verbal-Reasoning/
```

The exact topic list may evolve, but the architecture and contracts in this document remain applicable.

---

## 4. Naming and identity contracts

### 4.1 Topic and chapter IDs

Use stable uppercase IDs:

```text
ANA-001
SER-001
COD-001
```

### 4.2 Checkpoint IDs

```text
ANA-CP-001
ANA-CP-002
```

### 4.3 Question Logic IDs

```text
ANA-QL-001
ANA-QL-002
```

QL IDs must form one continuous, chapter-wide sequence unless the chapter manifest explicitly reserves gaps.

Before adding new QLs, verify the reserved range in the chapter manifest. Never extend a checkpoint into the next checkpoint's range merely because more rule families are desirable.

### 4.4 Dataset and fact IDs

Use stable IDs for authoritative curated facts:

```text
ANA-SF-001
ANA-LF-001
```

Dataset entries should include versioning and editorial metadata where factual correctness can change over time.

---

## 5. Chapter manifest

Every reasoning chapter must have one audited manifest before large-scale implementation.

The manifest should define:

- chapter purpose;
- examinations in scope;
- included and excluded formats;
- total QL count;
- exact CP boundaries;
- exact QL ranges;
- rule-family inventory;
- presentation modes;
- renderer requirements;
- answer types;
- localization mode;
- difficulty targets;
- known ambiguity risks;
- implementation order;
- freeze criteria.

The manifest is the source of truth for QL allocation. Implementation reports do not replace it.

---

## 6. Standard Question Logic contract

A reasoning QL should expose, directly or through its registry, the following conceptual fields:

```ts
interface ReasoningQuestionLogic {
  qlId: string;
  checkpointId: string;
  ruleId: string;
  taskKind: string;
  solveMode: string;
  presentationMode: string;
  answerType: string;
  renderer: string;
  localeMode: string;
  difficultyProfile: string;
  status: "DRAFT" | "IMPLEMENTED" | "REVIEWED" | "FROZEN";
}
```

Additional rule-specific metadata may be added, but these concepts must remain visible.

---

## 7. Runtime output contract

A generated reasoning question should provide enough structured information for Question Studio, mock-test delivery, review exports and analytics.

Recommended conceptual shape:

```ts
interface GeneratedReasoningQuestion {
  qlId: string;
  checkpointId: string;
  ruleId: string;
  seed: number;
  locale: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: string;
  stem: string;
  structuredPrompt?: unknown;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: GenerationMetadata;
}
```

Every generated question must have:

- exactly four options unless a chapter manifest explicitly approves another format;
- four unique rendered option values;
- exactly one correct answer;
- deterministic output for the same QL, locale and seed;
- no unresolved placeholders;
- no internal rule ID visible to students;
- an explanation trace grounded in the generated values.

---

## 8. Generation pipeline

The standard pipeline is:

```text
QL lookup
  -> deterministic seed initialization
  -> parameter / fact selection
  -> candidate instance construction
  -> independent solve
  -> ambiguity audit
  -> distractor construction
  -> independent option validation
  -> answer shuffle
  -> renderer selection
  -> explanation construction
  -> localization
  -> final contract validation
```

No stage should rely on the correctness of a previous stage without verification.

### 8.1 Determinism

Identical inputs must produce identical outputs:

```text
QL + locale + seed + runtime version = same question
```

A seeded PRNG must be used consistently. Non-deterministic APIs such as `Math.random()` must not appear in production generation paths.

### 8.2 Safe generation domains

Each rule must define bounded input domains that prevent:

- negative answers where not intended;
- fractions where the task expects integers;
- division by zero;
- excessive values unsuitable for timed exams;
- overflow or unsafe integers;
- trivial or degenerate examples;
- repeated members that collapse the intended rule.

### 8.3 Retry and rejection

Generators may reject candidate instances, but rejection must be deterministic and bounded.

A generator must not enter an unbounded retry loop. If no safe instance is available within the designed search space, it should fail clearly and the test suite should expose the faulty rule.

---

## 9. Independent solver architecture

Each operational checkpoint must include an independent solver module.

Examples:

- numeric analogy: recompute the numeric transform;
- alphabet analogy: recompute character positions and shifts;
- coding-decoding: independently encode or decode;
- direction sense: recompute coordinates and orientation;
- blood relations: solve the relationship graph;
- syllogism: evaluate conclusions from formal set relations;
- seating arrangement: solve constraints independently;
- semantic analogy: validate against an authoritative curated fact registry.

The solver should not call the generator's answer-producing helper when that would make validation circular.

---

## 10. Ambiguity architecture

### 10.1 Rule matching

For checkpoints with multiple formal rules, expose a function equivalent to:

```ts
matchingRules(evidence): Match[]
```

It should return every eligible rule and context that explains the evidence.

### 10.2 Priority model

Rules may carry an editorial priority representing conceptual simplicity.

A generated instance is rejected if a competing rule with equal or lower priority also fits.

Priority should reflect likely student interpretation, not implementation complexity.

### 10.3 Rule collision testing

The test suite must explicitly detect complete rule collisions.

A collision occurs when two registered rules are mathematically or logically equivalent over all eligible contexts.

The ANA-CP-004 failure demonstrated why this is necessary: a fixed `2 × (a + b)` rule duplicated the general sum-multiplier rule with `k = 2` and therefore could never pass ambiguity validation.

Future checkpoints should include a registry-level collision audit before runtime sampling.

---

## 11. Distractor architecture

Distractors must be plausible, independently wrong, and matched to the task.

### 11.1 General requirements

Every distractor must:

- have the correct type and display format;
- be unique;
- be plausible for the exam level;
- fail the intended rule when independently checked;
- avoid accidentally becoming correct under a simpler competing rule;
- avoid obvious formatting clues.

### 11.2 Preferred distractor sources

Use, in order of preference:

1. common operation mistakes;
2. nearby valid rules from the same family;
3. sign, direction or position errors;
4. one-step arithmetic mistakes;
5. category-valid but factually false alternatives;
6. carefully bounded near-answer values.

### 11.3 Factual analogy distractors

For semantic and lexical analogies:

- missing-term options should belong to the expected answer category;
- pair-selection distractors should preserve source and answer categories;
- distractor pairs must not exist in the authoritative fact registry;
- do not use the target source word itself as a shortcut distractor;
- do not rely on mechanically reversed pairs unless reversal is a genuine misconception.

### 11.4 Numeric distractors

For numeric questions, distractors should arise from tempting alternate operations such as:

- sum instead of product;
- difference instead of sum;
- omission of a constant;
- using the wrong operand;
- applying the correct rule in the wrong order;
- off-by-one arithmetic mistakes.

Random nearby numbers should be a fallback, not the default strategy.

---

## 12. Explanation architecture

Every question must include a student-facing explanation trace.

Recommended shape:

```ts
interface ExplanationTrace {
  ruleStatement: string;
  sourceDemonstration: string | readonly ExplanationStep[];
  targetApplication: string | readonly ExplanationStep[];
  conclusion: string;
  closestTrapRejection?: string;
}
```

The explanation must:

- state the relationship naturally;
- show the source example using actual values;
- apply the same rule to the target;
- identify the final answer;
- explain the closest trap when useful;
- avoid internal enum names such as `SET_SUM_MULTIPLIER` or `SEM_COUNTRY_CAPITAL`.

Dynamic parameters must be stated explicitly. If a question uses a constant, ratio, shift or interval, the chosen value must appear in the explanation.

---

## 13. Difficulty model

Chapter-level target distribution:

- Easy: approximately 35%
- Medium: approximately 45%
- Hard: approximately 20%

This is a target, not a rigid per-QL requirement.

Difficulty must derive from reasoning burden, not merely larger numbers.

Useful difficulty levers include:

- number of reasoning steps;
- obscurity of factual relation;
- closeness of distractors;
- number of displayed examples;
- reversed direction;
- missing position;
- operation composition;
- larger but still exam-appropriate values;
- less familiar vocabulary;
- renderer complexity.

Each QL should be capable of producing more than one difficulty level where mathematically and editorially appropriate.

---

## 14. Presentation and renderer architecture

Reasoning V1 should separate logical structure from visual presentation.

Approved renderer families may include:

- inline analogy;
- pair selection;
- table;
- grid;
- boxed sets;
- sequence row;
- matrix;
- relation graph;
- family tree;
- direction diagram;
- seating diagram;
- Venn representation;
- statement-conclusion layout;
- image or figure renderer for non-verbal reasoning.

The renderer must not alter the underlying answer logic.

Presentation variety should be deterministic and audited. A large number of seeds is not meaningful variety when every stem has the same visible structure.

For eligible checkpoints, vary:

- layout;
- missing position;
- source/target ordering;
- direct-completion versus pair-selection mode;
- number of examples;
- label style;
- option display style.

---

## 15. Localization architecture

### 15.1 Locale separation

Keep logical data and numeric operations language-neutral where possible.

Localize:

- instructions;
- relation statements;
- vocabulary datasets;
- explanations;
- renderer labels;
- punctuation and grammatical agreement.

### 15.2 Locale parity

For a fixed QL and seed, all locales should preserve:

- rule;
- correct answer;
- correct option index where practical;
- difficulty;
- layout;
- missing position;
- numeric values;
- ambiguity status.

Lexical and semantic datasets may require locale-specific facts rather than literal translation. In such cases parity means equivalent reasoning difficulty and relation type, not identical words.

### 15.3 Punjabi terminology

Use natural Punjabi examination vocabulary consistently. Avoid previously rejected terminology such as `ਪਦ` where `ਸ਼ਬਦ` is the intended word in the relevant context.

### 15.4 Script audits

Localized tests should verify:

- expected Unicode script presence;
- absence of unresolved English instruction fragments except approved mathematical notation;
- absence of banned or deprecated terminology;
- answer parity;
- layout and difficulty coverage.

---

## 16. Dataset architecture

### 16.1 Modular datasets

Large semantic and lexical libraries must be split by relationship family rather than stored as one unreviewable file.

Example:

```text
datasets/
  country-capital.en.ts
  worker-tool.en.ts
  synonym.en.ts
  antonym.en.ts
  index.ts
```

### 16.2 Fact metadata

Curated facts should support:

- stable ID;
- relation ID;
- source and target categories;
- locale;
- difficulty;
- exam suitability;
- version;
- status;
- verification date;
- source type;
- factual-risk level;
- editorial notes.

### 16.3 Factual freshness

Time-sensitive facts such as capitals, currencies, office holders and administrative arrangements require a verification policy.

Stable linguistic and scientific relationships may have lower update risk but still require editorial review.

---

## 17. Standard checkpoint file layout

A formal runtime checkpoint should generally contain:

```text
ANA-CP-XXX/
  question-language.en.ts
  rule-definitions.ts
  task-registry.ts
  generator.ts
  independent-solver.ts
  ambiguity-checker.ts
  option-validator.ts
  localized-runtime.ts
  ana-cp-xxx.test.ts
  ana-cp-xxx-localized.test.ts
  export-review.ts
  export-localized-review.ts
  ana-cp-xxx-implementation-plan.md
  ana-cp-xxx-implementation-report.md
  datasets/
  locales/
```

Not every checkpoint requires every file, but equivalent responsibilities must exist.

---

## 18. Testing architecture

### 18.1 Registry tests

Assert:

- exact QL count;
- exact continuous QL range;
- unique QL IDs;
- exact rule count;
- unique rule IDs;
- no missing registry entries;
- no unintended rule collision.

### 18.2 Runtime sampling

Generate enough seeds per QL to expose boundary and balance failures.

Typical initial target:

- 50 to 100 seeds per English QL;
- 20 to 50 seeds per localized QL;
- more for highly parameterized or constraint-heavy generators.

### 18.3 Required runtime assertions

Tests should verify:

- determinism;
- four unique options;
- exactly one correct answer;
- independent-solver agreement;
- ambiguity acceptance;
- safe numeric or symbolic bounds;
- valid renderer data;
- explanation completeness;
- answer-position balance;
- difficulty coverage;
- layout coverage;
- missing-position coverage where applicable;
- minimum visible stem diversity;
- no unresolved placeholders;
- no internal IDs in student-facing text.

### 18.4 Answer-position balance

Answer distribution must be audited over the whole checkpoint.

A practical initial threshold is a maximum-to-minimum ratio below approximately `1.35`, with stricter thresholds preferred for larger samples.

### 18.5 Test execution honesty

Implementation reports must distinguish:

- tests written;
- tests executed locally;
- CI checks executed;
- editorial review completed.

Never describe unexecuted tests as passing.

---

## 19. Review-export architecture

Every checkpoint should provide exact runtime review exports.

A review export should display:

- QL ID;
- rule family;
- seed or sample number;
- difficulty;
- layout;
- full stem;
- all options;
- correct answer marker;
- rule statement;
- source demonstration;
- target application;
- conclusion;
- trap rejection.

Review exports are generated artifacts and should normally not be committed unless there is a specific editorial reason. Export scripts and review-resolution documents should be committed.

English must be reviewed before localization is considered frozen.

---

## 20. Question Studio integration

Reasoning checkpoints must be discoverable by Question Studio through stable registries.

Question Studio should be able to:

- list chapter, checkpoint and QL metadata;
- select locale;
- select or sample difficulty;
- enter a seed;
- preview deterministic questions;
- inspect structured renderer data;
- inspect answer and explanation;
- export review batches;
- run checkpoint audits;
- identify frozen versus draft QLs.

The generation engine should not hard-code checkpoint-specific logic outside the checkpoint registry unless a shared foundation module is genuinely reusable.

---

## 21. Implementation workflow

The standard workflow for each chapter is:

### Stage 1: research and decomposition

- inspect books, previous papers and reliable references;
- identify real exam formats;
- separate distinct solve modes;
- identify ambiguity and localization risks.

### Stage 2: audited manifest

- freeze chapter scope;
- assign CPs;
- assign exact QL ranges;
- define difficulty and renderer targets;
- document exclusions.

### Stage 3: checkpoint design

- define rule registry;
- define safe domains;
- define presentation modes;
- define solver and ambiguity strategy;
- define distractor families;
- define localization approach;
- define tests before mass content creation.

### Stage 4: English runtime

- implement registry;
- implement datasets or rule definitions;
- implement generator;
- implement solver;
- implement ambiguity checker;
- implement option validator;
- write exhaustive tests;
- generate review export.

### Stage 5: editorial correction

- inspect exact samples;
- remove weak or misleading rules;
- repair repetitive layouts;
- improve distractors;
- correct explanations;
- rerun audits.

### Stage 6: localization

- implement Hindi and Punjabi text or datasets;
- run locale parity audits;
- export localized reviews;
- perform native-language editorial review.

### Stage 7: integration and freeze

- wire Question Studio discovery;
- run chapter-wide tests;
- check QL continuity;
- check duplicates and collisions;
- merge through PR;
- record verified status.

---

## 22. Freeze-readiness criteria

A checkpoint is ready to freeze only when:

- QL scope matches the audited manifest;
- all required runtime files are present;
- exact QL and rule counts pass;
- all tests execute successfully;
- independent solving passes;
- ambiguity audits pass;
- no complete rule collisions exist;
- option uniqueness and single-answer contracts pass;
- answer-position distribution is acceptable;
- layout and difficulty targets are met;
- English review is approved;
- Hindi and Punjabi parity audits pass where required;
- no placeholders or student-facing internal IDs remain;
- Question Studio discovery works;
- implementation and review reports reflect actual status.

---

## 23. ANA-001 canonical blueprint

ANA-001 is the first reference implementation of this architecture.

Total planned QLs: `260`

Continuous range:

```text
ANA-QL-001 through ANA-QL-260
```

Figure analogy is excluded from ANA-001 and should be handled by a dedicated non-verbal or figure-analogy chapter with image-specific validation.

### Checkpoint allocation

| Checkpoint | QL range | Count | Primary scope |
|---|---:|---:|---|
| ANA-CP-001 | 001-036 | 36 | Direct semantic relationships |
| ANA-CP-002 | 037-060 | 24 | Lexical and language relationships |
| ANA-CP-003 | 061-108 | 48 | Numeric pair analogies |
| ANA-CP-004 | 109-140 | 32 | Number-set / triple relationships |
| ANA-CP-005 | 141-160 | 20 | Reserved by audited chapter manifest |
| ANA-CP-006 | 161-200 | 40 | Reserved by audited chapter manifest |
| ANA-CP-007 | 201-220 | 20 | Reserved by audited chapter manifest |
| ANA-CP-008 | 221-236 | 16 | Reserved by audited chapter manifest |
| ANA-CP-009 | 237-260 | 24 | Reserved by audited chapter manifest |

The exact content of CP-005 through CP-009 must be implemented from the audited ANA-001 manifest rather than inferred from this summary table.

### Implemented status

At the time this architecture document was created:

- ANA-CP-001 is implemented with modular semantic datasets and localization.
- ANA-CP-002 is implemented with modular lexical datasets and localization.
- ANA-CP-003 is implemented for 48 numeric-pair QLs.
- ANA-CP-004 is implemented for 32 number-set QLs with English, Hindi and Punjabi runtime support.
- ANA-CP-004 English and localized runtime tests have been executed successfully after resolving a rule collision.

---

## 24. ANA-CP-004 lessons incorporated globally

The following lessons are now global Reasoning V1 policy:

1. A mathematically valid rule may still be editorially invalid if one displayed member is unused.
2. Parameter scope must be explicit: constants may vary between questions but must remain fixed within one question unless the stem states otherwise.
3. General parameterized rules can collide with fixed special cases. Registry-level collision audits are required.
4. Layout variation, missing-position variation and difficulty variation must be tested rather than assumed.
5. Rule names must describe the actual operation and must not imply relationships that are absent.
6. Localized rule explanations must be updated whenever the underlying formula changes.
7. Successful local execution must be recorded separately from source completion.

---

## 25. Future architecture adjustments

This document may be revised when implementation reveals a better shared abstraction, but changes must preserve:

- stable QL identities;
- deterministic generation;
- independent validation;
- ambiguity rejection;
- multilingual parity;
- exact single-answer behavior;
- auditability.

Any architecture change that weakens those guarantees requires explicit review.

---

## 26. Definition of done for Reasoning V1

Reasoning V1 is complete when:

- all planned reasoning chapters have audited manifests;
- all QLs are implemented and discoverable;
- every checkpoint passes exhaustive English runtime audits;
- Hindi and Punjabi parity is complete for all translatable checkpoints;
- non-verbal checkpoints have image and renderer-specific validation;
- chapter-wide duplicate and ambiguity audits pass;
- Question Studio can preview, review and audit every QL;
- mock-test generation can safely sample by chapter, checkpoint, QL, locale and difficulty;
- architecture and status no longer depend on private chat history.
