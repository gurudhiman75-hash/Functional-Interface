# MAL-001 — Mixture, Alligation and Conserved-Quantity Systems

Status: **end-to-end design hypothesis under executable discovery**  
Subtopic: **Arithmetic → Mixture & Alligation**  
Permanent QLs: **0**  
Frozen CPs: **0**  
Frozen solve modes: **0**

This document defines the intended chapter architecture from mathematical state through Question Studio review. It does not freeze QL counts, solve-mode counts, difficulty quotas or permanent ranges. Where the older plan prescribed fixed totals, `MAL-001-OPEN-QL-DISCOVERY-AMENDMENT.md` is authoritative.

---

## 1. Chapter purpose

MAL-001 should teach and generate questions around one central decision:

```text
Which component quantity or weighted contribution is conserved,
and how does that constrain the final mixture?
```

The chapter is not a catalogue of milk, tea, rice, alloy and solution stories. Those are context domains. The underlying content is a small set of mathematical state transitions:

- weighted blending;
- one-step component adjustment;
- repeated fractional retention;
- conserved-solute transformation;
- adulteration-profit coupling;
- multi-vessel transfer bookkeeping.

A new context does not create a new canonical problem or QL unless it changes the evidence, mathematical state, requested task or learner reasoning.

## 2. Single-package decision

The working decision is one package:

```text
MAL-001
```

Even the hardest transfer questions remain applications of component conservation rather than a separate arithmetic domain. This single-package decision remains reviewable until executable chapter-wide discovery confirms that the six working domains cover the topic without an unmanageable shared contract.

## 3. Core mathematics

### 3.1 Weighted blend

For components `i = 1..n`:

```text
Total quantity       = Σ q_i
Total component load = Σ(q_i × v_i)
Final mean/value     = Σ(q_i × v_i) / Σ q_i
```

The `v_i` value may represent:

- price per unit;
- concentration fraction;
- quality index;
- component proportion;
- another linearly blendable per-unit value.

### 3.2 Alligation cross

For lower value `L`, target mean `M` and higher value `H`, where `L < M < H`:

```text
quantity at L : quantity at H = (H − M) : (M − L)
```

The cross is a shortcut derived from weighted conservation. It is not a separate law and must always be independently verifiable from direct component totals.

### 3.3 One-step ratio adjustment

For two substances `A:B = a:b`, choose a convenient scale `k`:

```text
A = ak
B = bk
```

When only one substance changes, the other is conserved and the target ratio determines the new quantity.

### 3.4 Repeated replacement

For vessel volume `V`, amount removed per identical operation `r`, and `n` operations:

```text
original component remaining = initial amount × (1 − r/V)^n
```

For unequal removals:

```text
remaining fraction = Π(1 − r_i/V_i_before_operation)
```

The state must explicitly confirm whether volume returns to the same level after every replacement.

### 3.5 Conserved-solute transformation

```text
solute amount before = solute amount after
```

Examples:

- water added to dilute;
- water evaporated to concentrate;
- pure solute added;
- wet material dried while solid matter remains;
- two known solutions blended.

### 3.6 Adulteration profit

For a blend sold under a stated price policy:

```text
actual cost = Σ(component quantity × component cost)
revenue     = sold quantity × selling rate
profit/loss = revenue − actual cost
```

Profit percentage uses the actual mixture cost base. False weight alone is outside MAL and belongs to PNL.

### 3.7 Vessel transfer ledger

For each vessel and each stage, track:

```text
total volume
component-A amount
component-B amount = total − component-A
```

A transferred sample has the source vessel's current composition at the instant of transfer. Every stage must reconcile both total volume and component totals.

---

## 4. Provisional canonical-problem domains

These are working boundaries, not frozen allocations.

### MAL-CP-001 hypothesis — Component blending to or from a target mean

Owns direct and inverse weighted blending where the principal state is the mean of two or more components.

Candidate tasks include:

- ratio from source values and mean;
- mean from ratio or quantities;
- missing source value;
- missing quantity;
- three-component blend;
- two-stage or compound blend;
- reverse alligation.

Collision tests:

- general weighted mean versus AVG;
- concentration mixing versus CP-004;
- simple vessel combination versus CP-006;
- commercial selling-price objective versus PNL/CP-005.

### MAL-CP-002 hypothesis — Two-substance ratio adjustment

Owns one-step addition, removal or replacement where one component is held fixed and the other is reconstructed around a target composition.

