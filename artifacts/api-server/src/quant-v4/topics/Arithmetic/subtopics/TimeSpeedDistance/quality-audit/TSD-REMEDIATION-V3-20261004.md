# TSD remediation V3 — 2026-10-04

TSD remains open. This batch completes worked-explanation review candidates for the CP008/CP009 representative review corpus; it does not approve, freeze or activate them.

## Content

- CP008: all 54 families, English/Hindi/Punjabi (162 rows), covering nine executable authorities. Calculations include speed conversions where the stem uses km/h, full-crossing distances, relative speeds, train/observer recovery, shared fixed-object equations and containment durations.
- CP009: all 66 families, English/Hindi/Punjabi (198 rows), covering eleven authorities. Each explanation substitutes the exact native or English input values and supplies results and units. Ratio recovery and floating-object recovery include their reasoning. The two unequal-leg speed questions show the time equation, quadratic, discriminant and valid root, independently checked by substitution.
- The 18 QL111 boat-meeting wording corrections are included within CP009's 198 rows, not counted again.
- V3 JSON contains 2,334 candidates: CP004 120, CP007 1,854, CP008 162, CP009 198. Markdown shows 678 review rows, using one case per CP007 family/language. Counts describe this review package, not approved chapter breadth.
- CP008/CP009 answer options are not newly authored by this batch. Frozen answers and source stems are retained except the explicitly versioned QL111 corrections. No candidate imports are added to live registration.

## CI corrections and synchronization

The branch was merged with New-main at 6f449b1716b0eeb1858a3310ef90e1d90414b8c5, preserving its new Reasoning and website work. The five failures on the prior PR run were traced to:

1. SAP CP006 equivalent fractions: distractor methods can yield the same exact value. Reproduced at seeds 394 and 1486. Selection now skips equivalent candidates and uses documented subtraction/percent-as-whole-number mistakes when required.
2. Punjab GK: stale BANK_ONLY assertions for legacy full-release cards. Actual release assertions remain enforced.
3. BLR standard integration: route assertions still read the retired combined route instead of the unified engine route.
4. BLR CP007: stale persistence=true expectation after New-main deliberately disabled persistence, plus the retired route path. Current persistence remains false; no release gate is changed.
5. TRG002 localization leakage: the proof exercised the old CP008 renderer rather than the existing frozen-family compatibility projection. The audit now uses that projection and preserves the GUY_WIRE_ANCHOR identity.

## Local validation

- 360 CP008/CP009 candidates pass exact answer parity, independent source verifiers, quadratic substitution, native label/script and lifecycle checks.
- CP004/CP007/QL111 candidates, CP003–CP012 frozen authorities and the 255-case current-main audit pass after synchronization.
- SAP fraction regression: 4,000 cases, including both failing seeds, pass distinct-value and one-correct-answer checks.
- SAP full chapter acceptance: 833 generated questions pass.
- Punjab GK adapter contract, BLR standard and CP007 production contracts, and TRG002 native leakage proof pass. The leakage proof covers 192 questions in two native languages across CP007–CP010.
- Production API build and whitespace checks pass.

GitHub CI for the new head must be assessed separately from these local results.

## Remaining editorial work

CP005 simultaneous-departure wording; later checkpoint explanation/diversity and physical-plausibility issues; independent foundation replacement mapping; mathematical UI rendering evidence; human review of versioned correction candidates. Do not declare TSD closed or start Banking Number Series until the TSD closure criteria are met.
