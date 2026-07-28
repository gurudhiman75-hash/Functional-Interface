# ANA-CP-008 — Mixed Letter–Number Analogy
## End-to-End Design and Saturation Draft

Status: **DESIGN IN PROGRESS — QL AND SOLVE-MODE COUNTS OPEN**

Current manifest reservation: `ANA-QL-223..ANA-QL-238` (16 QLs).

The reservation is not a freeze. It is only a capacity boundary inherited from the CP-007 amendment. The final count must be discovered from source coverage, ownership boundaries, operationally distinct solve contracts, collision audits and runtime yield.

---

## 1. Checkpoint purpose

ANA-CP-008 covers analogy questions in which letters and numbers participate together in one transparent relationship.

Typical forms include:

```text
P21 : J28 :: G19 : ?
AB : 2 :: CD : ?
ZA : 27 :: YB : ?
AE : F :: CG : ?
```

The student must identify the relationship from complete analogy evidence and transfer it to the target.

This checkpoint is not a generic container for every question that visibly contains letters and numbers. A valid CP-008 rule must require cross-domain reasoning or a mixed token whose letter and number components both have a defined role.

---

## 2. Public exam-source evidence

Current competitive-exam preparation sources describe mixed analogy as a distinct letter-and-number category.

Testbook classifies “Letter and Number Based Analogy” as mixed analogy and states that such questions use combinations of letters and numbers, including addition/subtraction and place-value operations. Its worked example `P21 : J28 :: G19 : ?` applies a fixed letter movement and a fixed whole-number movement.

Oliveboard’s July 2026 railway analogy practice includes:

```text
AB : 2 :: CD : ?
ZA : 27 :: YB : ?
```

The first is consistent with multiplying the two ordinary letter positions, while the second is consistent with adding them.

A further source example uses:

```text
AE : F :: CG : ?
```

where the two input letter positions are added and the resulting position is rendered as a letter.

Recent SSC/railway mixed-cluster questions also show longer alphanumeric tokens in which a letter cluster and a whole number are transformed together. These questions establish a real composite family beyond simple letter-pair arithmetic, but exact permanent families must be derived from readable rule evidence rather than image-only answer pages.

---

## 3. Core ownership rule

A CP-008 question must satisfy at least one of the following:

1. **Cross-domain output:** letters are converted into a scalar number or a scalar number is converted into a letter under a transparent analogy rule.
2. **Mixed-token transfer:** each displayed term contains both letters and a number, and both components undergo a fixed relationship.
3. **Coupled relation:** the numeric component is derived from or constrained by the letter component, or vice versa.

A visible number beside a letter is not enough. Every displayed component must contribute to the intended relationship.

---

## 4. Excluded ownership

### ANA-CP-005 / ANA-CP-006

Own pure letter transformations:

- fixed/cyclic shifts;
- opposite letters;
- position-dependent movements;
- reversal, rotation and permutation;
- insertion, deletion and sorting;
- cluster composition.

A CP-008 rule may reuse those operations as one component of a mixed token, but it must not create a second authority for the letter operation itself.

### ANA-CP-003 / ANA-CP-004 and numeric analogy authorities

Own pure number-to-number analogies. A pair such as `7 : 56 :: 8 : ?` remains a numeric analogy even if alphabet positions could be invented after the fact.

### ANA-CP-007

Own word-native structure, including complete word alphabet-position sums. CP-008 should not duplicate meaningful-word structural rules merely because their answer is numeric.

### Coding-Decoding

Own tasks whose primary challenge is recovering, applying or reversing a code system.

Examples delegated to Coding-Decoding:

- `LION → 12-9-15-14` as an encoding task;
- unknown letter-number substitution tables;
- common-code-fragment puzzles;
- sentence coding;
- symbol-code recovery;
- explicit “if X is coded as Y, code/decode Z” tasks.

CP-008 may use ordinary or reverse alphabet positions only when the relationship is transparent from an analogy pair and the requested task remains analogy transfer rather than code-system recovery.

### Alphanumeric series

Own sequence-position and arrangement questions over long letter/number/symbol strings. CP-008 is pair-relation reasoning, not series navigation.

