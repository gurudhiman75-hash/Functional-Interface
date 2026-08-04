# RNK-CP-004 — Exam-Readiness Remediation

Status: **English Remodel V2 implemented; manual review and source expansion pending**.

Basis: `RNK-CP004-REMODEL-V1-CRITICAL-REVIEW.md` confirmed that Remodel V1 was mathematically reliable but still forced every question through the same visible six-section explanation shell.

## V2 design principle

```text
store proof data structurally
  -> select the smallest useful teaching mode
  -> render only the reasoning needed for this question
  -> retain deeper validator evidence for administrators
```

Templates now organize internal reasoning. They no longer force `Mental picture`, `Key rule`, `Step-by-step solution`, `Exam-speed shortcut`, `Option analysis`, and `Answer` onto every learner explanation.

## Seven adaptive explanation modes

```text
ENDPOINT_MINIMAL       highest or lowest
POSITION_LINE          exact rank, named rank or middle
PAIR_PATH              shortest decisive path for a named pair
NEIGHBOUR_HIGHLIGHT    local segment around the target
OPTION_CONTRADICTION   full-order option validation
TRANSITIVE_PROOF       direct/indirect conclusion proof
BLOCK_BRIDGE           join partial blocks uniquely
```

Endpoint questions normally render one chain and one conclusion. Detailed wrong-option analysis is retained only for complete-order and block-bridge questions, where it materially teaches the task.

## Conceptual corrections

### Conclusions

The false V1 rule that a conclusion must not repeat a clue was removed.

The learner rule is now:

```text
a conclusion may follow directly from one clue
or indirectly through a valid comparison path
```

The current reviewed conclusion surface explicitly asks which conclusion is derived from two or more statements, so its keyed answer remains intentionally transitive.

### Relative order

The repeated dead options `same rank` and `cannot be determined` were removed from strict unique-order questions.

All four choices now describe the requested pair using direction and positional distance. The correct pair remains indirect and is not copied from a displayed clue.

### Immediate neighbour

The target person is never offered as their own neighbour. Wrong options come from the opposite adjacent side or from entities two or more positions away. Their explanations state actual distance and direction instead of inventing a top/bottom counting mistake.

### Missing comparison

Exact topological-order counts remain in validator metadata, but learner explanations use the simpler exam method:

```text
identify fixed blocks
  -> connect the open end of the upper block
     to the open start of the lower block
  -> read the unique final chain
```

Wrong options explain contradiction or continuing block ambiguity without asking students to enumerate permutations.

## Pool-quality controls

The V2 review pack is selected under these gates:

- 60 unique stable identities;
- 60 unique seeds rather than six reused seeds across prototypes;
- zero normalized semantic duplicates;
- normalized fingerprints include anonymized clue topology, query contract and option-role layout;
- balanced answer positions: `15 / 15 / 15 / 15`;
- no repeated four-answer sequence;
- controlled clue redundancy;
- feature-derived difficulty;
- Easy, Medium and Hard reachability.

The normalized duplicate previously identified between Questions 28 and 30 cannot survive the V2 review-pack selector.

## Reasoning-feature metadata

Each reviewed record exposes:

```text
entityCount
essentialClueCount
redundantClueCount
shortestProofClueCount
disconnectedBlockCount
featureScore
```

Difficulty is derived from these features plus the query burden. More words or clues alone do not establish difficulty.

## Executable evidence

```text
runtime questions:                    2,400
review questions:                        60
adaptive explanation modes:               7
average visible explanation words:     34.73
unique review seeds:                      60
normalized semantic duplicates:            0
pair dead distractors:                      0
self-neighbour distractors:                 0
student permutation counts exposed:         0
```

The executable gate also proves answer correctness, unique-order safety, conclusion single-answer safety, block-bridge sufficiency, lifecycle locks and compatibility with frozen CP-001 through CP-003.

## Current state

```text
provisional prototypes:              10
permanent QLs allocated:              0
next available RNK identity: RNK-QL-027
English manual approval:         pending
source/inverse expansion:        pending
merge/split consolidation:       blocked
Question Studio:                disabled
Question Bank:              NOT_STORED
test eligibility:            INELIGIBLE
public publication:              false
```

Remodel V2 remains a manual-review candidate, not a discovery freeze or permanent QL allocation.
