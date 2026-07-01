# PCT-CONTENT-010 - PCT-001 Post-Cleanup Duplicate Audit

## Scope

Audited only:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json`

This was a report-only pass. No JSON or runtime files were modified.

## Executive Verdict

- Exact duplicate pressure is much lower than the earlier state.
- CP-005 and CP-006 are clearly improved after cleanup.
- Clone pressure is not fully acceptable yet for manual question-bank review because `PCT-CP-001` still carries 16 exact duplicate groups and the full file still has several high-visibility near-duplicate families.

## Exact Duplicate Audit

### Headline count

- Exact duplicate groups: `17`
- Exact duplicate rows involved: `37`
- CP spread:
  - `PCT-CP-001`: `16` groups
  - `PCT-CP-002`: `1` group
  - `PCT-CP-003` to `PCT-CP-006`: `0` groups

### Exact duplicate table

| CP ID | QL IDs | Repeated template | Severity | Recommended action |
| --- | --- | --- | --- | --- |
| `PCT-CP-001` | `PCT-QL-001, PCT-QL-002` | `In an election, {percentageRate}% of the {baseValue} registered voters cast their votes. How many votes were cast?` | High | Keep one version only; rewrite the other into a booth record, turnout sheet, or valid-votes note |
| `PCT-CP-001` | `PCT-QL-101, PCT-QL-102` | `A candidate scored {percentageRate}% of the total {baseValue} marks in an examination. How many marks did he score?` | Medium | Keep one direct version; convert the other into a result-sheet or mark-list prompt |
| `PCT-CP-001` | `PCT-QL-201, PCT-QL-202` | `Out of a population of {baseValue} in a village, {percentageRate}% are literate. How many people are literate?` | Medium | Keep one village version; rewrite the other as a literacy survey or census entry |
| `PCT-CP-001` | `PCT-QL-501, PCT-QL-502` | `If a factory produces {baseValue} units per day, and {percentageRate}% of them are defective, how many defective units are produced daily?` | Medium | Retain one direct factory version; move the other to inspection-sheet wording |
| `PCT-CP-001` | `PCT-QL-701, PCT-QL-702` | `A mixture contains {baseValue} liters of liquid, of which {percentageRate}% is water. How much water is there?` | Medium | Keep one mixture prompt; convert the other into a lab note or solution record |
| `PCT-CP-001` | `PCT-QL-801, PCT-QL-802` | `Rahul has Rs. {baseValue} with him. He gives {percentageRate}% of it to his friend. How much money did he give?` | Medium | Replace one personal-name shell with a cash-book or allowance context |
| `PCT-CP-001` | `PCT-QL-901, PCT-QL-902` | `The marked price of a book is Rs. {baseValue}. The shopkeeper gives a {percentageRate}% discount. What is the discount given?` | High | Keep one; rewrite the other as a sale bill or price-tag note |
| `PCT-CP-001` | `PCT-QL-1001, PCT-QL-1002` | `An attendance register lists {baseValue} students, and {percentageRate}% were present on Monday. How many students attended the class?` | Medium | Keep one register-led version only |
| `PCT-CP-001` | `PCT-QL-1101, PCT-QL-1102` | `A fruit seller had {baseValue} apples. He sold {percentageRate}% of them. Find the number of apples sold.` | Medium | Keep one direct sale shell; rewrite the other as a mandi stock note |
| `PCT-CP-001` | `PCT-QL-1201, PCT-QL-1202` | `Out of {baseValue} candidates who appeared for an exam, {percentageRate}% passed. How many passed?` | Medium | Keep one direct exam shell; rewrite the other as a pass-list or result summary |
| `PCT-CP-001` | `PCT-QL-1301, PCT-QL-1302` | `The total weight of an alloy is {baseValue} kg. If {percentageRate}% of it is copper, find the weight of copper.` | Medium | Keep one metallurgy version; rewrite the other as a workshop material record |
| `PCT-CP-001` | `PCT-QL-1401, PCT-QL-1402` | `If {percentageRate}% of {baseValue} is equal to x, then what is the value of x?` | High | Keep only one formula-only version |
| `PCT-CP-001` | `PCT-QL-1501, PCT-QL-1502` | `A library has {baseValue} books, and {percentageRate}% of them are fiction. How many fiction books are there?` | Medium | Keep one library version; rewrite the other as a shelf register or circulation note |
| `PCT-CP-001` | `PCT-QL-1701, PCT-QL-1702` | `In a garden of {baseValue} trees, {percentageRate}% are mango trees. How many mango trees are there?` | Medium | Keep one orchard-style version; rewrite the other as a plantation record |
| `PCT-CP-001` | `PCT-QL-1801, PCT-QL-1802` | `A water tank holds {baseValue} liters. {percentageRate}% of the water was consumed. How much water was used?` | Medium | Keep one utility version; rewrite the other as a supply log |
| `PCT-CP-001` | `PCT-QL-403, PCT-QL-703, PCT-QL-903, PCT-QL-1303, PCT-QL-1903` | `Write {percentageRate}% as a fraction.` | High | Collapse to one survivor; the rest should be replaced or removed |
| `PCT-CP-002` | `PCT-QL-010, PCT-QL-210` | `If {baseValue} is increased by {percentageRate}%, find the new number.` | High | Keep one direct drill; rewrite the other into a contextualized revised-value prompt |

## Near-Duplicate Audit

### Near-duplicate count

- High-confidence near-duplicate families flagged: `18`

These are not exact string duplicates, but they still read like clones because the mathematical shell is doing most of the work and the editorial variation is shallow.

| CP ID | QL IDs | Short snippets | Issue | Severity | Recommended fix direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-CP-001` | `PCT-QL-003, 103, 203, 303, 403, 503, 603, 703, 803, 903, 1003, 1103, 1203, 1303, 1403, 1503, 1603, 1703, 1803, 1903` | `Convert {percentageRate}%...`, `Write {percentageRate}% as a fraction.`, `What fraction is equal...` | Fraction-conversion block is still oversized and robotic; several items differ only in command verb | High | Keep a much smaller drill set and diversify or trim the rest |
| `PCT-CP-001` | `PCT-QL-004, 104, 204, 304, 404, 504, 604, 704, 804, 904, 1004, 1104, 1204, 1304, 1404, 1504, 1604, 1704, 1804, 1904` | `What percentage of {baseValue} is {value}?`, `...what is his percentage score?`, `...what percentage was spent?` | Same percent-of-whole shell repeated across too many thin noun swaps | High | Keep a smaller set with clearer context and stronger structures |
| `PCT-CP-001` | `PCT-QL-005, 105, 205, 305, 405` | `A is {percentageRate}% of B...` | Five variants are all direct formula prompts with only phrasing changes | Medium | Retain at most 2 versions; move others into contextual ratio/part-of-whole prompts |
| `PCT-CP-001` | `PCT-QL-006, 106, 206, 306, 406` | `A is {percentageRate}% more than B...` | Same comparison shell repeated five times | Medium | Keep one direct shell and one contextualized comparison version |
| `PCT-CP-001` | `PCT-QL-007, 107, 207, 307, 407` | `A is {percentageRate}% less than B...` | Same issue as above; variants feel editorially thin | Medium | Same fix as above |
| `PCT-CP-001` | `PCT-QL-008, 108, 208, 308, 408` | `If {rate1}% of A is equal to {rate2}% of B...` | Ratio shell repeated with only wording tweaks | Medium | Keep one direct ratio shell and rewrite others into marks/fund/output contexts |
| `PCT-CP-001` | `PCT-QL-009, 109, 209, 309, 409, 509, 609, 709, 809, 909, 1009, 1109, 1209, 1309, 1409, 1509, 1609, 1709, 1809, 1909` | `...is {percentageRate}% of... find the total/original...` | Large "find the number/original total" family; contexts vary but shell pressure is still high | High | Keep fewer variants and spread them across stronger records, bills, and public-data notes |
| `PCT-CP-002` | `PCT-QL-010, 110, 210, 310, 410` | `...increased by {percentageRate}%... revised...` | Revised-value-after-increase shell is still repetitive even after cleanup | Medium | One direct drill plus 2 stronger contextual shells would be enough |
| `PCT-CP-002` | `PCT-QL-011, 111, 211, 311, 411` | `...decreased by {percentageRate}%... revised...` | Same revised-value shell on the decrease side | Medium | Keep one direct version; make the rest more document-driven |
| `PCT-CP-002` | `PCT-QL-012, 112, 212, 312, 412` | `...becomes {finalValue} after adding {percentageRate}%...` | Same "find original before increase" shell with light noun swaps | Medium | Convert some to bill, post-sanction, or consumer contexts with stronger framing |
| `PCT-CP-002` | `PCT-QL-013, 113, 213, 313, 413` | `...becomes {finalValue} after a {percentageRate}% reduction...` | Same original-before-decrease shell repeated five times | Medium | Same fix direction |
| `PCT-CP-002` | `PCT-QL-015, 115, 215, 315, 415` | `...salary... revised salary... earlier salary...` | Salary/pay variants are improved but still very close clones | Medium | Keep 2 salary-family versions and shift the rest to broader staff/payroll structures or trim |
| `PCT-CP-002` | `PCT-QL-017, 117, 217, 317, 417` | `...{rate1}%... is {value1}; find {rate2}%...` | Repeated "known percent to another percent" shell; `117` and `317` are especially close | Medium | Keep fewer shells and diversify with clearer domain-specific data forms |
| `PCT-CP-003` | `PCT-QL-020, 120, 220, 320, 420` | `Two successive increases... equivalent single percentage increase` | Same successive-increase shell repeated across mild context wrappers | Medium | One direct drill plus a couple of richer context versions is enough |
| `PCT-CP-003` | `PCT-QL-024, 124, 224, 324, 424` | `...starts at {initialValue}... grows at {percentageRate}% every year... after 2 years` | Growth-over-time shell repeated five times with only domain nouns changing | Medium | Keep population/subscriber contrast, trim the rest |
| `PCT-CP-004` | `PCT-QL-028, 128, 228, 328, 428` | `...sugar price rises... keep expenditure the same` | Strongly repetitive inverse-proportion shell | High | Keep one household/ration version and replace or trim the rest |
| `PCT-CP-004` | `PCT-QL-031, 131, 231, 331, 431` | `...speed increases... time decrease...` | Same transport shell repeated across route/train/bus variants | Medium | Keep one vehicle shell and one schedule shell only |
| `PCT-CP-006` | `PCT-QL-048, 148, 248, 348, 448` | `...{percentageRate}% acid... add water... make it {newRate}% acid` | Cleaner than before, but still five near-clones of the same dilution problem | Medium | Keep 2 well-worded variants at most |
| `PCT-CP-006` | `PCT-QL-049, 149, 249, 349, 449` | `fresh fruit... dry fruit... {waterRate}%... {dryWaterRate}%...` | Drying family is more natural now, but still close-clone territory | Medium | Keep the best 2 or 3 and trim or reframe the rest |
| `PCT-CP-006` | `PCT-QL-050, 150, 250, 350, 450` | `salt solution... add salt... {newRate}% solution` | Same strengthening shell repeated under different container nouns | Medium | Keep 2 versions and diversify if more are needed |
| `PCT-CP-006` | `PCT-QL-051, 151, 251, 351, 451` | `...add {value} litres of water... alcohol percentage now` | Same dilution shell with only wrapper change | Medium | Keep one direct and one record-led version |
| `PCT-CP-006` | `PCT-QL-052, 152, 252, 352, 452` | `Fresh grapes... dry grapes...` | Same drying shell repeated with minor wording shifts | Medium | Keep 2 survivors only |
| `PCT-CP-006` | `PCT-QL-053, 153, 253, 353, 453` | `How much pure alcohol should be added...` | Strong shell repetition despite better wrappers | Medium | Keep one direct lab version and one bottle/sample version |
| `PCT-CP-006` | `PCT-QL-054, 154, 254, 354, 454` | `...water evaporates... sugar becomes {newRate}%...` | Same evaporation shell repeated five times | Medium | Keep 2 good versions; trim the rest |
| `PCT-CP-006` | `PCT-QL-055, 155, 255, 355, 455` | `...{percentageRate}% copper... zinc in {totalWeight} kg...` | Alloy batch family is improved, but still thin noun-swapping | Medium | Keep the clearest alloy version and one batch-record version |

