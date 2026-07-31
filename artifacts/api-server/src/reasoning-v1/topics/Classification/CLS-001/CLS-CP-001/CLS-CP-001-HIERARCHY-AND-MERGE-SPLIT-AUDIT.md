# CLS-CP-001 — Hierarchy, Ambiguity and Merge/Split Audit

Status: `EXECUTABLE_DISCOVERY_WAVE_2`

This audit evaluates the first seven non-permanent `CLS-CP-001` prototypes after introducing semantic hierarchy, inherited class membership, cross-cutting membership and adversarial ambiguity rejection.

It does **not** allocate permanent QLs or freeze solve modes.

---

## 1. Why the first flat dataset was insufficient

The first executable foundation proved deterministic construction, independent solving and option integrity, but every entity belonged to exactly one class. That made the questions logically clean yet substantially easier than real Classification questions.

Competitive-exam semantic classification also contains cases where:

- three items share a narrower class although all four share a broader class;
- one item belongs to more than one defensible class;
- biological class, habitat and movement overlap;
- a broad rule is true but cannot identify an outlier;
- two equally credible rules identify different outliers and the question must be rejected.

The v2 dataset and runtime now model those situations directly.

---

## 2. Source-backed task boundary

The reviewed Classification material repeatedly supports these student tasks:

1. choose the word/entity different from the other three;
2. choose the word-pair whose internal relation differs;
3. choose the number, pair, set or letter group that differs;
4. occasionally identify the item that can join a supplied class.

`CLS-CP-001` owns only semantic single-entity classification and semantic class-member selection.

The following remain outside this checkpoint:

- semantic relationship-pair classification → `CLS-CP-002`;
- word spelling and structural classification → `CLS-CP-003`;
- number and number-pair classification → `CLS-CP-004/005`;
- alphabet and cluster classification → `CLS-CP-006/007`;
- figure classification → separate non-verbal chapter;
- source-to-target rule transfer → Analogy;
- next-term prediction → Series.

---

## 3. Dataset v2 authority

Dataset version:

```text
CLS-CP001-SEMANTIC-EN-v2
```

The dataset now records:

- direct class membership;
- inherited parent-class membership;
- hierarchy depth;
- rule-quality rank;
- contrast group;
- surface kind;
- factual-risk level;
- class explanation, shortcut and trap;
- unique normalized entity identity.

### Hierarchy examples

```text
food items
  -> fruits
       -> citrus fruits
       -> tropical fruits
  -> vegetables
  -> cereals
  -> spices
```

```text
plants
  -> flowers
  -> trees
```

```text
animals
  -> birds
  -> mammals
  -> aquatic animals
  -> animals capable of flight
```

The animal branches deliberately overlap. A whale is both a mammal and aquatic; a duck is both a bird and aquatic; a bat is both a mammal and capable of flight.

---

## 4. Ambiguity policy proven executably

### 4.1 Narrower rule may win

Example state:

```text
Orange, Lemon, Lime, Carrot
```

Admitted support:

- `food items` supports all four and therefore produces no outlier;
- `fruits` supports the first three and points to Carrot;
- `citrus fruits` supports the first three and also points to Carrot.

The narrower, source-backed `citrus fruits` rule wins because it has greater quality and hierarchy depth, while every winning rule still identifies the same option.

### 4.2 Equal competing rules with different answers must be rejected

Example state:

```text
Whale, Dolphin, Duck, Bat
```

- `mammals` identifies Duck as the outlier;
- `aquatic animals` identifies Bat as the outlier.

The two rules have equal admitted quality and identify different options. The audit result is therefore:

```text
AMBIGUOUS
```

No generated question may emit this state.

### 4.3 Broad rule covering all options creates no answer

Example state:

```text
Apple, Carrot, Wheat, Cumin
```

All four are food items, while each belongs to a different narrow class. No admitted rule supports exactly three options. The result is:

```text
NO_VALID_RULE
```

---

## 5. Prototype disposition

