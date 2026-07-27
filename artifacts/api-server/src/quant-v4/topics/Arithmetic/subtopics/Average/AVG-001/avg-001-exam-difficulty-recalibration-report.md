# AVG-001 Exam Difficulty Recalibration

## Purpose

This checkpoint replaces positional difficulty assignment with exam-oriented classification based on structural complexity, computational effort and reasoning depth.

The previous calibrator sorted each solve-mode family by QL number and assigned later rows to Hard. That made routine questions look difficult merely because they appeared later in a library.

## Result

| Band | Previous | Calibrated | Change |
|---|---:|---:|---:|
| Easy | 109 | 182 | +73 |
| Medium | 187 | 185 | -2 |
| Hard | 129 | 58 | -71 |
| Total | 425 | 425 | 0 |

A total of 198 QLs receive a corrected difficulty label. No mathematical or editorial content changes.

## Representative corrections

- `AVG-QL-066`: average of 13 values and sum of 12 values; remaining value — **Hard → Easy**.
- `AVG-QL-071`: decimal missing-distance balance — **Hard → Easy**.
- `AVG-QL-380`: add the same amount to every value — **Hard → Easy**.
- `AVG-QL-109`: reconstruct an AP extreme from mean, count and common difference — **Hard → Medium**.
- `AVG-QL-172`: recover one added parcel weight from an average shift — **Hard → Medium**.
- `AVG-QL-203`: update a batting average after one known innings — **Medium → Easy**.
- `AVG-QL-295`: recover one corrected cricket entry from the change in average — **Hard → Medium**.
- `AVG-QL-321`: count from total correction divided by average change — **Hard → Medium**.

## Hard retained where justified

Hard remains for:

- elapsed-age member recovery (`AVG-QL-169..171`, `182..184`, `193..194`);
- original-count recovery after joining/leaving (`AVG-QL-394..405`);
- four-group weighted aggregation (`AVG-QL-231..236`);
- unequal-distance and unequal-time speed (`AVG-QL-414..425`);
- multiple wrong-entry correction (`AVG-QL-325..329`);
- hierarchical missing section averages, subgroup counts and lower-level averages.

## Implementation

- `foundation/difficulty-calibration.ts` now assigns a base difficulty by solve mode.
- Explicit QL sets handle the few cases where the same solve mode has materially different reasoning depth.
- The calibration no longer depends on QL position.
- `avg-001-difficulty-calibration-audit.ts` validates all 425 generated packages, per-mode counts, per-CP counts, hard-only families and representative exam cases.

## Unchanged

- QL count and solve-mode coverage;
- stems and explanations;
- options, answers and correct indices;
- parameter generation and solver state;
- mathematical fingerprints;
- Hindi/Punjabi parity and release status.
