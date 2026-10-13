# QCP-001 — Banking Quantity Comparison

Status: `CONTENT_REVIEW_V2_REVIEW_ONLY`

`QCP-001` owns the Quantity I / Quantity II **representation contract**. It does not own the underlying arithmetic truth.

## Current source authorities

- `PCT-001` — percentage `percentOf` solving;
- `RAP-001` — ratio `scalingByComponent` solving;
- `NUM-001` — exact positive remainder solving;
- `ALG-002` shared Algebra foundation — exact rational quadratic roots.

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

The technical review covers this four-authority representation runtime. Publisher word-problem fixtures test comparison mathematics; broader topic-specific word-problem adapters and irrational-root generation are outside the verified runtime scope. No whole-chapter source saturation is claimed.
