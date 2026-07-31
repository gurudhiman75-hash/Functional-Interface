# CLS-CP-001 — Final Multilingual Runtime Freeze

Status: `FROZEN_MULTILINGUAL_RUNTIME_PROOF`

Checkpoint: `CLS-CP-001 — Semantic Word and Entity Classification`

This freeze applies to permanent runtime identity and multilingual review output. It does not enable Question Studio, Question Bank, tests or public publication.

---

## 1. Frozen permanent identities

| QL | Solve contract | Answer object |
|---|---|---|
| `CLS-QL-001` | `CP001-FIND-SEMANTIC-OUTLIER` | One displayed semantic item |
| `CLS-QL-002` | `CP001-SELECT-MEMBER-OF-SHARED-SEMANTIC-CLASS` | One displayed semantic item |
| `CLS-QL-003` | `CP001-SELECT-COHERENT-SEMANTIC-GROUP` | One displayed three-word group |

No permanent QL range beyond `CLS-QL-003` is reserved by this checkpoint.

---

## 2. Frozen source controls

```text
CLS-CP001-PROT-001  direct semantic-category outlier
CLS-CP001-PROT-002  primary-function outlier
CLS-CP001-PROT-003  part/system-membership outlier
CLS-CP001-PROT-004  select another class member
CLS-CP001-PROT-005  narrower class inside a shared parent
CLS-CP001-PROT-006  cross-cutting multi-membership outlier
CLS-CP001-PROT-007  narrowest-shared-class member selection
CLS-CP001-PROT-008  internally coherent semantic word-group
```

The controls remain provenance metadata. They are not learner-facing identities.

---

## 3. Dataset freeze

```text
Dataset version:               CLS-CP001-SEMANTIC-EN-v2
Semantic classes:              27
Unique English entities:       187
Inherited multi-membership:    91 entities
Direct multi-membership:       10 entities
Class translation coverage:    27 / 27 in Hindi and Punjabi
Entity translation coverage:   187 / 187 in Hindi and Punjabi
```

The dataset is hierarchy-aware and records parent classes, direct memberships, inherited memberships, contrast spaces, quality rank and factual-risk level.

---

## 4. Locale freeze

Frozen locales:

```text
en-IN
hi-IN
pa-IN
```

Parity requirements:

- identical permanent QL;
- identical source control and source seed;
- identical option count;
- identical canonical state and answer index;
- identical difficulty and difficulty features;
- translated givens, answer options, grouped options and answer;
- locale-authored stems, explanations, option checks, shortcuts and trap notes;
- no English instructional fallback in Hindi or Punjabi;
- no technical Punjabi placeholders such as standalone `ਪਦ` or `ਸਾਦ੍ਰਿਸ਼ਤਾ`.

---

## 5. Option and answer freeze

Every permanent QL supports both four and five answer options.

For `CLS-QL-001` and `CLS-QL-002`:

- each option is one semantic item;
- options are unique;
- the answer is one displayed item.

For `CLS-QL-003`:

- each option contains exactly three unique semantic items;
- no entity repeats across the displayed groups;
- exactly one complete group resolves to a precise admitted class;
- all distractor groups fail complete-group resolution;
- the answer is one displayed group.

---

## 6. Solver freeze

### Item-valued contracts

The canonical generator constructs a valid state first. The independent verifier reconstructs memberships from displayed labels and enumerates the bounded eligible-class registry.

### Group-valued contract

The canonical generator creates one coherent group and controlled mixed distractors. The independent verifier evaluates each complete option internally and requires exactly one uniquely coherent group.

### Ambiguity outcomes

```text
UNIQUE         accepted
AMBIGUOUS      rejected
NO_VALID_RULE  rejected
```

Broad root classes that cover every item cannot create an answer. Equal-quality competing classes that point to different answers force rejection.

---

## 7. Difficulty freeze

Model:

`CLS-CP001-INSTANCE-DIFFICULTY-v1`

Inputs:

- hierarchy depth;
- shared broader parent;
- direct multi-membership density;
- candidate-rule count;
- inverse/group task direction;
- cross-cutting reasoning;
- semantic demand;
- four versus five answer options.

Mapping:

```text
score 0–1  EASY
score 2–4  MEDIUM
score 5+   HARD
```

Difficulty is generated from the actual state. It is not selected by seed quota or prototype name.

---

## 8. Executable closure proof

The closure workflow validates:

- 1,400 discovery questions across the seven item controls;
- 900 hierarchy and ambiguity challenge questions;
- 840 editorial/difficulty questions;
- 500 coherent-group questions;
- 1,200 permanent English questions across three QLs;
- 1,800 multilingual parity questions;
- all three tasks in all three locales;
- four- and five-option coverage for every permanent QL;
- every answer position, including the fifth position;
- every frozen source control;
- all three public difficulty levels for every permanent QL;
- deterministic replay and independent-solver agreement;
- complete translation coverage and script checks;
- zero learner-facing lifecycle or internal-ID leakage.

The exact final head, workflow runs and artifact identifiers are recorded in draft PR `#285`, whose metadata can be updated without changing the validated source head.

---

## 9. Review artifact contract

The permanent multilingual exporter produces:

```text
3 QLs × 3 locales × 16 reviewed seeds = 144 questions
```

Each review row exposes:

- QL and solve contract;
- source control and source seed;
- locale and option count;
- stem, givens, options and grouped options;
- correct answer;
- intended semantic class;
- ambiguity result;
- difficulty score and features;
- teacher explanation;
- option checks;
- speed shortcut;
- common traps.

---

## 10. Release locks

```text
Permanent QLs:                 3
Frozen solve contracts:        3
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```

The next integration step requires explicit product-owner approval. This checkpoint is complete as a multilingual review-only runtime proof.
