# COA-001 / COA-CP-009 — Status

Status: **APPROVED / FULL HINDI-PUNJABI CORPUS FROZEN**

## Frozen baseline

- CP001–CP008 English: **APPROVED / FROZEN**
- English taxonomy: **FINAL-FROZEN**
- CP009 language calibration: **APPROVED / FROZEN** on 2026-09-18

The approved calibration wording is reused exactly in the full localization registry; it is not silently retranslated.

## Full localization scope

The full frozen Course-of-Action authority is now localized into Hindi and Punjabi:

- 120 ordinary semantic authorities × 2 locales = **240 localized surfaces**
- 4 genuine `Either I or II` authorities × 2 locales = **8 localized surfaces**
- 6 three-action combination authorities × 2 locales = **12 localized surfaces**
- total semantic authorities = **130**
- total localized learner surfaces = **260**

All 120 ordinary authorities are covered, including the two legacy QL007 calibration states for backward compatibility. QL007 remains retired from future semantic expansion and is explicitly marked legacy at runtime.

## Semantic parity guarantees

Human approval on **2026-09-18** freezes the cleaned Hindi/Punjabi corpus. The full-corpus proof requires Hindi and Punjabi to preserve the frozen English:

- semantic authority ID;
- QL ID;
- difficulty;
- domain;
- action identity and order;
- four-way answer class and correct option index;
- five-code exclusive-Either relation and correct option index;
- three-action truth mask and authored option ordering.

The proof also checks:

- deterministic localized generation;
- native-script presence;
- Devanagari/Gurmukhi cross-script leakage;
- core English learner-wording leakage;
- exact reuse of the approved CP009 calibration text;
- no expansion of retired QL007 semantics;
- downstream lifecycle gates remain closed.

## Implemented files

- `cp009-localization-types.ts`
- `cp009-localized-cp001.ts`
- `cp009-localized-cp002.ts`
- `cp009-localized-cp003.ts`
- `cp009-localized-cp004.ts`
- `cp009-localized-cp006.ts`
- `cp009-localized-cp007.ts`
- `cp009-localized-profiles.ts`
- `cp009-full-localization-registry.ts`
- `cp009-full-localization-generator.ts`
- `cp009-full-localization-proof.test.ts`
- `COA-CP-009-FULL-LOCALIZATION-REVIEW.md`

The CP009 workflow runs both the approved calibration proof and the whole-corpus proof.

## Human review gate

Full-corpus localization is **APPROVED / FROZEN** after the stem editorial cleanup pass.

Human review should focus on:

- natural Hindi/Punjabi rather than literal translation;
- simple beginner-friendly explanations;
- awkward or overly formal native wording;
- unnecessary transliterated technical terms;
- repeated phrasing across domains;
- whether hard questions remain hard because of reasoning, not language.

## Lifecycle

- CP009 calibration: **APPROVED / FROZEN**
- CP009 exhaustive HI/PA rollout: **APPROVED / FROZEN**
- Question Studio: **CLOSED**
- Question Bank writes: **CLOSED**
- test/mock eligibility: **CLOSED**
- public/student delivery: **CLOSED**

Human editorial approval is complete. Downstream integration remains a separate gate and is still closed until CP010 is deliberately implemented.
