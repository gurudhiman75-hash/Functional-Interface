# PNC-002 Hindi and Punjabi Localisation Authority

## Objective

Provide natural, exam-appropriate Hindi and Punjabi learner presentations for all 163 English QLs in PNC-002 without changing the mathematical package.

## Non-negotiable invariants

- Numeric options, correct index, answer and solver evidence remain authoritative and unchanged.
- MathJax expressions remain language-neutral and are preserved by the localisation layer.
- Every localisation is parameter-safe across generated seeds.
- Hindi and Punjabi text is authored naturally rather than translated word for word.
- Punjabi uses everyday competitive-exam wording and avoids unnecessarily technical Sanskritised vocabulary.
- Editorial approval does not make a checkpoint publicly publishable; registration and publication remain separate gates.

## Completed checkpoint inventory

| Checkpoint | QL range | QLs | Approved release |
|---|---:|---:|---|
| `PNC-CP-007` | `PNC-QL-107..124` | 18 | `PNC-002-CP007-HI-PA-v1-APPROVED` |
| `PNC-CP-008` | `PNC-QL-125..147` | 23 | `PNC-002-CP008-HI-PA-v1-APPROVED` |
| `PNC-CP-009` | `PNC-QL-148..176` | 29 | `PNC-002-CP009-HI-PA-v1-APPROVED` |
| `PNC-CP-010` | `PNC-QL-177..208` | 32 | `PNC-002-CP010-HI-PA-v1-APPROVED` |
| `PNC-CP-011` | `PNC-QL-209..241` | 33 | `PNC-002-CP011-HI-PA-v1-APPROVED` |
| `PNC-CP-012` | `PNC-QL-242..269` | 28 | `PNC-002-CP012-HI-PA-v1-APPROVED` |
| **PNC-002 total** | `PNC-QL-107..269` | **163** | `PNC-002-HI-PA-v1-APPROVED-COMPLETE` |

## Chapter-wide approved authority

- Languages: `hi-IN`, `pa-IN`;
- canonical problems: `PNC-CP-007` through `PNC-CP-012`;
- QLs: `PNC-QL-107` through `PNC-QL-269`;
- approved Hindi presentations: 163;
- approved Punjabi presentations: 163;
- total approved locale surfaces: 326;
- editorial status: `APPROVED`;
- public publication: `false`;
- Question Studio registration: not added;
- Question Bank storage: not added;
- mock-test eligibility: not added;
- approval date: `2026-07-29`.

## Acceptance proof

The permanent chapter-wide proof audits every QL in both locales across two deterministic seeds:

```text
163 QLs × 2 locales × 2 seeds = 652 approved packages
```

The proof requires:

- complete and contiguous QL ownership;
- valid English source runtime for every generated state;
- exact four-option and answer-index parity;
- preservation of every learner-visible numeric token;
- preservation of learner-visible MathJax expressions;
- four localised explanation sections;
- numbered teacher-style steps;
- three option-specific localised trap warnings;
- no unresolved localisation placeholders;
- no English learner-text boilerplate;
- Hindi/Punjabi script separation;
- no hidden control characters;
- `editorialStatus: APPROVED`;
- `publiclyPublishable: false`.

## Editorial coverage

### CP-007 — block restrictions

Natural together/apart, block, outsider, file, book and inverse wording is approved. The previously reviewed and polished learner text remains the content authority; approval changes lifecycle state only.

### CP-008 — positions and gaps

Fixed positions, ends, relative order, alternation and numbered-position language remain approved. Punjabi odd/even position terminology remains `ਟਾਂਕ` and `ਜਿਸਤ` in the approved CP-008 authority.

### CP-009 — category selections

Natural category, quota, minimum/maximum, named-person and inverse selection language remains approved. Literal case/matter wording is prohibited in learner-facing explanations.

### CP-010 — circular arrangements and symmetry

Approved coverage includes ordinary round-table arrangements, blocks and exclusions, clockwise order, exact/minimum/maximum gaps, alternation, inverse circular counts, rotation-only displays, reversible rings, necklaces and neighbour-set equivalence.

### CP-011 — grouping and distribution

Approved coverage includes named and unnamed groups, repeated group sizes, specified-pair restrictions, distinct-object assignment, identical-object distribution, non-empty conditions, minimums, capacities, identical receivers and bounded inverse recovery.

### CP-012 — mixed advanced systems

Approved coverage includes selection followed by office assignment, selection followed by linear/circular/dihedral arrangement, fixed points and derangements, grid paths, non-uniform capacities, mixed-colour distributions and team formation followed by captain selection.

## Completion verdict

`PNC_002_HINDI_PUNJABI_LOCALISATION_COMPLETE_APPROVED_INACTIVE`

No further PNC-002 content localisation checkpoint remains. Product registration and publication are separate controlled decisions.
