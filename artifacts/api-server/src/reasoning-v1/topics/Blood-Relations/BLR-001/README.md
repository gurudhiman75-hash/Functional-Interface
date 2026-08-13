# BLR-001 — Blood Relations

Status: **all seven designed checkpoints implemented; permanent QL range `BLR-QL-001..035`; CP-003 through CP-005 Hindi/Punjabi machine-proved review candidates complete; CP-006 English/Hindi/Punjabi frozen; CP-007 multilingual production-review lifecycle enabled**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. checkpoint-specific source, merge/split, freeze, implementation, remediation and review records;
5. permanent checkpoint runtime contracts and recovery evidence;
6. manifest amendments where present.

## Checkpoint ledger

| Checkpoint | Ownership | Permanent QLs | Current state |
|---|---|---|---|
| `BLR-CP-001` | direct declarative named-person relations | `BLR-QL-001..007` | English discovery frozen; review runtime available |
| `BLR-CP-002` | pointer/photo/portrait/conversation/nested self-reference | `BLR-QL-008` | English discovery frozen; review runtime available |
| `BLR-CP-003` | shared family passages and shared graphs | `BLR-QL-009..012` | English discovery frozen; Hindi/Punjabi machine-proved review candidates complete and product-locked pending human language review |
| `BLR-CP-004` | counts and family composition | `BLR-QL-013..017` | English discovery frozen; zero-count remediation applied; Hindi/Punjabi machine-proved review candidates complete and product-locked pending human language review |
| `BLR-CP-005` | determinacy, possibility and uncertainty | `BLR-QL-018..025` | English discovery frozen; Hindi/Punjabi machine-proved review candidates complete and product-locked pending human language review |
| `BLR-CP-006` | coded relation decoding | `BLR-QL-026..030` | English/Hindi/Punjabi frozen; Hindi/Punjabi Editorial V2 review complete; product delivery locked |
| `BLR-CP-007` | coded relation construction, completion and validation | `BLR-QL-031..035` | English/Hindi/Punjabi frozen; production Question Studio review lifecycle enabled |

The current design contains **seven checkpoints only**. There is no planned `BLR-CP-008` in the authoritative end-to-end design.

`BLR-QL-036` is the next unused Blood Relations identity. It is **unallocated** and must not be interpreted as evidence that another checkpoint is required.

## Permanent QL inventory

```text
BLR-QL-001  RESOLVE_NAMED_PERSON_RELATION
BLR-QL-002  IDENTIFY_PERSON_BY_RELATION
BLR-QL-003  IDENTIFY_PERSON_BY_GENDER
BLR-QL-004  IDENTIFY_ORDERED_RELATION_PAIR
BLR-QL-005  SELECT_RELATION_CLAIM
BLR-QL-006  COMPARE_GENERATIONS
BLR-QL-007  RESOLVE_EXACT_LINEAGE_RELATION
BLR-QL-008  RESOLVE_ANCHORED_ROLE_CHAIN_RELATION

BLR-QL-009  SELECT_UNORDERED_FAMILY_PAIR
BLR-QL-010  IDENTIFY_ALL_MEMBERS_BY_RELATION
BLR-QL-011  IDENTIFY_MEMBER_BY_MARITAL_STATUS
BLR-QL-012  IDENTIFY_PERSON_BY_EXACT_LINEAGE

BLR-QL-013  COUNT_MEMBERS_BY_FILTER
BLR-QL-014  COUNT_RELATIVES_OF_REFERENCE
BLR-QL-015  COUNT_RELATION_PAIRS
BLR-QL-016  COUNT_GENERATIONS
BLR-QL-017  SELECT_FAMILY_COMPOSITION_PROFILE

BLR-QL-018  RESOLVE_INVARIANT_RELATION
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
BLR-QL-023  DETERMINE_COUNT_BOUND
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
BLR-QL-025  RESOLVE_COUNT_DETERMINACY

BLR-QL-026  RESOLVE_CODED_RELATION
BLR-QL-027  IDENTIFY_PERSON_FROM_CODED_GRAPH
BLR-QL-028  DETERMINE_GENDER_FROM_CODED_GRAPH
BLR-QL-029  SELECT_CODED_RELATION_PAIR
BLR-QL-030  RESOLVE_CODED_FAMILY_SET_RELATION

BLR-QL-031  SELECT_CODED_EXPRESSION
BLR-QL-032  COMPLETE_MISSING_CODE_TOKEN
BLR-QL-033  COMPLETE_ORDERED_CODE_TOKEN_PAIR
BLR-QL-034  COMPLETE_MISSING_PERSON
BLR-QL-035  SELECT_CODED_STATEMENT_BY_VALIDITY
```

