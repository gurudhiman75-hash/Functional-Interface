# MAL-CP-004 Wave 03 — Mathematical Equivalence and Merge/Split Closure

Status: **equivalence-closed open discovery**  
Permanent QLs allocated: **0**  
Question Studio / Question Bank / test / publication: **disabled**

## Scope

Wave 03 compares:

- seven Wave 01 executable prototypes;
- three Wave 02 source-backed gaps;
- five Percentage `PCT-007 / PCT-CP-005` concentration solve modes;
- five Percentage `PCT-007 / PCT-CP-006` evaporation/drying solve modes.

The purpose is to decide whether each authority is:

1. a distinct learner contract;
2. an output or representation variant of an existing contract;
3. an exact cross-chapter duplicate that should reference a canonical owner;
4. a legitimate missing contract discovered through collision analysis.

No existing Percentage release is mutated in this wave.

## Closure result

Twenty authorities reduce to **ten effective CP-004 contracts**.

### 1. Component amount

```text
MAL-CP004-EFF-COMPONENT-AMOUNT
```

Includes:

- tracked component amount from total and concentration;
- other component amount as a complement output;
- Percentage `findComponentFromTotalAndRate` as an exact duplicate;
- Percentage `findOtherComponentFromTotalAndRate` as an output variant.

### 2. Concentration

```text
MAL-CP004-EFF-CONCENTRATION
```

Includes:

- concentration from component amount and total;
- Percentage `findRateFromComponentAndTotal` as an exact duplicate.

### 3. Total from component and concentration

```text
MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE
```

This is a legitimate missing inverse recovered from Percentage `PCT-CP-005`.

Variants:

- tracked component amount is given;
- other component amount is given.

It remains an open contract and receives no permanent QL here.

### 4. Solvent addition to a target

```text
MAL-CP004-EFF-SOLVENT-ADDITION-TARGET
```

Solute is conserved while total quantity increases.

### 5. Pure-solute addition to a target

```text
MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET
```

Solvent is conserved while both solute quantity and total quantity increase. It must remain separate from solvent-only transformations.

### 6. Evaporation to a target concentration

```text
MAL-CP004-EFF-EVAPORATION-TARGET
```

Output variants:

- evaporated amount;
- final total quantity.

Percentage `findEvaporatedAmount` is an exact duplicate. Percentage `findFinalVolumeAfterEvaporation` is an output variant of the same mathematical state.

### 7. Final concentration after a known solvent change

```text
MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE
```

The two Wave 02 gaps merge into one contract with variants:

- known solvent addition;
- known solvent evaporation.

### 8. Initial total from known evaporation

```text
MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION
```

This remains a separate inverse contract because the unknown is the original total quantity.

### 9. Forward moisture shift

```text
MAL-CP004-EFF-MOISTURE-FORWARD
```

Output variants:

- final mass;
- moisture/water lost.

Percentage `findFinalDryWeight` is an exact duplicate and `findWaterLostAfterDrying` is an output variant.

### 10. Inverse moisture shift

```text
MAL-CP004-EFF-MOISTURE-INVERSE
```

Percentage `findInitialWeightFromFinalDryWeight` is an exact duplicate.

## Disposition totals

```text
KEEP_OPEN_CONTRACT                 8
MERGE_AS_REPRESENTATION_VARIANT   6
REFERENCE_EXISTING_CONTRACT       5
ADD_OPEN_CONTRACT_FROM_COLLISION  1
```

## Separation decisions

The following contracts must not be merged:

1. **Solvent addition vs pure-solute addition** — they conserve different components.
2. **Unknown evaporation amount vs known solvent change** — one solves for the change; the other receives the change and solves for final concentration.
3. **Forward moisture shift vs inverse moisture shift** — the unknown total is different.
4. **Total reconstruction vs concentration calculation** — the learner must isolate a different unknown.

## Percentage ownership verdict

Canonical mathematical owner:

```text
MAL-CP-004
```

Percentage `PCT-007` may retain syllabus navigation aliases where product design requires them, but mathematically duplicate permanent QLs must not be published independently under both chapters.

This wave does **not**:

- delete or rewrite Percentage QLs;
- alter Percentage Question Studio routes;
- allocate `MAL-QL-038+`;
- enable any CP-004 product flag.

A later migration plan must preserve existing tests and references before changing Percentage ownership metadata.

## Executable equivalence proof

The Wave 03 audit runs:

```text
48 component/concentration states
232 moisture states
192 evaporation-target states
240 dilution-target states
192 pure-solute-addition states
--------------------------------
904 exact rational states
```

It also makes **1,320 comparisons against the actual PCT-007 solver**:

- all five PCT-CP-005 concentration modes;
- all five PCT-CP-006 evaporation/drying modes.

Additional checks:

- all 20 authorities are unique and classified;
- all ten effective contracts have at least one authority;
- all seven Wave 01 prototypes and all three Wave 02 gaps are closed;
- output variants reconstruct the same exact state;
- inverse directions round-trip to their original totals;
- pure-solute and solvent-only invariants remain separated;
- 175 generated Wave 01 compatibility questions remain valid and non-public;
- permanent QL count remains zero.

## Next phase

Wave 04 should build the unified source-backed discovery runtime for the ten effective contracts, including:

- both output variants where a merge was approved;
- the new total-from-component inverse;
- the two solvent-change variants;
- misconception-based options;
- natural SSC/banking-style English;
- exam-friendly value pools;
- cross-contract corpus-diversity controls.

Permanent QL allocation should remain blocked until the unified runtime and editorial audit pass.
