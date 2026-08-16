# IOP-001 — Machine Input–Output & Sequential Rearrangement

Status: **Checkpoint B — CP001–CP010 executable discovery implemented**.

`IOP-001` is the Reasoning V1 implementation package for the student-facing **Input–Output** chapter (`REAS-INP`). It follows the Reasoning master-blueprint requirement that Input–Output use sequence-of-states transformation engines rather than static rearrangement templates.

## Current implementation

Two isolated but compatible runtime layers are now executable:

### Classical foundation — CP001–CP004

- deterministic placement engine;
- independent full-trace oracle;
- semantic rule fingerprints;
- simultaneous-action canonicalization;
- adversarial rule-identifiability gate;
- four target-query forms;
- 12 temporary prototype authorities.

### Advanced program layer — CP005–CP010

- attribute-based iterative selection;
- numeric whole-row transformations;
- word transformations;
- alphanumeric transformations;
- stage pipelines combining transform, sort and iterative placement;
- structured `LINEAR`, `BOX_ROW` and `TABLE_2XN` layouts;
- adjacent-pair swaps;
- pairwise sum/absolute-difference rewrites;
- reverse/missing-state synthesis queries;
- independent advanced trace oracle;
- independent advanced query oracle;
- mutated competing-program grammar for ambiguity rejection;
- 18 temporary prototype authorities.

Current temporary discovery inventory:

```text
IOP-CP-001   Basic One-Sided Rearrangement                    3
IOP-CP-002   Mixed Word–Number Blocked Rearrangement          3
IOP-CP-003   Double-Ended / Simultaneous Rearrangement        3
IOP-CP-004   Alternating / Interleaved Rearrangement          3
IOP-CP-005   Attribute-Based Selection & Rearrangement        3
IOP-CP-006   Numeric Operation Machines                       3
IOP-CP-007   Word & Alphanumeric Transformation Machines      3
IOP-CP-008   Multi-Stage Transformation Machines              3
IOP-CP-009   Box / Table / Cell Input–Output                  3
IOP-CP-010   Reverse, Missing-State & Machine Synthesis       3
TOTAL                                                         30
```

These are **temporary executable discovery authorities**, not permanent QLs. Checkpoint boundaries and prototype distinctions remain open to source-driven merge/split review.

## Defining safety rule

A correct trace is insufficient if the demonstration can reasonably imply another rule.

Classical demonstrations are tested against a competing rule grammar. Advanced demonstrations are additionally tested against mutated alternatives covering:

- attribute-key substitutions;
- ascending/descending reversal;
- left/right placement reversal;
- competing transformation choices;
- pair-swap versus whole-row reversal;
- reordered stage pipelines;
- other advanced prototype programs.

A caselet is accepted only when:

```text
matching semantic fingerprints = 1
matching fingerprint = intended fingerprint
```

The production executor and oracle are separate implementations. Child answers are also recomputed by separate query oracles.

## Query coverage

Foundation target questions currently cover:

- step output;
- element at position;
- position of element;
- final output.

Advanced target questions add:

- identify the step number from a state;
- previous-step reconstruction;
- missing-step reconstruction;
- remaining-step count.

CP010 owns the reverse/missing-state synthesis layer rather than duplicating machine semantics already represented in CP005–CP009.

## Review evidence

The dedicated workflow now runs:

- strict TypeScript over the complete IOP package;
- CP001–CP004 deterministic scale proof;
- CP005–CP010 deterministic advanced scale proof;
- CP001–CP004 HTML/JSON review export;
- CP005–CP010 HTML/JSON review export;
- production API build.

## Current lifecycle

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF
permanent QLs:               0
source saturation:           OPEN
merge/split review:          OPEN
English freeze:              NOT_STARTED
Question Studio:             false
Question Bank writes:        false
test eligibility:            false
public publication:          false
Hindi/Punjabi:               not started
```

Whole-chapter Question Studio integration remains deliberately deferred until source saturation, gap audit, permanent allocation and English review are complete.
