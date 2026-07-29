# PNC-002 Hindi and Punjabi Localisation Roadmap

## Objective

Create natural, exam-appropriate Hindi and Punjabi learner presentations for all 163 English QLs in PNC-002 without changing the mathematical package.

## Non-negotiable invariants

- Numeric options, correct index, answer and solver evidence remain authoritative and unchanged.
- MathJax expressions remain language-neutral and byte-equivalent wherever the presentation stage reuses them.
- Every localisation is parameter-safe across generated seeds.
- Hindi and Punjabi text must be authored naturally; word-for-word translation is not accepted.
- Punjabi uses everyday competitive-exam wording and avoids unnecessarily technical Sanskritised vocabulary.
- Every checkpoint remains `editorialStatus: PENDING` until manual review is explicitly approved.
- Editorial approval does not make a checkpoint publicly publishable; registration and publication remain separate gates.

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

## Approved checkpoints

### `PNC-CP-007`

- Release: `PNC-002-CP007-HI-PA-v1-CANDIDATE`
- QLs: `PNC-QL-107` through `PNC-QL-124`
- Locales: `hi-IN`, `pa-IN`
- Seeded audit packages: 108
- Merge commit: `0f113c093ee699de2acadfe8684c004f9b03065e`
- Publicly publishable: `false`

### `PNC-CP-008`

- Approved release: `PNC-002-CP008-HI-PA-v1-APPROVED`
- QLs: `PNC-QL-125` through `PNC-QL-147`
- Locales: `hi-IN`, `pa-IN`
- Localised review rows: 46
- Seeded review packages: 138
- Editorial status: `APPROVED`
- Approval date: `2026-07-28`
- Punjabi numbered-position terminology: `ਟਾਂਕ` (odd), `ਜਿਸਤ` (even)
- Publicly publishable: `false`
- Merge checkpoint: PR `#304`

### `PNC-CP-009`

- Approved release: `PNC-002-CP009-HI-PA-v1-APPROVED`
- QLs: `PNC-QL-148` through `PNC-QL-176`
- English source QLs: 29
- Locales: `hi-IN`, `pa-IN`
- Localised review rows: 58
- Seeded approval packages: 174
- Covered solve modes: 21
- Editorial status: `APPROVED`
- Approval date: `2026-07-29`
- Hindi stems begin naturally with `एक`; Punjabi stems begin naturally with `ਇੱਕ`; opening syntax varies by question context.
- Literal Hindi `मामला/मामले` and Punjabi `ਮਾਮਲਾ/ਮਾਮਲੇ` wording is prohibited in learner-facing explanations; precise selection, count and condition language is used instead.
- Publicly publishable: `false`
- Merge checkpoint: PR `#309`

## Current checkpoint

`PNC-CP-010` is the next Hindi/Punjabi localisation checkpoint.

- QLs: `PNC-QL-177` through `PNC-QL-208`
- English source QLs: 32
- Locales: `hi-IN`, `pa-IN`
- Status: `NOT_STARTED`
- Editorial status: `PENDING`
- Publicly publishable: `false`