| Prototype | Discovery purpose | Solver contract | Decision |
|---|---|---|---|
| `CLS-CP001-PROT-001` | direct semantic category outlier | find the unique displayed entity outside the winning class | `MERGE_AS_INSTANCE_VARIANT` |
| `CLS-CP001-PROT-002` | primary-function outlier | same four-entity outlier solver | `MERGE_AS_INSTANCE_VARIANT` |
| `CLS-CP001-PROT-003` | part/system-membership outlier | same four-entity outlier solver | `MERGE_AS_INSTANCE_VARIANT` |
| `CLS-CP001-PROT-004` | select another member of a supplied class | resolve the supplied class, then find the unique joining option | `RETAIN_PROVISIONALLY` |
| `CLS-CP001-PROT-005` | narrower class inside a shared parent class | same four-entity outlier solver with hierarchy-aware rule competition | `MERGE_AS_DIFFICULTY_VARIANT` |
| `CLS-CP001-PROT-006` | cross-cutting multi-membership outlier | same four-entity outlier solver with ambiguity rejection | `MERGE_AS_DIFFICULTY_VARIANT` |
| `CLS-CP001-PROT-007` | select member of the narrowest shared class | same class-member solver with hierarchy resolution | `MERGE_AS_DIFFICULTY_VARIANT` |

### Provisional solver-contract result

Executable evidence currently supports **two** materially different student tasks:

```text
FIND_SEMANTIC_OUTLIER_FROM_FOUR
SELECT_MEMBER_OF_SHARED_SEMANTIC_CLASS
```

This is not a permanent QL allocation. It is a merge/split finding only.

Semantic domain does not justify separate QLs for:

- fruit versus animal;
- category versus primary function;
- part/whole versus ordinary class;
- easy flat membership versus hard hierarchy membership;
- clean sibling classes versus cross-cutting classes;
- broad-versus-narrow competition;
- correct-answer position;
- wording template.

Those are generated-instance properties under the same solver contract.

---

## 6. Why the two tasks are not merged

Direct outlier and class-member selection differ materially:

### Direct outlier

```text
four displayed options
  -> enumerate admitted classes
  -> find classes supporting exactly three
  -> rank competing rules
  -> return the unmatched displayed option
```

### Class-member selection

```text
given member group
  -> resolve the narrowest unique shared class
  -> test answer options against that class
  -> return the sole joining option
```

They differ in:

- premise structure;
- answer semantics;
- independent-solver route;
- ambiguity conditions;
- explanation flow;
- misconception pattern.

They therefore remain separate provisional contracts.

---

## 7. Generator safeguards added in wave 2

The runtime now:

1. selects an intended class and a viable contrast class;
2. uses members exclusive to the intended/contrast pair for canonical construction;
3. reconstructs membership from displayed labels;
4. enumerates the full bounded eligible class universe;
5. ranks support by curated quality and hierarchy depth;
6. rejects equal-quality rules that identify different answers;
7. retries deterministically until a valid state is found;
8. rejects if canonical and independent solvers disagree;
9. emits hierarchy-aware teacher explanations;
10. preserves all discovery and publication locks.

The retry loop is not permission to search indefinitely. It is bounded and deterministic. Failure to find a valid state within the fixed attempt limit is a hard runtime error.

---

## 8. Difficulty finding

Difficulty is an instance property rather than a new QL.

Primary levers now include:

- hierarchy depth;
- whether all four share a broad parent class;
- number of direct and inherited memberships;
- number of admitted competing classes;
- closeness of sibling classes;
- whether the intended rule is taxonomic, functional or cross-cutting;
- whether the task is direct outlier or inverse member selection.

`PROT-005`, `PROT-006` and `PROT-007` are retained only as discovery controls for these harder states. They are not evidence for three additional QLs.

---

## 9. Localization decision

The solver state is locale-neutral, but semantic labels are not safely literal-translatable in every case.

Current classification:

```text
Logic: LANGUAGE_ADAPTED
Entity datasets: separately curated per locale
Class hierarchy: parity required
Correct answer: semantic parity required
Difficulty: parity required
```

Hindi and Punjabi must not be produced by replacing English words after generation. Each locale needs:

- natural class labels;
- natural item labels;
- collision and polysemy review;
- script-safe normalization;
- independent semantic membership audit;
- source/editorial approval.

Localization is not started by this audit.

---

## 10. Remaining blockers before permanent allocation

Permanent `CLS-QL-*` allocation remains prohibited until all of the following close:

- broader source saturation across SSC, Banking and Punjab material;
- exact recurrence audit for class-member selection;
- semantic fact-by-fact editorial review;
- polysemy and locale-risk audit;
- CP-001 versus CP-002 semantic pair boundary closure;
- inverse and representation gap audit;
- large English review approval;
- Hindi and Punjabi dataset strategy;
- final no-new-contract gap decision.

Current lifecycle remains:

```text
Permanent QLs:             0
Frozen solve modes:        0
Temporary prototypes:      7
Question Studio:           disabled
Question Bank:             disabled
Test eligibility:          disabled
Public publication:        disabled
```
