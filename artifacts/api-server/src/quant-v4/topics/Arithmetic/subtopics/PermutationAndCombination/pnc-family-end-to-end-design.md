# Permutation & Combination — End-to-End Quant V4 Design

> **Status:** Authoritative family architecture and governance blueprint  
> **Family:** `PermutationAndCombination`  
> **Topic path:** `Arithmetic → Permutation & Combination`  
> **Target exams:** SSC, Banking, Railways, Punjab State and comparable aptitude examinations  
> **Design date:** 2026-07-24  
> **Roadmap correction:** two packages with six canonical-problem ownership boundaries each are fixed. QL totals, solve modes, difficulty distributions and checkpoint sizes remain need-based.

---

## 1. Governance Contract

The design separates **fixed ownership architecture** from **need-based content volume**.

### Fixed

- two P&C packages;
- six CP ownership boundaries in each package;
- family CP IDs `PNC-CP-001` through `PNC-CP-012`;
- the conceptual ownership of every CP;
- continuous, immutable family QL IDs;
- Probability as a separate chapter;
- exact-solver and evidence-driven explanation architecture;
- validation, audit and maturity requirements.

### Need-based

- QLs per CP;
- final family QL count and terminal QL ID;
- solve modes required inside each CP;
- explanation-strategy count;
- difficulty distribution;
- implementation branch/checkpoint size;
- whether an already active CP needs later coverage expansion;
- localization timing after English maturity.

A CP must not be removed or renamed merely because its first implementation checkpoint has not started. Conversely, its QL or solve-mode count must not be predetermined merely to fill a quota.

---

## 2. Fixed Family Taxonomy

### Package 1 — `PNC-001`

**Counting Foundations, Basic Permutations & Basic Combinations**

1. `PNC-CP-001 — Fundamental Counting Principle & Case Partition`
2. `PNC-CP-002 — Distinct Linear Permutations & Positional Assignments`
3. `PNC-CP-003 — Basic Combinations & Direct Selection Applications`
4. `PNC-CP-004 — Digit, Number, Code & Password Formation`
5. `PNC-CP-005 — Word, Letter & Multiset Arrangements`
6. `PNC-CP-006 — Selection-Then-Arrangement & Role Assignment`

### Package 2 — `PNC-002`

**Restricted Arrangements, Grouping & Advanced Selection**

7. `PNC-CP-007 — Together, Apart & Block Restrictions`
8. `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`
9. `PNC-CP-009 — Conditional Selection from Categories`
10. `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`
11. `PNC-CP-011 — Grouping & Distribution`
12. `PNC-CP-012 — Mixed Advanced Counting Systems`

QL IDs are allocated in admission order and need not follow CP order. They are never reused or renumbered merely because a CP was implemented later.

---

## 3. Canonical-Problem Ownership

### `PNC-CP-001 — Fundamental Counting Principle & Case Partition`

Owns:

- multiplication and addition principles;
- independent sequential stages;
- mutually exclusive alternatives;
- disjoint case partition;
- simple complementary counting;
- missing-factor recovery;
- supporting factorial definition, identities, cancellation and bounded inverse reasoning used by the package foundations.

It does not own object-order semantics that require explicit permutation state.

### `PNC-CP-002 — Distinct Linear Permutations & Positional Assignments`

Owns:

- arranging all distinct objects;
- arranging `r` from `n` distinct objects without repetition;
- ordered positions and ranked assignments;
- direct `nPr` applications;
- bounded recovery of a missing permutation parameter.

It may provide generic ordered-symbol authority, but number-specific leading-zero, parity or divisibility semantics belong to CP-004.

### `PNC-CP-003 — Basic Combinations & Direct Selection Applications`

Owns:

- unordered selection of distinct objects;
- teams and committees without assigned roles;
- unordered pairs and triples;
- direct `nCr` applications;
- bounded inverse combination parameters;
- complementary-index symmetry.

Category conditions and complex committee casework belong to CP-009.

### `PNC-CP-004 — Digit, Number, Code & Password Formation`

Owns:

