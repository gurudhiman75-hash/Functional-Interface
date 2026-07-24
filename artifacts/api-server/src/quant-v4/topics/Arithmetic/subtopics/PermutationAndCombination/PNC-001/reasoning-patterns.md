# PNC-001 Reasoning Patterns

## CP-001

1. **Sequential product** — when one outcome requires one choice from every stage, multiply the stage counts.
2. **Mutually exclusive sum** — when exactly one alternative group is chosen and groups do not overlap, add their counts.
3. **Disjoint case partition** — compute each case independently, then add the case totals.
4. **Simple complement** — count the unrestricted total, count invalid outcomes, then subtract.
5. **Exact factor recovery** — if `total = known × missing`, recover `missing = total ÷ known` and require exact divisibility.

## Evidence contract

The solver returns the chosen method plus the relevant stage counts, case counts, unrestricted total, invalid count or recovered factor. Explanation prose consumes this evidence and must not recalculate the answer independently.