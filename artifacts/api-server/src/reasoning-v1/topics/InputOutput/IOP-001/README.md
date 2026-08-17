# IOP-001 — Machine Input–Output & Sequential Rearrangement

Status: **Checkpoint C — source-family saturated and 8 permanent QLs allocated; English production not frozen**.

`IOP-001` is the Reasoning V1 implementation package for student-facing **Input–Output** (`REAS-INP`). The chapter uses explicit sequence-of-states machine engines rather than static rearrangement templates.

## Permanent machine authorities

Strict source normalization and semantic merge/split reduce 30 temporary discovery prototypes plus the source-backed mixed gap to **8 permanent machine QLs**:

```text
IOP-QL-001  Single Select-and-Fix Rearrangement
IOP-QL-002  Blocked Multi-Category Rearrangement
IOP-QL-003  Simultaneous Multi-Action Rearrangement
IOP-QL-004  Alternating / Interleaved Rearrangement
IOP-QL-005  Numeric Transformation Pipeline
IOP-QL-006  Text / Alphanumeric Transformation Pipeline
IOP-QL-007  Mixed Word–Number Transformed-Pair Machine
IOP-QL-008  Box / Table Arithmetic Machine
```

CP010 contributes solve/query modes rather than duplicate machine QLs.

Authority: `permanent-authorities.ts` and `CHECKPOINT-C-MERGE-SPLIT-V2.md`.

## Runtime layers

### Classical foundation — CP001–CP004

- deterministic select/place machine engine;
- stable token identity and step provenance;
- independent full-trace oracle;
- semantic rule fingerprints;
- simultaneous-action canonicalization;
- adversarial competing-rule identifiability;
- target-query oracle.

Scale proof:

```text
12 temporary authorities × 80 seeds
= 960 deterministic caselets
= 3,840 child questions
```

### Advanced program layer — CP005–CP010

- attribute-based iterative selection;
- numeric transformations;
- word/alphanumeric transformations;
- multi-stage transform/sort/place programs;
- structured LINEAR / BOX_ROW / TABLE_2XN layouts;
- independent advanced trace oracle;
- independent child-query oracle;
- adversarial competing-program grammar;
- reverse/missing-state query synthesis.

Scale proof:

```text
18 temporary authorities × 40 seeds
= 720 deterministic caselets
= 2,880 child questions
= 18,400 competing-program executions audited
```

## Source-backed mixed transformation gap

Source saturation identified a missing advanced Banking family represented by RBI Grade B Phase 1, 8 Sep 2024 Shift 1 PYQ reconstruction.

`IOP-CP008-GAP-PROT-001` implements the normalized family:

```text
alphabetically first remaining word
+
smallest remaining number
→ transform word
→ transform number to digit sum
→ fix transformed number-word pair
→ repeat
```

The demonstration is checked against **144 competing semantic rules**.

Scale proof:

```text
160 deterministic caselets
640 child questions
23,040 competing-rule executions audited
```

This source-pinned family is the primary authority for `IOP-QL-007`.

## Defining safety rules

A caselet is rejected unless:

- the visible machine has exactly one supported semantic interpretation;
- independent executor/oracle traces agree;
- child answers independently recompute;
- visible states do not repeat;
- token identity/provenance is conserved;
- learner-visible selection keys have no hidden ties;
- option semantics are unique;
- lifecycle flags remain fail-closed.

A stress proof exposed a low-entropy vowel-count prototype. The duplicate gate was retained and the weak prototype was replaced rather than loosening validation.

## Solve/query modes

Permanent query modes currently include:

- `STEP_OUTPUT`
- `FINAL_OUTPUT`
- `ELEMENT_AT_POSITION`
- `POSITION_OF_ELEMENT`
- `STEP_NUMBER`
- `PREVIOUS_STEP`
- `MISSING_STEP`
- `REMAINING_STEP_COUNT`

These do not create extra machine QLs.

## Source saturation

`SOURCE FAMILY SATURATION = PASS_V1` for permanent family allocation.

Important distinction: exact advanced transformation modes are still individually source-whitelisted before English freeze. In particular:

- `IOP-QL-005` numeric operation modes are whitelist-gated;
- `IOP-QL-006` text/alphanumeric transformation modes are whitelist-gated;
- `IOP-QL-008` box/table arithmetic modes are whitelist-gated.

Executable synthetic operation chains remain engine evidence, not automatic production content.

See `CHECKPOINT-C-SOURCE-SATURATION-CLOSURE-V2.md`.

## Question Studio / delivery lifecycle

Permanent QL allocation is **not** product activation.

```text
maturity:                    PERMANENT_QL_ALLOCATED
sourceFamilySaturation:      PASS_V1
permanent QLs:               8
English freeze:              false
Question Studio:             false
Question Bank writes:        false
test eligibility:            false
public publication:          false
Hindi/Punjabi:               NOT_STARTED
```

The next chapter gate is **English permanent-authority implementation + human exam-readiness review**, followed later by localization and whole-chapter Question Studio registration.
