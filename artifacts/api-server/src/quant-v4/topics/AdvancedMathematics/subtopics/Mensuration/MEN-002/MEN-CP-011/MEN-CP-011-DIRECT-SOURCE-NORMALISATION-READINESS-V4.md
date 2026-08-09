# MEN-CP-011 — Direct-Source Normalisation Readiness V4

## Status

```text
Authority:                          MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4
Inherited authority:                MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V3
Live runtime families:              28
Attached source references:         17
Direct task matches pending review:  8
Representation-only support:         9
Directly normalised:                 0
Missing direct references:          11
Incomplete attached references:      0
False normalisation claims:           0
```

V4 continues the fail-closed source pass. It adds only references that can be traced to a stable File Library document identifier, edition, ISBN, chapter, printed locator, question locator and immutable extract identifier.

## Direct hollow-cuboid material-volume candidate

### Prototype

`MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME`

### Source

- Dr. R.S. Aggarwal, *Quantitative Aptitude for Competitive Examinations (Fully Solved)*
- Revised and Enlarged Edition 2017; Reprint 2017
- ISBN `978-93-525-3402-9`
- Chapter: Volume and Surface Areas
- Question printed p. 777; worked solution printed p. 795
- Question 46: covered wooden box with inner dimensions and uniform thickness; volume of wood requested

### Classification

`DIRECT_TASK_MATCH`

The question asks for the material volume of a closed hollow cuboid. The worked solution reconstructs the external dimensions and evaluates:

```text
outer cuboid volume − inner cuboid volume
```

This matches the live target and governing operation directly. It remains `REFERENCE_ATTACHED_PENDING_REVIEW` until reviewer identity and review timestamp are recorded.

## Inner cylindrical lining-cost support

### Prototype

`MEN-CP011-PROT-INNER-LINING-COST`

### Source

- Same R.S. Aggarwal authority and edition
- Printed p. 780
- Question 112: well of stated diameter and depth; cost of plastering the inner curved surface

### Classification

`REPRESENTATION_ONLY_SUPPORT`

The source directly supports inner cylindrical curved-surface costing. It does **not** include a bottom face. The live MEN-CP-011 family requires:

```text
inner curved wall + inner bottom
```

Therefore this reference cannot become direct normalisation, even after reviewer metadata is added. It is retained only as traceable representation support.

## Deliberate non-promotions

- The hollow-cuboid question is not used to directly normalise the hollow-cube family; a cube-specific exemplar is still required.
- Rectangular open-box painting questions are not used for cylindrical lining or sheet-cost families.
- The well-plastering question is not relabelled as a full open-tank lining problem because its bottom is absent from the requested area.
- Closed-cylinder sheet-cost questions are not used for the open-cylinder sheet-cost family.

## Remaining source gaps

Eleven live families still lack an attached accepted reference. Priority targets include:

- hollow-cube material volume;
- one-end-open cylinder area;
- pipe inverse length;
- cuboid-on-floor painted area;
- open cylindrical sheet cost;
- hollow-material ratio and percentage change;
- explicit conical-shell material and surface applications.

## Lifecycle

```text
Permanent QLs:      0
Question Studio:    disabled
Question Bank:      NOT_STORED
Test eligibility:   INELIGIBLE
Public publication: false
English freeze:     pending
Multilingual parity: pending
```

This pass changes source evidence only. It does not alter runtime generation, allocate permanent QLs or promote any product state.
