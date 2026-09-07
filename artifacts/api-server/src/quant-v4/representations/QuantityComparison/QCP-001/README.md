# QCP-001 — Banking Quantity Comparison

Status: `PHASE0_REVIEW_ONLY`

`QCP-001` owns the Quantity I / Quantity II **representation contract**. It does not own the underlying arithmetic truth.

## Phase-0 source authorities

- `PCT-001` — percentage `percentOf` solving;
- `RAP-001` — ratio `scalingByComponent` solving;
- `NUM-001` — exact positive remainder solving.

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

- English only;
- no permanent QL allocation;
- Question Studio discoverable: false;
- Question Bank: `NOT_STORED`;
- test/mock eligibility: `INELIGIBLE`;
- public publication: false.
