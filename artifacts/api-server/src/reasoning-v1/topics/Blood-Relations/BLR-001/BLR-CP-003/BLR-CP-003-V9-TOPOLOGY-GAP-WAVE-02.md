# BLR-CP-003 — V9 Topology Gap Wave 02

Status: **machine-review candidate; human review pending; structural saturation and all release states blocked**.

## Preserved approvals

The following scopes remain immutable:

```text
V8:          EDITORIAL_STAGING_ONLY
V9 Wave 01: STRUCTURAL_STAGING_ONLY
```

Wave 02 does not inherit either approval.

## Discovery purpose

Wave 02 addresses the principal structural gaps left after approved Wave 01:

1. negative and exclusion-heavy clue systems;
2. explicitly unknown or deliberately unstated spouse boundaries;
3. separation of `unmarried` from `marital status unresolved`;
4. mixed in-law and generation-direction tasks;
5. same relation reached through blood and spouse branches.

## New topologies

```text
UNSTATED_SPOUSE_SINGLE_PARENT_BRANCH
IN_LAW_GENERATION_BRIDGE
FOUR_SIBLING_NEGATIVE_STATUS_GRID
```

These are graph changes, not name or clue-order variants.

## Candidate inventory

```text
candidate records:                    72
shared-passage groups:                18
new graph topologies:                  3
new temporary prototypes:             12
answer positions:            18/18/18/18
independent evidence paths:           120
native SVG diagrams:                  72
ASCII fallbacks:                      72
```

Combined V8 + V9 Wave 01 + Wave 02 discovery evidence:

```text
candidate records:                   298
shared-passage groups:               102
unique graph topologies:               9
unique prototypes:                    29
answer positions:            74/75/75/74
```

Counts are evidence, not completion quotas.

## Authority treatment

Ten prototypes merge provisionally into existing CP-003 pair, complete-set or explicit-status authorities.

The two unresolved-status prototypes introduce one **provisional split candidate**:

```text
IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS
```

This is not a permanent authority and does not receive a QL. The final merge/split audit must determine whether its three-state evidence model—married, explicitly unmarried, unresolved—constitutes a separate solve contract or a parameterised form of `IDENTIFY_MEMBER_BY_MARITAL_STATUS`.

## Boundary rules

Wave 02 enforces:

- parenthood does not prove marriage;
- absence of a named spouse does not prove unmarried status;
- explicit unmarried status and unresolved status are disjoint;
- unknown spouse branches remain usable for blood relations established through a named parent;
- unnamed people never enter name-based answer options;
- no spouse, answer, relation or graph edge is invented to close an unknown boundary.

## Validation requirements

The candidate wave must pass:

1. balanced record and combined-bank telemetry;
2. independent graph-closure verification for all 120 evidence paths;
3. answer-identity verification for all 72 records;
4. unknown-spouse-boundary verification independent of graph relation solving;
5. authority-audit completeness;
6. responsive artifact checks;
7. the historical final-freeze boundary regression.

## Human review focus

Reviewers should check:

- whether negative clues remain natural rather than artificial logic-game wording;
- whether every unknown spouse boundary is unmistakably unresolved;
- whether explanations consistently avoid inferring marriage from parenthood;
- whether mixed relation pairs are exam-realistic;
- whether distractors fail for one clear relational or status reason;
- whether the unresolved-status contract should merge or split.

## Release boundary

```text
Wave 02 human review:                    false
Wave 02 structural-staging approval:     false
structural saturation:                   false
final discovery freeze:                  false
permanent CP-003 QLs:                    0
next available QL:                       BLR-QL-009
Question Studio:                         disabled
Question Bank:                           disabled
mock tests:                              disabled
localisation:                            disabled
public publication:                      disabled
merge:                                   not authorised
```

## Next gate

```text
machine validation and artifact review
  -> manual editorial/technical review of Wave 02
  -> remediation layer if required
  -> scoped structural-staging approval only after review
  -> combined repetition and difficulty audit
  -> cross-checkpoint overlap and final merge/split audit
  -> saturation decision
  -> discovery freeze and permanent QL allocation only after all gates pass
```
