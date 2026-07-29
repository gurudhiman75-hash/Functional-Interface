# CLS-CP-002 — Source Saturation and Merge/Split Audit

Status: `ENGLISH_SOURCE_AND_RUNTIME_BOUNDARY_CLOSED__MULTILINGUAL_PENDING`

This audit records the English source boundary for semantic relationship-pair classification. It does not yet allocate a permanent QL because Hindi and Punjabi parity, final editorial review and product-owner approval remain pending.

## 1. Final conservative English registry

```text
Stable directional semantic relations: 19
Lexical relations:                     12
Semantic class-pair relations:         24
Total admitted relations:              55
Curated fact pairs:                    372
Temporary prototypes:                   5
Option counts:                           4 and 5
```

Excluded from the foundational registry:

- country/capital;
- state/capital;
- country/currency;
- generic spouse-role pairing;
- unstable public-office facts;
- obscure one-off trivia;
- free-form relation invention.

`Husband : Wife` remains admissible as an odd contrast in the source-backed family-generation fixture, but a generic spouse-role relation is not registered because combinations such as `Groom : Wife` are linguistically arguable.

## 2. Source saturation additions

The initial Analogy libraries were supplemented with recurring Classification forms that were missing as explicit relations:

- container and usual content;
- raw material and resulting product;
- object/source and characteristic sound;
- explicit family roles separated by one generation.

These are governed curated facts, not runtime LLM generation.

## 3. Executable proof

The discovery gate validates:

- 2,000 generated English questions;
- all five temporary prototypes;
- all 55 admitted relations exercised;
- 372/372 fact pairs resolving to exactly one admitted fact relation;
- four- and five-option support;
- every answer position;
- Easy, Medium and Hard instances;
- deterministic replay;
- independent full-registry solving;
- explicit `UNIQUE`, `AMBIGUOUS` and `NO_VALID_RULE` fixtures;
- rejection of mammal/aquatic class-pair ambiguity;
- lifecycle and internal-ID leakage locks.

## 4. Temporary controls

| Prototype | Surface difference | Answer object | Proof object |
|---|---|---|---|
| `CLS-CP002-PROT-001` | contrasting valid relation | displayed pair | common relation across all other pairs |
| `CLS-CP002-PROT-002` | synonym/antonym polarity | displayed pair | common lexical relation across all other pairs |
| `CLS-CP002-PROT-003` | reversed direction | displayed pair | same directional relation across all other pairs |
| `CLS-CP002-PROT-004` | category-correct false pairing | displayed pair | same registered relation across all other pairs |
| `CLS-CP002-PROT-005` | different semantic class-pair | displayed pair | both members of each common pair belong to one class |

## 5. Merge/split finding

All five controls converge on one learner task:

```text
FIND_ODD_SEMANTIC_RELATION_PAIR
```

Invariant:

```text
Among four or five displayed pairs,
exactly one pair fails the precise internal relation
shared by every other pair.
```

The following do not create separate QLs:

- relation family;
- synonym versus antonym;
- direction reversal;
- false pairing versus another valid relation;
- four versus five options;
- relation difficulty;
- class-pair versus directional pair;
- source book section label.

Each produces the same displayed answer object, requested inference and solver proof.

## 6. Classification versus Analogy closure

Classification owns:

```text
A:B, C:D, E:F, G:H -> choose the differently related pair
```

Analogy owns:

```text
A:B :: C:?
```

and:

```text
Given A:B, select another pair having the same relationship
```

CP-002 never transfers a source relation to a target. It compares complete option-local pairs.

## 7. Provisional permanent identity

The next available chapter identity is:

```text
CLS-QL-004
```

Provisional solve contract:

```text
CP002-FIND-ODD-SEMANTIC-RELATION-PAIR
```

This identity must not be frozen until:

- all imported and supplemental fact labels localize without option collisions;
- the same correct index survives Hindi and Punjabi rendering;
- relation statements are natural in all three locales;
- multilingual independent replay passes;
- the final four-block review corpus is approved.

## 8. Locks

```text
Permanent CP-002 QLs:          0
Frozen CP-002 solve contracts: 0
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```
