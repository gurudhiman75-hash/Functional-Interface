# PCT-CONTENT-006 - Duplicate And Near-Duplicate Audit

## Summary

| File | Exact duplicate groups | Duplicate rows affected | Highest-risk area |
| --- | ---: | ---: | --- |
| `PCT-001/question-language.en.json` | 62 | 265 | CP-wide clone blocks |
| `PCT-002/question-language.en.json` | 2 | 4 | Two direct verbatim repeats |
| `PCT-003/question-language.en.json` | 0 | 0 | No exact duplicates, but strong shell repetition |
| `PCT-004/question-language.en.json` | 1 | 2 | One direct duplicate pair |
| `PCT-005/question-language.en.json` | 0 | 0 | No exact duplicates, but repeated successive-change shells |

## Exact Duplicate Groups

### `PCT-001/question-language.en.json`

| File | CP ID | QL ID | Repeated pattern | Severity | Recommended fix direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-001, PCT-QL-002` | `In an election, {percentageRate}% of the {baseValue} registered voters cast their votes...` | High | Keep one election shell; rewrite the other into a booth-wise or valid-votes record format |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-101, PCT-QL-102` | `A candidate scored {percentageRate}% of the total {baseValue} marks...` | Medium | Keep one direct marks version; convert the other into a mark-sheet or result summary |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-201, PCT-QL-202` | `Out of a population of {baseValue} in a village...` | Medium | Replace one with census/public-record phrasing |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-501, PCT-QL-502` | `If a factory produces {baseValue} units per day... defective units...` | Medium | Keep one factory version; move the other to inspection-sheet or stock-check language |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-701, PCT-QL-702` | `A mixture contains {baseValue} liters of liquid...` | Medium | Keep one direct mixture ask; rewrite the other as a lab note or solution log |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-801, PCT-QL-802` | `Rahul has Rs. {baseValue} with him...` | Medium | Replace one personal-money version with wallet/cash-book wording or another context |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-901, PCT-QL-902` | `The marked price of a book is Rs. {baseValue}...` | High | Keep one discount version; rewrite the other as invoice, sale notice, or shop bill |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1001, PCT-QL-1002` | `An attendance register lists {baseValue} students...` | Medium | Keep one register-led version only |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1101, PCT-QL-1102` | `A fruit seller had {baseValue} apples...` | Medium | Replace one with a mandi record or stock ledger context |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1201, PCT-QL-1202` | `Out of {baseValue} candidates who appeared for an exam...` | Medium | Convert one into a results bulletin shell |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1301, PCT-QL-1302` | `The total weight of an alloy is {baseValue} kg...` | Medium | Keep one alloy prompt; rewrite the other as workshop-material record |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1401, PCT-QL-1402` | `If {percentageRate}% of {baseValue} is equal to x...` | High | Keep one formula-only drill; replace the copy with a contextualized ask |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1501, PCT-QL-1502` | `A library has {baseValue} books...` | Medium | Keep one library version; rewrite the other as circulation register or shelf report |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1701, PCT-QL-1702` | `In a garden of {baseValue} trees...` | Medium | Replace one with orchard or plantation-record wording |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-1801, PCT-QL-1802` | `A water tank holds {baseValue} liters...` | Medium | Keep one direct utility version; move the other to supply log wording |
| `PCT-001/question-language.en.json` | `PCT-CP-001` | `PCT-QL-403, PCT-QL-703, PCT-QL-903, PCT-QL-1303, PCT-QL-1903` | `Write {percentageRate}% as a fraction.` | High | Keep one pure conversion prompt only; replace the rest with contextual or comparative percentage-to-fraction asks |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-010, PCT-QL-110, PCT-QL-210, PCT-QL-310, PCT-QL-410` | `If {baseValue} is increased by {percentageRate}%, find the new number.` | High | Retain one direct drill; rewrite others as revised price, sanctioned posts, turnout, or stock entries |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-011, PCT-QL-111, PCT-QL-211, PCT-QL-311, PCT-QL-411` | `If {baseValue} is decreased by {percentageRate}%, find the new number.` | High | Keep one direct drill; convert others into attendance, rainfall, or stock-loss shells |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-012, PCT-QL-112, PCT-QL-212, PCT-QL-312, PCT-QL-412` | `If {percentageRate}% is added to a number...` | High | Reduce to one formula prompt and use contextual original-value forms elsewhere |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-013, PCT-QL-113, PCT-QL-213, PCT-QL-313, PCT-QL-413` | `If {percentageRate}% is subtracted from a number...` | High | Same as above; keep one abstract version only |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-014, PCT-QL-114, PCT-QL-214, PCT-QL-314, PCT-QL-414` | `After increasing a number by {percentageRate}%, it becomes {finalValue}...` | High | Replace clone copies with payroll, stock, population, or bill-based original-value asks |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-015, PCT-QL-115, PCT-QL-215, PCT-QL-315, PCT-QL-415` | `A man's salary is increased by {percentageRate}% and becomes Rs. {finalValue}...` | High | Keep one salary version; rewrite the rest into pay revision memo, salary slip, or staff list contexts |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-016, PCT-QL-116, PCT-QL-216, PCT-QL-316, PCT-QL-416` | `Adding {value} to a number is the same as increasing it by {percentageRate}%...` | High | Keep one abstract version; rewrite others as bonus, surcharge, or stock-addition records |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-017, PCT-QL-117, PCT-QL-217, PCT-QL-317, PCT-QL-417` | `If {rate1}% of a number is {value1}, find {rate2}% of that number.` | High | Keep one drill; replace others with marks, budget, turnout, or production data |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-018, PCT-QL-118, PCT-QL-218, PCT-QL-318, PCT-QL-418` | `The difference between {rate1}% and {rate2}% of a number is {value}...` | High | Rewrite into comparative vote, budget, or stock contexts |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-019, PCT-QL-119, PCT-QL-219, PCT-QL-319, PCT-QL-419` | `By what percent should a number be increased... after a {percentageRate}% decrease?` | High | Keep one formula ask only; rewrite the rest as price recovery, stock recovery, or turnout recovery |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-020, PCT-QL-120, PCT-QL-220, PCT-QL-320, PCT-QL-420` | `Two successive increases of {rate1}% and {rate2}%...` | High | Keep one formula-only version; diversify the rest by context and structure |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-021, PCT-QL-121, PCT-QL-221, PCT-QL-321, PCT-QL-421` | `The population of a town increases by {rate1}%...` | High | Keep one population version; rewrite the others into district survey, school enrolment, or branch data |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-022, PCT-QL-122, PCT-QL-222, PCT-QL-322, PCT-QL-422` | `A number is increased by {rate1}% and then decreased by {rate2}%...` | High | Replace clone copies with contextual rise-fall narratives |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-023, PCT-QL-123, PCT-QL-223, PCT-QL-323, PCT-QL-423` | `The price of an item is increased by {rate1}% and then decreased by {rate2}%...` | High | Use sale notice, bill revision, or tax-slip structures instead of clones |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-024, PCT-QL-124, PCT-QL-224, PCT-QL-324, PCT-QL-424` | `The population of a town is {initialValue}... after 2 years` | High | Keep one population-growth prompt; convert others into cattle, subscribers, or electricity-use growth records |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-025, PCT-QL-125, PCT-QL-225, PCT-QL-325, PCT-QL-425` | `A machine's value falls by {percentageRate}% every year...` | High | Keep one depreciation version; rewrite others into subscriber loss, rainfall decline, or value register formats |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-026, PCT-QL-126, PCT-QL-226, PCT-QL-326, PCT-QL-426` | `The length and breadth of a rectangle are increased...` | High | Keep one geometry drill only; replace remaining copies with contextual composite-change asks |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-027, PCT-QL-127, PCT-QL-227, PCT-QL-327, PCT-QL-427` | `If the side of a square is increased...` | High | Keep one geometry drill only; use more varied chapter shells elsewhere |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-028, PCT-QL-128, PCT-QL-228, PCT-QL-328, PCT-QL-428` | `If the price of sugar increases... keep the expenditure same` | High | Keep one consumer-expenditure version; rewrite others into ration, fuel, or supply-note formats |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-029, PCT-QL-129, PCT-QL-229, PCT-QL-329, PCT-QL-429` | `The price of petrol falls... total cost remains same` | High | Keep one transport version; shift others into utility or commodity billing contexts |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-030, PCT-QL-130, PCT-QL-230, PCT-QL-330, PCT-QL-430` | `The length of a rectangle increases... area same` | High | Keep one geometry-shell version only |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-031, PCT-QL-131, PCT-QL-231, PCT-QL-331, PCT-QL-431` | `If a car's speed increases... time taken decrease` | High | Keep one transport variant; rewrite others into train timing, route scheduling, or delivery records |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-032, PCT-QL-132, PCT-QL-232, PCT-QL-332, PCT-QL-432` | `The price of an item is increased by {rate1}%... bring it back to the original` | High | Rewrite into revised-price memo or restored tariff forms |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-033, PCT-QL-133, PCT-QL-233, PCT-QL-333, PCT-QL-433` | `If the tax on an item is reduced... total change in revenue` | High | Keep one direct tax shell; rewrite others into fee circular or ticketing notice contexts |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-034, PCT-QL-134, PCT-QL-234, PCT-QL-334, PCT-QL-434` | `Working hours of a factory increased... total bill same` | High | Replace clones with payroll sheet, contractor bill, or labour notice shells |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-035, PCT-QL-135, PCT-QL-235, PCT-QL-335, PCT-QL-435` | `If the radius of a circle is decreased... area` | High | Keep one geometry drill only; do not carry five copies into the bank |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-036, PCT-QL-136, PCT-QL-236, PCT-QL-336, PCT-QL-436` | `A man spends {rate1}% of his income on food...` | High | Keep one classic SSC shell; rewrite others into ledger/public-budget/student-expense variants |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-037, PCT-QL-137, PCT-QL-237, PCT-QL-337, PCT-QL-437` | `A person spends {rate1}% of his salary on food...` | High | Same as above; family is too repetitive inside one CP |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-038, PCT-QL-138, PCT-QL-238, PCT-QL-338, PCT-QL-438` | `In an election between two candidates... total votes polled` | High | Keep one election shell; rewrite the rest into valid-votes records, booth reports, or turnout summaries |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-039, PCT-QL-139, PCT-QL-239, PCT-QL-339, PCT-QL-439` | `In an election, {rate1}% votes were cancelled...` | High | Same fix direction: diversify record format and ask style |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-040, PCT-QL-140, PCT-QL-240, PCT-QL-340, PCT-QL-440` | `A student needs {passRate}% marks to pass...` | High | Keep one pass-mark shell; convert others into result sheet or board notice language |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-041, PCT-QL-141, PCT-QL-241, PCT-QL-341, PCT-QL-441` | `In a school, {rate1}% students are boys...` | High | Keep one direct school version; rewrite others into attendance, enrolment, or section-wise records |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-042, PCT-QL-142, PCT-QL-242, PCT-QL-342, PCT-QL-442` | `Out of {totalPopulation} people, {percentageRate}% are men...` | High | Replace copies with district population note, voter list, or census sheet shells |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-043, PCT-QL-143, PCT-QL-243, PCT-QL-343, PCT-QL-443` | `In an exam, A gets {rate1}% more marks than B...` | High | Keep one comparison prompt; rewrite others as scorecard or merit-sheet comparisons |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-044, PCT-QL-144, PCT-QL-244, PCT-QL-344, PCT-QL-444` | `If {rate1}% people in a village are literate...` | High | Use census table / education department note variants |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-045, PCT-QL-145, PCT-QL-245, PCT-QL-345, PCT-QL-445` | `A man gave {rate1}% of his money to his wife...` | High | Keep one family-distribution shell; replace others with budget allotment or grant-split records |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-046, PCT-QL-146, PCT-QL-246, PCT-QL-346, PCT-QL-446` | `An alloy contains {rate1}% copper...` | High | Keep one alloy shell; rewrite others into workshop or lab records |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-047, PCT-QL-147, PCT-QL-247, PCT-QL-347, PCT-QL-447` | `Two candidates contested an election... lost by {voteDifference}` | High | Convert duplicate copies into polling-summary or ward-result formats |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-048, PCT-QL-148, PCT-QL-248, PCT-QL-348, PCT-QL-448` | `A mixture of {totalMixture} litres has {percentageRate}% acid...` | High | Keep one direct mixture question; rewrite others into lab notebook / dilution sheet styles |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-049, PCT-QL-149, PCT-QL-249, PCT-QL-349, PCT-QL-449` | `fresh fruit has {waterRate}% water, and dry fruit has {dryWaterRate}% water...` | High | Keep one fruit-drying shell; rewrite others into crop-processing or storage-loss records |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-050, PCT-QL-150, PCT-QL-250, PCT-QL-350, PCT-QL-450` | `In {totalMixture} litres of salt solution...` | High | Keep one solution-strength question; vary the others by note, register, or process sheet |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-051, PCT-QL-151, PCT-QL-251, PCT-QL-351, PCT-QL-451` | `If {value} litres of water is added... alcohol solution...` | High | Use one direct prompt and one lab-note style at most |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-052, PCT-QL-152, PCT-QL-252, PCT-QL-352, PCT-QL-452` | `Fresh grapes have {rate1}% water and dry grapes have {rate2}% water...` | High | Keep one grapes shell; convert others into crop dehydration / storage process statements |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-053, PCT-QL-153, PCT-QL-253, PCT-QL-353, PCT-QL-453` | `How much pure alcohol should be added...` | High | Keep one lab-strength prompt; vary the others by medicine mixture or chemical solution record |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-054, PCT-QL-154, PCT-QL-254, PCT-QL-354, PCT-QL-454` | `A solution has {percentageRate}% sugar. If {value} kg water flies away...` | High | Fix the English first, then replace clone copies with evaporation-note or processing-loss structures |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-055, PCT-QL-155, PCT-QL-255, PCT-QL-355, PCT-QL-455` | `An alloy of copper and zinc has {percentageRate}% copper...` | High | Keep one direct metallurgy prompt; diversify or remove the rest |

