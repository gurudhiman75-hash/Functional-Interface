# ExamTree Reasoning V1 — OPS-001 Final Source-to-Runtime Ledger

Status: **complete logical-contract ledger; device/glyph proof is the remaining technical freeze gate.**

## 1. Ledger basis

This ledger reconciles:

- the source-family audit;
- the provisional coverage manifest;
- the checkpoint consolidation audit;
- all 34 pre-merge executable pilots;
- the runtime merge audit;
- the approved V3 English teaching runtime;
- the accepted Hindi/Punjabi runtime and manual reviews.

The ledger uses the **31 retained logical contracts**, not the 34 pre-merge pilot IDs.

```text
OPS-CAND-002 -> OPS-CAND-001
OPS-CAND-006 -> OPS-CAND-004
OPS-CAND-031 -> OPS-CAND-030
```

Those three forms remain presentation modes of their destination contracts and do not own independent solver, ambiguity or explanation topology.

## 2. Canonical runtime boundary

Every retained contract is exposed through:

```text
approved-teaching-canonical.ts
  -> approved-teaching-entry.ts
  -> approved-teaching-runtime.ts / curated canonical runtime
  -> approved-localization-entry.ts
```

Special corrected ownership:

- `OPS-CAND-016` and `OPS-CAND-027` use curated complete-pool runtimes in `approved-teaching-entry.ts` because the original pilot sources admitted one-sided interchange forms.
- `OPS-CAND-028` and `OPS-CAND-029` use canonical complete-number compound runtimes in `approved-teaching-canonical.ts` because the rejected random subtype could omit one stated operator.
- all other retained contracts route through the approved V3 teaching runtime and exact foundation.

## 3. Final 31-contract ledger