Candidate tasks include:

- add water or milk for a target ratio;
- remove one substance for a target ratio;
- resulting ratio after addition/removal;
- original ratio from a final state;
- component amount from a known mixture ratio.

Collision tests:

- single replacement versus repeated replacement in CP-003;
- percentage concentration versus CP-004;
- pure ratio arithmetic versus RAP.

### MAL-CP-003 hypothesis — Repeated fractional replacement

Owns repeated removal-and-refill operations whose key reasoning is geometric retention over stages.

Candidate tasks include:

- final original quantity;
- original quantity from final state;
- amount/fraction removed per operation;
- number of operations;
- unequal replacement fractions;
- replacement with a third liquid;
- stage-dependent vessel volume where explicitly supported.

Single-step replacement must not remain here merely because the legacy family name says `replacement`.

### MAL-CP-004 hypothesis — Conserved-solute transformations

Owns concentration and wet/dry transformations where a solute, dry matter or other non-water component is invariant or explicitly tracked.

Candidate tasks include:

- dilution by adding solvent;
- strengthening by adding pure substance;
- evaporation;
- fresh-to-dry or wet-to-dry conversion;
- concentration from component amount;
- two- and three-solution blending if executable ownership shows that concentration semantics materially change the learner task.

Collision tests:

- direct weighted concentration blend versus CP-001;
- repeated dilution versus CP-003;
- vessel equilibrium versus CP-006.

### MAL-CP-005 hypothesis — Dishonest adulteration by mixing

Owns profit/loss tasks only when the commercial outcome is caused by mixture composition.

Candidate tasks include:

- profit from adding a free adulterant;
- profit from adding a cheaper impurity;
- adulteration ratio for target profit;
- effective cost and selling rate of a blend;
- controlled mixed cases with discount/markup only after ownership is explicit.

Excluded:

- false weight;
- short measure;
- price fraud without composition;
- general CP/MP/SP chains.

Those belong to PNL.

### MAL-CP-006 hypothesis — Multi-vessel transfer and equalisation

Owns questions requiring an explicit vessel-by-vessel, stage-by-stage ledger.

Candidate tasks include:

- transfer from one vessel to another;
- transfer and return;
- equalisation;
- chained transfers;
- repeated transfer with current-composition sampling;
- final composition of each vessel;
- unknown transfer quantity for a target state.

Simple combination of two vessels may collapse to CP-001 and must not be duplicated here.

---

## 5. Answer semantics

Each prototype and future registry entry must declare an exact answer semantic, not merely a primitive type.

Possible semantics include:

```text
component ratio
mixture ratio
source value
final mean value
component quantity
total mixture quantity
concentration fraction
concentration percentage
retained fraction
number of replacement operations
transfer quantity
final component amount
profit/loss amount
profit/loss percentage
selling rate
```

The semantic determines:

- solver normalisation;
- display formatting;
- option domain;
- unit policy;
- explanation conclusion;
- independent-verifier comparison.

## 6. Exact arithmetic and display policy

### 6.1 Internal representation

Use exact rational arithmetic for:

- ratios;
- percentages;
- concentrations;
- per-unit values;
- replacement factors;
- weighted totals;
- profit factors.

Do not store one-third as `33.33` or compare floating results with loose tolerances.

### 6.2 Display

Prefer:

- reduced ratios;
- integers where naturally obtainable;
- exact fractions when exam-realistic;
- terminating decimals only when the context convention supports them;
- percentages with an explicit rounding instruction when approximation is unavoidable.

Never round intermediate state and then use the rounded value to calculate the answer.

### 6.3 Currency

Internally store exact minor units or exact rational per-unit prices. Avoid ugly currency decimals by valid-state construction rather than presentation masking.

## 7. Parameter-generation contract

Every generator should be valid-state-first:

```text
construct a physically and mathematically valid hidden state
→ derive all dependent values exactly
→ choose the requested unknown
→ hide only the required evidence
→ independently prove uniqueness
→ render the student-facing question
```

Universal generation guards:

- positive quantities;
- physically valid percentages;
- valid target means;
- no accidental zero denominators;
- no undefined or multiple answers unless that predicate is intentional;
- exact unit compatibility;
- no impossible removal or transfer;
- no concentration above 100%;
- no negative component amount;
- no hidden dependence on rounded values;
- no rejection-loop collapse to a tiny safe pool;
- deterministic regeneration from the same seed.