### `PCT-002/question-language.en.json`

| File | CP ID | QL ID | Repeated pattern | Severity | Recommended fix direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-002/question-language.en.json` | `PCT-CP-008` | `PCT-QL-015, PCT-QL-042` | `Out of {totalValue} {wholeLabel}, {targetRate}% are {targetLabel}, {otherRate}% are {otherLabel}, and {thirdRate}% are {thirdLabel}...` | High | Keep one direct list-based version; rewrite the other as a survey table, roster, or stock register |
| `PCT-002/question-language.en.json` | `PCT-CP-010` | `PCT-QL-019, PCT-QL-049` | `Out of {totalValue} {wholeLabel}, {rate1}% are {otherLabel}, {rate2}% are {thirdLabel}, and {targetRate}% are {targetLabel}...` | High | Convert one duplicate into a branch-wise statement or district summary |

### `PCT-004/question-language.en.json`

| File | CP ID | QL ID | Repeated pattern | Severity | Recommended fix direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-004/question-language.en.json` | `PCT-CP-003` | `PCT-QL-005, PCT-QL-006` | `After a {decreaseRate}% decrease, the {wholeLabel} became {decreasedValue}. Find the starting {wholeLabel}.` | High | Keep one direct version; rewrite the other into discount, depreciation, or stock-reduction language |

