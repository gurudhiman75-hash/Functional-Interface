# PNL-CP-006 Distractor Contract

Status: FREEZE CANDIDATE

## Governing rule

Every wrong option must represent a recognisable commercial-mathematics misconception. Arbitrary `+/-` offsets, random nearby values and duplicated answer semantics are prohibited.

## Approved misconception families

1. **Purchase-price-only base** — ignores repairs, transport, installation, packaging or other necessary expenses.
2. **Double-counted expense** — adds a flat expense both before and after the percentage overhead.
3. **Wrong overhead base** — applies percentage overhead to purchase price when the contract says purchase plus flat expenses, or the reverse.
4. **Expense treated as revenue** — subtracts overhead from effective cost.
5. **Profit on purchase price** — applies the target rate to purchase price instead of effective cost.
6. **Loss added rather than subtracted** — reverses the commercial direction.
7. **Wastage ignored** — divides input cost by total input quantity rather than usable output.
8. **Scrap recovery ignored** — fails to deduct scrap value from net production cost.
9. **Scrap added to cost** — treats by-product recovery as another expense.
10. **Prime-cost base error** — applies factory overhead only to material, only to labour, or to the final cost rather than prime cost.
11. **Packaging omitted** — excludes a necessary manufacturing component.
12. **Fixed cost treated as per-unit cost** — adds all fixed cost to one unit.
13. **Contribution confused with selling price** — divides fixed cost by unit selling price instead of selling price minus variable cost.
14. **Variable cost confused with contribution** — subtracts fixed cost per unit from the wrong side.
15. **No ceiling on quantity** — returns a fractional break-even or target-profit quantity instead of the minimum whole number.
16. **Target profit omitted** — uses break-even quantity when an absolute target profit is required.
17. **Contribution-margin percent used as a whole number** — divides by `40` rather than `0.40`, or multiplies instead of dividing.
18. **Sales-mix quantities ignored** — adds unit contributions without applying bundle quantities.
19. **Product contributions averaged** — uses a simple average instead of weighted bundle contribution.
20. **Margin-of-safety base error** — divides revenue surplus by break-even revenue instead of actual revenue.
21. **Prior recovery omitted** — assigns the full target recovery to the final transaction.
22. **Profit and loss percentages assumed symmetric** — claims an `x%` loss needs an `x%` gain on the reduced capital.
23. **Original-capital recovery base** — computes recovery profit on original rather than remaining capital.
24. **Commission added to proceeds** — adds commission to gross price when finding net recovery.
25. **Gross and net price confused** — compares gross selling price directly with effective cost.
26. **Commission applied to effective cost** — uses the wrong commission base.
27. **Inverse commission multiplier reversed** — multiplies target net receipt by the retained fraction instead of dividing by it.
28. **Break-even statement insufficiency error** — accepts fixed cost without unit contribution, or unit contribution without fixed cost.

## Option-set requirements

- Exactly one option must satisfy the runtime result and answer semantic.
- At least two distractors should come from different misconception families.
- Direction labels must agree with the numerical result.
- Amount, percentage, price, quantity and statement answers must not be mixed unless the question explicitly asks for a combined answer.
- Rounded values may be used only when the question explicitly declares a rounding rule; the runtime otherwise requires exact paise and whole-unit semantics.
