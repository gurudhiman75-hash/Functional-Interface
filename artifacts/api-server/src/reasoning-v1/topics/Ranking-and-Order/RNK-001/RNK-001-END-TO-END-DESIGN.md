# RNK-001 — Ranking and Order: End-to-End Design

Status: **authoritative chapter design; implementation discovery active; permanent QL count open**.

## 1. Product objective

Generate deterministic Ranking and Order questions for SSC, Banking and Punjab state examinations from a valid hidden ordered state.

```text
construct valid ordered entities
  -> derive a controlled evidence view
  -> solve only from displayed evidence
  -> reject inconsistent or non-unique states
  -> build misconception-driven distractors
  -> render natural exam wording and teaching
  -> expose structured review evidence
```

Rank arithmetic is not inferred from a sentence template. The hidden order, normalized evidence and independent solver are authoritative.

## 2. Chapter identity

- family: `REAS-RNK` — relational and positional reasoning;
- package: `RNK-001`;
- primary rule authority: `RANK_TOTAL_ORDER`;
- primary locales: `en-IN`, `hi-IN`, `pa-IN`;
- locale mode: `LANGUAGE_ADAPTED`;
- renderer classes: `TEXT`, `STRUCTURED_TEXT`, and later `TABLE_OR_GRID` for shared sets;
- shared engine: total and partial order engine.

## 3. Scope

Included:

- rank from top/bottom, left/right, front/back or first/last;
- opposite-end rank conversion;
- total count from two-end ranks;
- number before, after, ahead or behind;
- rank recovery from counts before or after;
- two-person rank difference and people-between tasks;
- rank changes after interchange or movement;
- named-entity comparative order;
- tallest/shortest, oldest/youngest, marks, performance and finishing order when ranking is the decisive burden;
- row, queue, merit-list and race-finish presentations;
- partial-order and definite/possible ranking semantics;
- shared-passage ranking sets;
- deterministic rank explanations and compact order diagrams where useful.

Excluded:

- lexicographic construction and dictionary position, owned by Word and Dictionary Order;
- clue-heavy seat placement, adjacency and facing, owned by Seating Arrangement;
- multi-attribute assignment puzzles;
- tournament scoring systems and league-table computation;
- arithmetic-heavy age, marks or speed calculation where ranking is only a final incidental comparison;
- Data Sufficiency answer labels;
- free-form runtime parsing;
- public delivery before separate approval and integration gates.

## 4. Provisional checkpoint ownership

| Checkpoint | Ownership |
|---|---|
| `RNK-CP-001` | One-person rank arithmetic and opposite-end conversion |
| `RNK-CP-002` | Two-person positions, relative offsets and people between |
| `RNK-CP-003` | Interchange, movement, promotion/demotion and changed ranks |
| `RNK-CP-004` | Multi-entity comparison and explicit order reconstruction |
| `RNK-CP-005` | Presentation-led row, queue, merit and finishing-order families |
| `RNK-CP-006` | Attribute-led height, age, marks and performance ranking |
| `RNK-CP-007` | Partial orders, possible/definite answers and uniqueness |
| `RNK-CP-008` | Shared passages, mixed evidence and advanced synthesis |

Checkpoint boundaries must be audited after executable prototypes. No checkpoint or QL count is fixed in advance.

## 5. Canonical order model

The shared order state contains:

```ts
interface OrderedEntity {
  id: string;
  displayName: string;
}

interface TotalOrderState {
  entitiesFromStart: OrderedEntity[];
  context: 'VERTICAL_RANK' | 'HORIZONTAL_ROW' | 'QUEUE' | 'FINISH_ORDER';
}
```

For an order of size `N`, a target at zero-based index `i` has:

```text
rankFromStart = i + 1
rankFromEnd   = N - i
beforeCount   = i
afterCount    = N - i - 1
```

The invariant is:

```text
rankFromStart + rankFromEnd = N + 1
```

The same structural model powers top/bottom, left/right, front/back and first/last wording. Presentation differences do not create separate QLs unless their solver, ambiguity, answer or localisation contract materially differs.

## 6. Partial-order model

Later checkpoints may expose only comparison edges:

```text
A before B
C after A
D between B and E
```

The solver must enumerate or topologically derive all valid orders compatible with the displayed evidence.

A requested answer is:

- `DEFINITE` only when identical in every valid order;
- `POSSIBLE` when true in at least one but not all valid orders;
- `IMPOSSIBLE` when true in none;
- `CANNOT_BE_DETERMINED` when multiple materially different answers remain and no offered broader answer is entailed.

## 7. Validity rules

Reject states containing:

- duplicate entity IDs or duplicate displayed names inside one question;
- total count below the prototype minimum;
- ranks outside `1..N`;
- incompatible two-end ranks;
- negative before/after counts;
- ambiguous target identity;
- contradictory comparison edges;
- cycles in a strict order relation;
- multiple valid answers for a contract requiring one exact answer;
- evidence that reveals the answer without the intended reasoning burden;
- hidden information required to solve the displayed question;
- option collisions after numeric or semantic normalization.

## 8. Solver routes

### Direct total-order projection

Used when the complete hidden order is known to the generator. It calculates exact ranks and counts from the target index.

### Rank-equation solver

Used for direct arithmetic evidence:

```text
opposite rank = total - known rank + 1
total = rank from one end + rank from other end - 1
before = rank from start - 1
after = total - rank from start
rank from start = before + 1
rank from start = total - after
```

