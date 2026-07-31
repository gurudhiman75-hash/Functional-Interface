# MAL-CP-002 Coverage and Gap Audit

Status: **open discovery — not ready to freeze**  
Canonical problem: `MAL-CP-002 — Two-Substance Ratio Adjustment`  
Permanent QLs: **0**  
Frozen solve modes: **0**

## Audit verdict

The existing eight executable prototypes are mathematically valid and cover the explicit-quantity core of one-step ratio adjustment. They do not yet cover the full competitive-exam surface.

The chapter must remain inactive and unallocated because meaningful representation, inverse, forward-closure and conceptual-edge gaps remain.

## Covered executable core

The current runtime covers:

1. add one pure component to reach a target ratio;
2. remove one named pure component to reach a target ratio;
3. find the resulting ratio after a pure-component addition;
4. find the resulting ratio after a pure-component removal;
5. reconstruct the original ratio before an addition;
6. reconstruct the original ratio before a removal;
7. recover both component quantities from total quantity and ratio;
8. solve one homogeneous remove-refill operation for a target ratio at the CP-002/CP-003 boundary.

These are discovery prototypes only. The audit does not recommend one permanent QL per prototype.

## Highest-priority executable expansion

### 1. Hidden initial state behind total and ratio

Current adjustment prototypes require explicit component quantities. Exam questions frequently provide:

```text
initial total + initial component ratio + target ratio
```

The engine must first reconstruct both components and then apply the conserved-counterpart invariant.

Required directions:

- pure component added to reach a target ratio;
- pure component removed to reach a target ratio.

### 2. State reconstruction from one component and ratio

The engine lacks the representation:

```text
one known component quantity + component ratio
→ other component quantity / full state
```

This is needed as a reusable evidence-normalization layer, not necessarily as a separate permanent learner contract.

### 3. Original scale from a ratio shift

The current reverse prototypes receive explicit final component quantities. A different inverse family provides:

```text
original ratio + final ratio + known pure addition/removal
→ original total or original component quantities
```

The unchanged component links both ratio states and fixes the otherwise unknown scale.

Addition and removal must both be discovered and independently verified.

### 4. Forward closure for one remove-refill operation

The current boundary prototype solves the unknown replacement quantity from a target ratio. Its forward counterpart is missing:

```text
initial state + known single replacement quantity + refill component
→ final ratio
```

This remains a CP-002/CP-003 ownership boundary; repeated operations continue to belong to CP-003.

### 5. Homogeneous-removal invariance

Removing a sample from a well-mixed two-component vessel without refilling reduces both components in the same fraction. The component ratio is unchanged.

This conceptual edge is important because it distinguishes:

- removing a named pure component, which changes the ratio; and
- removing a homogeneous sample, which does not change the ratio.

## Audit-next gaps

### Operation feasibility

The current solver rejects a non-positive adjustment but does not expose the logic as a learner task.

Examples:

- adding component A cannot reduce A's share;
- removing component A cannot increase A's share;
- a target equal to the current ratio requires zero change.

A predicate contract should be considered only after source and exam-pattern review.

### Ratio plus quantity difference

A ratio and component difference can reconstruct a state, but this may remain Ratio & Proportion when no mixture transition is essential. Ownership depends on the complete task, not the presence of mixture nouns.

## Source-required boundaries

The following must not be implemented from intuition alone:

- removing pure A and adding pure B as a linked transfer;
- adding a second two-component mixture of known composition;
- three-component coupled additions and final three-way ratio reconstruction.

The three-component candidate preserves the CP-001 referral:

```text
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

It remains source-recovered but non-executable until an exact source fixture, uniqueness proof and independent verifier are added.

## Protected non-unique state

A final ratio and a known replacement quantity do not, by themselves, uniquely determine the original composition when the original total or another independent condition is missing.

No learner contract should be created for that evidence surface without enough information to fix the initial scale.

## Ownership boundaries retained

- Target weighted mean or price/value blending → `MAL-CP-001`
- Repeated homogeneous remove-refill operations → `MAL-CP-003`
- Concentration, solute, dry matter, evaporation and dilution → `MAL-CP-004`
- Context-free total/ratio/difference arithmetic → Ratio & Proportion

## Recommended expansion order

1. Add evidence normalization for total-plus-ratio and one-component-plus-ratio states.
2. Implement target adjustment from total-plus-ratio evidence.
3. Implement original-scale reconstruction from before/after ratios and a known pure adjustment.
4. Implement forward single replacement.
5. Implement homogeneous-removal ratio invariance.
6. Run source and ownership audits for transfer, added-mixture and three-component families.
7. Re-run chapter-wide concept, inverse, edge, representation and source audits.
8. Consider permanent QL allocation only after the residual matrix has no meaningful unowned or uncovered contract.

## Freeze decision

```text
freezeReadiness = false
permanentQlCount = 0
frozenSolveModeCount = 0
```

All public, Question Studio, Question Bank and test-delivery gates remain false.
