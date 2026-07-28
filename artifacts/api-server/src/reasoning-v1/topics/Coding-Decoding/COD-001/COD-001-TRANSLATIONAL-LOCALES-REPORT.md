# COD-001 — Translational Hindi and Punjabi Runtime

Status: **runtime-proof complete for `COD-QL-001..172` and `COD-QL-199`; language-adapted CP-008/009 remain open**.

## Permanent coverage

```text
Hindi:  COD-QL-001..172, COD-QL-199  (173 QLs)
Punjabi: COD-QL-001..172, COD-QL-199  (173 QLs)
```

These checkpoints are translational by design. Latin source words, letters, digits, symbols and answer codes remain logic-neutral, while instructions, condition descriptions and explanations are authored in Hindi and Punjabi.

## Runtime architecture

`multilingual-runtime.ts` dispatches the existing frozen English solver for the requested QL and seed. The locale layer changes only student-facing language and CP-010 condition descriptions. It preserves:

- permanent QL and checkpoint identity;
- hidden rule and parameters;
- structured source/code evidence;
- options and correct answer index;
- difficulty and renderer;
- ambiguity proof and hidden fingerprint;
- review-only release flags.

This avoids separate language solvers drifting from the English authority.

## Punjabi editorial policy

Punjabi uses direct, familiar instructions such as:

- `ਸ਼ਬਦ`, `ਅੱਖਰ`, `ਅੰਕ`, `ਕੋਡ`;
- `ਜੋੜਾ`, `ਨਿਸ਼ਾਨਾ`, `ਖਾਲੀ ਥਾਂ`;
- `ਸਹੀ ਜਵਾਬ`, `ਇੱਕੋ ਨਿਯਮ`;
- `ਅੱਗੇ`, `ਪਿੱਛੇ`, `ਖੱਬੇ`, `ਸੱਜੇ`.

Standalone technical wording such as `ਪਦ` and `ਸਾਦ੍ਰਿਸ਼ਤਾ` is rejected by the executable audit.

## Exact validation

The guarded audit generates:

```text
173 permanent QLs × 8 seeds × 2 locales = 2,768 questions
```

Verified answer positions in each locale:

```text
352 / 321 / 350 / 361
```

The audit enforces deterministic equality, English-solver parity, script presence, no English instructional fallback, natural-Punjabi policy, option/correct-index preservation, prompt parity and release safety.

## Remaining multilingual gap

The following 26 QLs cannot use this translational layer:

- `COD-QL-173..174` — renaming and semantic referent questions;
- `COD-QL-175..198` — sentence and artificial-language coding.

They require separately authored Hindi and Punjabi vocabulary, facts, sentences and grammar while preserving the same abstract puzzle topology and independent solver.

## Release boundary

Question Studio, Question Bank conversion, mock-test eligibility and public routing remain disabled.
