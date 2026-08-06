# CLS-CP-001 — Instance Difficulty and Editorial Remediation

Status: `EXECUTABLE_DISCOVERY_WAVE_2_REMEDIATED`

Validated implementation head before this report commit:

```text
005e925678680cf8890768ebb26aee7f31c26175
```

This report records the correction of two defects found during manual review of the hierarchy-aware semantic Classification corpus:

1. difficulty was being assigned partly from prototype identity and seed rather than from the generated question;
2. explanations contained technically accurate but administrator-shaped language instead of natural teacher language.

No permanent QL is allocated by this remediation.

---

## 1. Difficulty defect removed

The superseded behaviour used prototype and seed branches such as:

```text
hierarchy prototype -> usually HARD
seed divisible by a fixed number -> alternate level
```

That could label a visibly simple question as difficult merely because of its seed. This contradicted the Reasoning V1 requirement that difficulty arise from the generated instance.

The runtime now uses:

```text
CLS-CP001-INSTANCE-DIFFICULTY-v1
```

### Generated-instance features

Each question records:

- intended-class hierarchy depth;
- whether every displayed item shares a broader parent class;
- number of displayed items with direct multi-membership;
- number of source-admitted candidate rules;
- whether the task is inverse class-member selection;
- whether the intended rule is cross-cutting;
- semantic demand of the class family;
- final numerical score.

### Score contract

```text
score =
  min(2, hierarchy depth)
  + 1 if every relevant item shares an intended parent class
  + 1 or 2 for direct multi-membership density
  + 1 if more than one candidate rule must be considered
  + 1 for inverse member selection
  + 2 for cross-cutting classification
  + semantic demand (0, 1 or 2)
```

Public levels:

```text
0–1  -> EASY
2–4  -> MEDIUM
5+   -> HARD
```

The score is derived after the valid state, answer and ambiguity audit exist. Seed does not enter the difficulty calculation.

---

## 2. Independent difficulty proof

The main prototype audit independently reconstructs every difficulty feature from:

- displayed options;
- supplied class members;
- registered semantic memberships;
- class hierarchy;
- ambiguity-support records;
- task direction.

It then recomputes the score and expected public level without calling the runtime's difficulty function.

Exact executable matrix:

```text
7 prototypes × 200 seeds = 1,400 questions
```

Results:

```text
EASY    57
MEDIUM  1,024
HARD    319
```

Score and difficulty are therefore properties of the generated state, not fixed percentages or prototype labels.

Examples of the intended behaviour:

- direct river-versus-mountain classification may remain easy;
- food subclasses sharing the broad parent `food items` become medium;
- functional and part/whole reasoning become medium through semantic demand;
- citrus/tropical hierarchy with multiple candidate rules can become hard;
- cross-cutting animal classification is hard;
- inverse hierarchy-member selection varies with actual class depth and competing evidence.

---

## 3. Editorial defect removed

The following learner-facing phrases are now prohibited:

```text
bounded competing-class audit
resolved class
admitted class
quality level
quality rank
hierarchy depth
winning class
candidate rule
support count
classification audit
```

They have been replaced with question-specific teacher language.

### Outlier explanation flow

```text
name the three matching options
-> name their exact common group
-> explain any broader group only when relevant
-> name the outlier
-> state naturally whether another grouping changes the answer
```

Example structure:

```text
Orange, Lemon and Lime are citrus fruits.
All four items are food items, but only those three are citrus fruits.
Carrot is therefore the odd one out.
No other relevant grouping points to a different option.
```

### Class-member explanation flow

```text
name the supplied members
-> identify their most specific shared group
-> explain why a broader group is insufficient when relevant
-> name the only joining option
-> check every option against the exact group
```

Internal solver terms remain available in structured metadata but cannot appear in learner text.

---

## 4. Editorial regression proof

A dedicated audit now generates:

```text
7 prototypes × 120 seeds = 840 questions
```

It proves:

- zero forbidden technical phrases;
- every explanation names the answer;
- every outlier explanation names all three matching options;
- every class-member explanation names all supplied members;
- every option check names its own option and tested class;
- 840 unique question-specific explanation traces;
- all three difficulty levels appear;
- score values span 0 through 8;
- all 120 cross-cutting audit states are hard from their features, not their seed.

Audit distribution:

```text
EASY    30
MEDIUM  621
HARD    189
```

---

## 5. Adversarial ambiguity proof retained

The remediation preserves the earlier adversarial outcomes:

### Narrower class wins

```text
Orange, Lemon, Lime, Carrot
-> citrus fruits identifies Carrot
-> broad food membership covers all four
-> UNIQUE
```

### Equal competing rules disagree

```text
Whale, Dolphin, Duck, Bat
-> mammals identify Duck
-> aquatic animals identify Bat
-> AMBIGUOUS and rejected
```

### Broad class gives no answer

```text
Apple, Carrot, Wheat, Cumin
-> all are food items
-> no admitted source class supports exactly three
-> NO_VALID_RULE and rejected
```

The hierarchy/ambiguity audit also generates 900 challenge questions across the three advanced discovery controls.

---

## 6. Review corpus

The hosted review corpus contains:

```text
7 prototypes × 16 samples = 112 questions
```

It includes:

- JSON structured records;
- Markdown human review;
- answer and intended class;
- ambiguity result;
- generated difficulty level;
- complete difficulty features and score;
- teacher explanation;
- option-by-option checks;
- shortcut and trap notes.

Review result at the validated implementation head:

```text
112 unique displayed questions
0 technical learner-text leaks
0 answer or solver disagreement
0 ambiguous admitted states
```

Artifact from workflow `30357006764`:

```text
artifact ID  8687217214
digest       sha256:4ef98acfc4e19f079af2027b83e96d8f30e0e45ed5c2b2b102a3f2ebd79a6d3d
```

---

## 7. Current merge/split authority

The remediation does not change the wave-2 merge/split result.

Seven temporary controls still support only two provisional student tasks:

```text
FIND_SEMANTIC_OUTLIER_FROM_FOUR
SELECT_MEMBER_OF_SHARED_SEMANTIC_CLASS
```

Taxonomic domain, primary function, part/whole, hierarchy depth, cross-cutting membership and difficulty remain generated-instance properties. They do not justify separate permanent QLs by themselves.

---

## 8. Remaining safeguards before allocation

Permanent allocation remains blocked pending:

- larger source saturation;
- class-member recurrence audit;
- global semantic-rule-universe audit across all CP-001 class families;
- fact and polysemy review;
- CP-001 versus semantic-pair CP-002 boundary closure;
- Hindi and Punjabi dataset design;
- final source, inverse, representation and no-new-contract gap decisions;
- explicit product-owner approval.

Current safety state:

```text
Permanent QLs:             0
Frozen solve modes:        0
Temporary prototypes:      7
Question Studio:           disabled
Question Bank:             disabled
Test eligibility:          disabled
Public publication:        disabled
```