## Context Diversity Audit

### Context count snapshot

Approximate context distribution across all 350 stems:

| Context | Count |
| --- | ---: |
| `generic/no-context` | `96` |
| `public record/department` | `48` |
| `school/class/students` | `36` |
| `salary/income` | `35` |
| `shop/price/bill` | `34` |
| `mixture/solution` | `21` |
| `stock/inventory` | `21` |
| `election/votes` | `18` |
| `geometry/layout` | `11` |
| `transport/passengers` | `8` |
| `agriculture/crop/rainfall` | `7` |
| `alloy/metals` | `7` |
| `fruit drying/evaporation` | `5` |
| `electricity/water/public utility` | `3` |

### Overused contexts

- `generic/no-context` is still the single biggest bucket at `96`.
- School, salary, shop/price, and public-record wrappers are all heavily reused.
- CP-006 still leans strongly into repeated mixture/solution and drying shells.

### Underused contexts

- Electricity/water/public utility is still very thin.
- Transport/passenger usage is present but narrow.
- Agriculture/crop/rainfall and alloy/metals remain secondary rather than truly diversified.

### CPs that still need more context diversity

- `PCT-CP-001`
  - Too much generic and drill-style material.
  - The raw topic range is wide, but several items are still duplicated or near-duplicated.
- `PCT-CP-002`
  - Better than before, but still leans too hard on "revised number / revised amount" shells.
