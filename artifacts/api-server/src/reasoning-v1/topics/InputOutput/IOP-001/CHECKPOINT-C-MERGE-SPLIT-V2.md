# IOP-001 — Checkpoint C Semantic Merge/Split V2

Status: **FINAL FOR PERMANENT ALLOCATION**

Date: 2026-08-17

This audit supersedes the 13-QL provisional count in `PERMANENT-QL-PROPOSAL-V1.md`.

## Governing rule

A permanent QL represents a materially distinct learner-facing **machine contract**.

A new QL is **not** justified merely by changing:

- token domain (`WORD`, `NUMBER`, `ALPHANUMERIC`);
- selection key (`ALPHABETICAL`, numeric value, word length, digit sum);
- ascending vs descending direction;
- left vs right fixed placement;
- token count;
- difficulty;
- query wording;
- whether the child asks for a step, position, previous state or final state.

A split is justified when the learner must infer a materially different **state-transition schedule or transformation architecture**.

## Equivalence classes

### `IOP-QL-001` — Single Select-and-Fix Rearrangement

Semantic contract:

```text
select one remaining token by an inferable key
→ move/fix it at one open end
→ repeat
```

Merged discovery coverage:

- CP001 alphabetical word ordering;
- CP001 numeric ordering;
- reverse direction / opposite-end variants;
- CP005 word-length ordering;
- CP005 digit-sum ordering;
- future source-backed single-key attributes that preserve the same one-select/one-fix schedule.

Why one QL: direct vs derived selection keys change computation burden, not machine transition semantics.

### `IOP-QL-002` — Blocked Multi-Category Rearrangement

Semantic contract:

```text
complete category/phase A across successive steps
→ then complete category/phase B
```

Merged discovery coverage: CP002 prototypes.

Why separate: phase completion before switching categories is a distinct schedule the learner must infer.

### `IOP-QL-003` — Simultaneous Multi-Action Rearrangement

Semantic contract:

```text
perform two or more independent selections/placements in the same visible step
```

Merged discovery coverage:

- pure-number smallest/largest double-ended;
- mixed word-number simultaneous variants.

Why one QL: pure vs mixed token domains are parameters; simultaneity is the material reasoning contract.

### `IOP-QL-004` — Alternating / Interleaved Rearrangement

Semantic contract:

```text
step n uses phase A
step n+1 uses phase B
→ cycle repeats
```

Merged discovery coverage: CP004 source-backed alternating mixed word-number variants. Unsupported pure-number alternation remains non-production until sourced, but it would still map to this QL rather than creating a new one.

Why separate: alternating actions across visible steps differ materially from simultaneous or blocked schedules.

### `IOP-QL-005` — Numeric Transformation Pipeline

Semantic contract:

```text
number tokens are transformed and/or reordered through multiple inferable stages
```

Merged discovery coverage:

- CP006 numeric operation probes;
- homogeneous numeric CP008 pipelines.

Production constraint: exact numeric operations are source-whitelisted solve modes. Executable synthetic operation chains do not automatically become production modes.

### `IOP-QL-006` — Text / Alphanumeric Transformation Pipeline

Semantic contract:

```text
textual or alphanumeric tokens are transformed and/or reordered through multiple inferable stages
```

Merged discovery coverage:

- CP007 word transformation probes;
- CP007 alphanumeric probes;
- homogeneous word/alphanumeric CP008 pipelines.

Why word + alphanumeric merge: token alphabet changes, but the machine remains a single-domain transform/reorder pipeline. Source-backed transformation modes remain individually whitelisted.

### `IOP-QL-007` — Mixed Word–Number Transformed-Pair Machine

Semantic contract:

```text
select a word and a number under independent rules
→ transform both
→ place the transformed pair according to the machine schedule
→ repeat
```

Primary runtime/source authority: `IOP-CP008-GAP-PROT-001` based on RBI Grade B Phase 1, 8 Sep 2024 Shift 1 PYQ reconstruction.

Why separate: two domains are selected and transformed together in each step. This is not reducible to a homogeneous transform pipeline or ordinary mixed sorting.

### `IOP-QL-008` — Box / Table Arithmetic Machine

Semantic contract:

```text
structured cells/boxes
→ arithmetic relationships across cells/pairs
→ one or more derived structured states
```

Merged discovery coverage: CP009 topology and arithmetic-engine probes.

Production constraint: the exact arithmetic operation sequence is source-whitelisted. The current synthetic pair sum/absolute-difference probes remain engine tests unless directly source-matched.

Why separate: structured cell topology and cross-cell arithmetic materially change both inference and rendering.

## CP010 disposition

CP010 does **not** receive permanent machine QLs.

Its permanent contribution is solve/query modes applicable to compatible QLs:

```text
STEP_OUTPUT
FINAL_OUTPUT
ELEMENT_AT_POSITION
POSITION_OF_ELEMENT
STEP_NUMBER
PREVIOUS_STEP
MISSING_STEP
REMAINING_STEP_COUNT
```

A new CP010 QL would only be justified in future if a source requires a materially different reverse-execution machine contract, not merely a different question asked over the same trace.

## Final allocation count

```text
IOP-QL-001  Single Select-and-Fix Rearrangement
IOP-QL-002  Blocked Multi-Category Rearrangement
IOP-QL-003  Simultaneous Multi-Action Rearrangement
IOP-QL-004  Alternating / Interleaved Rearrangement
IOP-QL-005  Numeric Transformation Pipeline
IOP-QL-006  Text / Alphanumeric Transformation Pipeline
IOP-QL-007  Mixed Word–Number Transformed-Pair Machine
IOP-QL-008  Box / Table Arithmetic Machine
------------------------------------------------------------
TOTAL       8 permanent machine QLs
```

## Why V1 had 13 and V2 has 8

The V1 proposal still split several parameter domains into separate QLs:

- word vs number single rearrangement;
- word vs number attribute rearrangement;
- pure-number vs mixed simultaneous rearrangement;
- word vs alphanumeric transform pipelines.

On strict learner-semantic review these are parameters within four broader contracts, not new contracts. V2 therefore merges them.

## Allocation gate evidence

Pre-allocation exact-head workflow `31987759746` passed:

- CP001–CP004 foundation proof: PASS;
- CP005–CP010 advanced proof: PASS — 720 caselets / 2,880 child questions / 18,400 competing-program executions;
- source-backed CP008 mixed gap proof: PASS — 160 caselets / 640 child questions / 23,040 competing-rule executions;
- strict TypeScript: PASS;
- foundation review export: PASS;
- advanced review export: PASS;
- production API build: PASS.

## Product state after allocation

Permanent allocation does **not** imply English freeze or product activation.

```text
permanent QLs:               8
source family saturation:    PASS for V1 allocation
English production modes:    NOT FROZEN
Question Studio:             OFF
Question Bank writes:        OFF
test eligibility:            OFF
public publication:          OFF
Hindi/Punjabi:               NOT_STARTED
```
