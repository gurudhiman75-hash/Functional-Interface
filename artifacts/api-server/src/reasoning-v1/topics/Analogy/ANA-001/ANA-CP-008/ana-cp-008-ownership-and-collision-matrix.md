# ANA-CP-008 Ownership and Collision Matrix

Status: **design authority; QL allocation remains open**

## 1. Ownership test

For every proposed rule, run these three counterfactuals:

### Remove the numbers

If the relation remains fully solvable from the letters alone, the rule belongs to a letter checkpoint unless the numeric output is the cross-domain answer itself.

### Remove the letters

If the relation remains fully solvable from the numbers alone, the rule belongs to a numeric checkpoint.

### Separate the two domains

If the letter and number operations are independent, the rule may belong to CP-008 as an independent mixed-token transform only when both components are visibly required by the answer.

If one domain determines the other, the rule is coupled and must expose that dependency explicitly.

A question fails CP-008 ownership when one displayed component is decorative.

---

## 2. Cross-check authorities

### CP-005 and CP-006 bridge

For any string-to-string letter component:

- enumerate all matching single-letter or cluster rules;
- reject the mixed instance when the number component adds no new inference;
- for independent mixed transforms, record the delegated CP-005/006 rule ID rather than duplicating its implementation;
- ensure the complete mixed rule still has one unique context.

### Numeric analogy bridge

For number-to-number components:

- use whole-number operations by default;
- check whether the numeric evidence alone uniquely determines the answer;
- reject the mixed instance if letters are unused;
- reuse shared safe-integer arithmetic authorities instead of cloning them.

### CP-007 bridge

Reject or delegate when:

- the input is a meaningful word and its structure is primary;
- the output is the complete word-position sum already owned by CP-007;
- vowel/consonant or repeated-letter structure defines the rule.

### Coding-Decoding bridge

Classify by task grammar and inference:

| Analogy transfer | Coding-Decoding |
|---|---|
| relationship shown as paired evidence | encoding system stated or recovered |
| apply same relation to another term | encode/decode a requested token |
| no hidden substitution table | hidden or explicit code mapping |
| one analogy answer | potentially reusable code system |

Shared alphabet arithmetic belongs in foundation modules. Task ownership belongs to the renderer/QL contract.

### Alphanumeric-series bridge

Reject from CP-008 when the task asks:

- nth position from left/right;
- number of symbols between items;
- rearrangement of a long sequence;
- next term in a sequence rather than pair transfer.

---

## 3. Candidate rule-domain matrix

| Candidate authority | Input shape | Output shape | Admitted contexts | Main collisions | Current status |
|---|---|---|---|---|---|
| letter-group scalar aggregate | `LETTER_GROUP` | `NUMBER` | ordinary-position sum/product | CP-007 word sums; Coding number code | pilot admitted |
| letter-group derived letter | `LETTER_GROUP` | `LETTER` | sum mapped to ordinary position | fixed shifts; midpoint/difference | pilot admitted |
| independent mixed-token transform | `LETTER_NUMBER` | `LETTER_NUMBER` | fixed letter shift + fixed whole-number add/subtract | CP-005 + numeric rule as disconnected operations | pilot admitted |
| cluster-number composite | `CLUSTER_NUMBER` | `CLUSTER_NUMBER` | profile not frozen | CP-006 composition; arbitrary arithmetic | parser pilot only |
| number-to-letter position | `NUMBER` | `LETTER` | ordinary/reverse position | Coding-Decoding | deferred |
| letter-driven number update | `LETTER_NUMBER` | `NUMBER` or mixed | none frozen | arbitrary formula fitting | deferred |
| number-driven letter movement | `LETTER_NUMBER` | `LETTER` or mixed | none frozen | direct coding | deferred |
| coupled invariant | mixed pair/set | mixed | none frozen | multiple invariants | deferred |

---

## 4. Typed token grammar

The pilot should use typed data rather than parse arbitrary rendered strings.

```ts
type MixedToken =
  | { kind: "LETTER"; letter: string }
  | { kind: "LETTER_GROUP"; letters: string }
  | { kind: "NUMBER"; number: number }
  | { kind: "LETTER_NUMBER"; letter: string; number: number }
  | { kind: "CLUSTER_NUMBER"; letters: string; number: number };
```

