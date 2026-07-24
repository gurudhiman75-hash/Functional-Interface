# Permutation & Combination — Need-Based End-to-End Quant V4 Design

> **Status:** Architecture and governance blueprint.
> **Family:** `PermutationAndCombination`
> **Topic path:** `Arithmetic → Permutation & Combination`
> **Target exams:** SSC, Banking, Railways, Punjab State and comparable aptitude examinations.
> **Design date:** 2026-07-24
> **Design amendment:** 2026-07-24 — removed fixed family QL totals, fixed CP totals, predetermined package boundaries and advance solve-mode inventories. Coverage now grows only from demonstrated exam/content/runtime need.

---

## 1. Core Principle

The P&C design freezes **how the chapter is built and judged**, not how many artifacts it must contain.

The following are deliberately **not fixed in advance**:

- total number of QLs;
- QLs per canonical problem;
- final number of canonical problems;
- final number of packages;
- solve-mode count;
- difficulty percentages;
- explanation-strategy count;
- implementation checkpoint count.

A new QL, solve mode, CP or package is added only when a reviewed coverage matrix shows a real gap that cannot be represented cleanly by an existing artifact.

Current counts are snapshots of implemented content. They are not quotas, ceilings or promises of a final corpus size.

---

## 2. What “End to End” Means

End-to-end design means that every admitted question family has a complete path through:

```text
exam/content need
    ↓
canonical-problem ownership decision
    ↓
QL admission and human-authored stem
    ↓
typed task-registry contract
    ↓
deterministic parameter generation
    ↓
authoritative exact solver
    ↓
independent verification where practical
    ↓
reasoning evidence
    ↓
customized explanation
    ↓
semantic distractors
    ↓
package validation and audits
    ↓
manual review and maturity decision
```

It does not mean predicting every future question, solve mode or package before implementation evidence exists.

---

## 3. Stable Family Scope

The stable conceptual scope includes exam-relevant counting problems involving:

- addition and multiplication counting principles;
- disjoint case partition and complementary counting;
- factorials, permutations and combinations;
- ordered and unordered selection;
- linear and circular arrangements;
- digit, number, code and password formation;
- word and repeated-object arrangements;
- positional, adjacency, gap, alternation and relative-order constraints;
- conditional committee/team selection;
- grouping and distribution;
- small bounded inclusion–exclusion, derangement and path-counting patterns when supported by target exams;
- mixed selection-then-arrangement systems.

Probability remains separate. It may consume shared P&C counting utilities later, but it must not duplicate their mathematical authority.

### Excluded by default

- advanced olympiad combinatorics without target-exam evidence;
- generating functions;
- unrestricted integer partitions;
- Bell/Stirling-number theory as standalone content;
- recurrence-heavy combinatorics;
- advanced graph enumeration;
- broad inclusion–exclusion systems with many uncontrolled intersections.

An excluded family may be reconsidered only through a documented coverage-gap decision.

---

## 4. Need-Based Taxonomy

### 4.1 Active canonical problems

Only implemented or actively approved CPs receive stable IDs.

Current active CP:

| CP ID | Name | Current implemented QLs | Status |
|---|---|---:|---|
| `PNC-CP-001` | Fundamental Counting Principle & Case Partition | 48 | Runtime proof |

The count of 48 records the present checkpoint. It is not a final CP size. CP-001 may receive more QLs later if a genuine uncovered scenario, reasoning topology, difficulty band or language requirement is discovered.

### 4.2 Candidate coverage families

The following are a **coverage backlog**, not pre-created CPs and not a mandatory implementation order:

- distinct linear permutations and ordered positions;
- direct combinations and selection applications;
- digit/number/code formation;
- word and multiset arrangements;
- selection followed by role assignment;
- together/apart/block restrictions;
- position, relative order, alternation and gap constraints;
- category-constrained selection;
- circular arrangements;
- grouping and distribution;
- mixed advanced counting systems.

Before promoting a candidate family to a CP, the design review must establish:

1. it appears materially in target exams or reference material;
2. it has a coherent mathematical authority;
3. it cannot be represented cleanly inside an existing CP;
4. it needs independent parameter, solver, validator or explanation behavior;
5. its addition improves coverage rather than merely increasing count.

### 4.3 Package creation

`PNC-001` is the only committed package at present.

A second package is created only when one or more of these conditions becomes true:

- the active package becomes operationally too large to review safely;
- the new family requires a materially different runtime or validator architecture;
- CP ownership becomes ambiguous inside one package;
- separate maturity/freeze cycles are beneficial;
- shared-file conflict risk is reduced by the split.

Package names and boundaries must not be reserved merely to satisfy an earlier roadmap.

---

## 5. Need-Based QL Policy

### 5.1 QL admission rule

A QL is added only when it contributes at least one material distinction:

- a new reasoning topology;
- a new solve direction;
- a new constraint combination;
- a new answer demand;
- a meaningful difficulty step;
- an exam-relevant context family;
- a distinct misconception/distractor opportunity;
- a language or wording need not represented by an existing stem.

Noun replacement, cosmetic paraphrasing and shallow template multiplication are not valid reasons to add a QL.