### Cross-File Exact Duplicate

| File | CP ID | QL ID | Repeated pattern | Severity | Recommended fix direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-004/question-language.en.json` and `PCT-005/question-language.en.json` | `PCT-CP-005` and `PCT-CP-002` | `PCT-QL-009` and `PCT-QL-004` | `A {wholeLabel} of {valuePrefix}{originalValue} first decreased by {rate1}% and then by {rate2}%. Find the final {wholeLabel}.` | High | Keep the basic shell in only one chapter; the other should use a stronger chapter-specific context and structure |

## Near-Duplicate Shell Families

| File | CP ID | QL ID | Repeated pattern | Severity | Recommended fix direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-002/question-language.en.json` | `PCT-CP-001` | `PCT-QL-001, 002, 021, 022, 023` | Known-part-to-total shell: `{knownRate}% ... is {knownValue}; find total` | Medium | Keep one generic version, one school/election version, and make the rest genuinely distinct records |
| `PCT-002/question-language.en.json` | `PCT-CP-002` | `PCT-QL-003, 004, 024, 025, 026` | Known-percent-to-target-percent shell | Medium | Convert at least two stems into bank slip, telecom usage table, or annual report form |
| `PCT-002/question-language.en.json` | `PCT-CP-004` | `PCT-QL-007, 008, 030, 031, 032` | Known-value / known-percent / target-value shell | Medium | Break the family with vote-sheet and scorecard formats instead of plain sentence clones |
| `PCT-002/question-language.en.json` | `PCT-CP-005` | `PCT-QL-009, 010, 033, 034, 035` | Ratio-to-percentage shell | Medium | Use chart, land-record, or election-tabulation structures, not just noun substitutions |
| `PCT-002/question-language.en.json` | `PCT-CP-006` | `PCT-QL-011, 012, 036, 037, 038` | Complement-percent shell | Medium | Diversify the ask type: remaining charge, remaining stock, remaining seats, etc. |
| `PCT-002/question-language.en.json` | `PCT-CP-009` | `PCT-QL-017, 018, 045, 046, 047` | Missing-percentage shell | Medium | Use result table, budget sheet, or poll summary layouts |
| `PCT-003/question-language.en.json` | `PCT-CP-003` | `PCT-QL-005, 006, 027, 028, 029` | `After a {increaseRate}% increase... became ... find original` | High | Keep one direct original-value shell; rewrite the rest as price list, stock card, or subscriber record questions |
| `PCT-003/question-language.en.json` | `PCT-CP-004` | `PCT-QL-007, 008, 030, 031, 032` | Multiplier-for-increase shell | High | Reduce formula-only prompts; use "growth factor" in real records instead |
| `PCT-003/question-language.en.json` | `PCT-CP-005` | `PCT-QL-009, 010, 033, 034, 035` | Successive-increase-to-final-value shell | Medium | Convert some stems into year-wise, month-wise, or branch-wise record structures |
| `PCT-003/question-language.en.json` | `PCT-CP-006` | `PCT-QL-011, 012, 036, 037, 038` | Net-increase shell | Medium | Use report / chart / note formats rather than serial direct statements |
| `PCT-003/question-language.en.json` | `PCT-CP-009` | `PCT-QL-017, 018, 045, 046, 047` | Current-to-target required increase shell | Medium | Use target memo, sales sheet, or revised-plan note forms |
| `PCT-004/question-language.en.json` | `PCT-CP-003` | `PCT-QL-005, 006, 027, 028, 029` | `After a {decreaseRate}% decrease... became ... find starting` | High | Same fix as `PCT-003`, but with richer discount / depreciation / stock-loss structures |
| `PCT-004/question-language.en.json` | `PCT-CP-004` | `PCT-QL-007, 008, 030, 031, 032` | Multiplier-for-decrease shell | High | Replace at least half the family with revised-price, revised-budget, or stock-left interpretations |
| `PCT-004/question-language.en.json` | `PCT-CP-005` | `PCT-QL-009, 010, 033, 034, 035` | Successive-decrease-to-final-value shell | Medium | Differentiate by document type and ask format |
| `PCT-004/question-language.en.json` | `PCT-CP-009` | `PCT-QL-017, 018, 045, 046, 047` | Current-to-target required decrease shell | Medium | Use utility, expenditure, inventory, and public-department reduction notes |
| `PCT-005/question-language.en.json` | `PCT-CP-001` | `PCT-QL-001, 002, 021, 022, 023` | Successive-increase shell with only context wrapper changes | Medium | Keep the best record-led versions and vary the ask framing or data style |
| `PCT-005/question-language.en.json` | `PCT-CP-002` | `PCT-QL-003, 004, 024, 025, 026` | Successive-decrease shell with light noun swaps | Medium | Push at least two variants into audit/depreciation/month-end reporting structures |
| `PCT-005/question-language.en.json` | `PCT-CP-006` | `PCT-QL-011, 012, 036, 037, 038` | Equivalent-single-multiplier shell | Medium | Keep one symbolic version; rewrite the others in natural English with business or utility contexts |
| `PCT-005/question-language.en.json` | `PCT-CP-007` | `PCT-QL-013, 014, 039, 040, 041` | Final-value-known, find-original shell | Medium | Spread these across final bill, stock sheet, admissions report, and transport note structures |
| `PCT-005/question-language.en.json` | `PCT-CP-009` | `PCT-QL-017, 018, 045, 046, 047` | Multi-stage `changed successively by...` shell | Medium | Convert sign-code shells into month-wise or quarter-wise change narratives |

## Duplicate Cleanup Recommendation

1. Remove verbatim duplicates first, especially the 62 groups in `PCT-001`.
2. Collapse formula-only clone families to one survivor where the math shell is enough.
3. Rebuild the remaining near-duplicate families through structure changes, not just noun swaps.
4. Normalize the lower-case variants in `PCT-001`; they currently signal accidental duplication.
