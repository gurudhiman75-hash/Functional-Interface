# SYL-001 — QL Consolidation CP-008C

Authority: `SYL_001_QL_ARCHETYPE_CONSOLIDATION_V2`

Status: **compatibility overlay only; current runtime is unchanged**.

## Goal

The current 18 QLs are useful implementation and teaching authorities, but they are not 18 independent mock-test archetypes. CP-008C separates permanent task shapes from premise-vocabulary variants and teaching diagnostics without deleting or renumbering any QL.

## Canonical archetype inventory

```text
Canonical archetypes:       10
Active mock archetypes:      4
Future remodel required:     1
Practice-only archetypes:    2
Training-only archetypes:    3
```

### Active mock archetypes

1. SSC single definite conclusion — canonical legacy QL `SYL-QL-001`.
2. Four-option two-conclusion mask — canonical legacy QL `SYL-QL-003`; applicable to SSC and provisional Punjab Police profiles.
3. Banking five-option two-conclusion/either-or — canonical legacy QL `SYL-QL-008`.
4. Four-option three-conclusion combination — canonical legacy QL `SYL-QL-004`; applicable to Banking, cross-exam and minor Punjab Police coverage.

The Banking authority for the three-conclusion archetype is supported by the RBI Grade B and NABARD source snapshots. This corrects the earlier V1 overlay, which omitted Banking from the profile membership even though the source evidence already included three-conclusion combinations.

### Future remodel

- Banking possibility inside an ordinary conclusion set.
- The current `SYL-QL-005` preserves the semantics for practice, but its standalone selection shell receives zero mock weight until remodeled.

### Practice-only

- non-following inverse practice;
- mixed two-conclusion adapted practice.

### Training-only

- explicit impossibility selection;
- three-label modality classification;
- pair classification.

## Legacy QL disposition

All 18 current QL IDs remain valid for compatibility.

```text
Canonical retain:        4
Compatibility aliases:   6
Remodel to canonical:    2
Training-only:            6
```

Canonical legacy mock authorities:

```text
SYL-QL-001
SYL-QL-003
SYL-QL-004
SYL-QL-008
```

Compatibility aliases receive zero mock weight so the same task archetype is not counted twice.

Aliases:

```text
SYL-QL-010  ONLY content → Banking canonical scenario variant
SYL-QL-011  ONLY two-conclusion → Banking canonical scenario variant
SYL-QL-013  ONLY_A_FEW content → Banking canonical scenario variant
SYL-QL-015  ONLY_A_FEW two-conclusion → Banking canonical scenario variant
SYL-QL-016  mixed two-conclusion → labelled practice archetype
SYL-QL-017  mixed three-conclusion → canonical three-conclusion scenario variant
```

Remodel-required QLs:

```text
SYL-QL-002  non-following inverse task remains practice-only
SYL-QL-005  possibility must move into a standard Banking conclusion set
```

Training-only QLs:

```text
SYL-QL-006
SYL-QL-007
SYL-QL-009
SYL-QL-012
SYL-QL-014
SYL-QL-018
```

## Product rules

- Premise vocabulary such as `ONLY` and `ONLY_A_FEW` is normally a scenario variant, not a separate mock archetype.
- Training diagnostics remain available in lessons and adaptive practice.
- No current QL is removed, renamed or made unreachable.
- Historical generation remains reproducible.
- Only canonical retained QLs may carry positive legacy mock weight.
- Alias activation requires deterministic profile-level selection and regression proof.

## Current profile view

```text
SSC active archetypes:            2
Banking active archetypes:        2
Punjab Police active archetypes:  2
Cross-exam active archetypes:     1
```

The Banking possibility archetype is represented in source authority but remains inactive until the answer shell is remodeled.

## CP-008D handoff

The inactive deterministic profile planner now:

- resolves each provisional exam profile into source-family slots;
- maps active slots only to canonical retained QLs;
- resolves premise-form families as scenario variants;
- excludes compatibility aliases and diagnostics from positive mock weight;
- exposes blocked-remodel and practice-only portions explicitly;
- does not call or modify the public question generator.

## Locks

```text
compatibilityOverlayStatus: COMPATIBILITY_OVERLAY_NOT_ACTIVE
activationPermitted: false
mockWeightingFrozen: false
permanentQlFreezePermitted: false
questionStudioEnabled: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
public: false
```
