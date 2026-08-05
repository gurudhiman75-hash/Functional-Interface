# MAL-CP-003 Wave 10 — Coverage Closure and Freeze-Blocker Verdict

Status: **current frontier classified completely; not ready to freeze**.

## Purpose

Wave 10 converts the accumulated discovery, source, equivalence, adversarial and runtime evidence into one chapter-wide coverage matrix. It answers four questions for every current candidate:

1. Is it a distinct source-backed learner contract?
2. Is it only a representation of another contract?
3. Is it mathematically distinct but still blocked by source or policy evidence?
4. Does another checkpoint own it?

This checkpoint does not allocate permanent QLs or reserve `MAL-QL-029`.

## Closed representation decisions

Two executable candidates are now closed as representations under the source-backed final-original-quantity contract:

```text
MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS
MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS
```

They merge into:

```text
MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS
```

The reasons are exact and executable:

- final original fraction × known initial pure quantity = final original quantity;
- final refill quantity + final original quantity = fixed vessel volume.

Wave 10 proves each identity across 400 deterministic states. Fraction output and requested refill-component wording remain legitimate stem, option and answer variants, but they do not create separate QL identities.

## Source-backed runtime-ready contracts

Five distinct contracts now have direct source support and executable learner runtime:

```text
MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS
MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL
MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS
MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO
MAL-CP003-PROT-MINIMUM-OPERATIONS-TO-CROSS-ORIGINAL-QUANTITY-THRESHOLD
```

The minimum-threshold contract remains separate from exact operation-count reconstruction. Threshold questions ask for the first stage satisfying a strict inequality; exact-count questions ask for equality with a supplied final state.

## Distinct contracts that still block freeze

Four mathematically distinct contracts retain executable discovery runtime but cannot yet be frozen:

### Initial original-component quantity from final evidence

Blockers:

```text
DIRECT_OUTPUT_MATCHED_SOURCE
NON_PURE_INITIAL_STATE_DETERMINACY_POLICY
```

The recovered public banking item asks for the complementary initial component, not the current named-original output.

### Exact operation count from exact final quantity

Blockers:

```text
DIRECT_EXACT_EQUALITY_OPERATION_COUNT_SOURCE
MAXIMUM_OPERATION_DOMAIN_AUTHORITY
NO_SOLUTION_AND_MULTIPLE_SOLUTION_POLICY
```

This contract cannot borrow authority from the minimum-threshold task.

### Unequal replacement stages

Blockers:

```text
AUTHORITATIVE_UNEQUAL_STAGE_EXAM_SOURCE
UNEQUAL_STAGE_ORDER_AND_DIFFICULTY_CALIBRATION
```

The existing public item remains a discovery lead rather than freeze authority.

### Third-liquid multi-stage composition

Blockers:

```text
AUTHORITATIVE_THIRD_LIQUID_EXAM_SOURCE
CP003_VERSUS_CP006_OWNERSHIP_CLOSURE
THREE_COMPONENT_OUTPUT_ORDER_POLICY
```

The vector-ledger mathematics is distinct, but direct source authority and the boundary with later multi-vessel work remain open.

## Ownership exclusion

```text
MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY
```

is excluded to `MAL-CP-004`. A replacement liquid with its own non-zero concentration requires conserved-solute accounting rather than pure original-component retention.

## Current closed inventory

```text
Discovery candidates:                 12
Source-backed distinct contracts:      5
Merged representation variants:        2
Provisional blocker contracts:         4
Excluded to MAL-CP-004:                1
Effective MAL-CP-003 contracts:        9
Runtime-covered non-excluded items:    11
Permanent QLs:                          0
Frozen solve modes:                     0
Freeze readiness:                   false
MAL-QL-029 reserved:                false
```

The effective count of nine is a discovery result, not a frozen QL count. Four of those nine contracts remain provisional and may later be admitted, merged, reassigned or deferred depending on direct evidence.

## Executable proof

The Wave 10 audit performs:

```text
160 existing discovery-runtime regressions
100 Wave 07 source-runtime regressions
100 Wave 09 source-runtime regressions
400 final-fraction merge proofs
400 final-refill complement merge proofs
```

It also verifies that all eleven non-excluded candidates have inactive executable runtime coverage and that every lifecycle flag remains disabled.

## Freeze verdict

```text
BLOCKED_BY_FOUR_DISTINCT_SOURCE_AND_POLICY_CONTRACTS
```

The chapter must not allocate `MAL-QL-029` yet. The next work should target the four explicit blockers rather than expanding context skins or creating representation-only QLs.
