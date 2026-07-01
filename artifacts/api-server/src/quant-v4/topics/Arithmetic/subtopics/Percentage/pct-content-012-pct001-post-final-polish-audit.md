# PCT-CONTENT-012 - PCT-001 Post-Final-Polish Audit

## Scope

Audited only:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json`

This was a report-only pass. No JSON or runtime files were modified.

## Verification

- JSON parse command requested in the task was executed from `artifacts/api-server`.
- Command used:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json','utf8')); console.log('JSON OK')"
```

- Result: `JSON OK`

## Executive Verdict

- The exact duplicate pressure flagged in `PCT-CONTENT-010` has been fully removed.
- `PCT-001` now has `0` exact duplicate groups across all CPs.
- The remaining repetition is mostly patterned drill-family similarity, not embarrassing copy-paste duplication.
- Publish-readiness call: `Ready for manual review`

## Exact Duplicate Audit

### Headline count

- Exact duplicate groups: `0`
- Affected rows: `0`
- CP spread:
  - `PCT-CP-001`: `0`
  - `PCT-CP-002`: `0`
  - `PCT-CP-003`: `0`
  - `PCT-CP-004`: `0`
  - `PCT-CP-005`: `0`
  - `PCT-CP-006`: `0`

### Assessment

There are no remaining exact duplicate template strings in the current `PCT-001/question-language.en.json`.

## PCT-CONTENT-010 Duplicate Resolution Check

`PCT-CONTENT-010` had flagged `17` exact duplicate groups:

- `16` groups in `PCT-CP-001`
- `1` group in `PCT-CP-002`

Post-`PCT-CONTENT-011` verification result:

- All `17` flagged groups are now `RESOLVED_ALL_DISTINCT`.
- No flagged group remains duplicated.
- No flagged group was only partially reduced.

### Resolution summary

| Prior flagged area | Earlier state in PCT-CONTENT-010 | Current state |
| --- | --- | --- |
| `PCT-CP-001` election / marks / literacy / factory / mixture / cash / discount / attendance / fruit / pass / alloy / library / garden / water pairs | Exact duplicate pairs | Fully distinct now |
| `PCT-CP-001` fraction prompt cluster `PCT-QL-403, 703, 903, 1303, 1903` | Five-way exact duplicate | Fully distinct now |
| `PCT-CP-001` formula prompt `PCT-QL-1401, 1402` | Exact duplicate pair | Fully distinct now |
| `PCT-CP-002` `PCT-QL-010, 210` | Exact duplicate pair | Fully distinct now |

## Near-Duplicate Audit

There are still high-confidence near-duplicate families, but they now look like expected drill-family clustering rather than unresolved duplicate pressure. These are worth knowing during manual review, but they are not strong enough to block handoff.

### Remaining high-confidence near-duplicate families

| CP ID | QL IDs | Family summary | Severity | Comment |
| --- | --- | --- | --- | --- |
| `PCT-CP-001` | `PCT-QL-003, 103, 203, 303, 403, 503, 603, 703, 803, 903, 1003, 1103, 1203, 1303, 1403, 1503, 1603, 1703, 1803, 1903` | Percentage-to-fraction conversion family | Medium | Large drill block, but now phrased distinctly enough for manual review |
| `PCT-CP-001` | `PCT-QL-004, 104, 204, 304, 404, 504, 604, 704, 804, 904, 1004, 1104, 1204, 1304, 1404, 1504, 1604, 1704, 1804, 1904` | Percent-of-whole family | Medium | Broad shell similarity remains, though context spread is acceptable |
| `PCT-CP-001` | `PCT-QL-009, 109, 209, 309, 409, 509, 609, 709, 809, 909, 1009, 1109, 1209, 1309, 1409, 1509, 1609, 1709, 1809, 1909` | Known-percent-to-total/original family | Medium | Still large, but this is now more of a coverage-style family than a duplicate problem |
| `PCT-CP-002` | `PCT-QL-010, 110, 210, 310, 410` | Revised-value-after-increase family | Low | One generic stem plus four contextualized rewrites is acceptable |
| `PCT-CP-002` | `PCT-QL-012, 112, 212, 312, 412` | Find-original-before-increase family | Low | Similar shell, but the variants no longer feel copy-pasted |
| `PCT-CP-003` | `PCT-QL-020, 120, 220, 320, 420` | Equivalent single increase family | Low | Typical family clustering; not a blocker |
| `PCT-CP-004` | `PCT-QL-028, 128, 228, 328, 428` | Same-expenditure sugar family | Medium | Still the most visibly patterned inverse-proportion block |
| `PCT-CP-005` | `PCT-QL-041, 141, 241, 341, 441` | Boys/girls total-strength family | Low | Familiar school shell, but sufficiently varied in wrapper form |
| `PCT-CP-006` | `PCT-QL-048, 148, 248, 348, 448` | Acid-dilution family | Low | Strong shell similarity remains, but not severe enough to block manual review |
| `PCT-CP-006` | `PCT-QL-054, 154, 254, 354, 454` | Sugar evaporation family | Low | Same math shell, but wording is now natural and acceptable |