## 8. Runtime architecture

One implementation source of truth:

```text
foundation/types.ts
foundation/rational.ts
foundation/state-model.ts
foundation/library.ts
foundation/parameter-generator.ts
foundation/solver.ts
foundation/independent-verifier.ts
foundation/reasoning-graph.ts
foundation/explanation-renderer.ts
foundation/diagram-renderer.ts
foundation/distractor-engine.ts
foundation/validator.ts
foundation/coverage-auditor.ts
foundation/pipeline.ts
index.ts
```

Checkpoint-local prototype directories may contain topology generators and audits, but shared mathematical logic must not be duplicated.

## 9. Human-owned libraries

```text
task-registry.library.json
question-language.en.json
question-language.hi.json
question-language.pa.json
variable-ranges.library.json
scenario-domains.library.json
distractor-strategy.library.json
explanation-strategy.library.json
coverage-ledger.md
```

Every future permanent QL registry row must include:

```text
QL ID
CP owner
task direction
unknown variable
answer semantic
required evidence
state topology
context domains
difficulty evidence
explanation strategy
diagram strategy
distractor strategies
unit/display policy
structural uniqueness rationale
review status
```

## 10. Solver and independent verifier

The canonical solver may use chapter shortcuts. The independent verifier must reconstruct the answer through a materially separate route.

Examples:

```text
CP-001 solver: alligation cross
CP-001 verifier: direct weighted-total equation

CP-002 solver: conserved-component ratio equation
CP-002 verifier: reconstruct both component amounts and target ratio

CP-003 solver: retention-product formula
CP-003 verifier: stage-by-stage component simulation

CP-004 solver: conserved-solute equation
CP-004 verifier: full before/after component ledger

CP-005 solver: effective blend-cost model
CP-005 verifier: direct component-cost and revenue totals

CP-006 solver: transfer ledger engine
CP-006 verifier: independent stage simulation and mass-balance checks
```

Neither route may trust the option index or explanation output.

## 11. Reasoning graph

Each generated candidate should emit a structured reasoning graph with nodes for:

- given facts;
- derived component quantities;
- conservation equations;
- stage transitions;
- target reconstruction;
- verification;
- conclusion.

This graph should support:

- explanation rendering;
- audit traceability;
- reviewer diagnostics;
- later solution-step UI;
- mismatch detection between solver and prose.

## 12. Explanation design

Explanations must be task-family-specific and value-specific.

### Required structure

1. identify the decisive invariant or blend relation;
2. map each displayed value to its role;
3. substitute actual values;
4. calculate intermediate component amounts or differences;
5. solve the requested unknown;
6. verify the final mixture or stage state;
7. state the answer in context;
8. name one genuine common trap when useful.

Forbidden explanation behaviour:

- generic shells that could fit any arithmetic topic;
- formula-only output;
- unexplained cross-difference orientation;
- skipping the conserved component;
- silently changing units;
- ending with an option letter instead of the semantic answer;
- repeating one explanation structure across materially different tasks.

## 13. Diagram policy

Diagrams are required only where they teach necessary structure.

### CP-001

Alligation cross showing source values, target mean, opposite differences and ratio ownership.

### CP-002

Before/after component bars or a concise vessel composition ledger when ratio conservation is otherwise hard to see.

### CP-003

Stage strip showing retained fraction after each operation.

### CP-004

Before/after solute-water ledger; wet/dry solid-content bar where appropriate.

### CP-005

Blend-cost ledger rather than decorative shop imagery.

### CP-006

Two-vessel or multi-vessel stage diagram with transfer arrows and component amounts.

The text explanation must remain complete without the diagram. Renderers must be collision-safe for long labels and localisation.

## 14. Distractor architecture

Every wrong option must be produced by an explicit misconception strategy and independently verified as wrong.

Common chapter-wide traps include:

- reversing alligation ratio ownership;
- using same-side rather than cross differences;
- simple average instead of weighted mean;
- averaging percentages directly;
- conserving the wrong component;
- treating removed mixture as pure component;
- applying one replacement factor instead of `n` factors;
- using amount removed divided by remaining volume;
- applying target percentage to the wrong total;
- ignoring evaporation's unchanged solute;
- calculating adulteration profit on selling price instead of actual cost;
- treating free water as having milk's cost;
- transferring the source vessel's original rather than current composition;
- failing to reduce a ratio;
- unit mismatch;
- rounding before the final step.

