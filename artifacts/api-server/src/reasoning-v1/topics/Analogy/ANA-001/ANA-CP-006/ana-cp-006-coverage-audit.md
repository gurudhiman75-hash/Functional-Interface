# ANA-CP-006 Coverage Saturation Audit

Status: **DESIGN SATURATED — implementation may begin**.

## 1. Scope

ANA-CP-006 covers deterministic, language-neutral analogy transformations over uppercase English letter clusters.

- Revised QL range: `ANA-QL-161..ANA-QL-208`
- QL count: 48
- Rule families: 24
- Presentation modes per family: 2
- Task kind: `letterClusterTransform`
- Solve mode: `CLUSTER_RULE`
- Answer type: `LETTER_CLUSTER` or `LETTER_CLUSTER_PAIR` according to presentation
- Locale mode: `TRANSLATABLE`
- Renderer: `STRUCTURED_TEXT`

Every odd-numbered QL is `DIRECT_COMPLETION`. Every even-numbered QL is `PAIR_SELECTION`.

## 2. Source-backed coverage finding

The original 20-family allocation covered character shifts, reverse/opposite transforms, common rotations, selected positional transforms, and length-changing operations. It did not own several recurring SSC/RRB/DSSSB patterns:

- exchange equal outer blocks around a centre;
- reverse each half/outer block independently;
- regroup odd/even source positions;
- alphabetically sort a cluster.

Those patterns are now explicit families rather than being hidden inside an unrestricted mixed-rule bucket.

## 3. Saturated family inventory

| QLs | Rule ID | Operational definition | Primary trap boundary |
|---|---|---|---|
| 161/162 | `CLUSTER_UNIFORM_SHIFT_FORWARD` | shift every letter forward by one fixed cyclic amount | backward/off-by-one/opposite |
| 163/164 | `CLUSTER_UNIFORM_SHIFT_BACKWARD` | shift every letter backward by one fixed cyclic amount | forward/off-by-one/opposite |
| 165/166 | `CLUSTER_POSITIONAL_FIXED_SHIFTS` | apply one non-degenerate fixed shift vector by position | uniform/alternating/progressive vector |
| 167/168 | `CLUSTER_ALTERNATING_SIGN_SHIFT` | alternate `+k,-k` or `-k,+k` | same sign/reversed phase/wrong magnitude |
| 169/170 | `CLUSTER_INCREASING_SHIFT` | shift magnitudes increase by one across positions, with fixed sign | fixed/decreasing/off-by-one start |
| 171/172 | `CLUSTER_DECREASING_SHIFT` | positive magnitudes decrease by one across positions, with fixed sign | fixed/increasing/off-by-one start |
| 173/174 | `CLUSTER_REVERSE` | reverse complete character order | first-last swap/half reversal |
| 175/176 | `CLUSTER_ADJACENT_PAIR_SWAP` | swap positions `(1,2)`, `(3,4)`, etc.; preserve final odd character | rotation/whole reverse/one missed pair |
| 177/178 | `CLUSTER_FIRST_LAST_SWAP` | exchange only first and last characters | whole reverse/adjacent swap |
| 179/180 | `CLUSTER_ROTATE_LEFT` | cyclically rotate left by a bounded small count | right rotation/wrong count |
| 181/182 | `CLUSTER_ROTATE_RIGHT` | cyclically rotate right by a bounded small count | left rotation/wrong count |
| 183/184 | `CLUSTER_OPPOSITE_SUBSTITUTION` | replace every character with its opposite alphabet letter | reverse order/uniform shift |
| 185/186 | `CLUSTER_ODD_POSITION_TRANSFORM` | transform odd source positions and preserve even positions | even-position transform/all-position transform |
| 187/188 | `CLUSTER_EVEN_POSITION_TRANSFORM` | transform even source positions and preserve odd positions | odd-position transform/all-position transform |
| 189/190 | `CLUSTER_REVERSE_THEN_SHIFT` | reverse, then apply a non-palindromic positional shift vector | shift-then-reverse/whole reverse only |
| 191/192 | `CLUSTER_SHIFT_THEN_REVERSE` | apply the same non-palindromic positional vector to original positions, then reverse | reverse-then-shift/shift only |
| 193/194 | `CLUSTER_DELETE_POSITION` | delete one position selected by a bounded named index rule | neighbouring deletion/no deletion |
| 195/196 | `CLUSTER_INSERT_DERIVED_LETTER` | derive one letter by a named rule and insert it at a named position | wrong derivation/wrong insertion point |
| 197/198 | `CLUSTER_NEIGHBOUR_EXPANSION` | expand each selected letter into its alphabet neighbours under a named order | one-sided expansion/wrong neighbour order |
| 199/200 | `CLUSTER_TWO_STAGE_MIXED` | apply one whitelisted composition of two existing transforms | partial transform/reversed operation order |
| 201/202 | `CLUSTER_HALF_BLOCK_SWAP` | exchange equal outer blocks; preserve a centre character for odd lengths | rotation/reverse-each-block |
| 203/204 | `CLUSTER_REVERSE_EACH_BLOCK` | reverse each equal half/outer block independently; preserve centre if present | whole reverse/half swap |
| 205/206 | `CLUSTER_PARITY_REGROUP` | regroup source characters by odd/even indices using a whitelisted direction profile | parity order reversed/whole reverse |
| 207/208 | `CLUSTER_ALPHABETICAL_SORT` | arrange cluster letters in ascending or descending alphabet order | reverse input/order direction/near-sort |

