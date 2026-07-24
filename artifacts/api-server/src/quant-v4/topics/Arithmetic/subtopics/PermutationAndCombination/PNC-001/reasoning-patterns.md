# PNC-001 Reasoning Patterns

## Active CP-001 patterns

1. **Sequential product** — multiply independent stage counts.
2. **Mutually exclusive sum** — add non-overlapping alternative counts.
3. **Disjoint case partition** — multiply within each case and add case totals.
4. **Simple complement** — unrestricted total minus invalid outcomes.
5. **Exact factor recovery** — recover a missing stage by exact division.
6. **Factorial definition** — evaluate `n!` as a descending exact product.
7. **Unit-factorial identity** — use `0! = 1! = 1`.
8. **Factorial cancellation** — retain only uncancelled consecutive factors.
9. **Factorial inverse search** — recover the bounded exact factorial argument.
10. **Factorial-quotient inverse search** — transform and recover an exact argument.

## Active CP-002 patterns

11. **Arrange all distinct objects** — all `n` objects fill `n` ordered positions.
12. **Ordered selection without repetition** — choose and order `r` from `n` distinct objects.
13. **Permutation-parameter inverse search** — recover missing `n` or `r` from an exact target.

## Active CP-003 patterns

14. **Unordered selection** — divide the ordered count by the `r!` internal orders of each selected set.
15. **Combination-parameter inverse search** — recover missing `n` or lower-half `r` from an exact `nCr` target.
16. **Combination symmetry** — use `nCr = nC(n-r)` to recover the complementary index.

## Active CP-004 patterns

17. **Non-zero digit placement** — fill ordered positions without repetition when every digit may lead.
18. **Leading-zero correction without repetition** — separate the first position from the remaining positions.
19. **Repetition-allowed code power** — every code slot uses the full symbol set.
20. **Repetition-allowed number correction** — exclude zero only from the first position.
21. **Parity final-digit cases** — restrict the final digit and preserve leading-zero/no-repetition semantics.
22. **Divisibility-by-5 cases** — count ending-0 and ending-5 cases separately.
23. **Threshold-prefix counting** — count qualifying first digits and multiply by suffix arrangements.
24. **Fixed-pattern alphanumeric stages** — multiply independent letter and digit powers.
25. **Code-alphabet inverse search** — recover the bounded base of an exact power.
26. **Exactly-one-pair construction** — choose the repeated symbol, choose two other symbols and arrange `2,1,1`.

## Active CP-005 patterns

27. **Identical-object correction** — divide `n!` by every repeated multiplicity factorial.
28. **Fixed-position multiset reduction** — fix one object, reduce its multiplicity when necessary and arrange the remainder.
29. **Multiset overcount factor** — identify the product of multiplicity factorials.
30. **Multiplicity inverse search** — recover a bounded repeated multiplicity from an exact target.

These are the 30 patterns required by currently admitted QLs. Future modes are added only when a new QL requires a distinct solver/evidence/validator contract.

## Evidence contract

The solver returns decisive stage, factorial, permutation, combination, digit/code or multiset evidence. CP-004 evidence includes symbol count, length, first-position choices, final-digit cases, threshold prefixes, alphanumeric stage totals, inverse targets and multiplicity-pattern factors. CP-005 evidence includes total/remaining objects, multiplicities, factorial numerator, correction denominator and inverse target. Explanation prose consumes this evidence and does not recalculate answers independently.
