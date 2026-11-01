# Interest learner formatting repair

Date: 2026-11-01

The chapter adapter appended structured editorial objects to its completed learner lines. This exposed `[object Object]` in all 21 CP001 variants across English, Hindi and Punjabi. It now prefers the completed learner lines and accepts only scalar fallback text, without appending shortcut objects.

The shared direct-calculation presentation policy now skips option-specific feedback while retaining subsequent working and answers. Within the four math delimiters supported by QuestionRichText, it removes the redundant percent sign from numeric rate inputs divided by 100 and escapes remaining percent symbols. Percentages in ordinary prose are preserved.

QL100 also incorrectly expressed the annual percentage rate as `2D₂/SI₂`. Its displayed relation and substitution now use `200D₂/SI₂`; for example, `200 × 2000 / 40000 = 10%`. The underlying solver and answer were already correct.

## Verification

- All 133 registered QLs × 3 languages × 3 seeds generated successfully: 1,197 cases.
- No remaining object leaks, option-analysis lines, unescaped math percentages, percentage inputs divided by 100 twice, exposed major math commands, unmatched math delimiters or unbalanced braces were found.
- All 1,197 complete packages matched their pre-change versions after excluding explanationLines; stems, choices, answers, identities, traceability and lifecycle flags were unchanged.
- The reusable `int-001-learner-formatting-audit.ts` also checks deterministic generation, preserves the review-only lifecycle, tests percentage normalization idempotence and verifies QL100's rate scale.

Checks ran with Node 24 TypeScript stripping/import hooks in the focused source checkout. A full repository build and live browser rendering were not run. The change applies to new Question Studio generation and does not migrate existing bank records or rewrite historical source exports.
