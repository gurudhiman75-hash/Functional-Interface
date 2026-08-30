# PRT-001 implementation freeze record

**Runtime status:** complete  
**Public publication status:** gated pending product/editorial approval

## Frozen implementation contract

- Package: `PRT-001`
- Canonical problems: 7
- Active solve modes: 28
- Active question languages: 32 per locale
- Locales: English, Hindi, Punjabi
- Arithmetic: exact rational operations
- Verification: independent boundary-sweep parity required
- Output: deterministic Question Studio-compatible MCQ package

## Automated gates

Run `pnpm --dir artifacts/api-server run test:prt-001` for foundation, solver, serialization, localization, and seeded corpus checks. Run `pnpm --dir artifacts/api-server run audit:prt-001` for coverage, context realism, locale parity, option distribution, and Question Studio routing.

Any change to CP ownership, a solve-mode contract, template placeholders, allocation ordering, or the output schema requires both commands to pass before this record is updated.
