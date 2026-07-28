# CLS-001 — Classification / Odd One Out: End-to-End Design

Status: `OPEN_EXECUTABLE_DISCOVERY`

This document defines the initial architecture for ExamTree Reasoning V1 chapter `CLS-001`. It is subordinate to the Reasoning V1 master blueprint and implementation architecture.

The design deliberately keeps permanent QL and solve-mode totals open. Checkpoint names, candidate families and prototype counts are discovery tools rather than quotas.

---

## 1. Student skill being tested

A valid Classification question presents a finite option set and asks the learner to identify:

- the unique option that does not share the intended property of the others;
- the unique pair whose internal relationship differs from the others;
- the option that is another member of a supplied class;
- the option-set governed by the same structural rule as a supplied set.

The underlying cognitive act is not merely spotting a surface difference. It is:

1. infer or recognise a candidate class/rule;
2. test that rule consistently across the options;
3. confirm that exactly three options satisfy it and exactly one does not, or that exactly one candidate joins the supplied class;
4. reject competing rules that would create another defensible answer.

---

## 2. Non-negotiable runtime invariant

For direct four-option odd-one-out questions, the canonical state must satisfy:

```text
there exists exactly one admitted intended rule R
such that exactly three displayed options satisfy R
and exactly one displayed option does not satisfy R
```

This is insufficient by itself. The ambiguity audit must also show that no competing rule from the declared eligible rule universe creates a different unique outlier with comparable or stronger support.

For odd-pair questions:

```text
exactly three option pairs instantiate relation R
and exactly one pair instantiates a materially different relation
```

For class-member selection:

```text
the supplied members share one admitted class R
exactly one candidate also satisfies R
```

For similar-set selection:

```text
the supplied set has one admitted structural signature S
exactly one candidate set has the same signature S
```

---

## 3. Open checkpoint architecture

### `CLS-CP-001` — Semantic word and entity classification

Working domains:

- category membership;
- part/whole membership;
- habitat or environment;
- profession or institutional role;
- object use or function;
- source/material/product;
- organism class;
- place type;
- natural versus man-made;
- units and measured quantities where semantically stable;
- controlled domain knowledge suitable for SSC, Banking and Punjab exams.

This checkpoint must use curated, versioned data. Free-form runtime fact generation is prohibited.

### `CLS-CP-002` — Semantic pair and relationship classification

Working relations:

- synonym/antonym;
- worker/workplace;
- tool/function;
- container/content;
- material/product;
- object/sound;
- unit/quantity;
- cause/effect where unambiguous;
- part/whole;
- producer/product;
- family or role relation only when it does not become a Blood Relations inference problem.

Pair direction is part of the relation signature. `tool → function` is not automatically equivalent to `function → tool`.

### `CLS-CP-003` — Lexical and word-structure classification

Working properties:

- word length;
- vowel/consonant count;
- repeated-letter structure;
- initial/final letter class;
- alphabetical order inside a word;
- palindrome and near-palindrome status;
- meaningful word recovered from a controlled jumble;
- common affix or morphological structure;
- language-specific lexical families where curated per locale.

Dictionary sorting belongs to Word and Dictionary Order. Hidden transformation inference belongs to Coding-Decoding.

### `CLS-CP-004` — Number-property classification

Working properties:

- parity;
- primality/compositeness;
- perfect square/cube and bounded powers;
- divisibility and factor-count properties;
- polygonal or other source-backed special-number classes;
- digit parity/composition;
- reversal properties;
- digit sum/product properties;
- bounded forms such as `n² ± k`, `n³ ± k` when recurring and independently source-backed;
- exact whole-number transformations.

The rule universe must be bounded. Arbitrary polynomial fitting is prohibited.

### `CLS-CP-005` — Number-pair, triple and set classification

Working structures:

