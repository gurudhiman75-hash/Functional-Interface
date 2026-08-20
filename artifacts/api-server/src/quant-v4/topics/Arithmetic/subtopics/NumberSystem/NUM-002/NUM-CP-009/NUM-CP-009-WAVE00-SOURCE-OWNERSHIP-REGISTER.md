# NUM-CP-009 — Wave 00 Source and Ownership Register

**Checkpoint:** `NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits`  
**Package:** `NUM-002`  
**Base authority:** `New-main` after CP008 cumulative landing  
**Permanent QLs allocated here:** 0  
**Next available Number System identity:** `NUM-QL-185`

## Governing ownership

CP009 owns terminal periodicity when the learner-facing answer is a unit digit, a last-two/last-three-digit block, an exponent-cycle class, a cycle length/position, or a bounded terminal-digit inverse/count state.

It does not own:

- general modular remainders not expressed as terminal digits (`NUM-CP-008`);
- one-stage division-lemma remainders (`NUM-CP-007`);
- pure exponent simplification (Surds & Indices / Algebra according to the requested semantic);
- factorial prime valuation or trailing-zero counts (`NUM-CP-011`);
- digit-equation reconstruction (`NUM-CP-010`).

## Evidence register

### Authoritative V4 design evidence

1. `NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md`
   - assigns CP009 terminal periodicity;
   - states that the audited source set establishes routine demand for terminal digits;
   - places last non-zero digit of large factorials on advanced enrichment hold.

2. `NUM-002-COMPLETE-CHECKPOINT-DESIGN.md`
   - separates unit digit, last two digits and last three digits;
   - requires direct/inverse/count/range tasks;
   - explicitly requires zero-cycle and leading-zero boundaries;
   - requires a CP008/CP011 overlap audit before closure.

### Legacy implementation evidence

`quant-v3/.../Last Digit/archetypes/NS-LASTDIG-001/` contributes historical learner-contract evidence for:

- direct last digit of a power;
- product of powers;
- repeated exponent / tower reduction;
- cycle-pattern recognition;
- reverse missing-exponent selection.

This legacy inventory is evidence, not a quota and not a permanent V4 allocation.

## Source disposition before executable discovery

### Routine candidate scope

- single-power unit digit;
- product of powers;
- sum/difference of powers;
- nested exponent / bounded power tower;
- cycle length and cycle position;
- inverse exponent residue class;
- bounded exponent count/set from terminal evidence;
- single-power last two digits;
- last-two/last-three expression composition;
- structured repeated blocks where the final target is terminal digits;
- claim/statement/DS representations only when they produce a distinct learner evidence contract.

### Hold / later-source decision

- last non-zero digit of large factorials remains `ADVANCED_ENRICHMENT_HOLD`;
- unrestricted theorem-heavy exponent reduction is not introduced merely to enlarge inventory;
- general CRT remains CP008 unless the final target is explicitly a terminal block and cycle-specific pedagogy is essential.

## Lifecycle

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF (once generated)
permanentQlCount:            0
nextAvailableQl:             NUM-QL-185
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

No permanent identity may be allocated until source/gap saturation, merge/split and explicit count approval are complete.
