# PNC-002 Hindi and Punjabi Localisation Roadmap

## Objective

Create natural, exam-appropriate Hindi and Punjabi learner presentations for all 163 English QLs in PNC-002 without changing the mathematical package.

## Non-negotiable invariants

- Numeric options, correct index, answer and solver evidence remain authoritative and unchanged.
- MathJax expressions remain language-neutral and byte-equivalent wherever the presentation stage reuses them.
- Every localisation is parameter-safe across generated seeds.
- Hindi and Punjabi text must be authored naturally; word-for-word translation is not accepted.
- Punjabi uses everyday competitive-exam wording and avoids unnecessarily technical Sanskritised vocabulary.
- Every checkpoint remains `editorialStatus: PENDING` and `publiclyPublishable: false` until manual review.

## Localisation order

1. `PNC-CP-007` — block restrictions and together/apart conditions (18 QLs)
2. `PNC-CP-008` — positions, relative order, alternation and gaps (23 QLs)
3. `PNC-CP-009` — category-based selections and committees (29 QLs)
4. `PNC-CP-010` — circular arrangements and symmetry (32 QLs)
5. `PNC-CP-011` — grouping and distribution (33 QLs)
6. `PNC-CP-012` — mixed advanced counting systems (28 QLs)

## Checkpoint acceptance gate

Each checkpoint must prove:

- complete QL inventory for both `hi-IN` and `pa-IN`;
- preservation of all generated numeric tokens and formulas;
- exact option and answer parity with English;
- correct singular/plural learner-facing units;
- four localised explanation sections;
- numbered teacher-style steps;
- three localised option-specific trap warnings;
- no unresolved placeholders or English boilerplate leakage;
- no duplicate normalised stems;
- multiple-seed runtime validation;
- manual-review export in JSON and CSV.

## Current checkpoint

`PNC-CP-007` is implemented as `PNC-002-CP007-HI-PA-v1-CANDIDATE`.

- QLs: `PNC-QL-107` through `PNC-QL-124`
- Locales: `hi-IN`, `pa-IN`
- Seeded audit packages: 108
- Status: `MANUAL_REVIEW`
- Editorial status: `PENDING`
- Publicly publishable: `false`