- pair transforms such as `b = f(a)`;
- differences, ratios and products;
- consecutive or related-number pairs;
- three-number internal relations;
- same-set signature selection;
- tuple order sensitivity;
- exact divisibility and integer-only constraints;
- relation direction and answer-semantic variants.

Numeric Analogy owns source-to-target rule transfer. CLS owns selecting the pair/set that violates or shares a common rule.

### `CLS-CP-006` — Alphabet, letter-pair and letter-class classification

Working properties:

- vowel/consonant membership;
- alphabetical positions;
- reverse positions;
- opposite-letter pairs;
- fixed position gaps;
- pair direction;
- letter-shape or script properties only if renderer- and locale-safe;
- controlled forward/reverse relation signatures.

Directly asking for an alphabet position or offset belongs to Alphabet Test.

### `CLS-CP-007` — Letter-cluster and explicit word-pattern classification

Working structures:

- uniform or alternating position gaps;
- mirrored/opposite clusters;
- repeated-letter topology;
- cluster position sums;
- pairwise relation within clusters;
- explicit rearrangement signatures;
- source-backed alpha patterns whose task is to find the outlier rather than infer a code or continue a series.

### `CLS-CP-008` — Mixed token and bounded synthesis classification

Potential ownership:

- mixed letter-number option groups;
- symbol-class properties;
- combined semantic and structural states;
- multi-example classification;
- exam-style caselets or tables;
- bounded cross-domain synthesis where one classification rule remains clear.

This checkpoint is admitted only after earlier engines stabilise. It must not become a dumping ground for unowned patterns.

---

## 4. QL discovery principle

A permanent QL represents a materially distinct student task and answer contract, not a topic label, dataset category or wording variant.

The following usually remain instance properties rather than separate QLs:

- which semantic category is used;
- which four entities are displayed;
- which option position is correct;
- option order;
- numerical magnitude;
- exact letter identities;
- English, Hindi or Punjabi rendering where logic is translatable;
- easy/medium/hard level;
- text versus compact-list presentation when answer semantics are unchanged.

Possible QL-splitting signals include:

- direct outlier versus odd relationship-pair;
- identify another class member versus identify the outlier;
- single object versus pair/tuple object when the solver contract changes;
- answer is an item versus answer is a pair/set;
- unique task direction requiring a different proof or ambiguity model;
- language-specific logic that cannot preserve state parity.

Every prototype must be classified as one of:

```text
RETAIN
MERGE_AS_INSTANCE_VARIANT
MERGE_AS_PRESENTATION_VARIANT
SPLIT_BY_SOLVER_CONTRACT
DEFER_TO_LATER_CHECKPOINT
REASSIGN_TO_OTHER_CHAPTER
REJECT_FOR_SOURCE_GAP
REJECT_FOR_AMBIGUITY
REJECT_FOR_EDITORIAL_RISK
```

---

## 5. Canonical data model

### 5.1 Generic classification option

```ts
type ClassificationOption = {
  id: string;
  displayValue: string;
  canonicalValue: string;
  domain: 'SEMANTIC_ENTITY' | 'WORD' | 'NUMBER' | 'NUMBER_PAIR' |
    'NUMBER_TUPLE' | 'LETTER' | 'LETTER_PAIR' | 'LETTER_CLUSTER' |
    'MIXED_TOKEN' | 'SYMBOL';
  attributes: Record<string, string | number | boolean | string[]>;
};
```

### 5.2 Rule signature

```ts
type ClassificationRule = {
  ruleId: string;
  family: string;
  directionSensitive: boolean;
  arity: 1 | 2 | 3 | 4;
  localeMode: 'TRANSLATABLE' | 'LANGUAGE_ADAPTED' | 'LANGUAGE_SPECIFIC';
  evaluate(option: ClassificationOption): RuleEvaluation;
};
```

### 5.3 Rule evaluation

```ts
type RuleEvaluation = {
  satisfies: boolean;
  evidence: string[];
  confidence: 'EXACT' | 'CURATED_FACT';
};
```