| Retained contract | CP | Consolidated manifest ownership | Source families | Canonical solve mode | Primary ambiguity pool | Approved explanation strategy | Runtime owner | Verdict |
|---|---|---|---|---|---|---|---|---|
| `OPS-CAND-001` | `OPS-CP-001` | A1; absorbs A2 / candidate 002 result-slot mode | `01`, `16` | `evaluateAfterGivenArithmeticSignMapping` | `GIVEN_MAPPING_EVAL` | map → visibly replace → exact evaluation | approved runtime | retain |
| `OPS-CAND-003` | `OPS-CP-001` | A3 | `01`, `14` | `selectEquationByTruthAfterGivenArithmeticMapping` | `GIVEN_MAPPING_EQUATION` | map common expression → evaluate → select matching equation | approved runtime | retain |
| `OPS-CAND-004` | `OPS-CP-002` | B1; absorbs B2 / candidate 006 result-slot mode | `02` | `evaluateAfterGivenArbitraryTokenMapping` | `ARBITRARY_TOKEN_EVAL` | decode neutral token key → substitute → evaluate | approved runtime | retain |
| `OPS-CAND-005` | `OPS-CP-002` | B1 language-adapted split | `02` | `evaluateAfterGivenWordTokenMapping` | `ARBITRARY_TOKEN_EVAL` | decode locale word operators → substitute → evaluate | approved runtime | retain; locale-material |
| `OPS-CAND-007` | `OPS-CP-002` | B3 | `02`, `14` | `selectEquationByTruthAfterArbitraryTokenMapping` | `GIVEN_MAPPING_EQUATION` | decode tokens → evaluate common target → select equation | approved runtime | retain |
| `OPS-CAND-008` | `OPS-CP-003` | C1; absorbs provisional C3 | `03`, `14` | `selectStatementByTruthAfterMixedMapping` | `MIXED_RELATION` | replace arithmetic and relation tokens → check every option | approved runtime | retain |
| `OPS-CAND-009` | `OPS-CP-003` | C2 | `03` | `recoverMissingRelationTokenAfterMixedMapping` | `MIXED_RELATION` | evaluate coded sides → determine relation → convert back to token | approved runtime | retain |
| `OPS-CAND-010` | `OPS-CP-004` | D1 | `04` | `recoverSingleMissingArithmeticOperator` | `FILL_SINGLE` | test complete arithmetic-operator pool | approved runtime | retain |
| `OPS-CAND-011` | `OPS-CP-004` | direct missing-relation gap discovered after provisional manifest | `04` | `recoverSingleMissingRelationOperator` | `FILL_SINGLE` | evaluate both sides → compare exact values | approved runtime | retain |
| `OPS-CAND-012` | `OPS-CP-004` | D2; absorbs D4 relation-kind parameter | `04` | `fillOrderedOperatorsWithFixedRelation` | `FILL_SEQUENCE` | insert ordered symbols → apply precedence → verify relation | approved runtime | retain |
| `OPS-CAND-013` | `OPS-CP-004` | D3 | `05` | `fillOrderedOperatorsIncludingRelationPosition` | `FILL_SEQUENCE` | insert sequence → rediscover relation boundary → verify | approved runtime | retain |
| `OPS-CAND-014` | `OPS-CP-005` | E1 | `06` | `evaluateAfterSpecifiedSingleOperatorPairSwap` | `OPERATOR_SWAP` | show both directions → transform whole expression → evaluate | approved runtime | retain |
| `OPS-CAND-015` | `OPS-CP-005` | E2 | `15` | `evaluateAfterSpecifiedDoubleOperatorPairSwap` | `OPERATOR_SWAP` | show four replacement directions → transform once → evaluate | approved runtime | retain; source-backed double pair |
| `OPS-CAND-016` | `OPS-CP-005` | E3 | `07`, `17` | `identifySingleOperatorPairSwapForEquation` | `OPERATOR_SWAP` | enumerate visible two-way pairs → rebuild equation → prove unique | curated entry runtime | retain; corrected source form |
| `OPS-CAND-017` | `OPS-CP-005` | E4 | `15` | `identifyTwoOperatorPairSwapsForEquation` | `OPERATOR_SWAP` | apply two disjoint pairs → exclude simpler one-pair repairs | approved runtime | retain |
| `OPS-CAND-018` | `OPS-CP-005` | E5 | `08` | `identifyArithmeticRelationPairSwapForEquation` | `OPERATOR_RELATION_SWAP` | swap relation/operator → rediscover equation boundary → verify | approved runtime | retain |
| `OPS-CAND-019` | `OPS-CP-005` | E6 | `06`, `14` | `selectEquationByTruthAfterSpecifiedOperatorSwap` | `OPERATOR_SWAP` | apply same two-way swap to options → select true equation | approved runtime | retain |
| `OPS-CAND-020` | `OPS-CP-006` | F1 | `09` | `identifyWholeNumberPairSwapForEquation` | `NUMBER_SWAP` | enumerate complete-number tokens → swap globally → prove unique | approved runtime | retain |
| `OPS-CAND-021` | `OPS-CP-006` | F2 | `09` | `evaluateAfterSpecifiedWholeNumberSwap` | `NUMBER_SWAP` | swap complete numbers, not digits → evaluate | approved runtime | retain |
| `OPS-CAND-022` | `OPS-CP-006` | F3 | `09`, `14` | `selectEquationByTruthAfterSpecifiedWholeNumberSwap` | `NUMBER_SWAP` | apply complete-number swap to every option → select truth | approved runtime | retain |
| `OPS-CAND-023` | `OPS-CP-007` | G1 | `10` | `identifyGlobalDigitPairSwapForEquation` | `DIGIT_SWAP` | enumerate digit pairs → rebuild literals → reject leading zero → prove unique | approved runtime | retain |
| `OPS-CAND-024` | `OPS-CP-007` | G2 | `10` | `evaluateAfterSpecifiedGlobalDigitSwap` | `DIGIT_SWAP` | swap digit identities globally → rebuild numerals → evaluate | approved runtime | retain |
| `OPS-CAND-025` | `OPS-CP-007` | G3 | `10`, `14` | `selectEquationByTruthAfterSpecifiedGlobalDigitSwap` | `DIGIT_SWAP` | apply global digit swap to options → select truth | approved runtime | retain |
| `OPS-CAND-026` | `OPS-CP-008` | H1; absorbs wording-only H3 where topology matches | `11` | `identifyOperatorAndWholeNumberPairSwap` | `COMPOUND_SWAP` | apply operator and complete-number swaps from original → prove unique | approved runtime | retain |
| `OPS-CAND-027` | `OPS-CP-008` | H2 | `12` | `identifyOperatorAndDigitPairSwap` | `COMPOUND_SWAP` | enumerate operator × digit pool → rebuild literals → prove unique | curated entry runtime | retain; corrected source form |
| `OPS-CAND-028` | `OPS-CP-008` | H4 canonical operator + complete-number subtype | `11` | `evaluateAfterSpecifiedCompoundSwap` | `COMPOUND_SWAP` | show both transformation components → transform original → evaluate | canonical runtime | retain; invalid random subtype removed |
| `OPS-CAND-029` | `OPS-CP-008` | H5 canonical operator + complete-number subtype | `11`, `14` | `selectEquationByTruthAfterSpecifiedCompoundSwap` | `COMPOUND_SWAP` | apply full compound transform to options → select matching equation | canonical runtime | retain; invalid random subtype removed |
| `OPS-CAND-030` | `OPS-CP-009` | I1; absorbs I2 / candidate 031 result-slot mode | `13` | `inferArithmeticOperatorMappingThenEvaluateTarget` | `HIDDEN_MAPPING` | eliminate alternative meanings from evidence → substitute target → evaluate | approved runtime | retain |
| `OPS-CAND-032` | `OPS-CP-009` | I3 | `13`, `14` | `inferOperatorMappingThenSelectEquationByTruth` | `HIDDEN_MAPPING` | infer unique mapping → evaluate target → select equation | approved runtime | retain |
| `OPS-CAND-033` | `OPS-CP-009` | I4 | `13` | `recoverOneUnknownOperatorMeaning` | `HIDDEN_MAPPING` | test all eligible operation meanings → retain one | approved runtime | retain |
| `OPS-CAND-034` | `OPS-CP-009` | hidden mixed arithmetic/relation gap discovered after provisional manifest | `03`, `13` | `inferMixedArithmeticRelationMappingThenSelectStatement` | `HIDDEN_MAPPING` | infer relation meaning and arithmetic meanings → check every option | approved runtime | retain |

