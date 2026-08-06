# CLS-CP-002 — Source Saturation and Merge/Split Audit

Status: `CLOSED__ONE_PERMANENT_QL_FROZEN`

This audit records the final source, task, solver and ownership boundary for semantic relationship-pair classification.

## 1. Final conservative registry

```text
Stable directional semantic relations: 19
Lexical relations:                     12
Semantic class-pair relations:         24
Total admitted relations:              55
Curated English fact pairs:            372
Multilingual-safe fact pairs:          160
English-only discovery fact pairs:     212
Temporary source controls:               5
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

`Husband : Wife` remains admissible only as a source-backed odd contrast against one-generation family-role pairs. A generic spouse-role relation is not registered because combinations such as `Groom : Wife` are linguistically arguable.

## 2. Source saturation additions

The imported Analogy libraries were supplemented with recurring Classification forms that were missing as explicit relations:

- container and usual content;
- raw material and resulting product;
- object/source and characteristic sound;
- explicit family roles separated by one generation.

These are governed curated facts, not runtime LLM generation.

## 3. Executable proof

The discovery and closure gates validate:

- 2,000 generated English discovery questions;
- 1,600 frozen English runtime questions;
- 1,800 multilingual parity questions;
- all five temporary source controls;
- all 55 admitted relations exercised;
- 372/372 English fact pairs resolving to exactly one admitted fact relation;
- all 31 fact-backed relation families retaining at least four multilingual-safe pairs;
- 160/160 multilingual-safe fact pairs rendered and reversed in Hindi and Punjabi;
- four- and five-option support;
- every answer position;
- Easy, Medium and Hard instances;
- deterministic replay;
- independent full-registry solving;
- explicit `UNIQUE`, `AMBIGUOUS` and `NO_VALID_RULE` fixtures;
- rejection of class-overlap ambiguity;
- lifecycle and internal-ID leakage locks.

Measured frozen-runtime results:

```text
English questions:             1,600
Unique visible English states: 1,580
Duplicate visible states:         20
Relations exercised:              55
Answer positions:            360, 401, 394, 361, 84
```

Measured multilingual results:

```text
Questions per locale:             600
Total multilingual questions:   1,800
Unique visible en-IN:              595
Unique visible hi-IN:              597
Unique visible pa-IN:              597
Duplicate counts en/hi/pa:       5/3/3
Unique explanation traces:       1,767
Answer positions per locale: 135, 156, 148, 134, 27
```

## 4. Source controls

| Prototype | Surface difference | Answer object | Proof object |
|---|---|---|---|
| `CLS-CP002-PROT-001` | contrasting valid relation | displayed pair | common relation across all other pairs |
| `CLS-CP002-PROT-002` | synonym/antonym polarity | displayed pair | common lexical relation across all other pairs |
| `CLS-CP002-PROT-003` | reversed direction | displayed pair | same directional relation across all other pairs |
| `CLS-CP002-PROT-004` | category-correct false pairing | displayed pair | same registered relation across all other pairs |
| `CLS-CP002-PROT-005` | different semantic class-pair | displayed pair | both members of each common pair belong to one class |

The false-pair control is learner-facing only for conservative, precise relations. Broad or arguable semantic relations remain discovery-only.

## 5. Final merge/split finding

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

## 7. Permanent identity

```text
QL:             CLS-QL-004
Solve contract: CP002-FIND-ODD-SEMANTIC-RELATION-PAIR
Answer object:  DISPLAYED_PAIR
Status:         FROZEN_MULTILINGUAL_RUNTIME_PROOF
```

The 160 multilingual-safe fact pairs form the learner-facing semantic fact pool. The remaining 212 English facts stay available for discovery and ambiguity testing only.

## 8. Locks

```text
Permanent CP-002 QLs:          1
Frozen CP-002 solve contracts: 1
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```