### Overall near-duplicate judgement

- The file still contains patterned exercise families, especially in `PCT-CP-001` and `PCT-CP-006`.
- However, the similarity is now mostly conceptual-family similarity rather than duplicate failure.
- I would treat these as manual-review watch items, not as cleanup blockers.

## CP-Level Readiness Score

| CP ID | Score / 10 | Notes |
| --- | ---: | --- |
| `PCT-CP-001` | `7.5` | Exact duplicates are gone; still the most drill-heavy block |
| `PCT-CP-002` | `7.5` | Duplicate pair removed; contextual rewrites are serviceable |
| `PCT-CP-003` | `8.0` | Patterned families remain, but nothing looks embarrassing |
| `PCT-CP-004` | `7.5` | Inverse-proportion shells still feel formula-driven, especially the sugar family |
| `PCT-CP-005` | `8.5` | One of the stronger post-cleanup CPs |
| `PCT-CP-006` | `8.0` | Repetitive science-family structure remains, but wording is clean enough |

## Top Remaining Weak Stems

These are not blockers, but they are the few stems I would keep an eye on during manual review.

| CP ID | QL ID | Stem snippet | Why it may still attract review attention |
| --- | --- | --- | --- |
| `PCT-CP-001` | `PCT-QL-1402` | `A worksheet asks for {percentageRate}% of {baseValue}...` | `worksheet` is a slightly meta wrapper rather than a natural exam context |
| `PCT-CP-001` | `PCT-QL-703` | `Convert the percentage {percentageRate}% into fractional form.` | Fine, but still part of a visibly dense drill family |
| `PCT-CP-002` | `PCT-QL-010` | `If {baseValue} is increased by {percentageRate}%...` | Still the plainest member of its family |
| `PCT-CP-004` | `PCT-QL-328` | `A ration-card calculation says sugar price rises...` | Slightly less natural than the stronger household/ration variants |
| `PCT-CP-006` | `PCT-QL-255` | `A materials batch has {percentageRate}% copper...` | More generic than the better alloy/batch variants |

## Publish-Readiness Judgement

### Status

`Ready for manual review`

### Why

- Exact duplicate count is `0`.
- The specific duplicate list from `PCT-CONTENT-010` is fully resolved.
- No clearly embarrassing lower-case, copy-paste, or unnatural-language issues stand out as release blockers.
- Remaining repetition is mostly family-level mathematical similarity, which is expected in a chaptered percentage bank and is better handled in human review than another broad automated cleanup pass.

## Recommended Next Action

1. Move `PCT-001/question-language.en.json` to manual question-bank review.
2. Ask reviewers to keep a light eye on:
   - the dense fraction-conversion block in `PCT-CP-001`
   - the formula-heavy `PCT-CP-004` inverse-proportion family
   - the science-shell clustering in `PCT-CP-006`
3. Do not schedule another broad cleanup pass unless manual reviewers specifically object to those families.
