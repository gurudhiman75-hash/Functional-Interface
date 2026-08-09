# BLR-001 — Blood Relations: End-to-End Design

Status: **authoritative chapter design; all seven planned English content checkpoints discovery-frozen; chapter-wide gap audit passed; manual English freeze pending**.

## 1. Product objective

Generate deterministic Blood Relations questions for SSC, Banking and Punjab state examinations from a valid hidden family structure.

```text
construct valid family graph
  -> derive structured clues
  -> solve from displayed clues independently
  -> reject ambiguity
  -> construct misconception distractors
  -> render question and explanation
  -> expose review metadata
```

The chapter never guesses an answer from a prose template. The family graph and kinship ontology are the logic authority; student-facing text is a renderer.

## 2. Chapter identity

- family: `REAS-BLR` — relational and positional reasoning;
- package: `BLR-001`;
- rule authority: `BLOOD_GRAPH_RELATION`;
- primary locales: `en-IN`, `hi-IN`, `pa-IN`;
- locale mode: `LANGUAGE_ADAPTED`;
- renderers: structured text, dialogue, shared passage, coded-key block and family-tree explanation.

## 3. Scope

Included:

- direct and reverse named-person relations;
- multi-edge relation chains;
- grandparents, great-grandparents, grandchildren, uncle/aunt, nephew/niece and cousin paths;
- common in-law paths;
- pointer, photograph, portrait and conversation chains;
- only son, only daughter and only child constraints;
- shared family passages;
- gender, generation, pair, identity and count questions;
- exact, broad, possible, impossible and indeterminate semantics;
- coded kinship decoding and coded-expression construction;
- deterministic family-tree explanations.

Excluded from V1:

- Data Sufficiency answer contracts;
- family puzzles whose main burden is profession, city, colour, floor, schedule or seating assignment;
- age arithmetic;
- inheritance law or genetic pedigree reasoning;
- free-form runtime parsing;
- step, half, adoptive and foster relations unless later source evidence justifies them;
- public publication before separate release gates.

## 4. Frozen checkpoint ownership

| Checkpoint | Ownership | Permanent range |
|---|---|---|
| `BLR-CP-001` | Direct, reverse and multi-edge named-person relations; identity, pair, claim, generation and exact lineage | `BLR-QL-001..007` |
| `BLR-CP-002` | Pointer, photograph, portrait, conversation and nested role-chain relations | `BLR-QL-008` |
| `BLR-CP-003` | Shared family passages and set/pair/status identities | `BLR-QL-009..012` |
| `BLR-CP-004` | Closed-universe counts and family composition | `BLR-QL-013..017` |
| `BLR-CP-005` | Invariance, possibility, impossibility and uncertainty | `BLR-QL-018..025` |
| `BLR-CP-006` | Coded relations: decode and solve | `BLR-QL-026..030` |
| `BLR-CP-007` | Coded relations: construct, complete and validate | `BLR-QL-031..035` |

No `BLR-CP-008` is planned. `BLR-QL-036` remains technically available but unallocated.

## 5. Graph model

The shared family graph contains:

- people with stable IDs, locale-adapted names and known or unknown gender;
- directed parent edges;
- symmetric spouse edges;
- symmetric sibling edges;
- cardinality constraints for only-child and exact-count statements;
- bounded variable domains for uncertainty questions.

Primitive path steps are:

```text
PARENT
CHILD
SIBLING
SPOUSE
```

Derived relations are computed from paths and the subject's entailed gender. Exact structural paths remain machine-readable even when the displayed answer is broad.

## 6. Validity rules

Reject graphs containing:

- self-parent, self-spouse or self-sibling edges;
- ancestry cycles;
- duplicate IDs or duplicate displayed names;
- parent/child pairs that are also spouses or siblings;
- more than one active spouse per person in V1;
- contradictory gender evidence;
- disconnected named members in standard family-set prompts;
- cardinality contradictions;
- clues whose answer depends on hidden data not entailed by displayed information.

Names and letter labels provide no gender evidence. Every fixed gender used by a solver must be entailed by a displayed gender-bearing relation or explicit man/woman clue.

## 7. Solver routes

### Exact graph closure

Used for direct chains and fully determined family sets. It builds the graph from structured clues, enumerates supported paths and returns the unique required kinship relation.

### Role-chain reduction

Used for statements such as `my father's only sister's son`. The solver resolves the anchor and works from the innermost possessive role outward.

### Bounded model enumeration

Used for possible, impossible, broad and cannot-determine questions. A claim is definite only if true in every valid model, possible if true in at least one model, and impossible if true in none.

### Coded-relation normalization

Every supplied symbol or word token is decoded to one directed family relation. Adjacent assertions are passed to the ordinary family solver. Coded expressions are never evaluated with arithmetic precedence.

### Construction verification

