# MAL-CP-001 Executable Discovery Plan

Working title: **Component Blending to or from a Target Mean**  
Status: **prototype discovery only**  
Permanent QLs: **0**  
Fixed solve modes: **0**

## 1. Purpose

MAL-CP-001 is the first pipeline proof for MAL-001. It must establish the shared exact mathematical model and prove which component-blending task contracts are materially distinct before any permanent QL identity is created.

The checkpoint is not complete merely because the alligation formula can generate questions. It must prove forward, inverse, multi-component, representation and misconception coverage across realistic competitive-exam forms.

## 2. Ownership boundary

MAL-CP-001 owns a question only when all of the following are true:

1. two or more components have measurable per-unit values or concentrations;
2. their quantities determine a blended mean through weighted conservation;
3. the requested answer depends essentially on that blend relation;
4. no repeated fractional replacement occurs;
5. no single-component add/remove ratio adjustment is the main task;
6. no inter-vessel transfer ledger is required;
7. no transaction-profit objective is primary.

### Included working contexts

- two grades of rice, tea, wheat, oil or fuel;
- solutions with lower and higher concentration when the task is direct blending;
- metal/alloy component values when no Physics-specific density law is needed;
- generic lower/higher quality index;
- controlled price-per-unit blends where the target is the mixture's mean price.

### Excluded or delegated

```text
General weighted average without mixture composition → AVG
Add/remove one component to alter an existing ratio → MAL-CP-002 hypothesis
Repeated replacement → MAL-CP-003 hypothesis
Evaporation/fresh-dry conserved solute → MAL-CP-004 hypothesis
Adulteration profit → MAL-CP-005 hypothesis
Inter-vessel transfer → MAL-CP-006 hypothesis
False weight or short measure → PNL
```

## 3. Canonical state model

The production solver must operate on exact rational state, not wording-specific variables.

For components `i = 1..n`:

```text
value_i    = per-unit value or concentration
quantity_i = amount of the component
weighted_i = value_i × quantity_i

Total quantity = Σ quantity_i
Total weighted value = Σ weighted_i
Mean = Total weighted value / Total quantity
```

For the two-component alligation form where `L < M < H`:

```text
quantity_low : quantity_high = (H − M) : (M − L)
```

The alligation cross is a derived shortcut. The independent verifier must reconstruct the result from direct weighted conservation rather than calling the cross helper.

## 4. Candidate task-contract space

The following are prototype candidates, not frozen solve modes.

### Forward and direct contracts

- ratio from two source values and target mean;
- target mean from two source values and their ratio;
- target mean from two source values and explicit quantities;
- total mixture value or total cost from component quantities;
- one component quantity from ratio and total quantity;
- one component quantity from the other quantity and the blend ratio.

### Inverse contracts

- lower source value from higher value, mean and ratio;
- higher source value from lower value, mean and ratio;
- one source value from the other source, mean and explicit quantities;
- missing component quantity from mean and all other component states;
- missing target mean implied by a required quantity relation;
- original ratio from a later stated blend condition where no CP-002 add/remove state is involved.

### Multi-component contracts

- mean from three or more explicit components;
- missing quantity in a three-component blend;
- missing source value in a three-component blend;
- combine a pre-blended mixture with another component;
- combine two known mixtures into a final target mean;
- choose the required quantity of a third component for a target mean.

### Structural and representation contracts

- direct numerical statement;
- compact table of components, quantities and values;
- two-stage blend ledger;
- statement-pair/Data Sufficiency presentation only if chapter authority permits and the arithmetic contract remains MAL-owned;
- exact ratio answer;
- exact quantity answer;
- exact price/value answer;
- percentage concentration answer;
- impossible or indeterminate state detection only when supported by source evidence.

## 5. Merge/split questions to resolve

Executable prototypes must answer these before QL allocation:

1. Are ratio-from-mean and quantity-from-total one contract with different answer semantics, or distinct learner tasks?
2. Do lower-source and higher-source inverse questions share one parameterised contract?
3. Does mean-from-ratio materially differ from mean-from-explicit-quantities?
4. Is three-component blending one scalable state contract or several distinct contracts by unknown position?
5. Does two-stage blending require its own solve contract or only a harder topology within multi-component blending?
6. Are concentration percentages merely a value-unit variation here, or should all concentration blending be owned by CP-004?
7. When does a price blend become a general Average question rather than MAL?
8. Is a table representation a new QL only when evidence parsing changes, or merely a renderer variant?

No candidate survives solely because it has different nouns, different units, or the unknown appears in a different sentence position.

## 6. Exact parameter-generation rules

The generator must construct valid state first and derive the displayed unknown second.

Required invariants:

- all quantities are positive unless an explicit boundary prototype tests zero;
- source values are distinct where alligation is required;
- the target mean lies strictly between source values for a positive two-component ratio;
- generated ratios are reduced exactly;
- all displayed values round-trip to the hidden exact state;
- no accidental equal-source or equal-quantity shortcut unless intentionally testing it;
- no ugly decimal is hidden by formatting;
- currency values are exact and use realistic per-unit scales;
- concentration values remain physically valid;
- multi-stage blends conserve total weighted value at every stage;
- inverse questions have a unique admissible answer.

Preferred construction strategy:

```text
choose reduced quantity ratio
→ choose source values
→ derive exact mean
→ optionally scale quantities
→ choose the requested unknown
→ hide that field
→ verify unique reconstruction
```

For reverse source-value prototypes:

