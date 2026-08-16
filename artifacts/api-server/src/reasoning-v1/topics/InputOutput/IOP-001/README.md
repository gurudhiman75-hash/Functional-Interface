# IOP-001 — Machine Input–Output & Sequential Rearrangement

Status: **Checkpoint A executable discovery foundation**.

`IOP-001` is the Reasoning V1 implementation package for the student-facing **Input–Output** chapter (`REAS-INP`). It follows the Reasoning master-blueprint requirement that Input–Output use a sequence-of-states transformation engine rather than static rearrangement templates.

## Current checkpoint

Implemented now:

- shared deterministic machine-state engine;
- independent trace oracle;
- semantic rule fingerprinting;
- competing-rule grammar and rule-identifiability gate;
- CP001–CP004 executable discovery;
- four child-query forms over a new input;
- misconception-owned options;
- deterministic difficulty baseline;
- discovery lifecycle lock;
- 960-caselet / 3,840-child proof target;
- 24-caselet English human-review export.

Current temporary prototype inventory:

```text
IOP-CP-001   Basic One-Sided Rearrangement                 3
IOP-CP-002   Mixed Word–Number Blocked Rearrangement       3
IOP-CP-003   Double-Ended / Simultaneous Rearrangement     3
IOP-CP-004   Alternating / Interleaved Rearrangement       3
TOTAL                                                       12
```

These are **temporary discovery authorities**, not permanent QLs.

## Planned chapter map

```text
IOP-CP-001  Basic One-Sided Rearrangement
IOP-CP-002  Mixed Word–Number Rearrangement
IOP-CP-003  Double-Ended & Simultaneous Rearrangement
IOP-CP-004  Alternating & Interleaved Machines
IOP-CP-005  Attribute-Based Selection & Rearrangement
IOP-CP-006  Numeric Operation Machines
IOP-CP-007  Word & Alphanumeric Transformation Machines
IOP-CP-008  Multi-Stage Transformation Machines
IOP-CP-009  Box / Table / Cell Input–Output
IOP-CP-010  Reverse, Missing-State & Machine Synthesis
```

Checkpoint boundaries remain hypotheses until source saturation and merge/split review.

## Defining safety rule

A mathematically correct trace is not enough. The displayed illustration must identify one defensible semantic machine rule.

Every demonstration is tested against a competing-rule grammar. A caselet is rejected unless:

```text
matching semantic rule fingerprints = 1
matching fingerprint = intended fingerprint
```

For simultaneous two-ended steps, action order is canonicalized as order-independent because “move X left and Y right in the same step” is one learner rule regardless of internal execution order.

## Current lifecycle

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF
permanent QLs:               0
Question Studio:             false
Question Bank writes:        false
test eligibility:            false
public publication:          false
Hindi/Punjabi:               not started
```

Whole-chapter integration is deliberately deferred until CP001–CP010 source saturation, permanent allocation and English review are complete.
