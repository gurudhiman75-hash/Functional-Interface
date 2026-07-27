# ANA-CP-005 Implementation Plan

Status: canonical manifest realignment in progress on `feat/reasoning-ana-cp005-manifest-realignment`.

## Scope

- Checkpoint: `ANA-CP-005`
- QL range: `ANA-QL-141` through `ANA-QL-160`
- Total QLs: 20
- Student skill: single-letter alphabet analogy
- Task kind: `singleLetterTransform`
- Solve mode: `ALPHABET_RULE`
- Presentation modes: `DIRECT_COMPLETION`, `PAIR_SELECTION`
- Renderer: `STRUCTURED_TEXT`
- Locale mode: `TRANSLATABLE`
- Runtime languages: English, Hindi, Punjabi
- Multi-letter clusters: reserved for `ANA-CP-006`
- Figure analogy: excluded from ANA-001

## Canonical QL allocation

| QL IDs | Rule ID | Operational relationship |
|---|---|---|
| `141/142` | `ALPHA_FIXED_SHIFT_FORWARD` | fixed forward movement without crossing Z |
| `143/144` | `ALPHA_FIXED_SHIFT_BACKWARD` | fixed backward movement without crossing A |
| `145/146` | `ALPHA_CYCLIC_SHIFT_FORWARD` | fixed forward movement with mandatory wrap after Z |
| `147/148` | `ALPHA_CYCLIC_SHIFT_BACKWARD` | fixed backward movement with mandatory wrap before A |
| `149/150` | `ALPHA_OPPOSITE` | positions sum to 27 |
| `151/152` | `ALPHA_EQUAL_DISTANCE` | equal movement toward the alphabet centre, with both direction branches evidenced |
| `153/154` | `ALPHA_REVERSE_POSITION` | opposite/reverse-position letter followed by one fixed bounded adjustment |
| `155/156` | `ALPHA_DOUBLED_MOVEMENT` | output position is twice the input position |
| `157/158` | `ALPHA_CLASS_CORRESPONDENCE` | vowels and selected consonants correspond by ordinal position within their classes |
| `159/160` | `ALPHA_TWO_STEP_POSITION` | double the position, then add or subtract one |

Odd-numbered QLs use direct completion. Even-numbered QLs use equivalent-pair selection.

## Why the realignment is required

The first merged CP-005 runtime used ten internally coherent families, but several did not match the audited ANA-001 manifest. Half-position, rounded-half and opposite-of-double families were therefore removed from this checkpoint. Existing QL IDs remain unchanged; their implementation is being corrected to the previously audited ownership contract.

## Rule-domain decisions

- Fixed shifts use magnitudes `1..6` and reject boundary crossing.
- Cyclic shifts use magnitudes `2..6` and require boundary crossing, so they cannot collapse into fixed-shift questions.
- Equal-distance instances show one input from each half of the alphabet. This activates both forward and backward branches and prevents the rule from reducing to a uniform shift.
- Reverse-position offsets are `-4..-1` or `1..4`; zero is excluded because plain opposite letters have their own family.
- Doubled-position inputs are bounded so the result remains in `A..Z`.
- Class correspondence uses the ordered lists `A,E,I,O,U` and `B,C,D,F,G` in either direction.
- Two-step position uses `2p-1` or `2p+1` on a safe non-identity domain.
- Every rule application is total: an ineligible input returns `null` rather than throwing during ambiguity discovery.

## Ambiguity policy

A candidate is accepted only when:

- the intended rule and full context solve both displayed pairs;
- no equal-or-simpler registered rule solves the same evidence;
- context parameters remain unchanged across source and target;
- equal-distance evidence activates both direction branches;
- cyclic evidence actually crosses the alphabet boundary;
- exactly one option is valid under the intended rule;
- every distractor has a machine-readable error label.

The registry collision audit compares only letters on which both rule contexts produce a real output. Two `null` values outside their domains are not treated as a mapping collision.

## Presentation and explanation contract

Direct-completion questions support inline, arrow, table and boxed-pair layouts. Pair-selection questions use the same four visual treatments for the source relation.

Every explanation must:

- state the rule without exposing an internal ID;
- show source and target application separately;
- include exact positional arithmetic where useful;
- show `raw - 26` or `raw + 26` for cyclic wrap cases;
- state the selected distance, offset or two-step adjustment;
- explain class ordinal correspondence for vowel/consonant questions;
- reject the closest direction, off-by-one or no-wrap trap.

Hindi and Punjabi must preserve numerical evidence and answer parity. Localized review exports include the same trap-note block as English.

## Test contract

The English audit verifies:

- exact manifest rule sequence and QL continuity;
- canonical task kind, solve mode and presentation modes;
- deterministic generation across 1,600 questions;
- full-context independent solving;
- no complete rule collisions;
- equal-or-simpler ambiguity rejection;
- fixed versus cyclic boundary ownership;
- equal-distance branch activation;
- four unique options and exactly one answer;
- layout, difficulty, answer-position and stem-variety coverage.

The localized audit verifies 1,600 Hindi/Punjabi questions for structural parity, script presence, wrap arithmetic, terminology restrictions, trap-note presence and balanced answer positions.

## Merge gate

Do not merge the realignment until both runtime audits pass in a checked-out repository and all three regenerated review files have been inspected.