```text
choose valid source values and ratio first
→ derive mean
→ hide exactly one source value
→ independently solve and round-trip
```

## 7. Solver and verifier separation

### Canonical solver

May use:

- exact rational arithmetic;
- alligation cross;
- weighted conservation equations;
- bounded linear reconstruction for multi-component states.

### Independent verifier

Must not reuse:

- the canonical solve function;
- the alligation-cross helper;
- explanation working values;
- distractor calculations;
- correct option index;
- canonical answer formatting.

It should independently:

1. reconstruct the displayed state;
2. write the weighted-total equation;
3. solve the requested unknown;
4. verify physical admissibility;
5. verify uniqueness;
6. compare the exact canonical answer.

## 8. Explanation architecture

Every prototype explanation must visibly teach the decisive conservation relation.

### Two-component alligation explanation

1. identify lower value, target mean and higher value;
2. render the alligation cross;
3. calculate both cross-differences with substituted numbers;
4. state which difference belongs to which component;
5. reduce the ratio;
6. convert the ratio to the requested quantity when necessary;
7. verify by weighted mean;
8. conclude in the context of the question.

### Weighted-mean explanation

1. calculate each component's weighted contribution;
2. add the contributions;
3. add the quantities;
4. divide exact totals;
5. state the final mean or reconstruct the unknown;
6. perform a direct balance check.

### Inverse explanation

1. state the conservation equation;
2. substitute every known value;
3. isolate the unknown visibly;
4. verify the recovered source/quantity by rebuilding the mean;
5. conclude with the requested semantic and unit.

A shortcut section must add a genuinely faster exam method; it must not repeat the full explanation in shorter prose.

## 9. Diagram contract

Alligation-cross questions should provide an accessible diagram containing:

- lower source value;
- higher source value;
- target mean;
- opposite cross-differences;
- component labels;
- final reduced ratio.

The diagram must remain correct if:

- component order is swapped;
- the lower/higher source is expressed as concentration rather than price;
- the answer asks for a quantity rather than the ratio;
- long commodity labels are used.

The text explanation must remain complete without depending on the diagram.

## 10. Misconception inventory

Prototype options should be generated from explicit, labelled errors such as:

- same-side differences instead of cross-differences;
- reversed component ownership of the cross-differences;
- using `H − L` as one ratio part;
- simple averaging despite unequal quantities;
- averaging ratios or percentages directly;
- using quantity ratio in the wrong orientation;
- forgetting to reduce the ratio;
- assigning total quantity to one component;
- subtracting weighted contributions incorrectly;
- dividing weighted total by the number of components rather than total quantity;
- using the target mean as a quantity;
- solving the inverse equation with the wrong sign;
- taking the final mixture quantity as unchanged in a two-stage blend.

Every generated package must contain four canonically unique options and exactly one correct answer. Each distractor must be traceable to one declared misconception strategy.

## 11. Difficulty evidence

### Easy indicators

- direct two-component ratio;
- direct mean from a simple ratio;
- one relation and one arithmetic step after the cross;
- clean integral or small rational result.

### Medium indicators

- inverse source value;
- explicit quantities rather than a ready ratio;
- one extra conversion from ratio to quantity;
- three components with one direct unknown;
- table interpretation.

### Hard indicators

- two-stage or compound blending;
- multiple unknown-looking values with one uniquely recoverable target;
- reverse multi-component reconstruction;
- coupled exact constraints;
- non-obvious ownership boundary requiring selection of the conserved state.

Difficulty is assigned from generated instance features, not from the prototype's position in this document.

## 12. Prototype proof matrix

Before merge/split decisions, every candidate contract must be tested across enough seeds to demonstrate:

- deterministic regeneration;
- exact solver/verifier agreement;
- unique admissible answer;
- all supported answer semantics;
- all intended context domains;
- all answer positions;
- parameter-state diversity;
- natural stem diversity;
- misconception reachability;
- explanation-state agreement;
- diagram-state agreement where applicable.

Initial discovery target:

```text
at least 120 seeds per prototype topology
```

This is a proof sample, not a QL count or production corpus target.

## 13. Required discovery outputs

```text
MAL-CP-001 prototype contract registry
MAL-CP-001 source/format ledger
MAL-CP-001 executable prototype generator
MAL-CP-001 canonical solver
MAL-CP-001 independent verifier
MAL-CP-001 topology and merge/split audit
MAL-CP-001 English language catalogue
MAL-CP-001 explanation/diagram audit
MAL-CP-001 misconception-option audit
MAL-CP-001 generated review pack
MAL-CP-001 final gap audit
MAL-CP-001 allocation proposal
```

The allocation proposal may recommend zero, one or multiple permanent QLs per prototype family. It must explain structural uniqueness rather than target a predetermined total.

## 14. Safety boundary

During discovery:

```text
permanentQlId: null
prototypeOnly: true
reviewStatus: DISCOVERY
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
supportedLanguages: ["en"] only after English prototype text exists
```

No Question Studio, Question Bank, mock-test or student route is enabled by this checkpoint.

## 15. Immediate implementation order

1. build the exact rational and weighted-state foundation;
2. recover and classify the relevant Quant V2 CP-001 families;
3. implement the direct two-component ratio prototype;
4. add independent weighted-equation verification;
5. add natural English scenarios and the alligation diagram;
6. add labelled misconception options;
7. expand to forward and inverse prototype candidates;
8. add multi-component and two-stage candidates;
9. run merge/split, ownership and final gap audits;
10. seek approval before allocating any `MAL-QL-*` identities.