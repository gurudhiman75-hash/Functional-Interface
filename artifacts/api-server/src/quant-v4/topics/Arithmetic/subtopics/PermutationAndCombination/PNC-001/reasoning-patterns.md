# PNC-001 Reasoning Patterns

## Active CP-001 patterns

1. **Sequential product** — when one outcome requires one choice from every stage, multiply the stage counts.
2. **Mutually exclusive sum** — when exactly one non-overlapping alternative group is chosen, add the counts.
3. **Disjoint case partition** — compute each disjoint case independently, then add the case totals.
4. **Simple complement** — count the unrestricted total, count invalid outcomes, then subtract.
5. **Exact factor recovery** — if `total = known × missing`, recover `missing = total ÷ known` and require exact divisibility.
6. **Factorial definition** — evaluate `n!` as the exact product from `n` down to `1`.
7. **Unit-factorial identity** — use `0! = 1! = 1` inside a small exact expression.
8. **Factorial cancellation** — cancel the common lower factorial and multiply only the remaining consecutive factors.
9. **Factorial inverse search** — find the unique bounded argument whose factorial recreates the target, then apply any stated shift.
10. **Factorial-quotient inverse search** — transform `n!/(n - 2)!` to `n(n - 1)` and find the exact bounded match.

These are the patterns required by the current admitted QLs. This file is extended only when newly approved QLs introduce a genuinely different reasoning construction.

## Evidence contract

The solver returns the chosen method plus the relevant stage counts, case counts, unrestricted total, invalid count, recovered factor, factorial argument, cancellation factors or inverse-search match. Explanation prose consumes this evidence and must not recalculate the answer independently.