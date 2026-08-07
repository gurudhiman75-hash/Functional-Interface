# MAL-CP-004 Wave 06 — Permanent English Release

## Release decision

The ten source-backed, equivalence-closed and editorially reviewed `MAL-CP-004` contracts are approved for permanent English allocation.

```text
release ID:                   MAL-CP004-EN-v1
runtime ID:                   MAL-CP004-EN-PERMANENT-RUNTIME-V1
English status:               FROZEN
permanent QL range:           MAL-QL-038..MAL-QL-047
Question Studio:              enabled
Question Bank:                writable
test eligible:                true
publicly publishable:         true
Hindi:                        unreleased
Punjabi:                      unreleased
```

## Permanent QL allocation

| QL | Permanent learner contract |
|---|---|
| `MAL-QL-038` | Component quantity from total quantity and concentration |
| `MAL-QL-039` | Concentration from component and total quantities |
| `MAL-QL-040` | Total quantity from a component and its concentration |
| `MAL-QL-041` | Solvent addition to reach a lower target concentration |
| `MAL-QL-042` | Pure-solute addition to reach a higher target concentration |
| `MAL-QL-043` | Evaporation result required for a target concentration |
| `MAL-QL-044` | Final concentration after a known solvent addition or evaporation |
| `MAL-QL-045` | Initial total quantity from a stated evaporation |
| `MAL-QL-046` | Final mass or moisture lost after drying |
| `MAL-QL-047` | Initial mass from final dried mass and moisture percentages |

## Representation policy

The following remain representation variants under their assigned QL rather than separate identities:

- tracked versus complementary component amount under `MAL-QL-038`;
- total reconstruction from either named component under `MAL-QL-040`;
- evaporated amount versus final total under `MAL-QL-043`;
- known solvent addition versus known solvent evaporation under `MAL-QL-044`;
- final mass versus moisture lost under `MAL-QL-046`.

A new context, material name or requested equivalent output does not create a new QL unless the learner must use a materially different reasoning contract.

## Release evidence

Wave 06 audits:

```text
10 permanent QLs × 200 seeds = 2,000 released questions
2,000 deterministic repeat checks
2,000 inherited source mathematical validations
2,000 inherited English editorial validations
6,000 displayed distractor analyses
40 permanent human-review rows
100 explicit Question Studio routes
100 automatic Question Studio selections
15 representation variants
```

Every released package preserves:

1. a governing concept and MathJax formula;
2. number-specific worked steps;
3. a state-specific exam shortcut;
4. all three displayed distractor analyses;
5. source and contract traceability;
6. a deterministic reasoning graph;
7. exact QL and question-language identity;
8. delivery lifecycle metadata.

## Ownership boundaries

- weighted blending and alligation remain `MAL-CP-001`;
- repeated equal replacement remains `MAL-CP-003`;
- cross-vessel transfer remains `MAL-CP-006`.

The Wave 04 discovery and Wave 05 editorial runtimes remain locked and non-public. Only the Wave 06 permanent runtime is eligible for Question Studio, Question Bank, tests and public delivery.

## Localisation boundary

This release is English-only. Hindi and Punjabi require separate localisation, state-parity, option-parity, diagram-label and human-review evidence before either language can be frozen or delivered.
