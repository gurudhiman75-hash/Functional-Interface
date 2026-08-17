# TMW-CP-004 Editorial Review

**Review stage:** pre-user runtime-proof review  
**Sample:** 24 QLs × 3 seeds = 72 generated candidate questions

## Corrections made before repository upload

1. Corrected singular day wording such as `1 days` to `1 day`.
2. Corrected singular worker options such as `1 workers` to `1 worker`.
3. Replaced unrealistic rate distractors such as `12 of the work per day` with plausible fractions derived from visible rates, deadlines or phase durations.
4. Kept the 12-context pool used by the preceding reviewed checkpoint and prohibited the repeated word `assignment` in rendered stems.
5. Kept formulas and every worked mathematical line inside literal inline MathJax delimiters.
6. Used event-specific conclusions for joins, leaves, replacements, deadlines, added workers, removed workers, delays and time saved.
7. Kept workforce-event questions in CP-004 only when partial progress precedes the workforce change.

## Local validation

- 24 QLs × 50 proof seeds = 1,200 deterministic cases;
- 24 QLs × 12 audit seeds = 288 cases;
- all four correct-answer positions represented;
- 285 distinct rendered stems;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed MathJax groups: 0;
- unwrapped-math hits: 0;
- option-contract failures: 0;
- control-character hits: 0;
- assignment-word hits: 0;
- exact and normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicates: 0.

## Current verdict

The English runtime is ready for exact-head GitHub Actions and generation of the 72-row user review pack. It is not approved for Question Bank storage, test assembly or student delivery.