### 5.2 No fixed terminal ID

QL IDs are monotonic and never reused, but there is no predetermined last ID.

```text
PNC-QL-001, PNC-QL-002, ...
```

The next ID is allocated when a QL is admitted. A later package, if created, continues the family sequence unless a documented migration decision changes the convention.

### 5.3 Coverage saturation

A CP is considered coverage-saturated only when review shows:

- all identified reasoning topologies are represented;
- solve directions are adequately covered;
- difficulty is supported by real structural differences;
- target-exam contexts are sufficiently diverse;
- new proposed QLs mostly collapse into existing semantic fingerprints;
- duplicate and near-clone risk rises faster than coverage gain;
- runtime and explanation behavior are stable across representative seeds.

Saturation is an audit conclusion, not a numeric threshold.

### 5.4 Current checkpoint counts

Checkpoint manifests and tests may record exact current counts to prevent accidental deletion or ID drift. Such counts are **descriptive snapshots**, not design targets for future expansion.

---

## 6. Need-Based Solve-Mode Policy

### 6.1 Solve modes are discovered, not forecast

A solve mode is introduced only when an admitted QL family requires a materially distinct solution contract.

A new mode must differ in at least one of:

- authoritative equation or counting construction;
- required parameter structure;
- intermediate evidence;
- validation invariants;
- independent verification method;
- explanation flow;
- distractor semantics.

A different context or wording alone does not justify a new solve mode.

### 6.2 Reuse versus split test

Reuse an existing solve mode when:

- the same values feed the same mathematical construction;
- the same evidence structure supports the explanation;
- the same validator invariants apply;
- only entities, contexts or surface wording differ.

Create a new solve mode when forcing reuse would require optional-field sprawl, hidden branches, misleading evidence, ambiguous validation or a solver switch based on context text.

### 6.3 Current active solve modes

The modes below exist because CP-001 currently needs them:

- `countSequentialIndependentChoices`;
- `countMutuallyExclusiveAlternatives`;
- `countDisjointCasePartition`;
- `countUsingSimpleComplement`;
- `recoverMissingStageChoiceCount`.

They are an implementation snapshot. No future permutation, combination, circular, grouping or distribution modes are predeclared. Those types are added when their first approved QLs are implemented.

### 6.4 Solve-mode review checklist

Every proposed mode must document:

1. representative QLs;
2. solver formula or construction;
3. required variables;
4. evidence payload;
5. validator invariants;
6. independent verification approach, or why one is impractical;
7. explanation strategy;
8. misconception/distractor profile;
9. why an existing mode cannot own it cleanly.

---

## 7. Canonical-Problem Policy

A CP is a mathematical/runtime ownership boundary, not a folder quota.

Create a new CP only when a group of QLs shares:

- one clear conceptual mission;
- a coherent set of solver operations;
- common validator invariants;
- a recognizable exam family;
- enough distinct coverage to warrant separate audits.

Do not create a CP merely because a textbook has a heading for it. Conversely, split a CP when it accumulates unrelated authorities or branching that weakens traceability.

CP IDs are allocated at approval time. Candidate families remain unnumbered until then.

---

## 8. Runtime Architecture

Each active package follows the mature Quant V4 shape:

```text
PACKAGE/
├── archetype.md
├── canonical-problems.md
├── difficulty-framework.md
├── reasoning-patterns.md
├── implementation-plan.md
├── library-authority-map.md
├── question-language.en.json
├── task-registry.library.json
├── variable-ranges.library.json
├── constraint-profiles.library.json
├── coverage-targets.library.json
├── distribution-targets.library.json
├── explanation.en.json
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

The filenames `coverage-targets` and `distribution-targets` are retained for compatibility with Quant V4 conventions. In P&C they store the **current reviewed checkpoint contract**, not a predetermined final corpus target.

---

## 9. Library Authority

- `question-language.*.json` owns human-authored stems.
- `task-registry.library.json` owns QL-to-CP, task-kind, solve-mode, variable, constraint, explanation and distractor mappings.
- `variable-ranges.library.json` owns curated parameter pools and safety ceilings.
- `constraint-profiles.library.json` owns semantic conditions.
- `explanation.*.json` owns human explanation strategy text.
- `foundation/solver.ts` is the sole answer authority.
- reasoning evidence is produced from solver-owned intermediate values.
- explanation and option layers consume solver output; they do not recompute the answer independently.
- coverage/distribution manifests describe the current reviewed checkpoint.

Human-owned libraries must not be generated by uncontrolled noun swapping or bulk paraphrase scripts.

---

## 10. Exact Counting Math

Counting operations must preserve exact integers.

Shared helpers are introduced only as needed, including:

- exact product and sum;
- factorial;
- `nPr`;
- `nCr`;
- multinomial division;
- exact quotient validation;
- bounded inclusion–exclusion;
- grouping corrections;
- symmetry corrections.

Use `bigint` internally where intermediate products may exceed safe integer arithmetic. Display conversion must enforce a configured product-safe ceiling until the UI supports arbitrary-size answers.

A helper is not added merely because it may be useful someday.

---

## 11. Parameter Generation

Generators must be deterministic by seed and driven by the admitted QL contract.

Required properties:

- all declared placeholders resolve;
- generated values satisfy the QL’s constraint profile;
- impossible or ambiguous cases are rejected before rendering;
- answers remain exam-safe and display-safe;
- repeated seeds reproduce parameters, stem, answer, options and explanation;
- difficulty comes from structural choices, not arbitrary large numbers.

Curated profiles are preferred over random unconstrained word/digit/object inputs.

---

## 12. Solver and Evidence Contract

Each solve mode returns:

- exact answer;
- display answer;
- equation or construction summary;
- MathJax where useful;
- normalized evidence containing the decisive stage, case, invalid, block, gap, selection or symmetry counts.

Evidence must be sufficient for the explanation renderer to describe the actual generated question without duplicating mathematical logic.

Independent verification is required where bounded enumeration, search or an algebraically independent identity is practical. Where it is not practical, the limitation must be documented and compensated with stronger invariants and reference cases.

---

## 13. Explanation Architecture

Explanation strategies are also need-based.

Create a new strategy only when an existing strategy cannot truthfully explain the new evidence structure. Several solve modes may share one strategy when their reasoning flow is genuinely the same; one solve mode may require variants when explanation pedagogy materially differs.

Every explanation should state:

1. what is being counted;
2. whether order matters;
3. what constraints apply;
4. why counts are multiplied, added, subtracted or divided;
5. relevant intermediate counts;
6. the final answer in context.

No explanation may contain hardcoded numbers that are not sourced from parameters or solver evidence.

---

## 14. Distractor Architecture

Distractors should model genuine counting mistakes, such as:

- addition instead of multiplication;
- permutation versus combination confusion;
- omitted internal block order;
- overlap or missing case;
- failure to remove leading-zero outcomes;
- incorrect circular symmetry factor;
- repeated-object division omission;
- wrong gap count;
- failure to apply a compulsory/excluded-member condition;
- exact-division or factorial slip.

A new distractor profile is admitted when a new misconception appears in implemented content. Profiles are not prefilled for hypothetical future modes.

---

## 15. Difficulty Framework

Difficulty is evaluated per QL using:

- structural complexity;
- number of disjoint cases;
- constraint interaction;
- reasoning depth;
- reverse/inverse demand;
- computational effort;
- likelihood of a standard misconception.

No fixed Easy/Medium/Hard percentage is imposed on the final family. Audits instead flag unjustified skews and verify that every difficulty label is supported by actual structure.

A checkpoint may record its current difficulty distribution for regression control.

---

## 16. Audits and Quality Gates

Every checkpoint must run applicable checks for:

- JSON parse;
- QL/registry parity;
- unique active IDs;
- placeholder contract;
- unresolved rendered tokens;
- deterministic generation;
- finite positive integer answers;
- solver/independent-verifier agreement;
- option uniqueness and single correct answer;
- exact duplicate templates;
- semantic near-clones;
- mathematical fingerprints;
- context concentration;
- difficulty justification;
- explanation evidence alignment;
- runtime sampling;
- language exposure safety.

The audit asks “what remains uncovered?” rather than “have we reached a planned count?”

---

## 17. Multilingual Policy

English is implemented and reviewed first.

Hindi and Punjabi are added only after the English mathematical/runtime contract is stable. Localization must preserve:

- placeholder parity;
- mathematical semantics;
- natural exam wording;
- explanation evidence alignment;
- script and terminology quality.

Structural placeholder files must not be exposed as complete translations.

---

## 18. Checkpoint Workflow

For each next checkpoint:

1. inspect books, PYQs, current runtime and existing QLs;
2. produce a coverage-gap matrix;
3. decide whether the gap needs a new QL, solve mode, CP or package;
4. implement the smallest coherent coverage set;
5. run strict targeted typecheck and bundled tests;
6. run content/runtime audits;
7. perform manual realism review;
8. record actual counts and remaining gaps;
9. merge only when the checkpoint is internally complete.

There is no rule such as “50 QLs per CP” or “10 solve modes per package.”

---

## 19. Current Checkpoint

As of 2026-07-24:

- active package: `PNC-001`;
- active CP: `PNC-CP-001`;
- implemented English QLs: `PNC-QL-001` through `PNC-QL-048`;
- active solve modes: five, all required by current CP-001 content;
- maturity: `RUNTIME_PROOF`;
- publicly publishable: `false`;
- generation-engine routing: not added;
- Hindi/Punjabi: not implemented.

These values describe the repository now. They do not define the final chapter size.

---

## 20. Next Decision

The next step is not automatically “implement a pre-numbered CP-002 with a fixed QL range.”

The next step is to review reference books/PYQs and the current P&C motif/scenario inventory, identify the highest-value uncovered family, and then decide:

- whether it belongs inside CP-001 or requires a new CP;
- how many distinct QLs are justified;
- which solve modes are genuinely required;
- whether current runtime types should be extended;
- what evidence, validators and distractors the family needs.

That decision must be documented before implementation begins.