Source-family numbers above refer to `OPS-SRC-FAM-*` identifiers in the provisional coverage manifest.

## 4. Checkpoint reconciliation

| Checkpoint | Retained logical contracts | Contract IDs |
|---|---:|---|
| `OPS-CP-001` | 2 | 001, 003 |
| `OPS-CP-002` | 3 | 004, 005, 007 |
| `OPS-CP-003` | 2 | 008, 009 |
| `OPS-CP-004` | 4 | 010–013 |
| `OPS-CP-005` | 6 | 014–019 |
| `OPS-CP-006` | 3 | 020–022 |
| `OPS-CP-007` | 3 | 023–025 |
| `OPS-CP-008` | 4 | 026–029 |
| `OPS-CP-009` | 4 | 030, 032–034 |
| **Total** | **31** | — |

## 5. Source-family reconciliation

```text
01 supplied arithmetic-sign replacement             covered
02 supplied arbitrary operation tokens              covered
03 arithmetic plus relation-token mapping            covered
04 filling signs with fixed relation                 covered
05 filling signs including relation position        covered
06 prescribed operator interchange                  covered
07 infer operator interchange to repair equation    covered
08 arithmetic-relation sign interchange             covered
09 whole-number interchange                         covered
10 digit-identity interchange                       covered
11 combined sign-and-number interchange             covered
12 combined sign-and-digit interchange              covered
13 hidden operator mapping                          covered
14 transformed equation selection                   covered cross-cutting
15 double-pair operator interchange                 covered
16 finite-decimal supplied mapping                  covered as numeric dimension of 001
17 negative target repair                           covered as equation/result dimension of 016 and shared exact runtime
```

No admitted V1 source family lacks a retained runtime owner.

## 6. Deferred and excluded contracts

The following remain outside the 31-contract V1 ledger:

- inequality-chain conclusion inference — owned by Inequality, not OPS;
- powers and roots — insufficient reviewed source evidence for V1;
- occurrence-specific digit swapping — conflicts with the global digit-identity contract;
- intentionally non-unique hidden mappings — requires a separate possibility-answer contract;
- provisional H3 wording-only duplicate — represented by actual H1/H4 topology;
- result-slot-only candidates 002, 006 and 031 — merged into 001, 004 and 030.

## 7. Runtime and editorial proof attached to every row

All retained rows inherit:

```text
exact rational evaluator                         PASS
four unique options                              PASS
one keyed answer                                 PASS
complete-pool uniqueness where inverse           PASS
approved V3 visible substitution                 PASS
correct multiplication/division precedence       PASS
option-selection justification                   PASS
English manual review                            PASS
Hindi runtime and manual review                  PASS
Punjabi runtime and manual review                PASS
```

## 8. Ledger verdict

```text
SOURCE_FAMILY_COVERAGE             = COMPLETE
RETAINED_LOGICAL_CONTRACTS         = 31
PRE_MERGE_PRESENTATION_VARIANTS    = 3 MERGED
UNOWNED_V1_STUDENT_ACTIONS         = 0
UNOWNED_V1_SOURCE_FAMILIES         = 0
SOURCE_TO_RUNTIME_LEDGER           = PASS
DEVICE_GLYPH_PROOF                 = PENDING
PERMANENT_QL_COUNT                 = NOT_YET_FROZEN
PERMANENT_QL_IDS                   = UNASSIGNED
```

When the device/glyph proof passes without a material contract split, the evidence supports freezing the logical count at **31** and allocating permanent IDs by the checkpoint reconciliation table.