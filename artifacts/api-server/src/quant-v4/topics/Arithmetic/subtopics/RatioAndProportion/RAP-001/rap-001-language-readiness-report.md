# RAP-001 Language Readiness Report

## Current Status

- RAP-001 has 169 English question-language templates across RAP-CP-001 to RAP-CP-006.
- Hindi and Punjabi runtime generation is intentionally restricted to 27 localized QLs through the shared language-coverage allowlist.
- The 27 Hindi/Punjabi QL templates have been repaired from mojibake-corrupted text to clean Unicode.
- Question Studio discovery should treat RAP-001 as English-only until the remaining QLs and explanation assets are localized.

## Grammar And Encoding Fixes

- Replaced corrupted Hindi/Punjabi QL text that appeared as `à¤...` / `à¨...`.
- Preserved all active placeholders for the 27 allowlisted localized QLs.
- Fixed RAP-QL-011 occurrence parity by including the second `{personA}` naturally in both Hindi and Punjabi.
- Polished the active Hindi/Punjabi stems for natural phrasing while keeping numbers, ratios, `%`, and `Rs.` conventions unchanged.

## Runtime Safety

- Direct backend generation remains available for Hindi/Punjabi only for the allowlisted 27 QLs.
- Forced Hindi/Punjabi generation for non-allowlisted QLs remains blocked.
- Random Hindi/Punjabi runtime selection remains restricted to the allowlist.
- RAP-001 Question Studio/public preview language support is English-only until full localization is complete.

## Known Caveats

- `explanation.hi.json` and `explanation.pa.json` still contain English source prose and should not be treated as complete localized explanation libraries.
- Runtime Hindi/Punjabi explanations are generated through `localized-explanation-renderer.ts`, not the mixed-language explanation JSON assets.
- Full Hindi/Punjabi RAP-001 coverage is not complete; 142 of 169 English QLs are still not localized or allowlisted.
- The existing RAP duplicate-rate check is permissive; recent smoke output showed a duplicate rate around 21%.

## Verification Expectations

- `rap-001-multilingual-audit.ts` should pass with zero blocking failures.
- The audit may report source English leakage in explanation JSON as a known caveat.
- Build and the main RAP test should pass after changes.