### 5.4 Question state

```ts
type ClassificationQuestionState = {
  prototypeId: string;
  permanentQlId: null;
  checkpointId: string;
  task: 'FIND_OUTLIER' | 'FIND_ODD_PAIR' | 'SELECT_CLASS_MEMBER' |
    'SELECT_EQUIVALENT_SET';
  intendedRuleId: string;
  options: ClassificationOption[];
  correctIndex: number;
  ruleEvidenceByOption: RuleEvaluation[];
  competingRuleAudit: CompetingRuleAudit;
  difficultyFeatures: DifficultyFeatures;
  localeMode: 'TRANSLATABLE' | 'LANGUAGE_ADAPTED' | 'LANGUAGE_SPECIFIC';
};
```

---

## 6. Valid-state-first generation

The generator must never create four arbitrary options and then invent a reason why one is different.

Required flow:

```text
select an admitted prototype
  -> select an intended rule
  -> construct or retrieve at least three positive members
  -> select a controlled outlier or unique joining member
  -> assemble the displayed state
  -> canonical solve
  -> independent re-solve
  -> run competing-rule ambiguity audit
  -> construct misconception-labelled options where the task needs answer alternatives beyond the displayed items
  -> render
  -> editorial validation
  -> emit review-only candidate
```

For direct odd-one-out tasks, the displayed items are commonly the answer options themselves. Their construction must therefore balance:

- comparable surface form;
- no obvious length or formatting giveaway unless that is the intended rule;
- no accidental duplicate;
- no unintended alternative grouping;
- stable locale rendering.

---

## 7. Canonical solver and independent verifier

### Canonical solver

The canonical solver may use the structured intended rule and authoritative dataset to evaluate all options and return the unique outlier or matching member.

### Independent verifier

The verifier must materially differ. Depending on checkpoint, it should:

- re-derive semantic membership from a normalized fact index rather than trust stored memberships;
- enumerate the bounded eligible rule registry and score rule support;
- calculate number/letter properties independently from displayed values;
- parse displayed pair/tuple values and reconstruct relation signatures;
- confirm that exactly one option has the required mismatch/match status;
- reject if another rule produces a different defensible answer.

The verifier must not trust:

- the stored correct index;
- precomputed option evidence;
- the generator's final answer;
- the intended rule label without recalculation.

---

## 8. Ambiguity architecture

Classification has unusually high ambiguity risk because finite option sets often admit many accidental descriptions.

### 8.1 Eligible rule universe

Each prototype declares a bounded eligible rule universe. Example for a number-property question:

```text
PARITY
PRIME_STATUS
PERFECT_SQUARE
PERFECT_CUBE
DIVISIBLE_BY_K for approved K
DIGIT_SUM_CLASS
DIGIT_PARITY_PATTERN
REVERSAL_PROPERTY
SOURCE_BACKED_N_SQUARED_PLUS_MINUS_K
```

Unrestricted expressions, arbitrary modular coincidences and curve fitting are excluded.

### 8.2 Rule quality ordering

When several rules group three options, the audit prefers rules that are:

1. directly source-backed;
2. simple and conventional for the exam level;
3. exact rather than approximate;
4. uniform across the three members;
5. based on the displayed object rather than hidden outside facts;
6. free of ad hoc constants chosen only for the current options.

The question is rejected when two rules of comparable quality produce different outliers.

### 8.3 Semantic ambiguity

Semantic questions require curated negative evidence and sibling-class checks. For example, three animals sharing one family and a fourth from another family may still all share a broader class such as mammals. That broader commonality is not automatically ambiguous, because it does not produce a different outlier. Ambiguity exists when another equally natural class groups a different triple.

### 8.4 Locale ambiguity

Translation may change category salience, word structure or polysemy. `LANGUAGE_ADAPTED` and `LANGUAGE_SPECIFIC` questions must be independently audited in each locale rather than relying on answer-index parity alone.

---