- `PCT-CP-006`
  - Improved wording, but the context family is still mostly one repeated science-mixture zone.

### Best context improvement since cleanup

- `PCT-CP-005`
  - Election, school, salary, literacy, family allocation, and alloy contexts now feel meaningfully more varied than before.
- `PCT-CP-006`
  - The old clone pressure is lower, and the evaporation wording is now natural.

## Structure Diversity Audit

### Structure count snapshot

Approximate structure distribution:

| Structure | Count |
| --- | ---: |
| `word problem` | `138` |
| `direct formula prompt` | `103` |
| `record` | `35` |
| `note` | `16` |
| `register` | `13` |
| `layout/plan` | `12` |
| `bill` | `11` |
| `survey` | `8` |
| `ledger` | `7` |
| `report` | `4` |
| `memo` | `3` |

### Direct/formula dominance

- `103` direct formula prompts is still a large share of the file.
- The dominance is worst in:
  - `PCT-CP-001`
  - `PCT-CP-002`
  - `PCT-CP-004`

### Strongest improved CPs

- `PCT-CP-005`
  - Now has a better mix of word problems, records, ledgers, surveys, and report-style wrappers.
- `PCT-CP-006`
  - Still repetitive in math shell, but structurally better than the earlier five-way clone state.

### Weakest remaining CPs

