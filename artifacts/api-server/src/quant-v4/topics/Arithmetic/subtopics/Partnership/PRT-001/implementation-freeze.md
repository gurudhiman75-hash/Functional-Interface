# PRT-001 implementation freeze record

**Runtime foundation status:** complete  
**Seven-CP routing status:** complete  
**Current expanded runtime:** 66 solve modes / 70 active QLs per locale  
**Exhaustiveness expansion:** E1 + E2 + E3 IMPLEMENTED  
**Chapter exhaustiveness status:** REOPENED  
**English editorial/source freeze:** NOT FROZEN  
**Hindi/Punjabi editorial freeze:** NOT FROZEN  
**Public publication status:** BLOCKED pending remaining exhaustiveness, source, diversity, and editorial approval

## Runtime-proof contract currently implemented

- Package: `PRT-001`
- Canonical problems: 7
- Active solve modes: 66
- Active question languages: 70 per locale
- Locales: English, Hindi, Punjabi
- Arithmetic: exact rational operations
- Verification: independent boundary-sweep parity required
- Output: deterministic Question Studio-compatible MCQ package
- E1 diversity gate: each E1 QL must produce at least 3 weight signatures and 2 normalized-ratio signatures across the audit seed corpus
- E2 diversity gate: each E2 QL must produce at least 3 weight signatures and 2 normalized-ratio signatures across the audit seed corpus
- E3 diversity gate: each E3 QL must produce at least 3 weight signatures and 2 normalized-ratio signatures across the audit seed corpus
- E2 allocation-money normalization: salary/commission/deduction questions normalize the gross pool to clean whole-rupee ratio parts while preserving the mathematical topology
- E3 percentage answers: percentage-change and commission-inverse authorities expose a first-class `PERCENT` answer type rather than overloading money or ratio output

The runtime foundation remains valid and reusable. E1 added the first 10 high-value authorities from the reconciliation audit. E2 added 14 further authorities spanning reverse totals, ratio inversions, multi-change capital timelines, richer multi-partner systems, reverse remuneration, and compound mixed-system reconstruction.

E3 adds 14 further authorities. It closes the nine still-missing `NEW AUTHORITY` dispositions from the 102-candidate reconciliation: weighted share-difference total profit, unknown percentage capital change, initial-capital reconstruction from a changed-capital history, duration-ratio recovery from partner-share relations, unknown commission percentage, unknown deduction, profit-ratio recovery from final receipts after salary, equal-final-receipt remuneration, and reverse contribution from mixed partner relations. It also exposes five high-value inverse contracts: same-period unknown capital, weighted reverse total from one known share, join time from a known partner share, withdrawn capital from a profit ratio, and multi-partner total profit from a share difference.

This record still does **not** treat the 66-mode / 70-QL surface as the exhaustive chapter freeze. Remaining accepted `MERGE/EXPOSE` dispositions from the 102-candidate reconciliation, legacy-generator diversity debt, RAP-003 ownership cleanup, source saturation, and human editorial review remain open.

## Automated runtime gates

Run `pnpm --dir artifacts/api-server run test:prt-001` for foundation, solver, serialization, localization, and seeded corpus checks. Run `pnpm --dir artifacts/api-server run audit:prt-001` for coverage, context checks, E1/E2/E3 mathematical diversity, locale parity, option distribution, and Question Studio routing.

These commands validate the **currently implemented runtime surface**. They do not by themselves prove final chapter exhaustiveness, complete PYQ/source saturation, legacy-QL de-duplication, or human editorial quality.

## Re-freeze requirements

Before restoring chapter-level freeze status:

1. complete the remaining accepted `MERGE/EXPOSE` dispositions from the 102-candidate audit;
2. deepen legacy CP-003..007 fixed scenario generators to production-level same-QL diversity, not only the E1/E2/E3 authorities;
3. add stem-skeleton similarity/duplicate gates in addition to mathematical-state diversity;
4. run English source/exam-realness and human editorial review;
5. localize only the frozen English expansion and complete Hindi/Punjabi editorial parity review;
6. reconcile and de-duplicate legacy RAP-003 Partnership exposure;
7. rerun the full Question Studio / options / duplicate / localization / verification gates.

Any change to CP ownership, a solve-mode contract, template placeholders, allocation ordering, or the output schema requires the applicable runtime tests and audits to pass before this record is updated again.
