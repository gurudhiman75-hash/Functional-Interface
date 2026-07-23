# AVG-001 CP-005 Design Amendment

## Status

Implementation design amendment for `AVG-CP-005` only. This document does not authorize CP-006 work, publication, freezing, or merging.

## Why the original four modes are insufficient

The original CP-005 plan represented only four unknowns: corrected average, correct entry, incorrect entry, and observation count. The intended exam scope also contains distinct targets for the reported wrong average, the difference between wrong and correct entries, the resulting average change, and net correction across more than one erroneous entry. Treating these as wording variants would weaken traceability, distractor design, explanation selection, and structural-variation audits.

## Locked implementation solve modes

1. `findCorrectedAverageFromMistake`
2. `findReportedAverageBeforeCorrection`
3. `findCorrectValueFromAverageShift`
4. `findIncorrectValueFromCorrection`
5. `findEntryDifferenceFromAverageCorrection`
6. `findAverageChangeFromEntryCorrection`
7. `findNumberOfItemsFromTotalCorrection`
8. `findCorrectedAverageFromMultipleMistakes`

The eighth mode permits two-entry net correction only. More complex omission, duplication, or mixed add/remove data-cleaning systems remain outside CP-005 unless separately designed.

## QL allocation

CP-005 expands from the preliminary 43-QL allocation to 56 QLs.

| Solve mode | QL count | Stable IDs |
| --- | ---: | --- |
| findCorrectedAverageFromMistake | 10 | AVG-QL-274–283 |
| findReportedAverageBeforeCorrection | 6 | AVG-QL-284–289 |
| findCorrectValueFromAverageShift | 9 | AVG-QL-290–298 |
| findIncorrectValueFromCorrection | 9 | AVG-QL-299–307 |
| findEntryDifferenceFromAverageCorrection | 6 | AVG-QL-308–313 |
| findAverageChangeFromEntryCorrection | 5 | AVG-QL-314–318 |
| findNumberOfItemsFromTotalCorrection | 6 | AVG-QL-319–324 |
| findCorrectedAverageFromMultipleMistakes | 5 | AVG-QL-325–329 |
| **Total** | **56** | **AVG-QL-274–329** |

CP-006 is not implemented in this branch. Its previously provisional IDs must be reassigned only when CP-006 begins.

## Difficulty allocation

| Difficulty | Count |
| --- | ---: |
| Easy | 17 |
| Medium | 20 |
| Hard | 19 |
| **Total** | **56** |

Direct corrected-average and average-change questions carry more Easy coverage. Reverse-entry, count-recovery, and multiple-error questions carry more Medium and Hard coverage.

## Context allocation

| Context family | Count |
| --- | ---: |
| Marks and test scores | 9 |
| Salary and wages | 7 |
| Ages | 6 |
| Production and output | 8 |
| Sales and collections | 7 |
| Cricket runs and sports scores | 7 |
| Weight | 6 |
| Attendance, stock, or record counts | 6 |
| **Total** | **56** |

## Explanation strategy requirements

Every major solve-mode family must render at least three structurally distinct methods chosen from:

- reconstruct the reported total and replace the wrong entry;
- apply the net correction directly to the total;
- distribute the entry difference across the fixed count;
- reverse the average change into a total correction;
- form and solve a compact correction equation;
- combine two correction deltas before changing the average.

Each explanation must contain substituted arithmetic, the directional effect of the correction, contextual units, and the final answer. Generic explanation shells are forbidden.

## Runtime isolation

CP-005 receives its own deterministic runtime and pipeline dispatch. It must not be routed through the CP-001 parameter generator or inherit CP-004-specific wording, option, or explanation assumptions.

## Publication constraints

- English only.
- `publiclyPublishable: false`.
- No Question Studio exposure.
- No production-ready or freeze-ready claim.
- Draft PR only, unmerged pending product-owner review.
