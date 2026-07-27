# COD-CP-007 — Uniform Digit Task Merge/Split Decision

Status: **five executable prototype task contracts resolve to three provisional solve contracts; no permanent QLs**.

This decision applies only to `UNIFORM_MODULAR_DIGIT_TRANSLATION`. It does not freeze the complete checkpoint because other source candidates remain unresolved.

---

## 1. Prototype task inventory

The executable family currently exposes:

1. explicit-rule encode;
2. inverse decode;
3. recover one missing code digit;
4. infer-and-encode;
5. choose the matching complete code.

Prototype count is not QL count.

---

## 2. Final current-cycle decision

### 2.1 Forward complete-sequence translation

Provisional solve contract:

```text
FORWARD_UNIFORM_DIGIT_TRANSLATION
```

Retained authority:

- infer the unique uniform shift from examples;
- apply it to the complete target digit string;
- return the complete coded sequence.

Merged presentation variants:

- **explicit-rule encode** — the shift is disclosed rather than inferred;
- **choose matching code** — the correct complete code is selected from options.

Why merge:

- all three use the same forward decimal-token operation;
- all three have `DIGIT_SEQUENCE` answers;
- all three accept exactly the translated complete target;
- all three use the same distractor truth predicate;
- multiple-choice selection is already the delivery format for every generated question;
- rule disclosure changes difficulty and teaching order, not correctness semantics.

### 2.2 Inverse complete-sequence translation

Provisional solve contract:

```text
INVERSE_UNIFORM_DIGIT_TRANSLATION
```

Decision: **retain separately**.

Why split:

- the displayed target is in the code domain;
- the operation is subtraction/inverse movement modulo 10;
- the answer is the complete source string;
- forward-application distractors become a specific inverse misconception;
- the explanation must explicitly undo the rule rather than reapply it.

### 2.3 Missing-member completion

Provisional solve contract:

```text
MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION
```

Decision: **retain separately**.

Why split:

- the answer type is `SINGLE_CODE_TOKEN`, not a complete sequence;
- one displayed target position is masked;
- the student should reconstruct the full code before extracting the required position;
- missing first, middle and final positions require dedicated renderer and explanation checks;
- distractors are neighbouring or misconception digits rather than full code strings.

---

## 3. Executable semantic proof

The merge/split test generates 100 questions from each prototype and classifies them by answer predicate.

```text
Prototype task contracts:                 5
Generated questions:                    500
Forward full-sequence questions:        300
Inverse full-sequence questions:        100
Missing single-token questions:         100
Distinct semantic predicates:             3
Provisional solve contracts:              3
Permanent QLs:                            0
```

The test proves:

- explicit encode, infer-and-encode and choose-matching all accept `translate(targetSource, shift)`;
- inverse decode accepts the unique source whose forward translation equals the displayed code;
- missing-token accepts exactly one member of the fully translated target at the masked index;
- every prototype remains non-permanent and non-publishable.

---

## 4. Current provisional inventory

| Provisional solve contract | Prototype tasks represented | Current status |
|---|---|---|
| `FORWARD_UNIFORM_DIGIT_TRANSLATION` | explicit encode, infer-and-encode, choose matching | retain one; merge two presentations |
| `INVERSE_UNIFORM_DIGIT_TRANSLATION` | inverse decode | retain separately |
| `MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION` | recover missing token | retain separately |

These identities are provisional design fingerprints, not `COD-QL-*` IDs.

---

## 5. What remains open

Before any CP-007 permanent allocation:

- restore or replace the unavailable uploaded-source retrieval path;
- revisit source-pending digit-to-digit, digit-to-symbol, position-dependent and mixed alphanumeric candidates;
- run one checkpoint-wide registry if any additional family is admitted;
- repeat source, ownership, task, inverse, edge, representation and cross-contract duplication audits;
- freeze the complete English inventory;
- only then assign sequential IDs from the then-current next available `COD-QL-*` number.

---

## 6. Verdict

For the only currently admitted family:

```text
5 prototype tasks → 3 provisional solve contracts
```

CP-007 remains open, and permanent allocation remains prohibited.
