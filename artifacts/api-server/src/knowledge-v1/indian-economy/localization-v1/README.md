# Economy Multilingual V1 — CP001–CP004

Implemented multilingual scope:
- ECO-CP-001 Basic Economic Concepts
- ECO-CP-002 Economic Systems & Sectors
- ECO-CP-003 National Income Aggregates
- ECO-CP-004 National Income Measurement in India

Lifecycle: REVIEW_ONLY. These localization checkpoints do not enable Question Bank persistence, test/mock eligibility, public publication, production release, or automatic learner release.

Semantic authority: frozen English V2 review batches already merged on New-main. Hindi and Punjabi are native learner-facing surfaces that preserve CP, QL, difficulty, source provenance, option order and correct-index parity.

Checkpoint sizes:
- CP001: 42 questions per locale
- CP002: 42 questions per locale
- CP003: 44 questions per locale
- CP004: 44 questions per locale
- CP001–CP004 cumulative: 172 questions per locale / 516 EN-HI-PA surfaces
- Current CP003–CP004 checkpoint: 88 questions per locale / 264 EN-HI-PA surfaces

Quality gates:
- exact frozen-English no-drift
- four unique options per item
- correct answer remains at the frozen English index
- source, QL and difficulty parity
- native Devanagari/Gurmukhi presence
- Latin-script leakage guard for learner-facing text
- standard economics/statistics abbreviations such as GDP, GNP, NDP, NNP, NFIA, GVA and MoSPI remain unchanged where appropriate

Review exports:
- `ECO-MULTILINGUAL-V1-CP001-CP002-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP003-CP004-REVIEW.md`

Both are generated under `dist/economy-review/ECO-MULTILINGUAL-V1/` by `eco-localization-export-v1.ts`.
