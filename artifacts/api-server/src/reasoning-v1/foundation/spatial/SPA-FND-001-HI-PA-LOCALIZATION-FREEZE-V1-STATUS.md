# SPA-FND-001 Hindi/Punjabi Localization Freeze V1

Status: **HUMAN_EDITORIAL_APPROVED / FROZEN**

Approval date: 2026-08-16
Package: `SPA-001`
Permanent QLs: `SPA-QL-001..030`
Languages: `en`, `hi`, `pa`

## Product-owner approval

The simplified Hindi/Punjabi learner-facing wording was reviewed after the original localization was found too formal/difficult to grasp. The simplified student-first version is approved for production Question Studio use.

## Frozen language policy

- Use short, direct exam-prep wording.
- Prefer common student vocabulary over formal linguistic/geometry terminology.
- Keep Hindi and Punjabi easy to understand on first read.
- Preserve question-specific explanations tied to the actual generated mode.
- Keep the plain-language jargon gate active so formal wording cannot silently return.

## Immutable parity contract

Localization must not change:

- stimulus SVGs;
- option SVGs or option order;
- correct option/index;
- canonical item ID;
- content fingerprint;
- generator mode or validation metadata.

Only learner-facing localized fields may differ by language.

## Lifecycle

The normal Question Studio lifecycle remains authoritative:

`Generator -> Question Studio -> review/revise -> approve -> Question Bank -> standard test/mock/publication controls`

Manual approval remains required. Automatic student publication remains disabled.

## Intentional holds

The following are still excluded and are not blockers to this freeze:

- `WAT-HOLD-P01` — analog clock water-image diagram
- `FCL-HOLD-P01` — letter/symbol identity-set replacement

## Final gate

After exact-head CI passes, merge PR #831 into `New-main`. No further Hindi/Punjabi editorial checkpoint is required for the current 30-QL Spatial scope unless a later regression or student-visible defect is found.
