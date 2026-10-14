# QCP-001 — Banking Quantity Comparison

Status: `CONTENT_REVIEW_V4_TECHNICAL_SCOPE_FROZEN_REVIEW_ONLY`

`QCP-001` owns the Quantity I / Quantity II **representation contract**. It does not own the underlying arithmetic truth.

## Current source authorities

- `PCT-001` — percentage `percentOf` solving;
- `RAP-001` — ratio `scalingByComponent` solving;
- `NUM-001` — exact positive remainder solving;
- `ALG-002` shared Algebra foundation — exact rational quadratic roots;
- `PNL-001` — cost/selling price and profit/loss amount;
- `INT-001` — simple interest, amount and principal recovery;
- `MAL-001` — weighted two/three-component prices and unknown source price.

`generateQcp001Question({sourceMode: "WORD_PROBLEMS", seed, language, examProfile})` composes the last three topic authorities. Omit `sourceMode` for the existing four-authority foundation path. Word-problem questions retain independent source states and share the same relation contract; their IDs are distinct from foundation questions for the same seed. Both quantities are monetary amounts in rupees. Every alternative case is explicitly stated and independent.

The learner-visible quantity may contain one exact source state or several explicitly stated admissible source states. The representation compares the full Cartesian product of Quantity I and Quantity II values.

## Five exclusive Banking answer classes

1. Quantity I > Quantity II
2. Quantity I < Quantity II
3. Quantity I ≥ Quantity II
4. Quantity I ≤ Quantity II
5. Quantity I = Quantity II or the relationship cannot be established

The non-strict classes are emitted only when equality is genuinely possible while the opposite strict direction is impossible. The combined fifth class covers exact equality and genuinely indeterminate relation states, matching the established banking answer convention.

## Difficulty contract

`BANKING_PRELIMS` and `BANKING_MAINS` both use five options through the central Quant V4 exam-profile authority.

Mains increases admissible-state reasoning depth. It does not create difficulty by merely inflating numbers.

## Lifecycle lock

- English, Hindi and Punjabi;
- no permanent QL allocation;
- Question Studio discoverable: false;
- Question Bank: `NOT_STORED`;
- test/mock eligibility: `INELIGIBLE`;
- public publication: false.

The two operands use distinct variable names. Exact equality is covered in both profiles; such an item is not made artificially harder by repeating identical states. Learner explanations contain calculation/comparison steps; option diagnoses are separate audit metadata.

The V3 technical review covers the foundation runtime and these three word-problem bridges, with 12 task forms, nine ordered word-topic pairs and all five relation classes in both profiles and all three languages. V3 adds 5,400 packages to the 7,500-package foundation proof. Source fixtures remain comparison-only evidence, not proof that every source story is generated.

V4 adds `sourceMode: "ADDITIONAL"` for nine same-family story comparisons: compound interest, work, boats, trains, ages, urn probability, triangle mensuration, repeated remove/refill and cost-price recovery from two selling conditions. All use existing source truth. `sourceMode: "IRRATIONAL"` compares positive roots of `x² = d k²`, with `d ∈ {2,3,5}` and positive integer k. Explanations preserve exact fractions and surds. The finite V4 generator grammar is technically frozen with 21,540 audited packages; lifecycle permissions remain unchanged.

Source limits remain explicit: the 20 publisher comparison fixtures do not certify generated coverage of every source story. Five quarantined source items remain held. General mixed-radical/coefficient quadratics, other geometry shapes and more complex source-story combinations are outside the declared V4 grammar. Whole-source saturation is not asserted. See `docs/audits/qcp-content-review-v4-2026-10-13.md` for the exact scope and validation limits.


## V5 reviewed-source catalogue

`SOURCE_CATALOG` admits 20 source patterns with 59 bounded scale variants and
records five final exclusions in the source ledger. It supports both banking
profiles and EN/HI/PA while preserving review-only lifecycle locks. Use
`sourcePattern: "BA22-03", sourceScale: 1` for the canonical cylinder scaling case.
See `catalog-schema.ts`, `catalog-audit.ts` and
`docs/audits/qcp-content-review-v5-2026-10-14.md` for the finite contract and evidence.
The implemented catalogue and the reviewed 25-item corpus are technically closed;
all-publisher coverage and human/live approval are not certified.
