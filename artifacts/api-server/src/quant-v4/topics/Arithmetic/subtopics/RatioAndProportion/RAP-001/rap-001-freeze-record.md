# RAP-001 Freeze Record

Reviewed commit: `8450deef2e06cc9e031b6d3221b7e54d226199b1`
Reviewed date: `2026-07-10`

## Current State

- Canonical problems: 6
- Active English QLs: 67
- Task kinds: 28
- QLs removed as exact or low-value structural duplicates: 102
- English residual sample: 1,000 questions
- Cross-QL exact duplicate stem groups: 0
- Same-QL repeated stem groups: 61; affected questions: 85
- Legacy package-test duplicate rate: 15.70%
- Entity, grammar, semantic, validation, option, answer-format, and explanation blocker counters: 0
- Human-review export: 30 rows, at least 5 per CP
- Human editorial decisions: PENDING

## Verdict

English runtime and automated QA are clean, but RAP-001 is **not freeze-ready**. Manual editorial review is pending, and the legacy duplicate-rate signal plus same-QL repeat rate requires an explicit editorial acceptance or a later parameter-diversity pass.

Hindi/Punjabi publication remains blocked pending separate human localization and editorial QA. The structural localization audit also reports eight placeholder-occurrence parity differences across four QLs; required placeholder sets and forced generation still pass.
