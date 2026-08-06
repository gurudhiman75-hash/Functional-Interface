# CLS-CP-003 — Preliminary Merge/Split Audit

Status: `EXECUTABLE_FINDING__PERMANENT_ALLOCATION_BLOCKED`

This document records the first executable finding only. It does not freeze a permanent QL or solve contract.

## 1. Measured discovery foundation

```text
Governed English words:         630
Controlled jumble words:         35
Temporary source controls:        7
Direct structural rules:          6
Generated discovery questions: 1,680
Unique visible questions:      1,680
Option counts:                    4 and 5
Difficulties:                     Easy, Medium, Hard
Permanent QLs:                    0
```

Answer-position coverage:

```text
4 options: 215, 202, 215, 208
5 options: 170, 189, 157, 166, 158
```

All generated questions replay deterministically and independently re-solve to the intended answer.

## 2. Direct structural controls

The first six controls differ only in the property inspected:

- exact word length;
- vowel count;
- repeated-letter topology;
- palindrome status;
- first/last vowel-consonant class;
- governed prefix or suffix family.

Their invariant is the same:

```text
Among four or five complete displayed words,
optionCount - 1 words share one admitted structural value,
exactly one word has a different value,
and no admitted structural rule selects another outlier.
```

They share:

- the same displayed answer object — one complete word;
- the same requested inference — inspect a visible word property;
- the same ambiguity audit;
- the same direct displayed-word verifier;
- the same explanation shape.

### Preliminary finding

These six controls provisionally merge into one learner contract:

```text
FIND_VISIBLE_WORD_STRUCTURE_OUTLIER
```

The individual property remains a rule, generation and difficulty feature rather than a separate QL.

## 3. Controlled jumbled-word control

The seventh control has a different proof pipeline:

```text
displayed jumble
-> unique admitted canonical word
-> governed semantic class
-> one resolved class outlier
-> answer remains the displayed jumble
```

Additional invariants:

- every jumble has exactly one admitted resolution;
- no open-dictionary search is used;
- all displayed jumbles have the same length;
- no visible direct structural rule may identify any outlier;
- semantic classification is applied only after resolution.

The final shortcut policy is:

```text
NO_DIRECT_STRUCTURAL_OUTLIER
```

### Preliminary finding

The jumbled-word task does not merge with direct word-structure classification because it requires a material intermediate answer object and a different independent solver.

It provisionally forms a second learner contract:

```text
RESOLVE_CONTROLLED_JUMBLES_AND_FIND_CLASS_OUTLIER
```

No permanent identity is allocated yet.

## 4. Why permanent allocation remains blocked

The checkpoint cannot freeze while any of the following remain open:

1. uploaded-book source saturation must be rerun when File Library retrieval is available;
2. untested source forms may include internal alphabetical order, spelling-family or other word-pattern controls;
3. Hindi and Punjabi require script-specific governed datasets rather than translations of English states;
4. the ownership boundary with Word and Dictionary Order, Alphabet Test and Coding-Decoding requires a final no-new-contract audit;
5. the two provisional contracts need language-specific feasibility and editorial review.

## 5. Current lifecycle

```text
Permanent CP-003 QLs:          0
Frozen CP-003 solve contracts: 0
Provisional learner contracts: 2
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```