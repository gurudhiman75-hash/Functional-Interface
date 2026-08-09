# BLR-CP-003 — Final English Discovery Freeze

Status: **checkpoint complete; English discovery frozen; permanent review runtime available; release surfaces locked**.

## Owner directive

On 2026-08-01, the project owner directed:

> FINISH CP

This directive authorizes completion of the remaining CP-003 discovery gates. It does not authorize merging PR #308 or enabling production surfaces.

## Approved evidence bank

```text
approved records                         298
shared-passage groups                    102
graph topologies                           9
source prototypes                         29
final solve authorities                    4
answer positions                 [74,75,75,74]
```

The final bank combines:

```text
V8 editorial baseline                    130
V9 Wave 01 structural staging             96
V9 Wave 02 structural staging             72
```

Counts are the result of discovery and gap audits, not predetermined quotas.

## Final authority decisions

```text
BLR-QL-009  SELECT_UNORDERED_FAMILY_PAIR
BLR-QL-010  IDENTIFY_ALL_MEMBERS_BY_RELATION
BLR-QL-011  IDENTIFY_MEMBER_BY_MARITAL_STATUS
BLR-QL-012  IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

The provisional `IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS` candidate merges into `BLR-QL-011` as a target-status parameter. The answer remains one person name, the candidate scan is unchanged and the three evidence states—married, explicitly unmarried and unresolved—are instance values inside one solve contract.

The next available chapter identity is `BLR-QL-013`.

## Cross-checkpoint ownership

Shared-passage variants of named-person relation, person-by-relation, person-by-gender, relation-claim, generation-comparison and exact-lineage-relation items continue to use `BLR-QL-001`, `BLR-QL-002`, `BLR-QL-003`, `BLR-QL-005`, `BLR-QL-006` and `BLR-QL-007` respectively. Introduction and photograph relation solving remains owned by `BLR-QL-008` in BLR-CP-002.

CP-003 receives permanent identities only for answer contracts that are not already owned elsewhere.

## Structural saturation

The combined bank closes the audited structural gaps:

- unordered spouse, sibling, parent-child and mixed-relation pairs;
- complete relation sets across blood and spouse branches;
- explicit married, explicit unmarried and unresolved marital-status identification;
- maternal, paternal and deeper exact-lineage person identification;
- negative and exclusion-heavy clue systems;
- deliberately unnamed spouse boundaries;
- multi-married sibling and in-law systems;
- dual maternal/paternal branches;
- four-generation asymmetric lineages;
- unequal cousin branches;
- relations reached independently through blood and spouse paths.

No remaining gap changes the answer domain, solve procedure, uniqueness rule or graph-boundary policy of the four frozen authorities.

## Permanent review runtime

`cp003-permanent-runtime.ts` provides deterministic generation for:

1. one permanent QL item by QL ID and seed;
2. one intact shared-passage question group by seed.

The runtime removes prototype-only identity, assigns permanent QLs and preserves the reviewed stem, options, evidence paths, family diagram and explanation. It remains English review-only.

## Release boundary

```text
structural saturation                    approved
final English discovery freeze           approved
permanent CP-003 QLs                      4
permanent QL range                        BLR-QL-009..BLR-QL-012
next available chapter QL                BLR-QL-013
Question Studio                          disabled
Question Bank                            disabled
mock tests                               disabled
Hindi/Punjabi localisation               disabled
public publication                       disabled
production staging                       disabled
PR #308 merge                            not authorised
```

The checkpoint is complete at the discovery and permanent review-runtime level. Later localisation, production staging and merge require their own gates.
