# ExamTree Reasoning V1 — OPS-001 Final QL Manifest

Status: **QL inventory frozen at 31; production and Question Studio wiring remain separate implementation gates.**

Freeze version: `OPS_001_QL_FREEZE_V1`

Freeze date: **2026-07-27**

## 1. Freeze basis

The permanent inventory is frozen only after completion of:

```text
structural source saturation                         PASS
nine-checkpoint topology                             PASS
exact rational/token/AST foundation                  PASS
34 pre-merge executable candidate runtimes           PASS
runtime consolidation                                34 -> 31
approved V3 English teaching runtime                 PASS
English manual review                                PASS
all-contract Hindi runtime and manual review          PASS
all-contract Punjabi runtime and manual review        PASS
targeted localized option correction                  PASS
device/glyph proof at 360/390/768/1280 px             PASS
final source-to-runtime ledger                        PASS
sync with current New-main                            PASS
```

No material contract split was discovered by the final localization, option, device or source-ledger audits. The evidence therefore supports freezing the logical count at **31**.

## 2. Permanent checkpoint ranges

| Checkpoint | Permanent range | Count | Ownership |
|---|---:|---:|---|
| `OPS-CP-001` | `OPS-QL-001`–`OPS-QL-002` | 2 | supplied arithmetic-sign mappings |
| `OPS-CP-002` | `OPS-QL-003`–`OPS-QL-005` | 3 | arbitrary and word operation tokens |
| `OPS-CP-003` | `OPS-QL-006`–`OPS-QL-007` | 2 | mixed arithmetic/relation mappings |
| `OPS-CP-004` | `OPS-QL-008`–`OPS-QL-011` | 4 | missing and inserted operators/relations |
| `OPS-CP-005` | `OPS-QL-012`–`OPS-QL-017` | 6 | operator and operator/relation interchange |
| `OPS-CP-006` | `OPS-QL-018`–`OPS-QL-020` | 3 | complete whole-number interchange |
| `OPS-CP-007` | `OPS-QL-021`–`OPS-QL-023` | 3 | global digit-identity interchange |
| `OPS-CP-008` | `OPS-QL-024`–`OPS-QL-027` | 4 | compound operator/value transformations |
| `OPS-CP-009` | `OPS-QL-028`–`OPS-QL-031` | 4 | hidden operator and mixed mappings |
| **Total** | `OPS-QL-001`–`OPS-QL-031` | **31** | — |

## 3. Permanent QL allocation

