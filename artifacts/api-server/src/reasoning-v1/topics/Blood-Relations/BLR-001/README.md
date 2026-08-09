# BLR-001 — Blood Relations

Status: **all seven planned English content checkpoints are discovery-frozen; permanent range `BLR-QL-001..035`; chapter-wide English gap audit passed; manual English freeze pending**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. `blr-001-open-ql-discovery.md`;
5. checkpoint-specific source, merge/split, freeze, implementation and review records;
6. `BLR-001-ENGLISH-GAP-AUDIT.md` and its executable proof;
7. manifest amendments for permanent sequential identity.

## Permanent English inventory

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

Next available identity: `BLR-QL-036`. It is unallocated and does not imply a planned `BLR-CP-008`.

## Checkpoint state

| Checkpoint | Ownership | Frozen range |
|---|---|---|
| `BLR-CP-001` | direct, reverse, multi-edge, identity, pair, claim, generation and exact-lineage named-person relations | `BLR-QL-001..007` |
| `BLR-CP-002` | pointer, photograph, portrait, conversation and nested self-reference role chains | `BLR-QL-008` |
| `BLR-CP-003` | shared family passages, pair/set, marital-status and exact-lineage identities | `BLR-QL-009..012` |
| `BLR-CP-004` | definite counts and family composition | `BLR-QL-013..017` |
| `BLR-CP-005` | invariant, possible, impossible, one-of-two, indeterminate and count-bound semantics | `BLR-QL-018..025` |
| `BLR-CP-006` | coded relation decoding | `BLR-QL-026..030` |
| `BLR-CP-007` | coded expression construction, completion and validation | `BLR-QL-031..035` |

## Frozen bank sizes

```text
CP-001 chapter-audit runtime sweep          448
CP-002 chapter-audit runtime sweep           96
CP-003 frozen records                       298
CP-004 frozen records                       612
CP-005 frozen records                       184
CP-006 frozen records                       152
CP-007 frozen records                       168
-----------------------------------------------
chapter-wide audited questions            1,958
```

The CP-001 and CP-002 figures above are deterministic audit sweeps; later checkpoints use their complete frozen banks.

## Chapter-wide English gap proof

The executable audit proves:

```text
planned content checkpoints                       7
permanent QLs                                     35
solve authorities                                 35
exact cross-QL learner-surface collisions          0
normalized cross-QL template collisions            0
learner-text failures                              0
gender-evidence failures                           0
option-contract failures                           0
lifecycle-lock failures                            0
ownership failures                                 0
open included source families                      0
```

Verdict: `CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE`.

A new QL or checkpoint may be created only if a later source audit proves a materially uncovered generator, solver, answer, ambiguity, explanation, localisation or renderer contract.

## Shared guarantees

- graph-first generation and independent clue-only solving;
- parent, spouse and sibling validity with ancestry-cycle rejection;
- exact, broad, in-law, great-generation and exact-lineage closure;
- no closed-world unmarried inference;
- explicit count universes and canonical unordered-pair counting;
- complete bounded model enumeration for uncertainty;
- coded expressions interpreted as directed family assertions, never arithmetic;
- names and letter labels provide no gender evidence;
- every gendered answer has learner-visible gender-bearing evidence;
- four unique options with one independently valid answer;
- personalized explanations, SVG family trees and ASCII fallbacks;
- English review-only lifecycle locks across all permanent QLs.

## Authoritative records

Each checkpoint contains its own final discovery-freeze document, runtime, independent proof and exporter. Chapter-level authority is recorded in:

- `BLR-001-END-TO-END-DESIGN.md`;
- `blr-001-open-ql-discovery.md`;
- `BLR-001-ENGLISH-GAP-AUDIT.md`;
- `blr-001-english-gap-audit.ts`;
- `blr-001-english-gap-audit.test.ts`;
- `export-blr-001-english-gap-audit.ts`.

## Next phase

```text
manual English chapter review and freeze
  -> Hindi and Punjabi localisation
  -> multilingual parity proof
  -> multilingual manual freeze
  -> Question Studio integration
```

No CP-008 implementation is planned at this stage.

## Release boundary

Permanent identity and a green gap audit do not enable delivery:

- English review-only: true;
- manual English freeze: pending;
- Question Studio: disabled;
- Question Bank: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- production staging: disabled;
- merge: not authorised.
