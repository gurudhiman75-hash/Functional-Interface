# BLR-001 — Blood Relations: End-to-End Design

Status: **authoritative implemented chapter design; seven checkpoints frozen at 35 permanent QLs (`BLR-QL-001..035`); final Reasoning V1 audit remediation active**.

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

The chapter must never guess an answer from a prose template. The family graph and kinship ontology are the logic authority; student-facing text is a renderer.

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
- grandparents, grandchildren, uncle/aunt, nephew/niece and cousin paths;
- common in-law paths;
- pointer, photograph and conversation chains;
- only son, only daughter and only child constraints;
- shared family passages;
- gender, generation, pair, identity and count questions;
- exact, broad, possible, impossible and indeterminate semantics;
- coded kinship relations and coded-expression construction;
- deterministic family-tree explanations.

Excluded:

- Data Sufficiency answer contracts;
- family puzzles whose main burden is profession, city, colour, floor, schedule or seating assignment;
- age arithmetic;
- inheritance law or genetic pedigree reasoning;
- free-form runtime parsing;
- step, half, adoptive and foster relations in V1 unless later source evidence justifies them;
- public publication before checkpoint freeze.

## 4. Final checkpoint ownership

| Checkpoint | Ownership |
|---|---|
| `BLR-CP-001` | Direct named-person relation chains |
| `BLR-CP-002` | Pointer, photograph and conversation relations |
| `BLR-CP-003` | Family-set passages and shared graphs |
| `BLR-CP-004` | Family counts and structural quantities |
| `BLR-CP-005` | Determinacy, possibility and uncertainty |
| `BLR-CP-006` | Coded relations: decode and solve |
| `BLR-CP-007` | Coded relations: construct, complete and validate |

The seven checkpoint boundaries are now final for V1. Their permanent QL inventory is `BLR-QL-001..035`; `BLR-QL-036` remains unallocated. A later checkpoint or QL split requires new source evidence and a materially different solve contract rather than ordinary name, wording, path-length or difficulty variation.

## 5. Graph model

The shared family graph contains:

- people with stable IDs, locale-adapted names and known or unknown gender;
- directed parent edges;
- symmetric spouse edges;
- symmetric sibling edges;
- later cardinality constraints for only-child and exact-count statements.

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

## 7. Solver routes

### Exact graph closure

Used for direct chains and fully determined family sets. It builds the graph from structured clues, enumerates simple paths and returns the unique shortest supported kinship relation.

### Role-chain reduction

Used for statements such as `my father's only sister's son`. The solver resolves the anchor and works from the innermost possessive role outward.

### Bounded model enumeration

Used for possible, impossible, broad and cannot-determine questions. A claim is definite only if true in every valid model, possible if true in at least one model, and impossible if true in none.

### Coded-relation normalization

Every supplied symbol is decoded to a binary family relation. Adjacent assertions are then passed to the ordinary family solver. Coded expressions are never evaluated with arithmetic precedence.

## 8. Query contracts

Candidate query families include:

- relation of subject to reference;
- reverse relation;
- identify person by relation;
- identify pair by relation;
- determine gender;
- compare generations;
- validate a relation claim;
- count members under an explicit universe;
- complete or select a coded expression.

Differences in names, path length, relation vocabulary or difficulty do not automatically create separate QLs. A split requires a materially different generator, solver, answer, ambiguity, explanation, localisation or renderer contract.

## 9. Answer semantics

- `EXACT`: one exact relation path is entailed;
- `BROAD`: exact paths may differ but reduce to one broad label;
- `GENDER_NEUTRAL`: the structural relation is known but gender is not;
- `DEFINITE`: true in all valid models;
- `POSSIBLE`: true in some but not all valid models;
- `IMPOSSIBLE`: true in no valid model;
- `CANNOT_BE_DETERMINED`: materially different answers survive and no broader offered answer is entailed;
- `NUMBER`: a count over an explicit closed universe;
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
6. reject a close misconception only when that extra note materially helps the learner; do not force option-by-option analysis, shortcuts or trap boilerplate onto every question.

Family-tree SVG is initially an explanation and review renderer. It must be generated from solved structured data and must not infer or alter the answer.

## 12. Localisation

English, Hindi and Punjabi must preserve graph, query, correct answer, difficulty and ambiguity status for the same seed.

Use structurally explicit relation phrases when common kinship terms encode unstated age or lineage. Hindi and Punjabi pointer chains must be rendered naturally rather than translated word by word. Gender agreement, possessive scope and `only` constraints require dedicated audits.

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

The discovery/freeze process is complete for BLR-CP-001..007. The chapter owns 35 permanent QLs; final audit remediation may improve presentation, lifecycle safety and difficulty calibration without reallocating those identities unless new source evidence proves a missing solve contract.

## 15. Current implementation and final-audit boundary

Implemented:

- seven checkpoints, `BLR-CP-001..007`;
- 35 permanent QLs, `BLR-QL-001..035`;
- graph, role-chain, shared-family, count/model-space and coded-relation solvers;
- deterministic misconception-aware options and family-tree explanation evidence;
- standard admin Question Studio review registration for every checkpoint;
- multilingual frozen corpora for CP-006 and CP-007;
- Hindi/Punjabi machine-proved review candidates for CP-003..005.

Final-audit holds:

- CP-001 and CP-002 still require Hindi/Punjabi implementation before chapter-wide trilingual closure;
- CP-003..005 Hindi/Punjabi require human language review/freeze;
- CP-006 has a learner-facing coded-relation guidance sentence that is more tutorial-like than a normal exam prompt; because CP-006 is multilingual-frozen, changing it requires an explicit superseding multilingual editorial/freeze pass rather than a silent text edit;
- Question Bank, mock-test and public/student release gates remain separate from Question Studio review registration.