## 9. Semantic dataset governance

Semantic generation must use versioned curated records.

```ts
type SemanticEntityRecord = {
  entityId: string;
  labels: {
    en: string;
    hi?: string;
    pa?: string;
  };
  classes: string[];
  excludedClasses?: string[];
  attributes: Record<string, string | string[] | boolean>;
  sourceStatus: 'CURATED' | 'REVIEWED';
  localeNotes?: Record<string, string>;
};
```

Required safeguards:

- no unstable current-affairs facts in the foundational dataset;
- no disputed taxonomies without explicit exam convention;
- no culturally insensitive or harmful group classification;
- no person classification by protected or sensitive traits;
- no obscure fact used as the sole distinction in an easy question;
- no automatic translation of proper nouns when a conventional locale form exists;
- no free-form LLM fact insertion at runtime;
- dataset version included in metadata and review exports.

---

## 10. Number and alphabet rule governance

Numeric and alphabetic rules must be explicit and machine-readable.

### Numeric restrictions

- integer arithmetic is exact;
- divisibility and factor computations use exact integer logic;
- powers and roots are verified without floating-point tolerance;
- digit operations are allowed only when declared;
- leading zeroes are preserved for token strings;
- source-backed constants are bounded;
- numerical states must avoid accidental secondary rules.

### Alphabet restrictions

- A–Z positions are canonical;
- reverse positions and opposite pairs are explicit utilities;
- cyclic and non-cyclic behavior is declared;
- pair/cluster direction is preserved;
- repeated letters retain occurrence identity where relevant;
- language-neutral Latin token logic may remain identical across locales, while instructions and explanations are localized.

---

## 11. Task directions and answer semantics

### `FIND_OUTLIER`

Displayed options: four items.

Answer: the unique non-member.

### `FIND_ODD_PAIR`

Displayed options: four pairs.

Answer: the pair with a different relation.

### `SELECT_CLASS_MEMBER`

Displayed givens: a class seed of two or more members.

Displayed options: candidate members.

Answer: the unique candidate satisfying the same class.

### `SELECT_EQUIVALENT_SET`

Displayed given set: pair/triple/set with a structural signature.

Displayed options: candidate sets.

Answer: the unique set matching the signature.

A task direction is not automatically a separate QL. It is separated only when answer semantics, solver proof or generation topology materially changes.

---

## 12. Distractor architecture

In many Classification questions, the displayed classification items are themselves the options. Distractor quality therefore means constructing three coherent in-class members and one controlled deviator rather than generating arbitrary wrong numerical answers.

Machine-readable misconception/error labels may include:

```text
SURFACE_SIMILARITY_ONLY
BROADER_CLASS_INSTEAD_OF_INTENDED_CLASS
NARROWER_CLASS_OVERFIT
RELATION_DIRECTION_REVERSED
PART_WHOLE_CONFUSION
TOOL_FUNCTION_CONFUSION
SYNONYM_ANTONYM_CONFUSION
PARITY_CONFUSION
PRIME_COMPOSITE_CONFUSION
SQUARE_CUBE_CONFUSION
DIGIT_WHOLE_NUMBER_CONFUSION
PAIR_ORDER_IGNORED
WRONG_ALPHABET_DIRECTION
OFF_BY_ONE_POSITION
OPPOSITE_LETTER_CONFUSION
CLUSTER_GAP_MISREAD
JUMBLE_NOT_RESOLVED
```

For class-member and equivalent-set tasks, wrong options must represent specific near-class or near-rule errors.

---

## 13. Explanation contract

Every accepted candidate must provide four learner-facing tiers:

1. **Core Rule** — state the common property or relation in natural exam language.
2. **Check the Options** — show concise evidence for each relevant option; for numeric/letter questions, show the actual calculations.
3. **Exam Speed Shortcut** — explain the quickest reliable screening order for this exact family.
4. **Common Traps** — explain why the tempting alternatives or competing interpretations fail.