## Frozen checkpoint inventories

### CP-003

```text
approved English records                  298
shared-passage groups                     102
permanent QLs                               4
range                           BLR-QL-009..012
Hindi machine review candidates           298
Punjabi machine review candidates         298
total localized review candidates         596
localized semantic parity              proved
localized learner-language leak audit  proved
localized human language review        required
localized product delivery              locked
```

The CP-003 localized candidates preserve the frozen English QL ownership, answer positions, answer semantic keys and canonical semantic fingerprints. They are not production-approved variants: Question Studio, Question Bank, mock-test and public-delivery eligibility remain disabled until explicit human Hindi/Punjabi review and a later approval/freeze step.

### CP-004

```text
approved English records                  612
shared-passage groups                     102
permanent QLs                               5
range                           BLR-QL-013..017
independently verified                    612
explicit zero-answer cases                  1
Hindi machine review candidates           612
Punjabi machine review candidates         612
total localized review candidates        1224
localized semantic parity              proved
Hindi residual-English records              0
Punjabi residual-English records            0
target-script gaps                          0
placeholder leaks                           0
localized human language review        required
localized product delivery              locked
```

During current-main recovery, strict CI exposed a historical false-green in CP-004: the runtime required a zero-answer example, but the old workflow masked the failed process through `tee` without `pipefail`. `BLR-CP-004-ZERO-COUNT-RECOVERY-REMEDIATION.md` records the correction. The checkpoint remains 612 canonical records / 102 groups / five QLs; localization adds language variants only and allocates no new QL identity.

The CP-004 localized candidates preserve frozen English source identity, answer objects, counted member/pair identities, option semantic keys, correct answer positions, family-tree semantics and canonical semantic fingerprints. They remain human-language-review blocked and unavailable to Question Studio, Question Bank, mock tests and public delivery.

### CP-005

```text
approved English records                  184
shared model-space groups                  80
permanent QLs                                8
range                           BLR-QL-018..025
enumerated models                          432
Hindi machine review candidates            184
Punjabi machine review candidates          184
total localized review candidates          368
localized semantic parity               proved
query specifications preserved          proved
model spaces preserved                  proved
canonical UNKNOWN diagram nodes            584
Hindi residual-English records               0
Punjabi residual-English records             0
target-script gaps                           0
placeholder leaks                            0
localized human language review        required
localized product delivery              locked
```

CP-005 localization is generated from the frozen bounded model spaces rather than by translating model-audit prose. Each localized question reconstructs the same valid family models, preserves the exact query specification, answer, option semantics, correct answer position, assignments, model fingerprints and canonical semantic fingerprint, and regenerates question-specific Hindi/Punjabi model audits from that semantic evidence. Deliberately unknown gender evidence is unchanged; all 584 canonical `UNKNOWN` diagram-node occurrences are preserved. The localized records remain human-review blocked and unavailable to Question Studio, Question Bank, mock tests and public delivery.

### CP-006

```text
English frozen records                    152
Hindi frozen records                      152
Punjabi frozen records                    152
localized frozen records                  304
total multilingual records                456
source prototypes                          19
source topologies                          17
permanent QLs                               5
range                           BLR-QL-026..030
decoded statement instances               440
localized semantic parity              proved
code keys preserved                    proved
coded statements preserved             proved
query objects preserved                proved
decoded graphs preserved               proved
option semantics preserved             proved
Hindi learner corpus changed            false
Punjabi learner corpus changed          false
localized human language review       complete
multilingual freeze authority  BLR_CP006_MULTILINGUAL_FROZEN
localized product delivery              locked
```

CP-006 localization is generated from the frozen coded-relation semantics rather than by translating the English solver output. Code tokens, all 440 coded assertions, structured query objects, graph edges, permanent QLs, correct answer positions, option semantic keys and canonical semantic fingerprints remain unchanged. Relation/gender/pair labels and all learner-facing explanation layers are localized from those structured semantics.

