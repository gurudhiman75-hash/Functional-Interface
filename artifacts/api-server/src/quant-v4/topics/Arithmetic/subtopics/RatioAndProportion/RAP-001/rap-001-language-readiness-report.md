# RAP-001 Language Readiness Report

## Current Status

- RAP-001 has 169 English question-language templates across RAP-CP-001 to RAP-CP-006.
- Hindi and Punjabi runtime generation is intentionally restricted to 62 localized QLs through the shared language-coverage allowlist.
- The 27 Hindi/Punjabi QL templates have been repaired from mojibake-corrupted text to clean Unicode.
- Question Studio discovery should treat RAP-001 as English-only until the remaining QLs and explanation assets are localized.

## Grammar And Encoding Fixes

- Replaced corrupted Hindi/Punjabi QL text that appeared as `à¤...` / `à¨...`.
- Preserved all active placeholders for the 62 allowlisted localized QLs.
- Fixed RAP-QL-011 occurrence parity by including the second `{personA}` naturally in both Hindi and Punjabi.
- Added the first expansion batch for `RAP-CP-001` ratio-normalization variants: `RAP-QL-102` through `RAP-QL-1902`.
- Added the remaining `RAP-CP-001` localized variants for simple linkage, ratio-tree linkage, component scaling, and decimal normalization: `RAP-QL-101/201/301/401`, `RAP-QL-103/203/303/403`, `RAP-QL-104/204/304/404`, and `RAP-QL-106/206/306/406`.
- Polished the active Hindi/Punjabi stems for natural phrasing while keeping numbers, ratios, `%`, and `Rs.` conventions unchanged.

## Runtime Safety

- Direct backend generation remains available for Hindi/Punjabi only for the allowlisted 62 QLs.
- Forced Hindi/Punjabi generation for non-allowlisted QLs remains blocked.
- Random Hindi/Punjabi runtime selection remains restricted to the allowlist.
- RAP-001 Question Studio/public preview language support is English-only until full localization is complete.

## Explanation Source Cleanup

- `explanation.hi.json` and `explanation.pa.json` have been regenerated as clean Unicode source packs.
- The source packs preserve the English explanation structure: CP IDs, explanation IDs, task-kind keys, and alias relationships remain aligned with `explanation.en.json`.
- Hindi/Punjabi explanation source prose no longer contains mojibake or English instructional fragments.
- Runtime Hindi/Punjabi explanations still use `localized-explanation-renderer.ts`, which provides task-aware formulas, substitutions, and conclusions.

## Known Caveats

- Runtime Hindi/Punjabi explanations are generated through `localized-explanation-renderer.ts`, not directly from the explanation JSON assets.
- Full Hindi/Punjabi RAP-001 coverage is not complete; 107 of 169 English QLs are still not localized or allowlisted.
- The existing RAP duplicate-rate check is permissive; recent smoke output showed a duplicate rate around 21%.

## Verification Expectations

- `rap-001-multilingual-audit.ts` should pass with zero failures.
- Source English leakage and mojibake in Hindi/Punjabi question/explanation assets are blocking audit failures.
- Build and the main RAP test should pass after changes.