Each completed coded expression is independently decoded and reconstructed. Missing tokens, ordered token pairs, person operands and validity claims must produce exactly one accepted option.

## 8. Query contracts

The frozen query families include:

- relation of subject to reference;
- reverse relation;
- identify person by relation, gender, lineage, marital status or model status;
- identify ordered or unordered pair by relation;
- compare generations;
- validate a relation or model-status claim;
- count members, relatives, pairs and generations under an explicit universe;
- select a family-composition profile;
- determine count bounds and count determinacy;
- decode a coded relation or family set;
- complete or select a coded expression.

Differences in names, path length, relation vocabulary, symbols or difficulty do not create separate QLs. A split requires a materially different generator, solver, answer, ambiguity, explanation, localisation or renderer contract.

## 9. Answer semantics

- `EXACT`: one exact relation path is entailed;
- `BROAD`: exact paths may differ but reduce to one broad label;
- `GENDER_NEUTRAL`: the structural relation is known but gender is not;
- `DEFINITE`: true in all valid models;
- `POSSIBLE`: true in some but not all valid models;
- `IMPOSSIBLE`: true in no valid model;
- `CANNOT_BE_DETERMINED`: materially different answers survive and no broader offered answer is entailed;
- `NUMBER`: a count over an explicit closed universe;
- `PERSON`, `PAIR` or `PROFILE`: a uniquely validated identity contract;
- `CODE_TOKEN` or `CODE_EXPRESSION`: independently decoded and validated.

## 10. Distractor model

Preferred error labels include:

```text
REVERSED_QUERY_DIRECTION
WRONG_GENDER
MATERNAL_PATERNAL_SWAP
GENERATION_ONE_LEVEL_HIGH
GENERATION_ONE_LEVEL_LOW
SIBLING_COUSIN_CONFUSION
BLOOD_AFFINAL_CONFUSION
IGNORED_ONLY_CONSTRAINT
ASSUMED_UNKNOWN_GENDER
POSSIBLE_BUT_NOT_DEFINITE
WRONG_TOKEN_DIRECTION
TOKEN_ORDER_OR_MEANING_MISMATCH
DOUBLE_COUNTED_PERSON
```

Every option must be type-compatible, unique after semantic normalisation and independently false except for the one correct option.

## 11. Explanation model

A student explanation should:

1. normalise the useful clues;
2. place people by generation or role;
3. trace the query in the exact requested direction;
4. state the relation path naturally;
5. conclude with the answer;
6. reject each important misconception;
7. provide a short exam-speed rule.

Family-tree SVG is an explanation and review renderer. It is generated from solved structured data and never infers or alters the answer.

## 12. Localisation

English, Hindi and Punjabi must preserve graph, query, variables, correct answer, difficulty and ambiguity status for the same seed.

Use structurally explicit relation phrases when common kinship terms encode unstated age or lineage. Hindi and Punjabi pointer chains must be rendered naturally rather than translated word by word. Gender agreement, possessive scope, only-constraints, coded-key direction and model-status language require dedicated audits.

## 13. Question Studio metadata

Required review metadata includes:

```text
chapter/checkpoint/prototype-or-QL
seed and locale
query kind and answer semantics
family topology and relation path
path length and generation delta
blood/affinal nature and lineage side
model count
clue contribution
error labels
independent-solver and ambiguity status
semantic fingerprint
editorial and publication status
```

Hidden family graphs and internal IDs remain administrator-only.

## 14. Discovery and freeze policy

Permanent QLs may be allocated only after:

```text
source audit
-> executable prototypes
-> solver proof
-> editorial saturation
-> merge/split audit
-> inverse audit
-> gap audit
-> discovery freeze
```

The seven checkpoint freezes were followed by a chapter-wide executable gap audit covering 1,958 questions across all 35 permanent authorities.

Final chapter-audit result:

```text
exact cross-QL learner-surface collisions           0
normalized cross-QL template collisions             0
learner-text failures                               0
gender-evidence failures                            0
option-contract failures                            0
lifecycle-lock failures                             0
ownership failures                                  0
open included source families                       0
```

Verdict: `CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE`.

## 15. Current implementation state

Implemented and discovery-frozen:

- shared family graph and validity foundation;
- exact, broad, lineage, in-law and great-generation closure;
- deterministic named-person, role-chain and shared-passage generation;
- counts and composition;
- complete bounded model enumeration;
- coded relation decoding and construction;
- misconception-owned options;
- four-tier learner explanations;
- SVG family trees with ASCII fallback;
- independent runtime proofs for every checkpoint;
- chapter-wide QL ownership, overlap, learner-text and gender-evidence proof.

Next:

```text
manual English chapter review and freeze
  -> Hindi and Punjabi localisation
  -> multilingual parity proof and freeze
  -> Question Studio integration
```

Question Studio, Question Bank, mock tests, publication, production staging and merge remain disabled.
