# ANA-CP-008 Source-Saturation Audit

Status: **SOURCE AUDIT IN PROGRESS — COUNTS OPEN**

## 1. Purpose

This audit identifies recurring mixed letter-number analogy patterns and separates them from pure letter analogy, pure number analogy, Coding-Decoding and alphanumeric-series questions.

A family is admitted only when:

1. readable source evidence establishes the complete rule;
2. both domains have a reasoning role;
3. the rule can be represented by a bounded deterministic contract;
4. an independent solver can verify it;
5. ambiguity and distractor audits can reject nearby alternatives;
6. the family is not already owned elsewhere.

## 2. Source inventory

### Testbook analogy overview

Current Testbook material explicitly recognises “Letter and Number Based Analogy (Mixed Analogy)” as a separate type. It describes mixed pairs of letters and numbers and names addition/subtraction and place-value operations as common mechanisms.

A readable worked example is:

```text
P21 : J28 :: G19 : ?
```

The source explanation gives:

```text
P(16) − 6 = J(10)
21 + 7 = 28

G(7) − 6 = A(1)
19 + 7 = 26
```

Therefore the answer is `A26`.

This establishes an independent mixed-token authority in which the letter component and whole-number component undergo separate fixed operations.

### Oliveboard railway analogy practice, July 2026

The practice page identifies mixed analogy among common railway patterns and includes:

```text
AB : 2 :: CD : ?
ZA : 27 :: YB : ?
```

The option sets support these transparent position aggregates:

```text
AB → 1 × 2 = 2
CD → 3 × 4 = 12

ZA → 26 + 1 = 27
YB → 25 + 2 = 27
```

This establishes sum and product of ordinary letter positions as recurring cross-domain analogy contexts.

The same source contains:

```text
AE : F :: CG : ?
```

with the described rule:

```text
A=1, E=5, 1+5=6 → F
C=3, G=7, 3+7=10 → J
```

This establishes a letter-group-to-derived-letter authority based on position aggregation.

### Recent mixed alphanumeric exam forms

Current Testbook mixed-analogy pages include longer terms such as:

```text
ZKX102 : UHW204
XYR126 : ?
LST305 : QPI610
```

and other three-letter-plus-number forms.

These establish that modern exams ask composite cluster-number analogy, but many detailed letter operations are embedded in images. The family is source-real, but permanent profiles must not be inferred from answer strings alone. It remains admitted for pilot investigation but not frozen for production.

### SATHEE Coding-Decoding boundary evidence

SATHEE materials classify the following under Coding-Decoding:

- ordinary/reverse letter-position mapping;
- number-letter swap;
- conditional vowel/consonant coding;
- mixed coding;
- word-to-number position sums;
- direct encode/decode prompts.

Therefore visibility of letters and numbers alone does not make a question CP-008. The task framing and evidence structure determine ownership.

## 3. Source-backed admitted authorities

### A. `MIXED_LETTER_GROUP_SCALAR_AGGREGATE`

Evidence:

- `AB → 2` through product;
- `ZA → 27` through sum.

Admitted pilot contexts:

```text
ORDINARY_POSITION_SUM
ORDINARY_POSITION_PRODUCT
```

Open design question:

Should sum and product become separate QLs or contexts of one letter-position aggregate authority? Pilot explanation, collision and analytics audits must decide.

### B. `MIXED_LETTER_GROUP_DERIVED_LETTER`

Evidence:

- `AE → F` through `1+5=6→F`.

Admitted pilot context:

```text
SUM_TO_ORDINARY_POSITION_LETTER
```

Constraints:

- raw sum must lie in `1..26` unless cyclic reduction receives independent source support;
- every input letter contributes;
- output must not be equally explained by a simpler fixed shift or midpoint rule.

### C. `MIXED_TOKEN_INDEPENDENT_TRANSFORM`

Evidence:

- `P21 → J28` through letter `−6` and number `+7`.

Admitted pilot contexts:

- letter fixed forward/backward shift;
- whole-number fixed addition/subtraction.