A semantic explanation should not merely say "the others are related". It must name the class and explain the outlier.

A numeric explanation must show the relation for all three conforming options and the failure for the outlier.

A letter-cluster explanation should use position traces, gap rows or alignment grids where useful.

Internal rule IDs and prototype IDs must never appear in learner-facing text.

---

## 14. Difficulty model

Difficulty is generated from instance properties, including:

- semantic familiarity;
- class specificity;
- number of plausible competing classes;
- number of transformations needed;
- option surface similarity;
- arithmetic depth;
- pair/tuple arity;
- direction sensitivity;
- use of digit-level versus whole-number reasoning;
- need to resolve a jumble before classification;
- mixed-domain presentation;
- renderer complexity.

Large values or obscure vocabulary alone do not justify a higher level.

---

## 15. Localisation strategy

### `TRANSLATABLE`

Suitable for:

- numbers;
- Latin letters and clusters;
- symbols;
- language-neutral pair/tuple relations;
- semantic entities with stable conventional labels and unchanged class membership.

### `LANGUAGE_ADAPTED`

Suitable for:

- semantic word classification;
- synonym/antonym and lexical relations;
- jumbled meaningful words;
- morphology and affix patterns;
- culturally or linguistically adapted examples.

### `LANGUAGE_SPECIFIC`

Required when the rule depends on:

- spelling length in one language;
- vowel/consonant structure of locale-script words;
- language-specific morphology;
- a wordplay relationship with no natural equivalent.

Hindi and Punjabi must sound like competitive-exam language, not literal translations. Punjabi must avoid unnecessarily technical textbook terms when a natural alternative exists.

---

## 16. Renderer strategy

Initial supported renderers:

- `TEXT` for single items and word lists;
- `STRUCTURED_TEXT` for pair relations and explanatory traces;
- `TABLE_OR_GRID` for number sets, cluster positions and multi-option comparisons.

Figure classification is explicitly excluded and will use a separate SVG-based package.

---

## 17. Review and audit exports

Every discovery wave must export deterministic reviewer artefacts containing:

- prototype ID;
- seed;
- checkpoint;
- task direction;
- intended rule family;
- displayed question;
- four options;
- correct answer;
- per-option evidence;
- competing-rule audit result;
- difficulty features;
- misconception labels;
- four-tier explanation;
- locale mode;
- lifecycle locks.

Reviewer outputs should be available in JSON plus a human-readable Markdown or HTML form.

---

## 18. Lifecycle and safety

All prototype output remains:

```text
permanentQlId: null
reviewStatus: UNREVIEWED_DISCOVERY
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
questionStudioDiscoverable: false
```

Permanent IDs may be proposed only after:

- source saturation;
- task-direction audit;
- direct/inverse/edge audit;
- representation audit;
- chapter-ownership audit;
- merge/split audit;
- competing-rule ambiguity audit;
- editorial review;
- deterministic runtime proof;
- independent-verifier proof;
- no-meaningful-gap decision.

---

## 19. Implementation sequence

1. Establish semantic entity/class dataset schema.
2. Implement `CLS-CP-001` non-QL English prototype wave.
3. Audit semantic ambiguity and dataset governance.
4. Expand to semantic pair relations in CP-002.
5. Stabilise reusable classification engine and competing-rule auditor.
6. Implement lexical and word-structure discovery.
7. Implement number and tuple classification with bounded rule registries.
8. Implement letter and cluster classification using shared alphabet utilities.
9. Admit mixed synthesis only after ownership and collision audits.
10. Freeze English QLs checkpoint by checkpoint only when evidence closes.
11. Localise through structured state with locale-specific audits.
12. Integrate Question Studio only after chapter-level runtime maturity.

---

## 20. Immediate next milestone

Implement the first non-permanent `CLS-CP-001` prototype foundation. The first wave should be architecture-establishing and gap-revealing rather than a final inventory.
