# MAL-001 native explanation and diagram correction V9 — 2026-10-17

Status: visible calculation-step and diagram correction; review-candidate lifecycle retained.

## Corrections

The older localization produced English word order in Hindi/Punjabi explanations and left ratio-adjustment payload text in English. V9 authors the learner-facing calculation sentences, splits instructions after equations, and preserves the source mathematical expressions. It covers weighted averages, component ratios, replacement, concentration/moisture, commercial mixtures, and vessel-transfer explanations.

Both diagram directive families are rebuilt from the English payload with localized display fields. Version, kind, ratios, expressions, array structure and numeric values are preserved. Serialization uses unpadded base64url, as required by QuestionRichText's directive recognizer; ordinary base64 from the older localizer could leave a native diagram unrecognized.

The real frontend components now use native captions and accessible descriptions when their title uses Hindi/Punjabi. Before/After, Ratio, Operation, Target ratio, alligation range captions and deviation captions are covered. Quantity rows avoid appending a unit when the quantity already contains one. English remains the default for English titles.

## Verification

- Existing 67-QL × 60-seed trilingual regression: 12,060 source-language samples, 8,040 native comparisons, deterministic replay and 1,000-question batches per language. Option/answer/parameter parity, formula command streams, hidden-answer isolation and delivery locks pass.
- New frontend-backed regression: 67 QLs × 12 seeds × 2 native languages = 1,608 questions; 9,432 visible explanation lines and 744 diagram payload occurrences. Every tested visible line matches an authored sentence/formula rule. Every payload passes the actual frontend validator, preserves structural/numeric data and uses recognizer-compatible base64url. Native cross, two-component and three-component examples render to SVG through React server rendering.
- Existing full systematic chapter audit passes. The native explanation module passes scoped TypeScript checking.

## Remaining boundary

Some legacy collapsed help, verification prose and auxiliary strings still use the existing lexical translator when no V9 sentence rule matches. V9 records authored/fallback string counts in traceability rather than claiming all explanation fields are authored. These fields and a human visual/wording review remain open. No whole-chapter editorial freeze, live UI verification or native approval is claimed. Bank/test/publication locks remain unchanged.