---

## 5. Candidate authority buckets

The following are candidate solve authorities. Their inclusion and subdivision remain provisional.

### A. Letter group to scalar number

A letter pair or cluster maps to one number through a bounded aggregate.

Source-backed contexts:

- sum of ordinary positions;
- product of ordinary positions.

Contexts requiring further recurring evidence:

- absolute difference;
- inclusive/exclusive gap;
- sum of reverse positions;
- product plus/minus a bounded constant;
- average or midpoint.

Arbitrary equations are prohibited.

### B. Letter group to derived letter

The positions of two or more input letters are combined, then converted back to a letter.

Source-backed context:

- sum of positions mapped back to a letter where the result is within `1..26`.

Potential contexts requiring proof:

- absolute difference mapped to a letter;
- midpoint mapped to a letter;
- cyclic reduction of sums greater than 26.

### C. Scalar number to letter

A number maps transparently to a letter.

Candidate contexts:

- ordinary position (`1→A`, `26→Z`);
- reverse position (`1→Z`, `26→A`);
- bounded number adjustment followed by ordinary/reverse position.

This family must be distinguished from a direct coding prompt.

### D. Independent mixed-token transformation

Each term contains a letter component and a whole-number component. The letter component follows one fixed rule while the number follows one fixed whole-number operation.

Source-backed example:

```text
P21 : J28
```

where the letter moves backward by a fixed amount and the number increases by a fixed amount.

Candidate numeric contexts:

- add/subtract a fixed constant;
- multiply/divide by a fixed integer where all results remain integral;
- bounded affine transform.

The number must be treated as a whole number unless the source explicitly permits digit operations.

### E. Coupled letter-driven number transform

The output number depends on alphabet information extracted from the letter component.

Candidate forms:

- input number plus/minus the position of a named letter;
- input number plus the sum/product of a letter pair;
- output number equals a bounded function of the transformed letters.

This authority is not admitted until recurring readable source examples establish the exact domains.

### F. Number-driven letter transform

The numeric component determines the letter movement.

Candidate forms:

- move the letter forward/backward by the displayed number;
- use a bounded remainder of the number as the movement;
- choose ordinary versus opposite letter based on a numeric property.

This family has a high collision risk with Coding-Decoding and requires strong source evidence.

### G. Coupled invariant mixed pair

A mixed token satisfies one invariant that must hold across complete pairs.

Candidate examples:

- letter positions plus the displayed number equal a fixed total;
- the difference between letter positions equals a numeric component;
- transformed letter distance and numeric change are linked.

The invariant must use every displayed component and remain identical across all shown evidence.

### H. Multi-letter-cluster plus whole-number composite

A letter cluster and a whole number each undergo named operations in the same order.

This is supported by modern mixed-cluster exam forms, but permanent profiles require readable source rules and collision tests against CP-006 compositions.

---

## 6. Presentation contracts

Every admitted authority must be audited for materially distinct tasks.

### Direct completion

```text
SOURCE : TRANSFORMED_SOURCE :: TARGET : ?
```

The answer may be:

- a number;
- a letter;
- a mixed letter-number token;
- a letter-cluster-number token.

### Pair selection

```text
Select the mixed pair that follows the same complete relationship.
```

The correct option must satisfy both domains. Distractors should preserve one component while breaking the other.

### Additional tasks

The following are not automatically admitted:

- identify the incorrect pair;
- recover the original mixed token;
- select the verbal rule description;
- complete two missing components;
- choose an equivalent three-pair set.

They require independent source evidence and an overlap audit against ANA-CP-009 advanced/meta analogy.

---

## 7. Rule architecture

A permanent mixed rule must expose:

```ts
interface MixedAnalogyRule {
  ruleId: string;
  inputShape: string;
  outputShape: string;
  contexts: readonly MixedRuleContext[];
  apply(input: MixedToken, context: MixedRuleContext): MixedResult | null;
  accepts(input: MixedToken, context: MixedRuleContext): boolean;
}
```

The runtime must parse mixed tokens into typed components instead of manipulating unvalidated strings.

Example conceptual shapes:

```text
LETTER_PAIR
LETTER_CLUSTER
NUMBER
LETTER_NUMBER_TOKEN
LETTER_CLUSTER_NUMBER_TOKEN
```

All arithmetic must be safe-integer bounded. All letter outputs must be validated against `A..Z`.

---

## 8. Independent solver

The independent solver must not call the generator rule’s own `apply()` function.

It must separately:

1. parse and validate the mixed token shape;
2. calculate ordinary/reverse alphabet positions;
3. apply the bounded numeric operation;
4. apply or delegate the letter operation;
5. reconstruct the expected output shape;
6. compare complete source and target evidence;
7. enumerate every matching CP-008 rule/context;
8. consult CP-003/004/005/006/007 and Coding-Decoding bridges where relevant.

---

## 9. Ambiguity rejection

Reject a question when:

- a pure letter rule explains the evidence without using the number;
- a pure number rule explains the evidence without using the letters;
- two different aggregates produce the same displayed outputs;
- ordinary and reverse positions are indistinguishable in the chosen examples;
- sum and product coincide accidentally;
- the mixed-token rule collapses into two unrelated visible changes with no stable bridge;
- a letter-to-number analogy is equally natural as an encoding problem;
- a distractor forms any registered CP-008, CP-006 or numeric analogy relation;
- more than one option satisfies the complete mixed relationship.

At least two complete mixed pairs are preferred for composite/coupled rules when one pair cannot uniquely establish the operation.

---

## 10. Distractor contracts

Distractors must represent specific student errors, such as:

- `USED_SUM_INSTEAD_OF_PRODUCT`;
- `USED_PRODUCT_INSTEAD_OF_SUM`;
- `USED_REVERSE_POSITION`;
- `USED_ORDINARY_POSITION`;
- `OFF_BY_ONE_POSITION`;
- `SHIFTED_LETTER_CORRECTLY_NUMBER_WRONG`;
- `NUMBER_CORRECT_LETTER_WRONG`;
- `REVERSED_NUMBER_OPERATION`;
- `USED_DIGIT_OPERATION_ON_WHOLE_NUMBER`;
- `IGNORED_LETTER_COMPONENT`;
- `IGNORED_NUMBER_COMPONENT`;
- `BROKE_COUPLED_INVARIANT`;
- `APPLIED_STAGES_IN_WRONG_ORDER`.

Random unrelated mixed tokens are prohibited while a plausible misconception is available.

---

## 11. Explanation contract

Every explanation must:

1. identify the letter positions explicitly;
2. show the source calculation or transformation;
3. show the number operation as a whole-number operation where required;
4. explain how the two domains are connected;
5. apply the same complete rule to the target;
6. state the answer;
7. reject the nearest displayed misconception.

Prohibited student-facing wording includes internal IDs, “context,” “registered family,” “vector,” and implementation terminology.

For composite rules, explanations must use explicit stage markers such as “First” and “Then.”

---

## 12. Locale policy

Letters and mixed tokens remain Latin-script symbols in all interfaces.

- English: English instruction and explanation;
- Hindi: Hindi instruction and explanation, Latin tokens preserved;
- Punjabi: Punjabi instruction and explanation, Latin tokens preserved.

Alphabet positions and arithmetic remain identical across locales.

---

## 13. Freeze gates

CP-008 may be frozen only after:

- the uploaded audited manifest is recovered or formally superseded by a source-backed amendment;
- every candidate authority is classified as admitted, delegated, deferred or excluded;
- all admitted contexts have recurring exam evidence;
- pure-letter, pure-number and coding overlaps are mechanically audited;
- a typed mixed-token parser is specified;
- pilot yield proves unambiguous source-target pairs and four-option sets;
- no meaningful mixed-analogy family remains uncovered;
- final QL and solve-mode counts are derived from distinct student tasks rather than the 16-QL reservation.

## Current verdict

```text
Checkpoint: ANA-CP-008
Reserved range: ANA-QL-223..ANA-QL-238
Reservation count: 16
Permanent QL count: OPEN
Permanent solve-mode count: OPEN
Candidate authority buckets: 8 provisional
Implementation: NOT STARTED
Next action: source saturation and ownership classification
```
