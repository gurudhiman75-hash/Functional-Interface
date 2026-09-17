# Economy Multilingual V1 — CP001–CP006

Implemented multilingual scope:
- ECO-CP-001 Basic Economic Concepts
- ECO-CP-002 Economic Systems & Sectors
- ECO-CP-003 National Income Aggregates
- ECO-CP-004 National Income Measurement in India
- ECO-CP-005 Inflation & Price Concepts
- ECO-CP-006 Employment, Unemployment & Poverty

Lifecycle: REVIEW_ONLY. These localization checkpoints do not enable Question Bank persistence, test/mock eligibility, public publication, production release, or automatic learner release.

Semantic authority: the frozen English review batches already merged on New-main. Hindi and Punjabi are native learner-facing surfaces that preserve CP, QL, difficulty, source provenance, option order and correct-index parity.

Checkpoint sizes:
- CP001: 42 questions per locale
- CP002: 42 questions per locale
- CP003: 44 questions per locale
- CP004: 44 questions per locale
- CP005: 44 questions per locale
- CP006: 44 questions per locale
- CP001–CP006 cumulative: 260 questions per locale / 780 EN-HI-PA surfaces
- Current CP005–CP006 checkpoint: 88 questions per locale / 264 EN-HI-PA surfaces

Quality gates:
- exact frozen-English no-drift
- four unique options per item
- correct answer remains at the frozen English index
- source, QL and difficulty parity
- native Devanagari/Gurmukhi presence
- executable Latin-script leakage guard for learner-facing text
- only standard abbreviations such as GDP, GNP, NDP, NNP, NFIA, GVA, MoSPI, CPI, WPI, LFPR, WPR, UR, MGNREGA and NCERT remain in Latin script where appropriate
- dedicated CP005–CP006 localization audit runs in Economy CI

Review exports:
- `ECO-MULTILINGUAL-V1-CP001-CP002-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP003-CP004-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP005-CP006-REVIEW.md`

They are generated under `dist/economy-review/ECO-MULTILINGUAL-V1/` by `eco-localization-export-v1.ts`.
