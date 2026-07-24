# PNC-001 Reasoning Patterns

## Active CP-001 patterns

1. **Sequential product** — when one outcome requires one choice from every stage, multiply the stage counts.
2. **Mutually exclusive sum** — when exactly one non-overlapping alternative group is chosen, add the counts.
3. **Disjoint case partition** — compute each disjoint case independently, then add the case totals.
4. **Simple complement** — count the unrestricted total, count invalid outcomes, then subtract.
5. **Exact factor recovery** — if `total = known × missing`, recover `missing = total ÷ known` and require exact divisibility.

These are the patterns required by the current admitted QLs. This file is extended only when newly approved QLs introduce a genuinely different reasoning construction.

## Evidence contract

The solver returns the chosen method plus the relevant stage counts, case counts, unrestricted total, invalid count or recovered factor. Explanation prose consumes this evidence and must not recalculate the answer independently.
