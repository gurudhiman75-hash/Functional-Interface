# CLS-001 — Source and Ownership Audit

Status: `INITIAL_SOURCE_PASS_COMPLETE__DISCOVERY_OPEN`

This audit records the first source-led boundary for Classification / Odd One Out. It is not a final saturation claim and does not allocate permanent QLs.

---

## 1. Sources reviewed in the initial pass

### Uploaded source A

`reasoning_aggarwal.pdf` — competitive-reasoning reference containing a dedicated Classification chapter.

Observed recurring sections and task forms:

- odd word/entity;
- odd pair of words;
- odd number;
- odd number pair;
- odd letter;
- odd letter pair;
- odd letter cluster;
- identify another member of a class;
- select a set similar to a given set;
- jumbled-word classification;
- exam-labelled examples from SSC, RRB, police and state examinations.

### Uploaded source B

`reasoning book.pdf` — verbal and non-verbal competitive-reasoning reference with a dedicated Classification chapter and mixed previous-exam question bank.

Observed recurring families:

- semantic category membership;
- semantic relationship-pair classification;
- prime/composite, square/cube, divisibility and digit-property outliers;
- number-pair and number-set relations;
- letter and letter-cluster patterns;
- jumbled meaningful-word groups;
- class-member continuation;
- mixed symbol and unit-category questions.

### Repository authority

`REASONING-V1-MASTER-BLUEPRINT.md` defines Classification as `REAS-CLS` in Family A — Symbolic and Sequence Reasoning. It also requires Classification to remain separate from Figure Classification and identifies a curated semantic relationship library as shared infrastructure for word analogy and classification.

---

## 2. Source interpretation rule

Source frequency is evidence for discovery priority, not a quota. A printed exercise may contain many examples of one underlying solve contract.

The following must not be inferred directly from book section counts:

- permanent QL count;
- checkpoint count;
- solve-mode count;
- difficulty distribution;
- runtime dataset size;
- production wording.

Every source candidate must pass executable ownership, ambiguity and merge/split audits.

---

## 3. Initial source-backed family inventory

### A. Semantic single-item classification

Recurring source forms:

- three items in one category and one from another;
- three items sharing function/use and one not;
- three parts of one whole or system and one unrelated item;
- biological or geographic class membership;
- units or institutions grouped by a stable property;
- class-member selection from a supplied group.

Provisional ownership: `CLS-CP-001`.

Risk: many semantic items admit broad alternative classes or depend on unstable/general-knowledge facts. Dataset curation and competing-class checks are mandatory.

### B. Semantic relationship-pair classification

Recurring source forms:

- synonym versus antonym pairs;
- container/content;
- tool/function;
- object/sound;
- quantity/unit;
- person/role;
- source/product;
- part/whole;
- family or social-role pairs.

Provisional ownership: `CLS-CP-002`.

Risk: pair direction, relation granularity and semantic polysemy can change the answer.

### C. Lexical and jumbled-word classification

Recurring source forms:

- rearrange letters into meaningful words, then classify the resolved words;
- identify one word with a different spelling or structural property;
- repeated-letter and letter-count patterns;
- common prefix/suffix or morphology.

Provisional ownership: `CLS-CP-003`.

Risk: several source items blur Classification, Alphabet Test and Word/Dictionary Order. Only classification-final tasks belong here.

### D. Number-property classification

Recurring source forms:

- prime/composite;
- perfect square/cube;
- divisibility;
- parity;
- digit composition;
- digit sum/product;
- reversal properties;
- powers and near-powers;
- source-backed special-number classes.

Provisional ownership: `CLS-CP-004`.

Risk: arbitrary alternative number rules are easy to invent. The eligible rule universe must be bounded and conventional.

### E. Number-pair, triple and set classification

Recurring source forms:

- three pairs satisfy `b = f(a)` and one does not;
- same difference, ratio, product or factor relation;
- ordered triples with one internal relation;
- select the candidate set matching a given set signature;
- pair/set direction and order sensitivity.

Provisional ownership: `CLS-CP-005`.

Risk: overlap with Numeric Analogy and Missing Number. The final task, not only the arithmetic, determines ownership.

### F. Letter and letter-pair classification

Recurring source forms:

- vowel versus consonant;
- alphabet-position gaps;
- opposite letters;
- forward/reverse pair relation;
- letter-class membership;
- simple position sums.

Provisional ownership: `CLS-CP-006`.

Risk: direct position queries belong to Alphabet Test; source-to-target transfer belongs to Analogy.

### G. Letter-cluster classification

Recurring source forms:

- uniform gaps;
- alternating gaps;
- mirrored or opposite-letter clusters;
- position-sum relations;
- repeated-letter topology;
- cluster-internal pair relations.

Provisional ownership: `CLS-CP-007`.

Risk: next-cluster progression belongs to Series; inferred word encoding belongs to Coding-Decoding.

### H. Mixed classification

Observed source forms:

- mixed symbols grouped by mathematical or visual function;
- mixed letter-number states;
- class-member and equivalent-set tasks combining more than one property.

Provisional ownership: `CLS-CP-008`, pending stronger recurring evidence.

Risk: this area overlaps OPS, Coding-Decoding, Matrix, non-verbal Classification and general puzzle formats.

---

## 4. Task-direction inventory

The initial source pass proves at least four materially relevant task directions:

1. `FIND_OUTLIER` — choose the one item unlike the other three.
2. `FIND_ODD_PAIR` — choose the pair whose internal relation differs.
3. `SELECT_CLASS_MEMBER` — choose another member of a supplied group/class.
4. `SELECT_EQUIVALENT_SET` — choose the set governed by the same relation as the given set.

This does not prove four permanent QLs. Their merge/split treatment remains executable-discovery work.

---

## 5. Ownership decisions

### Classification versus Analogy

Classification owns choosing the item/pair that violates or shares a common rule across displayed options.

Analogy owns transferring a relation from a source pair/set to a target pair/set.

Examples:

```text
A:B, C:D, E:F, G:H — choose the differently related pair
  -> Classification

A:B :: C:?
  -> Analogy
```

### Classification versus Series

Classification owns unordered or option-local grouping.

Series owns ordered progression, next term, missing term and wrong term where sequence position is essential.

A printed direction saying "find the wrong term" is Series when the terms form one ordered progression. It is Classification when the options are independent candidate objects.

### Classification versus Alphabet Test

Classification owns the outlier task over letter/cluster properties.

Alphabet Test owns explicit direct questions about position, distance, midpoint, order or rearrangement.

### Classification versus Coding-Decoding

Classification owns visible option properties and pair-local relations.

Coding-Decoding owns hidden mappings, encoding, decoding and rule inference applied to a target.

### Classification versus Mathematical Operations

Classification may group symbols by a stable non-evaluative class only when source-backed.

OPS owns symbol substitution, operator interchange, relation replacement and equation evaluation.

### Classification versus Number System

Reasoning Classification may use conventional number properties as the basis of an odd-one-out task.

Quant Number System owns instructional calculation and theorem-focused questions about those properties. Shared mathematical utilities are allowed, but QL ownership remains separate.

### Classification versus Word and Dictionary Order

Classification owns lexical structure or semantic class.

Word and Dictionary Order owns sorting multiple words or identifying dictionary position.

### Classification versus Figure Classification

Textual/symbolic Classification and Figure Classification remain separate runtime packages. Figure Classification requires SVG primitives and geometry-aware transformation validation.

---

## 6. Explicit exclusions from initial ownership

The following are not admitted merely because a source labels them Classification:

- ordered series wrong-term questions;
- analogy completion;
- code-language questions;
- dictionary ordering;
- free-form general knowledge with no governed dataset;
- subjective personality, social or moral classifications;
- protected-trait classification of people;
- figure-based odd-one-out;
- visual symbol grouping requiring shape inspection;
- arbitrary numerical equations fitted after seeing the options;
- questions with multiple equally natural outliers;
- fact patterns likely to change with time;
- obscure one-off trivia without recurring exam evidence.

---

## 7. Initial gap audit

The source pass is strong enough to begin CP-001 but not to freeze any checkpoint.

Open gaps include:

- exact semantic class taxonomy and dataset versioning;
- negative and sibling-class evidence;
- treatment of broad versus narrow class rules;
- task-direction merge/split evidence;
- class-member versus outlier inverse symmetry;
- multilingual semantic adaptation;
- pair direction and relation hierarchy;
- numerical eligible-rule registry;
- cross-rule ambiguity scoring;
- mixed-domain ownership;
- source frequency for advanced or multi-condition classification;
- exam distribution across SSC, Banking and Punjab sources;
- legacy repository recovery, if any classification runtime exists outside Reasoning V1.

---

## 8. First checkpoint decision

Start `CLS-CP-001 — Semantic Word and Entity Classification` because:

- it is directly and repeatedly source-backed;
- it establishes the curated semantic dataset needed by later word-pair classification;
- it exercises the chapter's highest ambiguity risk early;
- it is independent from the active Blood Relations implementation;
- it can reuse semantic-library lessons from Analogy without copying Analogy's task contracts.

The first implementation must use temporary IDs such as:

```text
CLS-CP001-PROT-001
CLS-CP001-PROT-002
...
```

No `CLS-QL-*` allocation is allowed until the checkpoint source, inverse, representation, ownership, merge/split and ambiguity audits close.

---

## 9. Current disposition summary

```text
Source books reviewed:                 2
Recurring broad families identified:  8
Task directions identified:           4
Permanent QLs:                         0
Frozen solve modes:                    0
Runtime code:                          0
Question Studio exposure:              0
Publicly publishable questions:        0
```

Next action: implement the first non-permanent CP-001 semantic prototype wave and use its evidence to refine the candidate inventory.
