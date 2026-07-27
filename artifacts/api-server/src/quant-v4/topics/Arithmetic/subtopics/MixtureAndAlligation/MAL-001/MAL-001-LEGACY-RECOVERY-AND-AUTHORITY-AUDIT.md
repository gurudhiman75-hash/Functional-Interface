# MAL-001 Legacy Recovery and Authority Audit

Status: **Phase 0 discovery in progress**  
Permanent QLs created: **0**  
Runtime code created: **0**

## 1. Recovered repository prior art

The current `New-main` branch contains a substantial Quant V2 Mixture & Alligation system:

```text
artifacts/api-server/src/quant-v2/canonical/mixture-alligation-types.ts
artifacts/api-server/src/quant-v2/canonical/mixture-alligation-motif-factories.ts
artifacts/api-server/src/quant-v2/devtools/mixture-alligation-large-audit.ts
artifacts/api-server/src/quant-v2/validators/mixture-alligation-independent-solver.ts
artifacts/api-server/src/lib/quant-v2/mixture-alligation-admin-adapter.ts
```

The legacy type registry declares 78 named family IDs. Its model already contains useful concepts that should be recovered rather than discarded:

- explicit solver models;
- preferred solution method;
- structured explanation blocks;
- alligation-cross diagram support;
- common-trap and distractor metadata;
- reasoning-step and triviality metadata;
- multilingual payload shapes;
- parameter and stem fingerprints;
- an independent-solver validation path;
- large-corpus editorial and mathematical audit counters.

## 2. What must not be copied directly

The legacy system is a motif factory, not a Quant V4 chapter architecture. The following are not valid foundations for MAL-001 without redesign:

- one named family for each scenario skin;
- monolithic factory dispatch as the chapter source of truth;
- JavaScript-number arithmetic for values that require exact rational treatment;
- pre-authored trilingual output without language-specific review gates;
- a difficulty label attached mainly to a motif rather than generated-instance complexity;
- a family inventory treated as equivalent to a permanent QL inventory;
- cross-topic novelty retained merely because it can be generated;
- false-weight questions classified as mixture questions.

The useful legacy behaviour must be decomposed into:

```text
mathematical state
→ task contract
→ inverse contract
→ answer semantic
→ prototype topology
→ QL decision
```

## 3. Initial family disposition

This is an initial migration map, not a final freeze.

### 3.1 Retain for executable MAL discovery

The following legacy clusters have clear Mixture & Alligation ownership and must be audited in detail:

- two-component alligation and weighted blending;
- three-component and multi-component blending;
- missing source value, mean, ratio and quantity inverses;
- single-step two-substance ratio adjustment;
- repeated replacement and dilution;
- concentration, evaporation and fresh/dry transformations;
- adulteration profit caused by adding a cheaper or free component;
- combining differently composed vessels;
- single and repeated inter-vessel transfers;
- alloys or density only where the task is genuinely a component-blend/conservation problem and not a Physics chapter problem.

### 3.2 Reassign to another chapter unless source evidence proves a MAL-specific contract

```text
speed/distance alligation dressing        → Average or Speed–Time–Distance
partnership/capital-labour dressing       → Ratio & Proportion applications
GST/tax bracket blending                  → Percentage or commercial arithmetic
average-score weight distribution         → Average
pure symbolic numeric dressing            → source-evidence review; likely exclude
geometric fluid-strata dressing           → Mensuration/Physics unless mixture conservation is the tested skill
```

### 3.3 Explicit authority correction

The old planning document grouped false-weight questions with dishonest mixing. Current chapter authority is stricter:

```text
MAL owns:
- adulteration by mixing;
- component composition;
- concentration;
- replacement and dilution;
- alligation ratio and conserved-quantity reasoning.

PNL owns:
- false weight;
- short measure;
- false length or volume;
- price fraud without mixture composition.
```

Therefore `dealer_false_weight_alligation` and pure false-weight inverse contracts are not MAL-001 candidates. A mixed question that combines adulteration with false weight requires an explicit cross-chapter ownership decision and must not be admitted automatically.

## 4. Cross-chapter ownership map

### Average versus MAL

```text
General weighted mean of marks, ages, prices or groups
→ Average

Blend composition, target concentration, alligation ratio,
component quantity or replacement
→ MAL
```

A price context alone does not make a question MAL. The mixture or component-conservation objective must be essential.

### Ratio & Proportion versus MAL

```text
Pure ratio transformation or proportional chain
→ Ratio & Proportion

A ratio reconstructed by conserving one mixture component
or by weighted blending
→ MAL
```

### Percentage versus MAL

```text
Pure percentage increase/decrease/share
→ Percentage

Percentage concentration, dilution or conserved-solute transformation
→ MAL
```

### Profit & Loss versus MAL

```text
False quantity, marked price, discount and transaction-price fraud
→ PNL

Profit created specifically by adulterating a product through mixing
→ MAL, with PNL percentage logic as a dependent calculation
```

### Mensuration/Physics versus MAL

Container dimensions, density or volume are scenario inputs only when the tested reasoning remains mixture conservation. Questions whose primary task is geometric capacity or physical density belong outside MAL.

## 5. Legacy audit capabilities to preserve

The Quant V2 large audit contains valuable checks that should be translated into Quant V4 gates:

- exact and normalised stem fingerprints;
- topology/numeric/answer fingerprints;
- repeated opening detection;
- malformed MathJax detection;
- generic explanation-shell detection;
- missing alligation-cross diagram detection;
- alligation diagram structural checks;
- shortcut-versus-full-solution distinction;
- robotic or artificial stem detection;
- option uniqueness and unit consistency;
- missing question/ask wording detection;
- routing leakage detection;
- ugly-decimal detection;
- trivial-question detection;
- independent solver issues and degenerate-state rejection.

These checks should be strengthened rather than copied mechanically. In particular, exact rational arithmetic and independent component-balance verification must replace tolerance-driven numerical agreement.

## 6. Required Quant V4 architecture

The chapter should ultimately use one source of truth under `foundation/`:

```text
foundation/types.ts
foundation/rational.ts
foundation/state-model.ts
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
```

Human-owned libraries should be separate from runtime code:

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

No duplicate root/foundation implementation files are allowed.

## 7. Discovery sequence

1. complete the 78-family disposition ledger;
2. lock chapter ownership against AVG, RAP, PCT, PNL, MEN and TSD;
3. prototype the mathematical state model and independent verifier;
4. run MAL-CP-001 executable contract discovery;
5. perform merge/split and gap audits for CP-001;
6. review the generated English prototype pack;
7. assign permanent CP-001 QLs only after approval;
8. repeat for the remaining retained domains;
9. run a final chapter-wide collision and gap audit before chapter freeze.

## 8. Current verdict

The old six-domain map remains a strong working hypothesis, but its fixed 340-QL/31-mode plan is revoked. The first implementation target is not a production QL library. It is an executable, non-publishable CP-001 discovery foundation that proves the state model, exact solver, independent verification, natural English rendering, alligation diagram and misconception-driven options.