### Relative-rank solver

Used for offsets, rank differences and people-between tasks. It normalizes both entities to the same start direction before calculation.

### Transformation replay solver

Used for interchange and movement. It applies the displayed operation to an independently reconstructed order and then re-reads the target ranks.

### Partial-order enumeration

Used for possible, definite and cannot-determine questions. It must be bounded, deterministic and independently checked.

## 9. Candidate query families

Candidate families include:

- rank from the opposite end;
- total number from two-end rank evidence;
- people before or after a target;
- rank from a before/after count;
- second person’s rank from a relative offset;
- people between two positions;
- identify who occupies a stated rank;
- rank after interchange;
- original rank from changed-rank evidence;
- rank after moving forward/backward or left/right;
- determine highest, lowest, nearest rank or exact order;
- validate a rank claim;
- determine whether a conclusion is definite, possible or impossible.

A difference in context, names, direction words, total size or difficulty does not automatically justify a separate QL.

## 10. Answer semantics

```text
RANK
COUNT
RANK_PAIR
ORDERED_ENTITY
ORDERED_ENTITY_LIST
RANK_DIFFERENCE
DEFINITE_POSSIBLE_IMPOSSIBLE
CANNOT_BE_DETERMINED
```

Numeric answers must be positive integers unless a dedicated zero-count contract explicitly permits zero. Ordered lists must preserve canonical entity identity separately from localized display text.

## 11. Distractor architecture

Preferred misconception IDs include:

```text
FORGOT_PLUS_ONE
FORGOT_SHARED_PERSON_SUBTRACTION
SUBTRACTED_SHARED_PERSON_TWICE
COUNTED_TARGET_AS_BEFORE
COUNTED_TARGET_AS_AFTER
USED_SAME_END_RANK
REVERSED_START_AND_END
USED_ABSOLUTE_RANK_DIFFERENCE_AS_BETWEEN_COUNT
FORGOT_TO_SUBTRACT_ONE_BETWEEN
APPLIED_ONLY_ONE_SIDE_OF_INTERCHANGE
MOVED_IN_WRONG_DIRECTION
USED_OLD_RANK_AFTER_MOVEMENT
ASSUMED_UNSTATED_COMPARISON
```

Every displayed wrong option must correspond to a real calculation or inference error in the generated state. Generic random offsets are allowed only as a collision-safe final fallback and must be labelled as such in internal metadata.

## 12. Explanation model

Every learner explanation must contain:

1. a short mental picture of the ordered group;
2. the governing rank rule with variable meanings;
3. substitution using the actual generated values;
4. visible arithmetic with the `+1` or `-1` boundary explained;
5. an exam-speed shortcut;
6. value-specific analysis of every displayed wrong option;
7. a direct conclusion in the requested direction.

For two-person and movement questions, show a compact rank line or before/after order ledger when it materially improves comprehension.

## 13. Localisation

English, Hindi and Punjabi must preserve for the same seed:

- hidden order and entity identity;
- evidence values;
- answer value and correct index;
- misconception ownership;
- mathematical fingerprint;
- difficulty and lifecycle locks.

Localisation must adapt direction vocabulary naturally:

```text
top / bottom
left / right
front / back
first / last
before / after
ahead / behind
```

Literal translation is not sufficient where local exam usage prefers a different construction. Gendered person names must not accidentally change rank semantics.

## 14. Difficulty model

Difficulty derives from generated properties:

- number of rank directions requiring normalization;
- one-person versus multi-person evidence;
- number of transformations;
- whether total count is explicit or inferred;
- distance between distractors and answer;
- number of compatible partial orders;
- information density;
- answer semantic complexity.

Large totals alone do not make a question hard.

## 15. Question Studio metadata

Required structured metadata includes:

```text
chapter/checkpoint/prototype-or-QL
seed and locale
context and direction vocabulary
total count and hidden target index
displayed evidence only
query kind and answer semantic
transformation ledger where applicable
valid-order count for partial-order tasks
misconception IDs
independent solver status
ambiguity status
mathematical fingerprint
editorial and lifecycle status
```

Hidden complete orders remain administrator-only unless the learner explanation deliberately displays a derived order diagram.

## 16. Discovery and freeze policy

Permanent QLs may be allocated only after:

```text
source audit
-> ownership audit
-> executable prototypes
-> independent solver proof
-> ambiguity and edge audit
-> editorial saturation
-> inverse audit
-> merge/split audit
-> chapter-gap audit
-> manual English approval
-> discovery freeze
```

QL and solve-mode totals remain open throughout discovery. A prototype is evidence, not a permanent identity.

## 17. CP-001 first wave

The first executable wave establishes six provisional one-person rank-arithmetic prototypes:

```text
OPPOSITE_END_RANK
TOTAL_FROM_TWO_END_RANKS
COUNT_BEFORE_FROM_RANK
COUNT_AFTER_FROM_TOTAL_AND_RANK
RANK_FROM_COUNT_BEFORE
RANK_FROM_COUNT_AFTER_AND_TOTAL
```

The wave must prove:

- deterministic valid-state-first generation;
- top/bottom, left/right and front/back presentation coverage;
- all arithmetic invariants;
- independent replay;
- unique four-option construction;
- all answer positions;
- Easy, Medium and Hard reachability from state properties;
- natural four-tier English teaching;
- complete release locks.

This first wave creates zero permanent QLs and does not predetermine the final CP-001 inventory.