- number versus code semantics;
- leading-zero restrictions;
- repetition allowed or forbidden;
- even/odd final-digit constraints;
- divisibility conditions based on suffixes;
- thresholds based on one or more prefixes;
- mixed letter/digit code stages;
- code alphabet inverse problems;
- controlled symbol-repetition patterns.

It does not own general word multiplicities or letter-arrangement pedagogy, which belong to CP-005.

### `PNC-CP-005 — Word, Letter & Multiset Arrangements`

Owns:

- repeated-letter words;
- identical-object/multiset arrangements;
- multiplicity correction;
- fixed positions that change multiplicities;
- overcount factors from indistinguishable swaps;
- selecting and arranging letters where word/letter identity is central;
- curated dictionary-rank or simple vowel/consonant word profiles when supported by exam evidence.

General together/apart restrictions across arbitrary objects belong to CP-007 unless the word-specific representation is the primary concept.

### `PNC-CP-006 — Selection-Then-Arrangement & Role Assignment`

Owns:

- select a subset and then arrange it;
- committees with distinct offices;
- captain/vice-captain or chair/secretary assignments;
- selection followed by ranked roles;
- mixed `nCr × r!`, `nCr × rPk` and equivalent constructions;
- inverse or comparative variants of these basic mixed systems.

Complex multi-condition systems remain CP-012.

### `PNC-CP-007 — Together, Apart & Block Restrictions`

Owns:

- specified objects together;
- specified objects not together;
- one or more blocks;
- internal block arrangements;
- gap/block complements;
- block restrictions in linear arrangements.

### `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`

Owns:

- fixed positions;
- specified starts or ends;
- relative order;
- alternating categories;
- exactly/at least a stated gap;
- non-adjacency through gap placement;
- position-class restrictions.

### `PNC-CP-009 — Conditional Selection from Categories`

Owns:

- compulsory or excluded members;
- exact/at-least/at-most category counts;
- men/women, subject, department or group conditions;
- majority/minority constraints;
- category-based complements and case partitions.

### `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`

Owns:

- seating around a round table;
- fixing a reference person;
- rotational equivalence;
- circular together/apart restrictions;
- clockwise/anticlockwise distinctions;
- necklace/garland reflection rules only where the symmetry contract is explicitly defined.

Table seating and necklace/garland counting must not share a solver merely because both are circular.

### `PNC-CP-011 — Grouping & Distribution`

Owns:

- division into teams or groups;
- labelled versus unlabelled groups;
- equal and unequal group sizes;
- distributing distinct or identical objects into distinct or identical boxes;
- non-empty and capacity conditions;
- correction for interchangeable groups.

### `PNC-CP-012 — Mixed Advanced Counting Systems`

Owns exam-relevant systems that combine multiple mature authorities, such as:

- selection, restriction and role assignment together;
- small bounded inclusion–exclusion;
- derangement-like restrictions where supported by target exams;
- mixed circular/selection systems;
- path or grid counting where P&C is the intended method;
- complex multi-case constructions that do not belong cleanly to one earlier CP.

It is not a dumping ground. Every admitted family must document why earlier CPs cannot own it cleanly.

---

## 4. QL Admission and Saturation

A QL is admitted only when it contributes at least one material distinction:

- new reasoning topology;
- new solve direction;
- new constraint combination;
- new answer demand;
- meaningful structural difficulty step;
- exam-relevant context family;
- distinct misconception/distractor opportunity;
- wording or localization need not represented by an existing stem.

Noun substitution, cosmetic paraphrasing and shallow template multiplication are not valid coverage gains.

A CP is coverage-saturated only when:

- identified reasoning topologies are represented;
- solve directions and difficulty transitions are supported;
- target-exam contexts are sufficiently diverse;
- new proposals mostly collapse into existing semantic fingerprints;
- duplicate risk rises faster than coverage gain;
- runtime and explanation behaviour are stable across representative seeds.

Saturation is an audit conclusion, never a numeric threshold.

---

## 5. Solve-Mode Policy

Solve modes are not forecast merely from CP names. A mode is introduced with the first admitted QL that needs a distinct contract.