- `PCT-CP-001`
  - Exact duplicates still cluster here.
  - Formula and drill style still dominate.
- `PCT-CP-002`
  - Improved wrappers exist, but many stems still feel like one template with different office nouns.
- `PCT-CP-004`
  - Several inverse-proportion families still feel like coached aptitude clones rather than distinct question-bank entries.

## Publish-Readiness Judgement

### Status

`Needs one final polish pass`

### Why this is not yet "Ready for manual review"

- `17` exact duplicate groups is still too high for a single chapter file, especially when `16` of them sit in `PCT-CP-001`.
- The biggest clone blocks are gone, but shell-level repetition is still visible enough that reviewers will notice it quickly.
- CP-005 and CP-006 are much healthier than before, so this is not major-cleanup territory anymore.

## Top 10 Remaining Weak Stems

| CP ID | QL ID | Stem snippet | Why weak | Fix direction |
| --- | --- | --- | --- | --- |
| `PCT-CP-001` | `PCT-QL-403` | `Write {percentageRate}% as a fraction.` | Exact duplicate and overly bare formula prompt | Keep only one copy of this shell |
| `PCT-CP-001` | `PCT-QL-703` | `Write {percentageRate}% as a fraction.` | Same as above | Remove or replace |
| `PCT-CP-001` | `PCT-QL-1401` | `If {percentageRate}% of {baseValue} is equal to x...` | Exact duplicate and weak exam feel | Keep one only |
| `PCT-CP-001` | `PCT-QL-1402` | `If {percentageRate}% of {baseValue} is equal to x...` | Same issue | Remove or rewrite |
| `PCT-CP-002` | `PCT-QL-010` | `If {baseValue} is increased by {percentageRate}%...` | Too generic and duplicated | Replace one of the two exact copies |
| `PCT-CP-002` | `PCT-QL-210` | `If {baseValue} is increased by {percentageRate}%...` | Same issue | Replace one of the two exact copies |
| `PCT-CP-003` | `PCT-QL-020` | `Two successive increases of {rate1}% and {rate2}%...` | Still reads like a worksheet line | Keep as a drill only if the family is reduced |
| `PCT-CP-004` | `PCT-QL-028` | `If the price of sugar increases... keep the expenditure same` | Old aptitude-book shell, heavily cloned | Keep at most one household version |
| `PCT-CP-005` | `PCT-QL-041` | `In a school, {rate1}% students are boys...` | Familiar school shell even after rewrite set | Keep one, rely more on register-led variants |
| `PCT-CP-006` | `PCT-QL-055` | `An alloy of copper and zinc has {percentageRate}% copper...` | Thin direct shell in a family with light noun swaps | Keep one direct alloy stem only |

