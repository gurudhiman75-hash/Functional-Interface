# Economy Multilingual V1 — CP001–CP023

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
- ECO-CP-011 Financial Institutions
- ECO-CP-012 Public Finance & Fiscal Policy
- ECO-CP-013 Government Budget
- ECO-CP-014 Taxation
- ECO-CP-015 Economic Planning in India
- ECO-CP-016 Economic Reforms of 1991
- ECO-CP-017 Agriculture & Indian Economy
- ECO-CP-018 Industry & Industrial Development
- ECO-CP-019 Financial Markets
- ECO-CP-020 External Sector & Balance of Payments
- ECO-CP-021 International Economic Institutions
- ECO-CP-022 Human Development & Development Economics
- ECO-CP-023 Important Economic Events & Milestones

Lifecycle: REVIEW_ONLY. All 23 multilingual localization checkpoints are wired into the `ECO-001` Question Studio review-only runtime for EN/HI/PA. They do not enable Question Bank persistence, test/mock eligibility, public publication, production release, or automatic learner release.

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
- CP011: 44 questions per locale
- CP012: 44 questions per locale
- CP013: 44 questions per locale
- CP014: 44 questions per locale
- CP015: 44 questions per locale
- CP016: 44 questions per locale
- CP017: 44 questions per locale
- CP018: 44 questions per locale
- CP019: 44 questions per locale
- CP020: 44 questions per locale
- CP021: 44 questions per locale
- CP022: 44 questions per locale
- CP023: 44 questions per locale
- CP001–CP023 cumulative: 1,008 questions per locale / 3,024 EN-HI-PA surfaces
- Final CP021–CP023 checkpoint: 132 questions per locale / 396 EN-HI-PA surfaces
- CP009 and CP010 use V2 stem-polish authorities derived from frozen V1 batches
- CP011 uses V2 and CP012 uses V3 stem-polish authority
- CP013 and CP014 use V2 stem-polish authorities
- CP015 uses V3 and CP016 uses V2 stem-polish authority
- CP017 and CP018 use V2 stem-polish authorities
- CP019 and CP020 use V2 stem-polish authorities
- CP021 uses V3; CP022 and CP023 use V2 stem-polish authorities; stem-only revisions preserve options, answers, explanations, QL, difficulty and source provenance

Quality gates:
- exact frozen-English no-drift
- four unique options per item
- correct answer remains at the frozen English index
- source, QL and difficulty parity
- native Devanagari/Gurmukhi presence
- shared terminology registry with `NATIVE`, `PROTECTED_ENGLISH` and `ABBREVIATION` classifications
- `NATIVE` terms must not remain as English labels in Hindi/Punjabi learner text
- `PROTECTED_ENGLISH` terms retain their familiar exam label exactly when translation would be awkward or non-standard
- `ABBREVIATION` entries retain standard forms such as GDP, CPI, WPI, GVA, LFPR, MGNREGA, RBI, FEMA, PSS, SEBI, NABARD, MPC, SDF, MSF, CRR, OMO, RRB, PACS, NPA, PSL, MSME, DICGC, DFI, IFCI, SIDBI, NHB, NaBFID, NBFC, HFC, FRBM, GST, CGST, SGST, IGST, UTGST, CBDT, CAG, LERMS, FERA, NDC and LPG
- all other Latin-script text is treated as leakage and fails the executable audit
- current protected labels include Disinflation, Demand-pull inflation, Cost-push inflation, Headline inflation, Core inflation, GDP deflator, Core CPI, Hyperinflation, Headcount ratio, Fiat money, Legal tender, Reserve money, High-powered money, Narrow money, Broad money, Money multiplier, Lender of last resort, Repo, Reverse Repo, Bank Rate, Open Market Operations, Standing Deposit Facility, Marginal Standing Facility, LAF corridor, Small Finance Bank, Payments Bank, Priority Sector Lending, Commercial Paper, and official committee/group names
- full CP001–CP023 terminology/parity audit runs in Economy CI across 1,008 questions per locale / 3,024 surfaces
- CP009–CP023 stems pass a mechanical-phrasing guard covering generated fillers such as `other things equal`, `mainly`, `generally`, `primarily`, `normally`, `best fits`, `most directly`, `main role`, `best represents`, `best distinguishes` and native-language equivalents

Review exports:
- `ECO-MULTILINGUAL-V1-CP001-CP002-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP003-CP004-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP005-CP006-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP007-CP008-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP009-CP010-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP011-CP012-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP013-CP014-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP015-CP016-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP017-CP018-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP019-CP020-REVIEW.md`
- `ECO-MULTILINGUAL-V1-CP021-CP023-REVIEW.md`

They are generated under `dist/economy-review/ECO-MULTILINGUAL-V1/` by `eco-localization-export-v1.ts`.

## Question Studio closure

- package: `ECO-001`
- chapter implementation: `CLOSED`
- languages: EN / HI / PA
- runtime: `REGISTERED_REVIEW_ONLY`
- questions per language: 1,008
- total multilingual surfaces: 3,024
- seeded selection is deterministic and preserves the same semantic question draw across languages
- Question Bank, test/mock, public publication and production-release gates remain disabled
