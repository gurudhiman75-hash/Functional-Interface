# PNL-001 Multilingual Question Studio Integration

Status: `IMPLEMENTED_AWAITING_APPROVAL`

Question Studio exposes one `PNL-001` package with two explicit runtime modes:

- `CANONICAL_REVIEW`: all 186 QLs in English, Hindi and Punjabi from approved editorial authority.
- `DYNAMIC_CANDIDATE`: all 186 QLs in English, Hindi and Punjabi from the completed standalone runtime.

Both modes cover all six frozen CPs. Canonical review remains approved editorial content; dynamic output remains unreviewed candidate content. Neither mode is stored in Question Bank, test-eligible or publicly publishable.

Canonical localization proof covers 558 review surfaces. Dynamic proof covers 13,392 packages across 24 seeds per QL and three languages. Shared routing proves all six CPs and all three languages in both modes.
