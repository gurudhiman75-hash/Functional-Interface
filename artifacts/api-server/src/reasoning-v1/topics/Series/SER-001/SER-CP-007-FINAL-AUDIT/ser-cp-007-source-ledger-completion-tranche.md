# SER-CP-007 source-ledger completion tranche

## Purpose

This tranche replaces the grouped pending rows for Radian items `134–141`, `221` and `222` in the main source ledger with exact stem-level records. The main ledger remains the chapter inventory; this file is its executable traceability supplement.

No new authority is introduced by these records.

## Exact Radian records

| Record | Source location | Exact stem | Authority | Task | Answer | Disposition | Rule evidence |
|---|---|---|---|---|---|---|---|
| `SER-SRC-007-030` | `RADIAN-2022`, printed p. `6-16`, item 134; solution p. `6-17` | `HBS, GDP, FFM, ?, DJG` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `MISSING_TERM` | `EHJ` | `COVERED` | First letters move `−1`, second letters `+2`, third letters `−3`. |
| `SER-SRC-007-031` | `RADIAN-2022`, printed p. `6-16`, item 135; solution p. `6-17` | `XMT, ENA, LOH, SPO, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `ZQV` | `COVERED` | Corresponding positions move by fixed cyclic steps `+7, +1, +7`. |
| `SER-SRC-007-032` | `RADIAN-2022`, printed p. `6-16`, item 136; solution p. `6-17` | `KOY, JPX, IQW, HRV, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `GSU` | `COVERED` | Corresponding positions move `−1, +1, −1`. |
| `SER-SRC-007-033` | `RADIAN-2022`, printed p. `6-16`, item 137; solution p. `6-17` | `UKS, ZPX, EUC, JZH, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `OEM` | `COVERED` | Every corresponding position moves five letters forward cyclically. |
| `SER-SRC-007-034` | `RADIAN-2022`, printed p. `6-16`, item 138; solution p. `6-17` | `THC, DIU, VJE, FKW, XLG, ?` | `TWO_INTERLEAVED_CLUSTER_SERIES` | `NEXT_TERM` | `HMY` | `COVERED` | Odd terms `THC → VJE → XLG` and even terms `DIU → FKW → HMY` are two independent `+2` rows. Neighbouring terms use alternating jumps and must not be forced into one column-step vector. |
| `SER-SRC-007-035` | `RADIAN-2022`, printed p. `6-16`, item 139; solution p. `6-17` | `SAG, KSY, CKQ, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `UCI` | `COVERED` | Every corresponding position moves eight letters backward cyclically. |
| `SER-SRC-007-036` | `RADIAN-2022`, printed p. `6-16`, item 140; solution p. `6-17` | `EBF, JGK, OLP, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `TQU` | `COVERED` | Every corresponding position moves five letters forward. |
| `SER-SRC-007-037` | `RADIAN-2022`, printed p. `6-16`, item 141; solution p. `6-17` | `PMJ, EBY, TQN, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `IFC` | `COVERED` | Every corresponding position moves fifteen letters forward cyclically. |
| `SER-SRC-007-038` | `RADIAN-2022`, printed p. `6-12`, item 221; solution p. `6-20` | `XYXYZXYXY, XYXYXYZXY, XYXYXYXYZ, ZXYXYXYXY, XYZXYXYXY, ...` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | option `(a)` `XYXYZXYXY` | `COVERED_BY_WAVE_E` | The `Z` marker moves two positions right through the recurring `XY` background and wraps after the right edge. |
| `SER-SRC-007-039` | `RADIAN-2022`, printed p. `6-12`, item 222; solution p. `6-20` | `YXXXXXX, YYXXXXX, YYYXXXX, YYYYXXX, YYYYYXX, ...` | `PROGRESSIVE_POSITIONAL_SUBSTITUTION` | `NEXT_TERM` | option `(c)` `YYYYYYX` | `COVERED_BY_WAVE_E` | At every step the leftmost remaining `X` is replaced by `Y`; width stays fixed while the source/target boundary moves right. |

## Compression conclusions

```text
Items 134, 135, 136, 137, 139, 140 and 141
  -> COLUMNWISE_FIXED_CLUSTER_MOVEMENT

Item 138
  -> TWO_INTERLEAVED_CLUSTER_SERIES

Item 221
  -> MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME

Item 222
  -> PROGRESSIVE_POSITIONAL_SUBSTITUTION
```

The seven fixed-column questions are parameter variations rather than seven authorities. Item 138 is a useful collision guard: comparing adjacent terms hides the simpler two-row rule.

## Aggregate traceability after this tranche

```text
Verified source records:             36 covered/delegated/Wave-E-resolved
Unresolved traced exam records:       1
Unresolved record:                    DISHA-VNV item 195
Wave D direct-ancestry decisions:     8 provisional SATURATION_ONLY
Post-Wave-E collision audit:          COMPLETE
Mathematical saturation:              PENDING_FINAL_SOURCE_ANCESTRY_DECISIONS
Ledger completeness:                  BLOCKED
English discovery freeze:             BLOCKED
Permanent QLs:                         0
CP-008:                               BLOCKED
```

The only currently unresolved extracted exam item is Disha item `195`. Separately, the eight Wave D probes still require either direct page ancestry or an explicit final `SATURATION_ONLY` freeze decision.

## Next authority

```text
SER_CP007_FINAL_SOURCE_ANCESTRY_AND_ITEM_195_RESOLUTION
```