A new mode must differ materially in at least one of:

- authoritative equation or counting construction;
- parameter schema;
- intermediate evidence;
- validator invariants;
- independent verification method;
- explanation flow;
- distractor semantics.

Reuse a mode when only wording or context changes. Split it when reuse would create optional-field sprawl, hidden context switches, misleading evidence or ambiguous validation.

Every new mode must document:

1. representative QLs;
2. required variables;
3. formula/construction;
4. evidence payload;
5. validator invariants;
6. independent verification;
7. explanation strategy;
8. misconception profile;
9. why existing modes are insufficient.

---

## 6. Runtime Architecture

Each package follows the mature Quant V4 structure:

```text
PACKAGE/
├── archetype.md
├── canonical-problems.md
├── difficulty-framework.md
├── reasoning-patterns.md
├── implementation-plan.md
├── library-authority-map.md
├── question-language*.json
├── task-registry*.json
├── variable-ranges.library.json
├── constraint-profiles.library.json
├── coverage-targets.library.json
├── distribution-targets.library.json
├── explanation*.json
├── index.ts
├── package.test.ts
└── foundation/
    ├── types.ts
    ├── library.ts
    ├── math.ts
    ├── parameter-generator.ts
    ├── solver.ts
    ├── reasoning-graph.ts
    ├── explanation-renderer.ts
    ├── option-generator.ts
    ├── validator.ts
    ├── pipeline.ts
    └── coverage-auditor.ts
```

CP-specific companion libraries are preferred when they keep stacked diffs reviewable. The library composer must enforce global QL/registry/explanation parity and reject duplicate IDs.

---

## 7. Authority Model

- Human-owned QL libraries are the stem source of truth.
- Human-owned registries define CP, task kind, solve mode, variables, constraints, difficulty, explanations and distractor contracts.
- Variable libraries own curated safe parameter pools.
- Constraint profiles own mathematical semantics.
- `foundation/solver.ts` is the sole answer authority.
- Independent verification must not simply call the production formula helper.
- Reasoning evidence is generated from solver-owned intermediate state.
- Explanations and options consume solver evidence and never recompute the answer independently.
- Coverage/distribution files record current regression snapshots, not future quotas.

Fixed human-authored words or scenarios are allowed; hard-coded generated answers are not.

---

## 8. Exact Counting Math

Use exact integer helpers with `bigint` intermediates where needed:

- sum and product;
- powers;
- factorial and factorial quotient;
- `nPr`;
- `nCr`;
- multiset/multinomial division;
- exact division;
- symmetry and group-interchange corrections;
- bounded inclusion–exclusion where admitted.

Conversion to display numbers must enforce a configured safety ceiling until arbitrary-size UI answers are supported.

Helpers are added with actual QL need, not speculative future use.

---

## 9. Parameter Generation

Generators must be deterministic by seed and driven by the selected QL contract.

Required properties:

- all placeholders resolve;
- constraints are satisfied before rendering;
- impossible or ambiguous cases are rejected;
- inverse searches have explicit bounded domains and unique answers;
- answer sizes are exam-safe and display-safe;
- identical seeds reproduce parameters, stem, answer, options and explanation;
- difficulty comes from structure, not arbitrary large numbers;
- curated word, digit and multiplicity profiles are preferred to unconstrained random inputs.

---

## 10. Solver Evidence

Every solve mode returns:

- exact/display answer;
- equation or construction summary;
- MathJax when useful;
- normalized evidence sufficient for explanation and validation.

Evidence may include:

- stage and case counts;
- invalid and complement counts;
- `n`, `r`, factorial and cancellation factors;
- ordered/unordered precursor counts;
- digit sets, first-position choices and suffix cases;
- repeated multiplicities and correction factors;
- blocks, gaps, positions and category counts;
- circular symmetry factors;
- group labels/interchange corrections;
- inverse target and recovered parameter.

Independent verification is required wherever bounded enumeration, bounded search or an algebraically separate identity is practical.

---

## 11. Explanation Architecture

Every explanation must establish:

1. what is being counted;
2. whether order matters;
3. whether repetition is allowed;
4. identity, leading-zero, positional or category restrictions;
5. the relevant cases or symmetry corrections;
6. why counts multiply, add, subtract or divide;
7. decisive intermediate values;
8. the final answer in context.

Explanation strategies remain need-based and consume solver evidence. No explanation may silently switch formulas based on nouns in the stem.

---

## 12. Distractors

Distractors should correspond to realistic errors, including:

- addition instead of multiplication;
- `nPr` versus `nCr` confusion;
- allowing or forbidding repetition incorrectly;
- allowing leading zero in a number;
- forgetting one final-digit case;
- treating identical objects as distinct;
- dividing by only one multiplicity factorial;
- forgetting internal block arrangements;
- mishandling circular symmetry;
- treating labelled groups as unlabelled or vice versa;
- ignoring compulsory/excluded categories.

Generic numeric offsets are fallback-only and must remain below the audit cap.

---

## 13. Validation and Audits

Every generated package must validate:

- active package and CP ownership;
- registry/language parity;
- required placeholders;
- finite non-negative parameters;
- exact answer and configured ceiling;
- independent verification agreement;
- four unique positive options;
- correct answer exactly once;
- resolved stem and explanation placeholders;
- reasoning equation/evidence parity;
- solve-mode-specific invariants.

Coverage audits must include:

- current QL ID continuity;
- exact and near-duplicate review;
- difficulty and mode snapshots;
- context concentration;
- generic-distractor share;
- deterministic seed sweeps;
- mathematical fingerprints;
- language maturity and publication state.

---

## 14. Difficulty

Difficulty is structural:

- **Easy:** one direct principle or familiar formula with transparent constraints;
- **Medium:** one important interpretation, case split, correction or bounded inverse step;
- **Hard:** multiple interacting restrictions, symmetry, category casework, non-obvious complements or mixed authorities.

No package or CP has a predetermined Easy/Medium/Hard quota.

---

## 15. Localization

English is the mathematical/editorial authority during runtime proof.

Hindi and Punjabi are enabled only after:

- English coverage and solver contracts are stable;
- terminology and numeral policy are approved;
- structural placeholders match English;
- translation is human-reviewed;
- language-specific rendering tests pass.

Structural placeholder files are not publishable localization.

---

## 16. Maturity and Freeze Gates

Suggested maturity sequence:

```text
DESIGN_LOCKED
→ RUNTIME_PROOF
→ MVP_QA
→ PRODUCTION_QA
→ MANUAL_REVIEW
→ FROZEN
```

A CP/package is not frozen merely because tests pass. Freeze requires:

- coverage-saturation review;
- solver and independent-verifier stability;
- editorial realism and diversity;
- duplicate/near-clone audit;
- placeholder and localization readiness;
- runtime and integration tests;
- documented residual gaps and explicit acceptance.

Generation-engine/admin/production routing occurs only after package-level maturity approval.

---

## 17. Implementation Sequence

### Package `PNC-001`

Implement and mature CP-001 through CP-006, allowing later need-based extensions inside active CPs. After CP-006, perform a package-wide saturation and freeze-readiness audit.

### Package `PNC-002`

Then implement CP-007 through CP-012, reusing exact foundational math but introducing restriction, circular, grouping and advanced-mixed contracts only as their QLs require.

Stacked branches are allowed, but each checkpoint must remain independently reviewable and green.

---

## 18. Current Snapshot — 2026-07-24

Current active implementation in `PNC-001`:

- CP-001: runtime proof;
- CP-002: runtime proof;
- CP-003: runtime proof;
- CP-004: runtime proof;
- CP-005: partial CP runtime proof for repeated-object/multiset coverage;
- CP-006: pending.

Current descriptive snapshot:

- English QLs: `PNC-QL-001` through `PNC-QL-094`;
- QL count: 94;
- active solve modes: 30;
- difficulty: 37 Easy / 39 Medium / 18 Hard;
- proof: 1,128 deterministic seed cases generated twice;
- publication: disabled;
- production routing: disabled.

These values protect the reviewed checkpoint from accidental drift. They are not final corpus targets.
