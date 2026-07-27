# MAL-CP-001 Prototype Foundation Status

Status: **executable discovery foundation implemented; GitHub CI and editorial review pending**  
Branch: `feat/mal-001-cp001-prototype-foundation`  
Base: `design/mal-001-end-to-end-discovery`  
Permanent QLs: **0**  
Question Studio exposure: **disabled**  
Public publication: **disabled**

## 1. Architecture authority

This checkpoint is built on the current Quant V4 chapter pattern:

- exact typed state;
- valid-state-first deterministic generation;
- canonical solver;
- materially separate independent verifier;
- explicit prototype registry;
- misconception-labelled options;
- structured reasoning graph;
- task-specific explanation rendering;
- focused proof, structural audit and review export.

The Quant V2 Mixture & Alligation code is used only as prior art for:

- source fixtures;
- alligation diagram expectations;
- misconception ideas;
- diversity and editorial audit ideas;
- boundary-disposition evidence.

No Quant V2 motif-factory runtime, family identity or fixed count has been copied into MAL-001.

## 2. Implemented non-QL prototype contracts

The first executable-discovery set contains nine temporary contracts:

```text
MAL-CP001-PROT-RATIO-FROM-TARGET
MAL-CP001-PROT-MEAN-FROM-QUANTITIES
MAL-CP001-PROT-MEAN-FROM-RATIO
MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE
MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY
MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET
MAL-CP001-PROT-THREE-COMPONENT-MEAN
MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY
MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL
```

These are executable candidates for merge/split review. They are not QLs and do not freeze the eventual CP-001 count.

## 3. Exact mathematical foundation

### Rational arithmetic

- normalised `bigint` numerator/denominator representation;
- exact addition, subtraction, multiplication and division;
- exact comparison and equality;
- reduced rational ratios;
- fraction and MathJax formatting;
- no floating-point solver decisions.

### Blend state

For every component:

```text
quantity q_i
per-unit value v_i
weighted contribution q_i × v_i
```

The state engine derives exactly:

```text
total quantity = Σq_i
weighted total = Σ(q_i v_i)
mean value = weighted total / total quantity
```

### Canonical solver

The solver supports:

- weighted mean from two or three components;
- two-source alligation ratio;
- unknown source value;
- unknown component quantity;
- required added quantity;
- two component quantities from total quantity and target mean.

### Independent verifier

The independent verifier does not call the canonical solver or trust its explanation/options. It reconstructs:

- direct weighted totals;
- target balance;
- positivity and uniqueness coefficients;
- source-ratio balance;
- total-quantity equality;
- final target-mean equality.

For the alligation shortcut, the verifier substitutes the reported ratio into the direct weighted equation.

## 4. Generation and language

The parameter generator constructs a complete valid hidden blend first, then derives the displayed target and hides only the requested unknown.

Current approved discovery contexts:

- rice grades;
- tea leaves;
- coffee beans;
- edible oil grades;
- wheat grades.

Every prototype reaches all five contexts. Four English stem phrasings are available per task family, while values, quantities, source ordering and answer positions vary deterministically by seed. The valid-state generator rejects awkward mixed-fraction price states and constructs integral per-unit values instead of rounding them at presentation time.

## 5. Options and explanations

Each question has:

- four visibly and mathematically unique options;
- exactly one correct result;
- three explicit misconception labels;
- deterministic correct-answer placement;
- a task-specific explanation;
- exact MathJax working;
- direct final-state verification;
- one genuine Common Trap statement;
- a structured reasoning graph.

Implemented misconception families include:

- reversed alligation ratio;
- same-side rather than cross differences;
- simple average instead of weighted mean;
- swapped quantities;
- known source or quantity reported;
- target value reported;
- omitted third component;
- equal split assumed;
- total quantity reported;
- plausible scale error.

Alligation-cross data is emitted only for tasks where it is instructionally useful.

## 6. Local exact validation

### Runtime proof

```text
9 prototypes × 120 seeds = 1,080 generated cases
```

Passed locally:

- deterministic regeneration;
- canonical solver and independent verifier agreement;
- four unique options and exactly one correct label;
- all four answer positions for every prototype;
- all three difficulty bands reached;
- at least 116 distinct stems and mathematical fingerprints for every 120-case prototype run;
- no permanent QL identity;
- no Question Studio or publication exposure.

### Structural/editorial audit

```text
9 prototypes × 80 seeds = 720 generated cases
```

Observed locally:

```text
Easy:   240
Medium: 400
Hard:   80
Alligation diagrams: 160
Fractional-answer cases: 0
Maximum repeated five-word opening: 21
```

All five approved contexts were reached by every prototype. The audit also passed ownership-leakage, generic-explanation, exact-verification, option-contract, learner-facing grammar, integral-display and safety checks.

These figures describe the generated discovery space. They are not difficulty quotas or QL allocations.

## 7. Review artifact

The exporter produces:

```text
dist/quant-v4/mal-001-cp001-prototype-review.json
dist/quant-v4/mal-001-cp001-prototype-review.md
```

The pack contains 36 questions: four deterministic examples for each prototype contract.

## 8. Deliberately not implemented

- permanent `MAL-QL-*` IDs;
- frozen solve-mode count;
- Hindi or Punjabi generation;
- Question Studio registration;
- Question Bank writes;
- test eligibility;
- student/public routing;
- production SVG renderer;
- CP-002 through CP-006 runtime work.

## 9. Next review gates

1. GitHub exact-head CI;
2. inspect the 36-question English review pack;
3. classify each prototype as retain, merge, split, defer or reassign;
4. recover official/source fixtures for boundary-sensitive cases;
5. run inverse, representation and source-format gap audits;
6. add any genuinely missing prototype contract;
7. freeze CP-001 QLs only after the final gap audit and manual approval.