## Top 10 Remaining Duplicate Or Near-Duplicate Families

| Rank | CP ID | QL IDs | Family summary | Severity |
| --- | --- | --- | --- | --- |
| 1 | `PCT-CP-001` | `PCT-QL-003, 103, 203, 303, 403, 503, 603, 703, 803, 903, 1003, 1103, 1203, 1303, 1403, 1503, 1603, 1703, 1803, 1903` | Oversized fraction-conversion family | High |
| 2 | `PCT-CP-001` | `PCT-QL-004, 104, 204, 304, 404, 504, 604, 704, 804, 904, 1004, 1104, 1204, 1304, 1404, 1504, 1604, 1704, 1804, 1904` | Oversized percent-of-whole family | High |
| 3 | `PCT-CP-001` | `PCT-QL-009, 109, 209, 309, 409, 509, 609, 709, 809, 909, 1009, 1109, 1209, 1309, 1409, 1509, 1609, 1709, 1809, 1909` | Large "find total/original from known percent" family | High |
| 4 | `PCT-CP-001` | `PCT-QL-403, 703, 903, 1303, 1903` | Exact `Write {percentageRate}% as a fraction.` family | High |
| 5 | `PCT-CP-002` | `PCT-QL-010, 110, 210, 310, 410` | Revised-value-after-increase family | Medium |
| 6 | `PCT-CP-002` | `PCT-QL-012, 112, 212, 312, 412` | Original-before-increase family | Medium |
| 7 | `PCT-CP-002` | `PCT-QL-015, 115, 215, 315, 415` | Salary raise / earlier salary family | Medium |
| 8 | `PCT-CP-003` | `PCT-QL-020, 120, 220, 320, 420` | Equivalent single increase family | Medium |
| 9 | `PCT-CP-004` | `PCT-QL-028, 128, 228, 328, 428` | Sugar price / same expenditure family | High |
| 10 | `PCT-CP-006` | `PCT-QL-048, 148, 248, 348, 448` | Acid dilution family | Medium |

## CP-Level Readiness Score

| CP ID | Score / 10 | Reason |
| --- | ---: | --- |
| `PCT-CP-001` | `4.5` | Strongest remaining exact-duplicate problem; still too drill-heavy |
| `PCT-CP-002` | `6.0` | Better wrappers, but still visibly shell-driven |
| `PCT-CP-003` | `6.5` | No exact duplicates, but repeated change/growth shells remain |
| `PCT-CP-004` | `6.0` | Cleaner than before, but still packed with aptitude-style shell cloning |
| `PCT-CP-005` | `7.5` | Clearly improved; repetition remains but is now closer to acceptable |
| `PCT-CP-006` | `7.0` | Strong cleanup progress, though dilution/drying families still feel close |

## Recommended Next Action

1. Do one final micro-pass only on `PCT-CP-001` and the most repetitive shells in `PCT-CP-002`, `PCT-CP-004`, and `PCT-CP-006`.
2. Remove all exact duplicates first.
3. Shrink oversized formula families rather than trying to preserve every variant.
4. After that, `PCT-001` should be in a much safer state for manual question-bank review.