Final Hindi/Punjabi Editorial V2 review on 2026-08-13 covered representative learner-facing samples from all five CP-006 QLs. The exhaustive language/editorial audits report zero residual-English records, script gaps, cross-script records, placeholders, learner diagnostic leaks, raw diagnostic-label leaks, relation-feedback failures, generic kinship-label failures and missing QL coverage.

The multilingual freeze is approval-only: learner corpus changed `false` in Hindi and Punjabi, semantic parity remains exact, human-review-required count is zero, 304 localized records are frozen, and product-delivery-enabled count remains zero. Question Studio, Question Bank, mock tests and public delivery remain locked pending a separate product-release integration.

### CP-007

```text
English frozen records         168
Hindi frozen records           168
Punjabi frozen records         168
total multilingual records     504
permanent QLs                    5
range                BLR-QL-031..035
```

CP-007 production persistence remains approval-gated: synchronized records enter Question Studio as `unreviewed`; admin approval is required before existing Question Bank conversion and downstream publication workflows. There is no automatic student publication.

## Recovery history

CP-003 through CP-006 were originally completed on historical stacked branches but were not merged into `New-main`. Clean recovery PR `#666` transplanted only their authoritative checkpoint runtime trees and direct manifests onto the then-current `New-main`, preserving current CP-006 compatibility files required by CP-007.

The historical stacked PRs `#308`, `#427`, `#432` and `#443` are closed as superseded and must not be merged.

Merged recovery commit:

```text
42726658c2b0bea80bde1adc2dfc3544251ad3d3
```

The merged `New-main` recovery workflow proves CP-003, CP-004, CP-005, CP-006 and CP-007 together, plus admin TypeScript and the API build.

## Shared reasoning foundation

The chapter shares a typed family graph and relation ontology with:

- parent, child, spouse and sibling primitives;
- ancestry-cycle and structural validity checks;
- deterministic graph reconstruction from learner-visible clues;
- broad, exact-lineage and common in-law kinship closure;
- role-chain and pointer/photo/conversation resolution;
- shared-passage family graphs;
- member, relative, pair, generation and composition counting;
- bounded model enumeration for definite/possible/impossible/indeterminate semantics;
- coded-relation normalization and decoding;
- coded-expression construction and validation;
- deterministic options, misconception diagnostics and graph-derived explanations.

## Authoritative checkpoint records

- `BLR-CP-001/BLR-CP-001-FINAL-DISCOVERY-FREEZE.md`
- `BLR-CP-002/BLR-CP-002-FINAL-DISCOVERY-FREEZE.md`
- `BLR-CP-003/BLR-CP-003-FINAL-DISCOVERY-FREEZE.md`
- `BLR-CP-003/README.md` for the current CP-003 multilingual review-candidate boundary
- `BLR-CP-004/BLR-CP-004-FINAL-DISCOVERY-FREEZE.md`
- `BLR-CP-004/BLR-CP-004-ZERO-COUNT-RECOVERY-REMEDIATION.md`
- `BLR-CP-004/README.md` for the current CP-004 multilingual review-candidate boundary
- `BLR-CP-005/BLR-CP-005-FINAL-DISCOVERY-FREEZE.md`
- `BLR-CP-005/README.md` for the current CP-005 multilingual review-candidate boundary
- `BLR-CP-006/BLR-CP-006-FINAL-DISCOVERY-FREEZE.md`
- `BLR-CP-006/BLR-CP-006-MULTILINGUAL-FREEZE.md`
- `BLR-CP-006/README.md` for the current CP-006 multilingual frozen boundary
- `BLR-CP-007/` frozen English, multilingual and production-lifecycle records

## Release boundary

Checkpoint implementation/freeze state and product delivery state are separate:

- CP-001 and CP-002 remain English review-runtime authorities unless a later explicit product-release gate changes them;
- CP-003 through CP-005 have machine-proved Hindi/Punjabi review candidates but remain human-review-blocked and product-locked;
- CP-006 English/Hindi/Punjabi learner corpora are frozen; Hindi/Punjabi human-language review is complete, but CP-006 remains product-locked and is not enabled in Question Studio, Question Bank, mock tests or public delivery;
- CP-007 alone currently has the multilingual production-review integration described above;
- production publication still follows the existing audited admin approval workflow.
