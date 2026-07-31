# MAL-CP-002 — Two-Substance Ratio Adjustment

Status: **open executable discovery**  
Package: `MAL-001`  
Canonical problem: `MAL-CP-002`  
Permanent QLs: **0**  
Frozen solve modes: **0**  
Public/runtime status: **inactive**

## 1. Ownership hypothesis

MAL-CP-002 owns one-step composition adjustment when one component is changed and the counterpart component is conserved.

The central question is:

```text
Which component stays unchanged, and what must the changed component become
for the before/after ratio to satisfy the stated condition?
```

Current executable discovery covers:

- add one component to reach a target ratio;
- remove a named pure component to reach a target ratio;
- find the ratio after a stated pure-component addition;
- find the ratio after a stated pure-component removal;
- reconstruct the original ratio before an addition;
- reconstruct the original ratio before a removal;
- recover both component quantities from total quantity and ratio;
- audit one homogeneous remove-and-refill operation at the CP-002/CP-003 boundary.

These are discovery contracts only. Their count is not a target and is not frozen.

## 2. Explicit boundary rules

### CP-001 boundary

A source-value or price replacement whose target is a weighted mean remains a CP-001 candidate. CP-002 does not absorb a question merely because one material is removed and another is added.

### CP-003 boundary

A single homogeneous remove-refill operation is executable here only for ownership comparison. Repeated replacement, geometric retention, unequal multi-stage replacement and unknown operation counts are excluded to CP-003.

### CP-004 boundary

Concentration percentage, dilution, evaporation, wet/dry conversion and other conserved-solute transformations remain CP-004 even when an intermediate component ratio can be written.

### RAP boundary

Context-free ratio partitioning remains Ratio & Proportion. A milk, alloy or mixture noun is insufficient unless a component-conservation or before/after mixture state is essential.

## 3. CP-001 referral preserved

`MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION` was not approved as a CP-001 weighted-mean contract.

The recovered three-variety tea source supports a different task:

```text
initial three-component ratio
+ stated additions
→ final three-component ratio
→ reconstruct a component quantity
```

It is recorded as:

```text
MAL-CP002-PROT-THREE-COMPONENT-ADDITION-RATIO-ADJUSTMENT
```

Its status remains `SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION`. It cannot receive a permanent QL until exact source encoding, uniqueness proof, independent verification and ownership audits pass.

The other CP-001 exclusions are not automatically absorbed:

- `MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES` remains outside this frontier unless ratio-adjustment evidence establishes ownership;
- `MAL-CP001-PROT-TWO-STAGE-UNKNOWN` remains outside this one-step checkpoint.

## 4. Exact mathematics

For initial quantities `A` and `B`, target ratio `m:n`:

### Add or remove A while B is fixed

```text
required A = B × m/n
adjustment = |required A − initial A|
```

The operation direction must agree with the sign of the change.

### Add or remove B while A is fixed

```text
required B = A × n/m
adjustment = |required B − initial B|
```

### Component quantities from total T and ratio m:n

```text
A = T × m/(m+n)
B = T × n/(m+n)
```

### One homogeneous remove-refill operation

If `r` litres are removed from a homogeneous vessel of total `V`, both original components retain the same factor:

```text
retained fraction = (V − r)/V
```

Only after that proportional removal is `r` litres of the replacement component added. This is not the same as removing a named pure component.

## 5. Solver/verifier separation

The canonical discovery solver uses direct conserved-component equations.

The independent verifier:

- replays additions and pure removals on component quantities;
- reconstructs original states and forwards them again;
- checks total and ratio by cross multiplication;
- simulates homogeneous sample removal component by component before refill.

It never trusts an answer option, explanation or solver fingerprint.

## 6. Current source recovery

The ownership ledger recovers and decomposes these legacy families:

- `mix_milk_water_basic_ratio`;
- `mix_milk_water_find_water_added`;
- `mix_milk_water_find_milk_added`;
- `mix_milk_water_target_ratio`;
- `mix_milk_water_quantity_removed`;
- `mix_ratio_change_after_addition`;
- `mix_ratio_change_after_removal`;
- `replacement_single_operation`;
- `mix_ratio_change_after_replacement`;
- `alloy_metal_added_removed`.

Scenario nouns are not permanent identities. Milk-water remains subject to the inherited **22% context-domain cap**, checked during authoring rather than used as a QL quota.

## 7. Current executable proof

The discovery audit currently requires:

- exact deterministic solving;
- expected rational fingerprints;
- independent component-state verification;
- both component directions for addition and removal;
- both replacement-component directions for the single-operation boundary;
- zero permanent QLs;
- zero frozen solve modes;
- all publication, Question Studio, Question Bank and test gates false.

## 8. Next discovery gates

1. Encode the recovered three-component source as an exact executable fixture.
2. Search direct SSC, banking and Punjab-exam sources for missing task directions and representations.
3. Audit whether addition/removal operation variants merge or deserve distinct learner contracts.
4. Add valid-state deterministic parameter generation rather than relying only on fixed fixtures.
5. Add stems, misconception-driven options, reasoning graphs and formula-first explanations.
6. Run a gap audit before any permanent QL recommendation.
7. Freeze only after no meaningful concept, inverse, edge, representation or source-backed mode remains uncovered.
