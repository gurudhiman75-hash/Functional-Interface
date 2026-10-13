# Quantity Comparison V4 technical-scope freeze — 2026-10-13

The declared finite QCP-001 V4 generator grammar is technically verified and frozen. Human/live verification is deferred to the user. This is not a whole-publisher-corpus saturation certificate or a publication approval.

The foundation and V3 word modes remain available. V4 adds `ADDITIONAL` and `IRRATIONAL` source modes without allocating QLs or changing any source chapter. Additional mode compares two independent stories of the same family, keeping their units consistent; the original foundation/word pairings are preserved.

| Source bridge | Declared V4 task grammar | Source truth |
| --- | --- | --- |
| Compound Interest | Annual amount, compound interest, principal from amount; generated 25%, two-year cases | INT CP003 canonical answer |
| Time & Work | Combined completion time; missing worker's completion time | TMW CP002 solver |
| Boats | Upstream, downstream and equal-distance round trip | TSD CP009 medium solver, exact SI conversion |
| Trains | Complete crossing, same/opposite directions | TSD CP008 solver |
| Ages | Present younger age from difference and past/future 2:1 relation | ALG shared linear-equation solver |
| Probability | Single red draw; two red draws with/without replacement; next-red conditional on an unreplaced red draw | PRB001/002 shared urn truth and actual task registries |
| Mensuration | Triangle area; perpendicular height from area/base | MEN triangle authority |
| Mixture replacement | One/two complete remove-and-water-refill cycles, initially positive milk and water | MAL CP002 replacement transition |
| Selling conditions | Cost price from selling-price difference at two profit/loss rates | PNL fundamental solver |
| Irrational roots | Positive k√d roots, d=2,3,5; explicit positivity and alternative equations | ALG quadratic/surd truth |

Root and probability explanations preserve exact surds/fractions. Same-family work stories use A/B for Quantity I and C/D for Quantity II. Age stems use the appropriate past/future tense in all three languages. Independent verification binds displayed prompts and stems and checks complete quadratic root sets; removing a real root or its positivity condition is rejected.

Validation: 21,540 measured generated packages total, including 8,640 V4 packages; all five relations in every declared family/profile/language group; 24 additional task forms; radicands 2/3/5; 540 new replay checks; 13 independent hand-calculated source answers; 41 new malformed-package rejections. The previous 961 exhaustive finite-set comparison cases and V2/V3 proofs also pass. API build and central exam-profile regression pass locally. Exact runtime hashes and counts are in `qcp-source-review/content-review-v4-proof-20261013.json`.

Type checking is not globally clean: ten imported MEN/Probability diagnostics already occur when importing those source modules alone. Their file/line/error-code baseline matches; there are zero new QCP diagnostics. The source chapters are preserved and this report does not claim a clean global TypeScript compilation.

The existing 25-item source ledger remains unchanged: 20 numerical comparison fixtures and five quarantined ambiguity/key-conflict items. Those fixtures are not reclassified as full generated story coverage. General mixed-radical/coefficient quadratics, other geometry shapes and more complex publisher-story combinations remain outside this finite grammar. Whole-source saturation remains uncertified.

Review-only gates remain locked: no permanent QL allocation, Studio discovery, Question Bank storage, test eligibility or public publication is asserted.