Required package invariant:

```text
four canonically unique options
exactly one correct answer
each distractor traceable to a declared strategy
no random numeric filler
```

## 15. Difficulty model

Difficulty must be derived from generated instance features.

Candidate features:

- direct versus inverse task;
- number of components;
- number of stages;
- number of independently necessary equations;
- whether component identity is obvious;
- whether the target mean is directly stated;
- representation parsing burden;
- exact arithmetic complexity;
- transfer bookkeeping depth;
- need to combine mixture and commercial reasoning;
- presence of coupled constraints.

No fixed chapter difficulty percentage is authoritative.

## 16. Context-domain policy

Context diversity should demonstrate transfer of learning without creating motif inflation.

Potential domains:

- grains and food grades;
- tea, coffee and spices;
- milk and water;
- acid, alcohol and other solutions;
- oil and fuel blends;
- alloys;
- wet/dry agricultural material;
- industrial batches;
- neutral abstract components for clean mathematical variants.

Rules:

- nouns alone do not create QLs;
- every context must be physically coherent;
- avoid arbitrary chemistry, density or tax claims;
- names and narrative details must not obscure the arithmetic;
- repeated context openings are audited;
- domain caps are measured after QL discovery, not used to force new identities.

## 17. Language architecture

English is first.

Hindi and Punjabi design requirements:

- native, natural exam phrasing;
- exact token and answer parity;
- correct mathematical terminology;
- no literal or overly technical translation where everyday wording is clearer;
- localised units and sentence grammar;
- diagram label fit;
- separate human review.

Until authored and approved:

```text
question-language.hi.json → schema/pending only
question-language.pa.json → schema/pending only
runtime request → explicit unsupported-language rejection
```

## 18. Question Studio contract

Discovery prototypes remain hidden.

A future review package should expose:

```text
package
CP
QL/prototype identity
task contract
solve mode if frozen
difficulty and evidence
language
seed
stem
options
correct answer
explanation
diagram
parameter fingerprint
mathematical-state fingerprint
misconception labels
validation results
review status
```

No Question Bank write, test assembly or publication occurs automatically from generation.

## 19. Validation gates

### Universal

- deterministic regeneration;
- exact solver/verifier agreement;
- unique admissible answer;
- valid correct index;
- four unique options;
- answer semantic and unit alignment;
- no placeholders, NaN or Infinity;
- no malformed MathJax;
- no raw implementation metadata in student payload;
- no unsupported language fallback.

### Mathematical

- component totals reconcile;
- mean lies within valid bounds;
- ratio orientation is correct;
- replacement factors use the correct stage volumes;
- solute conservation holds;
- actual mixture cost is complete;
- transfer ledgers conserve each component;
- reverse questions round-trip.

### Editorial

- complete question ask;
- natural competitive-exam wording;
- no robotic opening;
- no generic explanation filler;
- actual substituted values present;
- decisive calculation shown;
- contextual conclusion present;
- diagram and text agree;
- shortcut is genuinely distinct.

### Diversity

Across multiple seeds per prototype/QL:

- parameter fingerprint diversity;
- mathematical-state diversity;
- stem diversity;
- scenario diversity;
- answer-position coverage;
- misconception reachability;
- no fallback exhaustion.

Thresholds are set from each contract's true finite domain and may not be weakened simply to pass.

## 20. Cross-chapter duplicate audit

MAL must be compared against:

```text
AVG — weighted means and grouped averages
RAP — pure ratio/proportion and partnership applications
PCT — pure percentage mechanics
PNL — false weight, price fraud and general commercial chains
MEN — container capacity and geometry
TSD — speed/journey weighted rates
Physics/GK content — density laws or chemistry facts not supplied in the stem
```

The audit compares mathematical state and requested task, not only text similarity.

## 21. Discovery and implementation phases

### Phase 0 — Authority and legacy recovery

- open-discovery amendment;
- current 87-family ledger;
- cross-chapter ownership map;
- chapter architecture;
- no runtime or permanent identities.

### Phase 1 — CP-001 executable discovery

- exact rational foundation;
- weighted-state model;
- direct alligation prototype;
- independent weighted-equation verifier;
- English scenario catalogue;
- diagram and misconception-option proof;
- forward/inverse/multi-component prototypes;
- merge/split and final gap audit;
- allocation proposal only after review.

