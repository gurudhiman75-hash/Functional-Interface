# MAL-CP-004 Wave 01 — Conserved-Quantity Executable Discovery

Status: **open executable discovery**  
Canonical problem: **MAL-CP-004 — Conserved-solute and wet/dry transformations**  
Permanent QLs allocated: **0**  
Question Studio exposure: **disabled**

## Purpose

Wave 01 starts CP-004 from the exact ownership boundary established in the MAL-001 design and legacy-family disposition ledger. It does not treat every question containing a percentage solution as CP-004.

CP-004 owns a question only when the learner must identify a conserved component such as:

- solute while solvent is added or evaporated;
- solvent while pure solute is added;
- dry matter while moisture changes.

## Executable discovery prototypes

| Prototype | Task | Conserved quantity | Legacy authority |
|---|---|---|---|
| `MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION` | Find component amount from total quantity and concentration | component amount | `concentration_basic_percent`, component-quantity boundaries |
| `MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT` | Find concentration from component and total quantities | component amount | `concentration_basic_percent` |
| `MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET` | Add solvent to reduce concentration | solute amount | dilution/add-water families |
| `MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET` | Add pure substance to increase concentration | solvent amount | add-pure-substance family |
| `MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET` | Evaporate solvent to increase concentration | solute amount | both evaporation families |
| `MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT` | Find final mass after drying | dry matter | fresh/dry weight family |
| `MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT` | Recover initial wet mass | dry matter | inverse of fresh/dry weight family |

These seven entries are executable prototypes, not permanent QLs. Representation and inverse variants may merge or split only after source normalisation, mathematical equivalence and editorial audits.

## Explicit exclusions and boundaries

Wave 01 does not absorb the following families:

1. `dilution_successive_replacement` and `dilution_find_number_of_operations` remain in CP-003 because geometric retention controls the solution.
2. `dilution_solution_removed_water_added` remains a CP-003/CP-004 boundary until the sampling transition is separated from the concentration wording.
3. `concentration_mixing_two_solutions` and `concentration_mixing_three_solutions` remain CP-001/CP-004 boundaries because direct weighted blending must not be duplicated.
4. `vessel_chemical_concentration_equilibrium` remains a CP-004/CP-006 boundary because vessel-by-vessel transfer bookkeeping may control the task.

## Runtime policy

Every generated question:

- uses exact rational arithmetic;
- exposes the conserved quantity through a simple ledger;
- has four unique options;
- maps every distractor to a named misconception;
- uses number-specific English explanations;
- avoids artificial openings, alligation language and unsupported visual references;
- remains inactive, unpublished and unavailable to Question Studio, Question Bank and tests;
- records source maturity honestly as legacy-runtime recovered and still pending direct source normalisation.

## Wave 01 proof

The dedicated audit executes:

```text
7 prototypes × 200 seeds = 1,400 generated questions
1,400 deterministic repeat checks
1,400 independent solver checks
35 review rows
```

The proof also checks:

- exact CP and archetype identity;
- absence of permanent QL IDs;
- inactive delivery flags;
- source trace and source-maturity status;
- unique and equivalent-safe options;
- distinct misconception authorities;
- number-specific explanations;
- conservation-ledger presence;
- answer-position balance;
- exact-state, stem and answer diversity;
- preservation of CP-003, CP-001 and CP-006 boundary decisions.

## Exit criteria for the next wave

Wave 02 should perform direct source recovery and normalisation for every clear prototype and every unresolved boundary. No permanent `MAL-QL-038+` allocation should occur until:

1. direct SSC/banking source evidence is attached;
2. CP-001/CP-004 and CP-003/CP-004 equivalence audits are complete;
3. representation variants are merged where mathematically identical;
4. student-facing value pools, distractors and explanations pass an editorial audit comparable to CP-003 V2.
