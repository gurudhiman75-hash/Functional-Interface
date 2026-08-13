# NUM-CP-001 Wave 05 — Merge/Split Audit and Permanent-Count Proposal

**Checkpoint:** Number Sets, Order, Parity and Integer Structure  
**Input:** 26 source-saturated temporary prototypes  
**Gate:** count-bearing, ID-free proposal only  
**Permanent QLs allocated in this wave:** 0

## Decision rule

Two discovery prototypes may share one proposed permanent authority only when all of the following are true:

1. they use the same governing mathematical invariant;
2. their answer burden is compatible rather than direct-vs-inverse or scalar-vs-set;
3. the distinction can be expressed as a parameter or solve-mode without changing the learner inference;
4. merging does not hide a source-relevant misconception or evidence topology.

Presentation alone never creates an authority. Conversely, similar topic words do not justify a merge when the requested output or inference changes.

## Proposed merge groups

### 1. Exact ordering — PROT-003 + PROT-018

Signed integers and already-exact mixed integer/rational values use the same exact comparison invariant and return a complete ascending order. Numeric domain is a parameter; representation conversion remains CP-002 when it is the governing step.

### 2. Integer interval count — PROT-005 + PROT-011

Integer-endpoint bracket forms and exact rational-bound forms both count integers admitted by lower/upper bounds. Endpoint representation and inclusion topology are parameters of one counting authority.

### 3. Consecutive integer-family reconstruction — PROT-008 + PROT-016 + PROT-021

Short/long ordinary consecutive blocks and consecutive odd/even blocks all reconstruct an equally spaced integer block from its sum. Length and step (`1` for ordinary consecutive integers, `2` for consecutive odd/even integers) are parameters. All return the complete tuple.

### 4. Recover parity condition — PROT-015 + PROT-020

Both solve a parity condition on an integer variable by reducing the stated expression/result modulo 2. PROT-015 reaches the single-parity cases; PROT-020 additionally reaches every-integer/no-integer cases. The solution-class topology is a parameter of the same inverse parity invariant.

## Important non-merges

- PROT-001 and PROT-009 stay separate: returning the smallest set label is not the same answer burden as selecting the outsider value from a declared set.
- PROT-004 and PROT-014 stay separate: direct distance and inverse two-point reconstruction reverse the solve direction and output type.
- PROT-012 stays separate from interval counting: the endpoint is the unknown reconstructed from count evidence.
- PROT-013 stays separate: an additional sign/parity filter creates an intersection constraint beyond plain interval membership.
- PROT-019 stays separate: classifying empty/singleton/two/multiple solution topology is not the same output as a raw count.
- PROT-006, PROT-007 and the merged inverse-parity authority stay separate: expression selection, truth-topology classification and recovery of a condition have different answer burdens.
- PROT-017 stays separate from direct set classification: exact radical simplification is required before the rational/irrational classification.
- PROT-022 stays separate from full-block reconstruction: it returns one requested position rather than the complete tuple.
- PROT-023 stays separate: feasibility of a proposed sum is a residue/integrality classification, not reconstruction.
- PROT-024 stays separate: multi-statement completeness changes the evidence and output burden.
- PROT-025 stays separate: data sufficiency requires statement-wise candidate-set cardinality.
- PROT-026 stays separate: universal consecutive-product divisibility is governed by the sharp `k!` invariant.

## Proposed count

```text
discovered temporary prototypes: 26
proposed authorities:           21
merged authorities:              4
singleton authorities:          17
prototype reduction:             5
permanent QLs allocated:         0
next available QL:        NUM-QL-124
proposal status: AWAITING_EXPLICIT_COUNT_APPROVAL
```

This wave does not assign `NUM-QL-124` or any later identity. If and only if the 21-authority count is explicitly approved, the next gate may map the approved authorities onto permanent QLs beginning at `NUM-QL-124`.