Rendered forms are derived from typed tokens:

```text
{ letter: "P", number: 21 }       → P21
{ letters: "ZKX", number: 102 }  → ZKX102
```

A parser may accept review fixtures, but generation should construct typed tokens directly.

Validation:

- letters uppercase A–Z;
- nonempty groups;
- bounded group lengths;
- safe integers only;
- no leading-zero ambiguity in rendered numbers;
- canonical rendering round-trip;
- no tokens that can be parsed in two shapes.

---

## 5. Result grammar

```ts
type MixedResult =
  | { kind: "LETTER"; letter: string }
  | { kind: "NUMBER"; number: number }
  | { kind: "LETTER_NUMBER"; letter: string; number: number }
  | { kind: "CLUSTER_NUMBER"; letters: string; number: number };
```

Option equality uses typed canonical keys, never raw display strings.

---

## 6. Context constraints

### Ordinary-position sum

- input length at least two;
- every letter contributes once;
- sum safe and bounded;
- reject meaningful-word inputs owned by CP-007 unless token is explicitly nonlexical.

### Ordinary-position product

- input length normally two or three;
- product safe and bounded for exam-natural options;
- reject cases where sum equals product across all displayed evidence;
- avoid trivial multiplication by one dominating every example.

### Sum-to-letter

- raw sum within `1..26` for the first production profile;
- no modulo/cyclic reduction without source evidence;
- reject when output equals one input letter or a simple fixed shift under complete evidence.

### Independent letter-number transform

- letter movement nonzero and bounded;
- number movement nonzero and bounded;
- both operations fixed across all pairs;
- number treated as a whole number;
- output remains safe and positive;
- reject cases where one component stays unchanged unless source evidence explicitly supports it;
- record delegated component authorities.

### Cluster-number composite

- cluster operation must be one whitelisted CP-006 rule/context;
- numeric operation must be one whitelisted whole-number rule/context;
- both apply in a fixed order;
- profile admitted only after readable source evidence;
- no unrestricted operation pairing.

---

## 7. Operational collision table

| Collision | Example risk | Required rejection |
|---|---|---|
| sum = product | positions 2 and 2 | require distinct letters and complete evidence |
| sum-to-letter = fixed shift | selected pairs accidentally align | run CP-005/006 matcher |
| ordinary = reverse position | central letters M/N | use discriminating source/target values |
| independent = coupled | number change happens to equal letter position | enumerate both authorities |
| number op ignores letters | all options share same number rule | reject decorative letters |
| letter op ignores numbers | number is unchanged or arbitrary | reject decorative number |
| whole-number = digit operation | e.g. `21+7` vs digit sum variants | default whole-number contract and alternate-rule audit |
| coding = analogy | direct position mapping presented as code | classify by task grammar and shared authority |
| composite profiles collide | reverse+shift vs shift+reverse | preserve ordered stages and full evidence |

---

## 8. Option validation

A direct-completion distractor is invalid when it forms:

- another CP-008 rule with the source evidence;
- a pure CP-005/006 relation while preserving the number accidentally;
- a pure numeric relation while ignoring letters;
- a valid Coding-Decoding interpretation of equal simplicity;
- a second correct answer under a different token parse.

For pair selection, validate each complete pair and require exactly one option whose letter and number components both satisfy the intended context.

---

## 9. Pilot acceptance thresholds

Before QL freeze, each admitted authority/context should demonstrate:

- at least 40 valid source-target pairs after all collision checks;
- three validated distractors for at least 95% of attempted accepted pairs;
- zero solver disagreements;
- zero duplicate canonical tokens;
- deterministic generation;
- readable explanations using every displayed component;
- source examples represented as fixtures where rules are fully known.

Composite profiles may use stricter thresholds because their ambiguity surface is larger.

## Current verdict

```text
Typed token grammar: defined
Admitted pilot authorities: 3
Parser-only composite authority: 1
Deferred authorities: 4
Cross-check bridges required: letter, number, CP-007, Coding-Decoding
QL count: OPEN
```