## 4. Rule-domain contracts

### 4.1 Cluster alphabet and length

- Runtime clusters use uppercase `A..Z`.
- Core same-length families use input lengths `3..8`.
- Pair/block families impose stronger minimum lengths where necessary.
- Repeated letters are allowed only where they do not collapse the intended order transform.
- Alphabetic-sort instances require enough distinct positions to expose the sort; already sorted and reverse-sorted identity cases are rejected.

### 4.2 Shift behavior

- Character shifts are cyclic over `A..Z`.
- A shift context is fixed across source and target evidence.
- Position vectors are explicit metadata, not inferred from rendered strings after generation.
- `CLUSTER_POSITIONAL_FIXED_SHIFTS` must reject vectors that are uniform, alternating-sign, monotonic `±1` progressions, odd-only, or even-only because those patterns have simpler owners.
- Increasing/decreasing families use named arithmetic progressions and must activate at least three different magnitudes.

### 4.3 Rotation separation

For a cluster of length `n`, allowed rotation counts are bounded to avoid left/right duplicate contexts:

- left contexts use `1..floor((n-1)/2)`;
- right contexts use `1..floor((n-1)/2)`.

Length two is excluded. A rotation that reproduces another named permutation on a generated cluster is rejected by ambiguity checks.

### 4.4 Block operations

- Even length: split into equal halves.
- Odd length: split into equal outer blocks and preserve the centre character.
- Half-block swap preserves each block internally.
- Reverse-each-block preserves block placement but reverses each block internally.
- Degenerate clusters that make these outputs identical are rejected.

### 4.5 Parity regrouping

Allowed profiles are explicit and finite:

- odd positions forward, then even positions forward;
- even positions forward, then odd positions forward;
- odd positions forward, then even positions reverse;
- even positions forward, then odd positions reverse;
- odd positions reverse, then even positions forward;
- even positions reverse, then odd positions forward.

Profiles that collapse to whole reversal, rotation, adjacent-pair exchange, or identity for the chosen length/cluster are rejected.

### 4.6 Alphabetical sorting

Allowed directions:

- ascending `A→Z`;
- descending `Z→A`.

Sorting is character-based and language-neutral. It belongs to CP-006 even when a source happens to form a meaningful word. Semantic or dictionary meaning is not used.

### 4.7 Length-changing operations

`CLUSTER_DELETE_POSITION` supports named index rules only:

- first;
- last;
- second;
- penultimate;
- middle for odd lengths;
- left-middle or right-middle for even lengths.

`CLUSTER_INSERT_DERIVED_LETTER` supports whitelisted derivations such as:

- alphabet successor of the first letter;
- alphabet predecessor of the last letter;
- opposite of the middle/left-middle letter;
- cyclic midpoint of first and last where the midpoint is integral and unique.

Insertion positions are named and bounded. Arbitrary inserted constants are prohibited.

`CLUSTER_NEIGHBOUR_EXPANSION` uses explicit previous/next-letter pairs with cyclic boundary handling. The output order and selected source positions are stored in context.

### 4.8 Two-stage mixed rules

The mixed family is not an arbitrary composition engine. Its whitelist may combine only independently registered operations and must exclude combinations already owned by dedicated families.

Initial permitted profiles:

- opposite substitution then rotate left/right;
- adjacent-pair swap then uniform shift;
- first-last swap then opposite substitution;
- odd/even position transform then half-block swap;
- parity regroup then uniform shift.

Every profile has an explicit inverse description, fingerprint, complexity score and trap set.

## 5. Critical collision decisions

### 5.1 Reverse/shift operation order

A uniform character shift commutes with reversal:

```text
reverse(shift(cluster, k)) = shift(reverse(cluster), k)
```

Therefore the two composite manifest families cannot use uniform shift. Both must use the same non-palindromic position vector so the order changes the result.

### 5.2 General position vectors

The general positional-vector rule has lower editorial precedence than named simple patterns. A generated instance is rejected whenever the same vector belongs to:

- uniform shift;
- alternating sign;
- increasing shift;
- decreasing shift;
- odd-only transform;
- even-only transform.

### 5.3 Structural permutations

A structural instance is rejected when its output is also explained by an equal-or-simpler permutation family on both source and target evidence. Examples include accidental equality between a rotation and a half swap caused by repeated letters.

### 5.4 Alphabetic sorting

Sorting instances must not also be explainable as whole reversal, rotation, or one fixed positional vector over both evidence pairs.

## 6. Presentation coverage

### Direct completion

Supported layouts:

- inline analogy: `ABCD : BCDE :: WXYZ : ?`;
- arrows: `ABCD → BCDE :: WXYZ → ?`;
- two-row table;
- boxed pair display.

### Pair selection

One source pair is shown with four candidate cluster pairs. The correct pair must satisfy the complete rule context; no distractor may satisfy any equal-or-simpler registered context when combined with the source evidence.

## 7. Distractor architecture

Every distractor receives a specific error label. Required families include:

- `WRONG_DIRECTION`;
- `OFF_BY_ONE_SHIFT`;
- `UNIFORM_INSTEAD_OF_POSITIONAL`;
- `POSITION_VECTOR_REVERSED`;
- `ALTERNATING_PHASE_REVERSED`;
- `PARTIAL_TRANSFORM`;
- `OPERATION_ORDER_REVERSED`;
- `WRONG_ROTATION_DIRECTION`;
- `WRONG_ROTATION_COUNT`;
- `WRONG_BLOCK_BOUNDARY`;
- `HALF_SWAP_INSTEAD_OF_BLOCK_REVERSE`;
- `PARITY_GROUP_ORDER_REVERSED`;
- `PARITY_INTERNAL_DIRECTION_REVERSED`;
- `ALPHABETICAL_DIRECTION_REVERSED`;
- `NEAR_SORT_SWAP`;
- `WRONG_DELETE_POSITION`;
- `WRONG_INSERT_POSITION`;
- `WRONG_DERIVED_LETTER`;
- `ONE_SIDED_NEIGHBOUR_EXPANSION`.

Generic nearby strings are last-resort fillers and still require independent rejection.

## 8. Explanation contract

Explanations must:

1. state the named relationship naturally;
2. demonstrate the source transformation concisely;
3. apply the same context to the target;
4. show position-by-position movement only where it removes ambiguity;
5. identify one actual selected distractor misconception;
6. avoid internal IDs, “branch framework”, “runtime”, or generator language.

For permutations, explanations should show index order, for example:

```text
GLI | D | ERS → ERS | D | GLI
```

For alphabetic sorting, state the ordered sequence directly rather than discussing semantic word meaning.

## 9. Multilingual contract

The Latin letter clusters remain unchanged across `en-IN`, `hi-IN`, and `pa-IN`. Only instructions, relation statements, explanations and trap notes are localized.

Preferred terminology:

- Hindi: `अक्षर-समूह`, `स्थान`, `क्रम`, `बाएँ`, `दाएँ`, `विषम स्थान`, `सम स्थान`;
- Punjabi: `ਅੱਖਰ-ਸਮੂਹ`, `ਥਾਂ`, `ਕ੍ਰਮ`, `ਖੱਬੇ`, `ਸੱਜੇ`, `ਟਾਂਕ ਥਾਵਾਂ`, `ਜਿਸਤ ਥਾਵਾਂ`.

Localized text must not expose internal rule IDs or mechanically translate implementation terms.

## 10. Difficulty model

Runtime difficulty is computed from five factors:

1. rule complexity;
2. number of transformations;
3. information density;
4. distractor proximity;
5. required inference depth.

Shift magnitude alone cannot make a question hard. Pair selection, inverse-looking permutations, two-stage operations, close structural distractors and length changes raise difficulty more materially.

Target runtime distribution remains approximately 35% Easy, 45% Medium and 20% Hard.

## 11. Saturation verdict

The revised 24-family registry covers the source-backed letter-cluster analogy space without admitting unrestricted arbitrary formula fitting or arbitrary permutations.

Verdict: **DESIGN SATURATED FOR IMPLEMENTATION**.

Freeze remains blocked until runtime collision tests, exhaustive generation audits, localized parity audits and human review all pass.