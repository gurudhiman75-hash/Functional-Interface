# Economy Multilingual V1 — CP001–CP010

Implemented multilingual scope:
- ECO-CP-001 Basic Economic Concepts
- ECO-CP-002 Economic Systems & Sectors
- ECO-CP-003 National Income Aggregates
- ECO-CP-004 National Income Measurement in India
- ECO-CP-005 Inflation & Price Concepts
- ECO-CP-006 Employment, Unemployment & Poverty
- ECO-CP-007 Money & Monetary System
- ECO-CP-008 Reserve Bank of India
- ECO-CP-009 Monetary Policy
- ECO-CP-010 Banking System

Lifecycle: REVIEW_ONLY. These localization checkpoints do not enable Question Bank persistence, test/mock eligibility, public publication, production release, or automatic learner release.

Semantic authority: the frozen English review batches already merged on New-main. Hindi and Punjabi are native learner-facing surfaces that preserve CP, QL, difficulty, source provenance, option order and correct-index parity.

Checkpoint sizes:
- CP001: 42 questions per locale
- CP002: 42 questions per locale
- CP003: 44 questions per locale
- CP004: 44 questions per locale
- CP005: 44 questions per locale
- CP006: 44 questions per locale
- CP007: 44 questions per locale
- CP008: 44 questions per locale
- CP009: 44 questions per locale
- CP010: 44 questions per locale
- CP001–CP010 cumulative: 436 questions per locale / 1,308 EN-HI-PA surfaces
- Current CP009–CP010 checkpoint: 88 questions per locale / 264 EN-HI-PA surfaces

Quality gates:
- exact frozen-English no-drift
- four unique options per item
- correct answer remains at the frozen English index
- source, QL and difficulty parity
- native Devanagari/Gurmukhi presence
- shared terminology registry with `NATIVE`, `PROTECTED_ENGLISH` and `ABBREVIATION` classifications
- `NATIVE` terms must not remain as English labels in Hindi/Punjabi learner text
- `PROTECTED_ENGLISH` terms retain their familiar exam label exactly when translation would be awkward or non-standard
- `ABBREVIATION` entries retain standard forms such as GDP, CPI, WPI, GVA, LFPR, MGNREGA, RBI, FEMA, PSS, SEBI, NABARD, MPC, SDF, MSF, CRR, OMO, RRB, PACS, NPA, PSL, MSME and DICGC
- all other Latin-script text is treated as leakage and fails the executable audit
- current protected labels include Disinflation, Demand-pull inflation, Cost-push inflation, Headline inflation, Core inflation, GDP deflator, Core CPI, Hyperinflation, Headcount ratio, Fiat money, Legal tender, Reserve money, High-powered money, Narrow money, Broad money, Money multiplier, Lender of last resort, Repo, Reverse Repo, Bank Rate, Open Market Operations, Standing Deposit Facility, Marginal Standing Facility, LAF corridor, Small Finance Bank, Payments Bank, Priority Sector Lending, Commercial Paper, and official committee/group names
- full CP001–CP010 terminology/parity audit runs in Economy CI across 436 questions per locale / 1,308 surfaces

Review exports:
- `ECO-MULTILINGUAL-V1-CP001-CP002-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP003-CP004-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP005-CP006-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP007-CP008-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP009-CP010-REVIEW.md`

They are generated under `dist/economy-review/ECO-MULTILINGUAL-V1/` by `eco-localization-export-v1.ts`.
