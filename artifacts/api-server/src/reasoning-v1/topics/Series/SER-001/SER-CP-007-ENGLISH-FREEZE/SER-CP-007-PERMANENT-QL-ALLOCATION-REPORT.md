# SER-CP-007 — Permanent QL Allocation Report

**Chapter:** `SER-001 — Series`  
**Checkpoint:** `SER-CP-007`  
**Product-owner approval:** recorded on 2026-08-07  
**Allocated range:** `SER-QL-001..SER-QL-013`  
**Next available chapter identity:** `SER-QL-014`  
**Runtime status:** allocated but inactive

## 1. Allocation decision

The approved 13-authority English model is assigned permanent chapter-wide Question Logic identities.

```text
Discovery authorities:            17
Frozen solve contracts:           13
Frozen prototype templates:      140
Frozen learner release pools:    135
Permanent QLs allocated:          13
Active/public QLs:                  0
```

The count is the result of source closure, collision review, merge/split decisions, V7.1 editorial remediation, production metadata proof, assembler pool enforcement and product-owner approval. It is not a quota.

## 2. Immutable allocation

| Permanent QL | Approved solve contract | Prototype templates |
|---|---|---:|
| `SER-QL-001` | Alphabet-complement group sequence | 8 |
| `SER-QL-002` | Fixed column-wise letter movement | 19 |
| `SER-QL-003` | Progressive column-wise letter movement | 4 |
| `SER-QL-004` | Cumulative prefix growth | 4 |
| `SER-QL-005` | Directional consecutive-letter blocks | 8 |
| `SER-QL-006` | Edge-deletion word sequence | 10 |
| `SER-QL-007` | Interleaved letter-group rows | 17 |
| `SER-QL-008` | Marker movement over a periodic frame | 20 |
| `SER-QL-009` | Patterned interior insertion growth | 8 |
| `SER-QL-010` | Periodic block and gap completion | 4 |
| `SER-QL-011` | Position permutation of letter groups | 21 |
| `SER-QL-012` | Progressive positional substitution | 12 |
| `SER-QL-013` | Symmetric edge growth | 5 |
| **Total** |  | **140** |

These identities must not be renumbered, reused or silently repurposed. A later material gap requires an explicit reopen decision and a new identity beginning at `SER-QL-014`.

## 3. Registry authority

The chapter-wide permanent identity authority is:

```text
SER-PERMANENT-QL-REGISTRY.ts
```

It records:

- the explicit authority-to-QL mapping;
- title, solve contract and answer semantic;
- proof model and learner renderer;
- exact prototype-template count;
- discovery-authority ancestry;
- English-freeze and product-approval status;
- localization status;
- inactive lifecycle locks;
- the next available identity, `SER-QL-014`.

The historical discovery and candidate registries remain unchanged. Permanent runtime packages wrap the approved evidence and bind it to the registry without mutating old records.

## 4. Permanent runtime contract

The inactive permanent runtime binds:

```text
permanent QL
+ frozen prototype template
+ stored subtype metadata
+ deterministic seed
+ V7.1 English renderer and explanation
```

Regeneration validates the stored subtype and learner-renderer metadata before generating the question. This is especially important for merged authorities such as position permutation, interleaving, directional consecutive blocks and periodic block completion.

The permanent allocation proof samples ten deterministic seeds from every prototype template:

```text
Permanent runtime packages:            1,400
Permanent QLs reached:                    13
Deterministic regeneration proofs:      1,400 required
Four-unique-option proofs:              1,400 required
Explanation-contract proofs:           1,400 required
Lifecycle-lock proofs:                 1,400 required
Historical evidence mutations:             0 required
```

The V7.1 PRIMARY selector is also rerun across three seeds from all 140 templates and must preserve:

```text
Independent release pools: 135
Standard PRIMARY:            96
Advanced PRIMARY:            39
Standard answer positions:   24 / 24 / 24 / 24
Advanced answer positions:   10 / 10 / 10 / 9
```

## 5. Lifecycle boundary

Permanent identity allocation is not activation or publication.

```text
identityStatus:              PERMANENT_ID_ALLOCATED
contentStatus:               ENGLISH_FROZEN
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
localizationStatus:          NOT_STARTED
```

The permanent registry exists so later localization and integration work can target stable identities without exposing unfinished content.

## 6. Current status

```text
SER-CP-007 discovery:               COMPLETE
Source ledger and collision audit:  COMPLETE
V7.1 release remediation:           COMPLETE
English manual freeze:              APPROVED
Authority model:                    13 CONTRACTS FROZEN
Permanent QL allocation:            SER-QL-001..013
Permanent English runtime:          IMPLEMENTED_INACTIVE
Hindi/Punjabi localization:         NOT_STARTED
Question Studio:                    DISABLED
Question Bank writes:               DISABLED
Test eligibility:                   INELIGIBLE
Public publication:                 false
```

## 7. Next authority

```text
SER_CP007_HINDI_PUNJABI_LOCALIZATION_AND_PARITY_PROOF
```

Localization must not create new QL identities. It must attach locale-specific learner language to the same `SER-QL-001..SER-QL-013` solve contracts and prove answer, difficulty, renderer, release-tier and release-pool parity before any activation proposal.
