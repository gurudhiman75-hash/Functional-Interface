# BLR-CP-007 Hindi and Punjabi Localisation

Status: `EXECUTABLE_PARITY_PROVED__HUMAN_LANGUAGE_REVIEW_REQUIRED`

## Canonical authority

The frozen English corpus remains the only semantic authority.

Localisation may change only learner-facing language:

- shared code-key wording;
- stems;
- written interpretations in validity options;
- decoded statements;
- option explanations;
- step-by-step explanations;
- conclusions;
- shortcuts and traps;
- accessible diagram text.

Localisation must not change:

- item, scenario, topology, QL or prototype identity;
- code tokens or code meanings;
- candidate order;
- option order;
- correct answer index;
- completed statements;
- graph structure;
- target relation or target path;
- difficulty;
- delivery mode or shared-set structure;
- English semantic fingerprints;
- product lifecycle locks.

## Target locales

- Hindi: `hi-IN`
- Punjabi: `pa-IN`

## Coverage

- English authority: 168 questions
- Hindi review candidate: 168 questions
- Punjabi review candidate: 168 questions
- Permanent QLs: BLR-QL-031 through BLR-QL-035
- Target relations: 27

## Language standard

Both languages must read like an SSC, Banking or Punjab-state exam explanation, not like a literal developer translation.

Required style:

```text
short instruction -> decode the relevant links -> state the relation clearly
```

Hindi and Punjabi should:

- use short active sentences;
- preserve person and symbol order exactly;
- explain direction before naming the final relation;
- use descriptive wording for ambiguous in-law terms;
- keep coded expressions unchanged;
- avoid internal graph, fingerprint, solver and lifecycle terminology;
- avoid English boilerplate in learner-facing fields.

## Executable proof

The parity test proves exact equality of:

- IDs and QL contracts;
- code keys and query structures;
- option semantic keys;
- completed statements;
- correct indexes;
- graph structures;
- family-tree nodes and edges;
- diagram path evidence;
- difficulty and semantic fingerprints.

Script-completeness checks require Devanagari in every Hindi learner explanation field and Gurmukhi in every Punjabi learner explanation field. Placeholder and cross-script checks must remain zero.

## Lifecycle

```text
English corpus:                 FROZEN
Hindi corpus:                   EXECUTABLE_REVIEW_REQUIRED
Punjabi corpus:                 EXECUTABLE_REVIEW_REQUIRED
Multilingual freeze:            locked
Question Studio exposure:       disabled
Question Bank storage:          disabled
Mock-test delivery:             disabled
Public publication:             disabled
Merge:                          not authorised
```

Hindi and Punjabi may be frozen only after human language review, required wording remediation and a final multilingual parity proof.
