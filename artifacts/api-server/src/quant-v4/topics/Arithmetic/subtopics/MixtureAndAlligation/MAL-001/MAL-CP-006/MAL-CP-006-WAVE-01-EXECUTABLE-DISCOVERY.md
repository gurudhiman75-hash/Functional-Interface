# MAL-CP-006 Wave 01 — Source-Backed Executable Discovery

Status: **DISCOVERY PROTOTYPE**

Runtime: `MAL-CP006-EN-OPEN-DISCOVERY-WAVE01-V1`

Permanent QLs: **0**  
Permanent solve modes: **0**

## Purpose

Establish the first exact executable CP-006 state model from genuine cross-vessel source topologies rather than the misleading legacy V2 vessel labels.

## Temporary prototype set

| Prototype | Task | Initial difficulty | Primary source topology |
|---|---|---|---|
| `MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO` | final component ratio after transfer and current-mixture return | Medium | CAT 2022 / Testbook |
| `MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS` | unknown equal exchange quantity that equalises concentration | Medium | Testbook |
| `MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE` | common final concentration after equalising exchange | Medium | Testbook |
| `MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION` | final named-vessel concentration after A→B→C→A | Hard | CAT 2019 |
| `MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO` | destination ratio after source transfer, refill and retransfer | Hard | SSC CGL Tier II 2023 |
| `MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO` | compare final component amounts across two vessels | Medium | Prepp |

These are discovery contracts, not six promised permanent QLs.

## Exact state model

The runtime stores for every vessel its volume, component-A amount and component-B amount. Supported operations are `TRANSFER`, `REFILL`, and `SIMULTANEOUS_EQUAL_EXCHANGE`.

Sequential transfer always samples the source vessel's current fraction immediately before that operation. Simultaneous equal exchange snapshots both source compositions before either side is updated.

## Equal-exchange invariant

For two vessel volumes `VA` and `VB`, different initial component fractions, and the same amount `x` simultaneously exchanged:

```text
x = VA × VB / (VA + VB)
```

is the exchange amount that equalises final concentrations. Wave 01 verifies the formula by rebuilding both final vessel states with exact rational arithmetic.

## Direct source witnesses encoded in CI

```text
CAT 2019 three-vessel salt cycle       -> 14%
CAT 2022 transfer-return-transfer      -> 5 : 6
SSC CGL 2023 refill/retransfer          -> 131 : 77
Testbook 12 L / 18 L equal exchange    -> 7.2 L
Testbook two-mixture return             -> 129 : 41
Prepp pure-component round trip         -> 41 : 21
```

## Audit scope

For each of the 6 prototypes, Wave 01 generates 100 deterministic questions:

```text
600 generated questions
600 deterministic replay checks
600 independent ledger checks
600 stage-conservation checks
600 lifecycle-lock checks
600 option-integrity checks
600 direct-source-authority checks
30-question English review export
```

The independent verifier reconstructs the stage ledger separately from the canonical CP-006 solver.

## Explicit non-goals

Wave 01 does not allocate `MAL-QL-*`, freeze a solve-mode count, claim source saturation, register CP-006 in permanent Question Studio routing, write Question Bank content, enable tests or mocks, publish student content, or create Hindi/Punjabi surfaces.

Later waves must explore inverse transfer targets, arbitrary chains, multiple-cycle forms, bidirectional unequal exchange and output/representation equivalence before merge/split.
