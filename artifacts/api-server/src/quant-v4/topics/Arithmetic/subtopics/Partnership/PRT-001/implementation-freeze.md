# PRT-001 implementation freeze record

**Runtime foundation status:** complete  
**Seven-CP routing status:** complete  
**Current expanded runtime:** 99 solve modes / 103 active QLs per locale  
**Exhaustiveness expansion:** E1 + E2 + E3 + E4 + E5 IMPLEMENTED AND AUTOMATED-RUNTIME VALIDATED  
**Solve-contract reconciliation:** CLOSED for the accepted Partnership-facing 102-candidate ledger; 3 pure-ratio candidates remain delegated  
**Chapter exhaustiveness status:** REOPENED  
**English editorial/source freeze:** NOT FROZEN  
**Hindi/Punjabi editorial freeze:** NOT FROZEN  
**Public publication status:** BLOCKED pending source, diversity, ownership, duplicate, and editorial approval

## Runtime-proof contract currently implemented

- Package: `PRT-001`
- Canonical problems: 7
- Active solve modes: 99
- Active question languages: 103 per locale
- CP distribution: 13 / 14 / 16 / 18 / 14 / 16 / 12
- Locales: English, Hindi, Punjabi
- Arithmetic: exact rational operations
- Verification: independent parity required for active task contracts
- Output: deterministic Question Studio-compatible MCQ package
- E1/E2/E3 diversity gates: at least 3 effective-weight signatures and 2 normalized-ratio signatures per expansion QL across the audit corpus
- E4/E5 diversity gates: at least 3 effective-weight signatures and 2 answer signatures per QL; ratio diversity is also required except where an equal-profit semantic condition necessarily fixes the normalized ratio at 1:1
- E2 allocation-money normalization: salary/commission/deduction questions normalize gross pools to clean exam-style answer surfaces while preserving topology
- E3 percentage answers: percentage-change and commission-inverse authorities use the first-class `PERCENT` answer type
- E4 production refinement: degenerate zero-difference weighted-share scenarios are rejected/refined rather than padded with artificial distractors
- E5 reconciliation closure: the final 19 accepted MERGE/EXPOSE contracts are active; the three pure-ratio design candidates stay delegated to Ratio & Proportion

The capital-timeline, ordered-allocation, solver, independent-verifier, reasoning, distractor, localization, and Question Studio foundations remain reusable. E1-E4 established and expanded the inverse, multi-event, relational, remuneration, mixed-system, joining/leaving, and piecewise-capital authorities. E5 adds the final 19 accepted Partnership-facing contracts across CP-001..006, including inverse known-share variants, equal-profit event timing, staggered share differences, capital-withdrawal/addition variants, multi-partner equal-share and time-multiple systems, and explicit salary/allowance/commission/reserve/expense distributions.

The E5 runtime was validated through the package-scoped TypeScript gate, a dedicated E5 parity diagnostic, `test:prt-001`, and `audit:prt-001`. The seeded corpus generated **3,090** deterministic EN/HI/PA questions across all **103 QLs / 99 solve modes**. The full audit passed:

- coverage: 103 active QLs with CP distribution 13 / 14 / 16 / 18 / 14 / 16 / 12;
- context realism: 824 cases / 103 context families;
- E1 math diversity: 240 cases;
- E2 math diversity: 336 cases;
- E3 math diversity: 336 cases;
- E4 math diversity: 336 cases;
- E5 math diversity: 456 cases;
- multilingual parity: 1,236 cases;
- option quality: 1,648 cases with answer positions 427 / 427 / 381 / 413;
- Question Studio integration: 42 cases across all 7 CPs and all 3 languages.

The E5 diagnostic exposed one invalid equal-profit capital-change scenario in `PRT-QL-093`; its generated weights did not satisfy the stated equal-profit condition. The scenario was replaced with an exact equal-weight tuple and the complete diagnostic/corpus/audit suite then passed. No validation threshold was weakened.

This record does **not** treat the 99-mode / 103-QL runtime as final chapter freeze. The solve-contract reconciliation is closed, but production exhaustiveness still requires generator/object-pool depth, structural duplicate/stem-similarity review, source/PYQ saturation, legacy RAP-003 ownership reconciliation, and human editorial review.

## Automated runtime gates

Run `pnpm --dir artifacts/api-server run test:prt-001` for foundation, solver, serialization, localization, independent-answer parity, and seeded corpus checks. Run `pnpm --dir artifacts/api-server run audit:prt-001` for coverage, context realism, E1-E5 mathematical diversity, locale parity, option distribution, and Question Studio routing.

These commands validate the **currently implemented runtime surface**. They do not by themselves prove complete PYQ/source saturation, production-level same-QL stem diversity, legacy-QL de-duplication, or human editorial quality.

## Re-freeze requirements

Before restoring chapter-level freeze status:

1. deepen legacy/base and thin E1-E5 scenario generators/object pools to production-level same-QL diversity;
2. add structural stem-skeleton similarity/duplicate gates in addition to mathematical-state diversity;
3. run English source/PYQ saturation, exam-realness, and human editorial review;
4. complete Hindi/Punjabi editorial parity review against the frozen English surface;
5. reconcile and de-duplicate legacy RAP-003 Partnership exposure, including ownership cleanup;
6. rerun full Question Studio, option, duplicate, localization, verification, and release gates.

Any change to CP ownership, a solve-mode contract, template placeholders, allocation ordering, or the output schema requires the applicable runtime tests and audits to pass before this record is updated again.