| QL ID | CP | Canonical runtime contract | Solve mode |
|---|---|---|---|
| `OPS-QL-001` | `OPS-CP-001` | `OPS-CAND-001` | `evaluateAfterGivenArithmeticSignMapping` |
| `OPS-QL-002` | `OPS-CP-001` | `OPS-CAND-003` | `selectEquationByTruthAfterGivenArithmeticMapping` |
| `OPS-QL-003` | `OPS-CP-002` | `OPS-CAND-004` | `evaluateAfterGivenArbitraryTokenMapping` |
| `OPS-QL-004` | `OPS-CP-002` | `OPS-CAND-005` | `evaluateAfterGivenWordTokenMapping` |
| `OPS-QL-005` | `OPS-CP-002` | `OPS-CAND-007` | `selectEquationByTruthAfterArbitraryTokenMapping` |
| `OPS-QL-006` | `OPS-CP-003` | `OPS-CAND-008` | `selectStatementByTruthAfterMixedMapping` |
| `OPS-QL-007` | `OPS-CP-003` | `OPS-CAND-009` | `recoverMissingRelationTokenAfterMixedMapping` |
| `OPS-QL-008` | `OPS-CP-004` | `OPS-CAND-010` | `recoverSingleMissingArithmeticOperator` |
| `OPS-QL-009` | `OPS-CP-004` | `OPS-CAND-011` | `recoverSingleMissingRelationOperator` |
| `OPS-QL-010` | `OPS-CP-004` | `OPS-CAND-012` | `fillOrderedOperatorsWithFixedRelation` |
| `OPS-QL-011` | `OPS-CP-004` | `OPS-CAND-013` | `fillOrderedOperatorsIncludingRelationPosition` |
| `OPS-QL-012` | `OPS-CP-005` | `OPS-CAND-014` | `evaluateAfterSpecifiedSingleOperatorPairSwap` |
| `OPS-QL-013` | `OPS-CP-005` | `OPS-CAND-015` | `evaluateAfterSpecifiedDoubleOperatorPairSwap` |
| `OPS-QL-014` | `OPS-CP-005` | `OPS-CAND-016` | `identifySingleOperatorPairSwapForEquation` |
| `OPS-QL-015` | `OPS-CP-005` | `OPS-CAND-017` | `identifyTwoOperatorPairSwapsForEquation` |
| `OPS-QL-016` | `OPS-CP-005` | `OPS-CAND-018` | `identifyArithmeticRelationPairSwapForEquation` |
| `OPS-QL-017` | `OPS-CP-005` | `OPS-CAND-019` | `selectEquationByTruthAfterSpecifiedOperatorSwap` |
| `OPS-QL-018` | `OPS-CP-006` | `OPS-CAND-020` | `identifyWholeNumberPairSwapForEquation` |
| `OPS-QL-019` | `OPS-CP-006` | `OPS-CAND-021` | `evaluateAfterSpecifiedWholeNumberSwap` |
| `OPS-QL-020` | `OPS-CP-006` | `OPS-CAND-022` | `selectEquationByTruthAfterSpecifiedWholeNumberSwap` |
| `OPS-QL-021` | `OPS-CP-007` | `OPS-CAND-023` | `identifyGlobalDigitPairSwapForEquation` |
| `OPS-QL-022` | `OPS-CP-007` | `OPS-CAND-024` | `evaluateAfterSpecifiedGlobalDigitSwap` |
| `OPS-QL-023` | `OPS-CP-007` | `OPS-CAND-025` | `selectEquationByTruthAfterSpecifiedGlobalDigitSwap` |
| `OPS-QL-024` | `OPS-CP-008` | `OPS-CAND-026` | `identifyOperatorAndWholeNumberPairSwap` |
| `OPS-QL-025` | `OPS-CP-008` | `OPS-CAND-027` | `identifyOperatorAndDigitPairSwap` |
| `OPS-QL-026` | `OPS-CP-008` | `OPS-CAND-028` | `evaluateAfterSpecifiedCompoundSwap` |
| `OPS-QL-027` | `OPS-CP-008` | `OPS-CAND-029` | `selectEquationByTruthAfterSpecifiedCompoundSwap` |
| `OPS-QL-028` | `OPS-CP-009` | `OPS-CAND-030` | `inferArithmeticOperatorMappingThenEvaluateTarget` |
| `OPS-QL-029` | `OPS-CP-009` | `OPS-CAND-032` | `inferOperatorMappingThenSelectEquationByTruth` |
| `OPS-QL-030` | `OPS-CP-009` | `OPS-CAND-033` | `recoverOneUnknownOperatorMeaning` |
| `OPS-QL-031` | `OPS-CP-009` | `OPS-CAND-034` | `inferMixedArithmeticRelationMappingThenSelectStatement` |

## 4. Merged presentation aliases

The following pre-merge candidates do not receive permanent IDs:

```text
OPS-CAND-002 result-slot presentation -> OPS-QL-001
OPS-CAND-006 result-slot presentation -> OPS-QL-003
OPS-CAND-031 result-slot presentation -> OPS-QL-028
```

They remain optional presentation modes of their destination QLs. They must never be counted as separate QLs by analytics, selection, publishing or Question Studio.

## 5. Canonical executable registry

Permanent ownership is encoded in:

```text
registry/ops-ql-registry.ts
registry/ops-ql-registry.test.ts
```

The registry:

- binds every permanent QL to exactly one retained canonical runtime contract;
- binds every QL to one frozen checkpoint;
- records source families, ambiguity pool and explanation strategy;
- exposes English and localized generation through permanent QL IDs;
- rejects checkpoint or solve-mode drift;
- proves continuous IDs and complete 31-contract coverage;
- preserves the three merged presentation aliases explicitly.

## 6. Frozen versus still blocked

### Frozen

```text
checkpoint topology               9 checkpoints
permanent QL count                31
permanent QL IDs                  OPS-QL-001 through OPS-QL-031
checkpoint ranges                 allocated
candidate-to-QL ownership         final
source-family ownership           final for V1 boundary
English/Hindi/Punjabi teaching    approved V3 standard
```

### Still blocked

```text
production generation-engine registration
admin and Question Studio exposure
student test delivery wiring
analytics/event registration
chapter publication
```

Those are implementation and integration tasks. They must consume the permanent registry and may not redefine QL identity.

## 7. Change-control rule

After this freeze, a new OPS QL may be added only if source and runtime evidence proves a material uncovered difference in at least one of:

```text
transformation rule
student action or inverse topology
answer semantic
ambiguity pool
relation-boundary behaviour
localization mode
explanation strategy
distractor architecture
```

Operand size, wording, bracket count, polarity, decimal use, repeated tokens or result-slot presentation alone do not justify a new QL.
