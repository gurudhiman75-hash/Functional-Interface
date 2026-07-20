# AVG-001 Design Amendments Before Runtime Work

The uploaded final consolidated design remains authoritative for the six CPs, 29 solve modes, 360 QLs, stable ranges, difficulty targets and English-first release. The runtime proof adopts these implementation clarifications:

1. Phase 1 is exactly 24 CP-001 QLs: six per solve mode.
2. Exact rational arithmetic is the internal authority. Display conversion is separate.
3. Every QL carries an explicit `scenarioVariant`.
4. Hindi/Punjabi use a localization contract only during English development; no fake structural translations are created.
5. The 120-QL checkpoint requires review of all 120 primary rows.
6. Generator exhaustion, invalid construction and unsupported language paths fail immediately.
7. Runtime maturity and publication readiness are separate fields.
8. Cross-chapter authority/collision audits become required before production freeze.

Status: `AVG-001 English runtime proof in progress`.