### Phase 2 — CP-002 discovery and proof

- one-step conserved-component state;
- single replacement boundary with CP-003;
- ratio versus concentration boundary with CP-004.

### Phase 3 — CP-003 discovery and proof

- repeated retention engine;
- stage simulation verifier;
- symmetric, inverse and asymmetric replacement.

### Phase 4 — CP-004 discovery and proof

- conserved-solute engine;
- evaporation and wet/dry transformations;
- CP-001 and CP-003 boundary closure.

### Phase 5 — CP-005 discovery and proof

- adulteration-cost ledger;
- strict PNL authority boundary;
- no false-weight ownership.

### Phase 6 — CP-006 discovery and proof

- vessel state engine;
- transfer-stage verifier;
- simple combination delegated to CP-001 where appropriate.

### Phase 7 — Chapter-wide allocation

Only after all domains complete discovery:

- final CP ownership decision;
- permanent QL allocation;
- sequential IDs;
- chapter registry;
- chapter-wide gap and collision audits.

### Phase 8 — English runtime and review integration

- Question Studio review exposure;
- full forced-QL tests;
- residual previews;
- same-QL diversity;
- manual review exports;
- corrections and exact-head reruns.

### Phase 9 — Freeze and later localisation

- freeze record only after English automated and human gates pass;
- Hindi and Punjabi authored and reviewed separately;
- deliberate language exposure.

## 22. Reports

Expected chapter reports:

```text
mal-001-legacy-disposition-report.md
mal-001-authority-audit.md
mal-001-readiness-report.md
mal-001-coverage-report.md
mal-001-independent-verifier-report.md
mal-001-explanation-quality-report.md
mal-001-diagram-audit-report.md
mal-001-diversity-report.md
mal-001-cross-chapter-duplicate-report.md
mal-001-residual-qa-report.md
mal-001-localisation-status.md
mal-001-freeze-record.md
```

Reports must be generated from the exact reviewed head and may not claim human approval that has not occurred.

## 23. Risk register

| Risk | Required response |
|---|---|
| Motif inflation | State/task merge-split audits before QLs |
| AVG duplication | Mathematical-state ownership audit |
| CP boundary duplication | Prototype comparison and one-owner rule |
| Floating error | Exact rational arithmetic |
| Impossible mixture state | Valid-state-first generation and independent physical checks |
| Weak inverse uniqueness | Bounded independent reconstruction |
| Repeated safe values | Same-state diversity audit and pool-reachability metrics |
| Artificial contexts | Curated scenario catalogue and source evidence |
| Generic explanations | Family-specific renderers and substitution audits |
| Decorative diagrams | Necessity and state-parity audit |
| False-weight leakage | PNL authority guard |
| Language leakage | Runtime rejection and script audits |
| Premature publication | Explicit non-publishable metadata and routing tests |

## 24. Completion definitions

### A checkpoint is discovery-complete only when

- source/task/inverse/semantic/edge/representation audits pass;
- executable prototypes cover every candidate contract;
- canonical and independent solvers agree;
- merge/split decisions are documented;
- no meaningful gap remains;
- ownership collisions are resolved;
- generated English review material is approved;
- an allocation proposal is accepted.

### MAL-001 is English automated-QA clean only when

- all retained domains are implemented;
- every permanent QL is forced and independently verified;
- all blocker counters are zero;
- chapter-wide gap and duplicate audits pass;
- Question Studio review routing is safe;
- unsupported languages remain blocked.

### MAL-001 is English freeze-ready only when

- automated-QA-clean status is proven on the exact head;
- required manual review is complete;
- every rewrite/reject defect is resolved;
- affected exports and audits are regenerated;
- the freeze record is written from final state.

### MAL-001 is multilingual-ready only when

- Hindi and Punjabi are naturally authored;
- mathematical and option parity passes;
- terminology and diagram fit are reviewed;
- human editorial approval is recorded;
- each language is deliberately enabled.

---

## Final design principle

A good MAL question should make the learner identify and track the right quantity, not merely recognise the word “mixture”.

The chapter succeeds when every generated problem and explanation makes these questions clear:

```text
What is being mixed or transferred?
Which quantity is conserved?
Which value is a per-unit value and which is a total?
Does the operation happen once or repeatedly?
What is the exact state after each stage?
Which chapter owns the requested objective?
How can the answer be independently checked?
```