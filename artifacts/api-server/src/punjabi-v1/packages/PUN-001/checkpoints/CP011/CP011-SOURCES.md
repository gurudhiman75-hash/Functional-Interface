# CP011 Retrofit Source and Donor Boundary

## Inputs
- Historical CP011 donor corpus from Punjabi V1
- Historical semantic V2 PR #1639
- Previously approved CP011 head `90bc6464176ff08c84466a0fa13c383a59eec1f0`

## Audit
Raw donor:
- 252 rows
- 177 unique idiom strings

After spelling/inflection duplicate collapse:
- 170 distinct idiom concepts

The 64 previously approved idioms are used as canonical wording/context references where available; they are not treated as a cap.

## Editorial rules
- named/localized donor contexts generalized
- exact duplicate meanings refined where reverse testing would otherwise be ambiguous
- near-equivalent idioms retained as distinct authorities
- near-equivalent meanings excluded from false-option pairing by semantic similarity gate
- no English learner leakage
- no fixed numerical target
