# SAP-CP-001 — Permanent QL Allocation Report

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-001`  
**Approval:** product-owner approval recorded on 2026-08-03  
**Allocated range:** `SAP-QL-001..SAP-QL-016`  
**Next available chapter identity:** `SAP-QL-017`  
**Runtime status:** allocated but inactive

## 1. Allocation decision

The approved 16-family English template proposal is now assigned permanent, chapter-wide identities. The count remains the result of executable discovery, source saturation, merge/split review and English editorial freeze; it was not selected as a quota.

```text
Design solve modes:          18
Executable authorities:      17
Approved template families:  16
Permanent QLs allocated:     16
Active/public QLs:             0
```

Nested grouping and repeated/redundant grouping continue to share one learner identity because they use the same governing inference: nesting determines scope and redundant outer brackets do not change value.

## 2. Immutable allocation

| Permanent QL | Approved template family |
|---|---|
| `SAP-QL-001` | Mixed order of operations |
| `SAP-QL-002` | Multiplication and division from left to right |
| `SAP-QL-003` | Addition and subtraction from left to right |
| `SAP-QL-004` | Grouping and bracket scope |
| `SAP-QL-005` | Unary signed operand |
| `SAP-QL-006` | Negative intermediate propagation |
| `SAP-QL-007` | Scoped “of” multiplication |
| `SAP-QL-008` | Implicit coefficient–group multiplication |
| `SAP-QL-009` | Fraction-bar scope |
| `SAP-QL-010` | Power before surrounding arithmetic |
| `SAP-QL-011` | Factorial before surrounding arithmetic |
| `SAP-QL-012` | Compare different groupings |
| `SAP-QL-013` | Select equivalent grouping |
| `SAP-QL-014` | Identify the first valid step |
| `SAP-QL-015` | Identify the first incorrect step |
| `SAP-QL-016` | Partial-subexpression evaluation |

These identities must not be renumbered, reused or silently repurposed. A later material gap requires an explicit reopen decision and a new identity from the next available chapter number.

## 3. Registry authority

The chapter-wide authority is:

```text
SAP-PERMANENT-QL-REGISTRY.ts
```

It records:

- the explicit template-to-QL mapping;
- title, solve authority and answer semantic;
- supported directions and representations;
- prototype ancestry, including the two-prototype merge for `SAP-QL-004`;
- English-freeze and product-approval status;
- lifecycle locks;
- the next available identity, `SAP-QL-017`.

The historical ID-free proposal remains unchanged as audit evidence. Permanent runtime packages wrap that frozen English evidence and bind it to the registry without mutating discovery records.

## 4. Permanent runtime proof

The permanent runtime executes 100 deterministic seeds for each of the 17 executable authorities.

```text
Generated permanent packages: 1,700
Allocated QLs reached:            16
Canonical/verifier mismatches:     0 required
Duplicate-option packages:         0 required
Unallocated templates:             0 required
Registry collisions:               0 required
```

Every allocated QL must reach:

- Easy, Medium and Hard;
- all four correct-answer positions;
- exactly the prototype ancestry declared in the registry;
- the approved English stem and explanation layer;
- exact canonical and independent-verifier agreement.

`SAP-QL-004` receives 200 packages because it owns two executable prototype ancestries. Every other QL receives 100 packages.

## 5. Lifecycle boundary

Permanent identity allocation is not publication.

```text
identityStatus:              PERMANENT_ID_ALLOCATED
contentStatus:               ENGLISH_FROZEN
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

The source discovery packages and historical English-freeze candidates retain `permanentQlId: null`. This prevents retrospective mutation of review evidence while the allocated runtime carries the permanent identity.

## 6. Current status

```text
SAP-CP-001 discovery:              complete
English manual freeze:             approved
Product count approval:            approved
Permanent QL allocation:           SAP-QL-001..016
Permanent English runtime proof:   implemented
Hindi/Punjabi localisation:        not started
Question Studio:                   disabled
Question Bank:                     NOT_STORED
Test eligibility:                  INELIGIBLE
Public publication:                false
```

The next checkpoint may begin discovery from `SAP-CP-002`. The next permanent identity remains `SAP-QL-017` until another checkpoint completes its own saturation, English freeze and approval gate.
