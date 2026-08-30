# PRT-001 implementation freeze record

**Runtime foundation status:** complete  
**Seven-CP routing status:** complete  
**Current expanded runtime:** 80 solve modes / 84 active QLs per locale  
**Exhaustiveness expansion:** E1 + E2 + E3 + E4 IMPLEMENTED AND AUTOMATED-RUNTIME VALIDATED  
**Chapter exhaustiveness status:** REOPENED  
**English editorial/source freeze:** NOT FROZEN  
**Hindi/Punjabi editorial freeze:** NOT FROZEN  
**Public publication status:** BLOCKED pending remaining exhaustiveness, source, diversity, ownership, and editorial approval

## Runtime-proof contract currently implemented

- Package: `PRT-001`
- Canonical problems: 7
- Active solve modes: 80
- Active question languages: 84 per locale
- CP distribution: 12 / 13 / 12 / 14 / 10 / 11 / 12
- Locales: English, Hindi, Punjabi
- Arithmetic: exact rational operations
- Verification: independent parity required for active task contracts
- Output: deterministic Question Studio-compatible MCQ package
- E1/E2/E3 diversity gates: at least 3 effective-weight signatures and 2 normalized-ratio signatures per expansion QL across the audit corpus
- E4 diversity gate: at least 3 effective-weight signatures and 2 answer signatures per E4 QL; ratio diversity is also required except for equal-profit inverse contracts whose semantic target necessarily fixes the ratio at 1:1
- E2 allocation-money normalization: salary/commission/deduction questions normalize gross pools to clean exam-style answer surfaces while preserving topology
- E3 percentage answers: percentage-change and commission-inverse authorities use the first-class `PERCENT` answer type
- E4 production refinement: degenerate zero-difference weighted-share scenarios are rejected/refined rather than padded with artificial distractors

The capital-timeline, ordered-allocation, solver, independent-verifier, reasoning, distractor, localization, and Question Studio foundations remain reusable. E1-E3 established and expanded the inverse, multi-event, relational, remuneration, and mixed-system authorities. E4 adds 14 further exam-facing contracts across CP-001..004, including known-share recovery, loss sharing, equal-profit inverse capital/time, early-leave and late-join variants, staggered reverse total profit, percentage/fraction capital decreases, and reverse change time from a known share.

The E4 runtime was validated with the package-scoped TypeScript gate, `test:prt-001`, and `audit:prt-001`. The seeded corpus generated **2,520** deterministic EN/HI/PA questions across all **84 QLs / 80 solve modes**. The full audit passed coverage, context realism, E1-E4 mathematical diversity, multilingual parity, option quality, and Question Studio routing.

This record still does **not** treat the 80-mode / 84-QL surface as the exhaustive chapter freeze. Remaining accepted `MERGE/EXPOSE` dispositions from the 102-candidate reconciliation, legacy-generator/object-pool diversity debt, source/PYQ saturation, RAP-003 ownership cleanup, duplicate/stem-similarity review, and human editorial review remain open.

## Automated runtime gates

Run `pnpm --dir artifacts/api-server run test:prt-001` for foundation, solver, serialization, localization, and seeded corpus checks. Run `pnpm --dir artifacts/api-server run audit:prt-001` for coverage, context realism, E1-E4 mathematical diversity, locale parity, option distribution, and Question Studio routing.

These commands validate the **currently implemented runtime surface**. They do not by themselves prove final chapter exhaustiveness, complete PYQ/source saturation, legacy-QL de-duplication, or human editorial quality.

## Re-freeze requirements

Before restoring chapter-level freeze status:

1. complete or explicitly disposition the remaining accepted `MERGE/EXPOSE` contracts from the 102-candidate reconciliation;
2. deepen legacy/base CP-003..007 and other thin generators/object pools to production-level same-QL diversity, not only E1-E4 authorities;
3. add structural stem-skeleton similarity/duplicate gates in addition to mathematical-state diversity;
4. run English source/PYQ saturation, exam-realness, and human editorial review;
5. complete Hindi/Punjabi editorial parity review against the frozen English surface;
6. reconcile and de-duplicate legacy RAP-003 Partnership exposure, including ownership cleanup;
7. rerun full Question Studio, option, duplicate, localization, verification, and release gates.

Any change to CP ownership, a solve-mode contract, template placeholders, allocation ordering, or the output schema requires the applicable runtime tests and audits to pass before this record is updated again.
