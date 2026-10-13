# Quantity Comparison content review V3 — 2026-10-13

Adds generated word-problem composition through existing PNL-001, INT-001 and MAL-001 solvers. Foundation generation remains the default; use `sourceMode: "WORD_PROBLEMS"` for the new review-only path. The two paths have distinct question IDs for the same seed. No source solver or previously closed chapter was changed.

| Bridge | Generated task forms | Calculation truth |
| --- | --- | --- |
| Profit & Loss | Selling price, cost price, profit/loss amount; profit and loss directions | PNL fundamental solver; exact money |
| Simple Interest | Interest, total amount, principal from interest | INT CP001 rational solver |
| Mixture | Two/three-component weighted price; unknown second-component price | MAL CP001 rational solver |

Both quantities are rupee amounts. Multiple admissible cases are explicitly independent; all possible value pairs are compared. Every prompt and explanation is authored in English, Hindi and Punjabi. The independent verifier recomputes the arithmetic separately and rejects altered displayed source prompts, stems, owners, tasks and source domains.

Validation passed: 5,400 word-problem language/profile packages; nine ordered word-topic pairs per profile/language, all five answer classes per pair; 12 task forms; 360 deterministic replays; eight hand-calculated answers; ten malformed-package rejections. The full existing 7,500-package foundation audit and 961 exhaustive set comparisons also passed. Scoped TypeScript compilation passed. Proof is in `qcp-source-review/content-review-v3-proof-20261013.json`.

The existing 25-item source ledger is preserved: 20 numerical comparison fixtures and five quarantined items. It is not reclassified as complete generated source coverage. The new foundational bridges do not certify every more complex publisher story.

Remaining source-derived gaps: compound interest; time and work; boats/trains; probability; ages; mensuration; dilution/replacement mixtures; multi-condition selling-price recovery; irrational quadratic roots. Whole-source saturation and whole-chapter freeze remain unclaimed.

Human/live verification is deferred to the user. Review-only lifecycle permissions remain locked: no permanent QL, Studio discovery, Question Bank storage, test eligibility or publication is asserted.
