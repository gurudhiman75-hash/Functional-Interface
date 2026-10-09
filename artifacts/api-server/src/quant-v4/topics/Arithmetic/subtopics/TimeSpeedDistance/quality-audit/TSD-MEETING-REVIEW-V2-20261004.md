# TSD meeting correction checkpoint — 2026-10-04

PR #3148 now contains the earlier tested audit/remediation work on GitHub. Its TSD authority, canonical review, current-main closure and production-build checks passed. This does not establish editorial closure.

## New correction candidates

CP009 / QL111: 18 questions (six families in English, Hindi and Punjabi) explicitly assign Boat A to the upstream end and Boat B to the downstream end, with simultaneous departure towards each other. All five calculation steps show substituted values, results and units. The first English case yields 42 km; swapping the starting assignments would instead yield 30 km, demonstrating why the original omission matters.

These are unapproved, unregistered editorial candidates. Existing frozen renderers, solution identities and release permissions are preserved. No Bank, test, mock or public activation occurs.

## Validation

- All 18 candidates pass an independent river-coordinate meeting equation and source-answer parity check.
- Lifecycle locks and explanation structure pass.
- Trigonometry route contract passes after replacing its stale BANK_ONLY label expectations with the existing legacy full-internal metadata contract. Its bank/test/mock/public assertions remain enforced.
- git diff --check passes.

## Remaining work

CP008 worked explanations; remaining CP009 worked explanations; CP005 simultaneous-departure wording; later checkpoint explanation/diversity and plausibility issues; independent foundation replacement mapping; UI mathematics rendering evidence. Other failing GitHub workflows still require diagnosis. TSD remains open.
