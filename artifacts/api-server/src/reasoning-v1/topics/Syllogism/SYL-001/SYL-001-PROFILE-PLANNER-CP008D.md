# SYL-001 — Deterministic Profile Planner CP-008D

Authority: `SYL_001_PROFILE_PLAN_V1`

Status: **planner only; not connected to the question generator**.

## Purpose

CP-008D translates each provisional 100-point target mix into a deterministic sequence of canonical archetype slots. It is evidence for future weighting implementation, not an active runtime selector.

The planner:

- accepts a profile, seed and requested count;
- expands each 100-point mix exactly;
- deterministically shuffles each 100-slot cycle;
- maps source families to canonical archetypes and scenario variants;
- labels every slot as active, blocked-remodel or practice-only;
- never selects a compatibility alias;
- never calls the current question generator;
- keeps activation disabled.

## Supported planning profiles

```text
SSC
BANKING
PUNJAB_POLICE
CROSS_EXAM_PRACTICE
```

## Exact 100-slot readiness result

### SSC

```text
Active canonical: 90
Practice-only:     10
Blocked remodel:    0
```

The 10% advanced three-conclusion component is cross-adapted practice and is not currently SSC mock-authentic. Therefore, the existing provisional SSC mix is not ready for direct mock activation without either removing or separately labelling that component.

### Banking

```text
Active canonical: 80
Blocked remodel:  20
Practice-only:      0
```

The 20% blocked portion is the source-authentic possibility conclusion inside a standard Banking conclusion set. Its canonical answer shell does not yet exist.

### Punjab Police

```text
Active canonical: 100
Blocked remodel:    0
Practice-only:       0
```

The task shapes are structurally available through the two- and three-conclusion canonical QLs. The profile remains provisional because the source ledger is a 12-question secondary official-paper-tagged sample rather than a frozen official corpus.

### Cross-exam practice

```text
Active canonical: 60
Practice-only:     40
Blocked remodel:    0
```

This is explicitly a practice profile, not a target mock profile.

## Determinism contract

- The same profile, seed and count returns an identical plan.
- Different seeds change ordering while preserving complete-cycle weights.
- Every complete 100-slot cycle exactly matches the authority weights.
- Counts from 1 through 1000 are supported for audit purposes.
- Only canonical retained QLs may appear as active QL authorities:

```text
SYL-QL-001
SYL-QL-003
SYL-QL-004
SYL-QL-008
```

## What remains before activation

1. Remodel the Banking possibility family into a standard conclusion-combination shell.
2. Decide whether SSC advanced three-conclusion material belongs in mock, sectional practice or an advanced add-on.
3. Add scenario-level bindings for each family and target difficulty band.
4. Generate profile packs and review distribution, repetition and answer balance.
5. Expand source ledgers, especially for Punjab-state exams beyond Punjab Police.
6. Add integration regressions proving that the planner cannot select aliases or diagnostics.

## Locks

```text
plannerStatus: PLANNER_ONLY_NOT_CONNECTED_TO_GENERATOR
activationPermitted: false
mockWeightingFrozen: false
permanentQlFreezePermitted: false
questionStudioEnabled: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
public: false
```
