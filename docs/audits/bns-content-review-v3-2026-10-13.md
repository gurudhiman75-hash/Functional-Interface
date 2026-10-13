# Banking Number Series: breadth and Mains technical audit

Starting remote main: `211797bd2c1f4b6ffa52f2977419c34ded989501`. Builds on merged PRs #3321 and #3333. User-run live verification remains deferred.

## Implemented scope

The runtime now has 19 grammars: the five existing grammars plus quartic polynomial terms, power differences, quadratic differences, descending cube differences, odd-square differences, consecutive cubes, variable multiply/subtract, variable multiply/add, fractional geometric multiplication, variable fractional multiplication, variable fractional division, alternating multiplication/division, prime second differences and interleaved progressive differences.

Every new grammar supports next, missing and wrong terms in English, Hindi and Punjabi. Wrong-term generation covers all eight error positions, including first and last terms. Missing-term positions remain 3/4/5. Wrong items retain eight visible terms to avoid ambiguous repairs across the enlarged grammar vocabulary. This is a deliberate runtime shape; exact reproduction of each source item's visible-term count is not asserted.

Default Prelims selection reaches the full chapter vocabulary. The bounded Mains profile selects twelve harder grammars and all three tasks; elementary fractional geometric and direct consecutive-cube patterns are excluded from that selector. The section simulator now requests this profile rather than returning a hard-coded number-series capability gap. This is a source-supported technical profile, not a claim of calibrated real-exam frequency or difficulty psychometrics.

## Independent mathematics and options

Generator arithmetic and verifier arithmetic are separately authored. The verifier reconstructs candidate repairs from unaffected observations. Equivalent descriptions may overlap: consecutive cubes also have quadratic first differences. Such equivalence is permitted; a learner item must still have exactly one valid option across all supported grammars. Wrong items must have exactly one error/replacement pair across the full grammar vocabulary, independently of hidden generator arithmetic evidence.

Fractional patterns keep necessary decimals. Alternating-operation generation uses terminating ratios. Distractors include copied neighbours, local-average assumptions, repeated differences, reversed differences, doubled steps and arithmetic slips; all alternatives are rejected against the complete grammar vocabulary. Signed affine addends now generate the geometric-difference source family without introducing a duplicate grammar identity.

## Source ledger

The two publisher practice pages contain twenty source locators. Nineteen now have independently adjudicated numeric fixtures and supported mathematical grammars. The earlier PracticeMock item 3 hold is resolved by n⁴ − n³ − n², with missing value 475. The same formula and matching values appear in University of Michigan's 2009 competition solutions; this independently corroborates the formula, not bank-exam provenance.

BankersAdda item 8 remains `QUARANTINED_UNRESOLVED`. It is excluded from coverage approval and generator authority. No answer is guessed and no source is silently repaired. Neither publisher practice page is labelled official PYQ evidence.

Sources:
- https://www.practicemock.com/blog/most-asked-number-series-questions-for-sbi-po-download-free-pdf/
- https://www.bankersadda.com/number-series-for-ibps-exams/
- Formula corroboration only: https://lsa.umich.edu/content/dam/math-assets/math-document/umumc/UMUMC26sol.pdf, page 1.

## Validation and limits

The proof JSON records the completed scoped audit, including source fixtures, deterministic replay, multilingual mathematical parity, all answer positions and all missing/error positions. Mains examples are independently verified. Wrong-answer tampering is rejected, and a forged generator arithmetic proof cannot determine wrong-term acceptance.

Technical freeze applies to the implemented V3 runtime only. A whole-chapter source-saturation freeze is not claimed while the quarantined item and broader official-PYQ calibration remain outside verified evidence. No human approval, Question Bank storage, public publication or test activation is asserted. Existing review-only delivery gates remain intact.
