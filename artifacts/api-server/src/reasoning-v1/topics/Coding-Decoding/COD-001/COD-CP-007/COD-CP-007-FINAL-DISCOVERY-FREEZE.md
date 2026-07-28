# COD-CP-007 — Final English Discovery Freeze

Status: **English discovery frozen; one retained rule family; four frozen solve contracts; zero permanent QLs pending sequential allocation**.

Freeze authority: `COD_CP007_ENGLISH_DISCOVERY_FREEZE_V1`.

This document closes the open source, ownership and merge/split questions for COD-CP-007. It does not expose the checkpoint to Question Studio and does not start localisation.

---

## 1. Retained family

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

Every source digit is translated independently by one non-zero shift modulo 10. Codes are ordered digit strings, so leading zeroes are significant and no complete code is coerced into a number.

The existing prototype is mathematically and editorially saturated across 500 mathematical and 500 polished-English audit questions.

---

## 2. Targeted source-expansion result

The final pass specifically searched for recurring target-exam examples of arbitrary digit substitution, digit-to-symbol maps, position-dependent digit transforms, mixed alphanumeric transforms and mixed-token substitution.

### 2.1 Conditional number/symbol tables

Recurring official RRB, DSSSB and NTPC questions use an explicit number/symbol lookup table followed by endpoint, parity, position or perfect-square conditions. The student must determine which condition applies before reading or overriding the table code.

These are COD-CP-010 conditional-table questions, not standalone CP-007 direct maps.

Representative source mirrors include:

- RRB Group D 8 September 2022: number/symbol table with three conditional overrides;
- RRB Group D 17 September 2022: number/symbol table with conditional replacement;
- RRB NTPC 23 June 2025: number/symbol table with position and number-property overrides;
- DSSSB ASO 19 August 2025: number/symbol table with conditional endpoints.

### 2.2 Arbitrary character substitution

Recent SSC and state-paper mirrors repeatedly show words mapped to unordered digit sets and ask for one letter code by intersection. That is the existing CP-001 arbitrary character-substitution authority. Replacing the source letters with digits does not create a new solver.

### 2.3 Two-symbol positional numeral systems

Questions where `0` and `1` are represented by symbols such as `@/%` or `&/#` and longer values follow binary place value are recurring. Their correctness predicate is base conversion and arithmetic, so they belong to Number System rather than CP-007.

### 2.4 Position/class-dependent digit manipulation

Recurring reasoning questions explicitly instruct the learner to add or subtract values from odd/even digits and then inspect, rank or compare the transformed number. They do not present a hidden coding relation requiring rule inference. They therefore do not establish a standalone CP-007 coding family.

### 2.5 Alphanumeric and mixed-token candidates

Searches recovered alphanumeric-series questions and synthetic practice examples, but no recurring target-exam coding format in which letter and digit channels are both materially active and require a new solver beyond CP-003/004/006.

---

## 3. Final candidate ownership

| Candidate | Final decision | Owner/reason |
|---|---|---|
| uniform modular digit translation | retain | material decimal wrap, leading-zero and inverse semantics |
| arbitrary digit substitution | exclude for source gap | no recurring standalone target-exam format |
| digit-to-symbol bijection | delegate | CP-010 when table conditions govern the task |
| position-dependent digit translation | exclude for source gap | observed forms are explicit digit manipulation, not hidden coding inference |
| pure digit permutation | delegate | CP-005 permutation solver |
| alphanumeric dual-channel transform | exclude for source gap | no recurring two-active-channel source format |
| mixed-token arbitrary substitution | delegate | CP-001 arbitrary token mapping |
| two-symbol positional numeral code | delegate | Number System/base conversion |

No unresolved candidate remains capable of changing the retained CP-007 rule inventory.

---

## 4. Frozen solve contracts

The five prototype presentations collapse to four solve authorities:

1. **Explicit forward application** — the digit-wise shift is stated and must be applied correctly, including wrap and leading zeroes.
2. **Inverse decode** — infer the forward rule and apply the exact inverse modulo 10.
3. **Missing code digit** — infer the rule and recover one uniquely determined token.
4. **Inferred forward coding** — infer the shift from examples and encode the target.

`CHOOSE_MATCHING_CODE` merges into inferred forward coding because it has the same hidden state, answer domain, correctness predicate, distractor model and proof obligation. It is retained only as stem/render variation.

---

## 5. Allocation decision

The next available chapter ID is `COD-QL-169`.

Sequential allocation may now assign exactly four permanent identities:

```text
COD-QL-169..172
```

The IDs are not written by this freeze commit. Allocation and runtime promotion occur in the next guarded implementation step so discovery evidence and permanent identity remain independently reviewable.

---

## 6. Safety boundary

- permanent CP-007 QLs in this freeze: **0**;
- Question Studio exposure: **disabled**;
- Hindi/Punjabi: **not started**;
- public publication: **false**;
- CP-008 and CP-009 ranges remain downstream of the actual CP-007 allocation.

Final verdict: **COD-CP-007 ENGLISH DISCOVERY FROZEN — ONE RULE FAMILY, FOUR SOLVE CONTRACTS**.