Potential contexts requiring more source evidence:

- whole-number multiplication/division;
- opposite-letter transform plus number operation;
- multi-letter cluster transform plus number operation.

### D. `MIXED_CLUSTER_NUMBER_COMPOSITE`

Evidence:

- recurring modern three-letter-plus-number analogy forms.

Status: **pilot-admitted, profile-deferred**.

The typed parser and collision framework should be built, but no permanent rule profile is frozen until the source rule is readable or independently recovered from multiple complete pairs without ambiguity.

## 4. Candidate authorities requiring more evidence

### Letter-group absolute difference or gap

Potential rules:

```text
|pos(A) − pos(B)|
letters strictly between A and B
inclusive alphabet distance
```

Risk: these are easily confused and produce off-by-one ambiguity. No permanent context until recurring readable source examples are recovered.

### Reverse-position aggregates

Potential rules:

```text
reverse-position sum
ordinary + reverse position
product of reverse positions
```

Risk: ordinary/reverse sums can collapse to constants, especially for opposite pairs.

### Number-to-letter transparent analogy

Potential rules:

```text
1 → A
1 → Z
n±k → letter
```

Risk: direct overlap with Coding-Decoding. Admission requires analogy-framed source examples where no code recovery is involved.

### Letter-driven numeric update

Potential forms:

```text
output number = input number + position(letter)
output number = input number − sum(letter positions)
```

Risk: unrestricted formulas and accidental fit.

### Number-driven letter movement

Potential forms:

```text
output letter = input letter shifted by displayed number
```

Risk: coding overlap and insufficient evidence from one pair.

### Coupled invariant

Potential forms:

```text
position(letter) + number = constant
letter distance = numeric difference
```

Risk: several invariants can fit one source pair. Requires at least two complete source pairs and full-rule matching.

## 5. Explicitly delegated patterns

| Pattern | Owner | Reason |
|---|---|---|
| pure letter shift/permutation | CP-005/006 | number domain absent |
| pure number arithmetic analogy | numeric ANA checkpoint | letter domain absent |
| meaningful word to scalar | CP-007 or Coding-Decoding by framing | word structure is primary |
| per-letter position sequence code | Coding-Decoding | encoding task |
| unknown code-table recovery | Coding-Decoding | hidden substitution system |
| long mixed string position query | Alphanumeric Series | sequence navigation |
| symbol replacement equation | Mathematical Operations | operator semantics |

## 6. Collision risks discovered

### Sum versus product

Pairs containing `A` or repeated low positions can make sum and product equal or close. Examples must activate distinct outputs across complete source and target evidence.

### Position sum to number versus position sum to letter

The arithmetic is shared, but output rendering and answer type differ. They may share a foundation function while remaining separate presentation authorities.

### Independent mixed transform versus coupled transform

A displayed output may be explained either by two independent changes or by a coupled formula. Accept only when complete evidence uniquely supports one interpretation.

### Whole-number arithmetic versus digit operations

The default is whole-number arithmetic. Digit splitting is prohibited unless the rule profile explicitly owns it and source instructions allow it.

### Mixed analogy versus coding

The same arithmetic may appear in both topics. Ownership depends on task grammar:

```text
A : B :: C : ?     → analogy transfer
If A is coded as B → coding-decoding
```

The underlying alphabet functions should be shared even when task ownership differs.

## 7. Current source verdict

```text
Clearly source-backed pilot authorities: 3
Source-real composite authority awaiting readable profiles: 1
Candidate authorities requiring evidence: 6
Delegated pattern groups: 7
Permanent QL count: OPEN
Permanent solve-mode count: OPEN
```

## 8. Next source actions

1. recover the uploaded audited ANA-CP-008 manifest when File Library retrieval is restored;
2. inspect uploaded reasoning books for letter-number analogy examples;
3. recover readable rules for modern three-letter-plus-number questions;
4. search official/past-paper examples for number-to-letter and coupled invariants;
5. build a provisional typed-token pilot before any QL freeze;
6. compare the discovered family set against the 16-QL reservation.
