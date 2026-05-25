# Percentage Phrase And Localization Notes

Percentage V2 keeps formula generation separate from wording. Stem phrase banks live beside the legacy stem renderer and should only vary natural language frames, not variables, formulas, options, or answers.

When adding phrase variants:

- Keep every variant semantically equivalent to the same canonical problem.
- Use deterministic seed-based selection so exports remain reproducible.
- Vary the first few words for high-volume families, because audit reports track repeated first-8-word openings and full opening sentences.
- Do not move numeric values between clauses unless solver and explanation validation already derive them from canonical variables.

Localization should be context-aware:

- Render labels from `problem`, `scenario`, `variables`, family, and topology when available.
- Prefer explicit context fields or semantic anchors over source-text substring checks.
- Commodity, liquid, object, exam, tax, and commission labels should follow the canonical problem context; for example, a sugar stem must not localize to fuel.
- Future topics should add their own phrase banks and context labels rather than copying Percentage salary, tax, mixture, or commission strings.

The large audit devtool is the guardrail for scale. It reports repeated openings, repeated explanation intro lines, phrase diversity by family, and low-diversity families, while preserving solver, duplicate, localization, distractor, family-cap, and realism gates.
