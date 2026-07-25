# ANA-CP-005 Implementation Plan

Status: implementation started on `feat/reasoning-ana-001-cp005`.

## Scope

- Checkpoint: `ANA-CP-005`
- QL range: `ANA-QL-141` through `ANA-QL-160`
- Total QLs: 20
- Student skill: single-letter alphabet analogy
- Figure content: excluded
- Renderer: `STRUCTURED_TEXT`
- Locale mode: `TRANSLATABLE`
- Runtime languages: English, Hindi, Punjabi

## Design decision

CP-005 covers transformations of single English letters. Multi-letter clusters, per-position shifts, rotations and re-ordering belong to CP-006.

The checkpoint uses ten rule families, each with two presentation modes:

1. missing fourth term;
2. equivalent pair selection.

## QL allocation

| QL IDs | Rule ID | Relationship |
|---|---|---|
| `141/142` | `ALPHA_SHIFT_FORWARD` | move forward by a fixed question-level shift |
| `143/144` | `ALPHA_SHIFT_BACKWARD` | move backward by a fixed question-level shift |
| `145/146` | `ALPHA_OPPOSITE` | use the opposite letter, positions summing to 27 |
| `147/148` | `ALPHA_OPPOSITE_FORWARD` | take the opposite letter, then move forward by a fixed shift |
| `149/150` | `ALPHA_OPPOSITE_BACKWARD` | take the opposite letter, then move backward by a fixed shift |
| `151/152` | `ALPHA_POSITION_DOUBLE` | double the alphabet position within a safe non-wrapping domain |
| `153/154` | `ALPHA_POSITION_DOUBLE_MINUS_ONE` | double the position and subtract one |
| `155/156` | `ALPHA_POSITION_HALF` | halve an even alphabet position |
| `157/158` | `ALPHA_POSITION_HALF_ROUND_UP` | add one to an odd position and halve it |
| `159/160` | `ALPHA_OPPOSITE_OF_DOUBLE` | double the input position, then take the opposite position |

## Ambiguity policy

Alphabet analogy is intrinsically vulnerable to alternate shift explanations. Therefore ambiguity is evaluated over the complete source and target evidence, not the source pair alone.

A candidate is accepted only when:

- the intended rule solves both displayed pairs;
- no equal-or-simpler registered rule with an eligible context solves both pairs;
- the intended context is stable across the complete question;
- exactly one option completes or matches the relation;
- no distractor is valid under the intended rule.

A registry-level collision audit must also compare all rule/context combinations over their eligible domains.

## Parameter domains

- forward/backward shifts: `1..6`, fixed within one question;
- opposite-composite shifts: `1..4`, fixed within one question;
- doubling rules: inputs restricted so results remain in `A..Z` without accidental wrapping;
- half rules: parity-controlled inputs only;
- source and target letters must differ;
- trivial identity mappings are rejected;
- output must remain a single uppercase English letter.

## Runtime architecture

Required files:

- `question-language.en.ts`
- `rule-definitions.ts`
- `independent-solver.ts`
- `ambiguity-checker.ts`
- `option-validator.ts`
- `generator.ts`
- `task-registry.ts`
- `localized-runtime.ts`
- `ana-cp-005.test.ts`
- `ana-cp-005-localized.test.ts`
- `export-review.ts`
- `export-localized-review.ts`
- `ana-cp-005-implementation-report.md`

## Presentation variety

Missing-term questions may use:

- `A : D :: F : ?`
- `A → D; F → ?`
- two-row pair tables
- compact boxed-pair text

Equivalent-pair questions show one source pair and four candidate pairs.

The renderer remains structured text; CP-005 does not depend on SVG.

## Distractor model

Preferred distractor errors:

- wrong direction;
- shift off by one;
- correct shift applied from the opposite letter;
- opposite letter without the final shift;
- position doubled instead of doubled-minus-one;
- floor half instead of rounded-up half;
- nearby letter as a bounded fallback.

Each distractor carries an error label.

## Explanation contract

Every explanation must:

- state the rule naturally;
- show alphabet positions for the source pair;
- apply the same operation to the target letter;
- state the resulting letter;
- mention the selected shift when the rule is parameterized;
- reject the closest trap without exposing internal rule IDs.

## Difficulty

- Easy: direct shifts and opposite letters with familiar positions;
- Medium: composite opposite/shift rules and less central letters;
- Hard: position arithmetic, close distractors and reversed-looking pairs.

Target checkpoint distribution follows the chapter target of approximately 35% easy, 45% medium and 20% hard across runtime samples.

## Test contract

The exhaustive audit will verify:

- exact 20-QL continuous registry;
- deterministic generation;
- four unique options;
- exactly one correct answer;
- independent-solver agreement;
- full-rule-pool ambiguity rejection;
- no complete rule collisions;
- all presentation layouts;
- all difficulty bands;
- answer-position balance;
- bounded generation retries;
- Hindi/Punjabi parity and script checks;
- no internal rule identifiers in student-facing text.

## Implementation order

1. Freeze QL registry and typed rule definitions.
2. Add independent solving and rule/context matching.
3. Add collision and ambiguity audits.
4. Implement deterministic English generation and distractors.
5. Add exhaustive English tests and review export.
6. Add Hindi and Punjabi runtime text.
7. Run localized parity audits and export reviews.
8. Perform editorial review before merge.
