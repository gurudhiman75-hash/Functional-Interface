# CLS-CP-001 — Source Saturation and Boundary Closure

Status: `SOURCE_SATURATED_FOR_CURRENT_PRODUCT_SCOPE`

Checkpoint: `CLS-CP-001 — Semantic Word and Entity Classification`

This authority supersedes the earlier provisional two-task merge/split finding. Permanent identities were allocated only after the additional source pass exposed a third materially different answer contract.

---

## 1. Source pass

The closure pass used the uploaded competitive-reasoning references as discovery evidence rather than as a fixed question quota.

### R.S. Aggarwal / Radian Classification chapter

The chapter separates Classification into three major types.

Within **Type 1 — Word Classification**:

- questions 1–66 repeatedly use a direct semantic odd-word-out task;
- questions 67–81 use odd **word-pair relationship** tasks;
- question 82 asks the learner to choose the one option whose complete word-group forms a coherent class.

The same chapter then starts:

- **Type 2 — Number Classification** at question 83;
- **Type 3 — Letter Classification** at question 164.

### Disha reasoning Classification chapter

The Disha source confirms:

- four- and five-option semantic odd-one-out presentation;
- category, function, profession, geography, science, disease, material, part/whole and related semantic domains;
- exam-facing wording where the displayed words themselves are the answer options;
- Banking/SSC-style five-option representation as a presentation property rather than a new reasoning contract.

---

## 2. Final ownership boundary

| Source/task form | Final owner | Decision |
|---|---|---|
| Select the semantic item that does not belong with the others | `CLS-CP-001 / CLS-QL-001` | Retain |
| Given semantic members, select one more member of the same class | `CLS-CP-001 / CLS-QL-002` | Retain as inverse task |
| Select the only option whose complete word-group forms one semantic class | `CLS-CP-001 / CLS-QL-003` | Retain as separate grouped-answer contract |
| Odd pair of words by relationship | `CLS-CP-002` | Defer; pair direction and relation signature change the solver contract |
| Spelling, letters, vowel/consonant count or word structure | `CLS-CP-003` | Reassign |
| Number and number-property classification | `CLS-CP-004` / `CLS-CP-005` | Reassign |
| Letter, letter-pair or letter-cluster classification | `CLS-CP-006` / `CLS-CP-007` | Reassign |
| Four versus five answer options | Same owning QL | Merge as representation/difficulty variation |
| Category versus function versus part/whole versus hierarchy | Same owning QL | Merge as semantic-instance variation |
| English, Hindi or Punjabi | Same owning QL | Locale rendering, not a new reasoning identity |

---

## 3. Final permanent inventory

### `CLS-QL-001` — Find the semantic outlier

Student contract:

```text
inspect four or five semantic items
identify the strongest precise class shared by all but one item
reject competing classes that produce a different defensible answer
select the remaining item
```

Frozen source controls:

- direct semantic category;
- primary function;
- part/whole or system membership;
- narrower class inside a shared parent;
- cross-cutting multi-membership.

### `CLS-QL-002` — Select another member of the shared semantic class

Student contract:

```text
infer the most precise class shared by the supplied members
check four or five candidate items
select the only candidate in that same class
```

Frozen source controls:

- ordinary class-member selection;
- narrowest-shared-class selection inside a hierarchy.

### `CLS-QL-003` — Select the coherent semantic word-group

Student contract:

```text
inspect four or five answer options
inspect the three words inside each option
find the only option whose complete set belongs to one precise semantic class
reject groups in which only one or two words are related
select that complete group
```

This is not a presentation variant of `CLS-QL-001`. The answer object is a group, the solver must evaluate every option internally, and the distractor proof is different.

---

## 4. Representation closure

The permanent runtime supports:

- four-option SSC/Punjab-style states;
- five-option Banking-style states;
- item-valued answers;
- grouped word-set answers;
- deterministic answer placement across every valid position;
- English, Hindi and Punjabi state parity.

Option count is encoded in generated-instance difficulty features. It is not a separate QL.

---

## 5. Semantic-rule universe

The current curated rule universe covers recurring product-relevant semantic families:

- ordinary category membership;
- biological category;
- geographic type;
- food, plant and object categories;
- primary function/use;
- part/whole and system membership;
- broader-parent versus narrower-child hierarchy;
- cross-cutting habitat and movement classes;
- class-member inverse selection;
- internally coherent word-group selection.

The runtime intentionally excludes free-form facts and unrestricted world-knowledge generation. Every admitted entity and membership is curated and versioned.

---

## 6. No-new-contract decision

After the source, task-direction, inverse, answer-object, option-count, hierarchy, multi-membership, ambiguity, representation and ownership audits:

```text
Permanent CP-001 QLs: 3
Uncovered CP-001 task contracts: 0
Unresolved pair-relation tasks: owned by CP-002
Unresolved lexical tasks: owned by CP-003
Unresolved numeric tasks: owned by CP-004/005
Unresolved letter tasks: owned by CP-006/007
```

A future semantic source may expand the curated dataset or add a new instance family without creating a QL. A new permanent QL is allowed only if it changes the learner task, answer object or proof contract materially.

---

## 7. Safety state

```text
Question Studio exposure: disabled
Question Bank storage: disabled
Test eligibility: disabled
Public publication: disabled
```

Source saturation closes the checkpoint inventory; it does not authorise public release.
