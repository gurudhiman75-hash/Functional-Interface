# ANA-CP-008 Source-Saturation Audit

Status: **SOURCE AUDIT IN PROGRESS — COUNTS OPEN**

## 1. Purpose

This audit identifies recurring mixed letter-number analogy patterns and separates them from pure letter analogy, pure number analogy, Coding-Decoding, alphanumeric series, and ANA-CP-009 advanced/meta analogy.

A family is admitted only when:

1. readable source evidence establishes the complete rule;
2. both domains have a reasoning role;
3. the rule can be represented by a bounded deterministic contract;
4. an independent solver can verify it;
5. ambiguity and distractor audits can reject nearby alternatives;
6. the family is not already owned elsewhere.

The inherited `ANA-QL-223..ANA-QL-238` reservation is not a final count.

## 2. Source inventory

### Testbook mixed-analogy overview

Current Testbook material explicitly recognises “Letter and Number Based Analogy (Mixed Analogy)” as a separate type.

Readable example:

```text
P21 : J28 :: G19 : ?
```

Source rule:

```text
P(16) − 6 = J(10)
21 + 7 = 28

G(7) − 6 = A(1)
19 + 7 = 26
```

Answer: `A26`.

This establishes an independent mixed-token authority in which the letter component and whole-number component undergo separate fixed operations.

### Oliveboard railway analogy practice, July 2026

Readable examples:

```text
AB : 2 :: CD : ?
ZA : 27 :: YB : ?
AE : F :: CG : ?
```

Supported rules:

```text
AB → 1 × 2 = 2
CD → 3 × 4 = 12

ZA → 26 + 1 = 27
YB → 25 + 2 = 27

AE → 1 + 5 = 6 → F
CG → 3 + 7 = 10 → J
```

These establish:

- ordinary-position sum to scalar;
- ordinary-position product to scalar;
- ordinary-position sum rendered as a letter.

### Testbook analogy notes: shared-delta cluster-number transform

Readable example:

```text
PL36 : UQ41 :: MI49 : ?
```

Source rule:

```text
P + 5 = U
L + 5 = Q
36 + 5 = 41

M + 5 = R
I + 5 = N
49 + 5 = 54
```

Answer: `RN54`.

This establishes a cluster-number authority in which one signed delta is shared by every letter and the whole-number component.

It is more specific than an unrestricted pairing of any CP-006 rule with any numeric operation.

### Testbook analogy notes: coupled number-letter invariant

Readable example:

```text
21I : 22P :: 13P : ?
```

Source rule:

```text
21 → digit sum 3 → 3² = 9 → I
22 → digit sum 4 → 4² = 16 → P

13 → digit sum 4 → 4² = 16 → P
14 → digit sum 5 → 5² = 25 → Y
```

The number increases by one and the attached letter is recomputed from the square of the new digit sum.

Answer: `14Y`.

This establishes a real digit-operation family. It is an explicit exception to the default whole-number rule because the source itself requires digit decomposition.

### SSC GD Constable 2026 advanced mixed-cluster question

Official-paper example reported by Testbook:

```text
ZKX102 : UHW204 :: XYR126 : ? :: LST305 : QPI610
```

The number component is doubled. The letter vector is not constant across the three pairs:

```text
ZKX → UHW uses −5, −3, −1
XYR → OVU uses −9, −3, +3
LST → QPI uses another pair-index-dependent vector
```

The target rule is inferred from progression across multiple complete evidence pairs, not from one stable pair-local transform.

Ownership decision: **delegate to ANA-CP-009 advanced/meta analogy**.

CP-008 may supply typed mixed tokens and shared arithmetic, but it must not register this as a normal pair-transfer authority.

### SATHEE Coding-Decoding boundary evidence

SATHEE materials classify the following under Coding-Decoding:

- ordinary/reverse letter-position mapping;
- number-letter swap;
- conditional vowel/consonant coding;
- mixed coding;
- word-to-number position sums;
- direct encode/decode prompts.

Therefore visibility of letters and numbers alone does not make a question CP-008. Task framing and evidence structure determine ownership.

## 3. Source-backed provisional authorities

### A. `MIXED_LETTER_GROUP_SCALAR_AGGREGATE`

Evidence:

- `AB → 2` through product;
- `ZA → 27` through sum;
- `BN → 16` through sum in Testbook notes.

Pilot contexts:

```text
ORDINARY_POSITION_SUM
ORDINARY_POSITION_PRODUCT
```

Open allocation question:

Should sum and product be two solve authorities or two contexts inside one aggregate authority? The answer depends on explanation, analytics, and misconception separation—not code reuse.

### B. `MIXED_LETTER_GROUP_DERIVED_LETTER`

Evidence:

```text
AE → F
CG → J
```

Pilot context:

