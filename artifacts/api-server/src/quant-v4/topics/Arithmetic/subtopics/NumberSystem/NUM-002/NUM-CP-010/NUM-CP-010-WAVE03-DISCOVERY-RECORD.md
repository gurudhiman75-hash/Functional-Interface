# NUM-CP-010 — Wave 03 Discovery Record

**Package:** `NUM-002`  
**Checkpoint:** `NUM-CP-010`  
**Wave:** 03 solution structure + remaining legacy gaps  
**Permanent QLs:** none  
**Wave 03 temporary prototypes:** 8  
**Cumulative temporary prototypes:** 25

## Purpose

Wave 03 targets solve contracts that were still absent after direct/inverse reconstruction: multiplicity classification, complete number sets, two-unknown reconstruction, multiplication carry, concatenated blocks, zero-edge reversal and digital-root recovery.

## Wave 03 contracts

| Prototype | Contract | Expected merge/split pressure |
|---|---|---|
| P018 | no/one/multiple digit-solution classification | likely distinct semantic adapter over digit constraints |
| P019 | complete set of all valid two-digit numbers | set semantic; compare with P014 digit-set authority |
| P020 | ordered pair of two unknown digits in addition | may split from single-unknown carry because evidence topology differs |
| P021 | missing digit in multiplication with carry | arithmetic operator topology distinct from addition/subtraction |
| P022 | reconstruct repeated two-digit decimal block | likely concatenation/place-value authority |
| P023 | reversal with trailing-zero / dropped leading-zero edge | expected merge into reversal authority unless source evidence says otherwise |
| P024 | descending consecutive digits | expected merge with P008 relational-digit authority |
| P025 | direct digital root | candidate distinct digit-aggregate contract; ownership must be checked against divisibility use |

## Legacy V2 recovery status after Wave 03

- `ns_sum_of_digits` → covered P002/P025.
- `ns_number_of_digits` → covered P017 exact-only.
- `ns_digit_interchange` → covered P003/P004/P023.
- `ns_digit_formation` → arrangement-count forms explicitly reassigned to P&C.
- `ns_digit_constraints` → covered across Waves 01–03.
- `ns_unknown_digit_equation` → covered single, chained and two-unknown arithmetic forms.
- `ns_digit_sum_reconstruction` → covered P002/P007/P016/P019.
- `ns_consecutive_digit_number` → covered P008/P024.

## Remaining material-gap candidates

Before final source saturation, audit these rather than automatically implementing them:

1. inverse digital-root question where the full valid digit set is requested;
2. repeated block with more than two copies, only if reasoning changes;
3. multiplication with two unknown digits, only if P020/P021 composition is not enough;
4. exact digit count for powers/products beyond P017, only with exact bounds and source demand;
5. bounded digit occurrence for digit 0, because leading-zero handling materially changes the count;
6. Data Sufficiency / statement representations as adapters, not default new authorities;
7. any source fixture combining digit structure with divisibility: CP003 versus CP014 ablation required.

## Merge candidates now strongly indicated

- P001/P009/P010 → one place-value family unless direct/inverse semantics require separate learner authorities.
- P003/P004/P023 → reversal family with length/zero edge parameters.
- P005/P011 → addition carry depth.
- P006/P012 → subtraction borrow depth.
- P007/P016 → palindrome length parameter.
- P008/P024 → consecutive digit direction parameter.
- P014/P019 → compare digit-set versus number-set semantic before merging.

## Lifecycle

All 25 discovery prototypes remain:

- inactive;
- not Question Studio discoverable;
- not writable to Question Bank;
- not test/mock eligible;
- not publicly publishable;
- without permanent QL IDs.

## Next gate

Run a post-Wave-03 source-saturation and merge/split audit. Only implement a Wave 04 if that audit finds a material learner/solver/evidence gap. No permanent count may be approved before that audit and explicit user approval.