```text
SUM_TO_ORDINARY_POSITION_LETTER
```

Constraints:

- raw sum must lie in `1..26`;
- modulo reduction is not admitted;
- every input letter contributes;
- source-target evidence must reject a simple shift, midpoint, or difference rule.

### C. `MIXED_TOKEN_INDEPENDENT_TRANSFORM`

Evidence:

```text
P21 → J28
G19 → A26
```

Pilot contexts:

- fixed forward/backward letter shift;
- fixed whole-number addition/subtraction;
- both operations nonzero and bounded.

Multiplication/division and opposite-letter contexts remain unsourced.

### D. `MIXED_CLUSTER_NUMBER_SHARED_DELTA`

Evidence:

```text
PL36 → UQ41
MI49 → RN54
```

Pilot contexts:

- one nonzero signed delta applied uniformly to every cluster letter;
- the same signed delta applied to the whole number;
- bounded cluster length;
- whole-number arithmetic only.

This authority must reject:

- different deltas on different letters;
- independent letter and number deltas;
- arbitrary CP-006 compositions;
- digit operations.

### E. `MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR`

Evidence:

```text
21I → 22P
13P → 14Y
```

Pilot context:

```text
number step +1
attached letter = square(digit sum of number), rendered as A=1..Z=26
```

Constraints:

- input and output square values must lie in `1..26`;
- attached input letter must already satisfy the invariant;
- output letter must be recomputed, not independently shifted;
- source and target letters must differ to avoid a decorative letter.

## 4. Candidate authorities requiring more evidence

### Letter-group absolute difference or gap

Potential rules:

```text
|pos(A) − pos(B)|
letters strictly between A and B
inclusive alphabet distance
```

Risk: off-by-one collision. No permanent context without recurring readable examples.

### Reverse-position aggregates

Potential rules:

```text
reverse-position sum
ordinary + reverse position
product of reverse positions
```

Risk: constant and opposite-pair collapse.

### Number-to-letter transparent analogy

Potential rules:

```text
1 → A
1 → Z
n±k → letter
```

Risk: direct overlap with Coding-Decoding.

### Letter-driven numeric update

Potential forms:

```text
output number = input number + position(letter)
output number = input number − sum(letter positions)
```

Risk: unrestricted equation fitting.

### Number-driven letter movement

Potential forms:

```text
output letter = input letter shifted by displayed number
```

Risk: Coding-Decoding overlap and one-pair ambiguity.

### Other coupled invariants

Potential forms:

```text
position(letter) + number = constant
letter distance = numeric difference
```

Risk: several invariants can fit one source pair.

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
| pair-index-dependent mixed vector progression | CP-009 | relation evolves across multiple evidence pairs |

## 6. Collision risks discovered

### Sum versus product

Examples must activate distinct outputs across complete evidence. Avoid pairs where low positions make the rules coincide.

### Scalar output versus derived-letter output

They share arithmetic but differ in answer shape and student task. Shared foundation code does not imply one QL.

### Independent versus shared-delta transform

A cluster question is shared-delta only when every letter and the whole number use exactly the same signed amount. Otherwise it belongs to the independent/composite family or remains excluded.

### Independent versus coupled transform

A displayed output may be explained by two independent changes or by a coupled invariant. Accept only when complete evidence uniquely supports one interpretation.

### Whole-number versus digit operations

Whole-number arithmetic remains the default. Digit splitting is admitted only in explicitly registered source-backed profiles such as the digit-sum-square successor.

### Pair-local versus cross-pair progression

A rule that changes with evidence-pair index is not a normal CP-008 transfer rule. It is delegated to CP-009.

### Mixed analogy versus coding

```text
A : B :: C : ?     → analogy transfer
If A is coded as B → coding-decoding
```

Shared alphabet functions belong in foundations; QL ownership follows task grammar.

## 7. Pilot status

The expanded non-QL pilot contains:

```text
Source-backed provisional authorities: 5
Provisional contexts: 60
Readable source fixtures: 6
Typed token shapes: 6
Advanced/meta source pattern delegated to CP-009: 1
Permanent QL count: OPEN
Permanent solve-mode count: OPEN
```

Every context must retain:

- at least 40 unambiguous source-target pairs;
- zero solver disagreements;
- four unique options with one correct answer.

## 8. Remaining source actions

1. recover the uploaded audited ANA-CP-008 manifest when File Library retrieval is restored;
2. inspect uploaded reasoning books for the unresolved candidate families;
3. search official/past-paper examples for reverse-position, number-to-letter, and other coupled rules;
4. audit direct completion, pair selection, inverse, and incorrect-pair task contracts;
5. compare the saturated family set against the 16-QL reservation;
6. freeze QLs only after no meaningful source-backed mode remains uncovered.
